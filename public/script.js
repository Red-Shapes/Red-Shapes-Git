// API Base URL
const API_URL = 'https://red-shapes-git.onrender.com/api';

// State
let repositories = [];
let filteredRepositories = [];
let currentRepoId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadRepositories();
    setupEventListeners();
    updateStatistics();
    loadAuthState();
});

// Event Listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', debounce(searchRepositories, 300));
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Load repositories from API
async function loadRepositories() {
    try {
        const response = await fetch(`${API_URL}/repositories`);
        repositories = await response.json();
        filteredRepositories = [...repositories];
        displayRepositories(filteredRepositories);
        updateTrendingList();
        updateStatistics();
    } catch (error) {
        console.error('Error loading repositories:', error);
        showNotification('Error loading repositories', 'error');
    }
}

// Display repositories
function displayRepositories(repos) {
    const list = document.getElementById('repositoriesList');
    
    if (repos.length === 0) {
        list.innerHTML = '<p style="color: #8b949e; text-align: center; padding: 40px;">No repositories found</p>';
        return;
    }

    list.innerHTML = repos.map(repo => `
        <div class="repo-card" onclick="openRepoDetail(${repo.id})">
            <div class="repo-header">
                <div class="repo-name">${escapeHtml(repo.name)}</div>
                <div class="repo-visibility">${repo.isPublic ? 'Public' : 'Private'}</div>
            </div>
            <div class="repo-description">${repo.description ? escapeHtml(repo.description) : 'No description'}</div>
            <div class="repo-topics">
                ${repo.topics.map(topic => `<span class="topic-badge">${escapeHtml(topic)}</span>`).join('')}
            </div>
            <div class="repo-footer">
                <div class="repo-stats">
                    <div class="stat-item">
                        <span>⭐</span>
                        <span>${repo.stars}</span>
                    </div>
                    <div class="stat-item">
                        <span>🍴</span>
                        <span>${repo.forks}</span>
                    </div>
                    <div class="stat-item">
                        <span>${repo.language || 'N/A'}</span>
                    </div>
                </div>
                <div>Issues: ${repo.issues} | PRs: ${repo.pulls}</div>
            </div>
        </div>
    `).join('');
}

// Open repository detail modal
async function openRepoDetail(repoId) {
    currentRepoId = repoId;
    const repo = repositories.find(r => r.id === repoId);
    
    if (!repo) return;

    try {
        const [issues, pulls] = await Promise.all([
            fetch(`${API_URL}/repositories/${repoId}/issues`).then(r => r.json()),
            fetch(`${API_URL}/repositories/${repoId}/pulls`).then(r => r.json())
        ]);

        const detailsContainer = document.getElementById('repoDetails');
        detailsContainer.innerHTML = `
            <div class="repo-details-container">
                <div class="repo-details-header">
                    <h2>${escapeHtml(repo.name)}</h2>
                    <div class="repo-details-meta">
                        <span>By ${escapeHtml(repo.owner)}</span>
                        <span>⭐ ${repo.stars}</span>
                        <span>🍴 ${repo.forks}</span>
                    </div>
                    <p>${repo.description || 'No description provided'}</p>
                </div>
                <div class="repo-details-body">
                    <div class="detail-section">
                        <h3>Issues (${issues.length})</h3>
                        ${issues.length > 0 ? `
                            <ul style="list-style: none;">
                                ${issues.slice(0, 5).map(issue => `
                                    <li style="padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                                        <div style="color: var(--info-color); font-weight: 500;">${escapeHtml(issue.title)}</div>
                                        <div style="font-size: 12px; color: #8b949e;">Priority: ${issue.priority}</div>
                                    </li>
                                `).join('')}
                            </ul>
                        ` : '<p style="color: #8b949e;">No open issues</p>'}
                        <button class="btn-primary" onclick="openIssueModal(${repoId})" style="margin-top: 12px; width: 100%;">
                            Create Issue
                        </button>
                    </div>
                    <div class="detail-section">
                        <h3>Pull Requests (${pulls.length})</h3>
                        ${pulls.length > 0 ? `
                            <ul style="list-style: none;">
                                ${pulls.slice(0, 5).map(pr => `
                                    <li style="padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                                        <div style="color: var(--info-color); font-weight: 500;">${escapeHtml(pr.title)}</div>
                                        <div style="font-size: 12px; color: #8b949e;">From: ${escapeHtml(pr.branch)}</div>
                                    </li>
                                `).join('')}
                            </ul>
                        ` : '<p style="color: #8b949e;">No open pull requests</p>'}
                        <button class="btn-primary" onclick="openPullRequestModal(${repoId})" style="margin-top: 12px; width: 100%;">
                            Create Pull Request
                        </button>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn-primary" onclick="starRepository(${repoId})">⭐ Star</button>
                    <button class="btn-secondary" onclick="forkRepository(${repoId})">🍴 Fork</button>
                    <button class="btn-secondary" onclick="deleteRepository(${repoId})">🗑️ Delete</button>
                </div>
            </div>
        `;

        openModal('repoDetailModal');
    } catch (error) {
        console.error('Error loading repository details:', error);
        showNotification('Error loading repository details', 'error');
    }
}

