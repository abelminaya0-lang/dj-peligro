
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SongWithStats } from '../types';

interface StatsChartProps {
  data: SongWithStats[];
}

const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  // Take only top 5 for cleaner chart, and only if they have votes
  const chartData = data
    .filter(item => item.voteCount > 0)
    .slice(0, 5)
    .map(item => ({
      name: item.title,
      votos: item.voteCount,
      artist: item.artist
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-600 font-bold uppercase tracking-widest text-xs">
        Sin datos de votación
      </div>
    );
  }

  const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#262626" />
        <XAxis 
          type="number" 
          stroke="#525252" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          hide 
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          stroke="#d4d4d4" 
          fontSize={10} 
          width={100}
          tickLine={false}
          axisLine={false}
          tick={{ fontWeight: 600 }}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: '#171717', 
            borderColor: '#262626', 
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
          }}
          itemStyle={{ color: '#22c55e', fontWeight: 700 }}
          cursor={{ fill: '#171717' }}
          formatter={(value: number) => [`${value} Votos`, 'Conteo']}
        />
        <Bar dataKey="votos" radius={[0, 4, 4, 0]} barSize={32}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StatsChart;
