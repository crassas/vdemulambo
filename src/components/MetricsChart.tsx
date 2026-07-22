import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Seg', valor: 40 },
  { name: 'Ter', valor: 30 },
  { name: 'Qua', valor: 60 },
  { name: 'Qui', valor: 45 },
  { name: 'Sex', valor: 90 },
  { name: 'Sáb', valor: 75 },
  { name: 'Dom', valor: 95 },
];

export function MetricsChart() {
  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f0c1a', 
              border: '1px solid #a855f740', 
              borderRadius: '12px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#a855f7' }}
          />
          <Line 
            type="monotone" 
            dataKey="valor" 
            stroke="#a855f7" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#030305' }}
            activeDot={{ r: 6, fill: '#d8b4fe', stroke: '#a855f7', strokeWidth: 2 }}
            filter="drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
