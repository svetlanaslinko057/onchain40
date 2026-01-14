# TradeWatcher - Crypto Analytics Platform

> On-chain intelligence platform for tracking liquidity movements, smart money flows, and market signals.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-development-yellow.svg)

## Overview

TradeWatcher is a comprehensive crypto analytics platform designed for traders and analysts who need deep insights into on-chain activities. The platform provides real-time tracking of smart money movements, actor behavior analysis, market signals, and portfolio simulations.

### Key Features

- **Actors Analysis** - Track and analyze profitable traders with Edge Scores, behavior patterns, and copy-trading simulations
- **Smart Signals** - AI-powered signal detection with confidence decay and lifecycle management
- **Watchlist Monitor** - Real-time tracking of wallets, clusters, and tokens with change alerts
- **Alerts System** - Platform-wide action layer with behavior change notifications
- **Entity Intelligence** - Monitor exchanges, funds, and market makers with bridge clustering
- **Token Analytics** - Deep token analysis with flow charts and holder composition

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router, Tailwind CSS, shadcn/ui, Recharts, lucide-react |
| Backend | FastAPI (Python 3.11+) |
| Database | MongoDB (Atlas compatible) |
| State | React hooks (local state, mocked data) |

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB instance

### Installation

```bash
# Clone repository
git clone <repo-url>
cd tradewatcher

# Backend setup
cd backend
pip install -r requirements.txt
cp .env.example .env  # Configure MONGO_URL and DB_NAME

# Frontend setup
cd ../frontend
yarn install
cp .env.example .env  # Configure REACT_APP_BACKEND_URL

# Start services
# Backend runs on port 8001
# Frontend runs on port 3000
```

### Environment Variables

**Backend (`/backend/.env`)**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=tradewatcher
CORS_ORIGINS=*
```

**Frontend (`/frontend/.env`)**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## Project Structure

```
/app/
├── backend/
│   ├── server.py              # FastAPI application + API endpoints
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment configuration
│
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main router configuration
│   │   ├── pages/
│   │   │   ├── ArkhamHome.jsx     # Landing/Dashboard
│   │   │   ├── ActorsPage.jsx     # Actors catalog with Edge Scores
│   │   │   ├── ActorProfile.jsx   # Detailed actor analysis + Simulated Portfolio
│   │   │   ├── TokensPage.jsx     # Token overview + Watchlist/Alerts
│   │   │   ├── TokenDetail.jsx    # Deep token analytics
│   │   │   ├── EntitiesPage.jsx   # Exchanges, Funds, Market Makers
│   │   │   ├── EntityDetail.jsx   # Entity deep dive
│   │   │   ├── WalletsPage.jsx    # Wallet intelligence
│   │   │   ├── SignalsPage.jsx    # AI signals with lifecycle
│   │   │   ├── SignalSnapshot.jsx # Signal detail view
│   │   │   ├── WatchlistPage.jsx  # Address State Monitor
│   │   │   ├── AlertsPageNew.jsx  # Action Layer alerts
│   │   │   ├── Portfolio.jsx      # Portfolio tracker
│   │   │   └── StrategiesPage.jsx # Trading strategies
│   │   │
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   │   └── SearchInput.jsx    # Reusable search component
│   │   │   ├── AlertModal.jsx         # Create alert dialog
│   │   │   ├── Header.jsx             # Navigation header
│   │   │   ├── BehaviorFingerprint.jsx
│   │   │   ├── SmartMoneyRadar.jsx
│   │   │   └── ui/                    # shadcn/ui components
│   │   │
│   │   └── styles/
│   │       ├── App.css
│   │       ├── index.css
│   │       └── chartStyles.css
│   │
│   ├── package.json
│   └── .env
│
├── memory/
│   └── PRD.md                 # Product Requirements Document
│
└── test_reports/              # Testing iteration reports
```

## Pages Documentation

### Core Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `ArkhamHome` | Dashboard with market overview, entity carousel, exchange flows |
| `/actors` | `ActorsPage` | Actors catalog with Edge Scores, filters, hybrid identity toggle |
| `/actors/:id` | `ActorProfile` | Full actor analysis: Playbook, Simulated Portfolio, Correlation, Exit Conditions |
| `/tokens` | `TokensPage` | Token list with watchlist/alert integration |
| `/token/:id` | `TokenDetail` | Token deep dive: holders, flows, price history |
| `/entities` | `EntitiesPage` | Exchanges, funds, market makers with bridge clustering |
| `/entity/:id` | `EntityDetail` | Entity analysis and holdings |
| `/wallets` | `WalletsPage` | Wallet intelligence with behavior fingerprinting |
| `/signals` | `SignalsPage` | Smart signals with confidence decay system |
| `/watchlist` | `WatchlistPage` | Address State Monitor for tracked items |
| `/alerts` | `AlertsPageNew` | Platform-wide action alerts |
| `/strategies` | `StrategiesPage` | Trading strategy templates |

### Features by Page

#### ActorsPage (`/actors`)
- **Edge Score** - Composite metric (0-100) for actor profitability
- **Hybrid Identity** - Toggle between real names and strategy-based names
- **Filters** - Strategy, risk level, latency, chain
- **Sorting** - By Edge Score, PnL, win rate

#### ActorProfile (`/actors/:actorId`)
- **Actionable Playbook** - Current action recommendations
- **Simulated Portfolio** - What-if calculator with capital simulation
- **Actor Correlation** - Related actors, front-runners, followers
- **Exit Conditions** - When to stop following
- **Edge Decay Indicator** - Track declining performance
- **Cluster Management** - Related wallets visualization

#### SignalsPage (`/signals`)
- **Signal Lifecycle** - New → Active → Cooling → Archived
- **Confidence Decay** - Score decreases without confirmations
- **Score Breakdown** - Explainable scoring components
- **Bridge Alignment** - Cross-entity signal confirmation

#### WatchlistPage (`/watchlist`)
- **Multi-type Tracking** - Addresses, clusters, tokens
- **24h Change Filtering** - Track changes by percentage
- **Risk Indicators** - Visual risk scoring
- **Quick Actions** - Direct alerts and navigation

## API Reference

### Base URL
```
Production: /api
Development: http://localhost:8001/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | Health check |
| GET | `/api/entities` | Top entities carousel |
| GET | `/api/exchange-flows` | Exchange flow data with filters |
| GET | `/api/transfers` | Recent transfers with pagination |
| GET | `/api/tokens` | All featured tokens |
| GET | `/api/tokens/{id}` | Token details |
| GET | `/api/tokens/{id}/balance-changes` | Entity balance changes |
| GET | `/api/tokens/{id}/holders` | Top holders |
| GET | `/api/tokens/{id}/transfers` | Token transfers |
| GET | `/api/tokens/{id}/price-history` | Price chart data |
| GET | `/api/tokens/{id}/open-interest` | OI chart data |
| GET | `/api/tokens/{id}/cex-volume` | CEX volume data |
| GET | `/api/market-stats` | Market statistics |

