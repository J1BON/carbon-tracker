# 📚 References & Data Sources

This document lists all data sources, research papers, documentation, and references used in the Carbon Tracker project.

---

## 📊 Carbon Emission Factors

### Primary Data Sources

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

---

## 🔬 Research Papers & Studies

### Carbon Footprint Calculation

1. **Wiedmann, T., & Minx, J. (2008).** A Definition of 'Carbon Footprint'. *Ecological Economics Research Trends*, 1-11.
   - Foundation for carbon footprint methodology

2. **Hertwich, E. G., & Peters, G. P. (2009).** Carbon Footprint of Nations: A Global, Trade-Linked Analysis. *Environmental Science & Technology*, 43(16), 6414-6420.
   - Global carbon footprint analysis methodology

3. **Jones, C. M., & Kammen, D. M. (2011).** Quantifying Carbon Footprint Reduction Opportunities for U.S. Households and Communities. *Environmental Science & Technology*, 45(9), 4088-4095.
   - Household carbon footprint reduction strategies

### Food Emissions

4. **Poore, J., & Nemecek, T. (2018).** Reducing food's environmental impacts through producers and consumers. *Science*, 360(6392), 987-992.
   - Comprehensive food system emissions database
   - Used as primary source for food emission factors

5. **Clark, M. A., et al. (2020).** Global food system emissions could preclude achieving the 1.5° and 2°C climate change targets. *Science*, 370(6517), 705-708.
   - Food system climate impact analysis

### Transportation Emissions

6. **IPCC (2014).** Climate Change 2014: Mitigation of Climate Change. *Working Group III Contribution to the Fifth Assessment Report*.
   - Transportation sector emission factors

7. **Brand, C., et al. (2020).** The climate change mitigation effects of daily active travel in cities. *Transportation Research Part D*, 93, 102764.
   - Active transportation carbon benefits

---

## 🛠 Technology & Framework Documentation

### Backend Technologies

