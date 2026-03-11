'use client';

import { 
  DocumentCheckIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  UserGroupIcon,
  CalendarIcon,
  ServerStackIcon
} from '@heroicons/react/24/outline';

interface MetricCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: { value: number; isPositive: boolean };
  color: string;
  bgColor: string;
}

interface DepartmentMetricsCardsProps {
  biaRecords: any[];
}

export default function DepartmentMetricsCards({ biaRecords }: DepartmentMetricsCardsProps) {
  // Calculate metrics from BIA records
  const totalBIAs = biaRecords.length || 6;
  const approvedBIAs = biaRecords.filter(b => b.workflowStatus === 'APPROVED').length || 2;
  const inProgressBIAs = biaRecords.filter(b => b.workflowStatus === 'IN_PROGRESS').length || 3;
  const submittedBIAs = biaRecords.filter(b => b.workflowStatus === 'SUBMITTED').length || 2;
  
  // Sample metrics data
  const metrics: MetricCard[] = [
    {
      title: 'BIA Completion Rate',
      value: `${Math.round((approvedBIAs / totalBIAs) * 100)}%`,
      subtitle: `${approvedBIAs} of ${totalBIAs} completed`,
      icon: DocumentCheckIcon,
      trend: { value: 12, isPositive: true },
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avg. Time to Complete',
      value: '8.5',
      subtitle: 'Days per BIA',
      icon: ClockIcon,
      trend: { value: 2, isPositive: true },
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Critical Processes',
      value: '4',
      subtitle: 'Identified across BIAs',
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Risk Mitigation',
      value: '78%',
      subtitle: 'Controls in place',
      icon: ShieldCheckIcon,
      trend: { value: 5, isPositive: true },
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Pending Reviews',
      value: submittedBIAs.toString(),
      subtitle: 'Awaiting your action',
      icon: CalendarIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Team Members',
      value: '8',
      subtitle: 'SMEs assigned',
      icon: UserGroupIcon,
      trend: { value: 2, isPositive: true },
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'DR Plans Ready',
      value: '3',
      subtitle: 'Of 5 required',
      icon: ServerStackIcon,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Compliance Score',
      value: '92%',
      subtitle: 'ISO 22301 alignment',
      icon: CheckCircleIcon,
      trend: { value: 3, isPositive: true },
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div
            key={index}
            className={`${metric.bgColor} border border-gray-200 rounded-sm p-3
              transition-all duration-300 ease-out cursor-pointer
              hover:shadow-xl hover:-translate-y-1
              hover:scale-[1.02]
              transform perspective-1000
              hover:border-gray-300
              relative
              before:absolute before:inset-0 before:rounded-sm before:opacity-0
              before:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
              before:transition-opacity before:duration-300
              hover:before:opacity-100 before:-z-10
            `}
            style={{
              transformStyle: 'preserve-3d',
            }}
            onMouseEnter={(e) => {
              const card = e.currentTarget;
              card.style.transform = 'perspective(1000px) rotateX(2deg) translateY(-4px) scale(1.02)';
              card.style.boxShadow = '0 20px 40px -15px rgba(0,0,0,0.2), 0 10px 20px -10px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget;
              card.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px) scale(1)';
              card.style.boxShadow = 'none';
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[9px] font-medium text-gray-600 uppercase tracking-wide">
                  {metric.title}
                </p>
                <p className={`text-xl font-bold ${metric.color} mt-1`}>
                  {metric.value}
                </p>
                <p className="text-[9px] text-gray-500 mt-0.5">{metric.subtitle}</p>
              </div>
              <Icon className={`h-5 w-5 ${metric.color} opacity-60 transition-transform duration-300 group-hover:scale-110`} />
            </div>
            {metric.trend && (
              <div className={`flex items-center mt-2 text-[9px] ${metric.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend.isPositive ? (
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowTrendingDownIcon className="h-3 w-3 mr-0.5" />
                )}
                <span>{metric.trend.value}% vs last month</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

