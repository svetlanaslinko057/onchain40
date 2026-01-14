# Pages Documentation - TradeWatcher

> Detailed documentation for each page in the TradeWatcher platform.

---

## Navigation Structure

```
/                     → ArkhamHome (Dashboard)
/actors               → ActorsPage
/actors/:actorId      → ActorProfile
/tokens               → TokensPage
/token/:tokenId       → TokenDetail
/entities             → EntitiesPage
/entity/:entityId     → EntityDetail
/wallets              → WalletsPage
/signals              → SignalsPage
/signal/:id           → SignalSnapshot
/watchlist            → WatchlistPage
/alerts               → AlertsPageNew
/strategies           → StrategiesPage
/portfolio/:address   → Portfolio
```

---

## Page Details

### 1. ArkhamHome (`/`)

**File:** `/app/frontend/src/pages/ArkhamHome.jsx`

**Purpose:** Main dashboard providing market overview and quick access to all features.

**Features:**
- Market statistics banner (total cap, BTC/ETH dominance, Fear & Greed)
- Entity carousel (top exchanges with holdings)
- Exchange flows table with filtering and sorting
- Recent transfers feed
- Quick navigation to all sections

**Data Sources:**
- `/api/market-stats` - Market overview data
- `/api/entities` - Entity carousel data
- `/api/exchange-flows` - Flow table data
- `/api/transfers` - Recent transfers

---

### 2. ActorsPage (`/actors`)

**File:** `/app/frontend/src/pages/ActorsPage.jsx`

**Purpose:** Catalog of tracked actors (traders, funds, whales) with ranking and filtering.

**Features:**
- **Edge Score Ranking** - Actors sorted by profitability score (0-100)
- **Hybrid Identity Toggle** - Switch between real names and strategy-based names
  - Real: "Vitalik.eth", "a16z Crypto"
  - Strategy: "L2 Infrastructure Builder", "Institutional Infrastructure Play"
- **Filters:**
  - Strategy type (Smart Money, DEX Heavy, etc.)
  - Risk level (Low/Medium/High)
  - Latency (Early/Medium/Late)
  - Primary chain (ETH, SOL, BASE, ARB)
- **Actor Cards showing:**
  - Edge Score badge (color-coded)
  - Win rate percentage
  - Total PnL
  - Active signals indicator
  - Current behavior state

**Components Used:**
- `SearchInput` - Reusable search with icon
- `Header` - Navigation header
- shadcn Tooltip - Edge Score explanations

**Data Model:**
```javascript
{
  id: 'vitalik',
  real_name: 'Vitalik.eth',
  strategy_name: 'L2 Infrastructure Builder',
  identity_confidence: 0.95,
  edgeScore: 78,
  winRate: 66.8,
  pnl: '+$549K',
  riskScore: 12,
  strategies: ['Smart Money', 'DEX Heavy'],
  currentBehavior: 'Accumulating',
  primaryChain: 'ETH',
  latency: 'Early',
  hasActiveSignals: true,
  signalsCount: 3
}
```

---

### 3. ActorProfile (`/actors/:actorId`)

**File:** `/app/frontend/src/pages/ActorProfile.jsx`

**Purpose:** Deep analysis page for individual actors with copy-trading simulation.

**Sections:**

#### Header
- Actor name with hybrid identity toggle
- Edge Score badge (large, color-coded)
- Identity confidence indicator
- Quick actions (Watch, Alert, Follow)

#### Actionable Playbook
- Current recommended action (Watch/Entry/Reduce/Avoid)
- Tokens to watch
- Confidence level
- Reasoning explanation

#### Simulated Portfolio (ETAP 2)
- **What-If Calculator:**
  - Starting capital input (default: $10,000)
  - Period selector (7d/30d/90d)
- **Performance Comparison:**
  - Actor Return vs Follower Return
  - Return Gap (difference due to execution)
- **Gap Breakdown:**
  - Slippage cost
  - Entry delay cost
- **Impact by Entry Delay Table:**
  - Shows returns at 1h, 2h, 4h, 8h, 12h delays
  - Recommendations for each delay level
- **Trade Statistics** (collapsible):
  - Total trades, win rate, avg trade size

#### Actor Correlation & Influence (ETAP 3)
- **"Moves With"** - Actors with similar behavior patterns
  - Similarity percentage
  - Overlap area (e.g., "L2 accumulation")