| Technology | Documentation | Version Used |
|-----------|--------------|--------------|
| **FastAPI** | [fastapi.tiangolo.com](https://fastapi.tiangolo.com) | 0.109.0 |
| **SQLAlchemy** | [docs.sqlalchemy.org](https://docs.sqlalchemy.org) | 2.0.25 |
| **Pydantic** | [docs.pydantic.dev](https://docs.pydantic.dev) | 2.5.3 |
| **Alembic** | [alembic.sqlalchemy.org](https://alembic.sqlalchemy.org) | 1.13.1 |
| **PostgreSQL** | [postgresql.org/docs](https://www.postgresql.org/docs) | 15 |
| **Redis** | [redis.io/docs](https://redis.io/docs) | 7 |

### Frontend Technologies

| Technology | Documentation | Version Used |
|-----------|--------------|--------------|
| **React** | [react.dev](https://react.dev) | 18.x |
| **TypeScript** | [typescriptlang.org](https://www.typescriptlang.org) | 5.x |
| **Vite** | [vitejs.dev](https://vitejs.dev) | 5.x |
| **Tailwind CSS** | [tailwindcss.com](https://tailwindcss.com) | 3.x |
| **React Query** | [tanstack.com/query](https://tanstack.com/query) | 5.x |
| **Zustand** | [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs) | 4.x |
| **Shadcn UI** | [ui.shadcn.com](https://ui.shadcn.com) | Latest |

### Infrastructure & DevOps

| Technology | Documentation | Version Used |
|-----------|--------------|--------------|
| **Docker** | [docs.docker.com](https://docs.docker.com) | Latest |
| **Docker Compose** | [docs.docker.com/compose](https://docs.docker.com/compose) | 3.8 |
| **Nginx** | [nginx.org/en/docs](https://nginx.org/en/docs) | Alpine |

---

## 📖 API Standards & Protocols

### REST API Design

- **RESTful API Design Best Practices**: [restfulapi.net](https://restfulapi.net)
- **OpenAPI Specification**: [swagger.io/specification](https://swagger.io/specification)
- **JSON API Specification**: [jsonapi.org](https://jsonapi.org)

### Authentication & Security

- **JWT (JSON Web Tokens)**: [jwt.io](https://jwt.io)
- **OAuth 2.0**: [oauth.net/2](https://oauth.net/2)
- **OWASP Top 10**: [owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten)

---

## 🗺 Mapping & Location Services

| Service | Documentation | Usage |
|---------|--------------|-------|
| **Mapbox** | [docs.mapbox.com](https://docs.mapbox.com) | Maps integration for recycling points |
| **OpenStreetMap** | [openstreetmap.org](https://www.openstreetmap.org) | Base map data |

---

## 🎨 UI/UX Design References

### Design Systems

- **Shadcn UI Components**: [ui.shadcn.com](https://ui.shadcn.com)
- **Tailwind UI**: [tailwindui.com](https://tailwindui.com)
- **Radix UI Primitives**: [radix-ui.com](https://www.radix-ui.com)

### Accessibility

- **WCAG 2.1 Guidelines**: [w3.org/WAI/WCAG21](https://www.w3.org/WAI/WCAG21)
- **ARIA Authoring Practices**: [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg)

### Color & Typography

- **Tailwind CSS Colors**: [tailwindcss.com/docs/customizing-colors](https://tailwindcss.com/docs/customizing-colors)
- **Google Fonts**: [fonts.google.com](https://fonts.google.com)

---

## 📱 Mobile & PWA References

- **Progressive Web Apps**: [web.dev/progressive-web-apps](https://web.dev/progressive-web-apps)
- **Service Workers**: [developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- **Web App Manifest**: [developer.mozilla.org/en-US/docs/Web/Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

---

## 🌍 Climate & Environmental Data

### Climate Change Organizations

| Organization | Description | URL |
|--------------|------------|-----|
| **IPCC** | Intergovernmental Panel on Climate Change | [ipcc.ch](https://www.ipcc.ch) |
| **UNFCCC** | United Nations Framework Convention on Climate Change | [unfccc.int](https://unfccc.int) |
| **EPA** | U.S. Environmental Protection Agency | [epa.gov](https://www.epa.gov) |
| **IEA** | International Energy Agency | [iea.org](https://www.iea.org) |

### Carbon Offset & Credits

- **Gold Standard**: [goldstandard.org](https://www.goldstandard.org)
- **Verified Carbon Standard**: [verra.org](https://www.verra.org)
- **Carbon Trust**: [carbontrust.com](https://www.carbontrust.com)

---

## 🔒 Security & Privacy

### Data Protection

- **GDPR Guidelines**: [gdpr.eu](https://gdpr.eu)
- **OWASP Security Guidelines**: [owasp.org](https://owasp.org)
- **NIST Cybersecurity Framework**: [nist.gov/cyberframework](https://www.nist.gov/cyberframework)

### Password Security

- **NIST Password Guidelines**: [pages.nist.gov/800-63-3](https://pages.nist.gov/800-63-3)
- **OWASP Password Storage Cheat Sheet**: [cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

## 📈 Analytics & Monitoring

| Tool | Documentation | Usage |
|------|--------------|-------|
| **Sentry** | [docs.sentry.io](https://docs.sentry.io) | Error tracking |
| **Prometheus** | [prometheus.io/docs](https://prometheus.io/docs) | Metrics (future) |
| **Grafana** | [grafana.com/docs](https://grafana.com/docs) | Visualization (future) |

---

## 🚀 Deployment & Hosting

### Platform Documentation

| Platform | Documentation | Usage |
|----------|--------------|-------|
| **Vercel** | [vercel.com/docs](https://vercel.com/docs) | Frontend deployment |
| **Railway** | [docs.railway.app](https://docs.railway.app) | Backend & database |
| **Netlify** | [docs.netlify.com](https://docs.netlify.com) | Alternative frontend |
| **Render** | [render.com/docs](https://render.com/docs) | Alternative backend |
| **DigitalOcean** | [docs.digitalocean.com](https://docs.digitalocean.com) | VPS hosting |

---

## 📝 Code Quality & Standards

### Linting & Formatting

- **ESLint**: [eslint.org/docs](https://eslint.org/docs)
- **Prettier**: [prettier.io/docs](https://prettier.io/docs)
- **Black (Python)**: [black.readthedocs.io](https://black.readthedocs.io)
- **Ruff (Python)**: [docs.astral.sh/ruff](https://docs.astral.sh/ruff)

### Testing

- **Jest**: [jestjs.io/docs](https://jestjs.io/docs)
- **React Testing Library**: [testing-library.com/react](https://testing-library.com/react)
- **Pytest**: [docs.pytest.org](https://docs.pytest.org)

---

## 📚 Additional Learning Resources

### Carbon Footprint Education

- **Carbon Footprint Calculator Methodology**: [carbonfootprint.com](https://www.carbonfootprint.com)
- **WWF Carbon Calculator**: [footprint.wwf.org.uk](https://footprint.wwf.org.uk)
- **EPA Carbon Footprint Calculator**: [epa.gov/carbon-footprint-calculator](https://www.epa.gov/carbon-footprint-calculator)

### Software Development

- **MDN Web Docs**: [developer.mozilla.org](https://developer.mozilla.org)
- **Stack Overflow**: [stackoverflow.com](https://stackoverflow.com)
- **GitHub Guides**: [guides.github.com](https://guides.github.com)

---

## 🔄 Data Update Schedule

### Recommended Update Frequency

- **Emission Factors**: Annually (or when new data is published)
- **Energy Grid Factors**: Quarterly (reflects renewable energy adoption)
- **Food Factors**: Annually (reflects agricultural improvements)
- **Transport Factors**: Annually (reflects vehicle efficiency improvements)

### Last Updated

- **Emission Factors**: January 2025
- **Technology Stack**: January 2025
- **Documentation**: January 2025

---

## ⚠️ Disclaimer

All emission factors are **global averages** and may vary by:
- Geographic location
- Production methods
- Transportation distances
- Local energy grid composition
- Seasonal variations

For enterprise applications, consider using region-specific factors from local environmental agencies.

---

## 📧 Contact & Contributions

If you have suggestions for additional references or data sources, please:
1. Open an issue on GitHub
2. Submit a pull request with updated references
3. Contact the project maintainers

---

**Last Updated**: January 2025  
**Version**: 1.0

