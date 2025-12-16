import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import {
    getDiscoverChallenges,
    getMyChallenges,
    joinChallenge,
    createChallenge
} from "@/api/challenges";

export default function ChallengesPage() {
    const [tab, setTab] = useState("discover");
    const [discover, setDiscover] = useState([]);
    const [mine, setMine] = useState([]);

    useEffect(() => {
        loadDiscover();
        loadMine();
    }, []);

    async function loadDiscover() {
        const res = await getDiscoverChallenges();
        if (res.success) setDiscover(res.challenges);
    }

    async function loadMine() {
        const res = await getMyChallenges();
        if (res.success) setMine(res.items);
    }

    async function handleJoin(id) {
        const res = await joinChallenge(id);
        if (res.success) {
            toast({ title: "Joined!", description: "Challenge added to your list." });
            loadMine();
        } else {
            toast({ title: "Already joined" });
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        const form = new FormData(e.target);

        const data = {
            title: form.get("title"),
            emoji: form.get("emoji"),
            description: form.get("description"),
            category: form.get("category"),
            duration_days: form.get("duration"),
        };

        const res = await createChallenge(data);

        if (res.success) {
            toast({ title: "Challenge Created!" });
            loadDiscover();
            setTab("discover");
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">

            {/* Back Button */}
            <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
                ← Back to Dashboard
            </Button>

            <h1 className="text-3xl font-bold mt-4 mb-6">🎯 Challenges</h1>

            <div className="flex gap-4 mb-6">
                {["discover", "mine", "create"].map((t) => (
                    <Button
                        key={t}
                        variant={tab === t ? "fire" : "outline"}
                        onClick={() => setTab(t)}
                    >
                        {t === "discover" && "🔥 Discover"}
                        {t === "mine" && "📌 My Challenges"}
                        {t === "create" && "➕ Create"}
                    </Button>
                ))}
            </div>

            {/* DISCOVER TAB */}
            {tab === "discover" && (
                <div className="grid md:grid-cols-2 gap-4">
                    {discover.map((c) => (
                        <motion.div key={c.challenge_id} className="glass-card p-4">
                            <h2 className="text-xl font-bold">{c.emoji} {c.title}</h2>
                            <p className="text-muted-foreground">{c.description}</p>
                            <Button className="mt-3" onClick={() => handleJoin(c.challenge_id)}>
                                Join Challenge
                            </Button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* MY CHALLENGES */}
            {tab === "mine" && (
                <div className="grid md:grid-cols-2 gap-4">
                    {mine.length === 0 && (
                        <p className="text-muted-foreground">No challenges joined yet.</p>
                    )}
                    {mine.map((c) => (
                        <motion.div key={c.challenge_id} className="glass-card p-4">
                            <h2 className="text-xl font-bold">{c.emoji} {c.title}</h2>
                            <p>{c.description}</p>
                            <p className="text-sm mt-2 text-muted-foreground">
                                Day {c.days_completed} / {c.duration_days}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* CREATE CHALLENGE */}
            {tab === "create" && (
                <form
                    onSubmit={handleCreate}
                    className="glass-card p-6 max-w-xl rounded-xl shadow-md border border-border/50 space-y-4"
                >
                    <h2 className="text-2xl font-bold mb-4">➕ Create a New Challenge</h2>

                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Challenge Title</label>
                        <input
                            name="title"
                            placeholder="e.g., 10K Steps Challenge"
                            required
                            className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-fire focus:outline-none"
                        />
                    </div>

                    {/* Emoji */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Emoji</label>
                        <input
                            name="emoji"
                            placeholder="💪"
                            className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-fire focus:outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            placeholder="Describe your challenge..."
                            className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-fire focus:outline-none h-28"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Category</label>
                        <input
                            name="category"
                            placeholder="Fitness, Mindfulness, Productivity, etc."
                            className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-fire focus:outline-none"
                        />
                    </div>

                    {/* Duration */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Duration (Days)</label>
                        <input
                            name="duration"
                            type="number"
                            placeholder="e.g., 7"
                            required
                            className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-fire focus:outline-none"
                        />
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        variant="fire"
                        className="w-full py-3 text-lg rounded-lg"
                    >
                        Create Challenge
                    </Button>
                </form>
            )}

        </div>
    );
}
