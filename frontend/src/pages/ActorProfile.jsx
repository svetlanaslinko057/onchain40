import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, Bell, Eye, Check, AlertTriangle, TrendingUp, TrendingDown,
  Shield, Activity, Zap, Target, Clock, Info, ChevronDown, ChevronUp, X, Users
} from 'lucide-react';
import Header from '../components/Header';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

// Mock actor detailed data
const actorDetailedData = {
  'vitalik': {
    id: 'vitalik',
    label: 'Vitalik.eth',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    type: 'Whale',
    avatar: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    strategy: 'Smart Money Trader',
    confidence: 87,
    // Why follow
    whyFollow: [
      { positive: true, text: 'Profitable over 6 months (+$549K realized)' },
      { positive: true, text: 'Low systemic risk (12/100)' },
      { positive: true, text: 'Aligned with current market regime (Risk-On)' },
      { positive: false, text: 'High frequency trader — latency risk (2.4h avg delay)' },
    ],
    // Performance
    performance: {
      realizedPnl: '+$549K',
      winRate: '66.8%',
      avgHoldTime: '4.2 days',
      avgDrawdown: '8.2%',
      entryDelay: '2.4 hours',
      tradesAnalyzed: 468,
    },
    // Strategy fingerprint
    strategyFingerprint: {
      dexUsage: 85,
      holdDuration: 35,
      riskTolerance: 25,
      narrativeFocus: 70,
      entryTiming: 80,
    },
    strategies: ['Smart Money', 'DEX Heavy', 'Alpha Hunter', 'Narrative Rider'],
    // Asset Behavior Map
    assetBehavior: [
      { token: 'ETH', behavior: 'Accumulate', bias: 'Bullish', allocation: '45%' },
      { token: 'ARB', behavior: 'Trade', bias: 'Active', allocation: '20%' },
      { token: 'OP', behavior: 'Bullish bias', bias: 'Long', allocation: '15%' },
      { token: 'Meme', behavior: 'Quick flips', bias: 'Neutral', allocation: '10%' },
      { token: 'Stables', behavior: 'Reserve', bias: 'Safe', allocation: '10%' },
    ],
    // Risk & Flags
    riskFlags: {
      sanctions: false,
      mixers: false,
      riskyApprovals: 2,
      unverifiedContracts: 1,
      overallRisk: 12,
    },
    // Current state
    currentBehavior: 'Accumulating',
    behaviorTrend: 'Stable → Bullish',
    // Active alerts
    activeAlerts: [
      { type: 'Behavior change', status: 'active' },
      { type: 'Large position entry', status: 'active' },
    ],
  },
  'alameda': {
    id: 'alameda',
    label: 'Alameda Research',
    address: '0x28C6c06298d514Db089934071355E5743bf21d60',
    type: 'Fund',
    avatar: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
    strategy: 'Accumulator & Momentum',
    confidence: 91,
    whyFollow: [
      { positive: true, text: 'Exceptional track record (+$2.4M realized)' },
      { positive: true, text: 'Very low risk profile (8/100)' },
      { positive: true, text: 'Strong narrative timing' },
      { positive: false, text: 'Large position sizes — may move markets' },
    ],
    performance: {
      realizedPnl: '+$2.4M',
      winRate: '71.2%',
      avgHoldTime: '12.5 days',
      avgDrawdown: '5.1%',
      entryDelay: '4.8 hours',
      tradesAnalyzed: 892,
    },
    strategyFingerprint: {
      dexUsage: 65,
      holdDuration: 70,
      riskTolerance: 15,
      narrativeFocus: 85,
      entryTiming: 90,
    },
    strategies: ['Accumulator', 'Momentum', 'Narrative Rider', 'Long-term'],
    assetBehavior: [
      { token: 'SOL', behavior: 'Accumulate', bias: 'Very Bullish', allocation: '35%' },
      { token: 'BTC', behavior: 'Hold', bias: 'Long', allocation: '30%' },
      { token: 'DeFi', behavior: 'Rotate', bias: 'Active', allocation: '20%' },
      { token: 'AI', behavior: 'Adding', bias: 'Bullish', allocation: '15%' },
    ],
    riskFlags: {
      sanctions: false,
      mixers: false,
      riskyApprovals: 0,
      unverifiedContracts: 0,
      overallRisk: 8,
    },
    currentBehavior: 'Rotating',
    behaviorTrend: 'Active trading',
    activeAlerts: [
      { type: 'Strategy shift', status: 'active' },
    ],
  },
};

