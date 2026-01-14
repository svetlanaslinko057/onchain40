# TradeWatcher - Crypto Analytics Platform PRD

## Original Problem Statement
Deploy and iteratively enhance a crypto analytics platform focusing on on-chain wallet/actor analysis, signals, and market intelligence.

## Core Features

### Implemented Features

#### Actors Feature (ETAP 1 Complete)
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
  - Copy Feed with recent transactions
  - Strategy Fingerprint radar
  - Cluster wallet management

#### Watchlist & Alerts Integration (P1 Complete)
- **EntitiesPage**: 
  - Add to Watchlist button (toggles Eye/Check icon)
  - Create Alert button opens AlertModal with entity name pre-filled
- **TokensPage**:
  - Add token to Watchlist button
  - Create Alert button opens AlertModal with token symbol pre-filled
- **WalletsPage**: Already had full implementation
- **AlertModal**: Shared component with dynamic entity/token pre-fill

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
- **SearchInput Component**: Reusable component fixing icon overlap bug
  - Location: `/app/frontend/src/components/shared/SearchInput.jsx`
  - Used on: ActorsPage, EntitiesPage, SignalsPage, WatchlistPage, TokensPage

## Architecture

### Frontend Structure
```
/app/frontend/src/
├── components/
│   ├── shared/
│   │   └── SearchInput.jsx
│   ├── AlertModal.jsx (updated with dynamic entity)
│   ├── Header.jsx
│   └── ...
├── pages/
│   ├── ActorsPage.jsx
│   ├── ActorProfile.jsx
│   ├── EntitiesPage.jsx (watchlist/alerts integrated)
│   ├── TokensPage.jsx (watchlist/alerts integrated)
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
- ✅ **ETAP 1 - Actors Enhancement**:
  - Added Edge Score (0-100) to all actors
  - Added Edge Score badge to ActorProfile header
  - Added Exit Conditions block with priority levels
  - Default sort by Edge Score on ActorsPage
- ✅ **Search Input Bug Fix**:
  - Created reusable SearchInput component
  - Replaced all inline search implementations
- ✅ **P1 - Watchlist & Alerts Integration**:
  - EntitiesPage: watchlist toggle + alert modal
  - TokensPage: watchlist toggle + alert modal
  - AlertModal: dynamic entity pre-fill fix

## Pending Tasks

### Upcoming (P2)
- **ETAP 2 - Copy-Mechanics**: Transform Copy Feed into Simulated Portfolio
- **ETAP 3 - Anonymize Actors**: Strategy-based names instead of persona names
- **Actors Correlation**: Show which actors move together

### Future (P2+)
- **Backend Integration**: Persist all data to MongoDB
- **Lazy Load for Watchlist**: Handle large item counts
- Component refactoring (ActorProfile.jsx is 1800+ lines)

## Known Issues
- None critical

## Testing Status
- Latest tests: `/app/test_reports/iteration_2.json`
- All P1 features tested and passing (95% → 100% after bug fix)

## Important Notes
- **ALL DATA IS MOCKED** on frontend - no backend persistence yet
- Watchlist state is local React state, not persisted
