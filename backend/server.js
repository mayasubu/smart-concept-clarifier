const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ─── In-memory data store (simulates a database) ─────────────────────────────
let sessions = {};       // { sessionId: { score, total, history[] } }
let leaderboard = [];    // [{ name, score, date }]

// ─── CS Concepts Knowledge Base ──────────────────────────────────────────────
const conceptsDB = {
  "javascript": {
    title: "JavaScript",
    unit: 1,
    summary: "JavaScript is a lightweight, interpreted scripting language used to make web pages interactive.",
    topics: ["functions", "arrays", "objects", "strings", "closures", "promises", "async/await"],
    confusionPoints: [
      { concept: "var vs let vs const", clarification: "'var' is function-scoped and hoisted. 'let' and 'const' are block-scoped. 'const' cannot be reassigned but its object properties can change." },
      { concept: "== vs ===", clarification: "'==' compares values with type coercion (1 == '1' is true). '===' compares both value and type strictly (1 === '1' is false)." },
      { concept: "Arrow functions vs regular functions", clarification: "Arrow functions do NOT have their own 'this'. They inherit 'this' from the surrounding scope. Regular functions have their own 'this' context." },
      { concept: "Synchronous vs Asynchronous", clarification: "Synchronous code runs line by line, blocking. Asynchronous code (callbacks, promises, async/await) allows non-blocking execution." }
    ]
  },
  "nodejs": {
    title: "Node.js",
    unit: 2,
    summary: "Node.js is a runtime that lets JavaScript run on the server side using Chrome's V8 engine.",
    topics: ["modules", "npm", "events", "streams", "http", "callbacks", "timers"],
    confusionPoints: [
      { concept: "Callbacks vs Promises", clarification: "Callbacks are functions passed as arguments to handle async results (can lead to 'callback hell'). Promises are objects representing future values — cleaner and chainable." },
      { concept: "require vs import", clarification: "'require' is Node.js CommonJS syntax. 'import' is ES6 module syntax. Node supports both, but 'import' needs .mjs extension or 'type: module' in package.json." },
      { concept: "Event Loop", clarification: "The Event Loop is what allows Node.js to do non-blocking I/O. It picks tasks from queues (timers, I/O, promises) and runs them one at a time." },
      { concept: "npm vs npx", clarification: "'npm' installs packages. 'npx' runs a package directly without installing it globally. Use npx to run one-time CLI tools like 'npx create-react-app'." }
    ]
  },
  "express": {
    title: "Express.js",
    unit: 2,
    summary: "Express is a minimal Node.js web framework for building REST APIs and web servers.",
    topics: ["routing", "middleware", "request", "response", "REST", "HTTP methods"],
    confusionPoints: [
      { concept: "Middleware", clarification: "Middleware functions have access to req, res, and next. They run in sequence. Calling next() passes control to the next middleware. Without next(), the request hangs." },
      { concept: "GET vs POST vs PUT vs DELETE", clarification: "GET: read data. POST: create new data. PUT: update/replace data. DELETE: remove data. These are HTTP methods that follow REST conventions." },
      { concept: "req.params vs req.query vs req.body", clarification: "req.params: URL route params (/user/:id). req.query: URL query string (?name=John). req.body: data sent in the request body (POST/PUT)." },
      { concept: "app.use vs app.get", clarification: "app.use() matches ALL HTTP methods and is used for middleware. app.get() only matches GET requests to a specific route." }
    ]
  },
  "react": {
    title: "React",
    unit: 3,
    summary: "React is a JavaScript library for building UI with reusable components and a virtual DOM.",
    topics: ["components", "JSX", "props", "state", "hooks", "virtual DOM", "routing", "events"],
    confusionPoints: [
      { concept: "Props vs State", clarification: "Props are read-only data passed FROM parent to child. State is local, mutable data owned by a component. Changing state triggers a re-render; props cannot be changed by the child." },
      { concept: "useState vs useEffect", clarification: "useState manages local state values. useEffect handles side effects (API calls, subscriptions) that run after render. Both are React Hooks." },
      { concept: "Virtual DOM", clarification: "React keeps a lightweight copy of the real DOM in memory. When state changes, React compares (diffs) the virtual DOM with the real DOM and only updates what changed — making it fast." },
      { concept: "Class components vs Functional components", clarification: "Old React used class components with lifecycle methods. Modern React uses functional components with Hooks (useState, useEffect) — simpler and more powerful." }
    ]
  },
  "angular": {
    title: "Angular",
    unit: 3,
    summary: "Angular is a full TypeScript-based framework by Google for building large-scale SPAs.",
    topics: ["components", "modules", "templates", "directives", "services", "dependency injection", "TypeScript"],
    confusionPoints: [
      { concept: "Angular vs React", clarification: "Angular is a complete MVC framework (opinionated). React is a UI library (flexible). Angular uses TypeScript by default; React uses JavaScript/JSX. Angular has two-way binding; React has one-way data flow." },
      { concept: "Directives", clarification: "Directives extend HTML. Structural directives (*ngIf, *ngFor) change the DOM structure. Attribute directives (ngClass, ngStyle) change appearance/behavior of elements." },
      { concept: "Dependency Injection", clarification: "Angular's DI system automatically provides instances of services to components. You declare a service in providers and Angular handles creating and sharing it — no manual 'new ServiceName()' needed." },
      { concept: "Two-way data binding [(ngModel)]", clarification: "[(ngModel)] binds a variable to an input BOTH ways: changing the input updates the variable, and changing the variable updates the input. React requires separate value + onChange handler." }
    ]
  },
  "mvc": {
    title: "MVC Architecture",
    unit: 1,
    summary: "Model-View-Controller separates an app into three interconnected parts for clean code organization.",
    topics: ["model", "view", "controller", "separation of concerns", "architecture"],
    confusionPoints: [
      { concept: "Model vs View vs Controller", clarification: "Model: data and business logic. View: what the user sees (HTML/templates). Controller: handles user input and updates Model/View. They are intentionally separated for maintainability." },
      { concept: "MVC vs MVVM", clarification: "MVVM (Model-View-ViewModel) is used in Angular. The ViewModel acts as a bridge with two-way binding. MVC is more common in backend frameworks like Express." }
    ]
  }
};

