const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.trim() === '') {
  throw new Error('Missing required environment variable: JWT_SECRET');
}

const app = express();
const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Middleware
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(bodyParser.json());
app.use(limiter);
app.use(express.static('public'));

// In-memory database
let repositories = [
  {
    id: 1,
    name: 'Red Shapes',
    owner: 'Red Shapes',
    description: 'An awesome project showcasing best practices',
    stars: 1250,
    forks: 340,
    language: 'JavaScript',
    topics: ['javascript', 'web', 'tutorial'],
    isPublic: true,
    issues: 45,
    pulls: 12
  },
  {
    id: 2,
    name: 'react-components',
    owner: 'jane-smith',
    description: 'Reusable React components library',
    stars: 892,
    forks: 156,
    language: 'TypeScript',
    topics: ['react', 'components', 'typescript'],
    isPublic: true,
    issues: 23,
    pulls: 8
  },
  {
    id: 3,
    name: 'api-documentation',
    owner: 'dev-team',
    description: 'Comprehensive API documentation tool',
    stars: 450,
    forks: 89,
    language: 'Python',
    topics: ['api', 'documentation', 'python'],
    isPublic: true,
    issues: 12,
    pulls: 5
  }
];

let nextRepositoryId = repositories.reduce((maxId, repo) => Math.max(maxId, repo.id), 0) + 1;
let issues = [];
let pullRequests = [];

// Simple in-memory users store
let users = [
  // example user (password: password123)
  {
    id: 1,
    username: 'admin',
    passwordHash: '',
    name: 'Administrator',
    email: 'admin@example.com',
    bio: 'Project administrator',
    createdAt: new Date()
  }
];

(async function seedAdmin() {
  if (!users[0].passwordHash) {
    users[0].passwordHash = await bcrypt.hash('password123', 10);
  }
})();

// Routes

// Get all repositories
app.get('/api/repositories', (req, res) => {
  res.json(repositories);
});

// Get single repository
app.get('/api/repositories/:id', (req, res) => {
  const repo = repositories.find(r => r.id === parseInt(req.params.id));
  if (!repo) return res.status(404).json({ message: 'Repository not found' });
  res.json(repo);
});

// Create repository
app.post('/api/repositories', authenticateToken, (req, res) => {
  const allowedFields = ['name', 'description', 'language', 'topics', 'license', 'private'];
  const payload = {};

  const invalidField = Object.keys(req.body).find(field => !allowedFields.includes(field));
  if (invalidField) {
    return res.status(400).json({ message: `Field "${invalidField}" is not allowed` });
  }

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      payload[field] = req.body[field];
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'topics')) {
    if (!Array.isArray(payload.topics) || !payload.topics.every(t => typeof t === 'string')) {
      return res.status(400).json({ message: 'Field "topics" must be an array of strings' });
    }
  }

  const stringFields = ['name', 'description', 'language', 'license'];
  for (const field of stringFields) {
    if (Object.prototype.hasOwnProperty.call(payload, field) && typeof payload[field] !== 'string') {
      return res.status(400).json({ message: `Field "${field}" must be a string` });
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'private') && typeof payload.private !== 'boolean') {
    return res.status(400).json({ message: 'Field "private" must be a boolean' });
  }

  const newRepo = {
    id: nextRepositoryId++,
    ...payload,
    stars: 0,
    forks: 0,
    issues: 0,
    pulls: 0
  };
  repositories.push(newRepo);
  res.status(201).json(newRepo);
});

// Update repository
app.put('/api/repositories/:id', authenticateToken, (req, res) => {
  const repo = repositories.find(r => r.id === parseInt(req.params.id));
  if (!repo) return res.status(404).json({ message: 'Repository not found' });

  const protectedFields = ['id', 'stars', 'forks', 'issues', 'pulls'];
  const attemptedProtectedUpdate = protectedFields.find(field =>
    Object.prototype.hasOwnProperty.call(req.body, field)
  );
  if (attemptedProtectedUpdate) {
    return res.status(400).json({ message: `Field "${attemptedProtectedUpdate}" cannot be updated` });
  }

  const allowedFields = ['name', 'description', 'language', 'topics', 'license', 'private'];
  const updates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updates[field] = req.body[field];
    }
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'topics')) {
    if (!Array.isArray(updates.topics) || !updates.topics.every(t => typeof t === 'string')) {
      return res.status(400).json({ message: 'Field "topics" must be an array of strings' });
    }
  }

  const stringFields = ['name', 'description', 'language', 'license'];
  for (const field of stringFields) {
    if (Object.prototype.hasOwnProperty.call(updates, field) && typeof updates[field] !== 'string') {
      return res.status(400).json({ message: `Field "${field}" must be a string` });
    }
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'private') && typeof updates.private !== 'boolean') {
    return res.status(400).json({ message: 'Field "private" must be a boolean' });
  }

  Object.assign(repo, updates);
  res.json(repo);
});

