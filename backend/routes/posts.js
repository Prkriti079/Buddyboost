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

// CREATE POST
router.post("/", auth, async (req, res) => {
    try {
        const { content } = req.body;

        const result = await pool.query(
            `INSERT INTO posts (user_id, content, created_at, updated_at)
             VALUES ($1, $2, NOW(), NOW())
             RETURNING post_id, content, created_at`,
            [req.userId, content]
        );

        const user = await pool.query(
            `SELECT first_name, last_name FROM users WHERE user_id = $1`,
            [req.userId]
        );

        res.json({
            success: true,
            post: {
                id: result.rows[0].post_id,
                content: result.rows[0].content,
                timestamp: result.rows[0].created_at,
                author: {
                    name: `${user.rows[0].first_name} ${user.rows[0].last_name}`,
                    avatar: "🙂",
                    level: 1
                },
                reactions: [],
                comments: []
            }
        });

    } catch (err) {
        console.error("Post create error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                p.post_id,
                p.content,
                p.created_at,
                u.first_name,
                u.last_name
             FROM posts p
             JOIN users u ON p.user_id = u.user_id
             ORDER BY p.created_at DESC`
        );

        const posts = result.rows.map(row => ({
            id: row.post_id,
            content: row.content,
            timestamp: row.created_at,
            author: {
                name: `${row.first_name} ${row.last_name}`,
                avatar: "🙂",
                level: 1
            },
            reactions: [],
            comments: []
        }));

        res.json({ success: true, posts });

    } catch (err) {
        console.error("Fetch posts error:", err);
        res.status(500).json({ success: false, message: "Server error fetching posts" });
    }
});

module.exports = router;
