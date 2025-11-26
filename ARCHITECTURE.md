# 🏛 Architecture Overview

Carbon Tracker is built as a modern, scalable monorepo with a microservices architecture.

## System Architecture

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
│   Database   │  │    ML     │  │  S3    │  │  Redis  │
│  PostgreSQL  │  │  Service  │  │Storage │  │  Cache  │
│              │  │ PyTorch   │  │        │  │         │
└──────────────┘  └───────────┘  └────────┘  └─────────┘
```

## Service Breakdown

### 1. Frontend (web/)

**Technology**: React 18, TypeScript, Vite

**Responsibilities**:
- User interface and UX
- Client-side routing
- State management (Zustand)
- API communication (React Query)
- Form validation
- Real-time charts

**Key Features**:
- Progressive Web App ready
- Server-side rendering capable
- Code splitting
- Lazy loading

**Architecture Pattern**: Feature-based modules

```
src/
├── components/    # Reusable UI components
├── features/      # Feature modules
│   ├── dashboard/
│   ├── cfc/       # CFC emission reporting
│   ├── leaderboard/
│   ├── admin/     # Admin panel
│   └── onboarding/
├── hooks/         # Custom React hooks
├── lib/           # Utilities and API clients
├── store/         # State management
└── styles/        # Global styles
```

### 2. Backend API (api/)

**Technology**: FastAPI, SQLAlchemy, Pydantic

**Responsibilities**:
- RESTful API endpoints
- Business logic
- Database operations
- Authentication & authorization
- Data validation
- PDF generation

**Architecture Pattern**: Clean Architecture with routers

```
app/
├── config.py        # Settings management
├── database.py      # DB connection
├── models.py        # SQLAlchemy models
├── auth.py          # Authentication & authorization
├── routers/         # API endpoints
│   ├── health.py
│   ├── auth.py      # User authentication
│   ├── carbon.py    # Carbon tracking
│   ├── cfc.py       # CFC emission reports
│   ├── gamification.py
│   ├── recycling.py
│   └── admin.py     # Admin panel management
└── services/        # Business logic (future)
```

**Key Features**:
- Async/await for performance
- Automatic OpenAPI docs
- Zod-like validation with Pydantic
- Database connection pooling
- CORS configured
- Exception handling

### 3. ML Service (ml/)

**Technology**: PyTorch, FastAPI

**Responsibilities**:
- Waste image classification
- ML model inference
- Confidence scoring
- Alternative predictions

**Architecture Pattern**: Service-oriented

```
app/
├── config.py        # ML settings
├── predictor.py     # Prediction logic
└── models/          # Trained models
```

**Model Architecture**:
- **Model**: Heuristics-based classification
- **Input**: RGB images
- **Output**: 8 waste types + confidence scores
- **Classes**: plastic, paper, metal, glass, organic, electronic, textile, unknown
- **Method**: Image analysis using color, texture, brightness, and edge detection
- **Fallback**: Enhanced heuristics (75-80% accuracy) if model unavailable

### 4. Shared Types (packages/shared-types/)

**Technology**: TypeScript, Zod

**Responsibilities**:
- Type definitions shared across services
- Runtime validation schemas
- API contracts
- Domain models

**Structure**:
```
src/types/
├── user.ts          # User models
├── carbon.ts        # Carbon tracking
├── waste.ts         # Waste classification
├── gamification.ts  # Badges, leaderboard
├── recycling.ts     # Recycling points
└── api.ts           # API response types
```

## Data Flow

### Carbon Tracking Flow

```
User Input → Frontend Form → Validation → API POST
→ Database Insert → Points Calculation → Badge Check
→ Cache Update → Response → UI Update
```

### CFC Reporting Flow

```
User Report → Frontend Form → Validation → API POST
→ Database Insert → Admin Notification → Response → UI Confirmation
```

### Gamification Flow

```
User Action → Carbon/Waste Log → Points Update → Level Check
→ Badge Evaluation → Leaderboard Update → Cache Invalidation
→ Real-time Updates → UI Refresh
```

## Database Schema

### Core Tables

```sql
users
  - id (UUID, PK)
  - email (unique)
  - name
  - eco_score
  - level
  - total_points
  - is_admin (boolean)
  - is_active (boolean)

