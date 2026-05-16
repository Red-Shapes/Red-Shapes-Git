# Contributing to GitHub Clone

First off, thank you for considering contributing to GitHub Clone! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Provide a step-by-step description** of the exact steps which reproduce the problem
* **Provide specific examples** to demonstrate the steps
* **Describe the behavior you observed** after following the steps
* **Explain which behavior you expected** to see instead and why
* **Include screenshots and animated GIFs** if possible
* **Include your environment details** (OS, Node.js version, npm version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description** of the suggested enhancement
* **Provide specific examples** to demonstrate the steps
* **Describe the current behavior** and **the expected behavior**
* **Explain why this enhancement** would be useful

### Pull Requests

* Fill in the required template
* Follow the JavaScript/Node.js styleguides
* Include appropriate test cases
* End all files with a newline
* Document new code based on the Documentation Styleguide
* Avoid platform-dependent code

## Development Setup

1. **Fork the repository**
```bash
gh repo fork Red-Shapes/Red-Shapes-Git --clone
```

2. **Navigate to the directory**
```bash
cd Red-Shapes-Git
```

3. **Install dependencies**
```bash
npm install
```

4. **Create a new branch**
```bash
git checkout -b feature/your-feature-name
```

5. **Start the development server**
```bash
npm run dev
```

6. **Make your changes** and test thoroughly

7. **Commit your changes**
```bash
git commit -m "feat: add your feature"
```

8. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

9. **Open a Pull Request**

## Styleguides

### Git Commit Messages

* Use the present tense ("add feature" not "added feature")
* Use the imperative mood ("move cursor to..." not "moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
  - 🎨 `:art:` when improving the format/structure of the code
  - ⚡ `:zap:` when improving performance
  - 🔥 `:fire:` when removing code or files
  - 🐛 `:bug:` when fixing a bug
  - ✨ `:sparkles:` when adding a new feature
  - 📝 `:memo:` when writing docs
  - 🚀 `:rocket:` when deploying stuff
  - 🎉 `:tada:` when finishing a big feature
  - ✅ `:white_check_mark:` when adding tests
  - 🔒 `:lock:` when dealing with security

### JavaScript Styleguide

All JavaScript must adhere to [Google's JavaScript Style Guide](https://google.github.io.styleguide/jsguide.html):

* Use 2 spaces for indentation
* Use `const` and `let` instead of `var`
* Use arrow functions `() => {}` when appropriate
* Use template literals instead of string concatenation
* Add meaningful comments explaining why code exists
* Use descriptive variable names

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown)
* Reference functions as `functionName()`
* Reference classes as `ClassName`
* Reference modules as `moduleName`
* Use code blocks with language specification
* Keep lines to a reasonable length

## Testing

Before submitting a pull request, please run:

```bash
npm test
```

## Need Help?

* Join our community Discord server
* Check the documentation at `/docs`
* Open an issue with the `question` label
* Email us at `help@github-clone.dev`

## Recognition

Contributors will be recognized in:
* README.md file
* Release notes
* GitHub Contributors page

Thank you for contributing! 🎉