// Create repository
async function createRepository(e) {
    e.preventDefault();

    const repoData = {
        name: document.getElementById('repoName').value,
        owner: document.getElementById('repoOwner').value,
        description: document.getElementById('repoDescription').value,
        language: document.getElementById('repoLanguage').value || 'Unknown',
        topics: document.getElementById('repoTopics').value.split(',').map(t => t.trim()).filter(t => t),
        isPublic: document.getElementById('repoPublic').checked
    };

    try {
        const response = await fetch(`${API_URL}/repositories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(repoData)
        });

        if (!response.ok) throw new Error('Failed to create repository');

        const newRepo = await response.json();
        repositories.push(newRepo);
        displayRepositories(repositories);
        closeModal('newRepoModal');
        document.getElementById('newRepoForm').reset();
        showNotification(`Repository "${newRepo.name}" created successfully!`, 'success');
        updateStatistics();
    } catch (error) {
        console.error('Error creating repository:', error);
        showNotification('Error creating repository', 'error');
    }
}

// Delete repository
async function deleteRepository(repoId) {
    if (!confirm('Are you sure you want to delete this repository?')) return;

    try {
        const response = await fetch(`${API_URL}/repositories/${repoId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete repository');

        repositories = repositories.filter(r => r.id !== repoId);
        displayRepositories(repositories);
        closeModal('repoDetailModal');
        showNotification('Repository deleted successfully', 'success');
        updateStatistics();
    } catch (error) {
        console.error('Error deleting repository:', error);
        showNotification('Error deleting repository', 'error');
    }
}

// Star repository
async function starRepository(repoId) {
    const repo = repositories.find(r => r.id === repoId);
    if (!repo) return;

    const previousStars = repo.stars;
    repo.stars += 1;

    try {
        const response = await fetch(`${API_URL}/repositories/${repoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stars: repo.stars })
        });

        if (!response.ok) throw new Error('Failed to star repository');

        displayRepositories(repositories);
        openRepoDetail(repoId);
        showNotification('Repository starred!', 'success');
    } catch (error) {
        repo.stars = previousStars;
        displayRepositories(repositories);
        openRepoDetail(repoId);
        console.error('Error starring repository:', error);
        showNotification('Error starring repository', 'error');
    }
}

// Fork repository
async function forkRepository(repoId) {
    const repo = repositories.find(r => r.id === repoId);
    if (!repo) return;

    const previousForks = repo.forks;
    repo.forks += 1;

    try {
        await fetch(`${API_URL}/repositories/${repoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ forks: repo.forks })
        });

        displayRepositories(repositories);
        openRepoDetail(repoId);
        showNotification('Repository forked!', 'success');
    } catch (error) {
        repo.forks = previousForks;
        displayRepositories(repositories);
        openRepoDetail(repoId);
        console.error('Error forking repository:', error);
        showNotification('Error forking repository', 'error');
    }
}

// Search repositories
function searchRepositories() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    if (!query) {
        filteredRepositories = [...repositories];
    } else {
        filteredRepositories = repositories.filter(repo =>
            repo.name.toLowerCase().includes(query) ||
            repo.description?.toLowerCase().includes(query) || false ||
            repo.owner.toLowerCase().includes(query) ||
            repo.topics.some(t => t.toLowerCase().includes(query))
        );
    }

    displayRepositories(filteredRepositories);
}

// Filter repositories
function filterRepositories() {
    const language = document.getElementById('languageFilter').value;
    
    if (!language) {
        filteredRepositories = [...repositories];
    } else {
        filteredRepositories = repositories.filter(repo => repo.language === language);
    }

    displayRepositories(filteredRepositories);
}

// Sort repositories
function sortRepositories() {
    const sortBy = document.getElementById('sortBy').value;

    switch (sortBy) {
        case 'name':
            filteredRepositories.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'stars':
            filteredRepositories.sort((a, b) => b.stars - a.stars);
            break;
        case 'updated':
            filteredRepositories.sort((a, b) => new Date(b.updated) - new Date(a.updated));
            break;
    }

    displayRepositories(filteredRepositories);
}

