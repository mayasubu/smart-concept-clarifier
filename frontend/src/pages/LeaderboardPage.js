import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { getLeaderboard } from '../services/api';
import './LeaderboardPage.css';

const medals = ['🥇', '🥈', '🥉'];

function LeaderboardPage() {
  const { data, loading, error, } = useFetch(getLeaderboard);
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) return (
    <div className="page loading">
      <div className="spinner"></div>
      <span>Loading leaderboard...</span>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>🏆 Leaderboard</h1>
        <p>Top performers from the CS23403 Quiz — take the quiz to appear here!</p>
      </div>

      {error && (
        <div className="error-box" style={{ marginBottom: '1.5rem' }}>
          <p>⚠️ Could not connect to server. Make sure the backend is running.</p>
        </div>
      )}

      {!error && (!data || data.length === 0) ? (
        <div className="empty-board fade-in">
          <div className="empty-icon">🏆</div>
          <h2>No scores yet!</h2>
          <p>Be the first to take the quiz and claim the top spot.</p>
          <Link to="/quiz" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            🧠 Take the Quiz
          </Link>
        </div>
      ) : (
        <div className="leaderboard-container fade-in">
          {/* Top 3 Podium */}
          {data && data.length >= 1 && (
            <div className="podium">
              {data.slice(0, 3).map((entry, i) => (
                <div key={i} className={`podium-card rank-${i + 1}`}>
                  <div className="podium-medal">{medals[i] || `#${i + 1}`}</div>
                  <div className="podium-name">{entry.name}</div>
                  <div className="podium-score">{entry.percentage}%</div>
                  <div className="podium-detail">{entry.score}/{entry.total} correct</div>
                  <div className="podium-date">{entry.date}</div>
                </div>
              ))}
            </div>
          )}

          {/* Full Table */}
          {data && data.length > 0 && (
            <div className="leaderboard-table-wrap">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((entry, i) => (
                    <tr key={i} className={i < 3 ? 'top-row' : ''}>
                      <td className="rank-cell">
                        {i < 3 ? medals[i] : <span className="rank-num">#{i + 1}</span>}
                      </td>
                      <td className="name-cell">{entry.name}</td>
                      <td className="score-cell">{entry.score}/{entry.total}</td>
                      <td className="pct-cell">
                        <div className="pct-bar-wrap">
                          <div className="pct-bar" style={{ width: `${entry.percentage}%` }}></div>
                          <span>{entry.percentage}%</span>
                        </div>
                      </td>
                      <td className="date-cell">{entry.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="lb-actions fade-in-delay">
        <Link to="/quiz" className="btn btn-primary">🧠 Take the Quiz</Link>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>🔄 Refresh</button>
      </div>
    </div>
  );
}

export default LeaderboardPage;
