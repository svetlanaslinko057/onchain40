import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Wallet, TrendingUp, TrendingDown, Shield, AlertTriangle, ArrowUpRight,
  Activity, Check, Bell, Eye, Info, X, Zap, Target, Clock, ChevronDown, ChevronUp,
  Star, Copy, ExternalLink
} from 'lucide-react';
import Header from '../components/Header';
import BehaviorFingerprint from '../components/BehaviorFingerprint';
import AdvancedRiskFlags from '../components/AdvancedRiskFlags';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

// Mock wallets data
const topWallets = [
  { 
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 
    label: 'Vitalik Buterin', 
    type: 'Smart Money', 
    balance: '$45.2M', 
    pnl: '+27.4%', 
    riskScore: 12,
    whyFeatured: 'Accumulating L2 tokens during bullish regime'
  },
  { 
    address: '0x28C6c06298d514Db089934071355E5743bf21d60', 
    label: 'Binance Hot Wallet', 
    type: 'Exchange', 
    balance: '$2.8B', 
    pnl: '+31.8%', 
    riskScore: 5,
    whyFeatured: 'High volume institutional accumulation'
  },
  { 
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 
    label: 'Unknown Whale', 
    type: 'Whale', 
    balance: '$127.5M', 
    pnl: '-6.4%', 
    riskScore: 45,
    whyFeatured: 'Early buyer of AI narrative tokens'
  },
  { 
    address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', 
    label: 'a16z Crypto', 
    type: 'Fund', 
    balance: '$890.2M', 
    pnl: '+26.3%', 
    riskScore: 8,
    whyFeatured: 'Strategic positions in infrastructure plays'
  },
  { 
    address: '0x1234567890abcdef1234567890abcdef12345678', 
    label: 'DeFi Farmer', 
    type: 'Smart Money', 
    balance: '$8.9M', 
    pnl: '+23.6%', 
    riskScore: 22,
    whyFeatured: 'Profitable yield farming strategies'
  },
];

// Wallet Intelligence data with Decision Score
const walletIntelligenceData = {
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045': {
    classification: 'Smart Money',
    confidence: 87,
    currentMode: 'Accumulation',
    marketAlignment: 'Risk-On',
    tokenOverlap: ['ETH', 'AI', 'L2'],
    reliabilityScore: 82,
    riskScore: 12,
    pnlConsistency: 78,
    marketAlignmentScore: 100,
    decisionScore: 85,
    verdict: 'FOLLOW',
    walletState: 'Accumulation → Stable',
    walletStatePeriod: 'last 14d',
    walletStateExplanation: 'Based on net flows, hold duration, and realized PnL distribution',
    totalPnl: '+$549K',
    winRate: '66.8%',
    profitFactor: '3.34x',
    tradesAnalyzed: 468,
    avgDrawdown: '8.2%',
    avgEntryDelay: '2.4 hours',
    expectedSlippage: '0.3%',
    earlyEntryProfit: '71%',
    replicability: 'Medium'
  }
};

// Default intelligence for wallets without specific data
const defaultIntelligence = {
  classification: 'Unknown',
  confidence: 0,
  currentMode: 'Analyzing...',
  marketAlignment: 'Unknown',
  tokenOverlap: [],
  reliabilityScore: 0,
  riskScore: 50,
  pnlConsistency: 0,
  marketAlignmentScore: 0,
  decisionScore: 0,
  verdict: 'ANALYZE',
  walletState: 'Pending Analysis',
  walletStatePeriod: '-',
  walletStateExplanation: 'Select a wallet to view detailed analysis',
  totalPnl: '-',
  winRate: '-',
  profitFactor: '-',
  tradesAnalyzed: 0,
  avgDrawdown: '-',
  avgEntryDelay: '-',
  expectedSlippage: '-',
  earlyEntryProfit: '-',
  replicability: '-'
};

// Wallet Alerts configuration
const walletAlertTypes = [
  {
    id: 'behavioral_shift',
    name: 'Behavioral Shift',
    description: 'Alert when wallet changes trading pattern',
    triggers: [
      'Switched from accumulation to distribution',
      'Changed from holder to active trader',
      'Shift in primary DEX usage'
    ],
    icon: Activity
  },
  {
    id: 'narrative_entry',
    name: 'Narrative Entry',
    description: 'Alert when wallet enters new narrative cluster',
    triggers: [
      'First purchase in new narrative (AI, Gaming, L2)',
      'Large allocation to emerging sector',
      'Following Smart Money into new category'
    ],
    icon: Target
  },
  {
    id: 'risk_threshold',
    name: 'Risk Threshold',
    description: 'Alert on portfolio risk changes',
    triggers: [
      'PnL drawdown exceeds 10%',
      'Risk score increases above 50',
      'Interaction with high-risk tokens'
    ],
    icon: AlertTriangle
  },
  {
    id: 'exit_degradation',
    name: 'Exit / Degradation Alert',
    description: 'Alert when it's time to stop following',
    triggers: [
      'Shift from Accumulation → Distribution',
      'PnL decay over rolling 14 days',
      'Risk score ↑ +20 in 7 days',
      'Sell pressure on top holdings'
    ],
    icon: TrendingDown
  }
];