// Create issue
async function createIssue(e) {
    e.preventDefault();

    const issueData = {
        title: document.getElementById('issueTitle').value,
        description: document.getElementById('issueDescription').value,
        priority: document.getElementById('issuePriority').value,
        status: 'open'
    };

    try {
        const response = await fetch(`${API_URL}/repositories/${currentRepoId}/issues`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issueData)
        });

        if (!response.ok) throw new Error('Failed to create issue');

        closeModal('issueModal');
        document.getElementById('issueForm').reset();
        openRepoDetail(currentRepoId);
        showNotification('Issue created successfully!', 'success');
    } catch (error) {
        console.error('Error creating issue:', error);
        showNotification('Error creating issue', 'error');
    }
}

// Create pull request
async function createPullRequest(e) {
    e.preventDefault();

    const prData = {
        title: document.getElementById('prTitle').value,
        branch: document.getElementById('prBranch').value,
        targetBranch: document.getElementById('prTargetBranch').value,
        description: document.getElementById('prDescription').value,
        status: 'open'
    };

    try {
        const response = await fetch(`${API_URL}/repositories/${currentRepoId}/pulls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prData)
        });

        if (!response.ok) throw new Error('Failed to create pull request');

        closeModal('pullRequestModal');
        document.getElementById('pullRequestForm').reset();
        openRepoDetail(currentRepoId);
        showNotification('Pull request created successfully!', 'success');
    } catch (error) {
        console.error('Error creating pull request:', error);
        showNotification('Error creating pull request', 'error');
    }
}

// Update trending list
function updateTrendingList() {
    const sorted = [...repositories].sort((a, b) => b.stars - a.stars).slice(0, 5);
    const list = document.getElementById('trendingList');
    list.innerHTML = sorted.map(repo => `
        <li><a href="#" onclick="openRepoDetail(${repo.id}); return false;">${escapeHtml(repo.name)}</a></li>
    `).join('');
}

// Update statistics
function updateStatistics() {
    document.getElementById('totalRepos').textContent = repositories.length;
    document.getElementById('totalIssues').textContent = repositories.reduce((sum, r) => sum + r.issues, 0);
    document.getElementById('totalPRs').textContent = repositories.reduce((sum, r) => sum + r.pulls, 0);
}

// Switch tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Open issue modal
function openIssueModal(repoId) {
    currentRepoId = repoId;
    closeModal('repoDetailModal');
    openModal('issueModal');
}

// Open pull request modal
function openPullRequestModal(repoId) {
    currentRepoId = repoId;
    closeModal('repoDetailModal');
    openModal('pullRequestModal');
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // In a real app, you could display this in a toast notification
}

// ------------------- Authentication -------------------
function authFetch(url, opts = {}) {
    const token = localStorage.getItem('token');
    opts.headers = opts.headers || {};
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    return fetch(url, opts);
}

async function registerUser(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const name = document.getElementById('regName').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, name })
        });
        if (!res.ok) throw new Error('Registration failed');
        await res.json();
        showNotification('Registration successful. Please log in.', 'success');
        closeModal('registerModal');
        document.getElementById('registerForm').reset();
    } catch (err) {
        console.error(err);
        showNotification('Registration failed', 'error');
    }
}

async function loginUser(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error('Login failed');
        const payload = await res.json();
        localStorage.setItem('token', payload.token);
        setAuthUI(payload.user);
        showNotification('Logged in', 'success');
        closeModal('loginModal');
        document.getElementById('loginForm').reset();
    } catch (err) {
        console.error(err);
        showNotification('Login failed', 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    setAuthUI(null);
    showNotification('Logged out', 'info');
}

async function loadAuthState() {
    const token = localStorage.getItem('token');
    if (!token) {
        setAuthUI(null);
        return;
    }
    try {
        const res = await authFetch(`${API_URL}/profile`);
        if (!res.ok) throw new Error('Failed to load profile');
        const user = await res.json();
        setAuthUI(user);
    } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        setAuthUI(null);
    }
}

function setAuthUI(user) {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const profileBtn = document.getElementById('profileBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        profileBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'inline-block';
        profileBtn.textContent = user.username;
        // populate profile form when opened
        document.getElementById('profileName').value = user.name || '';
        document.getElementById('profileEmail').value = user.email || '';
        document.getElementById('profileBio').value = user.bio || '';
    } else {
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        profileBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

async function updateProfile(e) {
    e.preventDefault();
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const bio = document.getElementById('profileBio').value;

    try {
        const res = await authFetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, bio })
        });
        if (!res.ok) throw new Error('Failed to update profile');
        const user = await res.json();
        setAuthUI(user);
        showNotification('Profile updated', 'success');
        closeModal('profileModal');
    } catch (err) {
        console.error(err);
        showNotification('Failed to update profile', 'error');
    }
}
