import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { toast } from "@/hooks/use-toast.js";

export function CommentsSheet({
  isOpen,
  onClose,
  postId,
  postAuthor,
  initialComments,
  onAddComment,
}) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: { name: "You", avatar: "😎", level: 12 },
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      liked: false,
    };

    setComments([...comments, comment]);
    onAddComment(postId, newComment);
    setNewComment("");

    toast({
      title: "Comment added! 💬",
      description: "You earned +2 XP!",
    });
  };

  const handleLikeComment = (commentId) => {
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="h-full glass-card rounded-l-3xl flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Comments 💬</h2>
                    <p className="text-sm text-muted-foreground">
                      On {postAuthor}'s post
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    ✕
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <motion.span
                      className="text-6xl block mb-4"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      💭
                    </motion.span>
                    <p className="text-muted-foreground">
                      No comments yet. Be the first!
                    </p>
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      className="bg-card/50 rounded-xl p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl">
                            {comment.author.avatar}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-xp flex items-center justify-center text-[10px] font-bold">
                            {comment.author.level}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/90 mb-2">
                            {comment.content}
                          </p>
                          <motion.button
                            onClick={() => handleLikeComment(comment.id)}
                            className={`flex items-center gap-1 text-sm ${comment.liked
                                ? "text-fire"
                                : "text-muted-foreground"
                              }`}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span>{comment.liked ? "❤️" : "🤍"}</span>
                            <span>{comment.likes}</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-border/30">
                <div className="flex gap-3">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                    className="flex-1 bg-muted/50"
                  />
                  <Button variant="fire" onClick={handleSubmitComment}>
                    Send
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  +2 XP per comment!
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
