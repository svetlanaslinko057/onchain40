# TradeWatcher - Crypto Analytics Platform PRD

## Original Problem Statement
Deploy and iteratively enhance a crypto analytics platform focusing on on-chain wallet/actor analysis, signals, and market intelligence.

## Core Features

### Implemented Features

#### Actors Feature (NEW - ETAP 1 Complete)
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
  - Exit Conditions block (NEW)
  - Timing Edge metrics
  - Copy Feed with recent transactions
  - Strategy Fingerprint radar
  - Cluster wallet management

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

#### Market Intelligence
- Token analysis with structure signals
- Entity tracking (exchanges, funds, smart money)
- CEX vs DEX pressure analysis

### UI/UX Improvements
- **SearchInput Component** (NEW): Reusable component fixing icon overlap bug
  - Location: `/app/frontend/src/components/shared/SearchInput.jsx`
  - Used on: ActorsPage, EntitiesPage, SignalsPage, WatchlistPage, TokensPage
- AlertModal compaction
- WalletsPage redesign with top-level search

## Architecture

### Frontend Structure
```
/app/frontend/src/
├── components/
│   ├── shared/
│   │   └── SearchInput.jsx (NEW)
│   ├── AlertModal.jsx
│   ├── Header.jsx
│   └── ...
├── pages/
│   ├── ActorsPage.jsx (Edge Score implemented)
│   ├── ActorProfile.jsx (Exit Conditions added)
│   ├── SignalsPage.jsx
│   ├── WatchlistPage.jsx
│   ├── WalletsPage.jsx
│   ├── TokensPage.jsx
│   ├── EntitiesPage.jsx
│   └── ...
```

### Tech Stack
- **Frontend**: React, React Router, Tailwind CSS, lucide-react, shadcn/ui
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (not actively used yet - all data mocked)

## Completed Work

### December 2025
- ✅ **ETAP 1 - Actors Enhancement**:
  - Added Edge Score (0-100) to all actors with formula breakdown
  - Added Edge Score badge to ActorProfile header
  - Added Exit Conditions block with priority levels (CRITICAL/HIGH/MEDIUM)
  - Default sort by Edge Score on ActorsPage
- ✅ **Search Input Bug Fix**:
  - Created reusable SearchInput component
  - Replaced all inline search implementations
  - Fixed icon overlapping text issue permanently

## Pending Tasks

### In Progress (P1)
- **Integrate Watchlist & Alerts Across Pages**: Add handlers for watchlist/alert icons on TokensPage, EntitiesPage, WalletsPage

### Upcoming (P1-P2)
- **ETAP 2 - Copy-Mechanics**: Transform Copy Feed into Simulated Portfolio
- **ETAP 3 - Anonymize Actors**: Strategy-based names instead of persona names
- **Actors Correlation**: Show which actors move together

### Future (P2)
- **Backend Integration**: Persist all data to MongoDB
- **Lazy Load for Watchlist**: Handle large item counts
- Component refactoring (ActorProfile.jsx is 1800+ lines)

## Known Issues
- None critical (search bug fixed)

## Testing Status
- Latest test: `/app/test_reports/iteration_1.json`
- All ETAP 1 features tested and passing (100% success rate)
