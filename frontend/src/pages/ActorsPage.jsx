import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, Bell, Filter, TrendingUp, TrendingDown, 
  ArrowUpRight, ChevronDown, X, Users, Zap, Target, Clock,
  ArrowUpDown, Activity, Globe, Gauge, Eye, EyeOff, Crown
} from 'lucide-react';
import Header from '../components/Header';
import SearchInput from '../components/shared/SearchInput';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

// Chain icons/colors
const chainConfig = {
  'ETH': { color: 'bg-blue-500', label: 'Ethereum' },
  'SOL': { color: 'bg-purple-500', label: 'Solana' },
  'BASE': { color: 'bg-blue-600', label: 'Base' },
  'ARB': { color: 'bg-sky-500', label: 'Arbitrum' },
  'OP': { color: 'bg-red-500', label: 'Optimism' },
};

// Edge Score color helper
const getEdgeScoreColor = (score) => {
  if (score >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-red-500 bg-red-50 border-red-200';
};

// ETAP 4: Influence Role calculation
// Leader: has more followers than leads, and followers_count is significant
// Follower: follows more actors than has followers
// Neutral: balanced or low activity
const getInfluenceRole = (actor) => {
  const { followers_count = 0, leads_count = 0, follows_count = 0 } = actor;
  
  // Calculate ratios
  const leadsRatio = follows_count > 0 ? leads_count / follows_count : leads_count;
  const followsRatio = leads_count > 0 ? follows_count / leads_count : follows_count;
  
  // Adaptive thresholds (based on actor data)
  const significantFollowers = 3; // X threshold
  const significantFollows = 2;   // Y threshold
  
  if (followers_count >= significantFollowers && leadsRatio > 1.2) {
    return 'Leader';
  }
  if (follows_count >= significantFollows && followsRatio > 1.2) {
    return 'Follower';
  }
  return 'Neutral';
};

// Influence Role badge config
const influenceRoleConfig = {
  'Leader': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🟢' },
  'Follower': { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🟡' },
  'Neutral': { bg: 'bg-gray-100', text: 'text-gray-600', icon: '⚪' },
};

// Mock actors data with HYBRID identity + INFLUENCE metrics (ETAP 4)
const actorsData = [
  {
    id: 'vitalik',
    real_name: 'Vitalik.eth',
    strategy_name: 'L2 Infrastructure Builder',
    identity_confidence: 0.95,
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    type: 'Whale',
    avatar: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    confidence: 'high',
    pnl: '+$549K',
    winRate: 66.8,
    riskScore: 12,
    strategies: ['Smart Money', 'DEX Heavy', 'Alpha Hunter'],
    currentBehavior: 'Accumulating',
    behaviorTrend: 'Stable → Bullish',
    tokens: ['ETH', 'L2', 'AI'],
    clusterSize: 4,
    lastAction: { type: 'BUY', token: 'ARB', time: '2h ago', size: '$45K' },
    primaryChain: 'ETH',
    latency: 'Early',
    hasActiveSignals: true,
    signalsCount: 3,
    lastActivityTime: Date.now() - 2 * 60 * 60 * 1000,
    edgeScore: 78,
    // ETAP 4: Influence metrics
    influenceScore: 72,
    followers_count: 4,      // Actors that follow this one
    leads_count: 1,          // Actors this one front-runs
    follows_count: 1,        // Actors this one follows
    avgFollowerLag: 5.8,     // Average hours followers lag behind
    consistency: 0.78,       // Pattern consistency (0-1)
  },
  {
    id: 'alameda',
    real_name: 'Alameda Research',
    strategy_name: 'SOL Ecosystem Accumulator',
    identity_confidence: 0.92,
    address: '0x28C6c06298d514Db089934071355E5743bf21d60',
    type: 'Fund',
    avatar: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
    confidence: 'high',
    pnl: '+$2.4M',
    winRate: 71.2,
    riskScore: 8,
    strategies: ['Accumulator', 'Momentum', 'Narrative Rider'],
    currentBehavior: 'Rotating',
    behaviorTrend: 'Active trading',
    tokens: ['SOL', 'BTC', 'DeFi'],
    clusterSize: 12,
    lastAction: { type: 'SWAP', token: 'SOL→USDC', time: '45m ago', size: '$890K' },
    primaryChain: 'SOL',
    latency: 'Early',
    hasActiveSignals: true,
    signalsCount: 5,
    lastActivityTime: Date.now() - 45 * 60 * 1000,
    edgeScore: 86,
    // ETAP 4: Influence metrics - HIGH LEADER
    influenceScore: 89,
    followers_count: 6,
    leads_count: 2,
    follows_count: 1,
    avgFollowerLag: 4.5,
    consistency: 0.85,
  },
  {
    id: 'dwf-labs',
    real_name: 'DWF Labs',
    strategy_name: 'Meme Momentum Rider',
    identity_confidence: 0.88,
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    type: 'Fund',
    avatar: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/89.png',
    confidence: 'medium',
    pnl: '+$890K',
    winRate: 58.4,
    riskScore: 34,
    strategies: ['Market Maker', 'Early DEX', 'Momentum'],
    currentBehavior: 'Adding',
    behaviorTrend: 'Bullish bias',
    tokens: ['Meme', 'AI', 'Gaming'],
    clusterSize: 8,
    lastAction: { type: 'BUY', token: 'PEPE', time: '4h ago', size: '$120K' },
    primaryChain: 'ETH',
    latency: 'Medium',
    hasActiveSignals: true,
    signalsCount: 2,
    lastActivityTime: Date.now() - 4 * 60 * 60 * 1000,
    edgeScore: 52,
    // ETAP 4: Influence metrics - FOLLOWER
    influenceScore: 38,
    followers_count: 1,
    leads_count: 0,
    follows_count: 3,
    avgFollowerLag: 2.1,
    consistency: 0.52,
  },
  {
    id: 'a16z',
    real_name: 'a16z Crypto',
    strategy_name: 'Institutional Infrastructure Play',
    identity_confidence: 0.97,
    address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
    type: 'Fund',
    avatar: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    confidence: 'high',
    pnl: '+$4.2M',
    winRate: 74.5,
    riskScore: 5,
    strategies: ['Smart Money', 'Long-term', 'Infrastructure'],
    currentBehavior: 'Accumulating',
    behaviorTrend: 'Stable',
    tokens: ['ETH', 'L2', 'Infra'],
    clusterSize: 15,
    lastAction: { type: 'BUY', token: 'OP', time: '1d ago', size: '$2.1M' },
    primaryChain: 'ETH',
    latency: 'Early',
    hasActiveSignals: false,
    signalsCount: 0,
    lastActivityTime: Date.now() - 24 * 60 * 60 * 1000,
    edgeScore: 91,
    // ETAP 4: Influence metrics - TOP LEADER
    influenceScore: 94,
    followers_count: 5,
    leads_count: 3,
    follows_count: 0,
    avgFollowerLag: 6.2,
    consistency: 0.91,
  },
  {
    id: 'jump-trading',
    real_name: 'Jump Trading',
    strategy_name: 'HFT Arbitrage Engine',
    identity_confidence: 0.85,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    type: 'Trader',
    avatar: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    confidence: 'medium',
    pnl: '+$1.1M',
    winRate: 62.3,
    riskScore: 28,
    strategies: ['HFT', 'Arbitrage', 'DEX Heavy'],
    currentBehavior: 'Distributing',
    behaviorTrend: 'Risk-off',
    tokens: ['BTC', 'ETH', 'Stables'],
    clusterSize: 23,
    lastAction: { type: 'SELL', token: 'ETH', time: '30m ago', size: '$340K' },
    primaryChain: 'ETH',
    latency: 'Late',
    hasActiveSignals: true,
    signalsCount: 1,
    lastActivityTime: Date.now() - 30 * 60 * 1000,
    edgeScore: 28,
    // ETAP 4: Influence metrics - NEUTRAL (HFT, not directional leader)
    influenceScore: 45,
    followers_count: 2,
    leads_count: 2,
    follows_count: 2,
    avgFollowerLag: 1.2,
    consistency: 0.62,
  },
  {
    id: 'unknown-whale-1',
    real_name: 'Smart Whale #4721',
    strategy_name: 'High-Risk Flip Trader',
    identity_confidence: 0.32,
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    type: 'Whale',
    avatar: null,
    confidence: 'low',
    pnl: '-$124K',
    winRate: 41.2,
    riskScore: 67,
    strategies: ['Momentum', 'Quick Flips'],
    currentBehavior: 'Exiting',
    behaviorTrend: 'Bearish',
    tokens: ['Meme', 'Shitcoins'],
    clusterSize: 2,
    lastAction: { type: 'SELL', token: 'BONK', time: '15m ago', size: '$89K' },
    primaryChain: 'SOL',
    latency: 'Late',
    hasActiveSignals: false,
    signalsCount: 0,
    lastActivityTime: Date.now() - 15 * 60 * 1000,
    edgeScore: 15,
    // ETAP 4: Influence metrics - PURE FOLLOWER
    influenceScore: 18,
    followers_count: 0,
    leads_count: 0,
    follows_count: 4,
    avgFollowerLag: 0,
    consistency: 0.28,
  },
  {
    id: 'pantera',
    real_name: 'Pantera Capital',
    strategy_name: 'AI Narrative Accumulator',
    identity_confidence: 0.94,
    address: '0x9876543210fedcba9876543210fedcba98765432',
    type: 'Fund',
    avatar: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
    confidence: 'high',
    pnl: '+$3.8M',
    winRate: 69.1,
    riskScore: 11,
    strategies: ['Smart Money', 'Narrative Rider', 'Early DEX'],
    currentBehavior: 'Accumulating',
    behaviorTrend: 'Bullish',
    tokens: ['AI', 'DeFi', 'L2'],
    clusterSize: 9,
    lastAction: { type: 'BUY', token: 'TAO', time: '6h ago', size: '$1.2M' },
    primaryChain: 'ETH',
    latency: 'Early',
    hasActiveSignals: true,
    signalsCount: 4,
    lastActivityTime: Date.now() - 6 * 60 * 60 * 1000,
    edgeScore: 84,
    // ETAP 4: Influence metrics - STRONG LEADER
    influenceScore: 86,
    followers_count: 5,
    leads_count: 2,
    follows_count: 1,
    avgFollowerLag: 4.8,
    consistency: 0.82,
  },
  {
    id: 'wintermute',
    real_name: 'Wintermute',
    strategy_name: 'DeFi Yield Optimizer',
    identity_confidence: 0.87,
    address: '0xfedcba0987654321fedcba0987654321fedcba09',
    type: 'Trader',
    avatar: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
    confidence: 'medium',
    pnl: '+$567K',
    winRate: 55.8,
    riskScore: 22,
    strategies: ['Market Maker', 'Arbitrage', 'LP / Yield'],
    currentBehavior: 'Rotating',
    behaviorTrend: 'Neutral',
    tokens: ['ETH', 'Stables', 'DeFi'],
    clusterSize: 31,
    lastAction: { type: 'BRIDGE', token: 'ETH→BASE', time: '1h ago', size: '$780K' },
    primaryChain: 'ETH',
    latency: 'Medium',
    hasActiveSignals: false,
    signalsCount: 0,
    lastActivityTime: Date.now() - 60 * 60 * 1000,
    edgeScore: 45,
    // ETAP 4: Influence metrics - NEUTRAL (MM, not directional)
    influenceScore: 52,
    followers_count: 1,
    leads_count: 1,
    follows_count: 1,
    avgFollowerLag: 3.2,
    consistency: 0.58,
  },
];

// Filter options
const strategyFilters = ['Accumulator', 'Smart Money', 'Momentum', 'Early DEX', 'Narrative Rider', 'LP / Yield', 'HFT', 'Arbitrage'];
const riskFilters = ['Low', 'Medium', 'High'];
const latencyFilters = ['Early', 'Medium', 'Late'];

// Sort options - Edge Score first as default, ETAP 4 adds Influence
const sortOptions = [
  { value: 'edgeScore', label: 'Edge Score' },
  { value: 'influence', label: 'Influence' },
  { value: 'activity', label: 'Newest activity' },
  { value: 'pnl', label: 'PnL (highest)' },
  { value: 'winRate', label: 'Win rate' },
  { value: 'risk', label: 'Risk (lowest)' },
  { value: 'signals', label: 'Active signals' },
];

// Confidence colors
const confidenceColors = {
  high: { bg: 'bg-[#16C784]', text: 'text-[#16C784]', label: 'High Confidence' },
  medium: { bg: 'bg-[#F5A524]', text: 'text-[#F5A524]', label: 'Medium Confidence' },
  low: { bg: 'bg-[#EF4444]', text: 'text-[#EF4444]', label: 'Low Confidence' },
};

// Latency colors
const latencyColors = {
  'Early': 'bg-emerald-100 text-emerald-700',
  'Medium': 'bg-amber-100 text-amber-700',
  'Late': 'bg-red-100 text-red-700',
};

// Type badge colors
const typeBadgeColors = {
  'Fund': 'bg-blue-100 text-blue-700',
  'Trader': 'bg-purple-100 text-purple-700',
  'Whale': 'bg-orange-100 text-orange-700',
  'Cluster': 'bg-gray-100 text-gray-700',
};

// Action type colors
const actionColors = {
  'BUY': 'text-emerald-600',
  'SELL': 'text-red-500',
  'SWAP': 'text-blue-600',
  'BRIDGE': 'text-purple-600',
};

// Actor Card Component - Enhanced with Edge Score and HYBRID identity
const ActorCard = ({ actor, isFollowed, onToggleFollow, showRealNames }) => {
  const confidence = confidenceColors[actor.confidence];
  const chain = chainConfig[actor.primaryChain] || { color: 'bg-gray-500', label: actor.primaryChain };
  const edgeColor = getEdgeScoreColor(actor.edgeScore);
  
  // HYBRID identity: show strategy_name by default, real_name when toggle is on
  const displayName = showRealNames ? actor.real_name : actor.strategy_name;
  const secondaryName = showRealNames ? actor.strategy_name : (actor.identity_confidence >= 0.8 ? actor.real_name : null);
  
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-400 transition-all group h-full flex flex-col">
      {/* Edge Score strip instead of confidence */}
      <div className={`h-1 ${actor.edgeScore >= 75 ? 'bg-emerald-500' : actor.edgeScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
      
      <div className="p-4 flex flex-col flex-1">
        {/* Header with Edge Score badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
              {actor.avatar ? (
                <img src={actor.avatar} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <Users className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">{displayName}</div>
              {/* Show secondary name as hint */}
              {secondaryName && (
                <div className="text-xs text-gray-400 truncate max-w-[140px]">{secondaryName}</div>
              )}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${typeBadgeColors[actor.type]}`}>
                  {actor.type}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{actor.clusterSize} wallets</span>
              </div>
            </div>
          </div>
          {/* EDGE SCORE BADGE */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`px-2 py-1 rounded-lg border text-sm font-bold ${edgeColor}`}>
                {actor.edgeScore}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white max-w-xs">
              <p className="text-xs font-semibold mb-1">Edge Score: {actor.edgeScore}/100</p>
              <p className="text-xs text-gray-300">Timing (30%) + ROI Adjusted (25%) + Stability (20%) + Risk (15%) + Signals (10%)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Latency + Chain row */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${latencyColors[actor.latency]}`}>
            {actor.latency}
          </span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${chain.color}`} />
            <span className="text-xs text-gray-500">{chain.label}</span>
          </div>
        </div>

        {/* Last Action */}
        <div className="mb-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-gray-400" />
            <span className={`text-xs font-semibold ${actionColors[actor.lastAction.type]}`}>
              {actor.lastAction.type}
            </span>
            <span className="text-xs text-gray-900 font-medium">{actor.lastAction.token}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{actor.lastAction.size}</span>
            <span className="text-xs text-gray-400">{actor.lastAction.time}</span>
          </div>
        </div>

        {/* Core Metrics - exactly 3 */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-0.5">PnL</div>
            <div className={`text-sm font-bold ${actor.pnl.startsWith('+') ? 'text-[#16C784]' : 'text-[#EF4444]'}`}>
              {actor.pnl}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-0.5">Win</div>
            <div className="text-sm font-bold text-gray-900">{actor.winRate}%</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-0.5">Risk</div>
            <div className={`text-sm font-bold ${
              actor.riskScore < 30 ? 'text-[#16C784]' : 
              actor.riskScore < 60 ? 'text-[#F5A524]' : 'text-[#EF4444]'
            }`}>
              {actor.riskScore}
            </div>
          </div>
        </div>

        {/* Strategy fingerprint - max 3 chips */}
        <div className="flex flex-wrap gap-1 mb-3">
          {actor.strategies.slice(0, 3).map((strategy, i) => (
            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
              {strategy}
            </span>
          ))}
          {actor.strategies.length > 3 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-xs">
                  +{actor.strategies.length - 3}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 text-white">
                <p className="text-xs">{actor.strategies.slice(3).join(', ')}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Behavior state + Primary chain */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div>
            <span className="text-gray-500">Current: </span>
            <span className="font-semibold text-gray-900">{actor.currentBehavior}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${chain.color}`} />
            <span className="text-gray-500">{chain.label}</span>
          </div>
        </div>

        {/* Signals indicator */}
        {actor.hasActiveSignals && (
          <div className="mb-3 flex items-center gap-2 text-xs">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-600 font-medium">{actor.signalsCount} active signals</span>
          </div>
        )}

        {/* Actions - pushed to bottom */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
          <Link 
            to={`/actors/${actor.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors"
          >
            View Actor
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => onToggleFollow(actor.id)}
            className={`p-2 rounded-xl transition-colors ${
              isFollowed 
                ? 'bg-amber-100 text-amber-600' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Star className={`w-4 h-4 ${isFollowed ? 'fill-current' : ''}`} />
          </button>
          <Link
            to="/alerts"
            className="p-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ActorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [followedOnly, setFollowedOnly] = useState(false);
  const [activeSignalsOnly, setActiveSignalsOnly] = useState(false);
  const [earlyOnly, setEarlyOnly] = useState(false);
  const [followedActors, setFollowedActors] = useState(['alameda', 'a16z']);
  const [sortBy, setSortBy] = useState('edgeScore');
  
  // HYBRID Identity Toggle: Default = Strategy names (anonymized)
  const [showRealNames, setShowRealNames] = useState(false);
  
  // Filters state
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState([]);
  const [selectedLatency, setSelectedLatency] = useState([]);
  const [minWinRate, setMinWinRate] = useState(0);
  const [pnlPositiveOnly, setPnlPositiveOnly] = useState(false);

  const toggleFollow = (actorId) => {
    setFollowedActors(prev => 
      prev.includes(actorId) 
        ? prev.filter(id => id !== actorId)
        : [...prev, actorId]
    );
  };

  const toggleStrategy = (strategy) => {
    setSelectedStrategies(prev =>
      prev.includes(strategy)
        ? prev.filter(s => s !== strategy)
        : [...prev, strategy]
    );
  };

  const toggleRisk = (risk) => {
    setSelectedRisk(prev =>
      prev.includes(risk)
        ? prev.filter(r => r !== risk)
        : [...prev, risk]
    );
  };

  // Filter and sort actors
  const filteredActors = useMemo(() => {
    let result = actorsData.filter(actor => {
      // Search - now searches both real_name and strategy_name
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesRealName = actor.real_name.toLowerCase().includes(query);
        const matchesStrategyName = actor.strategy_name.toLowerCase().includes(query);
        const matchesStrategy = actor.strategies.some(s => s.toLowerCase().includes(query));
        const matchesToken = actor.tokens.some(t => t.toLowerCase().includes(query));
        const matchesType = actor.type.toLowerCase().includes(query);
        const matchesAddress = actor.address.toLowerCase().includes(query);
        if (!matchesRealName && !matchesStrategyName && !matchesStrategy && !matchesToken && !matchesType && !matchesAddress) return false;
      }

      // Followed only
      if (followedOnly && !followedActors.includes(actor.id)) return false;

      // Active signals only
      if (activeSignalsOnly && !actor.hasActiveSignals) return false;

      // Early only
      if (earlyOnly && actor.latency !== 'Early') return false;

      // Strategy filter
      if (selectedStrategies.length > 0) {
        if (!actor.strategies.some(s => selectedStrategies.includes(s))) return false;
      }

      // Risk filter
      if (selectedRisk.length > 0) {
        const riskLevel = actor.riskScore < 30 ? 'Low' : actor.riskScore < 60 ? 'Medium' : 'High';
        if (!selectedRisk.includes(riskLevel)) return false;
      }

      // Latency filter
      if (selectedLatency.length > 0) {
        if (!selectedLatency.includes(actor.latency)) return false;
      }

      // Win rate filter
      if (minWinRate > 0 && actor.winRate < minWinRate) return false;

      // PnL positive only
      if (pnlPositiveOnly && !actor.pnl.startsWith('+')) return false;

      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'edgeScore':
          return b.edgeScore - a.edgeScore;
        case 'influence':
          return (b.influenceScore || 0) - (a.influenceScore || 0);
        case 'activity':
          return a.lastActivityTime - b.lastActivityTime;
        case 'pnl':
          const pnlA = parseFloat(a.pnl.replace(/[^0-9.-]/g, ''));
          const pnlB = parseFloat(b.pnl.replace(/[^0-9.-]/g, ''));
          return pnlB - pnlA;
        case 'winRate':
          return b.winRate - a.winRate;
        case 'risk':
          return a.riskScore - b.riskScore;
        case 'signals':
          return b.signalsCount - a.signalsCount;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, followedOnly, followedActors, selectedStrategies, selectedRisk, selectedLatency, minWinRate, pnlPositiveOnly, activeSignalsOnly, earlyOnly, sortBy]);

  const clearFilters = () => {
    setSelectedStrategies([]);
    setSelectedRisk([]);
    setSelectedLatency([]);
    setMinWinRate(0);
    setPnlPositiveOnly(false);
  };

  const hasActiveFilters = selectedStrategies.length > 0 || selectedRisk.length > 0 || selectedLatency.length > 0 || minWinRate > 0 || pnlPositiveOnly;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="px-4 py-6 max-w-[1600px] mx-auto">
          {/* Hero Bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Actors</h1>
              <p className="text-sm text-gray-500">Proven on-chain operators & strategies</p>
            </div>
            
            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Active signals toggle */}
              <button
                onClick={() => setActiveSignalsOnly(!activeSignalsOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeSignalsOnly 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Active signals
              </button>

              {/* Early only toggle */}
              <button
                onClick={() => setEarlyOnly(!earlyOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  earlyOnly 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Early only
              </button>

              {/* Followed toggle */}
              <button
                onClick={() => setFollowedOnly(!followedOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  followedOnly 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${followedOnly ? 'fill-current' : ''}`} />
                Followed
              </button>
              
              {/* Filter button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-4 h-4 bg-white text-gray-900 rounded-full text-xs font-bold flex items-center justify-center">
                    {selectedStrategies.length + selectedRisk.length + selectedLatency.length + (minWinRate > 0 ? 1 : 0) + (pnlPositiveOnly ? 1 : 0)}
                  </span>
                )}
              </button>
              
              {/* IDENTITY TOGGLE - Strategy vs Real Names */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 ml-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setShowRealNames(false)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        !showRealNames 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      data-testid="show-strategies-btn"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      Strategies
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white max-w-xs">
                    <p className="text-xs">Focus on strategy patterns, not personalities. Better for objective analysis.</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setShowRealNames(true)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        showRealNames 
                          ? 'bg-gray-100 text-gray-700' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      data-testid="show-real-names-btn"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Real Names
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white max-w-xs">
                    <p className="text-xs">Show known entity names for high-confidence identifications.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Search Bar + Sort */}
          <div className="flex items-center gap-4 mb-6">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by behavior, strategy, token, address..."
              className="flex-1"
              testId="actors-search-input"
            />

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-gray-900"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Strategy filters */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Strategy
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {strategyFilters.map(strategy => (
                      <button
                        key={strategy}
                        onClick={() => toggleStrategy(strategy)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          selectedStrategies.includes(strategy)
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {strategy}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Performance filters */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Performance
                  </label>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Win rate &gt; {minWinRate}%</label>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        step="10"
                        value={minWinRate}
                        onChange={(e) => setMinWinRate(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <button
                      onClick={() => setPnlPositiveOnly(!pnlPositiveOnly)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        pnlPositiveOnly
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      PnL positive only
                    </button>
                  </div>
                </div>

                {/* Risk filters */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Risk
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {riskFilters.map(risk => (
                      <button
                        key={risk}
                        onClick={() => toggleRisk(risk)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          selectedRisk.includes(risk)
                            ? risk === 'Low' ? 'bg-[#16C784] text-white' :
                              risk === 'Medium' ? 'bg-[#F5A524] text-white' :
                              'bg-[#EF4444] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {risk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Latency filters */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Latency
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {latencyFilters.map(latency => (
                      <button
                        key={latency}
                        onClick={() => setSelectedLatency(prev => 
                          prev.includes(latency) 
                            ? prev.filter(l => l !== latency) 
                            : [...prev, latency]
                        )}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          selectedLatency.includes(latency)
                            ? latency === 'Early' ? 'bg-emerald-500 text-white' :
                              latency === 'Medium' ? 'bg-amber-500 text-white' :
                              'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {latency}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chain filter - NEW */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Primary Chain
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(chainConfig).map(([chain, config]) => (
                      <button
                        key={chain}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full ${config.color}`} />
                        {chain}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{filteredActors.length}</span> actors
              {followedOnly && <span className="text-amber-600"> (followed only)</span>}
              {activeSignalsOnly && <span className="text-emerald-600"> (with active signals)</span>}
              {earlyOnly && <span className="text-emerald-600"> (early latency)</span>}
            </p>
          </div>

          {/* Actor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredActors.map(actor => (
              <ActorCard
                key={actor.id}
                actor={actor}
                isFollowed={followedActors.includes(actor.id)}
                onToggleFollow={toggleFollow}
                showRealNames={showRealNames}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredActors.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No actors found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  clearFilters();
                  setFollowedOnly(false);
                  setActiveSignalsOnly(false);
                  setEarlyOnly(false);
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
