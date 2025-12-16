const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

// DISCOVER CHALLENGES
router.get("/discover", auth, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM challenges ORDER BY challenge_id ASC"
        );

        res.json({
            success: true,
            challenges: result.rows
        });
    } catch (err) {
        console.error("DISCOVER ERROR:", err);
        res.status(500).json({ success: false, message: "Server error loading challenges" });
    }
});


// MY CHALLENGES

router.get("/mine", auth, async (req, res) => {
    try {
        const userId = req.userId;

        const result = await pool.query(
            `SELECT c.challenge_id, c.title, c.description, c.category, 
                    c.duration_days, c.emoji, uc.days_completed, uc.streak
             FROM user_challenges uc
             JOIN challenges c ON c.challenge_id = uc.challenge_id
             WHERE uc.user_id = $1`,
            [userId]
        );

        res.json({
            success: true,
            items: result.rows,
        });
    } catch (err) {
        console.error("MINE ERROR:", err);
        res.status(500).json({ success: false, message: "Server error loading my challenges" });
    }
});


// JOIN A CHALLENGE
router.post("/join/:id", auth, async (req, res) => {
    try {
        const userId = req.userId;
        const challengeId = req.params.id;

        // Challenge exists?
        const check = await pool.query(
            "SELECT challenge_id FROM challenges WHERE challenge_id=$1",
            [challengeId]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Challenge not found" });
        }

        // Already joined
        const exists = await pool.query(
            "SELECT * FROM user_challenges WHERE user_id=$1 AND challenge_id=$2",
            [userId, challengeId]
        );

        if (exists.rows.length > 0) {
            return res.json({ success: false, message: "Already joined" });
        }

        // Insert join
        await pool.query(
            `INSERT INTO user_challenges (user_id, challenge_id, start_date, last_checkin_date, days_completed, streak, is_completed)
             VALUES ($1, $2, NOW(), NULL, 0, 0, false)`,
            [userId, challengeId]
        );

        res.json({ success: true, message: "Challenge joined successfully!" });

    } catch (err) {
        console.error("JOIN ERROR:", err);
        res.status(500).json({ success: false, message: "Server error joining challenge" });
    }
});


// CREATE A NEW CUSTOM CHALLENGE
router.post("/create", auth, async (req, res) => {
    try {
        const userId = req.userId;
        const { title, description, category, duration_days, emoji } = req.body;

        if (!title || !duration_days)
            return res.status(400).json({ success: false, message: "Missing fields" });

        const result = await pool.query(
            `INSERT INTO challenges (creator_id, title, description, category, duration_days, emoji, reward_xp, is_predefined, created_at)
             VALUES ($1,$2,$3,$4,$5,$6,50,false,NOW())
             RETURNING challenge_id`,
            [userId, title, description, category, duration_days, emoji]
        );

        res.json({
            success: true,
            challenge_id: result.rows[0].challenge_id,
            message: "Challenge created!"
        });

    } catch (err) {
        console.error("CREATE ERROR:", err);
        res.status(500).json({ success: false, message: "Server error creating challenge" });
    }
});


module.exports = router;
