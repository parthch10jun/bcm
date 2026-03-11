'use client';

import { 
  DocumentPlusIcon, 
  UserPlusIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
  EyeIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface ActivityItem {
  id: number;
  type: 'created' | 'assigned' | 'completed' | 'submitted' | 'review' | 'warning';
  title: string;
  description: string;
  time: string;
  user?: string;
}

interface UpcomingTask {
  id: number;
  title: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
}

export default function DepartmentActivityFeed() {
  const recentActivities: ActivityItem[] = [
    { id: 1, type: 'submitted', title: 'BIA Submitted for Review', description: 'Finance Operations BIA submitted by John Smith', time: '2 hours ago', user: 'John Smith' },
    { id: 2, type: 'assigned', title: 'SME Assigned', description: 'Alice Wong assigned to IT Infrastructure BIA', time: '4 hours ago', user: 'You' },
    { id: 3, type: 'completed', title: 'BIA Approved', description: 'Supply Chain BIA received final approval', time: '1 day ago' },
    { id: 4, type: 'review', title: 'Review Requested', description: 'Marketing Operations BIA ready for champion review', time: '1 day ago', user: 'Dave Miller' },
    { id: 5, type: 'created', title: 'New BIA Created', description: 'Customer Service BIA initiated', time: '2 days ago', user: 'You' },
    { id: 6, type: 'warning', title: 'Deadline Approaching', description: 'HR Systems BIA due in 3 days', time: '2 days ago' }
  ];

  const upcomingTasks: UpcomingTask[] = [
    { id: 1, title: 'Review Finance Operations BIA', dueDate: '2025-11-28', priority: 'HIGH', type: 'Review' },
    { id: 2, title: 'Submit IT Infrastructure BIA', dueDate: '2025-12-02', priority: 'MEDIUM', type: 'Submission' },
    { id: 3, title: 'Complete Customer Service BIA', dueDate: '2025-12-05', priority: 'HIGH', type: 'Completion' },
    { id: 4, title: 'Annual BIA Review - Marketing', dueDate: '2025-12-10', priority: 'LOW', type: 'Annual Review' }
  ];

  const getActivityIcon = (type: string) => {
    const icons: Record<string, { icon: any; color: string; bg: string }> = {
      created: { icon: DocumentPlusIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
      assigned: { icon: UserPlusIcon, color: 'text-purple-600', bg: 'bg-purple-100' },
      completed: { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-100' },
      submitted: { icon: PaperAirplaneIcon, color: 'text-amber-600', bg: 'bg-amber-100' },
      review: { icon: EyeIcon, color: 'text-indigo-600', bg: 'bg-indigo-100' },
      warning: { icon: ExclamationCircleIcon, color: 'text-red-600', bg: 'bg-red-100' }
    };
    return icons[type] || icons.created;
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      HIGH: 'bg-red-100 text-red-700',
      MEDIUM: 'bg-amber-100 text-amber-700',
      LOW: 'bg-green-100 text-green-700'
    };
    return styles[priority] || styles.MEDIUM;
  };

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return <span className="text-red-600 font-medium">Overdue</span>;
    if (days === 0) return <span className="text-amber-600 font-medium">Today</span>;
    if (days <= 3) return <span className="text-amber-600">{days}d left</span>;
    return <span className="text-gray-600">{days}d left</span>;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <ClockIcon className="h-4 w-4 text-gray-600" />
          <h3 className="text-xs font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentActivities.map((activity) => {
            const iconConfig = getActivityIcon(activity.type);
            const Icon = iconConfig.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`${iconConfig.bg} p-1.5 rounded-full flex-shrink-0`}>
                  <Icon className={`h-3 w-3 ${iconConfig.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-[9px] text-gray-500 truncate">{activity.description}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDaysIcon className="h-4 w-4 text-gray-600" />
          <h3 className="text-xs font-semibold text-gray-900">Upcoming Tasks</h3>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-gray-900 truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${getPriorityBadge(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-[9px] text-gray-500">{task.type}</span>
                </div>
              </div>
              <div className="text-right text-[9px]">
                {getDaysRemaining(task.dueDate)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

