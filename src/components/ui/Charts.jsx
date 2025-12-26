import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

// Neon color palette
const neonColors = {
  pink: '#ec4899',
  cyan: '#22d3ee',
  yellow: '#facc15',
  green: '#22c55e',
  purple: '#a855f7',
  orange: '#f97316',
};

const colorArray = Object.values(neonColors);

// Custom tooltip styling
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-background/95 backdrop-blur-sm border-2 border-foreground/20 rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-sm mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// Engagement line chart
export function EngagementChart({
  data,
  dataKeys = ['likes', 'comments', 'shares'],
  className,
}) {
  return (
    <div className={cn('w-full h-64', className)}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colorArray[index % colorArray.length]}
              strokeWidth={2}
              dot={{ r: 4, fill: colorArray[index % colorArray.length] }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Area chart for trends
export function TrendChart({ data, dataKey = 'value', color = 'pink', className }) {
  const fillColor = neonColors[color] || neonColors.pink;

  return (
    <div className={cn('w-full h-48', className)}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColor} stopOpacity={0.4} />
              <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={fillColor}
            strokeWidth={2}
            fill={`url(#gradient-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Bar chart for comparisons
export function ComparisonChart({ data, dataKey = 'value', className }) {
  return (
    <div className={cn('w-full h-64', className)}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={colorArray[index % colorArray.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Donut chart for distribution
export function DistributionChart({ data, className }) {
  return (
    <div className={cn('w-full h-64', className)}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={colorArray[index % colorArray.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Voice score gauge
export function VoiceScoreGauge({ score, className }) {
  const percentage = (score / 10) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (score) => {
    if (score >= 8) return neonColors.green;
    if (score >= 6) return neonColors.cyan;
    if (score >= 4) return neonColors.yellow;
    return neonColors.pink;
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width="120" height="120" className="-rotate-90">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={getColor(score)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${getColor(score)}40)`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color: getColor(score) }}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground">/10</span>
      </div>
    </div>
  );
}

// Calendar heatmap
export function CalendarHeatmap({ data, className }) {
  const weeks = 12;
  const days = 7;

  const getIntensity = (value) => {
    if (!value) return 'bg-muted';
    if (value >= 5) return 'bg-pink-500';
    if (value >= 3) return 'bg-pink-400';
    if (value >= 1) return 'bg-pink-300';
    return 'bg-pink-200';
  };

  return (
    <div className={cn('flex gap-1', className)}>
      {Array.from({ length: weeks }).map((_, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {Array.from({ length: days }).map((_, dayIndex) => {
            const dataIndex = weekIndex * days + dayIndex;
            const value = data[dataIndex]?.value || 0;
            return (
              <div
                key={dayIndex}
                className={cn(
                  'w-3 h-3 rounded-sm transition-colors',
                  getIntensity(value)
                )}
                title={data[dataIndex]?.date ? `${data[dataIndex].date}: ${value} posts` : 'No data'}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Stat card with mini chart
export function StatCard({ title, value, change, data, color = 'pink', className }) {
  const isPositive = change >= 0;
  const fillColor = neonColors[color] || neonColors.pink;

  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 border-foreground/10 bg-card',
        className
      )}
    >
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          <p
            className={cn(
              'text-xs font-medium',
              isPositive ? 'text-green-500' : 'text-red-500'
            )}
          >
            {isPositive ? '+' : ''}{change}%
          </p>
        </div>
        {data && (
          <div className="w-24 h-12">
            <ResponsiveContainer>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`stat-gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={fillColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={fillColor}
                  strokeWidth={1.5}
                  fill={`url(#stat-gradient-${color})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default {
  EngagementChart,
  TrendChart,
  ComparisonChart,
  DistributionChart,
  VoiceScoreGauge,
  CalendarHeatmap,
  StatCard,
};
