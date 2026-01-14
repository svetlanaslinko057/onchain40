# TradeWatcher - Product Requirements Document

## Original Problem Statement

Build a comprehensive crypto analytics platform for tracking on-chain liquidity movements, smart money flows, and market intelligence. The platform should help traders identify profitable actors, understand market signals, and make informed trading decisions.

---

## Product Vision

**For** crypto traders and analysts  
**Who need** deep insights into on-chain activities  
**TradeWatcher is** a crypto analytics platform  
**That provides** real-time tracking of smart money, actor analysis, and market signals  
**Unlike** basic block explorers or simple portfolio trackers  
**Our product** delivers actionable intelligence with copy-trading simulation and predictive signals

---

## User Personas

### Primary: Active Trader
- Trades crypto daily/weekly
- Wants to follow smart money
- Needs quick signal identification
- Values edge and timing

### Secondary: Analyst/Researcher
- Studies market patterns
- Tracks entity behavior over time
- Creates reports and insights
- Values data depth

### Tertiary: Fund Manager
- Manages portfolio for clients
- Needs risk assessment tools
- Wants correlation analysis
- Values reliability metrics

---

## Core Requirements

### Actors Module (IMPLEMENTED ✅)

#### ETAP 1 - Edge Score & Exit Conditions ✅
- [x] Edge Score metric (0-100) for actor ranking
- [x] Color-coded badges (green ≥75, amber ≥50, red <50)
- [x] Exit Conditions block on profile
- [x] Sorting by Edge Score on catalog page

#### ETAP 2 - Simulated Portfolio ✅
- [x] What-If Calculator with capital input
- [x] Period selector (7d/30d/90d)
- [x] Actor vs Follower return comparison
- [x] Return Gap breakdown (slippage + delay)
- [x] Impact by Entry Delay table
- [x] Trade Statistics section

#### ETAP 3 - Anonymization & Correlation ✅
- [x] Hybrid Identity (real_name + strategy_name)
- [x] Toggle switch on ActorsPage and ActorProfile
- [x] "Moves With" correlation block
- [x] "Front-Runners" detection
- [x] "Followed By" tracking
- [x] Cluster phase indicators

---

### Signals Module (IMPLEMENTED ✅)

- [x] Signal lifecycle (New → Active → Cooling → Archived)
- [x] Confidence decay system
- [x] Score calculation engine with breakdown
- [x] Bridge alignment detection
- [x] User actions (watch, mute, alert)

---

### Watchlist Module (IMPLEMENTED ✅)

- [x] Address State Monitor page
- [x] Multi-type support (addresses, clusters, tokens)
- [x] 24h change tracking
- [x] Risk indicators
- [x] Add/remove functionality

---

### Alerts Module (IMPLEMENTED ✅)

- [x] Platform-wide Action Layer
- [x] Alert types (CEX deposit, buy/sell spike, etc.)
- [x] Severity levels
- [x] "What It Means" + "What To Do"
- [x] Read/unread management

---

### Cross-Page Integration (IMPLEMENTED ✅)

- [x] Watchlist button on TokensPage
- [x] Watchlist button on EntitiesPage
- [x] Alert creation from TokensPage
- [x] Alert creation from EntitiesPage
- [x] Shared AlertModal component

---

### UI/UX Improvements (IMPLEMENTED ✅)

- [x] SearchInput reusable component
- [x] Fixed icon overlap bug (recurring)
- [x] Compact modal designs
- [x] Consistent styling across pages

---

## Technical Architecture

### Frontend Structure
```
/app/frontend/src/
├── App.js                    # Router configuration
├── pages/                    # Page components
│   ├── ActorsPage.jsx       # ~500 lines
│   ├── ActorProfile.jsx     # ~2000+ lines (needs refactor)
│   ├── SignalsPage.jsx      # ~800 lines
│   └── ...
├── components/
│   ├── shared/
│   │   └── SearchInput.jsx  # Reusable search
│   ├── AlertModal.jsx       # Shared modal
│   └── ui/                   # shadcn components
└── styles/
```

