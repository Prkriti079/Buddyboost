// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/reactions", require("./routes/reactions"));
app.use("/api/challenges", require("./routes/challenges"));

// SERVE FRONTEND (Vite build in frontend/dist)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ FIX: Express 5-compatible catch-all
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// START SERVER
app.listen(PORT, () =>
    console.log(`BuddyBoost Fullstack running on port ${PORT}`)
);
