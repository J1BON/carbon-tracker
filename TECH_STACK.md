# 🛠️ Technology Stack

Complete overview of all languages, frameworks, libraries, and tools used in the Carbon Tracker project.

## 📋 Table of Contents

- [Programming Languages](#programming-languages)
- [Frontend Technologies](#frontend-technologies)
- [Backend Technologies](#backend-technologies)
- [Machine Learning Technologies](#machine-learning-technologies)
- [DevOps & Infrastructure](#devops--infrastructure)
- [Development Tools](#development-tools)
- [Project Architecture](#project-architecture)
- [External Services](#external-services)

---

## Programming Languages

| Language | Version | Usage |
|----------|---------|-------|
| **TypeScript** | 5.3.0 | Frontend application, shared types package |
| **Python** | 3.11 | Backend API and ML service |
| **SQL** | - | Database queries (via SQLAlchemy ORM) |
| **JavaScript** | ES6+ | Build tooling and configuration files |
| **CSS** | - | Styling (via Tailwind CSS) |
| **HTML** | 5 | Frontend markup structure |

---

## Frontend Technologies

### Core Framework
- **React** `18.2.0` - UI library for building user interfaces
- **TypeScript** `5.3.0` - Type-safe JavaScript
- **Vite** `5.0.10` - Next-generation frontend build tool and dev server

### Styling & UI
- **Tailwind CSS** `3.4.0` - Utility-first CSS framework
- **Tailwind CSS Animate** `1.0.7` - Animation utilities
- **PostCSS** `8.4.32` - CSS processing
- **Autoprefixer** `10.4.16` - CSS vendor prefixing
- **Framer Motion** `12.23.24` - Production-ready motion library for React

### Routing & Navigation
- **React Router DOM** `6.21.0` - Declarative routing for React

### State Management
- **Zustand** `4.4.7` - Lightweight state management
- **TanStack React Query** `5.17.0` - Powerful data synchronization for React
- **TanStack React Query Devtools** `5.17.0` - Developer tools for React Query

### HTTP & API
- **Axios** `1.6.5` - Promise-based HTTP client

### Data Visualization
- **Recharts** `2.10.0` - Composable charting library built on React components

### UI Components & Utilities
- **Lucide React** `0.344.0` - Beautiful & consistent icon toolkit
- **Zod** `3.22.0` - TypeScript-first schema validation
- **clsx** `2.1.0` - Utility for constructing className strings
- **tailwind-merge** `2.2.0` - Merge Tailwind CSS classes without style conflicts
- **class-variance-authority** `0.7.0` - Build type-safe component variants

### File Handling
- **React Dropzone** `14.2.3` - Simple React hook to create a HTML5-compatible drag'n'drop zone
- **html2canvas** `1.4.1` - Screenshots with JavaScript
- **jsPDF** `3.0.3` - Client-side PDF generation

### Utilities
- **date-fns** `3.0.0` - Modern JavaScript date utility library
- **canvas-confetti** `1.9.2` - Celebration animations

### Testing
- **Jest** `29.7.0` - JavaScript testing framework
- **Jest Environment JSDOM** `29.7.0` - DOM environment for Jest
- **@testing-library/react** `14.1.2` - Simple and complete React DOM testing utilities
- **@testing-library/jest-dom** `6.1.5` - Custom jest matchers for DOM
- **@testing-library/user-event** `14.5.1` - Fire events the same way the user does
- **@playwright/test** `1.41.0` - End-to-end testing framework

### Linting & Formatting
- **ESLint** `8.56.0` - Pluggable JavaScript linter
- **@typescript-eslint/parser** `6.18.0` - TypeScript parser for ESLint
- **@typescript-eslint/eslint-plugin** `6.18.0` - TypeScript-specific linting rules
- **eslint-plugin-react-hooks** `4.6.0` - ESLint rules for React Hooks
- **eslint-plugin-react-refresh** `0.4.5` - ESLint plugin for React Refresh
- **Prettier** `3.2.0` - Opinionated code formatter

---

## Backend Technologies

### Web Framework
- **FastAPI** `0.109.0` - Modern, fast web framework for building APIs with Python
- **Uvicorn** `0.27.0` - Lightning-fast ASGI server implementation
- **Python Multipart** `0.0.6` - Streaming multipart parser for Python

### Database
- **PostgreSQL** `15-alpine` - Advanced open-source relational database
- **SQLAlchemy** `2.0.25` - SQL toolkit and Object-Relational Mapping (ORM) library
- **psycopg2-binary** `2.9.9` - PostgreSQL adapter for Python
- **Alembic** `1.13.1` - Database migration tool for SQLAlchemy

### Authentication & Security
- **python-jose[cryptography]** `3.3.0` - JWT implementation in Python
- **passlib[bcrypt]** `1.7.4` - Password hashing library
- **bcrypt** `4.0.1` - Password hashing algorithm

### Data Validation
- **Pydantic** `2.5.3` - Data validation using Python type annotations
- **Pydantic Settings** `2.1.0` - Settings management using Pydantic
- **email-validator** `2.1.0` - Email address validation library

### Storage & Media
- **Boto3** `1.34.47` - AWS SDK for Python (S3-compatible storage)
- **Pillow** `10.2.0` - Python Imaging Library

### Caching & Sessions
- **Redis** `7-alpine` - In-memory data structure store
- **redis** `5.0.1` - Python client for Redis
- **aioredis** `2.0.1` - Async Redis client

### PDF Generation
- **ReportLab** `4.1.0` - PDF generation library
- **WeasyPrint** `60.2` - Visual rendering engine for HTML and CSS

### HTTP Client
- **httpx** `0.26.0` - Async HTTP client for Python

### Configuration
- **python-dotenv** `1.0.0` - Load environment variables from .env file

### Monitoring & Error Tracking
- **sentry-sdk[fastapi]** `2.6.0` - Error tracking and performance monitoring

### Testing
- **pytest** `7.4.4` - Testing framework
- **pytest-asyncio** `0.23.3` - Pytest support for asyncio
- **pytest-cov** `4.1.0` - Coverage plugin for pytest

### Code Quality
- **Ruff** `0.1.10` - Extremely fast Python linter
- **Black** `24.1.1` - Uncompromising Python code formatter
- **MyPy** `1.8.0` - Static type checker for Python

---

## Machine Learning Technologies

### Deep Learning Framework
- **PyTorch** `2.1.2` - Open source machine learning framework
- **Torchvision** `0.16.2` - Datasets, transforms, and models for computer vision

### Model Hub & Transformers
- **Transformers** `4.36.2` - State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX
- **Hugging Face** - Model hosting platform
- **Accelerate** `0.27.0` - Library for accelerating PyTorch training and inference
- **sentencepiece** `0.1.99` - Unsupervised text tokenizer

### Image Processing
- **OpenCV** `4.9.0.80` - Computer vision and image processing library
- **scikit-image** `0.22.0` - Image processing algorithms for SciPy
- **Pillow** `10.2.0` - Python Imaging Library

### Numerical Computing
- **NumPy** `1.26.3` - Fundamental package for scientific computing

### ML Service Framework
- **FastAPI** `0.109.0` - ML inference API service
- **Uvicorn** `0.27.0` - ASGI server for ML service

---

## DevOps & Infrastructure

### Containerization
- **Docker** - Container platform
- **Docker Compose** - Multi-container Docker application orchestration

### Web Server
- **Nginx** - High-performance web server (production deployment)

### Build System
- **Turbo** `2.0.0` - High-performance build system for JavaScript and TypeScript codebases

### Package Management
- **npm** `10.0.0` - Node.js package manager
- **Node.js** `>=18.0.0` - JavaScript runtime

### Project Structure
- **Monorepo** - Single repository containing multiple packages
- **npm Workspaces** - Package management for monorepos

---

## Development Tools

### Frontend Development
- **Vite** - Fast build tool and dev server
- **@vitejs/plugin-react** `4.2.1` - Official React plugin for Vite
- **TypeScript** - Type checking and IntelliSense

### Backend Development
- **Alembic** - Database migrations
- **Ruff** - Python linting
- **Black** - Python code formatting
- **MyPy** - Static type checking

### Code Quality
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Ruff** - Python linting
- **Black** - Python formatting

### Testing
- **Jest** - Unit testing
- **Playwright** - End-to-end testing
- **Testing Library** - Component testing utilities
- **pytest** - Python testing framework

---

## Project Architecture

### Architecture Pattern
- **Microservices Architecture** - Separate services for API and ML inference
- **RESTful API** - RESTful endpoints for backend communication
- **Monorepo** - Single repository with multiple packages

### Services
1. **Web Service** (`web/`) - React frontend application
2. **API Service** (`api/`) - FastAPI backend service
3. **ML Service** (`ml/`) - PyTorch inference service
4. **Shared Types** (`packages/shared-types/`) - TypeScript type definitions

### Authentication
- **JWT (JSON Web Tokens)** - Token-based authentication
- **Bcrypt** - Password hashing

### API Communication
- **CORS** - Cross-Origin Resource Sharing enabled
- **REST API** - RESTful endpoints
- **OpenAPI/Swagger** - API documentation (available at `/docs`)

### Database
- **PostgreSQL** - Primary relational database
- **SQLAlchemy ORM** - Object-Relational Mapping
- **Alembic Migrations** - Database schema versioning

### Caching
- **Redis** - In-memory caching and session storage

---

## External Services

### Cloud Storage
- **AWS S3** (or S3-compatible storage) - Object storage for images and media files

### Model Hosting
- **Hugging Face** - Pre-trained model hosting

### Error Monitoring
- **Sentry** - Error tracking and performance monitoring

---

## Version Requirements

### Runtime
- **Node.js** >= 18.0.0
- **npm** >= 10.0.0
- **Python** >= 3.11

### Development
- **Docker** Desktop (recommended)
- **Git** - Version control

---

## Project Structure

```
carbon-footprint-tracker/
├── api/                    # FastAPI backend service
│   ├── app/
│   │   ├── routers/        # API route handlers
│   │   ├── services/       # Business logic
│   │   └── models.py       # SQLAlchemy models
│   ├── alembic/            # Database migrations
│   └── requirements.txt    # Python dependencies
│
├── ml/                     # ML inference service
│   ├── app/
│   │   └── predictor.py    # Waste classification model
│   └── requirements.txt    # Python dependencies
│
├── web/                    # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── features/       # Feature modules
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities
│   └── package.json        # Node dependencies
│
├── packages/
│   └── shared-types/       # Shared TypeScript types
│
└── docker-compose.yml      # Container orchestration
```

---

## Summary

This is a **full-stack, production-ready application** featuring:

- ✅ **Modern Frontend**: React + TypeScript + Vite with Tailwind CSS
- ✅ **Robust Backend**: FastAPI with PostgreSQL and Redis
- ✅ **ML-Powered**: PyTorch-based waste classification service
- ✅ **Containerized**: Docker Compose for easy deployment
- ✅ **Type-Safe**: TypeScript throughout frontend and shared types
- ✅ **Well-Tested**: Comprehensive testing setup (Jest, Playwright, pytest)
- ✅ **Production-Ready**: Error monitoring, migrations, and best practices

The project follows modern development practices with a monorepo structure, microservices architecture, and comprehensive tooling for development, testing, and deployment.

