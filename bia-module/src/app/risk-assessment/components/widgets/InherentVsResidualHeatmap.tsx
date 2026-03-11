'use client';

interface HeatmapData {
  inherent: number[][];
  residual: number[][];
}

interface InherentVsResidualHeatmapProps {
  data: HeatmapData;
}

const LIKELIHOOD_LABELS = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
const IMPACT_LABELS = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Catastrophic'];

const getColor = (value: number, max: number) => {
  if (value === 0) return 'bg-gray-100';
  const intensity = value / max;
  if (intensity > 0.7) return 'bg-red-500 text-white';
  if (intensity > 0.5) return 'bg-orange-400 text-white';
  if (intensity > 0.3) return 'bg-amber-300';
  if (intensity > 0.1) return 'bg-yellow-200';
  return 'bg-green-100';
};

export default function InherentVsResidualHeatmap({ data }: InherentVsResidualHeatmapProps) {
  const maxValue = Math.max(
    ...data.inherent.flat(),
    ...data.residual.flat()
  );

  const renderHeatmap = (matrix: number[][], title: string) => (
    <div className="flex-1">
      <h4 className="text-xs font-semibold text-gray-700 mb-2 text-center">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="p-1 text-gray-500 font-normal"></th>
              {LIKELIHOOD_LABELS.map((label, i) => (
                <th key={i} className="p-1 text-gray-500 font-normal text-center" style={{ width: '18%' }}>
                  {label.substring(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...IMPACT_LABELS].reverse().map((impactLabel, rowIdx) => (
              <tr key={rowIdx}>
                <td className="p-1 text-gray-500 font-normal text-right pr-2">
                  {impactLabel.substring(0, 3)}
                </td>
                {matrix[4 - rowIdx].map((value, colIdx) => (
                  <td
                    key={colIdx}
                    className={`p-1 text-center border border-gray-200 ${getColor(value, maxValue)}`}
                  >
                    {value > 0 ? value : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Calculate totals for comparison
  const inherentTotal = data.inherent.flat().reduce((a, b) => a + b, 0);
  const residualTotal = data.residual.flat().reduce((a, b) => a + b, 0);
  const reduction = inherentTotal > 0 ? Math.round(((inherentTotal - residualTotal) / inherentTotal) * 100) : 0;

  return (
    <div>
      <div className="flex gap-4">
        {renderHeatmap(data.inherent, 'Inherent Risk')}
        <div className="flex flex-col items-center justify-center px-2">
          <div className="text-2xl text-gray-400">→</div>
          <div className="text-xs text-green-600 font-semibold mt-1">-{reduction}%</div>
        </div>
        {renderHeatmap(data.residual, 'Residual Risk')}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-gray-200"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-200 border border-gray-200"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-400 border border-gray-200"></div>
          <span>High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 border border-gray-200"></div>
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
}

