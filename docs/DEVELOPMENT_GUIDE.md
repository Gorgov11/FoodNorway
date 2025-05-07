# FoodNorway Development Guide

## Development Environment Setup

### Prerequisites
- Node.js (v14.x or later)
- npm (v6.x or later) or yarn
- MongoDB (v4.x or later)
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FoodNorway
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   - Create a `.env` file in the backend directory
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/foodnorway
   API_RATE_LIMIT=100
   ```

5. **Start the development servers**
   - Backend:
   ```bash
   cd backend
   npm run dev
   ```
   - Frontend:
   ```bash
   cd frontend
   npm start
   ```

## Project Structure

```
FoodNorway/
├── backend/             # Server-side code
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── frontend/            # Client-side code
│   ├── public/          # Static files
│   ├── src/             # React source code
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   ├── App.js       # Main component
│   │   └── index.js     # Entry point
├── database/            # Database scripts and migrations
├── scrapers/            # Web scraping modules
│   ├── base/            # Base scraper class
│   ├── supermarkets/    # Supermarket-specific scrapers
│   └── index.js         # Scraper entry point
├── algorithms/          # Health rating algorithms
│   ├── nutritional/     # Nutritional analysis
│   ├── additives/       # Additives analysis
│   └── index.js         # Algorithm entry point
└── docs/                # Documentation
```

## Coding Standards

### General Guidelines
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages following conventional commits
- Document all functions, classes, and complex logic
- Write unit tests for all new features

### JavaScript/TypeScript
- Use ES6+ features
- Prefer const over let, avoid var
- Use async/await for asynchronous operations
- Use destructuring where appropriate
- Follow the principle of single responsibility

### React
- Use functional components with hooks
- Keep components small and focused
- Use prop-types or TypeScript for type checking
- Follow the container/presentational pattern
- Use context API or Redux for state management

## Git Workflow

1. **Branch naming convention**
   - Feature: `feature/short-description`
   - Bugfix: `bugfix/short-description`
   - Hotfix: `hotfix/short-description`
   - Release: `release/version-number`

2. **Commit message format**
   ```
   type(scope): short description
   
   Longer description if necessary
   ```
   Types: feat, fix, docs, style, refactor, test, chore

3. **Pull Request process**
   - Create a PR with a clear description
   - Link to related issues
   - Ensure all tests pass
   - Request review from at least one team member
   - Address review comments

## Testing Strategy

### Unit Testing
- Use Jest for backend and frontend unit tests
- Aim for high test coverage (>80%)
- Test all utility functions and business logic

### Integration Testing
- Test API endpoints with Supertest
- Test database operations
- Test scraper functionality with mock responses

### End-to-End Testing
- Use Cypress for frontend E2E tests
- Test critical user flows
- Test responsive design

## Deployment

### Staging Environment
- Automatic deployment from the `develop` branch
- Used for testing new features before production

### Production Environment
- Manual deployment from the `main` branch
- Requires approval from team lead

## Continuous Integration

- GitHub Actions for CI/CD
- Run tests on every pull request
- Build and deploy on merge to main branches
- Check code quality and test coverage

## Documentation

- Keep the README.md up to date
- Document all API endpoints
- Update technical specifications when architecture changes
- Document database schema changes

## Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Puppeteer Documentation](https://pptr.dev/)
- [Material-UI Documentation](https://mui.com/getting-started/usage/)