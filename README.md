# BuddyBoost 🎮💬

*A Gamified Web-Based Motivation Platform*

## 🚀 Overview

**BuddyBoost** is a full-stack web platform that combines **gamification**, **community support**, and **AI-based emotional feedback** to help users build and maintain habits. Unlike traditional habit trackers, BuddyBoost transforms daily behaviors into engaging, rewarding experiences through:

* 🎯 Weekly Challenges & XP system
* 🧠 AI Assistant for emotional support
* 💬 Social Feed for motivation and engagement
* 🏆 Achievement Badges & Progress Tracking

---

## 🧠 About the Project

BuddyBoost is designed to tackle declining motivation in traditional habit trackers by integrating behavioral psychology, gamified incentives, and emotional support. Users participate in challenges, track moods, earn rewards, and engage with a supportive community. Built with a modern tech stack, it ensures smooth user experience, secure data handling, and scalable architecture.

---

## 🛠 Tech Stack

### Frontend

* React + Vite
* TailwindCSS
* Framer Motion
* React Query
* ShadCN UI

### Backend

* Node.js + Express
* PostgreSQL
* pg (PostgreSQL client)
* JSON Web Tokens (JWT)

---

## 📦 Prerequisites

Install before running:

* **Node.js** (v18+ recommended)
* **PostgreSQL** (v12+)

---

## ▶️ Running the Project

Open 2 terminal windows/tabs: one for frontend, one for backend.

### Backend Setup

```bash
cd backend
node server.js
```

**Expected Output:**

```
DB SETTINGS LOADED: { user: 'postgres', ... }
Backend running on http://localhost:4000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**

```
VITE v4.x  ready in 500ms
➜  Local:   http://localhost:8080/
```

Visit `http://localhost:8080/` in your browser to explore BuddyBoost.

---

## 🗃️ Core Features

### 📰 Motivation Feed

* Post motivational updates
* React to other users' posts

### 🏆 Weekly Challenges & Achievements

* Join weekly tasks to earn XP
* Unlock level-based achievements and maintain habit streaks

### 🤖 AI Emotional Support Assistant

* Log moods and reflections
* Receive tailored motivational messages

### 🧩 Role-Based Access Control

* **Guest:** View landing page
* **User:** Create posts, join challenges, use AI assistant
* **Admin:** Manage users, posts, achievements, and challenges

---

## 🗃️ Database Schema

* 3NF PostgreSQL schema
* Core tables: `users`, `posts`, `reactions`, `challenges`, `achievements`, `mood_logs`, `leaderboard`

---

## ⚙️ Backend Logic Highlights

* Auth + JWT token system
* XP progression and streak tracking logic
* Admin moderation + CRUD APIs
* RESTful routing + modular API structure

---

## 🚀 Optimization Techniques

* Indexed DB queries for faster retrieval
* Server-side caching for leaderboard
* Clean modular structure for maintainability
* Security: hashed passwords, sanitized inputs

---

## 🧪 Testing

* Functional CRUD via Postman
* Usability tests for interface flow
* Load tests to simulate multi-user behavior
* Security validation of auth and session flow

---

## 📚 Learnings

* Building full-stack apps with secure routing and APIs
* Gamification logic (XP, levels, achievements)
* PostgreSQL schema design (3NF)
* Frontend-backend integration + performance tuning

---

## 📬 Contact

**Prkriti Puri**
📧 [puriprkriti@gmail.com](mailto:puriprkriti@gmail.com)
📍 University of Michigan – Dearborn

---

> 💡 Tip: Star this repo if you found it helpful or inspiring!
