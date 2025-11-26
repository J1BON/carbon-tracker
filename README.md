# 🌱 Carbon Tracker

**Personal Carbon Footprint Tracker + Smart Waste Recognition & Recycling System**

A production-ready web application that helps users track their carbon footprint, identify recyclable waste through ML-powered image recognition, and provides gamified incentives to adopt eco-friendly habits.

## 🎯 Features

### Carbon Tracking
- ✅ Track carbon footprint across multiple categories (travel, diet, energy, shopping)
- ✅ Automatic calculation with real emission factors
- ✅ Real-time progress charts and statistics
- ✅ Category-based breakdown with visualizations
- ✅ Monthly/daily averages

### Smart Waste Recognition
- ✅ ML-powered image classification (8 waste types)
- ✅ Recycling suggestions and tips
- ✅ Confidence-based predictions with human feedback loop
- ✅ Drag-and-drop image upload

### Gamification
- ✅ Points & leveling system
- ✅ Badges and achievements
- ✅ Global leaderboard
- ✅ Confetti celebrations

### Modern UI/UX
- ✅ Clean, minimal, colorful eco-friendly design
- ✅ Responsive layout
- ✅ Accessible color contrast
- ✅ Interactive charts (Pie, Bar)

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Vite) + TypeScript, Tailwind CSS, Shadcn UI, React Query, Zustand |
| **Backend** | FastAPI (Python), SQLAlchemy, PostgreSQL |
| **ML** | PyTorch, Heuristics-based classification |
| **Storage** | S3-compatible storage for images |
| **Auth** | JWT-based authentication |
| **Deployment** | Docker Compose |

## 🚀 Quick Start

### Prerequisites
- **Docker** Desktop ([Download](https://www.docker.com/products/docker-desktop/))
- **Node.js** >= 18.0.0
- **Python** >= 3.11

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd carbon-footprint-tracker
```

2. **Start with Docker Compose**
```bash
docker compose up --build
```

3. **Access the Application**
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **ML Health**: http://localhost:8001/health

### Manual Setup (Without Docker)

See `HOW_TO_RUN.md` for detailed manual setup instructions.

**Quick Version:**
```bash
# Start PostgreSQL
docker compose up postgres redis -d

# Backend API
cd api
pip install -r requirements.txt
uvicorn main:app --reload

# ML Service (in new terminal)
cd ml
pip install -r requirements.txt
uvicorn main:app --reload --port 8001

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

## 📁 Project Structure

```
carbon-footprint-tracker/
├── api/                    # FastAPI backend
│   ├── app/
│   │   ├── auth.py        # JWT authentication
│   │   ├── models.py      # Database models
│   │   ├── routers/       # API endpoints
│   │   └── services/      # Business logic
│   ├── alembic/          # Database migrations
│   └── requirements.txt
├── web/                    # React frontend
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # UI components
│   │   ├── features/     # Feature modules
│   │   ├── lib/          # Utilities
│   │   └── store/        # State management
│   └── package.json
├── ml/                     # ML inference service
│   ├── app/
│   │   └── predictor.py  # Waste classification
│   └── requirements.txt
├── packages/
│   └── shared-types/      # Shared TypeScript types
└── docker-compose.yml     # Full stack orchestration
```

## 🧪 Testing the App

1. **Register/Login** at http://localhost:3000
2. **Track Carbon** using the calculator
3. **Scan Waste** with AI recognition
4. **View Charts** and statistics
5. **Check Leaderboard** rankings

## 📊 Features

### Carbon Calculator
- **Transport**: Car, Bus, Train, Plane, EV, etc.
- **Diet**: Beef, Chicken, Fish, Vegetables, etc.
- **Energy**: Grid electricity, Natural gas, etc.
- **Shopping**: Clothing, Electronics, Furniture, etc.
- **Custom**: Manual carbon entries

### Waste Recognition
- 8 waste types with recycling tips
- AI-powered classification
- Confidence scoring
- Alternative suggestions

### Dashboard
- Real-time carbon statistics
- Interactive charts
- Recent activity feed
- Eco score tracking

## 🔐 Security

- Password hashing (bcrypt)
- JWT authentication
- Protected endpoints
- Input validation
- SQL injection prevention

## 📈 Performance

- Database indexing
- Query optimization
- React Query caching
- Code splitting
- Lazy loading

## 🎨 Design

- Eco-friendly color palette
- Responsive layout
- Accessible (WCAG)
- Loading states
- Error handling

## 📝 Documentation

- `README.md` - This file (main documentation)
- `QUICKSTART.md` - Quick setup guide (5 minutes)
- `HOW_TO_RUN.md` - Detailed run instructions
- `ARCHITECTURE.md` - System architecture
- `CONTRIBUTING.md` - Contribution guidelines
- `PROJECT_STATUS.md` - Current project status
- `EMISSION_FACTORS.md` - Carbon calculation data sources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

See `CONTRIBUTING.md` for details.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Carbon calculation data from [CarbonFund.org](https://carbonfund.org)
- UI components from [Shadcn UI](https://ui.shadcn.com)
- React Query for data fetching
- FastAPI for backend excellence

## 🌟 Roadmap (Future Enhancements)

- [ ] PDF report generation
- [ ] Maps integration (Mapbox)
- [ ] Social sharing features
- [ ] Mobile app (React Native)
- [ ] Advanced ML models (custom training)
- [ ] Carbon offset marketplace
- [ ] IoT device integration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/carbon-tracker/issues)
- **Documentation**: See `HOW_TO_RUN.md` for detailed setup
- **Architecture**: See `ARCHITECTURE.md` for system design
- **Project Status**: See `PROJECT_STATUS.md` for feature status

---

**Made with 🌱 for a sustainable future**
