import { API_CONFIG } from '../config/api';
import type { WebSocketEvent } from '../types/api';

export interface WebSocketSubscription {
  unsubscribe: () => void;
}

export interface WebSocketOptions {
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

class WebSocketService {
  private connections: Map<string, WebSocket> = new Map();
  private eventListeners: Map<string, Set<(event: WebSocketEvent) => void>> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private reconnectTimers: Map<string, NodeJS.Timeout> = new Map();

  // Connect to a board's WebSocket
  public connectToBoard(
    boardId: string,
    options: WebSocketOptions = {}
  ): WebSocketSubscription {
    const {
      reconnectInterval = 5000,
      maxReconnectAttempts = 5,
      onConnect,
      onDisconnect,
      onError,
    } = options;

    const connect = () => {
      // Get auth token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('No auth token available for WebSocket connection');
        return;
      }

      const wsUrl = `${API_CONFIG.WS_URL}/ws/boards/${boardId}?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`WebSocket connected to board ${boardId}`);
        this.connections.set(boardId, ws);
        this.reconnectAttempts.set(boardId, 0);
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketEvent = JSON.parse(event.data);
          this.handleMessage(boardId, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log(`WebSocket disconnected from board ${boardId}`);
        this.connections.delete(boardId);
        onDisconnect?.();

        // Attempt reconnection
        const attempts = this.reconnectAttempts.get(boardId) || 0;
        if (attempts < maxReconnectAttempts) {
          this.reconnectAttempts.set(boardId, attempts + 1);
          const timer = setTimeout(() => {
            console.log(`Attempting to reconnect to board ${boardId} (attempt ${attempts + 1})`);
            connect();
          }, reconnectInterval);
          this.reconnectTimers.set(boardId, timer);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for board ${boardId}:`, error);
        onError?.(error);
      };
    };

    connect();

    return {
      unsubscribe: () => {
        this.disconnect(boardId);
      },
    };
  }

  // Subscribe to board events
  public subscribe(
    boardId: string,
    callback: (event: WebSocketEvent) => void
  ): WebSocketSubscription {
    if (!this.eventListeners.has(boardId)) {
      this.eventListeners.set(boardId, new Set());
    }

    this.eventListeners.get(boardId)!.add(callback);

    return {
      unsubscribe: () => {
        const listeners = this.eventListeners.get(boardId);
        if (listeners) {
          listeners.delete(callback);
          if (listeners.size === 0) {
            this.eventListeners.delete(boardId);
          }
        }
      },
    };
  }

  // Send message to WebSocket
  public sendMessage(boardId: string, message: any): void {
    const ws = this.connections.get(boardId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn(`WebSocket for board ${boardId} is not connected`);
    }
  }

  // Disconnect from a board
  public disconnect(boardId: string): void {
    const ws = this.connections.get(boardId);
    if (ws) {
      ws.close();
      this.connections.delete(boardId);
    }

    // Clear reconnect timer
    const timer = this.reconnectTimers.get(boardId);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(boardId);
    }

    // Clear event listeners
    this.eventListeners.delete(boardId);
    this.reconnectAttempts.delete(boardId);
  }

  // Disconnect from all boards
  public disconnectAll(): void {
    const boardIds = Array.from(this.connections.keys());
    boardIds.forEach(boardId => this.disconnect(boardId));
  }

  // Get connection status
  public isConnected(boardId: string): boolean {
    const ws = this.connections.get(boardId);
    return ws?.readyState === WebSocket.OPEN;
  }

  // Handle incoming messages
  private handleMessage(boardId: string, event: WebSocketEvent): void {
    const listeners = this.eventListeners.get(boardId);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in WebSocket event listener:', error);
        }
      });
    }
  }

  // Send presence update (user is viewing board)
  public sendPresence(boardId: string, action: 'join' | 'leave'): void {
    this.sendMessage(boardId, {
      type: 'presence',
      action,
      boardId,
    });
  }

  // Send typing indicator
  public sendTyping(boardId: string, itemId: string, columnId: string, isTyping: boolean): void {
    this.sendMessage(boardId, {
      type: 'typing',
      boardId,
      itemId,
      columnId,
      isTyping,
    });
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;