// Default actor data
const defaultActor = {
  id: 'unknown',
  label: 'Unknown Actor',
  address: '0x0000000000000000000000000000000000000000',
  type: 'Unknown',
  avatar: null,
  strategy: 'Unknown',
  confidence: 0,
  whyFollow: [],
  performance: {
    realizedPnl: '-',
    winRate: '-',
    avgHoldTime: '-',
    avgDrawdown: '-',
    entryDelay: '-',
    tradesAnalyzed: 0,
  },
  strategyFingerprint: {
    dexUsage: 0,
    holdDuration: 0,
    riskTolerance: 0,
    narrativeFocus: 0,
    entryTiming: 0,
  },
  strategies: [],
  assetBehavior: [],
  riskFlags: {
    sanctions: false,
    mixers: false,
    riskyApprovals: 0,
    unverifiedContracts: 0,
    overallRisk: 50,
  },
  currentBehavior: 'Unknown',
  behaviorTrend: '-',
  activeAlerts: [],
};

// Confidence colors
const getConfidenceColor = (confidence) => {
  if (confidence >= 70) return { bg: 'bg-emerald-500', text: 'text-emerald-500', label: 'High' };
  if (confidence >= 40) return { bg: 'bg-amber-500', text: 'text-amber-500', label: 'Medium' };
  return { bg: 'bg-red-500', text: 'text-red-500', label: 'Low' };
};

