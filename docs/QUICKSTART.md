# Quick Start Guide

Get GitHub Clone up and running in minutes!

## 🚀 5-Minute Setup

### Step 1: Prerequisites Check
```bash
# Verify Node.js installation
node --version  # Should be v14 or higher
npm --version   # Should be v6 or higher
```

### Step 2: Clone the Repository
```bash
git clone https://github.com/Red-Shapes/Red-Shapes-Git.git
cd Red-Shapes-Git
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start the Server
```bash
npm start
```

You should see:
```
Server running on http://localhost:3000
```

### Step 5: Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

## 🎮 First Steps

### Create Your First Repository
1. Click "New Repository" button in top right
2. Fill in these fields:
   - **Name**: `my-first-project`
   - **Owner**: `my-username`
   - **Description**: `My first GitHub Clone repository`
   - **Language**: `JavaScript`
   - **Topics**: `demo,learning` (comma-separated)
3. Leave "Public Repository" checked
4. Click "Create Repository"

### Search for Repositories
1. Use the search box at the top
2. Type any keyword to filter repositories
3. Results update in real-time

### Create an Issue
1. Click on any repository card
2. Click "Create Issue" button
3. Fill in:
   - **Title**: `Bug: Feature not working`
   - **Description**: Describe the issue
   - **Priority**: Select level
4. Click "Create Issue"

### Create a Pull Request
1. Click on any repository card
2. Click "Create Pull Request" button
3. Fill in:
   - **Title**: `feat: add new feature`
   - **From Branch**: `feature/new-feature`
   - **To Branch**: `main`
   - **Description**: Describe your changes
4. Click "Create Pull Request"

## 📁 Project Structure Quick Tour

```
├── public/              # Frontend files
│   ├── index.html      # Main page (start here!)
│   ├── styles.css      # All styling
│   └── script.js       # Frontend logic
│
├── server.js           # Backend API (run: npm start)
├── package.json        # Dependencies & scripts
│
├── .github/            # GitHub configuration
│   ├── dependabot.yml
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   └── pull_request_template.md
│
└── Docs/
    ├── README.md       # Full documentation
    ├── CONTRIBUTING.md # How to contribute
    ├── SECURITY.md     # Security policy
    └── ARCHITECTURE.md # Technical details
```

## 🔧 Common Tasks

### Stop the Server
Press `Ctrl+C` in the terminal

### Restart the Server
```bash
npm start
```

### Check if Port 3000 is Available
```bash
# On macOS/Linux
lsof -i :3000

# On Windows
netstat -ano | findstr :3000
```

### Use a Different Port
Edit `server.js` line:
```javascript
const PORT = 3000;  // Change 3000 to your preferred port
```

## 🔌 Testing the API Directly

### Using curl

**Get All Repositories:**
```bash
curl http://localhost:3000/api/repositories
```

**Create a Repository:**
```bash
curl -X POST http://localhost:3000/api/repositories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-repo",
    "owner": "test-user",
    "description": "Test repository",
    "language": "JavaScript",
    "topics": ["test"],
    "isPublic": true
  }'
```

**Search Repositories:**
```bash
curl "http://localhost:3000/api/search?q=javascript"
```

### Using Postman or Insomnia

Import this collection:
```json
{
  "GET /api/repositories": "http://localhost:3000/api/repositories",
  "POST /api/repositories": "http://localhost:3000/api/repositories",
  "GET /api/search": "http://localhost:3000/api/search?q=query"
}
```

## 💡 Tips & Tricks

### Keyboard Shortcuts
- Search: Click search box and type
- Close modal: Click outside the modal or press Escape

### Data Persistence Note
⚠️ **Important**: Data is stored in memory. When you restart the server, all data is lost. To keep data permanent, [upgrade to a database](ARCHITECTURE.md#database-migration).

### Customizing Appearance
1. Open `public/styles.css`
2. Find `:root { --primary-color: ... }`
3. Change color values to customize the theme
4. Refresh browser to see changes

## 🐛 Troubleshooting

### "Port 3000 is already in use"
```bash
# Find what's using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use different port
```

### "Cannot find module 'express'"
```bash
npm install
```

### "Page shows 'Cannot GET /'"
Make sure server is running and you're at `http://localhost:3000`

### Blank page with no styling
1. Check browser console (F12) for errors
2. Refresh page (Ctrl+R or Cmd+R)
3. Clear browser cache

## 📚 Next Steps

After getting comfortable with the basics:

1. **Explore the Code**
   - Read through `public/script.js` to understand frontend
   - Review `server.js` to understand backend
   - Check `ARCHITECTURE.md` for technical details

2. **Customize**
   - Change colors in `public/styles.css`
   - Add initial repositories in `server.js`
   - Modify the UI in `public/index.html`

3. **Extend Functionality**
   - Add user authentication
   - Connect to a database
   - Add more features (comments, reviews, etc.)
   - See [CONTRIBUTING.md](CONTRIBUTING.md) for ideas

4. **Deploy**
   - [Deploy to Heroku](https://devcenter.heroku.com/articles/deploying-nodejs-apps-on-heroku)
   - [Deploy to Railway](https://railway.app/)
   - [Deploy to AWS](https://aws.amazon.com/getting-started/projects/deploy-nodejs-web-app/)

## ❓ Questions?

- 📖 Check [README.md](README.md) for full documentation
- 🤝 Read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- 🔒 Review [SECURITY.md](SECURITY.md) for security info
- 💬 Open an [issue](https://github.com/Red-Shapes/Red-Shapes-Git/issues) for support

## 🎓 Learning Resources

- [Node.js Official Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JavaScript MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)
- [REST API Best Practices](https://restfulapi.net/)
- [GitHub Development](https://docs.github.com/en/developers)

---

Happy coding! 🚀
