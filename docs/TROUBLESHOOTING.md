# Troubleshooting Guide

Common issues and their solutions.

## Server Issues

### Issue: "Port 3000 is already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Find and kill the process (macOS/Linux):**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

2. **Find and kill the process (Windows):**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

3. **Use a different port:**
Edit `server.js`:
```javascript
const PORT = 3001;  // Change to 3001 or another free port
```

---

### Issue: "Cannot find module 'express'"

**Symptoms:**
```
Error: Cannot find module 'express'
```

**Solutions:**

1. **Install dependencies:**
```bash
npm install
```

2. **Check Node.js version:**
```bash
node --version  # Should be v14+
npm --version   # Should be v6+
```

3. **Clear npm cache:**
```bash
npm cache clean --force
npm install
```

4. **Reinstall from scratch:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: Server starts but API returns 404

**Symptoms:**
```
GET https://red-shapes-git.onrender.com/api/repositories
→ 404 Not Found
```

**Solutions:**

1. **Check server is running:**
In terminal, you should see:
```
Server running on https://red-shapes-git.onrender.com
```

2. **Verify URL spelling:**
- Correct: `https://red-shapes-git.onrender.com/api/repositories`
- Wrong: `https://red-shapes-git.onrender.com/repositories` (missing `/api/`)

3. **Check request method:**
- GET requests for listing and searching
- POST requests for creating
- PUT requests for updating
- DELETE requests for removing

---

## Frontend Issues

### Issue: Blank page with no styling

**Symptoms:**
- Page loads but shows only text
- No colors or layout
- HTML elements visible but unstyled

**Solutions:**

1. **Check browser console for errors:**
- Open DevTools (F12 or Cmd+Option+I)
- Check Console tab for error messages
- Check Network tab to see if CSS and JS loaded

2. **Clear browser cache:**
- Chrome: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
- Firefox: Ctrl+Shift+Delete
- Or use Ctrl+F5 (Cmd+Shift+R on Mac) for hard refresh

3. **Verify public folder exists:**
```bash
ls -la public/  # Should show index.html, styles.css, script.js
```

4. **Check file permissions:**
```bash
chmod 644 public/index.html
chmod 644 public/styles.css
chmod 644 public/script.js
```

---

### Issue: "Cannot GET /" on localhost

**Symptoms:**
```
Cannot GET /
```

**Solutions:**

1. **Verify server is running:**
Run in terminal:
```bash
npm start
```

You should see:
```
Server running on https://red-shapes-git.onrender.com
```

2. **Check you're at the right URL:**
- Correct: `https://red-shapes-git.onrender.com`
- Wrong: `http://localhost` (missing port)
- Wrong: `https://red-shapes-git.onrender.com/api` (try just the root)

3. **Check Express server setup:**
In `server.js`, verify this line exists:
```javascript
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

### Issue: Repository doesn't appear after creating

**Symptoms:**
- Create form submits successfully
- Modal closes
- New repository doesn't show in list

**Solutions:**

1. **Check browser console for errors:**
Press F12 and look for red error messages

2. **Verify API call succeeded:**
In Network tab, check POST request to `/api/repositories` shows 201 status

3. **Refresh the page:**
Press F5 (Cmd+R on Mac) - data reloads from server

4. **Check server still running:**
Look at terminal where you ran `npm start`

---

## API Issues

### Issue: CORS Error

**Symptoms:**
```
Access to XMLHttpRequest at 'https://red-shapes-git.onrender.com/api/...' 
from origin 'https://red-shapes-git.onrender.com' has been blocked by CORS policy
```

**Solutions:**

1. **Restart server:**
```bash
npm start
```

2. **Check CORS is enabled in server.js:**
```javascript
const cors = require('cors');
app.use(cors());
```

3. **Check request headers:**
Frontend should send `Content-Type: application/json`

---

### Issue: API returns empty array

**Symptoms:**
```
GET /api/repositories returns: []
```

**Solutions:**

1. **Check if repositories were created:**
Create a test repository through the UI first

2. **Verify data isn't lost:**
Data is stored in memory - restarts lose data
If you restarted the server, data is gone

3. **Check initial seed data:**
In `server.js`, the `repositories` array should have initial data

4. **Verify API endpoint:**
- Try `https://red-shapes-git.onrender.com/api/repositories`
- Not `https://red-shapes-git.onrender.com/repositories`

---

### Issue: Creating repository returns 400 error

**Symptoms:**
```
POST /api/repositories
→ 400 Bad Request
```

**Solutions:**

1. **Check request body format:**
```json
{
  "name": "repo-name",
  "owner": "username",
  "description": "Description",
  "language": "JavaScript",
  "topics": ["topic1", "topic2"],
  "isPublic": true
}
```

2. **Verify required fields:**
- `name` is required
- `owner` is required

