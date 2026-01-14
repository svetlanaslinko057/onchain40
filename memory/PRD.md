# TradeWatcher - Crypto Analytics Platform PRD

## Original Problem Statement
Deploy and iteratively enhance a crypto analytics platform focusing on on-chain wallet/actor analysis, signals, and market intelligence.

## Core Features

### Implemented Features

#### Actors Feature (ETAP 1 + ETAP 2 Complete)
- **ActorsPage** (`/actors`): Overview catalog with actor cards showing:
  - Edge Score (0-100) with color coding (green/amber/red)
  - Default sort by Edge Score
  - Filters by strategy, risk, latency, chain
  - Active signals indicator
- **ActorProfile** (`/actors/:id`): Detailed actor analysis with:
  - Edge Score badge in header
  - Actionable Playbook
  - Follower Reality Check (modeled ROI, entry delay, slippage)
  - Edge Decay Indicator
  - Do NOT Follow If conditions
  - Exit Conditions block
  - Timing Edge metrics
  - **Simulated Portfolio (NEW - ETAP 2)**:
    - What-If Calculator with capital input
    - Period selector (7d/30d/90d)
    - Actor Return vs Follower Return comparison
    - Return Gap breakdown (Slippage + Delay costs)
    - Impact by Entry Delay table with recommendations
    - Trade Statistics collapsible section
  - Recent Trades with PnL comparison (Actor vs You)
  - Strategy Fingerprint radar
  - Cluster wallet management

#### Watchlist & Alerts Integration (P1 Complete)
- **EntitiesPage**: Watchlist toggle + AlertModal integration
- **TokensPage**: Watchlist toggle + AlertModal integration  
- **WalletsPage**: Full watchlist/alert functionality
- **AlertModal**: Shared component with dynamic entity pre-fill

#### Signals Page
- Signal lifecycle (New → Active → Cooling → Archived)
- Confidence decay system
- Bridge alignment detection
- User actions (watch, mute, hide, alerts)

#### Watchlist Page  
- Address State Monitor
- Track wallets, clusters, tokens
- 24h change filtering
- Risk and behavior indicators

#### Alerts System
- Platform-wide Action Layer
- Behavior change alerts
- Bridge alignment alerts
- Risk spike notifications

### UI/UX Improvements
- **SearchInput Component**: Reusable component fixing icon overlap bug

## Architecture

### Frontend Structure
```
/app/frontend/src/
├── components/
│   ├── shared/
│   │   └── SearchInput.jsx
│   ├── AlertModal.jsx
│   ├── Header.jsx
│   └── ...
├── pages/
│   ├── ActorsPage.jsx
│   ├── ActorProfile.jsx (ETAP 2 - Simulated Portfolio)
│   ├── EntitiesPage.jsx
│   ├── TokensPage.jsx
│   ├── SignalsPage.jsx
│   ├── WatchlistPage.jsx
│   ├── WalletsPage.jsx
│   └── ...
```

### Tech Stack
- **Frontend**: React, React Router, Tailwind CSS, lucide-react, shadcn/ui
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (not actively used - all data MOCKED)

## Completed Work

### December 2025
- ✅ **ETAP 1**: Edge Score + Exit Conditions
- ✅ **P1**: Watchlist & Alerts integration across pages
- ✅ **Search Input Bug Fix**: Reusable SearchInput component
- ✅ **ETAP 2**: Simulated Portfolio (Copy-Mechanics)
  - What-If Calculator with starting capital input
  - Period selector (7d/30d/90d) with dynamic calculations
  - Actor vs Follower return comparison
  - Return Gap breakdown (slippage + delay costs)
  - Impact by Entry Delay table with recommendations
  - Trade Statistics section
  - PnL comparison in Recent Trades

## Pending Tasks

### Upcoming (P2)
- **ETAP 3 - Anonymize Actors**: Strategy-based names instead of persona names
  - "AI Narrative Accumulator", "L2 Infrastructure Builder", etc.
- **Actors Correlation**: Show which actors move together
  - Correlation matrix, front-running detection, cluster behavior

### Future (P2+)
- **Backend Integration**: Persist all data to MongoDB
- **Lazy Load for Watchlist**: Handle large item counts
- Component refactoring (ActorProfile.jsx is now ~1900 lines)

## Testing Status
- Latest tests: `/app/test_reports/iteration_3.json`
- ETAP 2 Simulated Portfolio: 100% frontend success rate
- All features tested across different actor types

## Important Notes
- **ALL DATA IS MOCKED** on frontend - no backend persistence yet
- Watchlist/Alert state is local React state, not persisted
