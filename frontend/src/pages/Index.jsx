import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";

const Index = () => {
  const navigate = useNavigate();

  // Modal State
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  // When login/signup succeeds
  function handleAuthSuccess(user, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  }

  const features = [
    { emoji: "🔥", title: "Daily Streaks", desc: "Keep your motivation burning bright" },
    { emoji: "🌱", title: "Progress Tree", desc: "Watch your growth come to life" },
    { emoji: "🏆", title: "Achievements", desc: "Unlock badges that reward your consistency" },
    { emoji: "🤖", title: "AI Buddy", desc: "Your personal motivation coach" },
    { emoji: "⚡", title: "Challenges", desc: "Weekly goals to push new limits" },
    { emoji: "👥", title: "Community", desc: "Connect with fellow achievers" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">

      {/* ===== LOGIN MODAL ===== */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* ===== SIGNUP MODAL ===== */}
      <SignupModal
        isOpen={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-fire/10 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-xp/10 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-4xl">🚀</span>
            <span className="text-2xl font-bold text-gradient-fire">BuddyBoost</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="ghost" onClick={() => setLoginOpen(true)}>
              Log In
            </Button>
            <Button variant="fire" onClick={() => setSignupOpen(true)}>
              Get Started
            </Button>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* HERO CONTENT */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Turn Your Goals Into <br />
            <span className="text-gradient-fire">Epic Adventures</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            BuddyBoost gamifies your personal growth — track streaks, earn XP,
            unlock achievements, and grow your virtual progress tree.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="fire" size="xl" className="w-full sm:w-auto" onClick={() => setSignupOpen(true)}>
              Start Your Journey 🚀
            </Button>

            <Button variant="glass" size="xl" className="w-full sm:w-auto">
              Watch Demo 📺
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="glass-card-hover p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-4xl">{f.emoji}</span>
                <h3 className="font-bold text-lg mt-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Made with ❤️ by BuddyBoost Team</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