// ─── Quiz Questions ───────────────────────────────────────────────────────────
const quizQuestions = [
  {
    id: 1, unit: 1, topic: "JavaScript",
    question: "What does '===' check compared to '=='?",
    options: ["Only value", "Only type", "Both value and type", "Neither"],
    answer: 2, explanation: "'===' is strict equality — it checks BOTH value AND type. '==' allows type coercion, so 1 == '1' is true but 1 === '1' is false."
  },
  {
    id: 2, unit: 1, topic: "JavaScript",
    question: "Which keyword is block-scoped?",
    options: ["var", "let", "function", "global"],
    answer: 1, explanation: "'let' (and 'const') are block-scoped. 'var' is function-scoped and hoisted, which can cause bugs. Always prefer 'let'/'const'."
  },
  {
    id: 3, unit: 2, topic: "Node.js",
    question: "What is the Event Loop in Node.js?",
    options: ["A loop that crashes the server", "A mechanism for handling async non-blocking I/O", "A for-loop in Node", "A database query loop"],
    answer: 1, explanation: "The Event Loop is Node's core mechanism that allows asynchronous, non-blocking I/O by processing tasks from queues between iterations."
  },
  {
    id: 4, unit: 2, topic: "Express",
    question: "What does 'next()' do in Express middleware?",
    options: ["Ends the response", "Skips all middleware", "Passes control to the next middleware function", "Restarts the server"],
    answer: 2, explanation: "Calling next() in middleware passes control to the next matching middleware or route handler. Without it, the request will hang."
  },
  {
    id: 5, unit: 3, topic: "React",
    question: "What is the difference between props and state?",
    options: [
      "No difference",
      "Props are mutable, state is immutable",
      "Props are passed from parent (read-only), state is local and mutable",
      "State is passed from parent, props are local"
    ],
    answer: 2, explanation: "Props flow down from parent to child and are read-only. State is managed inside a component and can be updated, triggering re-renders."
  },
  {
    id: 6, unit: 3, topic: "React",
    question: "What is the Virtual DOM?",
    options: [
      "A fake website",
      "A copy of the real DOM in memory for efficient updates",
      "A new HTML version",
      "A browser plugin"
    ],
    answer: 1, explanation: "React's Virtual DOM is an in-memory copy of the real DOM. React diffs it with the real DOM and only updates what changed — making UI updates fast."
  },
  {
    id: 7, unit: 3, topic: "Angular",
    question: "What does *ngFor do in Angular?",
    options: ["Creates a component", "Loops over an array to render repeated elements", "Imports a module", "Handles HTTP requests"],
    answer: 1, explanation: "*ngFor is a structural directive that iterates over an array and renders the element for each item — like a for-loop in your template."
  },
  {
    id: 8, unit: 2, topic: "Node.js",
    question: "What is 'require()' used for in Node.js?",
    options: ["To run tests", "To import modules", "To create a server", "To define variables"],
    answer: 1, explanation: "'require()' is Node's CommonJS way of importing modules — built-in ones like 'fs', installed packages like 'express', or your own files."
  },
  {
    id: 9, unit: 3, topic: "Angular",
    question: "What is Dependency Injection in Angular?",
    options: [
      "Injecting bugs into code",
      "A way to automatically provide service instances to components",
      "Adding CSS styles dynamically",
      "Compiling TypeScript"
    ],
    answer: 1, explanation: "Angular's DI system creates and provides instances of services to components automatically. You just declare the service in the constructor — Angular handles the rest."
  },
  {
    id: 10, unit: 1, topic: "MVC",
    question: "In MVC, what is the Controller responsible for?",
    options: ["Storing data", "Displaying HTML", "Handling user input and coordinating Model & View", "Writing CSS"],
    answer: 2, explanation: "The Controller receives user input, interacts with the Model (data), and updates the View accordingly. It's the 'brain' connecting data and display."
  }
];