// Strategy Radar component
const StrategyRadar = ({ fingerprint }) => {
  const items = [
    { key: 'dexUsage', label: 'DEX Usage' },
    { key: 'holdDuration', label: 'Hold Duration' },
    { key: 'riskTolerance', label: 'Risk Tolerance' },
    { key: 'narrativeFocus', label: 'Narrative Focus' },
    { key: 'entryTiming', label: 'Entry Timing' },
  ];

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.key}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-900">{fingerprint[item.key]}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-900 rounded-full transition-all"
              style={{ width: `${fingerprint[item.key]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ActorProfile() {
  const { actorId } = useParams();
  const [isFollowed, setIsFollowed] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showRiskDetails, setShowRiskDetails] = useState(true);

  // Get actor data
  const actor = actorDetailedData[actorId] || defaultActor;
  const confidenceColor = getConfidenceColor(actor.confidence);

  // Alert types for this actor
  const alertTypes = [
    { id: 'behavior_change', name: 'Behavior change', description: 'When trading pattern shifts' },
    { id: 'large_position', name: 'Large position entry', description: 'New significant position' },
    { id: 'distribution', name: 'Distribution start', description: 'Begins selling holdings' },
    { id: 'strategy_shift', name: 'Strategy shift', description: 'Changes dominant strategy' },
    { id: 'risk_increase', name: 'Risk increase', description: 'Risk score rises significantly' },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="px-4 py-6">
          {/* Back link */}
          <Link 
            to="/actors" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Actors
          </Link>

          {/* Actor Header */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  {actor.avatar ? (
                    <img src={actor.avatar} alt={actor.label} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{actor.label}</h1>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-500">Strategy:</span>
                    <span className="font-semibold text-gray-900">{actor.strategy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${confidenceColor.bg}`} />
                    <span className="text-sm font-medium text-gray-700">
                      Confidence: <span className={confidenceColor.text}>{actor.confidence}%</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFollowed(!isFollowed)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isFollowed 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isFollowed ? 'fill-current' : ''}`} />
                  {isFollowed ? 'Following' : 'Follow'}
                </button>
                <button
                  onClick={() => setShowAlertModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  Alert on changes
                </button>
                <Link
                  to="/watchlist"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Add to Watchlist
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Why Follow */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Why follow this actor</h2>
                <div className="space-y-3">
                  {actor.whyFollow.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {item.positive ? (
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={item.positive ? 'text-gray-900' : 'text-gray-600'}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Snapshot */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Performance snapshot</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Realized PnL</div>
                    <div className={`text-xl font-bold ${
                      actor.performance.realizedPnl.startsWith('+') ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {actor.performance.realizedPnl}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Win Rate</div>
                    <div className="text-xl font-bold text-gray-900">{actor.performance.winRate}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg Hold Time</div>
                    <div className="text-xl font-bold text-gray-900">{actor.performance.avgHoldTime}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg Drawdown</div>
                    <div className="text-xl font-bold text-gray-900">{actor.performance.avgDrawdown}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Entry Delay</div>
                    <div className="text-xl font-bold text-gray-900">{actor.performance.entryDelay}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Trades Analyzed</div>
                    <div className="text-xl font-bold text-gray-900">{actor.performance.tradesAnalyzed}</div>
                  </div>
                </div>
              </div>

              {/* Asset Behavior Map - NOT Portfolio */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">What this actor trades</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Info className="w-4 h-4 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white max-w-xs">
                      <p className="text-xs">Asset Behavior Map — shows HOW this actor trades each asset, not just holdings</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-3">
                  {actor.assetBehavior.map((asset, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900 w-16">{asset.token}</span>
                        <span className="text-sm text-gray-600">—</span>
                        <span className="text-sm font-medium text-gray-700">{asset.behavior}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          asset.bias.includes('Bullish') ? 'bg-emerald-100 text-emerald-700' :
                          asset.bias === 'Neutral' ? 'bg-gray-100 text-gray-600' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {asset.bias}
                        </span>
                        <span className="text-sm text-gray-500 w-12 text-right">{asset.allocation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk & Flags */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowRiskDetails(!showRiskDetails)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-700" />
                    <h2 className="text-lg font-bold text-gray-900">Risk & Flags</h2>
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      actor.riskFlags.overallRisk < 30 ? 'bg-emerald-100 text-emerald-700' :
                      actor.riskFlags.overallRisk < 60 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {actor.riskFlags.overallRisk}/100
                    </span>
                  </div>
                  {showRiskDetails ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>

                {showRiskDetails && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sanctions</span>
                          {actor.riskFlags.sanctions ? (
                            <span className="text-red-500 font-semibold text-sm">Yes</span>
                          ) : (
                            <span className="text-emerald-500 font-semibold text-sm flex items-center gap-1">
                              <Check className="w-4 h-4" /> Clean
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Mixers</span>
                          {actor.riskFlags.mixers ? (
                            <span className="text-red-500 font-semibold text-sm">Detected</span>
                          ) : (
                            <span className="text-emerald-500 font-semibold text-sm flex items-center gap-1">
                              <Check className="w-4 h-4" /> None
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Risky Approvals</span>
                          <span className={`font-semibold text-sm ${
                            actor.riskFlags.riskyApprovals > 0 ? 'text-amber-500' : 'text-emerald-500'
                          }`}>
                            {actor.riskFlags.riskyApprovals}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Unverified Contracts</span>
                          <span className={`font-semibold text-sm ${
                            actor.riskFlags.unverifiedContracts > 0 ? 'text-amber-500' : 'text-emerald-500'
                          }`}>
                            {actor.riskFlags.unverifiedContracts}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Current State */}
              <div className="bg-gray-900 text-white rounded-2xl p-5">
                <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Current State</h3>
                <div className="text-2xl font-bold mb-2">{actor.currentBehavior}</div>
                <div className="text-sm text-gray-400">{actor.behaviorTrend}</div>
              </div>

              {/* Strategy Fingerprint */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Strategy Fingerprint</h3>
                <StrategyRadar fingerprint={actor.strategyFingerprint} />
                
                {/* Strategy tags */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {actor.strategies.map((strategy, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                      {strategy}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Alerts */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Alerts</h3>
                  <button 
                    onClick={() => setShowAlertModal(true)}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Configure
                  </button>
                </div>
                
                {actor.activeAlerts.length > 0 ? (
                  <div className="space-y-2">
                    {actor.activeAlerts.map((alert, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                          <span className="text-sm font-medium text-gray-900">{alert.type}</span>
                        </div>
                        <span className="text-xs text-emerald-600 font-medium uppercase">Active</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No active alerts</p>
                )}
                
                <button
                  onClick={() => setShowAlertModal(true)}
                  className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  + Add Alert
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAlertModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-700" />
                  <h3 className="font-bold text-gray-900">Actor Alerts</h3>
                </div>
                <button onClick={() => setShowAlertModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-5">
                <p className="text-sm text-gray-500 mb-4">
                  Select which events trigger notifications for <span className="font-semibold text-gray-900">{actor.label}</span>
                </p>
                
                <div className="space-y-2">
                  {alertTypes.map(alert => (
                    <label key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{alert.name}</div>
                        <div className="text-xs text-gray-500">{alert.description}</div>
                      </div>
                      <input 
                        type="checkbox" 
                        defaultChecked={actor.activeAlerts.some(a => a.type === alert.name)}
                        className="w-4 h-4 text-gray-900 rounded"
                      />
                    </label>
                  ))}
                </div>
                
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="w-full mt-4 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
                >
                  Save Alert Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
