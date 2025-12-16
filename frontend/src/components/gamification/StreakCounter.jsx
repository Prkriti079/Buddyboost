import { motion } from "framer-motion";

export function StreakCounter({ streak, isActive = true }) {
  return (
    <motion.div
      className="glass-card p-6 flex flex-col items-center justify-center gap-3"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <motion.div
        className="relative"
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
      >
        <span
          className={`text-6xl fire-flicker ${isActive ? "fire-glow" : "opacity-50"
            }`}
        >
          🔥
        </span>

        {/* Sparkles when active */}
        {isActive && (
          <>
            <motion.span
              className="absolute -top-1 -right-1 text-2xl"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            >
              ✨
            </motion.span>

            <motion.span
              className="absolute -bottom-1 -left-1 text-xl"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
            >
              ✨
            </motion.span>
          </>
        )}
      </motion.div>

      {/* Streak Number */}
      <div className="text-center">
        <motion.span
          className="text-4xl font-bold text-gradient-fire"
          key={streak}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {streak}
        </motion.span>
        <p className="text-muted-foreground text-sm mt-1">Day Streak</p>
      </div>

      {/* Motivational Text */}
      {isActive && streak > 0 && (
        <motion.p
          className="text-xs text-fire font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Keep it going! 🎯
        </motion.p>
      )}

      {/* Warning if inactive */}
      {!isActive && (
        <motion.p
          className="text-xs text-destructive font-medium shake"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Don't lose your streak! ⚠️
        </motion.p>
      )}
    </motion.div>
  );
}
