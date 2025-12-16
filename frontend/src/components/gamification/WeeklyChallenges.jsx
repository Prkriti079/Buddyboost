import { motion } from "framer-motion";
import { ProgressRing } from "./ProgressRing.jsx";

export function WeeklyChallenges({ challenges, weekTheme }) {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">⚡ Weekly Challenges</h3>
          <p className="text-sm text-muted-foreground">Theme: {weekTheme}</p>
        </div>

        <motion.div
          className="px-3 py-1 rounded-full bg-xp/20 text-xp text-sm font-medium"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          6 days left
        </motion.div>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge, index) => {
          const progressPercent = (challenge.progress / challenge.target) * 100;
          const isComplete = progressPercent >= 100;

          return (
            <motion.div
              key={challenge.id}
              className={`p-4 rounded-xl border transition-all ${isComplete
                  ? "bg-growth/10 border-growth/30"
                  : "bg-card/50 border-border/30 hover:border-primary/30"
                }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4">
                {/* Emoji */}
                <motion.span
                  className="text-3xl"
                  animate={isComplete ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isComplete ? Infinity : 0,
                    repeatDelay: 2,
                  }}
                >
                  {challenge.emoji}
                </motion.span>

                {/* Challenge Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{challenge.title}</h4>
                    <span
                      className={`text-sm font-medium ${isComplete ? "text-growth" : "text-muted-foreground"
                        }`}
                    >
                      {challenge.progress}/{challenge.target} {challenge.unit}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`absolute inset-y-0 left-0 rounded-full ${isComplete ? "bg-gradient-growth" : "bg-gradient-fire"
                        }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                      transition={{ duration: 1, delay: 0.2 * index }}
                    />
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center gap-1 text-gold">
                  <span className="text-lg">🪙</span>
                  <span className="font-bold">+{challenge.reward}</span>
                </div>
              </div>

              {/* Completion Message */}
              {isComplete && (
                <motion.div
                  className="mt-2 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="text-sm text-growth font-medium">
                    ✅ Completed! XP earned!
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