- **"Front-Runners"** - Actors who act before this one
  - Average lead time
  - Frequency percentage
- **"Followed By"** - Actors who follow this one
  - Average lag time
  - Frequency percentage
- **Cluster Info** - Current cluster phase

#### Exit Conditions (ETAP 1)
- Trigger conditions with priority levels
- Recommended actions for each trigger
- Priority badges (critical/high/medium)

#### Follower Reality Check
- Expected entry delay
- Expected slippage percentage
- Modeled ROI comparison (actor vs follower)
- Max drawdown for followers
- Crowding factor assessment

#### Edge Decay Indicator
- Current status (stable/degrading/exhausted)
- 30-day trend description
- Success rate trend
- Follower count

#### "Do NOT Follow If" Conditions
- Market conditions to avoid
- Liquidity requirements
- Entry timing warnings

#### Copy Feed (Recent Trades)
- Action type (BUY/SELL/SWAP/BRIDGE)
- Token and size
- Timestamp
- PnL comparison (Actor PnL vs Your PnL)
- Entry delay indicator

#### Timing Edge Metrics
- Median time before price movement
- Success rate within 6h
- Late entry dropoff point
- Best market regime

#### Cluster Wallets
- Related wallet addresses
- Confidence percentages
- Roles (Main/Cold/Execution/Bridge)
- Last active timestamps

#### Strategy Fingerprint
- Radar chart visualization
- Dimensions: Alpha, Risk, Speed, Consistency, Diversification

**Data Model:** Complex nested object with 500+ lines of mock data

---

### 4. TokensPage (`/tokens`)

**File:** `/app/frontend/src/pages/TokensPage.jsx`

**Purpose:** Token overview with market intelligence and quick actions.

**Features:**
- Top tokens carousel with price changes
- Price chart with mini visualization
- Market Signal indicator (Bullish/Bearish/Neutral)
- Intelligence panel:
  - Structure status
  - Market alignment
  - Primary drivers
  - Primary risks
- Recent changes timeline
- **Watchlist Integration** - Add to watchlist button
- **Alert Integration** - Create alert button → AlertModal

**Components Used:**
- `SearchInput` - Token search
- `AlertModal` - Create alerts for tokens
- `recharts` - Price mini-charts

---

### 5. TokenDetail (`/token/:tokenId`)

**File:** `/app/frontend/src/pages/TokenDetail.jsx`

**Purpose:** Deep token analytics with charts and holder analysis.

**Features:**
- Full price chart with period selector
- Token metrics (market cap, volume, supply)
- Entity balance changes table
- Top holders list (addresses vs entities toggle)
- Recent transfers for token
- Open interest chart
- CEX volume chart

**Data Sources:**
- `/api/tokens/:id`
- `/api/tokens/:id/balance-changes`
- `/api/tokens/:id/holders`
- `/api/tokens/:id/transfers`
- `/api/tokens/:id/price-history`
- `/api/tokens/:id/open-interest`
- `/api/tokens/:id/cex-volume`

---

### 6. EntitiesPage (`/entities`)

**File:** `/app/frontend/src/pages/EntitiesPage.jsx`

**Purpose:** Monitor exchanges, funds, and market makers.

**Features:**
- Entity table with:
  - Type filtering (Exchange/Smart Money/Fund/Market Maker)
  - Holdings and netflow
  - Activity status (accumulating/distributing/rotating/holding)
  - Confidence scores
- **Bridge Clusters** - Groups of entities acting together
  - Cluster strength indicator
  - Shared direction
  - Confidence boost from clustering
- **Watchlist Integration** - Add entities to watchlist
- **Alert Integration** - Create alerts for entities

**Data Model:**
```javascript
{
  id: 'binance',
  name: 'Binance',
  type: 'Exchange',
  holdings: '$28.4B',
  netflow24h: '+$125M',
  activity: 'accumulating',
  confidence: 82,
  cluster: 'A'  // Bridge cluster assignment
}
```

---

### 7. WalletsPage (`/wallets`)

**File:** `/app/frontend/src/pages/WalletsPage.jsx`

**Purpose:** Individual wallet intelligence and analysis.

