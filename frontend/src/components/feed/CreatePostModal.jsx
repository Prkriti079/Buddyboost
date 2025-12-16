import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "@/hooks/use-toast.js";
import confetti from "canvas-confetti";

const goals = [
  { emoji: "💪", label: "Fitness" },
  { emoji: "📚", label: "Learning" },
  { emoji: "🧘", label: "Mindfulness" },
  { emoji: "💼", label: "Career" },
  { emoji: "🎨", label: "Creativity" },
  { emoji: "❤️", label: "Relationships" },
];

export function CreatePostModal({ isOpen, onClose, onPost }) {
  const [content, setContent] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) {
      toast({
        title: "Oops!",
        description: "Please write something to share! ✍️",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    onPost(content, selectedGoal || undefined);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff6b6b", "#ffa500", "#ffff00", "#00ff00", "#00ffff", "#ff00ff"],
    });

    toast({
      title: "Post shared! 🎉",
      description: "You earned +5 XP for posting!",
    });

    setContent("");
    setSelectedGoal(null);
    setIsPosting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* FULLY CENTERED MODAL WRAPPER */}
          <motion.div
            className="
              fixed inset-0 z-50 
              flex justify-center items-center 
              px-4
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* MODAL BOX */}
            <motion.div
              className="
                glass-card p-6 rounded-xl w-full max-w-lg 
                max-h-[90vh] overflow-y-auto
              "
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.span
                    className="text-3xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    ✏️
                  </motion.span>
                  <h2 className="text-xl font-bold">Share Your Win</h2>
                </div>

                <Button variant="ghost" size="icon" onClick={onClose}>
                  ✕
                </Button>
              </div>

              {/* TEXT INPUT */}
              <Textarea
                placeholder="What's your motivation today? Share your progress, wins, or words of encouragement! 🌟"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] bg-muted/50 border-border/50 resize-none mb-4"
                maxLength={500}
              />

              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>{content.length}/500 characters</span>
                <span>+5 XP for posting!</span>
              </div>

              {/* GOAL TAGS */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Tag a goal (optional):
                </p>

                <div className="flex flex-wrap gap-2">
                  {goals.map((goal) => (
                    <motion.button
                      key={goal.label}
                      onClick={() =>
                        setSelectedGoal(
                          selectedGoal === goal.label ? null : goal.label
                        )
                      }
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all
                        ${selectedGoal === goal.label
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 hover:bg-muted"
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{goal.emoji}</span>
                      <span>{goal.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>

                <Button
                  variant="fire"
                  className="flex-1"
                  onClick={handlePost}
                  disabled={isPosting}
                >
                  {isPosting ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⏳
                    </motion.span>
                  ) : (
                    <>Share 🚀</>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