## Data Architecture

### Current State: Mock Data Layer

All major features currently use frontend mock data defined in React components:

- **ActorsPage/ActorProfile** - Actor data with Edge Scores, correlation, simulated portfolios
- **SignalsPage** - Signal data with lifecycle and scoring
- **WatchlistPage** - Watched items state
- **AlertModal** - Alert configuration state

### Data Models (Mock)

```javascript
// Actor Model
{
  id: string,
  real_name: string,
  strategy_name: string,
  identity_confidence: number,
  edgeScore: number,
  exitConditions: ExitCondition[],
  correlation: CorrelationData,
  simulatedPortfolio: PortfolioSimulation,
  // ...
}

// Signal Model
{
  id: string,
  score: number,
  lifecycle: 'new' | 'active' | 'cooling' | 'archived',
  confidenceDecay: DecayData,
  scoreBreakdown: ScoreComponent[],
  // ...
}
```

## Recent Updates (December 2025)

### ETAP 1 - Edge Score & Exit Conditions
- Added `edgeScore` metric for actor ranking
- Implemented "Exit Conditions" block on actor profiles
- Color-coded Edge Score badges (green/amber/red)

### ETAP 2 - Simulated Portfolio
- **What-If Calculator** with configurable starting capital
- **Period Selector** (7d/30d/90d) with dynamic calculations
- **Return Comparison** - Actor vs Follower returns
- **Return Gap Breakdown** - Slippage and delay costs
- **Impact by Entry Delay** table with recommendations

### ETAP 3 - Actor Anonymization & Correlation
- **Hybrid Identity System** - Toggle real names ↔ strategy names
- **Actor Correlation Block**:
  - "Moves With" - Similar behavior actors
  - "Front-Runners" - Actors who act before
  - "Followed By" - Actors who follow
  - Cluster phase indicators

### Bug Fixes
- **SearchInput Component** - Fixed recurring icon overlap issue
- **AlertModal** - Fixed entity pre-fill state management
- **Watchlist Integration** - Added to TokensPage and EntitiesPage

## Testing

Test reports are stored in `/app/test_reports/`:
- `iteration_1.json` - Initial test suite
- `iteration_2.json` - ETAP 2 tests
- `iteration_3.json` - Full feature tests

Run tests:
```bash
# Backend
cd backend
pytest tests/

# Frontend
cd frontend
yarn test
```

## Known Limitations

1. **All data is mocked** - No backend persistence yet
2. **State is not persisted** - Watchlist/alerts reset on reload
3. **No authentication** - Open access to all features

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Next Steps:** See [NEXT-TASKS.md](NEXT-TASKS.md) for upcoming development priorities.