3. **Check JSON syntax:**
Use [JSON Validator](https://jsonlint.com/) to verify format

---

## Data Issues

### Issue: Data disappears after restart

**Symptoms:**
- Create repositories and issues
- Stop server with Ctrl+C
- Run `npm start` again
- Data is gone

**Explanation:**
This is normal! Data is stored in memory (RAM).

**Solutions:**

1. **Understand this is by design:**
This is a demo with in-memory storage

2. **To keep data permanent, use a database:**
See [ARCHITECTURE.md](ARCHITECTURE.md#database-migration) for database setup

3. **For testing, recreate data or create a seed file**

---

### Issue: "TypeError: Cannot read property of undefined"

**Symptoms:**
```
TypeError: Cannot read property 'name' of undefined
```

**Causes:**
- Repository ID doesn't exist
- API returned null or undefined
- Frontend accessed wrong property

**Solutions:**

1. **Check repository ID:**
Make sure repository with that ID exists

2. **Verify API response structure:**
Open Network tab in DevTools and check JSON response

3. **Add error handling in frontend:**
```javascript
if (repo && repo.name) {
  console.log(repo.name);
} else {
  console.error('Repository not found');
}
```

---

## Performance Issues

### Issue: Page is slow

**Causes:**
- Server not running
- Network tab shows slow requests
- Large number of repositories

**Solutions:**

1. **Check server is running:**
Should respond quickly locally

2. **Check Network tab:**
- Look for requests taking > 1 second
- Look for failed requests (red)

3. **Restart server:**
Sometimes helps with memory issues

4. **Clear browser cache:**
Ctrl+Shift+Delete

---

### Issue: Search is laggy

**Solutions:**

1. **The search debounces at 300ms:**
This is normal - waits for user to stop typing

2. **For many repositories:**
Add pagination (see [ARCHITECTURE.md](ARCHITECTURE.md#future-improvements))

---

## Development Issues

### Issue: Changes to HTML/CSS/JS not appearing

**Symptoms:**
- Edit `public/styles.css`
- Refresh browser
- Changes don't appear

**Solutions:**

1. **Hard refresh browser:**
- Chrome: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Firefox: Ctrl+F5 (Cmd+Shift+R on Mac)

2. **Clear browser cache:**
- Chrome: Settings → Privacy → Clear browsing data
- Select "All time" and "Cached images and files"

3. **Open DevTools and disable cache:**
- F12 to open DevTools
- Right-click reload button and select "Empty cache and hard reload"

### Issue: Server changes don't take effect

**Symptoms:**
- Edit `server.js`
- Restart with npm start
- Changes don't appear

**Solutions:**

1. **Make sure to save file before restarting**

2. **Stop and start server:**
```bash
# Ctrl+C to stop
# npm start to restart
```

3. **Use nodemon for auto-restart (optional):**
```bash
npm install --save-dev nodemon
npx nodemon server.js
```

---

## Git Issues

### Issue: Git push fails

**Solutions:**

1. **Configure Git:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

2. **Check SSH keys:**
```bash
ssh -T git@github.com  # For SSH
```

3. **Use HTTPS if SSH fails:**
```bash
git remote set-url origin https://github.com/Red-Shapes/Red-Shapes-Git.git
```

---

## System Issues

### Issue: npm install fails

**Solutions:**

1. **Update npm:**
```bash
npm install -g npm@latest
```

2. **Clear npm cache:**
```bash
npm cache clean --force
```

3. **Check Node.js version:**
```bash
node --version  # Should be v14+
```

4. **Use different registry (if corporate firewall):**
```bash
npm config set registry https://registry.npmjs.org/
npm install
```

---

### Issue: Node.js not found

**Symptoms:**
```
command not found: node
```

**Solutions:**

1. **Install Node.js:**
   - [Download from nodejs.org](https://nodejs.org/)
   - Or use package manager:
   ```bash
   # macOS
   brew install node
   
   # Ubuntu/Debian
   sudo apt install nodejs npm
   ```

2. **Add to PATH:**
```bash
# Verify installation
node --version
npm --version
```

---

## Still Having Issues?

### Debug Steps

1. **Check terminal output:**
Look for error messages and stack traces

2. **Open browser DevTools (F12):**
- Console tab: JavaScript errors
- Network tab: Failed requests
- Elements tab: DOM structure

3. **Check https://red-shapes-git.onrender.com/api/repositories:**
If this works, frontend can connect to backend

4. **Read the logs:**
Server prints useful info to console

### Get Help

1. **Check [README.md](README.md)** for overview
2. **Check [API.md](API.md)** for API details
3. **Check [QUICKSTART.md](QUICKSTART.md)** for setup
4. **Open an [issue](https://github.com/Red-Shapes/Red-Shapes-Git/issues)** with:
   - Error message (copy-paste full text)
   - Steps to reproduce
   - System info (OS, Node version, npm version)
   - Screenshot if visual issue

### Common Checklist

Before asking for help, verify:
- [ ] Node.js v14+ installed
- [ ] `npm install` completed without errors
- [ ] Server running (`npm start`)
- [ ] Browser at `https://red-shapes-git.onrender.com`
- [ ] No errors in browser console (F12)
- [ ] No errors in terminal where server runs

---

Last Updated: January 2024

Good luck! 🚀
