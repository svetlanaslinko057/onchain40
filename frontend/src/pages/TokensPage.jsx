import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, ChevronUp, Clock, Users, Wallet, ArrowRightLeft, 
  BarChart3, Check, AlertTriangle, Zap, TrendingUp, TrendingDown, Bell, 
  Building, ExternalLink, Activity, ArrowUp, ArrowDown, Eye, X, Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import Header from '../components/Header';
import SearchInput from '../components/shared/SearchInput';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

// Mock tokens data
const topTokens = [
  { id: 'btc', symbol: 'BTC', price: 94250, change24h: 2.4 },
  { id: 'eth', symbol: 'ETH', price: 3342, change24h: 3.8 },
  { id: 'sol', symbol: 'SOL', price: 178.43, change24h: -1.2 },
  { id: 'bnb', symbol: 'BNB', price: 612.80, change24h: 1.5 },
  { id: 'xrp', symbol: 'XRP', price: 2.34, change24h: 5.2 },
  { id: 'ada', symbol: 'ADA', price: 0.98, change24h: -0.8 },
];

// Chart data
const chartData = [
  { day: '7d', price: 3180, netflow: -120 },
  { day: '6d', price: 3210, netflow: -80 },
  { day: '5d', price: 3195, netflow: 45 },
  { day: '4d', price: 3240, netflow: 120 },
  { day: '3d', price: 3285, netflow: 180 },
  { day: '2d', price: 3310, netflow: 220 },
  { day: '1d', price: 3325, netflow: 260 },
  { day: 'Now', price: 3342, netflow: 280 },
];

// Token data
const tokenData = {
  eth: {
    symbol: 'ETH',
    price: 3342,
    change: 3.8,
    marketSignal: { type: 'Bullish', confidence: 57 },
    intelligence: {
      structureStatus: 'SUPPORTIVE',
      marketAlignment: 'CONFIRMED',
      trend: 'improving', // improving | stable | declining
      confirmedDays: 6,
      duration: '1–3 weeks',
      confidence: 'Medium–High',
      primaryDrivers: ['Smart money accumulation', 'Whale & institutional buying'],
      primaryRisk: 'Short-term retail selling',
    },
    recentChanges: [
      { 
        type: 'up', 
        metric: 'Smart money exposure', 
        value: '+5.8%', 
        time: '2d ago',
        what: 'Smart money wallets increased ETH holdings by 5.8% over the past 48 hours.',
        why: 'This suggests institutional confidence in current price levels and potential accumulation before expected price movement.'
      },
      { 
        type: 'down', 
        metric: 'CEX balances', 
        value: '−2.3%', 
        time: '3d ago',
        what: 'Centralized exchange balances decreased by 2.3%, indicating outflows to private wallets.',
        why: 'Lower CEX balances typically reduce immediate sell pressure and suggest holders are moving to long-term storage.'
      },
      { 
        type: 'up', 
        metric: 'LP inflow', 
        value: '+$6.3M', 
        time: '4d ago',
        what: 'Liquidity providers added $6.3M to DEX pools.',
        why: 'Increased LP activity indicates growing confidence in trading volume and fee generation potential.'
      },
      { 
        type: 'up', 
        metric: 'Bridge volume', 
        value: '+$3.6M', 
        time: '5d ago',
        what: 'Cross-chain bridge activity increased with $3.6M flowing into Ethereum.',
        why: 'Capital flowing into the network from other chains suggests relative strength and demand.'
      },
    ],
    holders: {
      strongHands: 53.5,
      trend: 'Increasing',
      composition: [
        { type: 'CEX', pct: 35.2, change: -2.3 },
        { type: 'Smart Money', pct: 18.7, change: 5.8 },
        { type: 'Funds', pct: 12.4, change: 1.2 },
        { type: 'Retail', pct: 22.1, change: -3.1 },
      ],
      interpretation: 'Smart money & funds increased exposure while CEX balances declined.',
    },
    supplyFlow: {
      mintBurn: -3847,
      lpFlow: 6300000,
      bridgeFlow: 3600000,
      netEffect: 'Supply pressure decreasing due to LP & bridge inflows.',
    },
    pressure: {
      buyPct: 50.8,
      netFlow: 280,
      interpretation: 'Buy pressure driven by Pro, Institutional and Whale segments.',
    },
    tradeSize: [
      { 
        size: 'Retail', range: '<$1K', action: 'Sell', link: '/wallets?filter=retail',
        entities: 'Multiple retail wallets',
        netFlow: '-$2.1M',
        avgHold: '3d'
      },
      { 
        size: 'Active', range: '$1K-10K', action: 'Neutral', link: '/wallets?filter=active',
        entities: '~1,200 active traders',
        netFlow: '+$0.8M',
        avgHold: '7d'
      },
      { 
        size: 'Pro', range: '$10K-100K', action: 'Buy', link: '/entities?filter=desks',
        entities: '45 trading desks',
        netFlow: '+$12M',
        avgHold: '12d'
      },
      { 
        size: 'Inst.', range: '$100K-1M', action: 'Buy', link: '/entities?filter=funds',
        entities: '8 funds accumulating',
        netFlow: '+$34M',
        avgHold: '21d'
      },
      { 
        size: 'Whale', range: '>$1M', action: 'Buy', link: '/entities?filter=whales',
        entities: '3 entities accumulating',
        netFlow: '+$48M',
        avgHold: '14d'
      },
    ],
    suggestedStrategies: {
      reasons: ['Smart money accumulation', 'Mid-term structure', 'Whale support'],
      strategies: [
        { name: 'Smart Money Follow', why: 'Aligned with institutional accumulation pattern' },
        { name: 'Narrative Rider', why: 'Best suited for mid-term structure confirmation' },
      ],
    }
  }
};

