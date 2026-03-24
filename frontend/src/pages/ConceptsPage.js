import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { getConcepts } from '../services/api';
import './ConceptsPage.css';

const unitColors = { 1: 'unit1', 2: 'unit2', 3: 'unit3' };
const unitNames = { 1: 'Overview of Full Stack', 2: 'Node.js & Express', 3: 'Front-End Development' };

function ConceptsPage() {
  const { data: concepts, loading, error } = useFetch(getConcepts);
  const [filter, setFilter] = useState(0);

  const filtered = filter === 0 ? concepts : concepts?.filter(c => c.unit === filter);

  if (loading) return (
    <div className="page loading">
      <div className="spinner"></div>
      <span>Loading concepts...</span>
    </div>
  );

  if (error) return (
    <div className="page">
      <div className="error-box">
        <h3>⚠️ Could not connect to server</h3>
        <p>Make sure the backend is running: <code>cd backend && node server.js</code></p>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>📚 Concept Library</h1>
        <p>All Full Stack Technology concepts from CS23403 — organized by unit</p>
      </div>

      {/* Unit Filter */}
      <div className="filter-row">
        <button className={`filter-btn ${filter === 0 ? 'active' : ''}`} onClick={() => setFilter(0)}>All Units</button>
        {[1, 2, 3].map(u => (
          <button key={u} className={`filter-btn ${filter === u ? 'active' : ''}`} onClick={() => setFilter(u)}>
            Unit {u}: {unitNames[u]}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {filtered?.map((concept, i) => (
          <Link
            to={`/concepts/${concept.id}`}
            key={concept.id}
            className="concept-card fade-in"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="concept-card-top">
              <span className={`badge badge-${unitColors[concept.unit]}`}>Unit {concept.unit}</span>
              <span className="confusion-count">🤔 {concept.confusionCount} confusions</span>
            </div>
            <h3 className="concept-title">{concept.title}</h3>
            <p className="concept-summary">{concept.summary}</p>
            <div className="concept-meta">
              <span>📌 {concept.topicCount} topics</span>
              <span className="explore-link">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ConceptsPage;
