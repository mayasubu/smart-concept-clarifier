import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { detectConfusion } from '../services/api';
import './ConfusionDetectorPage.css';

const examples = [
  "I don't understand the difference between props and state in React",
  "What is middleware in Express and how does next() work?",
  "I'm confused about var let and const in JavaScript",
  "How does the event loop work in Node.js?",
  "What's the difference between Angular and React?",
  "I don't get callbacks and promises"
];

function ConfusionDetectorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDetect = async () => {
    if (!input.trim()) { setError('Please type your confusion first!'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await detectConfusion(input);
      setResult(res.data);
    } catch (e) {
      setError('Server not reachable. Make sure backend is running on port 5000.');
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleDetect();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🔍 Confusion Detector</h1>
        <p>Type your confusion in plain English — we'll detect the concept and clarify it for you</p>
      </div>

      {/* Input Area */}
      <div className="detector-card fade-in">
        <label className="detector-label">What are you confused about?</label>
        <textarea
          className="detector-input"
          placeholder="e.g. I don't understand the difference between props and state in React..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={5}
        />
        <div className="detector-hint">Tip: Ctrl+Enter to detect</div>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <button
          className="btn btn-primary detect-btn"
          onClick={handleDetect}
          disabled={loading}
        >
          {loading ? <><span className="btn-spinner"></span> Detecting...</> : '🔍 Detect My Confusion'}
        </button>
      </div>

      {/* Examples */}
      <div className="examples-section fade-in-delay">
        <h3>💡 Try these examples:</h3>
        <div className="example-pills">
          {examples.map(ex => (
            <button key={ex} className="example-pill" onClick={() => { setInput(ex); setResult(null); }}>
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="results-section fade-in">
          <div className="result-header">
            <h2>{result.message}</h2>
            <div className="input-echo">
              <span>Your input:</span>
              <em>"{result.input}"</em>
            </div>
          </div>

          {result.detected.length === 0 ? (
            <div className="no-results">
              <p>🤷 No specific Full Stack concepts detected. Try mentioning keywords like:</p>
              <div className="topic-pills" style={{ marginTop: '1rem' }}>
                {['React', 'Node.js', 'Express', 'Angular', 'JavaScript', 'MVC'].map(k => (
                  <span key={k} className="topic-pill">{k}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="detected-list">
              {result.detected.map((item, i) => (
                <div key={item.id} className="detected-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="detected-header">
                    <span className={`badge badge-unit${item.unit}`}>Unit {item.unit}</span>
                    <h3>{item.title}</h3>
                    <Link to={`/concepts/${item.id}`} className="btn btn-secondary btn-sm">View Full Concept →</Link>
                  </div>

                  {item.relevantConfusions.length > 0 ? (
                    <div className="relevant-clarifications">
                      <div className="clarif-label">🎯 Relevant clarifications for your doubt:</div>
                      {item.relevantConfusions.map((rc, j) => (
                        <div key={j} className="clarif-item">
                          <div className="clarif-concept">{rc.concept}</div>
                          <div className="clarif-text">{rc.clarification}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-specific">
                      We detected <strong>{item.title}</strong> as relevant to your question.
                      <Link to={`/concepts/${item.id}`}> View all clarifications →</Link>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-secondary mt-3" onClick={() => { setResult(null); setInput(''); }}>
            🔄 Try Another Question
          </button>
        </div>
      )}
    </div>
  );
}

export default ConfusionDetectorPage;
