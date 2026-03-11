'use client';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RiskTrendData {
  month: string;
  inherent: number;
  residual: number;
  target: number;
}

interface RiskTrendChartProps {
  data: RiskTrendData[];
}

export default function RiskTrendChart({ data }: RiskTrendChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-sm shadow-lg">
          <p className="text-xs font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorInherent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorResidual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 10 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            stroke="#6b7280"
            label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '10px' }}
            iconType="line"
          />
          <Area
            type="monotone"
            dataKey="inherent"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorInherent)"
            name="Inherent Risk"
          />
          <Area
            type="monotone"
            dataKey="residual"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorResidual)"
            name="Residual Risk"
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTarget)"
            name="Target Risk"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