// Alert types configuration
const alertTypes = [
  {
    id: 'structure_break',
    name: 'Structure Break',
    description: 'Alert when token structure fundamentals change',
    triggers: [
      'Smart money holdings decrease >5%',
      'Net flow turns negative for 3+ days',
      'Pressure flips from Buy to Sell dominance'
    ],
    icon: AlertTriangle
  },
  {
    id: 'divergence',
    name: 'Divergence',
    description: 'Alert when flow and price move in opposite directions',
    triggers: [
      'Net Flow ↑ but Price ↓ (Absorption)',
      'Net Flow ↓ but Price ↑ (Distribution risk)',
      'Divergence persists for 24+ hours'
    ],
    icon: TrendingDown
  },
  {
    id: 'market_misalignment',
    name: 'Market Misalignment',
    description: 'Alert when token no longer matches Market regime',
    triggers: [
      'Token structure becomes Bearish while Market is Risk-On',
      'Major cohort behavior contradicts Market signal',
      'Confidence drops below Medium'
    ],
    icon: Activity
  }
];

// Strategy logic data
const strategyLogic = {
  'Smart Money Follow': {
    description: 'Follow institutional and smart money accumulation patterns',
    entryConditions: [
      'Smart money holdings increasing >3% over 7 days',
      'Institutional & Whale cohorts actively buying',
      'Structure confirmed for 5+ days',
      'Market regime aligned (Risk-On preferred)'
    ],
    invalidation: [
      'Smart money holdings decrease >2%',
      'Whale cohort flips to Sell',
      'Structure breaks (becomes Bearish)',
      'Market regime shifts to Risk-Off'
    ],
    typicalDuration: '1–3 weeks (mid-term)',
    riskLevel: 'Medium',
    bestFor: 'Following institutional trends with 2–4 week horizon'
  },
  'Narrative Rider': {
    description: 'Ride narrative-driven moves with structural confirmation',
    entryConditions: [
      'Token part of confirmed narrative (Early/Confirmed stage)',
      'Structure supports narrative (Supportive/Bullish)',
      'Bridge flow or LP activity increasing',
      'Retail interest growing but not dominant'
    ],
    invalidation: [
      'Narrative shifts to Crowded stage',
      'Structure turns Bearish',
      'Retail dominance >40%',
      'Price significantly above structure support'
    ],
    typicalDuration: '1–2 weeks (narrative lifecycle dependent)',
    riskLevel: 'Medium-High',
    bestFor: 'Narrative-based trades with structural validation'
  }
};

