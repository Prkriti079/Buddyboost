import { motion } from "framer-motion";

export function GrowingTree({ level, xp }) {
  const getTreeStage = (lvl) => {
    if (lvl >= 30)
      return {
        emoji: "🍎",
        name: "Fruit Tree",
        description: "Fully grown with fruits!",
      };
    if (lvl >= 25)
      return {
        emoji: "🌸",
        name: "Blossoming",
        description: "Beautiful blossoms appear!",
      };
    if (lvl >= 20)
      return { emoji: "🌳", name: "Strong Tree", description: "A mighty oak!" };
    if (lvl >= 15)
      return { emoji: "🌲", name: "Young Tree", description: "Growing tall!" };
    if (lvl >= 10)
      return { emoji: "🌴", name: "Sapling", description: "Taking shape!" };
    if (lvl >= 5)
      return {
        emoji: "🌿",
        name: "Growing Plant",
        description: "Getting stronger!",
      };
    return { emoji: "🌱", name: "Sprout", description: "Just starting!" };
  };

  const stage = getTreeStage(level);

  const groundElements = [
    { emoji: "🌷", delay: 0.2, x: -30 },
    { emoji: "🌼", delay: 0.4, x: 35 },
    { emoji: "🍄", delay: 0.6, x: -45 },
  ];

  return (
    <motion.div
      className="glass-card p-6 flex flex-col items-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="font-bold text-lg mb-4 text-gradient-growth">
        Your Progress Tree
      </h3>

      <div className="relative h-48 w-full flex items-end justify-center">
        {/* Background Glow */}
        <motion.div
          className="absolute bottom-8 w-32 h-32 rounded-full bg-growth/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Tree */}
        <motion.div
          className="tree-sway relative z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.span
            className="text-8xl block green-glow"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {stage.emoji}
          </motion.span>

          {/* Sparkles for higher levels */}
          {level >= 10 && (
            <>
              <motion.span
                className="absolute -top-2 right-0 text-xl sparkle"
                style={{ animationDelay: "0s" }}
              >
                ✨
              </motion.span>
              <motion.span
                className="absolute top-4 -left-4 text-lg sparkle"
                style={{ animationDelay: "0.5s" }}
              >
                ✨
              </motion.span>
            </>
          )}

          {level >= 20 && (
            <motion.span
              className="absolute -top-4 left-2 text-xl sparkle"
              style={{ animationDelay: "1s" }}
            >
              ⭐
            </motion.span>
          )}
        </motion.div>

        {/* Ground Decorations */}
        {level >= 5 &&
          groundElements.map((el, i) => (
            <motion.span
              key={i}
              className="absolute bottom-0 text-2xl"
              style={{ left: `calc(50% + ${el.x}px)` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: el.delay, type: "spring" }}
            >
              {el.emoji}
            </motion.span>
          ))}

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-growth/30 to-transparent rounded-full" />
      </div>

      <div className="text-center mt-4">
        <motion.h4
          className="font-bold text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {stage.name}
        </motion.h4>

        <p className="text-muted-foreground text-sm">{stage.description}</p>

        <p className="text-xs text-growth mt-2">
          {level >= 30
            ? "Max growth reached! 🎉"
            : `${30 - level} levels until max growth`}
        </p>
      </div>
    </motion.div>
  );
}
