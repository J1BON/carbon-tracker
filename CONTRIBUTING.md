# Contributing to Carbon Tracker 🌱

Thank you for your interest in contributing! This document provides guidelines for contributing to the Carbon Tracker project.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful, kind, and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug is already reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, versions)

### Suggesting Features

1. Check if the feature is already requested
2. Create a new issue with:
   - Use case description
   - Benefits and impact
   - Mockups/wireframes if applicable
   - Alternatives considered

### Pull Requests

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** our coding standards:
   - TypeScript: Strict mode enabled
   - Python: Follow PEP 8, use Ruff
   - Use Prettier for formatting
   - Write meaningful commit messages
4. **Write/update** tests for your changes
5. **Update** documentation as needed
6. **Run** linting and tests locally
7. **Commit** your changes (`git commit -m 'feat: Add amazing feature'`)
8. **Push** to your branch (`git push origin feature/amazing-feature`)
9. **Open** a Pull Request

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependencies

### Examples

```bash
feat(carbon): Add monthly carbon calculation
fix(waste): Handle unknown waste types gracefully
docs(readme): Update installation instructions
refactor(api): Simplify carbon log queries
test(auth): Add login integration tests
```

## Coding Standards

### TypeScript (Frontend)

- Use strict mode
- Prefer functional components
- Use React hooks
- Type everything
- Use async/await over promises
- Follow ESLint rules

### Python (Backend & ML)

- Follow PEP 8
- Use type hints
- Docstrings for functions
- Ruff for linting
- Black for formatting
- Max line length: 100

### General

- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names
- Avoid magic numbers

## Testing

### Frontend

```bash
cd web
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run lint        # Linting
```

### Backend

```bash
cd api
pytest tests/       # Run tests
ruff check .        # Linting
black .             # Formatting
```

### ML Service

```bash
cd ml
pytest tests/       # Run tests
ruff check .        # Linting
black .             # Formatting
```

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing

### PR Title Format

```
<type>(<scope>): <brief description>
```

Example: `feat(dashboard): Add carbon footprint chart`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Linting passed
- [ ] No breaking changes
```

## Development Setup

See `QUICKSTART.md` for detailed setup instructions.

Quick version:

```bash
# Clone repository
git clone <your-fork-url>
cd carbon-footprint-tracker

# Install dependencies
npm install
cd api && pip install -r requirements.txt && cd ..
cd ml && pip install -r requirements.txt && cd ..
cd web && npm install && cd ..

# Start services
docker-compose up
```

## Project Structure

```
carbon-footprint-tracker/
├── api/              # FastAPI backend
├── ml/               # PyTorch ML service
├── web/              # React frontend
├── packages/         # Shared packages
│   └── shared-types/ # TypeScript types
└── docs/             # Documentation
```

## Getting Help

- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Questions**: Ask in Discussions or Issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for helping make the planet greener! 🌍💚

