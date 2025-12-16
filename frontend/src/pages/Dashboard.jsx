import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getProfile } from "@/api/auth";
import { toast } from "@/hooks/use-toast";

import { StreakCounter } from "@/components/gamification/StreakCounter";
import { XPProgressBar } from "@/components/gamification/XPProgressBar";
import { GrowingTree } from "@/components/gamification/GrowingTree";
import { AchievementBadges } from "@/components/gamification/AchievementBadges";
import { WeeklyChallenges } from "@/components/gamification/WeeklyChallenges";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { MotivationFeed } from "@/components/feed/MotivationFeed";
import { AIBuddy } from "@/components/buddy/AIBuddy";
import { AccountMenu } from "@/components/account/AccountMenu";
import { Button } from "@/components/ui/button";

const mockStats = {
  streak: 14,
  xp: 2450,
  maxXp: 3000,
  level: 12,
  isActive: true,
};

const mockBadges = [
  { id: "1", emoji: "🏅", name: "First Post", unlocked: true },
  { id: "2", emoji: "🔥", name: "7-Day Streak", unlocked: true },
  { id: "3", emoji: "👑", name: "Challenge Master", unlocked: true },
];

const mockChallenges = [
  { id: "1", title: "Walk 5000 steps", emoji: "🚶", progress: 4200, target: 5000, unit: "steps" },
  { id: "2", title: "Read 20 minutes", emoji: "📚", progress: 10, target: 20, unit: "min" },
];

const mockLeaderboard = [
  { id: "1", name: "Alex Champion", avatar: "😎", xp: 2450, level: 12, streak: 14 },
  { id: "2", name: "Jordan Flow", avatar: "🌟", xp: 3200, level: 15, streak: 21 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Normalize posts so MotivationFeed works properly
  function normalizePosts(list) {
    return (list || []).map((p) => ({
      id: p.id,
      content: p.content,
      timestamp: p.timestamp,
      author: {
        name: p.author?.name || "Unknown User",
        avatar: p.author?.avatar || "🙂",
        level: p.author?.level || 1,
      },
      reactions: p.reactions || [],
      comments: p.comments || [],
    }));
  }

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      const profile = await getProfile();

      if (!profile.success) {
        toast({ title: "Session expired", description: "Please log in again." });
        localStorage.removeItem("token");
        return navigate("/");
      }

      const mergedUser = {
        ...profile.user,
        ...mockStats,
        avatar: "😎",
        name: `${profile.user.firstName} ${profile.user.lastName}`,
      };

      setUser(mergedUser);

      // Fetch posts
      const res = await fetch("http://localhost:4000/api/posts");
      const data = await res.json();

      const normalized = normalizePosts(data.posts);
      setPosts(normalized);

      setLoading(false);
    }

    init();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading || !user) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/")}
          >
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🚀
            </motion.span>
            <div>
              <h1 className="text-2xl font-bold text-gradient-fire">BuddyBoost</h1>
              <p className="text-xs text-muted-foreground">Level up your life!</p>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="fire" onClick={() => navigate("/challenges")}>
              🎯 Challenges
            </Button>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50">
              <span className="text-xl fire-flicker">🔥</span>
              <span className="font-bold">{user.streak}</span>
            </div>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-xp/10 border border-xp/30">
              <span className="text-xl">⚡</span>
              <span className="font-bold text-xp">{user.xp.toLocaleString()}</span>
            </div>

            <AccountMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </motion.header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">

        <h2 className="text-3xl font-bold mb-8">
          Welcome back, <span className="text-gradient-fire">{user.name}</span>! 👋
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="space-y-6">
            <StreakCounter streak={user.streak} isActive={user.isActive} />
            <XPProgressBar currentXP={user.xp} maxXP={user.maxXp} level={user.level} />
            <GrowingTree level={user.level} xp={user.xp} />
          </div>

          {/* Feed */}
          <div className="lg:col-span-1">
            <MotivationFeed
              posts={posts}
              isAuthenticated={true}
              currentUser={{ name: user.name, avatar: user.avatar, level: user.level }}
            />
          </div>

          {/* Right */}
          <div className="space-y-6">
            <WeeklyChallenges challenges={mockChallenges} weekTheme="Healthy Habits" />
            <Leaderboard users={mockLeaderboard} currentUserId={user.userId} />
          </div>
        </div>

        <div className="mt-8">
          <AchievementBadges badges={mockBadges} />
        </div>
      </main>

      <AIBuddy />
    </div>
  );
}
