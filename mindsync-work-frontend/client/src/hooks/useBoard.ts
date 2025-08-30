import { useState, useEffect, useCallback } from 'react';
import { WorkspaceService } from '../services/workspaceService';
import { webSocketService } from '../services/webSocketService';
import type { Board, BoardItem, Column, CreateItemRequest, WebSocketEvent } from '../types/api';

interface UseBoardOptions {
  enableRealTime?: boolean;
}

interface UseBoardReturn {
  board: Board | null;
  items: BoardItem[];
  loading: boolean;
  error: string | null;
  // Board actions
  updateBoard: (data: Partial<Board>) => Promise<void>;
  deleteBoard: () => Promise<void>;
  // Column actions
  addColumn: (column: Omit<Column, 'id' | 'boardId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateColumn: (columnId: string, data: Partial<Column>) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  reorderColumns: (columnIds: string[]) => Promise<void>;
  // Item actions
  createItem: (data: CreateItemRequest) => Promise<void>;
  updateItem: (itemId: string, data: Partial<BoardItem>) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  updateItemValue: (itemId: string, columnId: string, value: any) => Promise<void>;
  // Bulk actions
  bulkUpdateItems: (itemIds: string[], updates: Record<string, any>) => Promise<void>;
  reorderItems: (itemIds: string[], newOrder: number[]) => Promise<void>;
  // Utils
  refreshBoard: () => Promise<void>;
}

export function useBoard(boardId: string, options: UseBoardOptions = {}): UseBoardReturn {
  const { enableRealTime = true } = options;
  
  const [board, setBoard] = useState<Board | null>(null);
  const [items, setItems] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load board data
  const loadBoard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [boardData, itemsData] = await Promise.all([
        WorkspaceService.getBoard(boardId),
        WorkspaceService.getBoardItems(boardId),
      ]);

      if (!boardData) {
        throw new Error('Board not found');
      }

      setBoard(boardData);
      setItems(itemsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load board');
      console.error('Error loading board:', err);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  // Handle real-time updates
  useEffect(() => {
    if (!enableRealTime || !boardId) return;

    const subscription = webSocketService.subscribe(boardId, (event: WebSocketEvent) => {
      switch (event.type) {
        case 'item_created':
          setItems(prev => [...prev, event.data]);
          break;
          
        case 'item_updated':
          setItems(prev => prev.map(item => 
            item.id === event.data.id ? { ...item, ...event.data } : item
          ));
          break;
          
        case 'item_deleted':
          setItems(prev => prev.filter(item => item.id !== event.data.id));
          break;
          
        case 'column_added':
          setBoard(prev => prev ? {
            ...prev,
            columns: [...prev.columns, event.data]
          } : null);
          break;
          
        case 'column_updated':
          setBoard(prev => prev ? {
            ...prev,
            columns: prev.columns.map(col => 
              col.id === event.data.id ? { ...col, ...event.data } : col
            )
          } : null);
          break;
          
        case 'column_deleted':
          setBoard(prev => prev ? {
            ...prev,
            columns: prev.columns.filter(col => col.id !== event.data.id)
          } : null);
          // Remove values for deleted column
          setItems(prev => prev.map(item => ({
            ...item,
            values: Object.fromEntries(
              Object.entries(item.values).filter(([colId]) => colId !== event.data.id)
            )
          })));
          break;
      }
    });

    // Connect to WebSocket
    const connection = webSocketService.connectToBoard(boardId, {
      onConnect: () => console.log(`Connected to board ${boardId}`),
      onDisconnect: () => console.log(`Disconnected from board ${boardId}`),
      onError: (error) => console.error('WebSocket error:', error),
    });

    return () => {
      subscription.unsubscribe();
      connection.unsubscribe();
    };
  }, [boardId, enableRealTime]);

  // Load board on mount or boardId change
  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  // Board actions
  const updateBoard = useCallback(async (data: Partial<Board>) => {
    try {
      const updatedBoard = await WorkspaceService.updateBoard(boardId, data);
      setBoard(updatedBoard);
    } catch (err: any) {
      setError(err.message || 'Failed to update board');
      throw err;
    }
  }, [boardId]);

  const deleteBoard = useCallback(async () => {
    try {
      await WorkspaceService.deleteBoard(boardId);
      // Board deleted - parent component should handle navigation
    } catch (err: any) {
      setError(err.message || 'Failed to delete board');
      throw err;
    }
  }, [boardId]);

  // Column actions
  const addColumn = useCallback(async (columnData: Omit<Column, 'id' | 'boardId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newColumn = await WorkspaceService.addColumn(boardId, {
        name: columnData.name,
        type: columnData.type,
        config: columnData.config,
        orderIndex: columnData.orderIndex,
      });
      
      setBoard(prev => prev ? {
        ...prev,
        columns: [...prev.columns, newColumn]
      } : null);
    } catch (err: any) {
      setError(err.message || 'Failed to add column');
      throw err;
    }
  }, [boardId]);

  const updateColumn = useCallback(async (columnId: string, data: Partial<Column>) => {
    try {
      const updatedColumn = await WorkspaceService.updateColumn(boardId, columnId, data);
      setBoard(prev => prev ? {
        ...prev,
        columns: prev.columns.map(col => 
          col.id === columnId ? updatedColumn : col
        )
      } : null);
    } catch (err: any) {
      setError(err.message || 'Failed to update column');
      throw err;
    }
  }, [boardId]);

  const deleteColumn = useCallback(async (columnId: string) => {
    try {
      await WorkspaceService.deleteColumn(boardId, columnId);
      setBoard(prev => prev ? {
        ...prev,
        columns: prev.columns.filter(col => col.id !== columnId)
      } : null);
      
      // Remove values for deleted column
      setItems(prev => prev.map(item => ({
        ...item,
        values: Object.fromEntries(
          Object.entries(item.values).filter(([colId]) => colId !== columnId)
        )
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to delete column');
      throw err;
    }
  }, [boardId]);

  const reorderColumns = useCallback(async (columnIds: string[]) => {
    try {
      await WorkspaceService.reorderColumns(boardId, columnIds);
      // Optimistically update order
      setBoard(prev => {
        if (!prev) return null;
        const reorderedColumns = columnIds.map(id => 
          prev.columns.find(col => col.id === id)!
        ).filter(Boolean);
        return { ...prev, columns: reorderedColumns };
      });
    } catch (err: any) {
      setError(err.message || 'Failed to reorder columns');
      // Reload board to revert optimistic update
      await loadBoard();
      throw err;
    }
  }, [boardId, loadBoard]);

  // Item actions
  const createItem = useCallback(async (data: CreateItemRequest) => {
    try {
      const newItem = await WorkspaceService.createItem(boardId, data);
      setItems(prev => [...prev, newItem]);
    } catch (err: any) {
      setError(err.message || 'Failed to create item');
      throw err;
    }
  }, [boardId]);

  const updateItem = useCallback(async (itemId: string, data: Partial<BoardItem>) => {
    try {
      const updatedItem = await WorkspaceService.updateItem(itemId, data);
      setItems(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update item');
      throw err;
    }
  }, []);

  const deleteItem = useCallback(async (itemId: string) => {
    try {
      await WorkspaceService.deleteItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
      throw err;
    }
  }, []);

  const updateItemValue = useCallback(async (itemId: string, columnId: string, value: any) => {
    try {
      // Optimistic update
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, values: { ...item.values, [columnId]: value } }
          : item
      ));

      await WorkspaceService.updateItemValue(itemId, columnId, value);
    } catch (err: any) {
      setError(err.message || 'Failed to update item value');
      // Reload board to revert optimistic update
      await loadBoard();
      throw err;
    }
  }, [loadBoard]);

  // Bulk actions
  const bulkUpdateItems = useCallback(async (itemIds: string[], updates: Record<string, any>) => {
    try {
      await WorkspaceService.bulkUpdateItems({ itemIds, updates });
      
      // Optimistically update items
      setItems(prev => prev.map(item => 
        itemIds.includes(item.id) 
          ? { ...item, values: { ...item.values, ...updates } }
          : item
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to bulk update items');
      await loadBoard();
      throw err;
    }
  }, [loadBoard]);

  const reorderItems = useCallback(async (itemIds: string[], newOrder: number[]) => {
    try {
      await WorkspaceService.reorderItems({ itemIds, newOrder });
      
      // Optimistically update order
      const reorderedItems = itemIds.map(id => 
        items.find(item => item.id === id)!
      ).filter(Boolean);
      setItems(reorderedItems);
    } catch (err: any) {
      setError(err.message || 'Failed to reorder items');
      await loadBoard();
      throw err;
    }
  }, [items, loadBoard]);

  const refreshBoard = useCallback(async () => {
    await loadBoard();
  }, [loadBoard]);

  return {
    board,
    items,
    loading,
    error,
    updateBoard,
    deleteBoard,
    addColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    createItem,
    updateItem,
    deleteItem,
    updateItemValue,
    bulkUpdateItems,
    reorderItems,
    refreshBoard,
  };
}

export default useBoard;
