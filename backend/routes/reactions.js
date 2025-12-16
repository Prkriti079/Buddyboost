// backend/routes/reactions.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Auth middleware
function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ success: false, message: "Token required" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ success: false, message: "Invalid token" });

        req.userId = decoded.userId;
        next();
    });
}

/**
 * CREATE / TOGGLE REACTION
 */
router.post("/", auth, async (req, res) => {
    try {
        const { post_id, reaction_type } = req.body;

        if (!post_id || !reaction_type)
            return res
                .status(400)
                .json({ success: false, message: "Missing fields" });

        const existing = await pool.query(
            `SELECT * FROM reactions WHERE post_id=$1 AND user_id=$2`,
            [post_id, req.userId]
        );

        // If clicking same reaction → remove (unlike)
        if (
            existing.rows.length > 0 &&
            existing.rows[0].reaction_type === reaction_type
        ) {
            await pool.query(
                `DELETE FROM reactions WHERE reaction_id=$1`,
                [existing.rows[0].reaction_id]
            );

            return res.json({ success: true, removed: true });
        }

        // If exists but different → update
        if (existing.rows.length > 0) {
            const updated = await pool.query(
                `UPDATE reactions
         SET reaction_type=$1, created_at=NOW()
         WHERE reaction_id=$2
         RETURNING *`,
                [reaction_type, existing.rows[0].reaction_id]
            );

            return res.json({ success: true, reaction: updated.rows[0] });
        }

        // Otherwise → insert new
        const inserted = await pool.query(
            `INSERT INTO reactions (post_id, user_id, reaction_type, created_at)
       VALUES ($1,$2,$3,NOW()) RETURNING *`,
            [post_id, req.userId, reaction_type]
        );

        res.json({ success: true, reaction: inserted.rows[0] });
    } catch (err) {
        console.error("Reaction error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * GET REACTIONS FOR A POST
 */
router.get("/post/:id", async (req, res) => {
    try {
        const postId = req.params.id;

        const result = await pool.query(
            `SELECT * FROM reactions WHERE post_id=$1`,
            [postId]
        );

        res.json({ success: true, reactions: result.rows });
    } catch (err) {
        console.error("Fetch reactions error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
