import { motion } from "framer-motion";

export function XPProgressBar({ currentXP, maxXP, level }) {
  const progress = (currentXP / maxXP) * 100;

  const getLevelColor = (lvl) => {
    if (lvl >= 30) return "from-gold to-gold-light";
    if (lvl >= 20) return "from-xp to-xp-light";
    if (lvl >= 10) return "from-growth to-growth-light";
    return "from-fire to-fire-glow";
  };

  const getLevelEmoji = (lvl) => {
    if (lvl >= 50) return "👑";
    if (lvl >= 30) return "💎";
    if (lvl >= 20) return "⭐";
    if (lvl >= 10) return "🌟";
    if (lvl >= 5) return "✨";
    return "🔰";
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${getLevelColor(
              level
            )} flex items-center justify-center level-glow`}
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <span className="text-2xl">{getLevelEmoji(level)}</span>
          </motion.div>

          <div>
            <h3 className="font-bold text-lg">Level {level}</h3>
            <p className="text-muted-foreground text-sm">
              {currentXP} / {maxXP} XP
            </p>
          </div>
        </div>

        <motion.span
          className="text-gradient-purple font-bold text-xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          +{maxXP - currentXP} to go
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getLevelColor(
            level
          )} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Level labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Lv. {level}</span>
        <span>Lv. {level + 1}</span>
      </div>
    </motion.div>
  );
}
