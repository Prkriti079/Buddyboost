// backend/routes/comments.js
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
 * CREATE COMMENT
 */
router.post("/", auth, async (req, res) => {
    try {
        const { post_id, content } = req.body;

        if (!post_id || !content)
            return res
                .status(400)
                .json({ success: false, message: "Post ID and content required" });

        const result = await pool.query(
            `INSERT INTO comments (post_id, user_id, content, created_at, updated_at)
       VALUES ($1,$2,$3,NOW(),NOW())
       RETURNING *`,
            [post_id, req.userId, content]
        );

        res.json({ success: true, comment: result.rows[0] });
    } catch (err) {
        console.error("Comment create error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * GET COMMENTS FOR A POST
 */
router.get("/post/:id", async (req, res) => {
    try {
        const postId = req.params.id;

        const result = await pool.query(
            `SELECT c.*, u.first_name, u.last_name
       FROM comments c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
            [postId]
        );

        res.json({
            success: true,
            comments: result.rows.map((c) => ({
                ...c,
                author: {
                    firstName: c.first_name,
                    lastName: c.last_name,
                },
            })),
        });
    } catch (err) {
        console.error("Fetch comments error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * DELETE COMMENT (only owner)
 */
router.delete("/:id", auth, async (req, res) => {
    try {
        const commentId = req.params.id;

        const check = await pool.query(
            `SELECT user_id FROM comments WHERE comment_id=$1`,
            [commentId]
        );

        if (check.rows.length === 0)
            return res
                .status(404)
                .json({ success: false, message: "Comment not found" });

        if (check.rows[0].user_id !== req.userId)
            return res
                .status(403)
                .json({ success: false, message: "Not allowed to delete this" });

        await pool.query(`DELETE FROM comments WHERE comment_id=$1`, [commentId]);

        res.json({ success: true, message: "Comment deleted" });
    } catch (err) {
        console.error("Delete comment error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
