'use client';

interface ControlsDistributionData {
  byType: { type: string; count: number; color: string }[];
  byCategory: { category: string; count: number }[];
  byEffectiveness: { rating: number; count: number }[];
  totalControls: number;
  avgEffectiveness: number;
}

interface ControlsDistributionProps {
  data: ControlsDistributionData;
}

export default function ControlsDistribution({ data }: ControlsDistributionProps) {
  const maxByType = Math.max(...data.byType.map(t => t.count));
  const maxByCategory = Math.max(...data.byCategory.map(c => c.count));

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-sm p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.totalControls}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Total Controls</div>
        </div>
        <div className="bg-gray-50 rounded-sm p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{data.avgEffectiveness.toFixed(1)}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Effectiveness</div>
        </div>
      </div>

      {/* By Type */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 mb-2">By Control Type</h4>
        <div className="space-y-2">
          {data.byType.map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <div className="w-20 text-xs text-gray-600">{item.type}</div>
              <div className="flex-1 h-4 bg-gray-100 rounded-sm overflow-hidden">
                <div
                  className={`h-full ${item.color}`}
                  style={{ width: `${(item.count / maxByType) * 100}%` }}
                />
              </div>
              <div className="w-8 text-xs font-medium text-gray-900 text-right">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* By Category */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 mb-2">By Category</h4>
        <div className="grid grid-cols-5 gap-1">
          {data.byCategory.map((item) => (
            <div key={item.category} className="text-center">
              <div
                className="mx-auto rounded-sm bg-indigo-100"
                style={{
                  height: `${Math.max(20, (item.count / maxByCategory) * 60)}px`,
                  width: '100%'
                }}
              />
              <div className="text-[10px] text-gray-600 mt-1 truncate">{item.category}</div>
              <div className="text-xs font-medium text-gray-900">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* By Effectiveness */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Effectiveness Distribution</h4>
        <div className="flex items-end gap-1 h-12">
          {data.byEffectiveness.map((item) => {
            const maxEff = Math.max(...data.byEffectiveness.map(e => e.count));
            const height = maxEff > 0 ? (item.count / maxEff) * 100 : 0;
            const colors = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-green-400', 'bg-green-600'];
            return (
              <div key={item.rating} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full ${colors[item.rating - 1]} rounded-t-sm`}
                  style={{ height: `${height}%`, minHeight: item.count > 0 ? '4px' : '0' }}
                />
                <div className="text-[10px] text-gray-500 mt-1">{item.rating}</div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>Weak</span>
          <span>Strong</span>
        </div>
      </div>
    </div>
  );
}

