import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

const ChartCard = ({ title, data, dataKey, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 w-full">
      <h3 className="text-lg font-semibold mb-6 text-gray-700">{title}</h3>
      
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Background Grid Lines */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            
            {/* X-Axis (Days) */}
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }} 
              dy={10}
            />
            
            {/* Y-Axis (Values) */}
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            />
            
            {/* Tooltip (Hover karne pe dikhega) */}
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '8px 12px'
              }}
            />
            
            {/* The Bars */}
            <Bar 
              dataKey={dataKey} 
              fill={color} 
              radius={[4, 4, 0, 0]} 
              barSize={40}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;