export default function WalletsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(true);
  const [showRiskDeepDive, setShowRiskDeepDive] = useState(true);
  const [trackedWallets, setTrackedWallets] = useState([]);
  const [showSignalsModal, setShowSignalsModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Get current wallet data
  const currentWalletData = useMemo(() => {
    if (!selectedWallet) return null;
    return topWallets.find(w => w.address === selectedWallet);
  }, [selectedWallet]);

  // Get intelligence for selected wallet
  const walletIntelligence = useMemo(() => {
    if (!selectedWallet) return null;
    return walletIntelligenceData[selectedWallet] || {
      ...defaultIntelligence,
      classification: currentWalletData?.type || 'Unknown',
      riskScore: currentWalletData?.riskScore || 50,
    };
  }, [selectedWallet, currentWalletData]);

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return topWallets.filter(w => 
      w.label.toLowerCase().includes(query) ||
      w.address.toLowerCase().includes(query) ||
      w.type.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery]);

  // Track wallet handler
  const handleTrackWallet = (address) => {
    if (trackedWallets.includes(address)) {
      setTrackedWallets(trackedWallets.filter(w => w !== address));
    } else {
      setTrackedWallets([...trackedWallets, address]);
    }
  };

  const handleSelectWallet = (wallet) => {
    setSelectedWallet(wallet.address);
    setSearchQuery('');
  };

  const handleCopyAddress = () => {
    if (selectedWallet) {
      navigator.clipboard.writeText(selectedWallet);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const isWalletTracked = selectedWallet ? trackedWallets.includes(selectedWallet) : false;

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'FOLLOW': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'WATCH': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'AVOID': return 'bg-red-500/20 border-red-500/30 text-red-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="px-4 py-6">
          {/* PAGE HEADER WITH SEARCH - TOP OF PAGE */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Wallet Intelligence</h1>
                <p className="text-sm text-gray-500">Analyze any wallet's behavior, risk, and strategy fit</p>
              </div>
              {trackedWallets.length > 0 && (
                <Link 
                  to="/watchlist" 
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Saved ({trackedWallets.length})
                </Link>
              )}
            </div>

            {/* MAIN SEARCH BAR */}
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search wallet address / ENS / label (e.g., Binance, vitalik.eth, 0x...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="wallet-search-input"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base focus:outline-none focus:border-gray-900 transition-colors"
                    style={{ color: '#111827' }}
                  />
                </div>
              </div>

              {/* Search Suggestions Dropdown */}
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {searchSuggestions.map((wallet) => (
                    <button
                      key={wallet.address}
                      onClick={() => handleSelectWallet(wallet)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{wallet.label}</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{wallet.type}</span>
                        </div>
                        <code className="text-xs text-gray-500 font-mono">
                          {wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}
                        </code>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MAIN CONTENT LAYOUT */}
          <div className="flex gap-6">
            {/* LEFT: Main Analysis Area */}
            <div className="flex-1">
              {/* SELECTED WALLET INDICATOR */}
              {selectedWallet && currentWalletData ? (
                <>
                  {/* Selected Wallet Header */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center">
                          <Wallet className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl font-bold text-gray-900">{currentWalletData.label}</span>
                            <span className="px-2 py-1 bg-gray-200 rounded-lg text-xs font-medium text-gray-700">
                              {currentWalletData.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-sm text-gray-500 font-mono">
                              {selectedWallet.slice(0, 10)}...{selectedWallet.slice(-8)}
                            </code>
                            <button 
                              onClick={handleCopyAddress}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              {copiedAddress ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                            <a 
                              href={`https://etherscan.io/address/${selectedWallet}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedWallet(null)}
                        className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* WALLET STRATEGY DECISION - Main Analysis Block */}
                  <div className="bg-gray-900 text-white rounded-2xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Wallet Strategy Decision</div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl font-bold">{walletIntelligence.verdict}</span>
                          <span className={`px-3 py-1 border rounded-lg text-sm font-semibold ${getVerdictColor(walletIntelligence.verdict)}`}>
                            {walletIntelligence.confidence >= 70 ? 'High Confidence' : walletIntelligence.confidence >= 40 ? 'Medium Confidence' : 'Low Confidence'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-2 mb-2">
                          Decision Score: <span className="font-bold text-white">{walletIntelligence.decisionScore}/100</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="p-0.5 hover:bg-white/10 rounded">
                                <Info className="w-3 h-3 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                              <p className="font-semibold mb-2">Decision Score Formula:</p>
                              <ul className="text-xs space-y-1">
                                <li>• 35% Reliability ({walletIntelligence.reliabilityScore})</li>
                                <li>• 25% Low Risk ({100 - walletIntelligence.riskScore})</li>
                                <li>• 25% PnL Consistency ({walletIntelligence.pnlConsistency})</li>
                                <li>• 15% Market Alignment ({walletIntelligence.marketAlignmentScore})</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                          • {walletIntelligence.classification}
                        </div>
                        {/* Wallet State */}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-400">Current State:</span>
                          <span className="font-semibold text-white">{walletIntelligence.walletState}</span>
                          <span className="text-gray-500">({walletIntelligence.walletStatePeriod})</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="p-0.5 hover:bg-white/10 rounded">
                                <Info className="w-3 h-3 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                              <p className="text-xs">{walletIntelligence.walletStateExplanation}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 mb-1">Confidence</div>
                        <div className="text-3xl font-bold">{walletIntelligence.confidence}<span className="text-xl text-gray-500">%</span></div>
                        <div className="text-xs text-gray-400 mt-1">{walletIntelligence.tradesAnalyzed} trades</div>
                      </div>
                    </div>

                    {/* Analysis context */}
                    <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-xs text-gray-400">
                        <span className="font-medium">Analysis applies only to:</span> {currentWalletData.label} ({selectedWallet.slice(0, 6)}...{selectedWallet.slice(-4)})
                      </div>
                    </div>

                    {/* Why Follow? */}
                    <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Why {walletIntelligence.verdict === 'FOLLOW' ? 'Follow' : 'Consider'} This Wallet?</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Profitable over 6 months ({walletIntelligence.totalPnl} realized)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Low systemic risk ({walletIntelligence.riskScore}/100)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Aligned with current market regime ({walletIntelligence.marketAlignment})</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">High frequency trader — short holding periods ({walletIntelligence.avgEntryDelay} avg delay)</span>
                        </div>
                      </div>
                    </div>

                    {/* What happens if you follow */}
                    <div className="mb-4 p-4 bg-white/10 rounded-lg border border-white/20">
                      <div className="text-xs text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                        What Happens If You Follow
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-0.5 hover:bg-white/10 rounded">
                              <Info className="w-3 h-3 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                            <p className="mb-2">Estimated impact based on historical behavior</p>
                            <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-white/20">
                              <span className="font-semibold">Replicability: {walletIntelligence.replicability}</span><br/>
                              {walletIntelligence.earlyEntryProfit} profit captured within first 12h of position opening
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <div className="text-gray-400 mb-1">Avg Drawdown</div>
                          <div className="text-base font-bold text-white">{walletIntelligence.avgDrawdown}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">Entry Delay</div>
                          <div className="text-base font-bold text-white">{walletIntelligence.avgEntryDelay}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">Expected Slippage</div>
                          <div className="text-base font-bold text-white">{walletIntelligence.expectedSlippage}</div>
                        </div>
                      </div>
                    </div>

                    {/* Actionable buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            onClick={() => handleTrackWallet(selectedWallet)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                              isWalletTracked 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-white text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            {isWalletTracked ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {isWalletTracked ? 'Tracking' : 'Track Wallet'}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                          <p className="text-xs">{isWalletTracked ? 'Click to stop tracking this wallet' : 'Adds to Watchlist • Enables Alerts • Shows in Market → "Tracked Wallet Activity"'}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            onClick={() => setShowSignalsModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
                          >
                            <Activity className="w-4 h-4" />
                            Copy Signals
                            <span className="text-xs text-gray-400">(Read-only)</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                          <p className="text-xs">Shows theoretical entry points based on wallet actions. Execution latency and slippage not included.</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            onClick={() => setShowAlertModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
                          >
                            <Bell className="w-4 h-4" />
                            Alert on Changes
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                          <p className="text-xs">State-based alerts only (not price-based). Behavioral, narrative, risk, and exit signals.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Core Metrics */}
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Core Metrics</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      {/* PnL Summary */}
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">PnL Summary</h3>
                          <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">FACT</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total PnL</span>
                            <span className="font-bold text-gray-900">{walletIntelligence.totalPnl}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Win Rate</span>
                            <span className="font-semibold text-gray-900">{walletIntelligence.winRate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Profit Factor</span>
                            <span className="font-semibold text-gray-900">{walletIntelligence.profitFactor}</span>
                          </div>
                        </div>
                      </div>

                      {/* Risk Score */}
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Score</h3>
                          <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">FACT</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className={`text-4xl font-bold ${walletIntelligence.riskScore < 30 ? 'text-green-600' : walletIntelligence.riskScore < 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {walletIntelligence.riskScore}<span className="text-xl text-gray-400">/100</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {walletIntelligence.riskScore < 30 ? 'Low Risk' : walletIntelligence.riskScore < 60 ? 'Medium Risk' : 'High Risk'}
                            </div>
                          </div>
                          <div className="text-right text-xs text-gray-600">
                            <div className="mb-1">✓ No sanctions</div>
                            <div className="mb-1">✓ No mixers</div>
                            <div>⚠ 2 risky approvals</div>
                          </div>
                        </div>
                      </div>

                      {/* Dominant Strategy */}
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dominant Strategy</h3>
                          <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">MODEL</span>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 mb-1">{walletIntelligence.classification}</div>
                          <div className="text-xs text-gray-600 mb-2">{walletIntelligence.confidence}% confidence based on {walletIntelligence.tradesAnalyzed} trades</div>
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">DEX Heavy</span>
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">Alpha Hunter</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Details - EXPANDABLE */}
                  <div className="mb-6">
                    <button
                      onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">Advanced Analysis</h2>
                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">MODEL</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {showAdvancedDetails ? 'Hide' : 'Show'}
                        {showAdvancedDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {showAdvancedDetails && (
                      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Token Alignment */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                            <Activity className="w-4 h-4 text-gray-500" />
                            Token Alignment
                          </h3>
                          
                          <div className="space-y-2 mb-3">
                            {walletIntelligence.tokenOverlap.map((token, i) => (
                              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-gray-700" />
                                  <span className="text-sm font-medium text-gray-900">{token}</span>
                                  <span className="text-xs text-gray-500">Accumulation</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-700">Aligned</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-600">
                              <span className="font-semibold">Model insight:</span> This wallet is accumulating tokens with confirmed bullish structure
                            </div>
                          </div>
                        </div>

                        {/* Strategy Suitability */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-gray-500" />
                            Strategy Suitability
                          </h3>
                          
                          <div className="space-y-2 mb-3">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">Smart Money Follow</span>
                                <Check className="w-4 h-4 text-gray-700" />
                              </div>
                              <div className="text-xs text-gray-600">
                                <span className="font-semibold">Highly aligned</span> — Consistent accumulation patterns
                              </div>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">Narrative Rider</span>
                                <AlertTriangle className="w-4 h-4 text-gray-500" />
                              </div>
                              <div className="text-xs text-gray-600">
                                <span className="font-semibold">Partial alignment</span> — Some late entries detected
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-600">
                              <span className="font-semibold">Recommendation:</span> Best suited for Smart Money Follow strategy
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Detailed Analytics */}
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Detailed Analytics</h2>
                
                    <div className="mb-4">
                      <BehaviorFingerprint address={selectedWallet} />
                    </div>

                    {/* Risk Deep Dive - COLLAPSIBLE */}
                    <div>
                      <button
                        onClick={() => setShowRiskDeepDive(!showRiskDeepDive)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors mb-4"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-700" />
                          <h3 className="text-sm font-semibold text-gray-900">Risk Deep Dive</h3>
                          <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">FACT</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {showRiskDeepDive ? 'Hide Details' : 'Show Details'}
                          {showRiskDeepDive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {showRiskDeepDive && (
                        <div className="mb-4">
                          <AdvancedRiskFlags address={selectedWallet} />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* EMPTY STATE - No wallet selected */
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-10 h-10 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Select a Wallet to Analyze</h2>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Use the search bar above to find a wallet by address, ENS, or label. 
                    Or choose from suggested wallets on the right.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Search className="w-4 h-4" />
                      Search by address
                    </span>
                    <span>•</span>
                    <span>ENS names supported</span>
                    <span>•</span>
                    <span>Labels (Binance, a16z...)</span>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Suggested Wallets Sidebar */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">Suggested Wallets</h3>
                      <p className="text-xs text-gray-500">High-confidence wallets to follow</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Info className="w-4 h-4 text-gray-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white max-w-xs">
                        <p className="text-xs">Curated list based on recent performance, low risk, and market alignment. Click to analyze.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="space-y-2">
                    {topWallets.map((wallet) => (
                      <button
                        key={wallet.address}
                        onClick={() => handleSelectWallet(wallet)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          selectedWallet === wallet.address 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-white border border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            selectedWallet === wallet.address ? 'bg-white/20' : 'bg-gray-100'
                          }`}>
                            <Wallet className={`w-4 h-4 ${selectedWallet === wallet.address ? 'text-white' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{wallet.label}</div>
                            <div className={`text-xs ${selectedWallet === wallet.address ? 'text-gray-300' : 'text-gray-500'}`}>
                              {wallet.type}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs font-semibold ${
                              wallet.pnl.startsWith('+') 
                                ? selectedWallet === wallet.address ? 'text-green-300' : 'text-green-600'
                                : selectedWallet === wallet.address ? 'text-red-300' : 'text-red-600'
                            }`}>
                              {wallet.pnl}
                            </div>
                          </div>
                        </div>
                        
                        {/* Why featured - mini block */}
                        <div className={`text-xs p-2 rounded-lg ${
                          selectedWallet === wallet.address ? 'bg-white/10' : 'bg-gray-50'
                        }`}>
                          <span className={selectedWallet === wallet.address ? 'text-gray-300' : 'text-gray-500'}>Why: </span>
                          <span className={selectedWallet === wallet.address ? 'text-white' : 'text-gray-700'}>{wallet.whyFeatured}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Link 
                    to="/entities" 
                    className="flex items-center justify-center gap-2 w-full mt-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Discover more wallets
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAlertModal(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Create Wallet Alert</h3>
                </div>
                <button onClick={() => setShowAlertModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Monitor behavioral changes and risk events for this wallet
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {walletAlertTypes.map((alert) => {
                  const Icon = alert.icon;
                  return (
                    <div key={alert.id} className="p-4 border border-gray-200 rounded-xl hover:border-gray-900 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-900 transition-colors flex-shrink-0">
                          <Icon className="w-4 h-4 text-gray-600 group-hover:text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">{alert.name}</h4>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{alert.description}</p>
                          <div className="text-xs text-gray-500">
                            <ul className="space-y-0.5">
                              {alert.triggers.slice(0, 2).map((trigger, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-gray-400">•</span>
                                  <span className="line-clamp-1">{trigger}</span>
                                </li>
                              ))}
                              {alert.triggers.length > 2 && (
                                <li className="text-gray-400 text-xs">+{alert.triggers.length - 2} more</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                <span className="font-medium">Note:</span> Wallet alerts are behavioral, structural, and risk-based — different from Market alerts.
              </div>
            </div>
          </div>
        )}

        {/* Copy Signals Modal */}
        {showSignalsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowSignalsModal(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Copy Signals</h3>
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">Read-only</span>
                </div>
                <button onClick={() => setShowSignalsModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Theoretical entry points based on wallet recent actions. These are historical signals — not recommendations.
              </p>

              {/* Recent Signals */}
              <div className="space-y-3 mb-4">
                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">ARB Entry</div>
                        <div className="text-xs text-gray-500">2 hours ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">$1.42</div>
                      <div className="text-xs text-green-600">+4.2% since</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Size: $45,000</span>
                    <span>•</span>
                    <span>DEX: Uniswap</span>
                    <span>•</span>
                    <span>Slippage: 0.12%</span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">OP Accumulation</div>
                        <div className="text-xs text-gray-500">6 hours ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">$2.18</div>
                      <div className="text-xs text-green-600">+1.8% since</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Size: $120,000</span>
                    <span>•</span>
                    <span>DEX: 1inch</span>
                    <span>•</span>
                    <span>Slippage: 0.08%</span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                        <TrendingDown className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">PEPE Exit</div>
                        <div className="text-xs text-gray-500">1 day ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">$0.0000089</div>
                      <div className="text-xs text-gray-500">-2.1% since</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Size: $28,000</span>
                    <span>•</span>
                    <span>DEX: Uniswap</span>
                    <span>•</span>
                    <span>Slippage: 0.34%</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Important:</span> These signals show what the wallet did, not what you should do. 
                    Actual execution will have different timing, slippage, and market conditions. 
                    Average delay to copy: <span className="font-semibold">{walletIntelligence?.avgEntryDelay || '~2h'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
