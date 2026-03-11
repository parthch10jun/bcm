'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ActionPlanData {
  name: string;
  value: number;
  color: string;
}

interface ActionPlanStatusProps {
  data: ActionPlanData[];
}

export default function ActionPlanStatus({ data }: ActionPlanStatusProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 flex flex-col">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              stroke="#6b7280"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={40}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-2 grid grid-cols-3 gap-1 text-center">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div
              className="text-lg font-bold"
              style={{ color: item.color }}
            >
              {item.value}
            </div>
            <div className="text-xs text-gray-600 leading-tight">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