### Backend Structure
```
/app/backend/
├── server.py                 # FastAPI app + all endpoints
└── requirements.txt          # Dependencies
```

### Data Layer (Current)
- All data is **MOCKED** in frontend components
- No database persistence
- State resets on page reload

---

## API Specification

### Existing Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/` | GET | Health check |
| `/api/entities` | GET | Entity carousel |
| `/api/exchange-flows` | GET | Flow data |
| `/api/transfers` | GET | Recent transfers |
| `/api/tokens` | GET | Token list |
| `/api/tokens/{id}` | GET | Token detail |
| `/api/tokens/{id}/balance-changes` | GET | Balance changes |
| `/api/tokens/{id}/holders` | GET | Top holders |
| `/api/tokens/{id}/price-history` | GET | Price chart |
| `/api/market-stats` | GET | Market overview |

### Needed Endpoints (Backend Integration P0)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/actors` | GET | Actor list with filters |
| `/api/actors/{id}` | GET | Actor detail |
| `/api/actors/{id}/trades` | GET | Trade history |
| `/api/actors/{id}/simulate` | POST | Portfolio simulation |
| `/api/signals` | GET | Signal list |
| `/api/signals/{id}` | GET | Signal detail |
| `/api/watchlist` | GET/POST/DELETE | Watchlist CRUD |
| `/api/alerts` | GET/POST/DELETE | Alerts CRUD |

---

## Completed Work Log

### December 2025

#### Week 1-2
- ✅ Initial platform deployment from GitHub
- ✅ Basic navigation setup
- ✅ Dashboard with market stats

#### Week 3
- ✅ **ETAP 1**: Edge Score implementation
- ✅ **ETAP 1**: Exit Conditions block
- ✅ **P1**: Watchlist integration on TokensPage
- ✅ **P1**: Watchlist integration on EntitiesPage
- ✅ **Bug Fix**: SearchInput component created

#### Week 4
- ✅ **ETAP 2**: Simulated Portfolio feature
- ✅ **ETAP 2**: What-If Calculator
- ✅ **ETAP 2**: PnL comparison tables
- ✅ **Bug Fix**: AlertModal entity pre-fill

#### Week 5
- ✅ **ETAP 3**: Hybrid Identity system
- ✅ **ETAP 3**: Actor Correlation block
- ✅ **ETAP 3**: Front-runner detection
- ✅ Documentation update (README, NEXT-TASKS, PAGES)

---

## Pending Work

### P0 - Critical
- [ ] Backend Integration (data persistence)

### P1 - High
- [ ] Refactor ActorProfile.jsx (2000+ lines)
- [ ] Correlation Matrix Page
- [ ] Extract mock data to files

### P2 - Medium
- [ ] Lazy loading for Watchlist
- [ ] Real-time data updates
- [ ] User authentication

### P3 - Low
- [ ] Mobile responsive design
- [ ] Dark/light theme
- [ ] Export features

---

## Success Metrics

### Technical
- [ ] All data persisted to database
- [ ] < 2s page load time
- [ ] 0 critical bugs
- [ ] 80%+ test coverage

### Product
- [ ] User can track actors across sessions
- [ ] Alerts trigger correctly
- [ ] Watchlist persists
- [ ] Simulation results saveable

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| ActorProfile too large | Bugs, slow dev | Refactor into components |
| No data persistence | User frustration | Backend integration priority |
| Mock data out of sync | Confusion | Extract to shared files |

---

## Changelog

### v2.0.0 (December 2025)
- Added Actors module with Edge Score
- Added Simulated Portfolio
- Added Actor Correlation
- Added Hybrid Identity
- Integrated Watchlist & Alerts across pages
- Fixed SearchInput bug
- Fixed AlertModal bug

### v1.0.0 (Initial)
- Basic dashboard
- Token and entity pages
- Wallet tracking
- Signal system
