
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SongWithStats } from '../types';

interface StatsChartProps {
  data: SongWithStats[];
  isDarkMode?: boolean;
}

const StatsChart: React.FC<StatsChartProps> = ({ data, isDarkMode }) => {
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
      <div className="flex items-center justify-center h-full text-neutral-400 font-black uppercase tracking-widest text-xs italic">
        Sin datos de votación activa
      </div>
    );
  }

  const COLORS = ['#F2CB05', '#F2B705', '#594302', '#F2CB05', '#F2B705'];
  const textColor = isDarkMode ? '#F2F2F2' : '#0D0D0D';
  const gridColor = isDarkMode ? '#2A2A2A' : '#F2F2F2';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={gridColor} />
        <XAxis 
          type="number" 
          stroke={textColor} 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          hide 
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          stroke={textColor} 
          fontSize={10} 
          width={100}
          tickLine={false}
          axisLine={false}
          tick={{ fontWeight: 800, textTransform: 'uppercase', fontStyle: 'italic', fill: textColor }}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF', 
            borderColor: '#F2CB05', 
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(242, 203, 5, 0.2)',
            padding: '12px',
            color: textColor
          }}
          itemStyle={{ color: textColor, fontWeight: 900, textTransform: 'uppercase' }}
          cursor={{ fill: isDarkMode ? '#2A2A2A' : '#F2F2F2' }}
          formatter={(value: number) => [`${value} Votos`, 'Conteo']}
        />
        <Bar dataKey="votos" radius={[0, 8, 8, 0]} barSize={28}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StatsChart;
