import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button.jsx";
import { CreatePostModal } from "./CreatePostModal.jsx";
import { CommentsSheet } from "./CommentsSheet.jsx";
import { toast } from "@/hooks/use-toast.js";

const reactionEmojis = ["❤️", "🔥", "💪", "🎉", "👏", "⭐"];

export function MotivationFeed({
  posts: initialPosts = [],
  isAuthenticated = true,
  currentUser = { name: "You", avatar: "😎", level: 12 },
}) {
  // Normalize post structure
  const normalizePosts = (posts) =>
    (posts ?? []).map((p) => ({
      ...p,
      reactions: p.reactions ?? [],
      comments: p.comments ?? [],
    }));

  const [feedPosts, setFeedPosts] = useState(normalizePosts(initialPosts));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);

  // Update when parent sends new posts
  useEffect(() => {
    setFeedPosts(normalizePosts(initialPosts));
  }, [initialPosts]);

  // ❤️ / 🔥 reactions
  const handleReaction = (postId, emoji) => {
    if (!isAuthenticated) return;

    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const reactions = post.reactions ?? [];
        const existing = reactions.find((r) => r.emoji === emoji);

        // Toggle reaction
        if (existing) {
          const updated = reactions.map((r) =>
            r.emoji === emoji
              ? {
                ...r,
                count: r.reacted ? r.count - 1 : r.count + 1,
                reacted: !r.reacted,
              }
              : r
          );

          if (!existing.reacted) {
            toast({ title: "Reacted!", description: `You ${emoji} this post!` });
          }

          return { ...post, reactions: updated };
        }

        // First time reaction
        toast({ title: "Reacted!", description: `You ${emoji} this post!` });

        return {
          ...post,
          reactions: [...reactions, { emoji, count: 1, reacted: true }],
        };
      })
    );
  };

  // Create post locally
  const handleCreatePost = (content, goal) => {
    const newPost = {
      id: Date.now().toString(),
      author: currentUser,
      content,
      timestamp: "Just now",
      goal,
      reactions: [],
      comments: [],
    };

    setFeedPosts((prev) => [newPost, ...prev]);
  };

  // Add comment
  const handleAddComment = (postId, comment) => {
    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
            ...post,
            comments: [
              ...(post.comments ?? []),
              {
                id: Date.now().toString(),
                author: currentUser,
                content: comment,
                timestamp: "Just now",
                likes: 0,
                liked: false,
              },
            ],
          }
          : post
      )
    );
  };

  // DELETE POST
  const handleDeletePost = (postId) => {
    setFeedPosts((prev) => prev.filter((p) => p.id !== postId));
    toast({ title: "Post deleted", description: "Your post has been removed." });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🌟 Motivation Feed</h2>

        {isAuthenticated && (
          <Button variant="fire" size="sm" onClick={() => setShowCreateModal(true)}>
            ✏️ New Post
          </Button>
        )}
      </div>

      {/* Empty State */}
      {feedPosts.length === 0 && (
        <div className="text-center text-muted-foreground py-16">
          <p>No posts yet. Be the first to share something! 🚀</p>
          <Button variant="fire" className="mt-4" onClick={() => setShowCreateModal(true)}>
            Create Your First Post
          </Button>
        </div>
      )}

      {/* POSTS */}
      <div className="space-y-4">
        <AnimatePresence>
          {feedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="glass-card-hover p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              {/* AUTHOR */}
              <div className="flex items-center gap-3 mb-4">
                <motion.div className="relative" whileHover={{ scale: 1.1 }}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                    {post?.author?.avatar ?? "🙂"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-xp flex items-center justify-center text-[10px]">
                    {post?.author?.level ?? 1}
                  </div>
                </motion.div>

                <div>
                  <p className="font-semibold">{post?.author?.name ?? "Unknown User"}</p>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>

              {/* CONTENT */}
              <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

              {/* ACTIONS: ❤️ + ➕ + 💬 + 🗑 */}
              <div className="flex items-center gap-3 flex-wrap mt-2">

                {/* ❤️ LIKE BUTTON */}
                <motion.button
                  onClick={() => handleReaction(post.id, "❤️")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm 
                    ${post.reactions.find((r) => r.emoji === "❤️" && r.reacted)
                      ? "bg-red-500/20 border border-red-500 text-red-600"
                      : "bg-muted/50 border border-border/30 hover:border-red-400"
                    }
                  `}
                >
                  ❤️
                  <span>{post.reactions.find((r) => r.emoji === "❤️")?.count || 0}</span>
                </motion.button>

                {/* ➕ ADD EMOJI */}
                <div className="relative">
                  <motion.button
                    onClick={() =>
                      setShowReactionPicker(showReactionPicker === post.id ? null : post.id)
                    }
                    className="w-8 h-8 rounded-full bg-muted/50 border border-border/30 hover:border-primary/30 flex items-center justify-center"
                  >
                    +
                  </motion.button>

                  {/* Picker */}
                  <AnimatePresence>
                    {showReactionPicker === post.id && (
                      <motion.div
                        className="absolute bottom-full left-0 mb-2 flex gap-1 p-2 rounded-xl bg-card border border-border shadow-lg z-20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {reactionEmojis.map(
                          (emoji) =>
                            emoji !== "❤️" && (
                              <motion.button
                                key={emoji}
                                className="text-xl p-1 hover:bg-muted rounded-lg"
                                onClick={() => handleReaction(post.id, emoji)}
                              >
                                {emoji}
                              </motion.button>
                            )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 💬 COMMENTS */}
                <motion.button
                  onClick={() => setSelectedPostForComments(post)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  💬 {post.comments.length}
                </motion.button>

                {/* 🗑 DELETE → only if current user wrote the post */}
                {post.author?.name === currentUser.name && (
                  <motion.button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    🗑 Delete
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MODALS */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPost={handleCreatePost}
      />

      {selectedPostForComments && (
        <CommentsSheet
          isOpen
          onClose={() => setSelectedPostForComments(null)}
          postId={selectedPostForComments.id}
          postAuthor={selectedPostForComments.author?.name}
          initialComments={selectedPostForComments.comments}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}
