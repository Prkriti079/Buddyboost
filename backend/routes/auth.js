const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// REGISTER USER
router.post("/register", async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email & password required" });
        }

        // Check if user already exists
        const existingUser = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Insert new user
        const newUser = await db.query(
            `INSERT INTO users (email, password, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, email, first_name, last_name, created_at`,
            [email, hashed, first_name, last_name]
        );

        return res.status(201).json({ message: "User registered", user: newUser.rows[0] });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN USER
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const userQuery = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (userQuery.rows.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = userQuery.rows[0];

        // Compare hashed passwords
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create JWT
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
