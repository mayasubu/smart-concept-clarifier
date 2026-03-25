const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

/* ================== ✅ IMPORTANT FIX ================== */
// Root route (so "/" doesn't show error)
app.get("/", (req, res) => {
  res.send("Smart Concept Clarifier Backend is running 🚀");
});

/* ================== DATA ================== */
let sessions = {};
let leaderboard = {};

// (your full conceptsDB + quizQuestions stay SAME — no changes)

/* ================== API ROUTES ================== */

// Health check (already good)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Concept Clarifier API is running!',
    timestamp: new Date()
  });
});

// GET all concepts
app.get('/api/concepts', (req, res) => {
  const list = Object.keys(conceptsDB).map(key => ({
    id: key,
    title: conceptsDB[key].title,
    unit: conceptsDB[key].unit,
    summary: conceptsDB[key].summary,
    topicCount: conceptsDB[key].topics.length,
    confusionCount: conceptsDB[key].confusionPoints.length
  }));
  res.json({ success: true, data: list });
});

// GET specific concept
app.get('/api/concepts/:id', (req, res) => {
  const concept = conceptsDB[req.params.id.toLowerCase()];
  if (!concept) {
    return res.status(404).json({
      success: false,
      message: 'Concept not found'
    });
  }
  res.json({ success: true, data: concept });
});

// Detect confusion
app.post('/api/detect-confusion', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      message: 'Text is required'
    });
  }

  const lower = text.toLowerCase();
  const detectedConcepts = [];

  const keywords = {
    javascript: ['javascript', 'js'],
    nodejs: ['node', 'nodejs'],
    express: ['express'],
    react: ['react'],
    angular: ['angular'],
    mvc: ['mvc']
  };

  for (const [key, words] of Object.entries(keywords)) {
    if (words.some(w => lower.includes(w))) {
      detectedConcepts.push({
        id: key,
        title: conceptsDB[key].title
      });
    }
  }

  res.json({
    success: true,
    detected: detectedConcepts
  });
});

// Quiz route
app.get('/api/quiz', (req, res) => {
  const sanitized = quizQuestions.map(({ answer, explanation, ...q }) => q);
  res.json({ success: true, data: sanitized });
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  res.json({ success: true, data: leaderboard });
});

/* ================== ERROR HANDLER ================== */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

/* ================== START SERVER ================== */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});