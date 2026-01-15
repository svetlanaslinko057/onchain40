# Next Tasks - TradeWatcher Development Roadmap

> Development priorities and upcoming features for TradeWatcher platform.

Last Updated: December 2025

---

## Priority Legend

| Priority | Label | Description |
|----------|-------|-------------|
| P0 | 🔴 **Critical** | Must be done ASAP, blocks other work |
| P1 | 🟠 **High** | Important for next release |
| P2 | 🟡 **Medium** | Should be done soon |
| P3 | 🟢 **Low** | Nice to have |

---

## 🔴 P0 - Critical Priority

### Backend Integration (Data Persistence Layer)

**Status:** Not Started  
**Estimated Complexity:** High  
**Dependencies:** None

The entire application currently runs on frontend mock data. This is the #1 technical debt that must be addressed.

#### Required Work:

1. **Database Schema Design**
   ```python
   # MongoDB Collections Needed
   - actors          # Actor profiles, Edge Scores, strategies
   - actor_trades    # Historical trades for actors
   - signals         # Smart signals with lifecycle states
   - watchlist       # User watchlist items
   - alerts          # Alert configurations and history
   - portfolios      # Simulated portfolio snapshots
   ```

2. **API Endpoints to Create**
   
   **Actors Module:**
   ```
   GET    /api/actors              # List all actors with filters
   GET    /api/actors/:id          # Actor detail with full data
   GET    /api/actors/:id/trades   # Actor trade history
   GET    /api/actors/:id/correlation  # Correlation data
   POST   /api/actors/:id/simulate # Run portfolio simulation
   ```
   
   **Signals Module:**
   ```
   GET    /api/signals             # List signals with lifecycle
   GET    /api/signals/:id         # Signal detail
   PUT    /api/signals/:id/action  # User actions (watch, mute, etc.)
   POST   /api/signals/calculate   # Recalculate signal scores
   ```
   
   **Watchlist Module:**
   ```
   GET    /api/watchlist           # User's watchlist
   POST   /api/watchlist           # Add item to watchlist
   DELETE /api/watchlist/:id       # Remove item
   PUT    /api/watchlist/:id       # Update item settings
   ```
   
   **Alerts Module:**
   ```
   GET    /api/alerts              # User's alerts
   POST   /api/alerts              # Create new alert
   DELETE /api/alerts/:id          # Delete alert
   PUT    /api/alerts/:id/status   # Mark as read/unread
   ```

3. **Frontend Integration**
   - Replace mock data imports with API calls
   - Add loading states and error handling
   - Implement data caching strategy

#### Files to Modify:
- `/app/backend/server.py` - Add new endpoints
- `/app/frontend/src/pages/ActorsPage.jsx` - Connect to API
- `/app/frontend/src/pages/ActorProfile.jsx` - Connect to API
- `/app/frontend/src/pages/SignalsPage.jsx` - Connect to API
- `/app/frontend/src/pages/WatchlistPage.jsx` - Connect to API
- `/app/frontend/src/components/AlertModal.jsx` - Connect to API

---

## 🟠 P1 - High Priority

### 1. Refactor ActorProfile.jsx (Code Quality)

**Status:** Not Started  
**Estimated Complexity:** Medium  
**Dependencies:** None (can be done before or after backend)

The `ActorProfile.jsx` component has grown to **2000+ lines** and is becoming unmaintainable.

#### Required Work:

Break into separate components:
```
/app/frontend/src/components/actor/
├── ActorHeader.jsx           # Name, badge, Edge Score
├── ActionablePlaybook.jsx    # Current action section
├── SimulatedPortfolio.jsx    # What-if calculator + PnL comparison
├── ActorCorrelation.jsx      # Correlation & influence block
├── ExitConditions.jsx        # Exit conditions list
├── EdgeDecayIndicator.jsx    # Edge decay status
├── FollowerRealityCheck.jsx  # Modeled ROI, slippage info
├── TimingEdge.jsx            # Timing metrics
├── CopyFeed.jsx              # Recent trades feed
├── ClusterWallets.jsx        # Related wallets
└── StrategyFingerprint.jsx   # Radar chart
```

#### Implementation Steps:
1. Create `/app/frontend/src/components/actor/` directory
2. Extract each section into separate component
3. Pass data via props
4. Update `ActorProfile.jsx` to compose components
5. Ensure all functionality works
6. Remove old code

---

### 2. Correlation Matrix Page (v2 Feature)

**Status:** Not Started  
**Estimated Complexity:** Medium  
**Dependencies:** Backend integration (for real data)

Create a dedicated interactive correlation matrix page at `/actors/correlation`.

#### Features:
- **Matrix View** - NxN grid of actor correlations
- **Heatmap Coloring** - Green (positive) to Red (negative)
- **Click-to-Drill** - Click cell to see correlation detail
- **Filter by**:
  - Strategy type
  - Time period (7d/30d/90d)
  - Correlation threshold
- **Cluster Detection** - Automatic grouping of related actors
- **Front-Running Detection** - Highlight timing relationships

