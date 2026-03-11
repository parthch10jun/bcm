'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ThreatCategoryData {
  category: string;
  count: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface ThreatCategoryBreakdownProps {
  data: ThreatCategoryData[];
}

export default function ThreatCategoryBreakdown({ data }: ThreatCategoryBreakdownProps) {
  // Consistent color palette matching risk levels
  const COLORS = {
    critical: '#dc2626',  // red-600
    high: '#f97316',      // orange-500
    medium: '#f59e0b',    // amber-500
    low: '#10b981'        // green-500
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-sm shadow-lg">
          <p className="text-xs font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-xs text-red-600">Critical: <span className="font-bold">{data.critical}</span></p>
            <p className="text-xs text-orange-600">High: <span className="font-bold">{data.high}</span></p>
            <p className="text-xs text-yellow-600">Medium: <span className="font-bold">{data.medium}</span></p>
            <p className="text-xs text-green-600">Low: <span className="font-bold">{data.low}</span></p>
            <p className="text-xs text-gray-900 font-semibold border-t pt-1 mt-1">Total: {data.count}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barGap={8}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 10 }}
            stroke="#6b7280"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            stroke="#6b7280"
            label={{ value: 'Threat Count', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
            iconType="circle"
          />
          {/* Grouped bars instead of stacked */}
          <Bar dataKey="critical" fill={COLORS.critical} name="Critical" radius={[4, 4, 0, 0]} />
          <Bar dataKey="high" fill={COLORS.high} name="High" radius={[4, 4, 0, 0]} />
          <Bar dataKey="medium" fill={COLORS.medium} name="Medium" radius={[4, 4, 0, 0]} />
          <Bar dataKey="low" fill={COLORS.low} name="Low" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

