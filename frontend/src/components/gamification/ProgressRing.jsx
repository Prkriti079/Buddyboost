import { motion } from "framer-motion";

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "fire",
  label,
  value,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorMap = {
    fire: { stroke: "url(#fireGradient)", bg: "hsl(var(--fire) / 0.2)" },
    purple: { stroke: "url(#purpleGradient)", bg: "hsl(var(--xp-purple) / 0.2)" },
    growth: { stroke: "url(#growthGradient)", bg: "hsl(var(--growth-green) / 0.2)" },
    gold: { stroke: "url(#goldGradient)", bg: "hsl(var(--gold) / 0.2)" },
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="progress-ring">
        <defs>
          <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--fire))" />
            <stop offset="50%" stopColor="hsl(var(--fire-glow))" />
            <stop offset="100%" stopColor="hsl(var(--gold))" />
          </linearGradient>

          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--xp-purple))" />
            <stop offset="100%" stopColor="hsl(var(--xp-purple-light))" />
          </linearGradient>

          <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--growth-green))" />
            <stop offset="100%" stopColor="hsl(var(--growth-green-light))" />
          </linearGradient>

          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--gold))" />
            <stop offset="100%" stopColor="hsl(var(--gold-light))" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color].bg}
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color].stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {value && (
          <motion.span
            className="text-2xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {value}
          </motion.span>
        )}

        {label && (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  );
}
