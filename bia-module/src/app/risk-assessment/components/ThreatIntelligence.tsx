'use client';

import { ClockIcon } from '@heroicons/react/24/outline';
import { formatTimeWithTimezone } from '@/utils/date-utils';

interface ThreatAlert {
  id: string;
  icon: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
}

// Mock threat intelligence data for Bengaluru context
const threatAlerts: ThreatAlert[] = [
  {
    id: '1',
    icon: '⛈️',
    title: 'Weather Advisory: Heavy Rainfall Expected',
    description: 'The IMD has issued a yellow alert for Bengaluru this weekend. Expect traffic disruptions and potential power outages due to waterlogging.',
    timestamp: 'Issued: 1 hour ago',
    severity: 'medium',
    source: 'India Meteorological Department'
  },
  {
    id: '2',
    icon: '💻',
    title: 'Cybersecurity Alert: New Phishing Campaign',
    description: 'A new phishing campaign impersonating major Indian banks is targeting corporate users. Remind employees to verify all fund transfer requests.',
    timestamp: 'Issued: 1 day ago',
    severity: 'high',
    source: 'CERT-In'
  },
  {
    id: '3',
    icon: '🚧',
    title: 'Infrastructure Alert: Metro Line Maintenance',
    description: 'Namma Metro Purple Line will have reduced services this weekend for scheduled maintenance. Plan alternative transportation for staff.',
    timestamp: 'Issued: 2 days ago',
    severity: 'low',
    source: 'BMRCL'
  },
  {
    id: '4',
    icon: '⚡',
    title: 'Power Grid Advisory: Load Shedding Possible',
    description: 'BESCOM has announced possible power cuts in select areas due to increased demand. Ensure backup power systems are operational.',
    timestamp: 'Issued: 3 days ago',
    severity: 'medium',
    source: 'BESCOM'
  },
  {
    id: '5',
    icon: '🏛️',
    title: 'Regulatory Update: New Data Protection Guidelines',
    description: 'Updated guidelines for data protection compliance have been released. Review current practices and ensure adherence by month-end.',
    timestamp: 'Issued: 1 week ago',
    severity: 'medium',
    source: 'Ministry of Electronics & IT'
  }
];

export default function ThreatIntelligence() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-red-600 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Threat Intelligence Feed
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Location-specific alerts and contextual threat information for Bengaluru
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {formatTimeWithTimezone()}
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {threatAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              border-l-4 p-4 rounded-r-lg transition-all duration-200 hover:shadow-md
              ${getSeverityColor(alert.severity)}
            `}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 text-2xl">
                {alert.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {alert.title}
                  </h4>
                  <span className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${getSeverityBadge(alert.severity)}
                  `}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {alert.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>{alert.timestamp}</span>
                  </div>
                  {alert.source && (
                    <span className="font-medium">
                      Source: {alert.source}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {threatAlerts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🛡️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Active Threats
          </h3>
          <p className="text-gray-600">
            All systems are operating normally. Check back later for updates.
          </p>
        </div>
      )}
    </div>
  );
}
