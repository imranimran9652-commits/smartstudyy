type Props = {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  label?: string;
};

export function ProgressCircle({ value, size = 160, stroke = 14, label }: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 drop-shadow-md">
        <defs>
          <linearGradient id="pcg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.2 300)" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 195)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--muted)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#pcg)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{Math.round(value)}%</span>
        {label && <span className="text-xs text-muted-foreground mt-0.5">{label}</span>}
      </div>
    </div>
  );
}