export default function TokensPage() {
  const [selectedToken, setSelectedToken] = useState('eth');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChange, setSelectedChange] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showStrategyModal, setShowStrategyModal] = useState(null);
  
  const token = tokenData[selectedToken] || tokenData.eth;
  const filteredTokens = topTokens.filter(t => 
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingUp className="w-3.5 h-3.5" />;
    if (trend === 'declining') return <TrendingDown className="w-3.5 h-3.5" />;
    return <span className="text-xs">↔</span>;
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        <Header />
      
      {/* Token Selector */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="px-4 py-2">
          <div className="flex items-center gap-3">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-40"
              inputClassName="py-1.5 text-sm"
              testId="tokens-search-input"
            />
            <div className="flex items-center gap-1 overflow-x-auto">
              {filteredTokens.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedToken(t.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedToken === t.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t.symbol}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Token Header with Actions */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 text-sm mb-1">
              <span className="text-lg font-bold text-gray-900">{token.symbol}</span>
              <span className="text-gray-300">|</span>
              <span className="font-semibold text-gray-700">${token.price.toLocaleString()}</span>
              <span className="text-gray-500">{token.change >= 0 ? '+' : ''}{token.change}%</span>
            </div>
            <div className="text-xs text-gray-500">
              Market Signal: <span className="font-semibold text-gray-700">{token.marketSignal.type} ({token.marketSignal.confidence}%)</span>
              <span className="mx-2">→</span>
              <span className="font-medium text-gray-700">Structure {token.intelligence.marketAlignment.toLowerCase()}</span>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/watchlist"
                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Add to Watchlist</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/alerts"
                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Create Alert</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-3">
        
        {/* 🔥 TOKEN INTELLIGENCE — HERO */}
        <div className="bg-gray-900 text-white rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Token Intelligence</div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">{token.intelligence.structureStatus}</span>
                <span className="px-2 py-1 bg-white/10 rounded-lg text-xs font-medium">
                  {token.intelligence.marketAlignment}
                </span>
                {/* Micro-indicator */}
                <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-300">
                  {getTrendIcon(token.intelligence.trend)}
                  {token.intelligence.trend}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Confidence</div>
              <div className="text-lg font-bold">{token.intelligence.confidence}</div>
            </div>
          </div>

          {/* 🔥 MARKET ALIGNMENT — NEW! */}
          <div className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Market Alignment</div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Fully aligned with current Market regime (Risk-On)</span>
            </div>
          </div>
          
          {/* Divider with timeline hint */}
          <div className="flex items-center gap-3 py-2 mb-3 border-y border-white/10">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-400">
              Confirmed for <span className="text-white font-medium">{token.intelligence.confirmedDays} days</span>
              <span className="mx-2">•</span>
              Expected duration: <span className="text-white font-medium">{token.intelligence.duration}</span>
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-400 mb-2">Primary Drivers</div>
              {token.intelligence.primaryDrivers.map((driver, i) => (
                <div key={i} className="flex items-center gap-2 text-sm mb-1">
                  <Check className="w-3.5 h-3.5 text-gray-400" />
                  <span>{driver}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-2">Primary Risk</div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-300">{token.intelligence.primaryRisk}</span>
              </div>
            </div>
          </div>
          
          {/* CTAs */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            <button 
              onClick={() => setShowAlertModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-white text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              Create Token Alert
            </button>
            <Link to="/entities" className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
              <Building className="w-4 h-4" />
              View Entities
            </Link>
            <Link to="/alerts" className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
              <Eye className="w-4 h-4" />
              Track Structure
            </Link>
          </div>
        </div>

        {/* Two Columns */}
        <div className="flex gap-3">
          
          {/* LEFT COLUMN (60%) */}
          <div className="w-[60%] space-y-3">
            
            {/* Flow → Price Confirmation Panel */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-500" />
                  Flow → Price Confirmation
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1 p-0.5 hover:bg-gray-100 rounded">
                        <Info className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white max-w-xs">
                      <p>Shows whether on-chain capital movement (net flow) supports price action. Helps identify accumulation, absorption, or distribution patterns.</p>
                    </TooltipContent>
                  </Tooltip>
                </h3>
                <div className="text-xs text-gray-500">7D</div>
              </div>
              
              {/* Confirmation States */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <Check className="w-4 h-4 text-gray-700" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Accumulation Confirmed</div>
                    <div className="text-xs text-gray-500">Net Flow ↑ + Price ↑</div>
                  </div>
                  <div className="text-xs font-semibold text-gray-700 px-2 py-1 bg-white rounded">Active</div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg opacity-40">
                  <AlertTriangle className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500">Absorption</div>
                    <div className="text-xs text-gray-400">Net Flow ↑ + Price ↓</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg opacity-40">
                  <AlertTriangle className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500">Distribution Risk</div>
                    <div className="text-xs text-gray-400">Net Flow ↓ + Price ↑</div>
                  </div>
                </div>
              </div>
              
              {/* Interpretation */}
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">Flow supports price:</span> Capital inflow aligned with price increase — healthy accumulation pattern over past week.
                </div>
              </div>
            </div>
            
            {/* Holder Composition */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Holder Composition
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1 p-0.5 hover:bg-gray-100 rounded">
                        <Info className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white max-w-xs">
                      <p>Breakdown of who holds this token: CEX, Smart Money, Funds, Retail. Strong Hands are holders with {">"}30 day holding duration.</p>
                    </TooltipContent>
                  </Tooltip>
                </h3>
                <Link to="/entities" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  View Activity <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2">
                <div>
                  <div className="text-xs text-gray-500">Strong Hands ({">"}30d)</div>
                  <div className="text-lg font-bold text-gray-900">{token.holders.strongHands}%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Trend</div>
                  <div className="text-sm font-semibold text-gray-700">{token.holders.trend}</div>
                </div>
              </div>
              
              <div className="space-y-0.5 mb-2">
                {token.holders.composition.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="text-gray-600">{item.type}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{item.pct}%</span>
                      <span className={`text-xs w-10 text-right font-medium ${item.change >= 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Structure Insight */}
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-0.5">Structure Insight:</div>
                <div className="text-xs text-gray-700 font-medium">
                  {token.holders.interpretation}
                </div>
              </div>
            </div>

            {/* Supply Flow */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <ArrowRightLeft className="w-4 h-4 text-gray-500" />
                Supply Flow Map
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1 p-0.5 hover:bg-gray-100 rounded">
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white max-w-xs">
                    <p>Where tokens are flowing: Mint/Burn (supply changes), LP Flow (into/out of liquidity pools), Bridge Flow (cross-chain movement).</p>
                  </TooltipContent>
                </Tooltip>
              </h3>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="p-2 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-0.5">Mint/Burn</div>
                  <div className="text-sm font-bold text-gray-900">{token.supplyFlow.mintBurn.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-0.5">ETH</div>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-0.5">LP Flow</div>
                  <div className="text-sm font-bold text-gray-900">+${(token.supplyFlow.lpFlow / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-gray-400 mt-0.5">Into pools</div>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-0.5">Bridge Flow</div>
                  <div className="text-sm font-bold text-gray-900">+${(token.supplyFlow.bridgeFlow / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-gray-400 mt-0.5">Cross-chain</div>
                </div>
              </div>
              
              {/* Supply Impact */}
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-0.5">Supply Impact:</div>
                <div className="text-xs text-gray-700 font-medium">
                  {token.supplyFlow.netEffect}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (40%) */}
          <div className="w-[40%] space-y-3">
            
            {/* Recent Changes — CLICKABLE */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                Recent Changes (7D)
              </h3>
              
              <div className="space-y-1">
                {token.recentChanges.map((change, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedChange(change)}
                    className="w-full flex items-center gap-2 p-2 -mx-2 rounded-lg hover:bg-white transition-colors text-left group"
                  >
                    {change.type === 'up' ? (
                      <ArrowUp className="w-3.5 h-3.5 text-gray-600" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700 flex-1">{change.metric}</span>
                    <span className="text-sm font-semibold text-gray-900">{change.value}</span>
                    <Info className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Market Pressure by Cohort */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-gray-500" />
                Market Pressure by Cohort
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1 p-0.5 hover:bg-gray-100 rounded">
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white max-w-xs">
                    <p>Shows which cohorts (Retail, Pro, Institutional, Whale) are buying vs selling. Helps identify dominant market participants.</p>
                  </TooltipContent>
                </Tooltip>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 w-16 font-medium">Retail</span>
                  <div className="flex-1 mx-3 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-500" style={{ width: '25%' }}></div>
                  </div>
                  <span className="font-semibold text-gray-500 w-12 text-right">Sell</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 w-16 font-medium">Pro</span>
                  <div className="flex-1 mx-3 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '75%' }}></div>
                  </div>
                  <span className="font-semibold text-gray-900 w-12 text-right">Buy</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 w-16 font-medium">Inst.</span>
                  <div className="flex-1 mx-3 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600" style={{ width: '85%' }}></div>
                  </div>
                  <span className="font-semibold text-gray-900 w-12 text-right">Buy</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 w-16 font-medium">Whale</span>
                  <div className="flex-1 mx-3 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: '90%' }}></div>
                  </div>
                  <span className="font-semibold text-gray-900 w-12 text-right">Buy</span>
                </div>
              </div>
              
              {/* Interpretation */}
              <div className="pt-4 border-t border-gray-100 mt-5">
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">Dominant cohort:</span> Institutional & Whale buying while Retail reduces exposure — confirms strong structure.
                </div>
              </div>
            </div>

            {/* Trade Size Breakdown — ENHANCED CLICK */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-gray-500" />
                Trade Size Breakdown
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1 p-0.5 hover:bg-gray-100 rounded">
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white max-w-xs">
                    <p>Breakdown of trading activity by trade size. Click any cohort to see detailed flow data, entities, and average hold time.</p>
                  </TooltipContent>
                </Tooltip>
              </h3>
              
              {/* Dominant Cohort */}
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-0.5">Dominant Support:</div>
                <div className="text-xs font-semibold text-gray-900">Institutional & Whale (net +$82M)</div>
              </div>
              
              <div className="space-y-1">
                {token.tradeSize.map((item, i) => {
                  // Define icons
                  const cohortIcon = {
                    'Retail': '🐟',
                    'Active': '🐠', 
                    'Pro': '🐬',
                    'Inst.': '🐋',
                    'Whale': '🐳'
                  };
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedTrade(item)}
                      className="w-full flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{cohortIcon[item.size]}</span>
                        <span className="text-sm font-medium text-gray-700">{item.size}</span>
                        <span className="text-xs text-gray-400">{item.range}</span>
                        <ExternalLink className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100" />
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        item.action === 'Buy' ? 'bg-gray-100 text-gray-800' :
                        item.action === 'Sell' ? 'bg-gray-100 text-gray-500' :
                        'bg-gray-50 text-gray-400'
                      }`}>
                        {item.action}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Strategies — Full Width Bottom Block */}
        <div className="bg-gray-900 text-white rounded-2xl p-5 mt-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-gray-400" />
            Suggested Strategies
            <span className="text-xs text-gray-500">(Read-only)</span>
          </h3>
          
          <div className="text-xs text-gray-400 mb-4">
            Based on: {token.suggestedStrategies.reasons.join(' • ')}
          </div>
          
          {/* Two strategies in horizontal layout */}
          <div className="grid grid-cols-2 gap-4">
            {token.suggestedStrategies.strategies.map((strategy, i) => (
              <div key={i} className="p-4 bg-white/10 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{strategy.name}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-300">Active</span>
                </div>
                
                <div className="text-xs text-gray-400 mb-3">{strategy.why}</div>
                
                {/* Trigger conditions */}
                <div className="pt-3 border-t border-white/10">
                  <div className="text-xs text-gray-500 mb-2">Trigger Conditions:</div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Check className="w-3 h-3 text-gray-500" />
                    <span>Smart money accumulation confirmed</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Check className="w-3 h-3 text-gray-500" />
                    <span>Structure duration: mid-term (1–3 weeks)</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowStrategyModal(strategy.name)}
                  className="mt-3 text-xs text-gray-400 hover:text-white underline"
                >
                  View strategy logic →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Change Modal */}
      {selectedChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedChange(null)}>
          <div className="bg-white rounded-2xl p-5 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {selectedChange.type === 'up' ? (
                  <ArrowUp className="w-5 h-5 text-gray-700" />
                ) : (
                  <ArrowDown className="w-5 h-5 text-gray-500" />
                )}
                <h3 className="text-lg font-bold text-gray-900">{selectedChange.metric}</h3>
              </div>
              <button onClick={() => setSelectedChange(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">What changed?</div>
                <p className="text-sm text-gray-700">{selectedChange.what}</p>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Why it matters</div>
                <p className="text-sm text-gray-700">{selectedChange.why}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">{selectedChange.time}</span>
                <span className="text-lg font-bold text-gray-900">{selectedChange.value}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trade Size Modal */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTrade(null)}>
          <div className="bg-white rounded-2xl p-5 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedTrade.size}</h3>
                <p className="text-sm text-gray-500">{selectedTrade.range}</p>
              </div>
              <button onClick={() => setSelectedTrade(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Entities</span>
                <span className="text-sm font-semibold text-gray-900">{selectedTrade.entities}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Net Flow</span>
                <span className="text-sm font-semibold text-gray-900">{selectedTrade.netFlow}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Avg Hold Time</span>
                <span className="text-sm font-semibold text-gray-900">{selectedTrade.avgHold}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                selectedTrade.action === 'Buy' ? 'bg-gray-100 text-gray-800' :
                selectedTrade.action === 'Sell' ? 'bg-gray-100 text-gray-500' :
                'bg-gray-50 text-gray-400'
              }`}>
                {selectedTrade.action}
              </span>
              <Link 
                to={selectedTrade.link} 
                onClick={() => setSelectedTrade(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800"
              >
                View All <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Create Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAlertModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Create Token Alert for {token.symbol}</h3>
              </div>
              <button onClick={() => setShowAlertModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Choose an alert type to monitor {token.symbol} structure changes
            </p>
            
            <div className="space-y-3">
              {alertTypes.map((alert) => {
                const Icon = alert.icon;
                return (
                  <div key={alert.id} className="p-4 border border-gray-200 rounded-xl hover:border-gray-900 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-900 transition-colors">
                        <Icon className="w-5 h-5 text-gray-600 group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{alert.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                        <div className="text-xs text-gray-500">
                          <div className="font-medium mb-1">Triggers when:</div>
                          <ul className="space-y-0.5">
                            {alert.triggers.map((trigger, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-gray-400">•</span>
                                <span>{trigger}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <span className="font-medium">Note:</span> Alerts are UI-level only. Backend implementation coming soon.
            </div>
          </div>
        </div>
      )}

      {/* Strategy Logic Modal */}
      {showStrategyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowStrategyModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">{showStrategyModal} — Strategy Logic</h3>
              </div>
              <button onClick={() => setShowStrategyModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {strategyLogic[showStrategyModal] && (
              <div className="space-y-5">
                {/* Description */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</div>
                  <p className="text-sm text-gray-900">{strategyLogic[showStrategyModal].description}</p>
                </div>
                
                {/* Entry Conditions */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="w-5 h-5 text-gray-700" />
                    <h4 className="font-semibold text-gray-900">Entry Conditions</h4>
                  </div>
                  <div className="space-y-2 pl-7">
                    {strategyLogic[showStrategyModal].entryConditions.map((condition, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Invalidation */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-gray-700" />
                    <h4 className="font-semibold text-gray-900">Invalidation (Exit Signals)</h4>
                  </div>
                  <div className="space-y-2 pl-7">
                    {strategyLogic[showStrategyModal].invalidation.map((condition, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Bottom Info */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Typical Duration</div>
                    <div className="text-sm font-semibold text-gray-900">{strategyLogic[showStrategyModal].typicalDuration}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Risk Level</div>
                    <div className="text-sm font-semibold text-gray-900">{strategyLogic[showStrategyModal].riskLevel}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Best For</div>
                    <div className="text-xs text-gray-700">{strategyLogic[showStrategyModal].bestFor}</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <span className="font-medium">Note:</span> Strategy logic is read-only documentation. Automated execution not yet available.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
}
