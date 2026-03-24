# 🧠 Smart Concept Confusion Detection & Clarification System
**Course: CS23403 – Full Stack Technologies**

A full-stack web application that helps CSE students detect what Full Stack concept they're confused about and get instant clarifications.

---

## 🛠️ Tech Stack
| Layer | Technology | Unit |
|-------|-----------|------|
| Frontend UI | React 18 + React Router | Unit 3 |
| State Management | React Hooks (useState, useEffect) | Unit 3 |
| HTTP Client | Axios | Unit 2 |
| Backend Server | Node.js + Express.js | Unit 2 |
| Architecture | MVC Pattern (REST API) | Unit 1 |
| Language | JavaScript (ES6+) | Unit 1 |

---

## ✅ Prerequisites

Make sure you have **Node.js** installed (v16 or above).

Check: `node -v` and `npm -v`

Download Node.js from: https://nodejs.org

---

## 🚀 HOW TO RUN THE PROJECT

### Step 1 – Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2 – Start the Backend Server
```bash
node server.js
```
You should see:
```
🚀 Server running at http://localhost:5000
📚 API endpoints ready!
```
**Keep this terminal open!**

---

### Step 3 – Open a NEW terminal, Install Frontend Dependencies
```bash
cd frontend
npm install
```
This may take 2–5 minutes the first time.

### Step 4 – Start the React Frontend
```bash
npm start
```

The browser will automatically open at **http://localhost:3000**

---

## 🎯 Features

| Page | What it does |
|------|-------------|
| 🏠 Home | Overview, server status, tech stack used |
| 📚 Concepts | Browse all 6 concepts across 3 units |
| 🔎 Concept Detail | Topics + common confusion points with clarifications |
| 🔍 Confusion Detector | Type your doubt → get instant concept detection & clarification |
| 🧠 Quiz | 10 MCQs covering all units, scored in real-time |
| 🏆 Leaderboard | See top scorers after taking the quiz |

---

## 📡 API Endpoints (Backend – port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/concepts` | List all concepts |
| GET | `/api/concepts/:id` | Get specific concept details |
| POST | `/api/detect-confusion` | Detect concept from text input |
| GET | `/api/quiz` | Get quiz questions |
| POST | `/api/quiz/start` | Start a new quiz session |
| POST | `/api/quiz/answer` | Submit an answer |
| POST | `/api/quiz/end` | End session, save to leaderboard |
| GET | `/api/leaderboard` | Get top 10 scores |

---

## 📁 Folder Structure

```
smart-concept-clarifier/
├── backend/
│   ├── server.js          ← Express server + all API routes
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          ← Main app with React Router
│   │   ├── App.css         ← Global styles
│   │   ├── index.js        ← React entry point
│   │   ├── services/
│   │   │   └── api.js      ← Axios API calls
│   │   ├── hooks/
│   │   │   └── useFetch.js ← Custom React Hook
│   │   └── pages/
│   │       ├── HomePage.js / .css
│   │       ├── ConceptsPage.js / .css
│   │       ├── ConceptDetailPage.js / .css
│   │       ├── ConfusionDetectorPage.js / .css
│   │       ├── QuizPage.js / .css
│   │       └── LeaderboardPage.js / .css
│   └── package.json
└── README.md
```

---

## 🔧 Troubleshooting

**"Cannot connect to server" error on frontend:**
→ Make sure the backend is running (`node server.js` in the backend folder)

**Port 3000 already in use:**
→ React will ask you to use another port – press Y

**Port 5000 already in use:**
→ Change `const PORT = 5000` to `5001` in `backend/server.js`, then also update `frontend/src/services/api.js` line: `const API_BASE = 'http://localhost:5001/api';`

**npm install fails:**
→ Try `npm install --legacy-peer-deps`

---

## 👨‍💻 CS23403 Concepts Demonstrated

- **Unit 1**: JavaScript functions, arrays, objects, MVC architecture
- **Unit 2**: Node.js HTTP server, Express routing, middleware, REST API, npm packages
- **Unit 3**: React components, JSX, props, state, hooks, routing, conditional rendering

---

*Built as a 2nd Year CSE project for CS23403 – Full Stack Technologies*
