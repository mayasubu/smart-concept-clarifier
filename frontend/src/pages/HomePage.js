import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const features = [
  {
    icon: '📚',
    title: 'Concept Library',
    desc: 'Browse all Full Stack concepts across 3 units — from JavaScript basics to Angular & React.',
    path: '/concepts',
    color: '#ff6584'
  },
  {
    icon: '🔍',
    title: 'Confusion Detector',
    desc: 'Type your doubt or confusion in plain English and get instant clarifications.',
    path: '/detector',
    color: '#43e97b'
  },
  {
    icon: '🧠',
    title: 'Quiz Yourself',
    desc: '10 concept-based MCQs covering all 3 units. Test what you know!',
    path: '/quiz',
    color: '#6c63ff'
  },
  {
    icon: '🏆',
    title: 'Leaderboard',
    desc: 'See where you rank among your classmates. Can you top the board?',
    path: '/leaderboard',
    color: '#f7971e'
  }
];

const stats = [
  { label: 'Concepts Covered', value: '6', icon: '📖' },
  { label: 'Confusion Points', value: '24', icon: '🤔' },
  { label: 'Quiz Questions', value: '10', icon: '❓' },
  { label: 'Units', value: '3', icon: '📑' }
];

function HomePage() {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(r => r.json())
      .then(() => setServerStatus('online'))
      .catch(() => setServerStatus('offline'));
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob1"></div>
          <div className="hero-blob blob2"></div>
          <div className="hero-blob blob3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge fade-in">
            <span className={`status-dot ${serverStatus}`}></span>
            Server {serverStatus === 'checking' ? 'Connecting...' : serverStatus === 'online' ? 'Online ✓' : 'Offline ✗'}
          </div>
          <h1 className="hero-title fade-in-delay">
            Smart Concept
            <span className="gradient-text"> Confusion Detection</span>
            <br />& Clarification System
          </h1>
          <p className="hero-sub fade-in-delay2">
            Built for CSE students studying <strong>CS23403 – Full Stack Technologies</strong>.
            Detect what's confusing you and get instant, clear explanations.
          </p>
          <div className="hero-actions fade-in-delay3">
            <Link to="/detector" className="btn btn-primary">🔍 Detect My Confusion</Link>
            <Link to="/concepts" className="btn btn-secondary">📚 Browse Concepts</Link>
          </div>

          {/* Stats */}
          <div className="stats-row fade-in-delay3">
            {stats.map(s => (
              <div key={s.label} className="stat-item">
                <span className="stat-icon">{s.icon}</span>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section page">
        <div className="page-header">
          <h2>What Can You Do Here?</h2>
          <p>Four powerful tools to help you master Full Stack concepts</p>
        </div>
        <div className="card-grid">
          {features.map((f, i) => (
            <Link to={f.path} key={f.title} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon" style={{ background: f.color + '22', color: f.color }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-arrow" style={{ color: f.color }}>→ Explore</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-stack-section">
        <div className="page">
          <div className="page-header">
            <h2>Tech Stack Used in This Project</h2>
            <p>Demonstrating concepts from all 3 Units of CS23403</p>
          </div>
          <div className="tech-grid">
            {[
              { name: 'React', role: 'Frontend UI', unit: 3, color: '#61dafb', icon: '⚛️' },
              { name: 'React Router', role: 'Client Routing', unit: 3, color: '#f44250', icon: '🔀' },
              { name: 'React Hooks', role: 'State & Effects', unit: 3, color: '#6c63ff', icon: '🪝' },
              { name: 'Node.js', role: 'Server Runtime', unit: 2, color: '#68a063', icon: '🟢' },
              { name: 'Express.js', role: 'REST API', unit: 2, color: '#43e97b', icon: '🚂' },
              { name: 'JavaScript', role: 'Core Language', unit: 1, color: '#f7df1e', icon: '🟨' },
              { name: 'MVC Pattern', role: 'Architecture', unit: 1, color: '#ff6584', icon: '🏗️' },
              { name: 'Axios', role: 'HTTP Client', unit: 2, color: '#5a29e4', icon: '📡' },
            ].map(t => (
              <div key={t.name} className="tech-card">
                <span className="tech-icon">{t.icon}</span>
                <div>
                  <div className="tech-name">{t.name}</div>
                  <div className="tech-role">{t.role}</div>
                </div>
                <span className={`badge badge-unit${t.unit}`}>Unit {t.unit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