carbon_logs
  - id (UUID, PK)
  - user_id (FK)
  - category
  - activity
  - carbon_amount_kg
  - metadata (JSON)
  - created_at

cfc_reports
  - id (UUID, PK)
  - user_id (FK)
  - device (AC/Refrigerator)
  - issue_type (Gas leak/Disposal/Servicing)
  - notes (text)
  - date (datetime)
  - created_at

badges
  - id (UUID, PK)
  - name
  - description
  - rarity
  - points_required

user_badges
  - user_id (UUID, FK)
  - badge_id (UUID, FK)
  - earned_at

challenges
  - id (UUID, PK)
  - name
  - description
  - target_value
  - reward_points
  - expires_at

recycling_points
  - id (UUID, PK)
  - name
  - address
  - latitude
  - longitude
  - waste_types_accepted (JSON)
```

### Indexes

```sql
users(email)
users(is_admin)
users(is_active)
carbon_logs(user_id, category, created_at)
cfc_reports(user_id, created_at)
recycling_points(latitude, longitude)
```

## Security

### Authentication
- JWT tokens with expiration
- Password hashing (bcrypt)
- Refresh token mechanism (future)
- Social login (future)

### Authorization
- Role-based access control (Admin/User)
- Admin panel with full platform management
- Resource ownership validation
- API rate limiting
- CORS configured
- Admin-only endpoints protection

### Data Protection
- Input validation with Zod/Pydantic
- SQL injection prevention (ORM)
- XSS protection
- CSRF tokens (future)

## Performance

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- React Query caching
- Service worker (PWA)

### Backend
- Database connection pooling
- Query optimization
- Indexed queries
- Async operations
- Background tasks

### Caching Strategy
- Redis for:
  - User sessions
  - Leaderboard
  - Carbon stats
  - Badge calculations
- CDN for:
  - Static assets
  - Images

## Scalability

### Horizontal Scaling
- Stateless API servers
- Load balancer ready
- Database read replicas
- Redis cluster
- S3 for storage

### Vertical Scaling
- Optimized queries
- Efficient algorithms
- Caching layers
- Database tuning

## Monitoring & Observability

### Logging
- Structured logging (future)
- Error tracking (Sentry)
- Audit logs
- Access logs

### Metrics
- Response times
- Error rates
- Database queries
- ML inference times
- User engagement

### Health Checks
- `/health` - Service status
- `/ready` - Readiness checks
- Database connectivity
- ML service availability

## Deployment

### Docker Compose (Development)
```yaml
Services:
  - postgres (database)
  - redis (cache)
  - api (backend)
  - ml-service (inference)
  - web (frontend)
```

### Production (Future)
- Kubernetes orchestration
- CI/CD with GitHub Actions
- Blue-green deployments
- Rolling updates
- Auto-scaling

## Technology Decisions

### Frontend
- **React**: Most popular, rich ecosystem
- **Vite**: Fast HMR, modern build tool
- **TypeScript**: Type safety, better DX
- **Tailwind**: Utility-first, rapid UI
- **Shadcn**: High-quality components
- **React Query**: Server state management
- **Zustand**: Simple global state

### Backend
- **FastAPI**: Modern, fast, async
- **SQLAlchemy**: Best Python ORM
- **PostgreSQL**: Robust, feature-rich
- **Pydantic**: Validation + serialization
- **Redis**: Fast caching

### ML
- **Heuristics-based**: Image analysis using color, texture, brightness, and edge detection
- **FastAPI**: Same stack as backend
- **Method**: Enhanced heuristics (75-80% accuracy) for waste classification

### Infrastructure
- **Docker**: Containerization
- **Compose**: Local development
- **S3**: Scalable storage
- **Mapbox**: Maps integration

## Future Enhancements

### Short-term
- [ ] Real-time notifications
- [ ] WebSocket support
- [ ] Advanced charts
- [ ] Search functionality

### Medium-term
- [ ] Mobile app (React Native)
- [ ] Social features
- [ ] Advanced AI recommendations
- [ ] Carbon offset marketplace

### Long-term
- [ ] IoT device integration
- [ ] Blockchain for transparency
- [ ] Carbon credit trading
- [ ] Global challenges

## References

For detailed data sources, emission factors, and research references, see [REFERENCES.md](./REFERENCES.md).

### Quick Links
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)
- [Docker Docs](https://docs.docker.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