**Features:**
- Top wallets list with featured wallets
- Wallet search by address
- For each wallet:
  - Classification (Smart Money/Exchange/Fund/Whale)
  - Current mode (Accumulation/Distribution/etc.)
  - Reliability and risk scores
  - Decision Score with verdict (FOLLOW/WATCH/AVOID)
- Behavior Fingerprint component
- Advanced Risk Flags component
- Quick actions (Watch, Alert)

---

### 8. SignalsPage (`/signals`)

**File:** `/app/frontend/src/pages/SignalsPage.jsx`

**Purpose:** AI-powered market signals with lifecycle management.

**Features:**
- **Signal Lifecycle System:**
  - New (< 2 hours) - Fresh signals
  - Active (2-24 hours) - Confirmed signals
  - Cooling (24-72 hours) - Aging signals
  - Archived (> 72 hours or score < 20) - Historical
- **Confidence Decay System:**
  - Score decreases over time without confirmations
  - -2 points per hour after 6h of inactivity
  - Visual indicator of original vs decayed score
- **Signal Score Calculation:**
  - Behavior component (0-25 points)
  - Risk component (0-20 points)
  - Coordination component (0-20 points)
  - Magnitude component (0-20 points)
  - Recency component (0-15 points)
- **Score Breakdown Tooltip** - Explainable scoring
- **User Actions:**
  - Watch - Track signal
  - Mute - Hide notifications
  - Create Alert - Set up alert
- **Bridge Alignment Detection** - Cross-entity confirmation

---

### 9. WatchlistPage (`/watchlist`)

**File:** `/app/frontend/src/pages/WatchlistPage.jsx`

**Purpose:** Address State Monitor for tracking wallets, clusters, and tokens.

**Features:**
- **Multi-type Support:**
  - Addresses (individual wallets)
  - Clusters (related wallet groups)
  - Tokens (specific tokens)
- **Add Modal** with type selection
- **Item Display:**
  - 24h change percentage
  - Status indicator (up/down/neutral)
  - Risk level badge
  - Last activity timestamp
- **Filtering:**
  - By type (address/cluster/token)
  - By 24h change threshold
- **Actions:**
  - Remove from watchlist
  - Create alert
  - Navigate to detail page
- **Pagination** - Handle large lists

---

### 10. AlertsPageNew (`/alerts`)

**File:** `/app/frontend/src/pages/AlertsPageNew.jsx`

**Purpose:** Platform-wide action layer with all alerts.

**Features:**
- Alert types:
  - CEX Deposit - Large exchange deposits
  - Buy Spike - Accumulation detection
  - Sell Spike - Distribution detection
  - New Token - First-time purchases
  - Risky Approval - Security warnings
- Each alert shows:
  - Severity (danger/warning/info)
  - "What It Means" explanation
  - "What To Do" recommendation
- Read/unread status
- Filtering by severity
- Bulk actions (mark all read, clear)

---

### 11. StrategiesPage (`/strategies`)

**File:** `/app/frontend/src/pages/StrategiesPage.jsx`

**Purpose:** Trading strategy templates and ideas.

**Features:**
- Pre-built strategy templates
- Strategy parameters
- Backtesting indicators
- Risk metrics

---

### 12. Portfolio (`/portfolio/:address`)

**File:** `/app/frontend/src/pages/Portfolio.jsx`

**Purpose:** Portfolio tracker for specific addresses.

**Features:**
- Holdings breakdown
- PnL tracking
- Historical performance
- Token allocation chart

---

## Shared Components

### SearchInput
**File:** `/app/frontend/src/components/shared/SearchInput.jsx`
**Used In:** ActorsPage, TokensPage, EntitiesPage, SignalsPage, WatchlistPage
**Purpose:** Reusable search input with proper icon positioning (fixes recurring bug)

### AlertModal
**File:** `/app/frontend/src/components/AlertModal.jsx`
**Used In:** TokensPage, EntitiesPage, WalletsPage, SignalsPage
**Purpose:** Create alert dialog with entity type selection and trigger configuration

### Header
**File:** `/app/frontend/src/components/Header.jsx`
**Used In:** All pages
**Purpose:** Main navigation header with menu items

---

## Data Flow

```
User Action → Component State → (Future: API Call) → UI Update
                    ↓
              Mock Data (current)
```

### Current: Mock Data
All data is defined in component files as JavaScript objects.

### Future: API Integration
```
User Action → Component → API Call → Backend → MongoDB → Response → UI Update
```