// Delete repository
app.delete('/api/repositories/:id', authenticateToken, (req, res) => {
  const index = repositories.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Repository not found' });
  
  repositories.splice(index, 1);
  res.json({ message: 'Repository deleted' });
});

// Search repositories
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const filtered = repositories.filter(repo =>
    repo.name.toLowerCase().includes(query) ||
    repo.description.toLowerCase().includes(query) ||
    repo.topics.some(t => t.toLowerCase().includes(query))
  );
  res.json(filtered);
});

// Get repository issues
app.get('/api/repositories/:id/issues', (req, res) => {
  const repoIssues = issues.filter(i => i.repoId === parseInt(req.params.id));
  res.json(repoIssues);
});

let nextIssueId = issues.length > 0 ? Math.max(...issues.map(i => i.id)) + 1 : 1;
let nextPullRequestId = pullRequests.length > 0 ? Math.max(...pullRequests.map(p => p.id)) + 1 : 1;

// Create issue
app.post('/api/repositories/:id/issues', authenticateToken, (req, res) => {
  const repoId = parseInt(req.params.id);
  const repositoryExists = repositories.some(r => r.id === repoId);
  if (!repositoryExists) return res.status(404).json({ message: 'Repository not found' });

  const newIssue = {
    id: nextIssueId++,
    repoId,
    ...req.body,
    createdAt: new Date()
  };
  issues.push(newIssue);
  res.status(201).json(newIssue);
});

// Get pull requests
app.get('/api/repositories/:id/pulls', (req, res) => {
  const repoPulls = pullRequests.filter(p => p.repoId === parseInt(req.params.id));
  res.json(repoPulls);
});

// Create pull request
app.post('/api/repositories/:id/pulls', authenticateToken, (req, res) => {
  const repoId = parseInt(req.params.id, 10);
  if (!Number.isInteger(repoId)) {
    return res.status(400).json({ message: 'invalid repository id' });
  }

  const repoExists = repositories.some(r => r.id === repoId);
  if (!repoExists) {
    return res.status(404).json({ message: 'repository not found' });
  }

  const { title, description, sourceBranch, targetBranch, status } = req.body || {};
  if (!title || !sourceBranch || !targetBranch) {
    return res.status(400).json({ message: 'title, sourceBranch, and targetBranch are required' });
  }

  const allowedStatuses = ['open', 'closed', 'merged'];
  const normalizedStatus = status || 'open';
  if (!allowedStatuses.includes(normalizedStatus)) {
    return res.status(400).json({ message: 'Invalid status. Allowed values are: open, closed, merged.' });
  }

  const newPull = {
    id: nextPullRequestId++,
    repoId,
    title,
    description: description || '',
    sourceBranch,
    targetBranch,
    status: normalizedStatus,
    createdAt: new Date()
  };
  pullRequests.push(newPull);
  res.status(201).json(newPull);
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let nextUserId = (users.reduce((max, u) => Math.max(max, Number.isInteger(u.id) ? u.id : 0), 0)) + 1;

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  const { username, password, name, email } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  if (users.find(u => u.username === username)) return res.status(409).json({ message: 'username already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: nextUserId++,
    username,
    passwordHash,
    name: name || username,
    email: email || '',
    bio: '',
    createdAt: new Date()
  };
  users.push(newUser);
  const { passwordHash: _, ...safe } = newUser;
  res.status(201).json(safe);
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'invalid credentials' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: 'invalid credentials' });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  const { passwordHash, ...safe } = user;
  res.json({ token, user: safe });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === payload.userId);
    if (!user) return res.status(401).json({ message: 'invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'invalid token' });
  }
}

// Profile routes
app.get('/api/profile', authenticateToken, (req, res) => {
  const { passwordHash, ...safe } = req.user;
  res.json(safe);
});

app.put('/api/profile', authenticateToken, (req, res) => {
  const { name, email, bio, avatarUrl } = req.body;
  Object.assign(req.user, { name: name ?? req.user.name, email: email ?? req.user.email, bio: bio ?? req.user.bio, avatarUrl: avatarUrl ?? req.user.avatarUrl });
  const { passwordHash, ...safe } = req.user;
  res.json(safe);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
