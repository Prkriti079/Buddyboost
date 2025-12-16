import { motion } from "framer-motion";

export function AchievementBadges({ badges }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { scale: 0, opacity: 0 },
    show: { scale: 1, opacity: 1 },
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">🏆 Achievements</h3>
        <span className="text-sm text-muted-foreground">
          {badges.filter((b) => b.unlocked).length}/{badges.length} unlocked
        </span>
      </div>

      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            variants={item}
            whileHover={badge.unlocked ? { scale: 1.1, rotate: 5 } : {}}
            className={`relative flex flex-col items-center p-3 rounded-xl transition-all ${badge.unlocked
                ? "bg-card/80 border border-gold/30 cursor-pointer"
                : "bg-muted/30 opacity-50"
              }`}
          >
            <motion.span
              className={`text-3xl mb-2 ${badge.unlocked ? "gold-glow" : "grayscale"
                }`}
              animate={badge.unlocked ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {badge.unlocked ? badge.emoji : "🔒"}
            </motion.span>

            <span className="text-xs font-medium text-center leading-tight">
              {badge.name}
            </span>

            {badge.unlocked && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className="text-xs">✓</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
