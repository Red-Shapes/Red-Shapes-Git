# GitHub Clone - Collaboration Platform

A fully functional GitHub-like platform built with HTML, CSS, JavaScript, and Node.js. This project demonstrates a complete web application with repository management, issue tracking, pull requests, and all necessary GitHub community standards files.

## 🌟 Features

### Frontend
- **Modern UI**: Dark theme inspired by GitHub's interface
- **Repository Management**: Create, view, search, and filter repositories
- **Repository Details**: View repository information, issues, and pull requests
- **Issue Tracking**: Create and manage issues with priority levels
- **Pull Requests**: Create and manage pull requests with branch tracking
- **Search & Filtering**: Full-text search and language filtering
- **Statistics Dashboard**: Real-time statistics on repositories, issues, and PRs
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Trending Repositories**: Automatically sorted by star count

### Backend
- **REST API**: Complete REST API for all operations
- **In-Memory Database**: Fast, lightweight data storage
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Search Endpoints**: Advanced search across multiple fields
- **Error Handling**: Comprehensive error handling and validation

### GitHub Community Standards
- ✅ **Dependabot Configuration** (`.github/dependabot.yml`)
- ✅ **Security Policy** (`docs/SECURITY.md`)
- ✅ **Code of Conduct** (`docs/CODE_OF_CONDUCT.md`)
- ✅ **Contributing Guidelines** (`docs/CONTRIBUTING.md`)
- ✅ **Issue Templates** (Bug, Feature, Documentation)
- ✅ **Pull Request Template**

## 📋 Project Structure

```
Red-Shapes-Git/
├── public/                          # Frontend files
│   ├── index.html                  # Main HTML file
│   ├── styles.css                  # Styling
│   └── script.js                   # Frontend logic
├── .github/                         # GitHub configuration
│   ├── dependabot.yml              # Dependabot setup
│   ├── ISSUE_TEMPLATE/             # Issue templates
│   │   ├── bug_report.md           # Bug report template
│   │   ├── feature_request.md      # Feature request template
│   │   └── documentation.md        # Documentation template
│   └── pull_request_template.md    # PR template
├── server.js                        # Node.js backend
├── package.json                     # Dependencies and scripts
├── docs/                            # Project documentation
│   ├── API.md                      # API reference
│   ├── ARCHITECTURE.md             # Architecture docs
│   ├── CHANGELOG.md                # Changelog
│   ├── CODE_OF_CONDUCT.md          # Community code of conduct
│   ├── CONTRIBUTING.md             # Contribution guidelines
│   ├── QUICKSTART.md               # Quick start guide
│   ├── SECURITY.md                 # Security policy
│   └── TROUBLESHOOTING.md          # Troubleshooting guide
├── LICENSE                         # MIT License
├── README.md                       # This file
└── .gitignore                      # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- A modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Red-Shapes/Red-Shapes-Git.git
cd Red-Shapes-Git
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Open in browser**
Navigate to `http://localhost:3000` in your web browser.

### Development Mode

For development with auto-reload:
```bash
npm run dev
```

## 📖 Usage

### Creating a Repository
1. Click the "New Repository" button in the top navigation
2. Fill in the repository details:
   - Repository Name
   - Owner
   - Description
   - Primary Language
   - Topics (comma-separated)
   - Visibility (Public/Private)
3. Click "Create Repository"

### Searching Repositories
1. Use the search box in the navigation bar
2. Search by repository name, description, owner, or topics
3. Results update in real-time as you type

### Filtering and Sorting
1. Use the "Language" filter to show repositories of a specific language
2. Use the "Sort by" dropdown to sort by:
   - Name (alphabetical)
   - Stars (most popular)
   - Recently Updated

### Creating Issues
1. Click on a repository card to open its details
2. In the Issues section, click "Create Issue"
3. Fill in the issue details:
   - Title
   - Description
   - Priority level
4. Click "Create Issue"

### Creating Pull Requests
1. Click on a repository card to open its details
2. In the Pull Requests section, click "Create Pull Request"
3. Fill in the PR details:
   - Title
   - From Branch
   - To Branch (default: main)
   - Description
4. Click "Create Pull Request"

### Starring and Forking
1. Open a repository detail view
2. Click "⭐ Star" to star the repository (increases star count)
3. Click "🍴 Fork" to fork the repository (increases fork count)

## 🔌 API Endpoints

### Repositories
```
GET    /api/repositories              # List all repositories
GET    /api/repositories/:id          # Get repository details
POST   /api/repositories              # Create new repository
PUT    /api/repositories/:id          # Update repository
DELETE /api/repositories/:id          # Delete repository
GET    /api/search?q=query            # Search repositories
```

### Issues
```
GET    /api/repositories/:id/issues   # Get repository issues
POST   /api/repositories/:id/issues   # Create new issue
```

### Pull Requests
```
GET    /api/repositories/:id/pulls    # Get repository PRs
POST   /api/repositories/:id/pulls    # Create new PR
```

## 🎨 Customization

### Color Scheme
Edit the CSS variables in `public/styles.css`:
```css
:root {
    --primary-color: #1f6feb;
    --secondary-color: #30363d;
    --background-color: #0d1117;
    --text-color: #c9d1d9;
    /* ... more colors */
}
```

### Backend Data
Modify the initial repositories in `server.js`:
```javascript
let repositories = [
    {
        id: 1,
        name: 'your-project',
        // ... more properties
    }
];
```

## 📚 Documentation

- [Contributing Guidelines](docs/CONTRIBUTING.md) - How to contribute to the project
- [Code of Conduct](docs/CODE_OF_CONDUCT.md) - Community guidelines
- [Security Policy](docs/SECURITY.md) - Security information and reporting
- [Issue Templates](.github/ISSUE_TEMPLATE/) - How to create issues

## 🔒 Security

For security vulnerability reporting, please see [docs/SECURITY.md](docs/SECURITY.md).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on:
- How to report bugs
- How to suggest enhancements
- Development setup
- Styleguides
- Pull request process

## 🐛 Bug Reports and Features

- **Bug Reports**: Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature Requests**: Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)
- **Documentation**: Use the [Documentation Template](.github/ISSUE_TEMPLATE/documentation.md)

## 📊 Project Statistics

- **Total Repositories**: Automatically counted
- **Total Issues**: Tracked across all repositories
- **Total Pull Requests**: Tracked across all repositories
- **Real-time Updates**: All statistics update in real-time

## 🎯 Future Enhancements

Potential features for future development:
- [ ] User authentication and profiles
- [ ] Repository collaborators and permissions
- [ ] Comment threads on issues and PRs
- [ ] Code review features
- [ ] Webhook support
- [ ] GitHub API integration
- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] CI/CD workflow integration
- [ ] Advanced search filters
- [ ] Repository templates

## 💬 Support

For support, please:
1. Check the documentation in [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
2. Search existing issues
3. Create a new issue using the appropriate template
4. Join our community discussions

## 👥 Community

- Follow our [Code of Conduct](docs/CODE_OF_CONDUCT.md)
- Read our [Contributing Guidelines](docs/CONTRIBUTING.md)
- Review our [Security Policy](docs/SECURITY.md)
- Join discussions and help other community members

## 🙏 Acknowledgments

This project demonstrates GitHub best practices including:
- Professional README documentation
- Comprehensive GitHub templates
- Automated dependency management with Dependabot
- Clear security and community guidelines
- Detailed contribution guidelines

---

**Built with ❤️ by the GitHub Clone Team**

Happy coding! If you find this project helpful, please consider giving it a star ⭐