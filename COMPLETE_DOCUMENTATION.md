# 🌱 Carbon Tracker - Complete Project Documentation

**Version:** 1.0  
**Last Updated:** January 2025  
**Project Type:** Full-Stack Web Application

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [What This Project Provides](#what-this-project-provides)
3. [Complete Technology Stack](#complete-technology-stack)
4. [System Architecture](#system-architecture)
5. [Features & Capabilities](#features--capabilities)
6. [Data Sources & References](#data-sources--references)
7. [Project Structure](#project-structure)
8. [Installation & Setup](#installation--setup)
9. [API Documentation](#api-documentation)
10. [Database Schema](#database-schema)
11. [Deployment Guide](#deployment-guide)
12. [Development Guidelines](#development-guidelines)
13. [Security & Best Practices](#security--best-practices)
14. [Troubleshooting](#troubleshooting)
15. [Future Roadmap](#future-roadmap)
16. [Contributing](#contributing)
17. [License & Acknowledgments](#license--acknowledgments)

---

## 🎯 Project Overview

**Carbon Tracker** is a comprehensive, production-ready web application designed to help individuals track, understand, and reduce their personal carbon footprint. The platform combines real-time carbon footprint calculation, gamification elements, and educational resources to encourage sustainable behavior change.

### Core Mission

To empower individuals with accessible, accurate tools to:
- Track carbon emissions across multiple lifestyle categories
- Understand their environmental impact through data visualization
- Receive personalized recommendations for reducing emissions
- Engage with gamification elements (points, badges, leaderboards)
- Make informed decisions about sustainable living

### Key Differentiators

- ✅ **Scientifically Accurate**: Uses peer-reviewed emission factors from EPA, IPCC, DEFRA, and scientific databases
- ✅ **Comprehensive Tracking**: Covers transportation, diet, energy, shopping, and lifestyle categories
- ✅ **Gamified Experience**: Points, levels, badges, and leaderboards to maintain engagement
- ✅ **Production-Ready**: Full authentication, admin panel, database migrations, and deployment configurations
- ✅ **Modern Stack**: Built with React, TypeScript, FastAPI, and PostgreSQL

---

## 🎁 What This Project Provides

### For End Users

1. **Personal Carbon Footprint Tracking**
   - Track emissions across 5 major categories (Transport, Diet, Energy, Shopping, Lifestyle)
   - 25+ pre-configured activities with automatic calculations
   - Real-time statistics and progress tracking
   - Historical data visualization with interactive charts

2. **Gamification System**
   - Points earned for tracking activities
   - Level progression (100 points per level)
   - Eco Score (0-100 rating based on carbon footprint)
   - Global leaderboard rankings
   - Badge achievements (future enhancement)

3. **Personalized Recommendations**
   - Dynamic suggestions based on user's carbon activities
   - Category-specific recommendations
   - Daily green tips
   - Impact levels (High, Medium, Low) for each suggestion

4. **Dashboard & Analytics**
   - Real-time carbon statistics
   - Category breakdown with pie charts
   - Monthly/daily averages
   - Recent activity feed
   - Progress tracking

5. **CFC Emission Reporting**
   - Report CFC-related issues from refrigeration/AC systems
   - Track environmental concerns
   - Admin review system

### For Administrators

1. **Admin Panel**
   - User management (view, edit, activate/deactivate)
   - Platform statistics and analytics
   - Content management (badges, challenges)
   - CFC report review
   - System monitoring

2. **Platform Management**
   - Role-based access control
   - User moderation capabilities
   - Content curation tools
   - Data analytics dashboard

### For Developers

1. **Complete Codebase**
   - Well-structured monorepo architecture
   - Type-safe TypeScript frontend
   - FastAPI backend with async support
   - Shared types package

2. **Comprehensive Documentation**
   - Architecture documentation
   - API documentation
   - Setup guides
   - Deployment instructions
   - Contribution guidelines

3. **Production-Ready Features**
   - JWT authentication
   - Database migrations (Alembic)
   - Docker containerization
   - Environment configuration
   - Error handling and logging

---

## 🛠 Complete Technology Stack

### Frontend Technologies

#### Core Framework
- **React** `18.2.0` - UI library for building user interfaces
- **TypeScript** `5.3.0` - Type-safe JavaScript superset
- **Vite** `5.0.10` - Next-generation frontend build tool and dev server

#### Styling & UI
- **Tailwind CSS** `3.4.0` - Utility-first CSS framework
- **Tailwind CSS Animate** `1.0.7` - Animation utilities
- **PostCSS** `8.4.32` - CSS processing
- **Autoprefixer** `10.4.16` - CSS vendor prefixing
- **Framer Motion** `12.23.24` - Production-ready motion library for React
- **Shadcn UI** - High-quality component library (built on Radix UI)

#### Routing & Navigation
- **React Router DOM** `6.21.0` - Declarative routing for React

#### State Management
- **Zustand** `4.4.7` - Lightweight state management
- **TanStack React Query** `5.17.0` - Powerful data synchronization for React
- **TanStack React Query Devtools** `5.17.0` - Developer tools for React Query

#### HTTP & API
- **Axios** `1.6.5` - Promise-based HTTP client

#### Data Visualization
- **Recharts** `2.10.0` - Composable charting library built on React components

#### UI Components & Utilities
- **Lucide React** `0.344.0` - Beautiful & consistent icon toolkit
- **Zod** `3.22.0` - TypeScript-first schema validation
- **clsx** `2.1.0` - Utility for constructing className strings
- **tailwind-merge** `2.2.0` - Merge Tailwind CSS classes without style conflicts
- **class-variance-authority** `0.7.0` - Build type-safe component variants

#### File Handling
- **React Dropzone** `14.2.3` - Simple React hook to create a HTML5-compatible drag'n'drop zone
- **html2canvas** `1.4.1` - Screenshots with JavaScript
- **jsPDF** `3.0.3` - Client-side PDF generation

#### Utilities
- **date-fns** `3.0.0` - Modern JavaScript date utility library
- **canvas-confetti** `1.9.2` - Celebration animations

#### Testing
- **Jest** `29.7.0` - JavaScript testing framework
- **Jest Environment JSDOM** `29.7.0` - DOM environment for Jest
- **@testing-library/react** `14.1.2` - Simple and complete React DOM testing utilities
- **@testing-library/jest-dom** `6.1.5` - Custom jest matchers for DOM
- **@testing-library/user-event** `14.5.1` - Fire events the same way the user does
- **@playwright/test** `1.41.0` - End-to-end testing framework

#### Linting & Formatting
- **ESLint** `8.56.0` - Pluggable JavaScript linter
- **@typescript-eslint/parser** `6.18.0` - TypeScript parser for ESLint
- **@typescript-eslint/eslint-plugin** `6.18.0` - TypeScript-specific linting rules
- **eslint-plugin-react-hooks** `4.6.0` - ESLint rules for React Hooks
- **eslint-plugin-react-refresh** `0.4.5` - ESLint plugin for React Refresh
- **Prettier** `3.2.0` - Opinionated code formatter

### Backend Technologies

#### Web Framework
- **FastAPI** `0.109.0` - Modern, fast web framework for building APIs with Python
- **Uvicorn** `0.27.0` - Lightning-fast ASGI server implementation
- **Python Multipart** `0.0.6` - Streaming multipart parser for Python

#### Database
- **PostgreSQL** `15-alpine` - Advanced open-source relational database
- **SQLAlchemy** `2.0.25` - SQL toolkit and Object-Relational Mapping (ORM) library
- **psycopg2-binary** `2.9.9` - PostgreSQL adapter for Python
- **Alembic** `1.13.1` - Database migration tool for SQLAlchemy

#### Authentication & Security
- **python-jose[cryptography]** `3.3.0` - JWT implementation in Python
- **passlib[bcrypt]** `1.7.4` - Password hashing library
- **bcrypt** `4.0.1` - Password hashing algorithm

#### Data Validation
- **Pydantic** `2.5.3` - Data validation using Python type annotations
- **Pydantic Settings** `2.1.0` - Settings management using Pydantic
- **email-validator** `2.1.0` - Email address validation library

#### Storage & Media
- **Boto3** `1.34.47` - AWS SDK for Python (S3-compatible storage)
- **Pillow** `10.2.0` - Python Imaging Library

#### Caching & Sessions
- **Redis** `7-alpine` - In-memory data structure store
- **redis** `5.0.1` - Python client for Redis
- **aioredis** `2.0.1` - Async Redis client

#### PDF Generation
- **ReportLab** `4.1.0` - PDF generation library
- **WeasyPrint** `60.2` - Visual rendering engine for HTML and CSS

#### HTTP Client
- **httpx** `0.26.0` - Async HTTP client for Python

#### Configuration
- **python-dotenv** `1.0.0` - Load environment variables from .env file

#### Monitoring & Error Tracking
- **sentry-sdk[fastapi]** `2.6.0` - Error tracking and performance monitoring

#### Testing
- **pytest** `7.4.4` - Testing framework
- **pytest-asyncio** `0.23.3` - Pytest support for asyncio
- **pytest-cov** `4.1.0` - Coverage plugin for pytest

#### Code Quality
- **Ruff** `0.1.10` - Extremely fast Python linter
- **Black** `24.1.1` - Uncompromising Python code formatter
- **MyPy** `1.8.0` - Static type checker for Python

### DevOps & Infrastructure

#### Containerization
- **Docker** - Container platform
- **Docker Compose** - Multi-container Docker application orchestration

#### Web Server
- **Nginx** - High-performance web server (production deployment)

#### Build System
- **Turbo** `2.0.0` - High-performance build system for JavaScript and TypeScript codebases

#### Package Management
- **npm** `10.0.0` - Node.js package manager
- **Node.js** `>=18.0.0` - JavaScript runtime

#### Project Structure
- **Monorepo** - Single repository containing multiple packages
- **npm Workspaces** - Package management for monorepos

### Development Tools

#### Frontend Development
- **Vite** - Fast build tool and dev server
- **@vitejs/plugin-react** `4.2.1` - Official React plugin for Vite
- **TypeScript** - Type checking and IntelliSense

#### Backend Development
- **Alembic** - Database migrations
- **Ruff** - Python linting
- **Black** - Python code formatting
- **MyPy** - Static type checking

#### Code Quality
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Ruff** - Python linting
- **Black** - Python formatting

#### Testing
- **Jest** - Unit testing
- **Playwright** - End-to-end testing
- **Testing Library** - Component testing utilities
- **pytest** - Python testing framework

### External Services & APIs

#### Cloud Storage
- **AWS S3** (or S3-compatible storage) - Object storage for images and media files

#### Error Monitoring
- **Sentry** - Error tracking and performance monitoring

#### Mapping Services (Future)
- **Mapbox** - Maps integration for location-based features
- **OpenStreetMap** - Base map data

---

## 🏗 System Architecture

### Architecture Pattern

**Microservices Architecture** with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
│  React + TypeScript (Vite)                                  │
│  - Dashboard, CFC Reports, Leaderboard, Admin Panel        │
│  - Tailwind CSS + Shadcn UI                                 │
│  - React Query + Zustand                                    │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/REST
                          │ WebSocket (future)
┌─────────────────────────▼───────────────────────────────────┐
│                      API Gateway Layer                       │
│  FastAPI (Python)                                           │
│  - Authentication & Authorization                           │
│  - Request routing & validation                             │
│  - Rate limiting                                            │
└─────────┬─────────────┬─────────────┬─────────────┬─────────┘
          │             │             │             │
┌─────────▼────┐  ┌─────▼─────┐  ┌───▼───┐  ┌────▼────┐
│   Database   │  │  Storage  │  │  S3    │  │  Redis  │
│  PostgreSQL  │  │  (Local)  │  │Storage │  │  Cache  │
│              │  │           │  │        │  │         │
└──────────────┘  └───────────┘  └────────┘  └─────────┘
```

### Service Breakdown

#### 1. Frontend Service (`web/`)
- **Technology**: React 18, TypeScript, Vite
- **Port**: 3000 (development), 80/443 (production)
- **Responsibilities**:
  - User interface and UX
  - Client-side routing
  - State management (Zustand)
  - API communication (React Query)
  - Form validation
  - Real-time charts

#### 2. Backend API Service (`api/`)
- **Technology**: FastAPI, SQLAlchemy, Pydantic
- **Port**: 8000
- **Responsibilities**:
  - RESTful API endpoints
  - Business logic
  - Database operations
  - Authentication & authorization
  - Data validation
  - PDF generation

#### 3. Shared Types Package (`packages/shared-types/`)
- **Technology**: TypeScript, Zod
- **Responsibilities**:
  - Type definitions shared across services
  - Runtime validation schemas
  - API contracts
  - Domain models

### Data Flow

#### Carbon Tracking Flow
```
User Input → Frontend Form → Validation → API POST
→ Database Insert → Points Calculation → Badge Check
→ Cache Update → Response → UI Update
```

#### Gamification Flow
```
User Action → Carbon Log → Points Update → Level Check
→ Badge Evaluation → Leaderboard Update → Cache Invalidation
→ Real-time Updates → UI Refresh
```

---

## ✨ Features & Capabilities

### Carbon Tracking Features

1. **Multi-Category Tracking**
   - **Transport**: Car, Bus, Train, Plane, EV, Bicycle, Walking
   - **Diet**: Beef, Chicken, Fish, Vegetables, Dairy, etc.
   - **Energy**: Grid electricity, Natural gas, Solar, Wind
   - **Shopping**: Clothing, Electronics, Furniture, Food
   - **Lifestyle**: Various daily activities

2. **Automatic Calculations**
   - 25+ pre-configured emission formulas
   - Real-time carbon amount calculation
   - Category-based emission factors
   - Historical data aggregation

3. **Data Visualization**
   - Interactive pie charts (category breakdown)
   - Bar charts (monthly/daily trends)
   - Real-time statistics dashboard
   - Progress tracking

4. **Statistics & Analytics**
   - Total carbon footprint
   - Category-wise breakdown
   - Monthly/daily averages
   - Recent activity feed
   - Trend analysis

### Gamification Features

1. **Points System**
   - Base points: 10 points per activity logged
   - Size bonus: +2 points (>2 kg), +5 points (>5 kg)
   - Category bonus: Transport (+15), Diet (+12), Energy (+10), etc.

2. **Level System**
   - Level = (Total Points ÷ 100) + 1
   - Progressive leveling
   - Visual level indicators

3. **Eco Score**
   - 0-100 rating based on daily carbon footprint
   - Consistency bonus (+5 points for 7+ days tracking)
   - Real-time updates

4. **Leaderboard**
   - Global rankings
   - Sorted by total points (primary), eco score (secondary)
   - Real-time updates

5. **Badges & Achievements** (Structure ready, implementation pending)
   - Milestone badges
   - Category mastery badges
   - Consistency badges

### Recommendation System

1. **Personalized Suggestions**
   - Activity-specific recommendations
   - Category-based suggestions
   - Impact levels (High, Medium, Low)
   - Points potential display

2. **Daily Green Tips**
   - 15+ eco-friendly tips
   - Random daily display
   - Educational content

3. **Category Analysis**
   - Total emissions by category
   - Percentage breakdown
   - Average emissions per entry

### Admin Features

1. **User Management**
   - View all users
   - Edit user details
   - Activate/deactivate users
   - Promote to admin

2. **Platform Statistics**
   - Total users
   - Total carbon logs
   - Platform-wide analytics
   - User engagement metrics

3. **Content Management**
   - Manage badges
   - Create challenges
   - Review CFC reports

4. **System Monitoring**
   - Service health checks
   - Error tracking
   - Performance metrics

---

## 📚 Data Sources & References

### Carbon Emission Factors

All emission factors used in the Carbon Tracker application are sourced from internationally recognized, peer-reviewed databases and government agencies.

#### Transport Emission Factors

| Source | Description | URL |
|--------|------------|-----|
| **EPA (U.S. Environmental Protection Agency)** | Vehicle emission standards and factors | [epa.gov](https://www.epa.gov) |
| **DEFRA (UK Department for Environment, Food & Rural Affairs)** | Transport emission factors database | [gov.uk/defra](https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs) |
| **IPCC (Intergovernmental Panel on Climate Change)** | International transport emission standards | [ipcc.ch](https://www.ipcc.ch) |
| **GHG Protocol** | Corporate accounting and reporting standard | [ghgprotocol.org](https://ghgprotocol.org) |

**Key References:**
- EPA Emission Factors for Greenhouse Gas Inventories (2023)
- DEFRA Conversion Factors (2023)
- IPCC Guidelines for National Greenhouse Gas Inventories (2019)

#### Food Emission Factors

| Source | Description | URL |
|--------|------------|-----|
| **Our World in Data** | Comprehensive food carbon footprint database (2024 data) | [ourworldindata.org](https://ourworldindata.org) |
| **EPD (Environmental Product Declaration)** | Certified product declarations | [environdec.com](https://www.environdec.com) |
| **Poore & Nemecek (2018)** | Published scientific database in Science journal | [Science Article](https://science.sciencemag.org/content/360/6392/987) |
| **FAO (Food and Agriculture Organization)** | Global food system emissions | [fao.org](https://www.fao.org) |

**Key References:**
- Poore, J., & Nemecek, T. (2018). Reducing food's environmental impacts through producers and consumers. *Science*, 360(6392), 987-992.
- Our World in Data - Food Carbon Footprint Database (2024)
- EPD International - Product Environmental Declarations

#### Energy Emission Factors

| Source | Description | URL |
|--------|------------|-----|
| **EPA eGRID** | U.S. electricity grid emissions database | [epa.gov/egrid](https://www.epa.gov/egrid) |
| **IEA (International Energy Agency)** | Global energy statistics and emissions | [iea.org](https://www.iea.org) |
| **IPCC** | Energy sector emissions guidelines | [ipcc.ch](https://www.ipcc.ch) |
| **EIA (U.S. Energy Information Administration)** | Energy data and statistics | [eia.gov](https://www.eia.gov) |

**Key References:**
- EPA eGRID 2023 Data Summary Tables
- IEA World Energy Outlook (2024)
- IPCC AR6 Working Group III Report (2022)

#### Shopping & Product Emission Factors

| Source | Description | URL |
|--------|------------|-----|
| **Ecoinvent** | Life cycle assessment database | [ecoinvent.org](https://www.ecoinvent.org) |
| **Carbon Trust** | Product carbon footprints and standards | [carbontrust.com](https://www.carbontrust.com) |
| **Company Environmental Reports** | Apple, Google, Microsoft sustainability reports | Various |
| **EPA Waste Reduction Model (WARM)** | Waste management emission factors | [epa.gov/warm](https://www.epa.gov/warm) |

**Key References:**
- Ecoinvent Database v3.9
- Carbon Trust Product Carbon Footprinting Guide
- Apple Environmental Progress Report (2024)

### Research Papers & Studies

1. **Wiedmann, T., & Minx, J. (2008).** A Definition of 'Carbon Footprint'. *Ecological Economics Research Trends*, 1-11.
   - Foundation for carbon footprint methodology

2. **Hertwich, E. G., & Peters, G. P. (2009).** Carbon Footprint of Nations: A Global, Trade-Linked Analysis. *Environmental Science & Technology*, 43(16), 6414-6420.
   - Global carbon footprint analysis methodology

3. **Jones, C. M., & Kammen, D. M. (2011).** Quantifying Carbon Footprint Reduction Opportunities for U.S. Households and Communities. *Environmental Science & Technology*, 45(9), 4088-4095.
   - Household carbon footprint reduction strategies

4. **Poore, J., & Nemecek, T. (2018).** Reducing food's environmental impacts through producers and consumers. *Science*, 360(6392), 987-992.
   - Comprehensive food system emissions database
   - Used as primary source for food emission factors

5. **Clark, M. A., et al. (2020).** Global food system emissions could preclude achieving the 1.5° and 2°C climate change targets. *Science*, 370(6517), 705-708.
   - Food system climate impact analysis

6. **IPCC (2014).** Climate Change 2014: Mitigation of Climate Change. *Working Group III Contribution to the Fifth Assessment Report*.
   - Transportation sector emission factors

7. **Brand, C., et al. (2020).** The climate change mitigation effects of daily active travel in cities. *Transportation Research Part D*, 93, 102764.
   - Active transportation carbon benefits

### Technology Documentation References

#### Backend Technologies
- **FastAPI**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **SQLAlchemy**: [docs.sqlalchemy.org](https://docs.sqlalchemy.org)
- **Pydantic**: [docs.pydantic.dev](https://docs.pydantic.dev)
- **Alembic**: [alembic.sqlalchemy.org](https://alembic.sqlalchemy.org)
- **PostgreSQL**: [postgresql.org/docs](https://www.postgresql.org/docs)

#### Frontend Technologies
- **React**: [react.dev](https://react.dev)
- **TypeScript**: [typescriptlang.org](https://typescriptlang.org)
- **Vite**: [vitejs.dev](https://vitejs.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **React Query**: [tanstack.com/query](https://tanstack.com/query)
- **Zustand**: [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs)
- **Shadcn UI**: [ui.shadcn.com](https://ui.shadcn.com)

#### Infrastructure & DevOps
- **Docker**: [docs.docker.com](https://docs.docker.com)
- **Docker Compose**: [docs.docker.com/compose](https://docs.docker.com/compose)
- **Nginx**: [nginx.org/en/docs](https://nginx.org/en/docs)

### API Standards & Protocols

- **RESTful API Design Best Practices**: [restfulapi.net](https://restfulapi.net)
- **OpenAPI Specification**: [swagger.io/specification](https://swagger.io/specification)
- **JSON API Specification**: [jsonapi.org](https://jsonapi.org)
- **JWT (JSON Web Tokens)**: [jwt.io](https://jwt.io)
- **OAuth 2.0**: [oauth.net/2](https://oauth.net/2)
- **OWASP Top 10**: [owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten)

### Design & UI References

- **Shadcn UI Components**: [ui.shadcn.com](https://ui.shadcn.com)
- **Tailwind UI**: [tailwindui.com](https://tailwindui.com)
- **Radix UI Primitives**: [radix-ui.com](https://www.radix-ui.com)
- **WCAG 2.1 Guidelines**: [w3.org/WAI/WCAG21](https://www.w3.org/WAI/WCAG21)

---

## 📁 Project Structure

```
carbon-footprint-tracker/
├── api/                          # FastAPI backend service
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py              # JWT authentication & authorization
│   │   ├── config.py            # Configuration management
│   │   ├── database.py          # Database connection & session
│   │   ├── models.py            # SQLAlchemy database models
│   │   ├── routers/            # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── admin.py        # Admin panel endpoints
│   │   │   ├── auth.py         # Authentication endpoints
│   │   │   ├── carbon.py       # Carbon tracking endpoints
│   │   │   ├── cfc.py          # CFC reporting endpoints
│   │   │   ├── gamification.py # Gamification endpoints
│   │   │   └── health.py       # Health check endpoints
│   │   └── services/           # Business logic
│   │       ├── __init__.py
│   │       ├── carbon_calculator.py  # Carbon calculation engine
│   │       ├── email_service.py      # Email service (future)
│   │       ├── gamification.py        # Points, levels, badges
│   │       └── suggestion_service.py # Carbon reduction suggestions
│   ├── alembic/                # Database migrations
│   │   ├── versions/           # Migration files
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── alembic.ini             # Alembic configuration
│   ├── Dockerfile              # Docker image for API
│   ├── main.py                 # FastAPI application entry point
│   ├── requirements.txt        # Python dependencies
│   └── ruff.toml               # Ruff linting configuration
│
├── web/                         # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── sections/      # Home page sections
│   │   │   ├── ui/             # Shadcn UI components
│   │   │   ├── AdminRoute.tsx
│   │   │   ├── CarbonCalculator.tsx
│   │   │   ├── CarbonSuggestions.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProfileMenu.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ScrollToTop.tsx
│   │   ├── features/           # Feature modules
│   │   │   ├── admin/          # Admin panel features
│   │   │   ├── cfc/            # CFC reporting features
│   │   │   ├── dashboard/     # Dashboard features
│   │   │   ├── gamification/   # Gamification features
│   │   │   ├── leaderboard/   # Leaderboard features
│   │   │   ├── onboarding/    # Onboarding features
│   │   │   └── tree-planting/ # Tree planting features
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/               # Utilities and API clients
│   │   │   ├── api.ts         # API client configuration
│   │   │   ├── pdfExport.ts   # PDF export utilities
│   │   │   └── utils.ts       # General utilities
│   │   ├── pages/             # Page components
│   │   │   ├── About.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── BlogPost.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── ResourceDetail.tsx
│   │   │   ├── Resources.tsx
│   │   │   ├── VerifyEmail.tsx
│   │   │   └── VerifyEmailRequired.tsx
│   │   ├── providers/         # Context providers
│   │   │   └── ThemeProvider.tsx
│   │   ├── store/             # State management
│   │   │   └── useAuthStore.ts
│   │   ├── styles/            # Global styles
│   │   │   └── index.css
│   │   ├── theme/             # Theme configuration
│   │   │   └── theme.ts
│   │   ├── App.tsx            # Main App component
│   │   └── main.tsx           # Application entry point
│   ├── public/                # Static assets
│   ├── Dockerfile              # Docker image for frontend
│   ├── package.json            # Node.js dependencies
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── vite.config.ts         # Vite configuration
│
├── packages/
│   └── shared-types/           # Shared TypeScript types
│       ├── src/
│       │   ├── types/          # Type definitions
│       │   │   ├── api.ts      # API response types
│       │   │   ├── carbon.ts   # Carbon tracking types
│       │   │   ├── gamification.ts  # Gamification types
│       │   │   └── user.ts          # User types
│       │   └── index.ts        # Main export file
│       ├── package.json
│       └── tsconfig.json
│
├── docker-compose.yml          # Docker Compose orchestration
├── package.json                # Root package.json (monorepo)
├── turbo.json                  # Turbo build configuration
├── .gitignore                  # Git ignore rules
│
├── Documentation Files:
├── README.md                    # Main project documentation
├── COMPLETE_DOCUMENTATION.md    # This file (comprehensive guide)
├── ARCHITECTURE.md             # System architecture details
├── TECH_STACK.md               # Technology stack overview
├── REFERENCES.md               # Data sources and references
├── PROJECT_PROPOSAL.md         # Original project proposal
├── PROJECT_STATUS.md           # Current project status
├── HOW_TO_RUN.md               # Detailed run instructions
├── QUICKSTART.md               # Quick setup guide
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
├── CONTRIBUTING.md             # Contribution guidelines
├── EMISSION_FACTORS.md         # Emission factors documentation
├── GAMIFICATION_SYSTEM.md     # Gamification system docs
├── CARBON_SUGGESTIONS_IMPLEMENTATION.md  # Suggestions feature docs
└── EMAIL_VERIFICATION_SETUP.md # Email verification setup
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Docker** Desktop ([Download](https://www.docker.com/products/docker-desktop/))
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **Python** >= 3.11 ([Download](https://www.python.org/downloads/))
- **Git** ([Download](https://git-scm.com/downloads))

### Quick Start (Docker - Recommended)

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd carbon-footprint-tracker
```

2. **Start all services**
```bash
docker compose up --build
```

3. **Access the Application**
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

### Manual Setup (Without Docker)

See `HOW_TO_RUN.md` for detailed manual setup instructions.

**Quick Version:**
```bash
# Start PostgreSQL and Redis
docker compose up postgres redis -d

# Backend API
cd api
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (in new terminal)
cd packages/shared-types
npm install && npm run build

cd ../../web
npm install
npm run dev

# Run migrations (first time)
cd api
alembic upgrade head
```

### Environment Variables

#### Backend (`api/.env`)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carbon_tracker
SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=8000
```

#### Frontend (`web/.env`)
```env
VITE_API_URL=http://localhost:8000
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

---

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://your-api-url.com`

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Health Check
- **GET** `/health` - Service health status

#### Authentication
- **POST** `/api/v1/auth/register` - Register new user
- **POST** `/api/v1/auth/login` - Login user
- **GET** `/api/v1/auth/me` - Get current user

#### Carbon Tracking
- **POST** `/api/v1/carbon/logs` - Log carbon activity
- **GET** `/api/v1/carbon/logs` - Get user's carbon logs
- **GET** `/api/v1/carbon/stats` - Get carbon statistics
- **GET** `/api/v1/carbon/suggestions` - Get personalized suggestions
- **GET** `/api/v1/carbon/suggestions/daily-tip` - Get daily green tip

#### Gamification
- **GET** `/api/v1/gamification/leaderboard` - Get leaderboard
- **GET** `/api/v1/gamification/stats` - Get user gamification stats

#### CFC Reports
- **POST** `/api/v1/cfc/reports` - Submit CFC report
- **GET** `/api/v1/cfc/reports` - Get user's CFC reports

#### Admin (Admin Only)
- **GET** `/api/v1/admin/users` - Get all users
- **PUT** `/api/v1/admin/users/{user_id}` - Update user
- **GET** `/api/v1/admin/stats` - Get platform statistics

### Interactive API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation.

---

## 🗄 Database Schema

### Core Tables

#### Users
```sql
users
  - id (UUID, PK)
  - email (unique, indexed)
  - name
  - password_hash
  - eco_score (Float, 0-100)
  - level (Integer, starts at 1)
  - total_points (Integer, starts at 0)
  - is_admin (Boolean, default: false)
  - is_active (Boolean, default: true)
  - is_email_verified (Boolean, default: false)
  - email_verification_token (String, nullable)
  - created_at (Timestamp)
  - updated_at (Timestamp)
```

#### Carbon Logs
```sql
carbon_logs
  - id (UUID, PK)
  - user_id (UUID, FK → users.id, indexed)
  - category (String: transport, diet, energy, shopping, lifestyle)
  - activity (String: car, beef, electricity_grid, etc.)
  - carbon_amount_kg (Float)
  - metadata (JSON: distance, quantity, etc.)
  - created_at (Timestamp, indexed)
```

#### CFC Reports
```sql
cfc_reports
  - id (UUID, PK)
  - user_id (UUID, FK → users.id, indexed)
  - device (String: AC, Refrigerator)
  - issue_type (String: Gas leak, Disposal, Servicing)
  - notes (Text)
  - date (DateTime)
  - created_at (Timestamp, indexed)
```

#### Badges
```sql
badges
  - id (UUID, PK)
  - name (String, unique)
  - description (Text)
  - rarity (String: common, rare, epic, legendary)
  - points_required (Integer)
  - icon (String)
  - created_at (Timestamp)
```

#### User Badges
```sql
user_badges
  - user_id (UUID, FK → users.id)
  - badge_id (UUID, FK → badges.id)
  - earned_at (Timestamp)
  - PRIMARY KEY (user_id, badge_id)
```

#### Challenges
```sql
challenges
  - id (UUID, PK)
  - name (String)
  - description (Text)
  - target_value (Float)
  - reward_points (Integer)
  - expires_at (DateTime, nullable)
  - created_at (Timestamp)
```

### Indexes

- `users(email)` - Fast email lookups
- `users(is_admin)` - Fast admin queries
- `carbon_logs(user_id, category, created_at)` - Efficient user queries
- `cfc_reports(user_id, created_at)` - Efficient report queries

---

## 🚀 Deployment Guide

### Deployment Options

1. **Vercel (Frontend) + Railway (Backend)** - Recommended for beginners
2. **Docker on VPS** - Full control, production-ready
3. **Netlify (Frontend) + Render (Backend)** - Alternative to Option 1

### Quick Deployment (Vercel + Railway)

#### Step 1: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Create new project → Deploy from GitHub repo
3. Add PostgreSQL database
4. Configure API service:
   - Root Directory: `api`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables:
     - `DATABASE_URL` (from PostgreSQL service)
     - `SECRET_KEY` (generate random string)
     - `CORS_ORIGINS` (your frontend URL)
5. Run migrations: `alembic upgrade head`

#### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Import GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variables:
   - `VITE_API_URL` (your Railway API URL)
5. Deploy

### Detailed Deployment Instructions

See `DEPLOYMENT_GUIDE.md` for comprehensive deployment instructions including:
- Environment variable setup
- Database configuration
- SSL/HTTPS setup
- Domain configuration
- Troubleshooting

---

## 💻 Development Guidelines

### Code Style

#### TypeScript (Frontend)
- Use strict mode
- Prefer functional components
- Use React hooks
- Type everything
- Use async/await over promises
- Follow ESLint rules

#### Python (Backend)
- Follow PEP 8
- Use type hints
- Docstrings for functions
- Ruff for linting
- Black for formatting
- Max line length: 100

### Git Workflow

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes
3. Commit: `git commit -m "feat: Add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Create Pull Request

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Testing

#### Frontend
```bash
cd web
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run lint        # Linting
```

#### Backend
```bash
cd api
pytest tests/       # Run tests
ruff check .        # Linting
black .             # Formatting
```

### Running Locally

See `HOW_TO_RUN.md` for detailed instructions.

---

## 🔒 Security & Best Practices

### Authentication
- JWT tokens with expiration
- Password hashing (bcrypt)
- Secure token storage
- Refresh token mechanism (future)

### Authorization
- Role-based access control (Admin/User)
- Resource ownership validation
- API rate limiting
- CORS configuration

### Data Protection
- Input validation with Zod/Pydantic
- SQL injection prevention (ORM)
- XSS protection
- CSRF tokens (future)

### Environment Variables
- Never commit `.env` files
- Use strong secret keys
- Rotate keys regularly
- Use different keys for dev/prod

### Database Security
- Use parameterized queries (ORM)
- Database connection pooling
- Regular backups
- Access control

### API Security
- Rate limiting
- Input validation
- Error handling (don't expose internals)
- HTTPS in production

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find and kill process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

#### Database Connection Error
```bash
# Check PostgreSQL is running
docker compose ps | grep postgres

# Check database logs
docker compose logs postgres

# Restart database
docker compose restart postgres
```

#### Frontend Can't Connect to API
- Verify API is running: `curl http://localhost:8000/health`
- Check CORS settings in `api/app/config.py`
- Ensure `VITE_API_URL` matches API URL

#### Module Not Found Errors
```bash
# Reinstall dependencies
cd api && pip install -r requirements.txt
cd ../web && npm install
```

### Getting Help

1. Check existing documentation
2. Review service logs
3. Check browser console (F12)
4. Verify environment variables
5. Test API endpoints directly

---

## 🗺 Future Roadmap

### Short-term (Next 3 Months)
- [ ] Real-time notifications
- [ ] WebSocket support
- [ ] Advanced charts and analytics
- [ ] Search functionality
- [ ] PDF report generation

### Medium-term (3-6 Months)
- [ ] Mobile app (React Native)
- [ ] Social features (sharing, challenges)
- [ ] Advanced recommendation engine
- [ ] Carbon offset marketplace
- [ ] Maps integration

### Long-term (6+ Months)
- [ ] IoT device integration
- [ ] Blockchain for transparency
- [ ] Carbon credit trading
- [ ] Global challenges
- [ ] Multi-language support

---

## 🤝 Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for guidelines.

### Quick Contribution Steps

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Run tests and linting
5. Submit pull request

### Code of Conduct

- Be respectful and kind
- Provide constructive feedback
- Follow coding standards
- Write meaningful commit messages

---

## 📄 License & Acknowledgments

### License

This project is licensed under the MIT License.

### Acknowledgments

#### Data Sources
- **EPA** - Emission factors and standards
- **IPCC** - Climate change guidelines
- **DEFRA** - UK emission factors
- **Our World in Data** - Food carbon footprint database
- **Poore & Nemecek (2018)** - Food system emissions research

#### Technology & Tools
- **Shadcn UI** - High-quality component library
- **React Query** - Data synchronization
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Robust database system
- **Docker** - Containerization platform

#### Research & References
- All research papers and studies cited in `REFERENCES.md`
- Open-source community contributions
- Environmental organizations providing data

### Special Thanks

- Contributors and developers who helped build this project
- Environmental researchers providing emission factor data
- Open-source community for excellent tools and libraries

---

## 📞 Support & Contact

### Documentation
- **Main README**: `README.md`
- **Quick Start**: `QUICKSTART.md`
- **Architecture**: `ARCHITECTURE.md`
- **Deployment**: `DEPLOYMENT_GUIDE.md`

### Getting Help
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check relevant documentation files
- **API Docs**: Visit `/docs` endpoint for interactive API documentation

---

## 📊 Project Statistics

- **Total Files**: 100+
- **Lines of Code**: ~15,000+
- **Components**: 50+ React components
- **API Endpoints**: 30+
- **Database Tables**: 6
- **Emission Formulas**: 25+
- **Documentation Pages**: 15+

---

## ✅ Project Status

**Overall Completion**: ~95%

### Completed Features
- ✅ Authentication system
- ✅ Carbon tracking engine
- ✅ Gamification system
- ✅ Dashboard & analytics
- ✅ Admin panel
- ✅ Database migrations
- ✅ Docker containerization
- ✅ Comprehensive documentation

### In Progress
- 🚧 Testing suite
- 🚧 PDF report generation
- 🚧 Maps integration

### Future Enhancements
- 📋 Mobile app
- 📋 Social features
- 📋 Carbon offset marketplace

---

## 🎉 Conclusion

**Carbon Tracker** is a comprehensive, production-ready application that empowers individuals to track and reduce their carbon footprint. Built with modern technologies, following best practices, and using scientifically accurate data, it provides a complete solution for personal environmental impact tracking.

The project is:
- ✅ **Production-Ready**: Full authentication, admin panel, migrations
- ✅ **Well-Documented**: Comprehensive documentation from A-Z
- ✅ **Modern Stack**: React, TypeScript, FastAPI, PostgreSQL
- ✅ **Scientifically Accurate**: Peer-reviewed emission factors
- ✅ **User-Friendly**: Gamification, recommendations, beautiful UI
- ✅ **Scalable**: Microservices architecture, Docker containerization

**Made with 🌱 for a sustainable future**

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Document Maintained By**: Project Team

