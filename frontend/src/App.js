import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ConceptsPage from './pages/ConceptsPage';
import ConceptDetailPage from './pages/ConceptDetailPage';
import ConfusionDetectorPage from './pages/ConfusionDetectorPage';
import QuizPage from './pages/QuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import './App.css';

function NavBar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: '🏠 Home' },
    { path: '/concepts', label: '📚 Concepts' },
    { path: '/detector', label: '🔍 Confusion Detector' },
    { path: '/quiz', label: '🧠 Quiz' },
    { path: '/leaderboard', label: '🏆 Leaderboard' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-text">ConceptClarifier</span>
        <span className="brand-tag">CS23403</span>
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={location.pathname === link.path ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/concepts" element={<ConceptsPage />} />
            <Route path="/concepts/:id" element={<ConceptDetailPage />} />
            <Route path="/detector" element={<ConfusionDetectorPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>Built with ⚛️ React + 🟢 Node.js/Express | CS23403 - Full Stack Technologies</p>
          <p>Smart Concept Confusion Detection & Clarification System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