#### Mockup:
```
┌─────────────────────────────────────────────────────────┐
│  Actor Correlation Matrix          [7d ▼] [Strategy ▼] │
├─────────────────────────────────────────────────────────┤
│         │ Actor A │ Actor B │ Actor C │ Actor D │ ...  │
│ Actor A │    -    │  0.82   │  0.71   │  0.45   │ ...  │
│ Actor B │  0.82   │    -    │  0.58   │  0.34   │ ...  │
│ Actor C │  0.71   │  0.58   │    -    │  0.89   │ ...  │
│ Actor D │  0.45   │  0.34   │  0.89   │    -    │ ...  │
├─────────────────────────────────────────────────────────┤
│ Detected Clusters: [L2 Infra] [Meme] [AI Narrative]    │
└─────────────────────────────────────────────────────────┘
```

---

### 3. Extract Mock Data to Separate Files

**Status:** Not Started  
**Estimated Complexity:** Low  
**Dependencies:** None

Currently mock data is defined inline in components. Extract to dedicated files.

#### Target Structure:
```
/app/frontend/src/data/
├── actors.js           # Actor mock data
├── signals.js          # Signal mock data
├── entities.js         # Entity mock data
├── tokens.js           # Token mock data
└── constants.js        # Chain configs, colors, etc.
```

#### Benefits:
- Cleaner component files
- Easier to swap mock → API data later
- Single source of truth for test data

---

## 🟡 P2 - Medium Priority

### 1. Lazy Loading for Watchlist

**Status:** Not Started  
**Estimated Complexity:** Medium  
**Dependencies:** Backend integration

Implement infinite scrolling/pagination on WatchlistPage for performance.

#### Implementation:
- Use `react-intersection-observer` for infinite scroll
- Implement cursor-based pagination in API
- Add loading skeleton states
- Cache loaded items

---

### 2. Real-Time Data Updates

**Status:** Not Started  
**Estimated Complexity:** High  
**Dependencies:** Backend integration

Add WebSocket support for live updates:
- New signals appearing
- Watchlist item changes
- Alert notifications
- Price updates

---

### 3. User Authentication

**Status:** Not Started  
**Estimated Complexity:** Medium  
**Dependencies:** Backend integration

Add user accounts to persist:
- Watchlist items per user
- Alert configurations
- Portfolio simulations
- Preferences

---

## 🟢 P3 - Low Priority (Future)

### 1. Mobile Responsive Design
- Optimize all pages for mobile view
- Add touch gestures for charts
- Collapsible sections for small screens

### 2. Dark/Light Theme Toggle
- Implement theme context
- Store preference in localStorage
- Add toggle in header

### 3. Export Features
- Export watchlist to CSV
- Export portfolio simulation results
- Export correlation matrix as image

### 4. Advanced Charting
- Custom date range selection
- Multiple timeframe comparison
- Drawing tools overlay

### 5. Notification System
- Browser push notifications
- Email alerts
- Telegram integration

---

## Optimization Tasks

### Performance
- [ ] Implement React.memo for heavy components
- [ ] Add virtualization for long lists (react-window)
- [ ] Optimize re-renders with useMemo/useCallback
- [ ] Code splitting by route

### Code Quality
- [ ] Add TypeScript types (gradual migration)
- [ ] Set up ESLint + Prettier config
- [ ] Add unit tests for utilities
- [ ] Add E2E tests for critical flows

### SEO & Accessibility
- [ ] Add proper meta tags
- [ ] Implement Open Graph tags
- [ ] Add aria-labels to interactive elements
- [ ] Ensure keyboard navigation works

---

## Completed Tasks

### December 2025
- [x] ETAP 1: Edge Score + Exit Conditions
- [x] ETAP 2: Simulated Portfolio (Copy-Mechanics)
- [x] ETAP 3: Actor Anonymization + Correlation
- [x] **ETAP 4: Influence Graph & Strategy Intelligence**
  - [x] ActorsPage: Influence Score sorting, Leader/Follower/Neutral badges, Crown indicators
  - [x] ActorProfile: Enhanced Correlation & Influence block with Influence Summary
  - [x] NEW PAGE: `/actors/correlation` with Interactive Influence Graph (ReactFlow)
  - [x] Influence Leaderboard (sorted by influence, not PnL)
  - [x] Strategy Flow Map (strategy × market phase matrix)
- [x] P1: Watchlist & Alerts integration (Tokens, Entities)
- [x] Bug Fix: SearchInput component (recurring issue)
- [x] Bug Fix: AlertModal entity pre-fill

---

## Notes for Developers

### When Adding New Features:
1. Check if mock data structure exists
2. Design API endpoint first
3. Build UI with mock data
4. Connect to backend when ready
5. Add tests before marking complete

### Code Standards:
- Use functional components with hooks
- Follow existing Tailwind CSS patterns
- Use lucide-react for icons
- Use shadcn/ui for base components
- Add data-testid to interactive elements

### Testing Checklist:
- [ ] Component renders without errors
- [ ] All interactive elements work
- [ ] Loading states display correctly
- [ ] Error states handled
- [ ] Mobile responsive
- [ ] Keyboard accessible
