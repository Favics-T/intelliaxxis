import type { FC } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Signal } from '../../types/intelligence';

interface Props {
  signals: Signal[];
}

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

const CustomTooltip: FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-surface px-4 py-3 shadow-xl">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-textSecondary">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="font-mono text-[11px] text-textSecondary">
            {entry.name}:
          </span>
          <span className="font-mono text-[11px] font-medium text-textPrimary">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Generate trend data from signals + simulated history
const generateTrendData = (signals: Signal[]) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];

  return days.map((day, i) => {
    const isToday = i === days.length - 1;

    // Today uses real signal data
    if (isToday) {
      return {
        day,
        High:        signals.filter(s => ['Critical', 'High'].includes(s.impactLevel)).length,
        Medium:      signals.filter(s => s.impactLevel === 'Medium').length,
        Opportunity: signals.filter(s => s.category === 'Opportunity').length,
      };
    }

    // Past days simulated (realistic variation)
    const base = Math.max(signals.length - 2, 2);
    return {
      day,
      High:        Math.max(1, Math.round(base * 0.4 + (Math.random() - 0.5) * 2)),
      Medium:      Math.max(1, Math.round(base * 0.4 + (Math.random() - 0.5) * 2)),
      Opportunity: Math.max(0, Math.round(base * 0.2 + (Math.random() - 0.5) * 1)),
    };
  });
};

export const TrendChart: FC<Props> = ({ signals }) => {
  if (signals.length === 0) return null;

  const data = generateTrendData(signals);

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <p className="label-tag mb-0">Signal Volume — 7 Days</p>
        <p className="font-mono text-[10px] text-textSecondary">
          Intelligence trend
        </p>
      </div>

      <div className="h-50 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="colorOpp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              dataKey="day"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'DM Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'DM Mono' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: '10px',
                fontFamily: 'DM Mono',
                color: '#64748b',
                paddingTop: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="High"
              stroke="#f59e0b"
              strokeWidth={1.5}
              fill="url(#colorHigh)"
              dot={false}
              activeDot={{ r: 4, fill: '#f59e0b' }}
            />
            <Area
              type="monotone"
              dataKey="Medium"
              stroke="#22d3ee"
              strokeWidth={1.5}
              fill="url(#colorMedium)"
              dot={false}
              activeDot={{ r: 4, fill: '#22d3ee' }}
            />
            <Area
              type="monotone"
              dataKey="Opportunity"
              stroke="#10b981"
              strokeWidth={1.5}
              fill="url(#colorOpp)"
              dot={false}
              activeDot={{ r: 4, fill: '#10b981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};