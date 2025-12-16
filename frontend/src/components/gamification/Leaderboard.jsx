import { motion } from "framer-motion";

export function Leaderboard({ users, currentUserId }) {
  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp).slice(0, 10);

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return { bg: "bg-gradient-gold", emoji: "👑", glow: "gold-glow" };
      case 2:
        return { bg: "bg-gray-400", emoji: "🥈", glow: "" };
      case 3:
        return { bg: "bg-amber-600", emoji: "🥉", glow: "" };
      default:
        return { bg: "bg-muted", emoji: "", glow: "" };
    }
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">🏅 Leaderboard</h3>
        <span className="text-sm text-muted-foreground">This week</span>
      </div>

      <div className="space-y-3">
        {sortedUsers.map((user, index) => {
          const rank = index + 1;
          const style = getRankStyle(rank);
          const isCurrentUser = user.id === currentUserId;

          return (
            <motion.div
              key={user.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isCurrentUser
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-card/30 hover:bg-card/50"
                }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ x: 4 }}
            >
              {/* Rank */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rank <= 3 ? style.bg : "bg-muted"
                  } ${style.glow}`}
              >
                {style.emoji || rank}
              </div>

              {/* Avatar */}
              <motion.div className="relative" whileHover={{ scale: 1.1 }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl overflow-hidden">
                  {user.avatar}
                </div>
                {user.streak >= 7 && (
                  <span className="absolute -bottom-1 -right-1 text-sm">🔥</span>
                )}
              </motion.div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold truncate ${isCurrentUser ? "text-primary" : ""
                    }`}
                >
                  {user.name} {isCurrentUser && "(You)"}
                </p>

                <p className="text-xs text-muted-foreground">
                  Level {user.level} • {user.streak}🔥
                </p>
              </div>

              {/* XP */}
              <div className="text-right">
                <motion.p
                  className="font-bold text-gradient-purple"
                  animate={rank === 1 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {user.xp.toLocaleString()}
                </motion.p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
