import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

export const getConcepts = () => api.get('/concepts');
export const getConcept = (id) => api.get(`/concepts/${id}`);
export const detectConfusion = (text) => api.post('/detect-confusion', { text });
export const getQuiz = (unit) => api.get('/quiz', { params: unit ? { unit } : {} });
export const startSession = () => api.post('/quiz/start');
export const submitAnswer = (sessionId, questionId, selectedOption) =>
  api.post('/quiz/answer', { sessionId, questionId, selectedOption });
export const endSession = (sessionId, studentName) =>
  api.post('/quiz/end', { sessionId, studentName });
export const getLeaderboard = () => api.get('/leaderboard');

export default api;
