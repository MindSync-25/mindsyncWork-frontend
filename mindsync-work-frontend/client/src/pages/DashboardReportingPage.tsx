import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DashboardReportingPageProps {
  boardName?: string;
}

const DashboardReportingPage: React.FC<DashboardReportingPageProps> = ({ 
  boardName = 'My Board' 
}) => {
  const [editMode, setEditMode] = useState(true);
  const [filterText, setFilterText] = useState('');

  const widgets = [
    {
      id: 'all-tasks',
      title: 'All Tasks',
      type: 'counter',
      value: 3,
      color: 'blue',
      filter: null
    },
    {
      id: 'in-progress',
      title: 'In progress',
      type: 'counter',
      value: 1,
      color: 'orange',
      filter: 'Working on it'
    },
    {
      id: 'stuck',
      title: 'Stuck',
      type: 'counter',
      value: 1,
      color: 'red',
      filter: 'Stuck'
    },
    {
      id: 'done',
      title: 'Done',
      type: 'counter',
      value: 1,
      color: 'green',
      filter: 'Done'
    },
    {
      id: 'tasks-by-status',
      title: 'Tasks by status',
      type: 'pie-chart',
      data: [
        { name: 'Working on it', value: 33.3, color: '#fdab3d' },
        { name: 'Done', value: 33.3, color: '#00c875' },
        { name: 'Stuck', value: 33.3, color: '#df2f4a' }
      ]
    },
    {
      id: 'tasks-by-owner',
      title: 'Tasks by owner',
      type: 'bar-chart',
      data: [
        { name: 'sdgklnag', value: 1, avatar: 'https://files.monday.com/use1/photos/80063804/thumb/80063804-user_photo_initials_2025_08_17_02_35_52.png?1755398152' }
      ]
    }
  ];

  const PieChart = ({ data }: { data: any[] }) => (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 168 168" className="w-full h-full">
          <circle 
            cx="84" 
            cy="84" 
            r="67.6" 
            fill="none" 
            stroke="#fdab3d" 
            strokeWidth="10"
            strokeDasharray="142 284"
            strokeDashoffset="0"
            transform="rotate(-90 84 84)"
          />
          <circle 
            cx="84" 
            cy="84" 
            r="67.6" 
            fill="none" 
            stroke="#00c875" 
            strokeWidth="10"
            strokeDasharray="142 284"
            strokeDashoffset="-142"
            transform="rotate(-90 84 84)"
          />
          <circle 
            cx="84" 
            cy="84" 
            r="67.6" 
            fill="none" 
            stroke="#df2f4a" 
            strokeWidth="10"
            strokeDasharray="142 284"
            strokeDashoffset="-284"
            transform="rotate(-90 84 84)"
          />
        </svg>
      </div>
      <div className="ml-6 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-700">{item.name}: {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  const BarChart = ({ data }: { data: any[] }) => (
    <div className="flex items-center justify-center h-full p-4">
      <div className="flex flex-col items-center">
        <div className="flex items-end gap-2 mb-4">
          <div className="w-20 h-40 bg-blue-500 rounded-t flex items-end justify-center pb-2">
            <span className="text-white font-bold">1</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img 
            src={data[0].avatar} 
            alt={data[0].name} 
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-gray-700">{data[0].name}</span>
        </div>
      </div>
    </div>
  );

  const CounterWidget = ({ widget }: { widget: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
              <path d="M7 2a.75.75 0 01.75.75V9H13a.75.75 0 010 1.5H7.75v6.25a.75.75 0 01-1.5 0V10.5H.75a.75.75 0 010-1.5h5.5V2.75A.75.75 0 017 2z" />
            </svg>
          </button>
          <h3 className="text-sm font-medium text-gray-900">{widget.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
              <path d="M17.8571 2.87669C18.107 3.41157 18.0246 4.04275 17.6457 4.49555L12.4892 10.6589V15.3856C12.4892 16.0185 12.097 16.5852 11.5048 16.8082L9.56669 17.5381C9.09976 17.7139 8.57627 17.6494 8.16598 17.3655C7.75569 17.0816 7.51084 16.6144 7.51084 16.1155V10.6589L2.35425 4.49555C1.97542 4.04275 1.89302 3.41157 2.14291 2.87669C2.39279 2.34182 2.92977 2 3.52013 2H16.4799C17.0702 2 17.6072 2.34182 17.8571 2.87669ZM16.4799 3.52012H3.52013L8.91611 9.96964C8.99036 10.0584 9.03096 10.1698 9.03096 10.2848V16.1155L10.969 15.3856V10.2848C10.969 10.1698 11.0096 10.0584 11.0839 9.96964L16.4799 3.52012Z" />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
              <path d="M6 10.5C6 11.3284 5.32843 12 4.5 12 3.67157 12 3 11.3284 3 10.5 3 9.67157 3.67157 9 4.5 9 5.32843 9 6 9.67157 6 10.5zM11.8333 10.5C11.8333 11.3284 11.1618 12 10.3333 12 9.50492 12 8.83334 11.3284 8.83334 10.5 8.83334 9.67157 9.50492 9 10.3333 9 11.1618 9 11.8333 9.67157 11.8333 10.5zM17.6667 10.5C17.6667 11.3284 16.9951 12 16.1667 12 15.3383 12 14.6667 11.3284 14.6667 10.5 14.6667 9.67157 15.3383 9 16.1667 9 16.9951 9 17.6667 9.67157 17.6667 10.5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">{widget.value}</div>
        </div>
      </div>

      <div className="px-3 pb-3">
        <button className="flex items-center gap-1 text-sm text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">
          <span>Count</span>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M9.442 12.76a.77.77 0 0 0 1.116 0l4.21-4.363a.84.84 0 0 0 0-1.157.77.77 0 0 0-1.116 0L10 11.025 6.348 7.24a.77.77 0 0 0-1.117 0 .84.84 0 0 0 0 1.157l4.21 4.363Z" />
          </svg>
        </button>
      </div>
    </div>
  );

  const ChartWidget = ({ widget }: { widget: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden col-span-2">
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
              <path d="M7 2a.75.75 0 01.75.75V9H13a.75.75 0 010 1.5H7.75v6.25a.75.75 0 01-1.5 0V10.5H.75a.75.75 0 010-1.5h5.5V2.75A.75.75 0 017 2z" />
            </svg>
          </button>
          <h3 className="text-sm font-medium text-gray-900">{widget.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
              <path d="M17.8571 2.87669C18.107 3.41157 18.0246 4.04275 17.6457 4.49555L12.4892 10.6589V15.3856C12.4892 16.0185 12.097 16.5852 11.5048 16.8082L9.56669 17.5381C9.09976 17.7139 8.57627 17.6494 8.16598 17.3655C7.75569 17.0816 7.51084 16.6144 7.51084 16.1155V10.6589L2.35425 4.49555C1.97542 4.04275 1.89302 3.41157 2.14291 2.87669C2.39279 2.34182 2.92977 2 3.52013 2H16.4799C17.0702 2 17.6072 2.34182 17.8571 2.87669ZM16.4799 3.52012H3.52013L8.91611 9.96964C8.99036 10.0584 9.03096 10.1698 9.03096 10.2848V16.1155L10.969 15.3856V10.2848C10.969 10.1698 11.0096 10.0584 11.0839 9.96964L16.4799 3.52012Z" />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
              <path d="M6 10.5C6 11.3284 5.32843 12 4.5 12 3.67157 12 3 11.3284 3 10.5 3 9.67157 3.67157 9 4.5 9 5.32843 9 6 9.67157 6 10.5zM11.8333 10.5C11.8333 11.3284 11.1618 12 10.3333 12 9.50492 12 8.83334 11.3284 8.83334 10.5 8.83334 9.67157 9.50492 9 10.3333 9 11.1618 9 11.8333 9.67157 11.8333 10.5zM17.6667 10.5C17.6667 11.3284 16.9951 12 16.1667 12 15.3383 12 14.6667 11.3284 14.6667 10.5 14.6667 9.67157 15.3383 9 16.1667 9 16.9951 9 17.6667 9.67157 17.6667 10.5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="h-80">
        {widget.type === 'pie-chart' ? (
          <PieChart data={widget.data} />
        ) : (
          <BarChart data={widget.data} />
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{boardName}</h1>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                  <path d="M11.234 3.016a1.379 1.379 0 0 0-2.47 0l-1.78 3.61-3.99.584h-.003a1.376 1.376 0 0 0-.754 2.348v.001l2.878 2.813-.68 3.97v.001a1.376 1.376 0 0 0 2.005 1.45L10 15.921l3.549 1.866a1.377 1.377 0 0 0 2.005-1.45v-.001l-.68-3.97 2.882-2.81v-.001a1.377 1.377 0 0 0-.753-2.348l-3.989-.58-1.78-3.61Zm-1.235.888L8.3 7.35a1.378 1.378 0 0 1-1.034.752l-3.803.557 2.747 2.685a1.376 1.376 0 0 1 .395 1.22l-.649 3.79 3.404-1.79a1.377 1.377 0 0 1 1.28 0l3.395 1.785-.65-3.79v-.002a1.374 1.374 0 0 1 .396-1.218l2.751-2.683-3.796-.554a1.382 1.382 0 0 1-1.037-.752L10 3.904Z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    !editMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setEditMode(false)}
                >
                  View
                </button>
                <button 
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    editMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
              </div>

              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Export
              </button>

              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Invite
              </button>

              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M6 10.5C6 11.3284 5.32843 12 4.5 12 3.67157 12 3 11.3284 3 10.5 3 9.67157 3.67157 9 4.5 9 5.32843 9 6 9.67157 6 10.5zM11.8333 10.5C11.8333 11.3284 11.1618 12 10.3333 12 9.50492 12 8.83334 11.3284 8.83334 10.5 8.83334 9.67157 9.50492 9 10.3333 9 11.1618 9 11.8333 9.67157 11.8333 10.5zM17.6667 10.5C17.6667 11.3284 16.9951 12 16.1667 12 15.3383 12 14.6667 11.3284 14.6667 10.5 14.6667 9.67157 15.3383 9 16.1667 9 16.9951 9 17.6667 9.67157 17.6667 10.5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {editMode && (
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Add widget
                </button>
              )}

              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                1 connected board
              </button>

              <div className="w-px h-6 bg-gray-300" />

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type to filter"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400">
                    <path d="M8.65191 2.37299C6.9706 2.37299 5.35814 3.04089 4.16927 4.22976C2.9804 5.41863 2.3125 7.03108 2.3125 8.7124C2.3125 10.3937 2.9804 12.0062 4.16927 13.195C5.35814 14.3839 6.9706 15.0518 8.65191 15.0518C10.0813 15.0518 11.4609 14.5691 12.5728 13.6939L16.4086 17.5303C16.7014 17.8232 17.1763 17.8232 17.4692 17.5303C17.7621 17.2375 17.7622 16.7626 17.4693 16.4697L13.6334 12.6333C14.5086 11.5214 14.9913 10.1418 14.9913 8.7124C14.9913 7.03108 14.3234 5.41863 13.1346 4.22976C11.9457 3.04089 10.3332 2.37299 8.65191 2.37299Z" />
                  </svg>
                </div>

                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  People
                </button>

                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  Filter
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M9.85532 3.75C9.77634 3.75 9.6992 3.7738 9.63396 3.8183C9.56871 3.86281 9.5184 3.92594 9.48957 3.99946L8.9889 5.27515C8.92686 5.43321 8.81303 5.56554 8.66603 5.6505L7.00888 6.60821C6.86142 6.69343 6.68935 6.72593 6.52097 6.70035L5.16775 6.4948C5.16763 6.49478 5.16787 6.49482 5.16775 6.4948C5.08965 6.48312 5.00948 6.4952 4.93837 6.52957C4.86716 6.56398 4.80799 6.6191 4.76861 6.68769L4.76695 6.69058L4.303 7.49048C4.30298 7.49051 4.30301 7.49045 4.303 7.49048C4.26333 7.55894 4.2452 7.63787 4.25109 7.71676C4.25698 7.7957 4.28657 7.87101 4.336 7.93284L5.19117 9.00409C5.29725 9.13698 5.35503 9.30196 5.35503 9.472V11.3851C5.35503 11.5549 5.29743 11.7197 5.19165 11.8524L4.3368 12.9256C4.28754 12.9873 4.25775 13.0629 4.25186 13.1417C4.24599 13.2202 4.26389 13.2988 4.30324 13.3671C4.30332 13.3672 4.30315 13.3669 4.30324 13.3671L4.76781 14.1681C4.8073 14.2365 4.86652 14.2915 4.93773 14.3257C5.00893 14.36 5.08882 14.372 5.16696 14.3602L6.52097 14.1545C6.68935 14.1289 6.86142 14.1614 7.00888 14.2466L8.66602 15.2044C8.81303 15.2893 8.92686 15.4217 8.9889 15.5797L9.48947 16.8551C9.5183 16.9287 9.56871 16.9921 9.63396 17.0366C9.6992 17.0811 9.77634 17.1049 9.85532 17.1049H10.7833C10.8623 17.1049 10.9394 17.0811 11.0047 17.0366C11.0699 16.9921 11.1202 16.9289 11.1491 16.8554L11.6497 15.5797C11.7118 15.4217 11.8256 15.2893 11.9726 15.2044L13.6297 14.2466C13.7772 14.1614 13.9493 14.1289 14.1177 14.1545L15.4717 14.3602C15.5498 14.372 15.6297 14.36 15.7009 14.3257C15.7721 14.2915 15.8313 14.2365 15.8708 14.1681L15.8717 14.1666L16.3356 13.3667C16.3753 13.2982 16.3934 13.2193 16.3875 13.1404C16.3816 13.0614 16.3521 12.9861 16.3026 12.9243L15.4475 11.8531C15.3414 11.7202 15.2836 11.5552 15.2836 11.3851V9.472C15.2836 9.3025 15.341 9.138 15.4465 9.00531L16.3021 7.9289C16.3514 7.86715 16.3809 7.79198 16.3868 7.71321C16.3926 7.63461 16.3747 7.55606 16.3354 7.48778C16.3353 7.48763 16.3355 7.48793 16.3354 7.48778L15.8708 6.68679C15.8313 6.61833 15.7721 6.56339 15.7009 6.52911C15.6297 6.49484 15.5498 6.48284 15.4717 6.49468L14.1177 6.70035C13.9493 6.72593 13.7772 6.69343 13.6297 6.60821L11.9726 5.6505C11.8256 5.56554 11.7118 5.43321 11.6497 5.27515L11.1492 3.99972C11.1203 3.92619 11.0699 3.86281 11.0047 3.8183C10.9394 3.7738 10.8623 3.75 10.7833 3.75H9.85532Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <motion.div 
          className="grid grid-cols-4 gap-6 auto-rows-min"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {widgets.map((widget) => (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {widget.type === 'counter' ? (
                <CounterWidget widget={widget} />
              ) : (
                <ChartWidget widget={widget} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardReportingPage;
