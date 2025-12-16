// backend/routes/users.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
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

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName)
            return res.status(400).json({ success: false, message: "All fields required" });

        const exists = await pool.query("SELECT user_id FROM users WHERE email=$1", [email]);
        if (exists.rows.length > 0)
            return res.status(409).json({ success: false, message: "Email exists" });

        const hashed = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (email, password, first_name, last_name, created_at)
       VALUES ($1,$2,$3,$4,NOW())
       RETURNING user_id, email, first_name, last_name`,
            [email, hashed, firstName, lastName]
        );

        const user = result.rows[0];

        const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: "24h" });

        res.json({ success: true, user, token });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (result.rows.length === 0)
            return res.status(401).json({ success: false, message: "Invalid credentials" });

        const user = result.rows[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ success: false, message: "Invalid credentials" });

        await pool.query("UPDATE users SET last_login=NOW() WHERE user_id=$1", [user.user_id]);

        const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: "24h" });

        res.json({
            success: true,
            user: {
                userId: user.user_id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
            },
            token,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// PROFILE
router.get("/profile", auth, async (req, res) => {
    try {
        console.log("🔍 DEBUG — userId from token:", req.userId);

        const result = await pool.query(
            "SELECT user_id, email, first_name, last_name FROM users WHERE user_id=$1",
            [req.userId]
        );

        if (result.rows.length === 0) {
            console.log("❌ No user found in DB for userId:", req.userId);
            return res.json({ success: false, message: "User not found" });
        }

        const user = result.rows[0];

        res.json({
            success: true,
            user: {
                userId: user.user_id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
            },
        });
    } catch (err) {
        console.error("Profile error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// DELETE ACCOUNT
router.delete("/delete", auth, async (req, res) => {
    try {
        const userId = req.userId;

        await pool.query("DELETE FROM reactions WHERE user_id=$1", [userId]);
        await pool.query("DELETE FROM comments WHERE user_id=$1", [userId]);
        await pool.query("DELETE FROM posts WHERE user_id=$1", [userId]);
        await pool.query("DELETE FROM users WHERE user_id=$1", [userId]);

        res.json({ success: true, message: "Account deleted" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
