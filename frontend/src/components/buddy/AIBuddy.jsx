import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button.jsx";

const boostyResponses = [
  "You're doing amazing! Keep that streak alive! 🔥",
  "Remember to drink some water today! 💧",
  "I believe in you! One step at a time! 🌟",
  "Hey champion! Ready to crush some goals? 💪",
  "You've got this! I'm here cheering for you! 🎉",
  "Take a deep breath. You're making progress! 🌱",
  "Pro tip: Small wins lead to big victories! 🏆",
  "Don't forget to celebrate your achievements! 🥳",
];

const moodOptions = [
  { emoji: "😊", label: "Great", response: "That's wonderful to hear! Let's keep that positive energy going! ✨" },
  { emoji: "😐", label: "Okay", response: "Every day is a new opportunity! Want to try a small challenge? 💪" },
  { emoji: "😔", label: "Down", response: "I'm here for you! Remember, tough times don't last. You're stronger than you think! 💙" },
  { emoji: "😤", label: "Stressed", response: "Take a moment to breathe deeply. You're handling things better than you think! 🧘" },
];

export function AIBuddy() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: "1", type: "buddy", content: "Hey there! 🌟 I'm Boosty, your motivation buddy! How are you feeling today?" },
  ]);
  const [showMoodPicker, setShowMoodPicker] = useState(true);

  const handleMoodSelect = (mood) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user", content: `I'm feeling ${mood.label.toLowerCase()} ${mood.emoji}` },
      { id: (Date.now() + 1).toString(), type: "buddy", content: mood.response },
    ]);
    setShowMoodPicker(false);
  };

  const getRandomTip = () => {
    const tip = boostyResponses[Math.floor(Math.random() * boostyResponses.length)];
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user", content: "Give me a tip!" },
      { id: (Date.now() + 1).toString(), type: "buddy", content: tip },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-buddy to-secondary shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -5, 0],
          boxShadow: [
            "0 0 20px hsl(var(--buddy-blue) / 0.4)",
            "0 0 30px hsl(var(--buddy-blue) / 0.6)",
            "0 0 20px hsl(var(--buddy-blue) / 0.4)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-3xl">🤖</span>
        <motion.span
          className="absolute -top-1 -right-1 w-4 h-4 bg-fire rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-buddy/20 to-secondary/20 p-4 border-b border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="text-3xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🤖
                  </motion.div>
                  <div>
                    <h3 className="font-bold">Boosty</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-growth animate-pulse" />
                      Always here for you
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  ✕
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${msg.type === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                      }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {/* Mood Picker */}
              {showMoodPicker && (
                <motion.div
                  className="flex flex-wrap gap-2 justify-center mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {moodOptions.map((mood) => (
                    <motion.button
                      key={mood.label}
                      onClick={() => handleMoodSelect(mood)}
                      className="flex flex-col items-center p-2 rounded-xl bg-card/50 hover:bg-card border border-border/30 hover:border-primary/30 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className="text-xs">{mood.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-border/30 space-y-2">
              <div className="flex gap-2">
                <Button variant="glass" size="sm" className="flex-1" onClick={getRandomTip}>
                  💡 Get a Tip
                </Button>
                <Button variant="glass" size="sm" className="flex-1" onClick={() => setShowMoodPicker(true)}>
                  🎭 Mood Check
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