// ─── API Routes ───────────────────────────────────────────────────────────────

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
  if (!concept) return res.status(404).json({ success: false, message: 'Concept not found' });
  res.json({ success: true, data: concept });
});

// POST detect confusion from user input
app.post('/api/detect-confusion', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, message: 'Text is required' });

  const lower = text.toLowerCase();
  const detectedConcepts = [];

  // Simple keyword detection
  const keywords = {
    javascript: ['javascript', 'js', 'var', 'let', 'const', 'function', 'arrow', 'promise', 'async', 'array', 'object'],
    nodejs: ['node', 'nodejs', 'npm', 'require', 'module', 'event loop', 'callback', 'stream'],
    express: ['express', 'middleware', 'routing', 'req', 'res', 'next', 'rest api', 'http'],
    react: ['react', 'jsx', 'component', 'props', 'state', 'hook', 'usestate', 'useeffect', 'virtual dom'],
    angular: ['angular', 'typescript', 'directive', 'ngfor', 'ngif', 'dependency injection', 'ngmodel', 'service'],
    mvc: ['mvc', 'model', 'view', 'controller', 'architecture']
  };

  for (const [key, words] of Object.entries(keywords)) {
    if (words.some(w => lower.includes(w))) {
      detectedConcepts.push({
        id: key,
        title: conceptsDB[key].title,
        unit: conceptsDB[key].unit,
        relevantConfusions: conceptsDB[key].confusionPoints.filter(cp =>
          lower.includes(cp.concept.toLowerCase().split(' ')[0])
        ).slice(0, 2)
      });
    }
  }

  res.json({
    success: true,
    input: text,
    detected: detectedConcepts,
    message: detectedConcepts.length > 0
      ? `Found ${detectedConcepts.length} relevant concept(s)!`
      : 'No specific concepts detected. Try mentioning topics like React, Node.js, Angular, or JavaScript.'
  });
});

// GET quiz questions (optionally filter by unit)
app.get('/api/quiz', (req, res) => {
  const { unit } = req.query;
  let questions = quizQuestions;
  if (unit) questions = questions.filter(q => q.unit === parseInt(unit));
  // Return questions without answers
  const sanitized = questions.map(({ answer, explanation, ...q }) => q);
  res.json({ success: true, data: sanitized, total: sanitized.length });
});

// POST start quiz session
app.post('/api/quiz/start', (req, res) => {
  const sessionId = uuidv4();
  sessions[sessionId] = { score: 0, total: 0, history: [], startTime: Date.now() };
  res.json({ success: true, sessionId, message: 'Quiz session started!' });
});

// POST submit answer
app.post('/api/quiz/answer', (req, res) => {
  const { sessionId, questionId, selectedOption } = req.body;
  const session = sessions[sessionId];
  if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

  const question = quizQuestions.find(q => q.id === questionId);
  if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

  const isCorrect = selectedOption === question.answer;
  if (isCorrect) session.score++;
  session.total++;
  session.history.push({ questionId, selectedOption, isCorrect });

  res.json({
    success: true,
    isCorrect,
    correctAnswer: question.answer,
    explanation: question.explanation,
    currentScore: session.score,
    total: session.total
  });
});

// POST end session & save to leaderboard
app.post('/api/quiz/end', (req, res) => {
  const { sessionId, studentName } = req.body;
  const session = sessions[sessionId];
  if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

  const entry = {
    name: studentName || 'Anonymous',
    score: session.score,
    total: session.total,
    percentage: Math.round((session.score / session.total) * 100) || 0,
    date: new Date().toLocaleDateString()
  };
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.percentage - a.percentage);
  leaderboard = leaderboard.slice(0, 10); // keep top 10

  delete sessions[sessionId];
  res.json({ success: true, result: entry, leaderboard });
});

// GET leaderboard
app.get('/api/leaderboard', (req, res) => {
  res.json({ success: true, data: leaderboard });
});

// GET server health
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Smart Concept Clarifier API is running!', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 API endpoints ready!`);
});
