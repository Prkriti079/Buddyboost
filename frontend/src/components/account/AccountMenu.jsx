import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { toast } from "@/hooks/use-toast.js";

export function AccountMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated! ✨",
      description: "Your changes have been saved.",
    });
    setShowEditProfile(false);
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deleted",
      description: "We're sad to see you go! 😢",
      variant: "destructive",
    });
    setShowDeleteConfirm(false);
    setIsOpen(false);
    onLogout();
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "See you soon! 👋",
    });
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative">
      {/* Avatar Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-card/50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl">
            {user.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-xp flex items-center justify-center text-[10px] font-bold">
            {user.level}
          </div>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-full mt-2 w-72 glass-card p-4 z-50"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 20 }}
            >
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-border/30">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl">
                  {user.avatar}
                </div>
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-xp/20 text-xp px-2 py-0.5 rounded-full">
                      Level {user.level}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2 space-y-1">
                <motion.button
                  onClick={() => setShowEditProfile(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-xl">✏️</span>
                  <span>Edit Profile</span>
                </motion.button>

                <motion.button
                  onClick={() => {
                    toast({ title: "Settings", description: "Coming soon! ⚙️" });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-xl">⚙️</span>
                  <span>Settings</span>
                </motion.button>

                <motion.button
                  onClick={() => {
                    toast({ title: "Privacy", description: "Coming soon! 🔒" });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-xl">🔒</span>
                  <span>Privacy</span>
                </motion.button>

                <div className="border-t border-border/30 my-2" />

                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-xl">👋</span>
                  <span>Log Out</span>
                </motion.button>

                <motion.button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 transition-colors text-left text-destructive"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-xl">🗑️</span>
                  <span>Delete Account</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfile && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditProfile(false)}
            />
            <motion.div
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>✏️</span> Edit Profile
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Display Name
                    </label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      New Password (optional)
                    </label>
                    <Input
                      type="password"
                      placeholder="Leave blank to keep current"
                      className="bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Avatar
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {["😎", "🦊", "🐱", "🦁", "🐼", "🦄", "🐸", "🤖"].map((emoji) => (
                        <motion.button
                          key={emoji}
                          className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-2xl hover:bg-muted"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="ghost" className="flex-1" onClick={() => setShowEditProfile(false)}>
                    Cancel
                  </Button>
                  <Button variant="fire" className="flex-1" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="glass-card p-6 text-center">
                <motion.span
                  className="text-6xl block mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  😢
                </motion.span>
                <h3 className="text-xl font-bold mb-2">Delete Account?</h3>
                <p className="text-muted-foreground mb-6">
                  This will permanently delete your account, streaks, XP, and all your progress. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button variant="ghost" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                    Keep Account
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleDeleteAccount}>
                    Delete Forever
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
