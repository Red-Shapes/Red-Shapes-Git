const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
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

let issues = [];
let pullRequests = [];

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
app.post('/api/repositories', (req, res) => {
  const newRepo = {
    id: repositories.length + 1,
    ...req.body,
    stars: 0,
    forks: 0,
    issues: 0,
    pulls: 0
  };
  repositories.push(newRepo);
  res.status(201).json(newRepo);
});

// Update repository
app.put('/api/repositories/:id', (req, res) => {
  const repo = repositories.find(r => r.id === parseInt(req.params.id));
  if (!repo) return res.status(404).json({ message: 'Repository not found' });
  
  Object.assign(repo, req.body);
  res.json(repo);
});

// Delete repository
app.delete('/api/repositories/:id', (req, res) => {
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

// Create issue
app.post('/api/repositories/:id/issues', (req, res) => {
  const newIssue = {
    id: issues.length + 1,
    repoId: parseInt(req.params.id),
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
app.post('/api/repositories/:id/pulls', (req, res) => {
  const newPull = {
    id: pullRequests.length + 1,
    repoId: parseInt(req.params.id),
    ...req.body,
    createdAt: new Date()
  };
  pullRequests.push(newPull);
  res.status(201).json(newPull);
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
