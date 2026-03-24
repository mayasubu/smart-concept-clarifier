import React, { useState, useEffect } from 'react';
import { getQuiz, startSession, submitAnswer, endSession } from '../services/api';
import './QuizPage.css';

const STATES = { START: 'start', PLAYING: 'playing', RESULT: 'result' };

function QuizPage() {
  const [quizState, setQuizState] = useState(STATES.START);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionId, setSessionId] = useState('');
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unitFilter, setUnitFilter] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      const qRes = await getQuiz(unitFilter || null);
      const sRes = await startSession();
      setQuestions(qRes.data.data);
      setSessionId(sRes.data.sessionId);
      setCurrentIdx(0);
      setScore(0);
      setSelected(null);
      setFeedback(null);
      setAnsweredCount(0);
      setQuizState(STATES.PLAYING);
    } catch (e) {
      alert('Could not connect to server. Make sure backend is running!');
    }
    setLoading(false);
  };

  const handleSelect = async (optionIdx) => {
    if (selected !== null) return; // already answered
    setSelected(optionIdx);
    try {
      const res = await submitAnswer(sessionId, questions[currentIdx].id, optionIdx);
      const { isCorrect, correctAnswer, explanation, currentScore } = res.data;
      setFeedback({ isCorrect, correctAnswer, explanation });
      setScore(currentScore);
      setAnsweredCount(prev => prev + 1);
    } catch (e) {
      setFeedback({ isCorrect: false, correctAnswer: 0, explanation: 'Server error' });
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      const res = await endSession(sessionId, studentName || 'Anonymous');
      setFinalResult(res.data.result);
    } catch (e) {
      setFinalResult({ score, total: questions.length, percentage: Math.round((score / questions.length) * 100) });
    }
    setQuizState(STATES.RESULT);
  };

  const getPerformanceMsg = (pct) => {
    if (pct >= 90) return { emoji: '🏆', msg: 'Outstanding! You\'ve mastered Full Stack concepts!' };
    if (pct >= 70) return { emoji: '🎉', msg: 'Great job! You have a solid understanding.' };
    if (pct >= 50) return { emoji: '📚', msg: 'Good effort! Review the concepts and try again.' };
    return { emoji: '💪', msg: 'Keep practicing! Use the Concept Library to study.' };
  };

  // START SCREEN
  if (quizState === STATES.START) return (
    <div className="page">
      <div className="page-header">
        <h1>🧠 Quiz Yourself</h1>
        <p>Test your knowledge of CS23403 Full Stack concepts</p>
      </div>
      <div className="quiz-start-card fade-in">
        <div className="start-icon">📝</div>
        <h2>Ready to test your knowledge?</h2>
        <p>10 questions covering JavaScript, Node.js, Express, React, and Angular concepts from all 3 units.</p>

        <div className="start-options">
          <div className="option-group">
            <label>Your Name (for leaderboard)</label>
            <input
              className="input"
              placeholder="Enter your name..."
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
            />
          </div>

          <div className="option-group">
            <label>Filter by Unit</label>
            <div className="unit-filter-row">
              {[0, 1, 2, 3].map(u => (
                <button
                  key={u}
                  className={`filter-btn ${unitFilter === u ? 'active' : ''}`}
                  onClick={() => setUnitFilter(u)}
                >
                  {u === 0 ? 'All Units' : `Unit ${u}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="btn btn-primary start-btn" onClick={loadQuiz} disabled={loading}>
          {loading ? 'Loading...' : '🚀 Start Quiz'}
        </button>
      </div>
    </div>
  );

  // RESULT SCREEN
  if (quizState === STATES.RESULT && finalResult) {
    const perf = getPerformanceMsg(finalResult.percentage);
    return (
      <div className="page">
        <div className="result-screen fade-in">
          <div className="result-emoji">{perf.emoji}</div>
          <h1>Quiz Complete!</h1>
          <p className="result-msg">{perf.msg}</p>

          <div className="result-stats">
            <div className="result-stat">
              <div className="rstat-value">{finalResult.score}/{finalResult.total}</div>
              <div className="rstat-label">Correct Answers</div>
            </div>
            <div className="result-stat highlight">
              <div className="rstat-value">{finalResult.percentage}%</div>
              <div className="rstat-label">Score</div>
            </div>
            <div className="result-stat">
              <div className="rstat-value">{finalResult.total - finalResult.score}</div>
              <div className="rstat-label">To Review</div>
            </div>
          </div>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => setQuizState(STATES.START)}>
              🔄 Try Again
            </button>
            <button className="btn btn-secondary" onClick={() => window.location.href = '/leaderboard'}>
              🏆 View Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ PLAYING
  if (quizState === STATES.PLAYING && questions.length > 0) {
    const q = questions[currentIdx];
    const progress = ((currentIdx) / questions.length) * 100;

    return (
      <div className="page">
        {/* Progress */}
        <div className="quiz-progress">
          <div className="progress-info">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span className="score-display">Score: {score}/{answeredCount}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question */}
        <div className="question-card fade-in" key={q.id}>
          <div className="question-meta">
            <span className="q-topic">📌 {q.topic}</span>
            <span className={`badge badge-unit${q.unit}`}>Unit {q.unit}</span>
          </div>
          <h2 className="question-text">{q.question}</h2>

          <div className="options-list">
            {q.options.map((opt, i) => {
              let cls = 'option-btn';
              if (selected !== null) {
                if (i === feedback?.correctAnswer) cls += ' correct';
                else if (i === selected && !feedback?.isCorrect) cls += ' wrong';
                else cls += ' dimmed';
              }
              return (
                <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={selected !== null}>
                  <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`feedback-box ${feedback.isCorrect ? 'correct' : 'wrong'}`}>
              <div className="feedback-icon">{feedback.isCorrect ? '✅ Correct!' : '❌ Incorrect'}</div>
              <p>{feedback.explanation}</p>
              <button className="btn btn-primary" onClick={handleNext}>
                {currentIdx < questions.length - 1 ? 'Next Question →' : '🏁 Finish Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div className="page loading"><div className="spinner"></div></div>;
}

export default QuizPage;
