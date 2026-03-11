'use client';

interface RiskData {
  rank: number;
  name: string;
  score: number;
  severity: 'low' | 'medium' | 'high';
}

interface TopUnmitigatedRisksProps {
  data: RiskData[];
}

export default function TopUnmitigatedRisks({ data }: TopUnmitigatedRisksProps) {
  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="h-64 overflow-y-auto">
      <ol className="space-y-3">
        {data.map((risk) => (
          <li key={risk.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              {/* Rank */}
              <div className="flex-shrink-0 w-6 h-6 bg-bcm-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
                {risk.rank}
              </div>
              
              {/* Risk Name */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {risk.name}
                </p>
              </div>
            </div>
            
            {/* Risk Score Badge */}
            <div className="flex-shrink-0">
              <span 
                className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                  ${getSeverityBadgeClass(risk.severity)}
                `}
              >
                {risk.score}
              </span>
            </div>
          </li>
        ))}
      </ol>
      
      {/* Empty state if no data */}
      {data.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-sm">No unmitigated risks found</p>
            <p className="text-xs mt-1">All risks have been addressed</p>
          </div>
        </div>
      )}
    </div>
  );
}
