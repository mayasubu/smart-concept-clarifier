import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { getConcept } from '../services/api';
import './ConceptDetailPage.css';

function ConceptDetailPage() {
  const { id } = useParams();
  const { data: concept, loading, error } = useFetch(() => getConcept(id), [id]);
  const [expandedIdx, setExpandedIdx] = useState(null);

  if (loading) return <div className="page loading"><div className="spinner"></div><span>Loading...</span></div>;
  if (error || !concept) return (
    <div className="page"><div className="error-box"><h3>⚠️ Concept not found</h3><Link to="/concepts" className="btn btn-primary mt-2">← Back to Concepts</Link></div></div>
  );

  const unitLabel = { 1: 'Overview of Full Stack', 2: 'Node.js & Express', 3: 'Front-End Development' };

  return (
    <div className="page">
      <Link to="/concepts" className="back-link">← Back to Concepts</Link>

      {/* Header */}
      <div className="detail-header fade-in">
        <span className={`badge badge-unit${concept.unit}`}>Unit {concept.unit} — {unitLabel[concept.unit]}</span>
        <h1>{concept.title}</h1>
        <p className="detail-summary">{concept.summary}</p>
      </div>

      {/* Topics */}
      <div className="detail-section fade-in-delay">
        <h2>📌 Topics Covered</h2>
        <div className="topic-pills">
          {concept.topics.map(t => (
            <span key={t} className="topic-pill">{t}</span>
          ))}
        </div>
      </div>

      {/* Confusion Points */}
      <div className="detail-section fade-in-delay2">
        <h2>🤔 Common Confusion Points & Clarifications</h2>
        <p className="section-sub">Click on any confusion to see the clarification</p>
        <div className="confusion-list">
          {concept.confusionPoints.map((cp, i) => (
            <div
              key={i}
              className={`confusion-item ${expandedIdx === i ? 'expanded' : ''}`}
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
            >
              <div className="confusion-question">
                <span className="confusion-num">{i + 1}</span>
                <span className="confusion-text">{cp.concept}</span>
                <span className="toggle-icon">{expandedIdx === i ? '▲' : '▼'}</span>
              </div>
              {expandedIdx === i && (
                <div className="confusion-answer">
                  <div className="answer-label">✅ Clarification</div>
                  <p>{cp.clarification}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="detail-actions fade-in-delay3">
        <Link to="/quiz" className="btn btn-primary">🧠 Test your knowledge →</Link>
        <Link to="/detector" className="btn btn-secondary">🔍 Still confused? Try the detector</Link>
      </div>
    </div>
  );
}

export default ConceptDetailPage;
