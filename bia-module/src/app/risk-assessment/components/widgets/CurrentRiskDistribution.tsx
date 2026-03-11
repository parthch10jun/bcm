'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskDistributionData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface CurrentRiskDistributionProps {
  data: RiskDistributionData[];
}

export default function CurrentRiskDistribution({ data }: CurrentRiskDistributionProps) {
  const totalRisks = data.reduce((sum, item) => sum + item.value, 0);

  const renderCustomizedLabel = () => {
    return (
      <text 
        x="50%" 
        y="50%" 
        textAnchor="middle" 
        dominantBaseline="middle" 
        className="fill-gray-900 text-2xl font-bold"
      >
        {totalRisks}
      </text>
    );
  };

  const renderSubLabel = () => {
    return (
      <text 
        x="50%" 
        y="60%" 
        textAnchor="middle" 
        dominantBaseline="middle" 
        className="fill-gray-600 text-sm"
      >
        Risks
      </text>
    );
  };

  return (
    <div className="h-64 flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {renderCustomizedLabel()}
            {renderSubLabel()}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 px-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center min-w-0">
            <div
              className="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600 whitespace-nowrap">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
