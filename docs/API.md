# API Documentation

Complete API reference for GitHub Clone.

## Base URL

```
https://red-shapes-git.onrender.com/api
```

## Authentication

Currently, the API is public with no authentication required. This will be added in future versions.

## Response Format

All responses are in JSON format.

### Success Response
```json
{
  "id": 1,
  "name": "repository-name",
  "data": "..."
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

## Repositories

### List All Repositories

**Endpoint:**
```
GET /repositories
```

**Description:** Get a list of all repositories

**Response:**
```json
[
  {
    "id": 1,
    "name": "awesome-project",
    "owner": "john-doe",
    "description": "An awesome project showcasing best practices",
    "stars": 1250,
    "forks": 340,
    "language": "JavaScript",
    "topics": ["javascript", "web", "tutorial"],
    "isPublic": true,
    "issues": 45,
    "pulls": 12
  },
  {
    "id": 2,
    "name": "react-components",
    "owner": "jane-smith",
    "description": "Reusable React components library",
    "stars": 892,
    "forks": 156,
    "language": "TypeScript",
    "topics": ["react", "components", "typescript"],
    "isPublic": true,
    "issues": 23,
    "pulls": 8
  }
]
```

**Status Code:** `200 OK`

---

### Get Single Repository

**Endpoint:**
```
GET /repositories/:id
```

**Parameters:**
- `id` (required, integer): Repository ID

**Response:**
```json
{
  "id": 1,
  "name": "awesome-project",
  "owner": "john-doe",
  "description": "An awesome project showcasing best practices",
  "stars": 1250,
  "forks": 340,
  "language": "JavaScript",
  "topics": ["javascript", "web", "tutorial"],
  "isPublic": true,
  "issues": 45,
  "pulls": 12
}
```

**Status Codes:**
- `200 OK`: Repository found
- `404 Not Found`: Repository not found

---

### Create Repository

**Endpoint:**
```
POST /repositories
```

**Request Body:**
```json
{
  "name": "new-project",
  "owner": "username",
  "description": "Project description",
  "language": "JavaScript",
  "topics": ["web", "api"],
  "isPublic": true
}
```

**Response:**
```json
{
  "id": 3,
  "name": "new-project",
  "owner": "username",
  "description": "Project description",
  "language": "JavaScript",
  "topics": ["web", "api"],
  "isPublic": true,
  "stars": 0,
  "forks": 0,
  "issues": 0,
  "pulls": 0
}
```

**Status Code:** `201 Created`

**Validation:**
- `name` (required): String, unique
- `owner` (required): String
- `description` (optional): String
- `language` (optional): String
- `topics` (optional): Array of strings
- `isPublic` (optional): Boolean, defaults to true

---

### Update Repository

**Endpoint:**
```
PUT /repositories/:id
```

**Parameters:**
- `id` (required, integer): Repository ID

**Request Body:**
```json
{
  "description": "Updated description",
  "stars": 1251,
  "language": "TypeScript"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "awesome-project",
  "owner": "john-doe",
  "description": "Updated description",
  "stars": 1251,
  "language": "TypeScript",
  "topics": ["javascript", "web", "tutorial"],
  "isPublic": true,
  "forks": 340,
  "issues": 45,
  "pulls": 12
}
```

**Status Codes:**
- `200 OK`: Updated successfully
- `404 Not Found`: Repository not found

---

### Delete Repository

**Endpoint:**
```
DELETE /repositories/:id
```

**Parameters:**
- `id` (required, integer): Repository ID

**Response:**
```json
{
  "message": "Repository deleted"
}
```

**Status Codes:**
- `200 OK`: Deleted successfully
- `404 Not Found`: Repository not found

---

## Search

### Search Repositories

**Endpoint:**
```
GET /search?q=query
```

**Query Parameters:**
- `q` (required): Search query string

**Description:** Search repositories by name, description, owner, or topics

**Examples:**
```
GET /search?q=javascript
GET /search?q=api
GET /search?q=john-doe
GET /search?q=web
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "awesome-project",
    "owner": "john-doe",
    "description": "An awesome project showcasing best practices",
    "stars": 1250,
    "forks": 340,
    "language": "JavaScript",
    "topics": ["javascript", "web", "tutorial"],
    "isPublic": true,
    "issues": 45,
    "pulls": 12
  }
]
```

**Status Code:** `200 OK`

---

## Issues

### Get Repository Issues

**Endpoint:**
```
GET /repositories/:id/issues
```

**Parameters:**
- `id` (required, integer): Repository ID

**Response:**
```json
[
  {
    "id": 1,
    "repoId": 1,
    "title": "Fix login bug",
    "description": "Users cannot login on mobile",
    "priority": "high",
    "status": "open",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "repoId": 1,
    "title": "Add dark theme",
    "description": "Implement dark mode support",
    "priority": "medium",
    "status": "open",
    "createdAt": "2024-01-14T14:22:00Z"
  }
]
```

**Status Codes:**
- `200 OK`: Issues retrieved
- `404 Not Found`: Repository not found

---

### Create Issue

**Endpoint:**
```
POST /repositories/:id/issues
```

**Parameters:**
- `id` (required, integer): Repository ID

**Request Body:**
```json
{
  "title": "Add new feature",
  "description": "Implement user authentication",
  "priority": "high"
}
```

**Response:**
```json
{
  "id": 3,
  "repoId": 1,
  "title": "Add new feature",
  "description": "Implement user authentication",
  "priority": "high",
  "status": "open",
  "createdAt": "2024-01-16T09:15:00Z"
}
```

**Status Codes:**
- `201 Created`: Issue created
- `404 Not Found`: Repository not found

**Validation:**
- `title` (required): String
- `description` (optional): String
- `priority` (optional): 'low', 'medium', or 'high'

---

## Pull Requests

### Get Repository Pull Requests

**Endpoint:**
```
GET /repositories/:id/pulls
```

**Parameters:**
- `id` (required, integer): Repository ID

**Response:**
```json
[
  {
    "id": 1,
    "repoId": 1,
    "title": "feat: add user authentication",
    "branch": "feature/auth",
    "targetBranch": "main",
    "description": "Implements user login and registration",
    "status": "open",
    "createdAt": "2024-01-15T11:45:00Z"
  }
]
```

**Status Codes:**
- `200 OK`: Pull requests retrieved
- `404 Not Found`: Repository not found

---

### Create Pull Request

**Endpoint:**
```
POST /repositories/:id/pulls
```

**Parameters:**
- `id` (required, integer): Repository ID

**Request Body:**
```json
{
  "title": "feat: add dark theme",
  "branch": "feature/dark-theme",
  "targetBranch": "main",
  "description": "Adds dark mode support to the application"
}
```

**Response:**
```json
{
  "id": 2,
  "repoId": 1,
  "title": "feat: add dark theme",
  "branch": "feature/dark-theme",
  "targetBranch": "main",
  "description": "Adds dark mode support to the application",
  "status": "open",
  "createdAt": "2024-01-16T13:20:00Z"
}
```

**Status Codes:**
- `201 Created`: Pull request created
- `404 Not Found`: Repository not found

**Validation:**
- `title` (required): String
- `branch` (required): String
- `targetBranch` (optional): String, defaults to 'main'
- `description` (optional): String

---

## Error Codes

### 400 Bad Request
Invalid request parameters or malformed JSON

```json
{
  "message": "Invalid request data"
}
```

### 404 Not Found
Resource not found

```json
{
  "message": "Repository not found"
}
```

### 500 Internal Server Error
Server error

```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting

Currently, there is no rate limiting. This will be implemented in future versions for production use.

---

## CORS Headers

The API includes CORS headers to allow requests from any origin:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
```

---

## Examples

### Using JavaScript Fetch API

**Get All Repositories:**
```javascript
fetch('https://red-shapes-git.onrender.com/api/repositories')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Create Repository:**
```javascript
const newRepo = {
  name: "my-project",
  owner: "my-username",
  description: "My new project",
  language: "JavaScript",
  topics: ["web", "api"],
  isPublic: true
};

fetch('https://red-shapes-git.onrender.com/api/repositories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newRepo)
})
  .then(response => response.json())
  .then(data => console.log('Created:', data))
  .catch(error => console.error('Error:', error));
```

**Search Repositories:**
```javascript
const query = 'javascript';
fetch(`https://red-shapes-git.onrender.com/api/search?q=${query}`)
  .then(response => response.json())
  .then(data => console.log('Results:', data))
  .catch(error => console.error('Error:', error));
```

### Using cURL

**Get All Repositories:**
```bash
curl https://red-shapes-git.onrender.com/api/repositories
```

**Create Repository:**
```bash
curl -X POST https://red-shapes-git.onrender.com/api/repositories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-project",
    "owner": "my-username",
    "description": "My new project"
  }'
```

**Delete Repository:**
```bash
curl -X DELETE https://red-shapes-git.onrender.com/api/repositories/1
```

---

## Webhooks (Future)

Webhook support is planned for future versions. Webhooks will allow external services to receive notifications when events occur (e.g., issue created, PR merged).

---

## GraphQL (Future)

A GraphQL endpoint is planned for future versions to provide more flexible querying capabilities.

---

## API Versioning

Current Version: `v1` (implicit)

Future versions will use `/api/v2/`, `/api/v3/`, etc. to maintain backward compatibility.

---

## Support

For issues or questions about the API:
- Check [README.md](README.md)
- Review [CONTRIBUTING.md](CONTRIBUTING.md)
- Open an [issue](https://github.com/Red-Shapes/Red-Shapes-Git/issues)

---

Last Updated: January 2024
