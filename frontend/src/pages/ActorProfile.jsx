import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, Bell, Eye, Check, AlertTriangle, TrendingUp, TrendingDown,
  Shield, Activity, Zap, Target, Clock, Info, ChevronDown, ChevronUp, X, Users,
  Wallet, ExternalLink, Copy, ArrowUpRight, Globe, Play, Gauge, LogOut, Calculator,
  DollarSign, TrendingUp as TrendUp, BarChart3, Link2, GitBranch
} from 'lucide-react';
import Header from '../components/Header';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

// Chain configs
const chainConfig = {
  'ETH': { color: 'bg-blue-500', label: 'Ethereum' },
  'SOL': { color: 'bg-purple-500', label: 'Solana' },
  'BASE': { color: 'bg-blue-600', label: 'Base' },
  'ARB': { color: 'bg-sky-500', label: 'Arbitrum' },
};

// Action type colors
const actionColors = {
  'BUY': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: TrendingUp },
  'SELL': { bg: 'bg-red-100', text: 'text-red-700', icon: TrendingDown },
  'SWAP': { bg: 'bg-blue-100', text: 'text-blue-700', icon: Activity },
  'BRIDGE': { bg: 'bg-purple-100', text: 'text-purple-700', icon: Globe },
};

// Edge Score color helper
const getEdgeScoreColor = (score) => {
  if (score >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-red-500 bg-red-50 border-red-200';
};

// Mock actor detailed data with HYBRID identity + Correlation + INFLUENCE data (ETAP 4)
const actorDetailedData = {
  'vitalik': {
    id: 'vitalik',
    real_name: 'Vitalik.eth',
    strategy_name: 'L2 Infrastructure Builder',
    identity_confidence: 0.95,
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    type: 'Whale',
    avatar: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    strategy: 'Smart Money Trader',
    confidence: 87,
    primaryChain: 'ETH',
    latency: 'Early',
    edgeScore: 78,
    
    // ETAP 4: INFLUENCE METRICS
    influenceScore: 72,
    influenceRole: 'Leader',
    followers_count: 4,
    leads_count: 1,
    follows_count: 1,
    avgFollowerLag: 5.8,
    consistency: 0.78,
    
    exitConditions: [
      { trigger: 'Edge Score < 50', action: 'Reduce position by 50%', priority: 'high' },
      { trigger: 'Behavior shifts to Distribution', action: 'Exit all positions', priority: 'critical' },
      { trigger: 'Entry delay > 8h consistently', action: 'Stop following new entries', priority: 'medium' },
    ],
    
    // ETAP 4: ENHANCED CORRELATION & INFLUENCE DATA
    correlation: {
      movesWith: [
        { id: 'a16z', real_name: 'a16z Crypto', strategy_name: 'Institutional Infrastructure Play', similarity: 82, overlap: 'L2 accumulation', overlapType: 'timing' },
        { id: 'pantera', real_name: 'Pantera Capital', strategy_name: 'AI Narrative Accumulator', similarity: 71, overlap: 'ETH ecosystem', overlapType: 'token' },
        { id: 'alameda', real_name: 'Alameda Research', strategy_name: 'SOL Ecosystem Accumulator', similarity: 58, overlap: 'Macro positions', overlapType: 'size' },
      ],
      frontRunners: [
        { id: 'pantera', real_name: 'Pantera Capital', strategy_name: 'AI Narrative Accumulator', avgLeadTime: '+4.2h', frequency: '34%', tradesMatched: 18 },
      ],
      followedBy: [
        { id: 'dwf-labs', real_name: 'DWF Labs', strategy_name: 'Meme Momentum Rider', avgLagTime: '+6.8h', frequency: '28%', tradesMatched: 14 },
        { id: 'unknown-whale-1', real_name: 'Smart Whale #4721', strategy_name: 'High-Risk Flip Trader', avgLagTime: '+12.4h', frequency: '15%', tradesMatched: 7 },
      ],
      cluster: {
        name: 'L2/Infrastructure',
        phase: 'Accumulating',
        size: 12,
        dominantStrategy: 'Smart Money',
      },
      // ETAP 4: INFLUENCE SUMMARY
      influenceSummary: {
        role: 'Early Leader',
        ecosystem: 'ETH/L2',
        avgLag: '~4–6h',
        recommendation: 'Best used as a primary signal in early rotation phases. Strong in L2 narrative plays.',
        strength: 'high',
      },
    },
    
    // CLUSTER INFO - Source of Truth
    cluster: {
      size: 4,
      confidence: 91,
      wallets: [
        { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', role: 'Main', confidence: 100, lastActive: '2h ago' },
        { address: '0x1234...5678', role: 'Cold Storage', confidence: 94, lastActive: '14d ago' },
        { address: '0xabcd...ef01', role: 'Execution', confidence: 88, lastActive: '4h ago' },
        { address: '0x9876...5432', role: 'Bridge', confidence: 82, lastActive: '1d ago' },
      ],
      linkReason: 'Co-spend patterns, shared funding source, timing correlation',
    },
    
    // ACTIONABLE PLAYBOOK
    playbook: {
      currentAction: 'Accumulating',
      tokensToWatch: ['ARB', 'OP', 'ETH'],
      suggestedAction: 'Watch', // Watch / Entry / Reduce / Avoid
      latencyStatus: 'Early',
      confidenceLevel: 87,
      reasoning: 'Actor accumulating L2 tokens ahead of expected catalysts. Entry timing favorable.',
    },
    
    // TIMING EDGE
    timingEdge: {
      medianPrecedePrice: '4.2 hours',
      successRateWithin6h: '71%',
      lateEntryDropoff: '12 hours',
      bestPerformsIn: 'Risk-On',
    },
    
    // FOLLOWER REALITY CHECK - NEW
    followerReality: {
      avgEntryDelay: '5.2h',
      expectedSlippage: '0.8%',
      modeledROI30d: { actor: '+18%', follower: '+9%' },
      maxDDFollower: '11.4%',
      crowdingFactor: 'Low',
    },
    
    // EDGE DECAY - NEW
    edgeDecay: {
      status: 'stable', // stable / degrading / exhausted
      trend: 'Entry delay stable over 30d',
      successRateTrend: '+2% vs last month',
      crowdFollowing: '~120 followers',
      lastUpdated: '2h ago',
    },
    
    // DO NOT FOLLOW IF - NEW
    doNotFollowIf: [
      { condition: 'VIX > 30', reason: 'Actor underperforms in high volatility' },
      { condition: 'Token liquidity < $5M', reason: 'Slippage kills edge' },
      { condition: 'Entry delay > 6h', reason: 'Late entries show -40% ROI' },
    ],
    
    // COPY FEED - Recent Actions
    copyFeed: [
      { id: 1, type: 'BUY', token: 'ARB', size: '$45K', time: '2h ago', price: '$1.42', txHash: '0xabc...123', entryDelay: '1.2h', actorPnl: '+8.2%', followerPnl: '+5.1%' },
      { id: 2, type: 'SWAP', token: 'ETH→USDC', size: '$120K', time: '6h ago', price: '-', txHash: '0xdef...456', entryDelay: '-', actorPnl: '-', followerPnl: '-' },
      { id: 3, type: 'BUY', token: 'OP', size: '$89K', time: '1d ago', price: '$2.18', txHash: '0xghi...789', entryDelay: '2.4h', actorPnl: '+12.4%', followerPnl: '+6.8%' },
      { id: 4, type: 'BRIDGE', token: 'ETH→ARB', size: '$200K', time: '2d ago', price: '-', txHash: '0xjkl...012', entryDelay: '-', actorPnl: '-', followerPnl: '-' },
      { id: 5, type: 'SELL', token: 'PEPE', size: '$28K', time: '3d ago', price: '$0.0000089', txHash: '0xmno...345', entryDelay: '-', actorPnl: '+24%', followerPnl: '+18%' },
    ],
    
    // SIMULATED PORTFOLIO - NEW
    simulatedPortfolio: {
      startingCapital: 10000,
      periods: [
        { period: '7d', actorReturn: 4.2, followerReturn: 2.1, slippageLoss: 0.8, delayLoss: 1.3 },
        { period: '30d', actorReturn: 18.5, followerReturn: 9.2, slippageLoss: 2.4, delayLoss: 6.9 },
        { period: '90d', actorReturn: 42.8, followerReturn: 22.1, slippageLoss: 5.2, delayLoss: 15.5 },
      ],
      trades: {
        total: 47,
        profitable: 31,
        avgWin: '+12.4%',
        avgLoss: '-6.8%',
      },
      impactByDelay: [
        { delay: '1h', returnLoss: '-15%', recommendation: 'Optimal' },
        { delay: '2h', returnLoss: '-28%', recommendation: 'Acceptable' },
        { delay: '4h', returnLoss: '-45%', recommendation: 'Risky' },
        { delay: '6h+', returnLoss: '-62%', recommendation: 'Not recommended' },
      ],
    },
    
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
    
    // TOP EXPOSURES (lite positions)
    topExposures: [
      { token: 'ETH', direction: 'Increasing', allocation: '45%', change: '+5%' },
      { token: 'ARB', direction: 'Increasing', allocation: '20%', change: '+12%' },
      { token: 'OP', direction: 'Stable', allocation: '15%', change: '0%' },
      { token: 'USDC', direction: 'Decreasing', allocation: '10%', change: '-8%' },
    ],
    
    // Asset Behavior Map
    assetBehavior: [
      { token: 'ETH', behavior: 'Accumulate', bias: 'Bullish', allocation: '45%' },
      { token: 'ARB', behavior: 'Trade', bias: 'Active', allocation: '20%' },
      { token: 'OP', behavior: 'Bullish bias', bias: 'Long', allocation: '15%' },
      { token: 'Meme', behavior: 'Quick flips', bias: 'Neutral', allocation: '10%' },
    ],
    
    // Risk & Flags
    riskFlags: {
      sanctions: false,
      mixers: false,
      riskyApprovals: 2,
      unverifiedContracts: 1,
      overallRisk: 12,
    },
    
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
    real_name: 'Alameda Research',
    strategy_name: 'SOL Ecosystem Accumulator',
    identity_confidence: 0.92,
    address: '0x28C6c06298d514Db089934071355E5743bf21d60',
    type: 'Fund',
    avatar: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
    strategy: 'Accumulator & Momentum',
    confidence: 91,
    primaryChain: 'SOL',
    latency: 'Early',
    edgeScore: 86,
    
    // ETAP 4: INFLUENCE METRICS
    influenceScore: 89,
    influenceRole: 'Leader',
    followers_count: 6,
    leads_count: 2,
    follows_count: 1,
    avgFollowerLag: 4.5,
    consistency: 0.85,
    
    exitConditions: [
      { trigger: 'SOL drops below $80', action: 'Exit SOL-related positions', priority: 'high' },
      { trigger: 'Actor starts large distribution', action: 'Follow exit within 24h', priority: 'critical' },
      { trigger: 'Win rate drops below 60%', action: 'Reduce exposure by 30%', priority: 'medium' },
    ],
    correlation: {
      movesWith: [
        { id: 'pantera', real_name: 'Pantera Capital', strategy_name: 'AI Narrative Accumulator', similarity: 76, overlap: 'Narrative timing', overlapType: 'timing' },
        { id: 'vitalik', real_name: 'Vitalik.eth', strategy_name: 'L2 Infrastructure Builder', similarity: 58, overlap: 'Macro positions', overlapType: 'size' },
      ],
      frontRunners: [
        { id: 'a16z', real_name: 'a16z Crypto', strategy_name: 'Institutional Infrastructure Play', avgLeadTime: '+8.2h', frequency: '22%', tradesMatched: 12 },
      ],
      followedBy: [
        { id: 'dwf-labs', real_name: 'DWF Labs', strategy_name: 'Meme Momentum Rider', avgLagTime: '+4.5h', frequency: '41%', tradesMatched: 24 },
      ],
      cluster: { name: 'SOL Ecosystem', phase: 'Rotating', size: 8, dominantStrategy: 'Momentum' },
      // ETAP 4: INFLUENCE SUMMARY
      influenceSummary: {
        role: 'Market Leader',
        ecosystem: 'SOL',
        avgLag: '~4–6h',
        recommendation: 'Primary signal source for SOL ecosystem plays. High conviction moves are particularly reliable.',
        strength: 'very high',
      },
    },
    cluster: {
      size: 12,
      confidence: 94,
      wallets: [
        { address: '0x28C6c06298d514Db089934071355E5743bf21d60', role: 'Main', confidence: 100, lastActive: '45m ago' },
        { address: '0x2222...3333', role: 'Trading', confidence: 96, lastActive: '1h ago' },
        { address: '0x4444...5555', role: 'Cold Storage', confidence: 91, lastActive: '7d ago' },
      ],
      linkReason: 'Shared funding, coordinated trading, timing patterns',
    },
    playbook: {
      currentAction: 'Rotating',
      tokensToWatch: ['SOL', 'JUP', 'PYTH'],
      suggestedAction: 'Entry',
      latencyStatus: 'Early',
      confidenceLevel: 91,
      reasoning: 'Actor rotating into SOL ecosystem with high conviction. Strong entry opportunity.',
    },
    timingEdge: {
      medianPrecedePrice: '6.1 hours',
      successRateWithin6h: '78%',
      lateEntryDropoff: '18 hours',
      bestPerformsIn: 'Risk-On',
    },
    followerReality: {
      avgEntryDelay: '4.8h',
      expectedSlippage: '1.2%',
      modeledROI30d: { actor: '+24%', follower: '+14%' },
      maxDDFollower: '8.2%',
      crowdingFactor: 'Medium',
    },
    edgeDecay: {
      status: 'stable',
      trend: 'Consistent alpha generation',
      successRateTrend: '+5% vs last month',
      crowdFollowing: '~340 followers',
      lastUpdated: '45m ago',
    },
    doNotFollowIf: [
      { condition: 'SOL < $100', reason: 'Actor exits SOL positions in bear' },
      { condition: 'Position size > $500K', reason: 'Market impact too high to replicate' },
      { condition: 'After major narrative shift', reason: 'Actor needs 24-48h to reposition' },
    ],
    copyFeed: [
      { id: 1, type: 'SWAP', token: 'SOL→USDC', size: '$890K', time: '45m ago', price: '-', txHash: '0xabc...111', entryDelay: '-', actorPnl: '-', followerPnl: '-' },
      { id: 2, type: 'BUY', token: 'JUP', size: '$340K', time: '4h ago', price: '$0.89', txHash: '0xdef...222', entryDelay: '1.8h', actorPnl: '+15.2%', followerPnl: '+11.8%' },
    ],
    simulatedPortfolio: {
      startingCapital: 10000,
      periods: [
        { period: '7d', actorReturn: 8.4, followerReturn: 6.2, slippageLoss: 0.6, delayLoss: 1.6 },
        { period: '30d', actorReturn: 32.1, followerReturn: 24.5, slippageLoss: 1.8, delayLoss: 5.8 },
        { period: '90d', actorReturn: 78.5, followerReturn: 58.2, slippageLoss: 4.8, delayLoss: 15.5 },
      ],
      trades: { total: 89, profitable: 63, avgWin: '+18.2%', avgLoss: '-5.4%' },
      impactByDelay: [
        { delay: '1h', returnLoss: '-12%', recommendation: 'Optimal' },
        { delay: '2h', returnLoss: '-22%', recommendation: 'Acceptable' },
        { delay: '4h', returnLoss: '-38%', recommendation: 'Risky' },
        { delay: '6h+', returnLoss: '-55%', recommendation: 'Not recommended' },
      ],
    },
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
    topExposures: [
      { token: 'SOL', direction: 'Increasing', allocation: '35%', change: '+15%' },
      { token: 'BTC', direction: 'Stable', allocation: '30%', change: '0%' },
      { token: 'JUP', direction: 'Increasing', allocation: '15%', change: '+22%' },
    ],
    assetBehavior: [
      { token: 'SOL', behavior: 'Accumulate', bias: 'Very Bullish', allocation: '35%' },
      { token: 'BTC', behavior: 'Hold', bias: 'Long', allocation: '30%' },
      { token: 'DeFi', behavior: 'Rotate', bias: 'Active', allocation: '20%' },
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
    activeAlerts: [{ type: 'Strategy shift', status: 'active' }],
  },
  'dwf-labs': {
    id: 'dwf-labs',
    real_name: 'DWF Labs',
    strategy_name: 'Meme Momentum Rider',
    identity_confidence: 0.88,
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    type: 'Fund',
    avatar: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/89.png',
    strategy: 'Market Maker & Early DEX',
    confidence: 72,
    primaryChain: 'ETH',
    latency: 'Medium',
    edgeScore: 52,
    
    // ETAP 4: INFLUENCE METRICS - FOLLOWER
    influenceScore: 38,
    influenceRole: 'Follower',
    followers_count: 1,
    leads_count: 0,
    follows_count: 3,
    avgFollowerLag: 2.1,
    consistency: 0.52,
    
    exitConditions: [
      { trigger: 'Meme narrative cools off', action: 'Exit meme positions immediately', priority: 'high' },
      { trigger: 'Actor win rate < 50%', action: 'Stop following entirely', priority: 'critical' },
      { trigger: 'Market making spreads widen > 2%', action: 'Pause copy trading', priority: 'medium' },
    ],
    correlation: {
      movesWith: [
        { id: 'unknown-whale-1', real_name: 'Smart Whale #4721', strategy_name: 'High-Risk Flip Trader', similarity: 68, overlap: 'Meme momentum', overlapType: 'token' },
        { id: 'wintermute', real_name: 'Wintermute', strategy_name: 'DeFi Yield Optimizer', similarity: 52, overlap: 'MM operations', overlapType: 'timing' },
      ],
      frontRunners: [
        { id: 'alameda', real_name: 'Alameda Research', strategy_name: 'SOL Ecosystem Accumulator', avgLeadTime: '+4.5h', frequency: '41%', tradesMatched: 24 },
        { id: 'pantera', real_name: 'Pantera Capital', strategy_name: 'AI Narrative Accumulator', avgLeadTime: '+6.2h', frequency: '28%', tradesMatched: 16 },
      ],
      followedBy: [
        { id: 'unknown-whale-1', real_name: 'Smart Whale #4721', strategy_name: 'High-Risk Flip Trader', avgLagTime: '+2.1h', frequency: '52%', tradesMatched: 28 },
      ],
      cluster: { name: 'Meme/Momentum', phase: 'Active', size: 15, dominantStrategy: 'Momentum' },
      // ETAP 4: INFLUENCE SUMMARY
      influenceSummary: {
        role: 'Trend Follower',
        ecosystem: 'Meme',
        avgLag: '~4–6h behind leaders',
        recommendation: 'Use for confirmation only. Do NOT use as primary signal. Best as a late-stage momentum indicator.',
        strength: 'low',
      },
    },
    cluster: {
      size: 8,
      confidence: 86,
      wallets: [
        { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', role: 'Main Trading', confidence: 100, lastActive: '4h ago' },
        { address: '0xdwf1...aa11', role: 'Market Making', confidence: 92, lastActive: '30m ago' },
        { address: '0xdwf2...bb22', role: 'CEX Deposit', confidence: 88, lastActive: '2h ago' },
        { address: '0xdwf3...cc33', role: 'Cold Storage', confidence: 85, lastActive: '5d ago' },
        { address: '0xdwf4...dd44', role: 'Bridge Operations', confidence: 78, lastActive: '1d ago' },
      ],
      linkReason: 'Coordinated market making, shared liquidity pools, timing patterns',
    },
    playbook: {
      currentAction: 'Adding',
      tokensToWatch: ['PEPE', 'WIF', 'BONK'],
      suggestedAction: 'Watch',
      latencyStatus: 'Medium',
      confidenceLevel: 72,
      reasoning: 'Active in meme token market making. High volume but inconsistent alpha. Watch for entry signals.',
    },
    timingEdge: {
      medianPrecedePrice: '2.1 hours',
      successRateWithin6h: '58%',
      lateEntryDropoff: '6 hours',
      bestPerformsIn: 'Risk-On',
    },
    followerReality: {
      avgEntryDelay: '2.8h',
      expectedSlippage: '2.4%',
      modeledROI30d: { actor: '+12%', follower: '+3%' },
      maxDDFollower: '22.5%',
      crowdingFactor: 'High',
    },
    edgeDecay: {
      status: 'degrading',
      trend: 'Success rate declining',
      successRateTrend: '-8% vs last month',
      crowdFollowing: '~890 followers',
      lastUpdated: '4h ago',
    },
    doNotFollowIf: [
      { condition: 'Meme token < $1M mcap', reason: 'Rug pull risk too high' },
      { condition: 'Actor in MM mode', reason: 'Not directional alpha' },
      { condition: 'Within 24h of listing', reason: 'Extreme volatility window' },
    ],
    copyFeed: [
      { id: 1, type: 'BUY', token: 'PEPE', size: '$120K', time: '4h ago', price: '$0.0000142', txHash: '0xdwf...001', entryDelay: '0.8h', actorPnl: '+22%', followerPnl: '+8%' },
      { id: 2, type: 'SELL', token: 'WIF', size: '$89K', time: '8h ago', price: '$2.34', txHash: '0xdwf...002', entryDelay: '-', actorPnl: '+45%', followerPnl: '+28%' },
      { id: 3, type: 'BUY', token: 'FLOKI', size: '$45K', time: '1d ago', price: '$0.000189', txHash: '0xdwf...003', entryDelay: '1.5h', actorPnl: '-12%', followerPnl: '-18%' },
      { id: 4, type: 'SWAP', token: 'ETH→USDT', size: '$500K', time: '1d ago', price: '-', txHash: '0xdwf...004', entryDelay: '-', actorPnl: '-', followerPnl: '-' },
      { id: 5, type: 'BUY', token: 'BONK', size: '$67K', time: '2d ago', price: '$0.0000234', txHash: '0xdwf...005', entryDelay: '2.1h', actorPnl: '+34%', followerPnl: '+12%' },
    ],
    simulatedPortfolio: {
      startingCapital: 10000,
      periods: [
        { period: '7d', actorReturn: 12.8, followerReturn: 4.2, slippageLoss: 2.4, delayLoss: 6.2 },
        { period: '30d', actorReturn: 28.4, followerReturn: 8.9, slippageLoss: 6.8, delayLoss: 12.7 },
        { period: '90d', actorReturn: 52.1, followerReturn: 14.2, slippageLoss: 12.4, delayLoss: 25.5 },
      ],
      trades: { total: 124, profitable: 72, avgWin: '+28.4%', avgLoss: '-14.2%' },
      impactByDelay: [
        { delay: '1h', returnLoss: '-35%', recommendation: 'Risky' },
        { delay: '2h', returnLoss: '-52%', recommendation: 'Not recommended' },
        { delay: '4h', returnLoss: '-68%', recommendation: 'Avoid' },
        { delay: '6h+', returnLoss: '-82%', recommendation: 'Avoid' },
      ],
    },
    whyFollow: [
      { positive: true, text: 'Strong market making presence (+$890K realized)' },
      { positive: true, text: 'Early access to new listings' },
      { positive: false, text: 'Medium risk profile (34/100) — some controversial tokens' },
      { positive: false, text: 'Market making may not translate to copy-worthy trades' },
    ],
    performance: {
      realizedPnl: '+$890K',
      winRate: '58.4%',
      avgHoldTime: '1.8 days',
      avgDrawdown: '14.2%',
      entryDelay: '2.1 hours',
      tradesAnalyzed: 1247,
    },
    strategyFingerprint: {
      dexUsage: 75,
      holdDuration: 20,
      riskTolerance: 65,
      narrativeFocus: 80,
      entryTiming: 55,
    },
    strategies: ['Market Maker', 'Early DEX', 'Momentum', 'Meme Trader'],
    topExposures: [
      { token: 'PEPE', direction: 'Increasing', allocation: '25%', change: '+18%' },
      { token: 'ETH', direction: 'Stable', allocation: '20%', change: '0%' },
      { token: 'WIF', direction: 'Decreasing', allocation: '15%', change: '-12%' },
      { token: 'USDT', direction: 'Increasing', allocation: '30%', change: '+8%' },
    ],
    assetBehavior: [
      { token: 'PEPE', behavior: 'Market Make', bias: 'Active', allocation: '25%' },
      { token: 'Meme', behavior: 'Quick flips', bias: 'Neutral', allocation: '35%' },
      { token: 'ETH', behavior: 'Reserve', bias: 'Stable', allocation: '20%' },
      { token: 'Stables', behavior: 'Liquidity', bias: 'Safe', allocation: '20%' },
    ],
    riskFlags: {
      sanctions: false,
      mixers: false,
      riskyApprovals: 5,
      unverifiedContracts: 3,
      overallRisk: 34,
    },
    currentBehavior: 'Adding',
    behaviorTrend: 'Bullish bias',
    activeAlerts: [
      { type: 'Large position entry', status: 'active' },
      { type: 'Risk increase', status: 'active' },
    ],
  },
  'a16z': {
    id: 'a16z',
    real_name: 'a16z Crypto',
    strategy_name: 'Institutional Infrastructure Play',
    identity_confidence: 0.97,
    address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
    type: 'Fund',
    avatar: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    strategy: 'Smart Money Long-term',
    confidence: 94,
    primaryChain: 'ETH',
    latency: 'Early',
    edgeScore: 91,
    exitConditions: [
      { trigger: 'Major token unlock event', action: 'Reduce position 48h before unlock', priority: 'high' },
      { trigger: 'Fund starts systematic distribution', action: 'Exit within 1 week', priority: 'critical' },
      { trigger: 'L2 narrative exhaustion', action: 'Rotate to new thesis', priority: 'medium' },
    ],
    correlation: {
      movesWith: [
        { id: 'vitalik', strategy_name: 'L2 Infrastructure Builder', similarity: 82, overlap: 'L2 accumulation' },
        { id: 'pantera', strategy_name: 'AI Narrative Accumulator', similarity: 74, overlap: 'Infrastructure thesis' },
      ],
      frontRunners: [],
      followedBy: [
        { id: 'alameda', strategy_name: 'SOL Ecosystem Accumulator', avgLagTime: '+8.2h', frequency: '22%' },
        { id: 'pantera', strategy_name: 'AI Narrative Accumulator', avgLagTime: '+12.4h', frequency: '18%' },
      ],
      cluster: { name: 'Institutional/Infrastructure', phase: 'Accumulating', size: 6 },
    },
    cluster: {
      size: 15,
      confidence: 97,
      wallets: [
        { address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', role: 'Main Treasury', confidence: 100, lastActive: '1d ago' },
        { address: '0xa16z...1111', role: 'Investment #1', confidence: 98, lastActive: '3d ago' },
        { address: '0xa16z...2222', role: 'Investment #2', confidence: 96, lastActive: '5d ago' },
        { address: '0xa16z...3333', role: 'Staking', confidence: 94, lastActive: '7d ago' },
        { address: '0xa16z...4444', role: 'Governance', confidence: 92, lastActive: '2d ago' },
      ],
      linkReason: 'Known fund structure, public disclosures, on-chain governance participation',
    },
    playbook: {
      currentAction: 'Accumulating',
      tokensToWatch: ['OP', 'ARB', 'EIGEN'],
      suggestedAction: 'Entry',
      latencyStatus: 'Early',
      confidenceLevel: 94,
      reasoning: 'Institutional-grade accumulation in L2 infrastructure. Strong conviction play with long time horizon.',
    },
    timingEdge: {
      medianPrecedePrice: '48 hours',
      successRateWithin6h: '82%',
      lateEntryDropoff: '7 days',
      bestPerformsIn: 'All Regimes',
    },
    followerReality: {
      avgEntryDelay: '24h',
      expectedSlippage: '0.3%',
      modeledROI30d: { actor: '+8%', follower: '+7%' },
      maxDDFollower: '5.2%',
      crowdingFactor: 'Low',
    },
    edgeDecay: {
      status: 'stable',
      trend: 'Institutional-grade consistency',
      successRateTrend: '+1% vs last month',
      crowdFollowing: '~2.1K followers',
      lastUpdated: '1d ago',
    },
    doNotFollowIf: [
      { condition: 'Short-term trade (<7d)', reason: 'Actor holds 30-90 days minimum' },
      { condition: 'Capital < $10K', reason: 'Position sizing mismatch' },
      { condition: 'Expecting quick flip', reason: 'This is long-term accumulation only' },
    ],
    copyFeed: [
      { id: 1, type: 'BUY', token: 'OP', size: '$2.1M', time: '1d ago', price: '$2.45', txHash: '0xa16z...001', entryDelay: '12h', actorPnl: '+5.2%', followerPnl: '+4.8%' },
      { id: 2, type: 'BUY', token: 'ARB', size: '$1.8M', time: '3d ago', price: '$1.38', txHash: '0xa16z...002', entryDelay: '24h', actorPnl: '+8.4%', followerPnl: '+7.9%' },
      { id: 3, type: 'BUY', token: 'EIGEN', size: '$950K', time: '5d ago', price: '$4.12', txHash: '0xa16z...003', entryDelay: '18h', actorPnl: '+12.1%', followerPnl: '+11.2%' },
      { id: 4, type: 'BUY', token: 'ETH', size: '$5.2M', time: '7d ago', price: '$3,420', txHash: '0xa16z...004', entryDelay: '48h', actorPnl: '+6.8%', followerPnl: '+6.5%' },
    ],
    simulatedPortfolio: {
      startingCapital: 10000,
      periods: [
        { period: '7d', actorReturn: 2.1, followerReturn: 1.9, slippageLoss: 0.1, delayLoss: 0.1 },
        { period: '30d', actorReturn: 8.4, followerReturn: 7.8, slippageLoss: 0.2, delayLoss: 0.4 },
        { period: '90d', actorReturn: 24.2, followerReturn: 22.8, slippageLoss: 0.6, delayLoss: 0.8 },
      ],
      trades: { total: 23, profitable: 17, avgWin: '+14.2%', avgLoss: '-4.8%' },
      impactByDelay: [
        { delay: '1h', returnLoss: '-2%', recommendation: 'Optimal' },
        { delay: '2h', returnLoss: '-4%', recommendation: 'Optimal' },
        { delay: '4h', returnLoss: '-6%', recommendation: 'Acceptable' },
        { delay: '6h+', returnLoss: '-8%', recommendation: 'Acceptable' },
      ],
    },
    whyFollow: [
      { positive: true, text: 'Exceptional track record (+$4.2M realized)' },
      { positive: true, text: 'Extremely low risk (5/100)' },
      { positive: true, text: 'Early access to quality projects via investments' },
      { positive: false, text: 'Very long hold times — slow alpha extraction' },
    ],
    performance: {
      realizedPnl: '+$4.2M',
      winRate: '74.5%',
      avgHoldTime: '45 days',
      avgDrawdown: '3.8%',
      entryDelay: '24 hours',
      tradesAnalyzed: 234,
    },
    strategyFingerprint: {
      dexUsage: 35,
      holdDuration: 95,
      riskTolerance: 10,
      narrativeFocus: 60,
      entryTiming: 90,
    },
    strategies: ['Smart Money', 'Long-term', 'Infrastructure', 'Governance'],
    topExposures: [
      { token: 'ETH', direction: 'Stable', allocation: '40%', change: '0%' },
      { token: 'OP', direction: 'Increasing', allocation: '20%', change: '+8%' },
      { token: 'ARB', direction: 'Increasing', allocation: '15%', change: '+5%' },
      { token: 'EIGEN', direction: 'Increasing', allocation: '10%', change: '+15%' },
    ],
    assetBehavior: [
      { token: 'ETH', behavior: 'Core Hold', bias: 'Very Bullish', allocation: '40%' },
      { token: 'L2', behavior: 'Accumulate', bias: 'Bullish', allocation: '35%' },
      { token: 'Infra', behavior: 'Strategic', bias: 'Long', allocation: '20%' },
      { token: 'Stables', behavior: 'Reserve', bias: 'Safe', allocation: '5%' },
    ],
    riskFlags: {
      sanctions: false,
      mixers: false,
      riskyApprovals: 0,
      unverifiedContracts: 0,
      overallRisk: 5,
    },
    currentBehavior: 'Accumulating',
    behaviorTrend: 'Stable',
    activeAlerts: [],
  },
  'jump-trading': {
    id: 'jump-trading',
    real_name: 'Jump Trading',
    strategy_name: 'HFT Arbitrage Engine',
    identity_confidence: 0.85,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    type: 'Trader',
    avatar: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    strategy: 'HFT & Arbitrage',
    confidence: 68,
    primaryChain: 'ETH',
    latency: 'Late',
    edgeScore: 28,
    exitConditions: [
      { trigger: 'Any distribution signal', action: 'Do not follow — HFT exit timing impossible', priority: 'critical' },
      { trigger: 'Gas prices > 50 gwei', action: 'Arb edge disappears', priority: 'high' },
      { trigger: 'Cross-exchange spread < 0.1%', action: 'No profitable copy opportunity', priority: 'medium' },
    ],
    correlation: {
      movesWith: [
        { id: 'wintermute', strategy_name: 'DeFi Yield Optimizer', similarity: 64, overlap: 'MM/Arb operations' },
      ],
      frontRunners: [],
      followedBy: [],
      cluster: { name: 'HFT/Arbitrage', phase: 'Active', size: 4 },
    },
    cluster: {
      size: 23,
      confidence: 79,
      wallets: [
        { address: '0x1234567890abcdef1234567890abcdef12345678', role: 'Main', confidence: 100, lastActive: '30m ago' },
        { address: '0xjump...1111', role: 'Arbitrage Bot #1', confidence: 88, lastActive: '5m ago' },
        { address: '0xjump...2222', role: 'Arbitrage Bot #2', confidence: 85, lastActive: '2m ago' },
        { address: '0xjump...3333', role: 'CEX Hot Wallet', confidence: 82, lastActive: '15m ago' },
        { address: '0xjump...4444', role: 'Liquidation Bot', confidence: 75, lastActive: '1h ago' },
      ],
      linkReason: 'Automated trading patterns, MEV activity, cross-exchange arbitrage',
    },
    playbook: {
      currentAction: 'Distributing',
      tokensToWatch: ['ETH', 'BTC', 'USDC'],
      suggestedAction: 'Avoid',
      latencyStatus: 'Late',
      confidenceLevel: 68,
      reasoning: 'Currently reducing risk exposure. HFT strategies not suitable for copy trading due to latency requirements.',
    },
    timingEdge: {
      medianPrecedePrice: '0.5 hours',
      successRateWithin6h: '62%',
      lateEntryDropoff: '1 hour',
      bestPerformsIn: 'High Volatility',
    },
    followerReality: {
      avgEntryDelay: '0.5h',
      expectedSlippage: '3.8%',
      modeledROI30d: { actor: '+22%', follower: '-5%' },
      maxDDFollower: '34.2%',
      crowdingFactor: 'Extreme',
    },
    edgeDecay: {
      status: 'exhausted',
      trend: 'HFT edge not replicable',
      successRateTrend: 'N/A for followers',
      crowdFollowing: '~45 followers',
      lastUpdated: '30m ago',
    },
    doNotFollowIf: [
      { condition: 'Always', reason: 'HFT strategies impossible to replicate' },
      { condition: 'Entry delay > 5min', reason: 'Edge completely gone' },
      { condition: 'During distribution', reason: 'Actor exiting, not entering' },
    ],
    copyFeed: [
      { id: 1, type: 'SELL', token: 'ETH', size: '$340K', time: '30m ago', price: '$3,380', txHash: '0xjump...001', entryDelay: '-', actorPnl: '+2.1%', followerPnl: '-1.2%' },
      { id: 2, type: 'SELL', token: 'BTC', size: '$520K', time: '2h ago', price: '$67,200', txHash: '0xjump...002', entryDelay: '-', actorPnl: '+1.8%', followerPnl: '-0.8%' },
      { id: 3, type: 'SWAP', token: 'ETH→USDC', size: '$890K', time: '4h ago', price: '-', txHash: '0xjump...003', entryDelay: '-', actorPnl: '-', followerPnl: '-' },
      { id: 4, type: 'BRIDGE', token: 'USDC→ARB', size: '$1.2M', time: '6h ago', price: '-', txHash: '0xjump...004', entryDelay: '-', actorPnl: '-', followerPnl: '-' },
      { id: 5, type: 'SELL', token: 'SOL', size: '$180K', time: '1d ago', price: '$142', txHash: '0xjump...005', entryDelay: '-', actorPnl: '+4.2%', followerPnl: '-2.8%' },
    ],
    simulatedPortfolio: {
      startingCapital: 10000,
      periods: [
        { period: '7d', actorReturn: 8.2, followerReturn: -2.4, slippageLoss: 3.8, delayLoss: 6.8 },
        { period: '30d', actorReturn: 22.4, followerReturn: -5.2, slippageLoss: 8.4, delayLoss: 19.2 },
        { period: '90d', actorReturn: 48.2, followerReturn: -12.8, slippageLoss: 18.2, delayLoss: 42.8 },
      ],
      trades: { total: 452, profitable: 281, avgWin: '+4.2%', avgLoss: '-3.8%' },
      impactByDelay: [
        { delay: '1h', returnLoss: '-85%', recommendation: 'Avoid' },
        { delay: '2h', returnLoss: '-95%', recommendation: 'Avoid' },
        { delay: '4h', returnLoss: '-100%', recommendation: 'Avoid' },
        { delay: '6h+', returnLoss: '-100%+', recommendation: 'Avoid' },
      ],
    },
    whyFollow: [
      { positive: true, text: 'Strong overall PnL (+$1.1M realized)' },
      { positive: false, text: 'HFT strategies — impossible to replicate' },
      { positive: false, text: 'Currently in distribution mode (risk-off)' },
      { positive: false, text: 'Medium risk (28/100) due to high leverage usage' },
    ],
    performance: {
      realizedPnl: '+$1.1M',
      winRate: '62.3%',
      avgHoldTime: '0.8 days',
      avgDrawdown: '18.5%',
      entryDelay: '0.5 hours',
      tradesAnalyzed: 4521,
    },
    strategyFingerprint: {
      dexUsage: 90,
      holdDuration: 5,
      riskTolerance: 70,
      narrativeFocus: 15,
      entryTiming: 95,
    },
    strategies: ['HFT', 'Arbitrage', 'DEX Heavy', 'Liquidations'],
    topExposures: [
      { token: 'USDC', direction: 'Increasing', allocation: '45%', change: '+25%' },
      { token: 'ETH', direction: 'Decreasing', allocation: '25%', change: '-15%' },
      { token: 'BTC', direction: 'Decreasing', allocation: '20%', change: '-10%' },
      { token: 'SOL', direction: 'Decreasing', allocation: '10%', change: '-8%' },
    ],
    assetBehavior: [
      { token: 'Majors', behavior: 'Distribute', bias: 'Bearish', allocation: '55%' },
      { token: 'Stables', behavior: 'Accumulate', bias: 'Safe', allocation: '45%' },
    ],
    riskFlags: {
      sanctions: false,
      mixers: false,
      riskyApprovals: 8,
      unverifiedContracts: 2,
      overallRisk: 28,
    },
    currentBehavior: 'Distributing',
    behaviorTrend: 'Risk-off',
    activeAlerts: [{ type: 'Distribution start', status: 'active' }],
  },
  'pantera': {
    id: 'pantera',
    real_name: 'Pantera Capital',
    strategy_name: 'AI Narrative Accumulator',
    identity_confidence: 0.94,
    address: '0x9876543210fedcba9876543210fedcba98765432',
    type: 'Fund',
    avatar: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
    strategy: 'Smart Money & Narrative Rider',
    confidence: 89,
    primaryChain: 'ETH',
    latency: 'Early',
    edgeScore: 84,
    exitConditions: [
      { trigger: 'AI narrative bubble signs', action: 'Scale out of AI positions over 2 weeks', priority: 'high' },
      { trigger: 'Fund rebalancing detected', action: 'Pause new entries for 48h', priority: 'medium' },
      { trigger: 'Edge Score < 60', action: 'Reduce allocation by 40%', priority: 'high' },
    ],
    correlation: {
      movesWith: [
        { id: 'alameda', strategy_name: 'SOL Ecosystem Accumulator', similarity: 76, overlap: 'Narrative timing' },
        { id: 'a16z', strategy_name: 'Institutional Infrastructure Play', similarity: 74, overlap: 'Infrastructure thesis' },
        { id: 'vitalik', strategy_name: 'L2 Infrastructure Builder', similarity: 71, overlap: 'ETH ecosystem' },
      ],
      frontRunners: [
        { id: 'vitalik', strategy_name: 'L2 Infrastructure Builder', avgLeadTime: '+4.2h', frequency: '34%' },
      ],
      followedBy: [
        { id: 'dwf-labs', strategy_name: 'Meme Momentum Rider', avgLagTime: '+6.2h', frequency: '28%' },
        { id: 'a16z', strategy_name: 'Institutional Infrastructure Play', avgLagTime: '+12.4h', frequency: '18%' },
      ],
      cluster: { name: 'AI/Narrative', phase: 'Accumulating', size: 9 },
    },
    cluster: {
      size: 9,
      confidence: 93,
      wallets: [
        { address: '0x9876543210fedcba9876543210fedcba98765432', role: 'Main Fund', confidence: 100, lastActive: '6h ago' },
        { address: '0xpan...1111', role: 'DeFi Allocation', confidence: 95, lastActive: '12h ago' },
        { address: '0xpan...2222', role: 'AI Allocation', confidence: 92, lastActive: '1d ago' },
        { address: '0xpan...3333', role: 'L2 Allocation', confidence: 90, lastActive: '2d ago' },
      ],
      linkReason: 'Fund structure, sector allocation patterns, governance participation',
    },
    playbook: {
      currentAction: 'Accumulating',
      tokensToWatch: ['TAO', 'FET', 'RNDR'],
      suggestedAction: 'Entry',
      latencyStatus: 'Early',
      confidenceLevel: 89,
      reasoning: 'Heavy AI narrative positioning. Early mover in TAO ecosystem. Strong entry opportunity for AI thesis.',
    },
    timingEdge: {
      medianPrecedePrice: '8.4 hours',
      successRateWithin6h: '75%',
      lateEntryDropoff: '24 hours',
      bestPerformsIn: 'Risk-On',
    },
    followerReality: {
      avgEntryDelay: '6h',
      expectedSlippage: '0.9%',
      modeledROI30d: { actor: '+21%', follower: '+15%' },
      maxDDFollower: '9.8%',
      crowdingFactor: 'Medium',
    },
    edgeDecay: {
      status: 'stable',
      trend: 'AI narrative still early',
      successRateTrend: '+3% vs last month',
      crowdFollowing: '~560 followers',
      lastUpdated: '6h ago',
    },
    doNotFollowIf: [
      { condition: 'AI narrative peak', reason: 'Late-cycle = bag holding risk' },
      { condition: 'BTC < $50K', reason: 'Alts underperform in macro fear' },
      { condition: 'Entry delay > 12h', reason: 'Slippage exceeds expected gain' },
    ],
    copyFeed: [
      { id: 1, type: 'BUY', token: 'TAO', size: '$1.2M', time: '6h ago', price: '$456', txHash: '0xpan...001', entryDelay: '4h', actorPnl: '+18.2%', followerPnl: '+14.1%' },
      { id: 2, type: 'BUY', token: 'FET', size: '$680K', time: '1d ago', price: '$2.12', txHash: '0xpan...002', entryDelay: '6h', actorPnl: '+24.5%', followerPnl: '+18.8%' },
      { id: 3, type: 'BUY', token: 'RNDR', size: '$420K', time: '2d ago', price: '$8.45', txHash: '0xpan...003', entryDelay: '8h', actorPnl: '+15.8%', followerPnl: '+10.2%' },
      { id: 4, type: 'SWAP', token: 'ETH→USDC', size: '$2.5M', time: '3d ago', price: '-', txHash: '0xpan...004', entryDelay: '-', actorPnl: '-', followerPnl: '-' },
      { id: 5, type: 'BUY', token: 'INJ', size: '$340K', time: '5d ago', price: '$28.5', txHash: '0xpan...005', entryDelay: '5h', actorPnl: '+32.1%', followerPnl: '+26.4%' },
    ],
    simulatedPortfolio: {
      startingCapital: 10000,
      periods: [
        { period: '7d', actorReturn: 6.2, followerReturn: 4.5, slippageLoss: 0.5, delayLoss: 1.2 },
        { period: '30d', actorReturn: 21.4, followerReturn: 15.2, slippageLoss: 1.8, delayLoss: 4.4 },
        { period: '90d', actorReturn: 58.2, followerReturn: 42.1, slippageLoss: 4.2, delayLoss: 11.9 },
      ],
      trades: { total: 41, profitable: 28, avgWin: '+22.4%', avgLoss: '-8.2%' },
      impactByDelay: [
        { delay: '1h', returnLoss: '-8%', recommendation: 'Optimal' },
        { delay: '2h', returnLoss: '-14%', recommendation: 'Acceptable' },
        { delay: '4h', returnLoss: '-22%', recommendation: 'Acceptable' },
        { delay: '6h+', returnLoss: '-32%', recommendation: 'Risky' },
      ],
    },
    whyFollow: [
      { positive: true, text: 'Excellent PnL track record (+$3.8M realized)' },
      { positive: true, text: 'Very low risk profile (11/100)' },
      { positive: true, text: 'Strong narrative timing — early AI/DeFi mover' },
      { positive: false, text: 'Large positions may cause slippage for followers' },
    ],
    performance: {
      realizedPnl: '+$3.8M',
      winRate: '69.1%',
      avgHoldTime: '21 days',
      avgDrawdown: '6.4%',
      entryDelay: '6 hours',
      tradesAnalyzed: 412,
    },
    strategyFingerprint: {
      dexUsage: 55,
      holdDuration: 75,
      riskTolerance: 20,
      narrativeFocus: 95,
      entryTiming: 85,
    },
    strategies: ['Smart Money', 'Narrative Rider', 'Early DEX', 'Sector Rotation'],
    topExposures: [
      { token: 'AI Tokens', direction: 'Increasing', allocation: '35%', change: '+20%' },
      { token: 'ETH', direction: 'Stable', allocation: '25%', change: '0%' },
      { token: 'DeFi', direction: 'Stable', allocation: '20%', change: '+2%' },
      { token: 'L2', direction: 'Increasing', allocation: '15%', change: '+8%' },
    ],
    assetBehavior: [
      { token: 'TAO', behavior: 'Accumulate', bias: 'Very Bullish', allocation: '15%' },
      { token: 'AI', behavior: 'Accumulate', bias: 'Bullish', allocation: '20%' },
      { token: 'DeFi', behavior: 'Hold', bias: 'Long', allocation: '20%' },
      { token: 'L2', behavior: 'Adding', bias: 'Bullish', allocation: '15%' },
    ],
    riskFlags: {
      sanctions: false,
      mixers: false,
      riskyApprovals: 1,
      unverifiedContracts: 0,
      overallRisk: 11,
    },
    currentBehavior: 'Accumulating',
    behaviorTrend: 'Bullish',
    activeAlerts: [
      { type: 'Large position entry', status: 'active' },
      { type: 'Behavior change', status: 'active' },
      { type: 'Strategy shift', status: 'active' },
    ],
  },
  'wintermute': {
    id: 'wintermute',
    real_name: 'Wintermute',
    strategy_name: 'DeFi Yield Optimizer',
    identity_confidence: 0.87,
    address: '0xfedcba0987654321fedcba0987654321fedcba09',
    type: 'Trader',
    avatar: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
    strategy: 'Market Maker & LP/Yield',
    confidence: 64,
    primaryChain: 'ETH',
    latency: 'Medium',
    edgeScore: 45,
    exitConditions: [
      { trigger: 'Looking for directional alpha', action: 'Wrong actor — use narrative traders instead', priority: 'critical' },
      { trigger: 'LP impermanent loss > 5%', action: 'Exit LP-related copies', priority: 'high' },
      { trigger: 'Volatility regime change', action: 'MM edge disappears in trending markets', priority: 'medium' },
    ],
    correlation: {
      movesWith: [
        { id: 'jump-trading', strategy_name: 'HFT Arbitrage Engine', similarity: 64, overlap: 'MM/Arb operations' },
        { id: 'dwf-labs', strategy_name: 'Meme Momentum Rider', similarity: 52, overlap: 'MM operations' },
      ],
      frontRunners: [],
      followedBy: [],
      cluster: { name: 'Market Making', phase: 'Neutral', size: 5 },
    },
    cluster: {
      size: 31,
      confidence: 82,
      wallets: [
        { address: '0xfedcba0987654321fedcba0987654321fedcba09', role: 'Main MM', confidence: 100, lastActive: '1h ago' },
        { address: '0xwint...1111', role: 'LP Provider #1', confidence: 90, lastActive: '2h ago' },
        { address: '0xwint...2222', role: 'LP Provider #2', confidence: 88, lastActive: '4h ago' },
        { address: '0xwint...3333', role: 'Arbitrage', confidence: 85, lastActive: '30m ago' },
        { address: '0xwint...4444', role: 'CEX Operations', confidence: 80, lastActive: '1h ago' },
        { address: '0xwint...5555', role: 'Bridge Hot', confidence: 78, lastActive: '3h ago' },
      ],
      linkReason: 'Market making infrastructure, LP positions, cross-chain operations',
    },
    playbook: {
      currentAction: 'Rotating',
      tokensToWatch: ['ETH', 'USDC', 'wstETH'],
      suggestedAction: 'Watch',
      latencyStatus: 'Medium',
      confidenceLevel: 64,
      reasoning: 'Neutral market making stance. Rotating between LP positions. Not ideal for directional copy trading.',
    },
    timingEdge: {
      medianPrecedePrice: '1.8 hours',
      successRateWithin6h: '55%',
      lateEntryDropoff: '4 hours',
      bestPerformsIn: 'Sideways',
    },
    followerReality: {
      avgEntryDelay: '1.8h',
      expectedSlippage: '0.4%',
      modeledROI30d: { actor: '+6%', follower: '+2%' },
      maxDDFollower: '12.1%',
      crowdingFactor: 'Low',
    },
    edgeDecay: {
      status: 'stable',
      trend: 'MM strategies consistent but low alpha',
      successRateTrend: '0% vs last month',
      crowdFollowing: '~180 followers',
      lastUpdated: '1h ago',
    },
    doNotFollowIf: [
      { condition: 'Expecting directional alpha', reason: 'Actor is market-neutral' },
      { condition: 'High volatility regime', reason: 'MM spreads widen, edge disappears' },
      { condition: 'Following LP moves', reason: 'Not directional trades' },
    ],
    copyFeed: [
      { id: 1, type: 'BRIDGE', token: 'ETH→BASE', size: '$780K', time: '1h ago', price: '-', txHash: '0xwint...001', entryDelay: '-', actorPnl: '-', followerPnl: '-' },
      { id: 2, type: 'SWAP', token: 'ETH→wstETH', size: '$1.2M', time: '3h ago', price: '-', txHash: '0xwint...002', entryDelay: '-', actorPnl: '-', followerPnl: '-' },
      { id: 3, type: 'SWAP', token: 'USDC→DAI', size: '$2.4M', time: '6h ago', price: '-', txHash: '0xwint...003', entryDelay: '-', actorPnl: '-', followerPnl: '-' },
      { id: 4, type: 'BUY', token: 'CRV', size: '$145K', time: '1d ago', price: '$0.52', txHash: '0xwint...004', entryDelay: '3h', actorPnl: '+8.4%', followerPnl: '+2.1%' },
      { id: 5, type: 'SELL', token: 'LDO', size: '$89K', time: '2d ago', price: '$2.18', txHash: '0xwint...005', entryDelay: '-', actorPnl: '+4.2%', followerPnl: '+1.8%' },
    ],
    simulatedPortfolio: {
      startingCapital: 10000,
      periods: [
        { period: '7d', actorReturn: 1.4, followerReturn: 0.4, slippageLoss: 0.2, delayLoss: 0.8 },
        { period: '30d', actorReturn: 6.2, followerReturn: 2.1, slippageLoss: 0.8, delayLoss: 3.3 },
        { period: '90d', actorReturn: 18.4, followerReturn: 5.8, slippageLoss: 2.4, delayLoss: 10.2 },
      ],
      trades: { total: 389, profitable: 217, avgWin: '+4.8%', avgLoss: '-3.2%' },
      impactByDelay: [
        { delay: '1h', returnLoss: '-45%', recommendation: 'Risky' },
        { delay: '2h', returnLoss: '-58%', recommendation: 'Not recommended' },
        { delay: '4h', returnLoss: '-72%', recommendation: 'Avoid' },
        { delay: '6h+', returnLoss: '-85%', recommendation: 'Avoid' },
      ],
    },
    whyFollow: [
      { positive: true, text: 'Consistent profitability (+$567K realized)' },
      { positive: true, text: 'Low risk market making (22/100)' },
      { positive: false, text: 'Strategies optimized for market making, not speculation' },
      { positive: false, text: 'Neutral bias — no strong directional signals' },
    ],
    performance: {
      realizedPnl: '+$567K',
      winRate: '55.8%',
      avgHoldTime: '2.4 days',
      avgDrawdown: '9.2%',
      entryDelay: '1.8 hours',
      tradesAnalyzed: 3892,
    },
    strategyFingerprint: {
      dexUsage: 95,
      holdDuration: 25,
      riskTolerance: 35,
      narrativeFocus: 20,
      entryTiming: 50,
    },
    strategies: ['Market Maker', 'Arbitrage', 'LP / Yield', 'Stablecoin MM'],
    topExposures: [
      { token: 'ETH', direction: 'Stable', allocation: '30%', change: '0%' },
      { token: 'wstETH', direction: 'Increasing', allocation: '25%', change: '+5%' },
      { token: 'Stables', direction: 'Stable', allocation: '35%', change: '0%' },
      { token: 'CRV/LDO', direction: 'Rotating', allocation: '10%', change: '±3%' },
    ],
    assetBehavior: [
      { token: 'ETH', behavior: 'LP Base', bias: 'Neutral', allocation: '30%' },
      { token: 'LSTs', behavior: 'Yield', bias: 'Long', allocation: '25%' },
      { token: 'Stables', behavior: 'MM Liquidity', bias: 'Safe', allocation: '35%' },
      { token: 'DeFi', behavior: 'Rotate', bias: 'Active', allocation: '10%' },
    ],
    riskFlags: {
      sanctions: false,
      mixers: false,
      riskyApprovals: 3,
      unverifiedContracts: 1,
      overallRisk: 22,
    },
    currentBehavior: 'Rotating',
    behaviorTrend: 'Neutral',
    activeAlerts: [],
  },
  'unknown-whale-1': {
    id: 'unknown-whale-1',
    real_name: 'Smart Whale #4721',
    strategy_name: 'High-Risk Flip Trader',
    identity_confidence: 0.32,
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    type: 'Whale',
    avatar: null,
    strategy: 'Momentum & Quick Flips',
    confidence: 38,
    primaryChain: 'SOL',
    latency: 'Late',
    edgeScore: 15,
    exitConditions: [
      { trigger: 'Always', action: 'Do not follow this actor', priority: 'critical' },
      { trigger: 'Any entry signal', action: 'Ignore — negative expected value', priority: 'critical' },
      { trigger: 'Behavior change', action: 'Still avoid — track record too poor', priority: 'high' },
    ],
    correlation: {
      movesWith: [
        { id: 'dwf-labs', strategy_name: 'Meme Momentum Rider', similarity: 68, overlap: 'Meme momentum' },
      ],
      frontRunners: [
        { id: 'dwf-labs', strategy_name: 'Meme Momentum Rider', avgLeadTime: '+2.1h', frequency: '52%' },
        { id: 'alameda', strategy_name: 'SOL Ecosystem Accumulator', avgLeadTime: '+8.4h', frequency: '31%' },
      ],
      followedBy: [],
      cluster: { name: 'High-Risk Momentum', phase: 'Exiting', size: 3 },
    },
    cluster: {
      size: 2,
      confidence: 67,
      wallets: [
        { address: '0xabcdef1234567890abcdef1234567890abcdef12', role: 'Main', confidence: 100, lastActive: '15m ago' },
        { address: '0xwhale...1111', role: 'Secondary', confidence: 67, lastActive: '1h ago' },
      ],
      linkReason: 'Shared funding source, correlated exit timing',
    },
    playbook: {
      currentAction: 'Exiting',
      tokensToWatch: [],
      suggestedAction: 'Avoid',
      latencyStatus: 'Late',
      confidenceLevel: 38,
      reasoning: 'Actor in full exit mode with negative PnL. High risk, inconsistent strategy. Avoid following.',
    },
    timingEdge: {
      medianPrecedePrice: '-2.1 hours',
      successRateWithin6h: '41%',
      lateEntryDropoff: '2 hours',
      bestPerformsIn: 'Unknown',
    },
    followerReality: {
      avgEntryDelay: '4.2h',
      expectedSlippage: '4.5%',
      modeledROI30d: { actor: '-8%', follower: '-18%' },
      maxDDFollower: '42.8%',
      crowdingFactor: 'Low',
    },
    edgeDecay: {
      status: 'exhausted',
      trend: 'No consistent edge detected',
      successRateTrend: '-15% vs last month',
      crowdFollowing: '~12 followers',
      lastUpdated: '15m ago',
    },
    doNotFollowIf: [
      { condition: 'Always', reason: 'Negative expected value' },
      { condition: 'Actor has negative PnL', reason: 'Losing money consistently' },
      { condition: 'During exit mode', reason: 'Sells into weakness' },
    ],
    copyFeed: [
      { id: 1, type: 'SELL', token: 'BONK', size: '$89K', time: '15m ago', price: '$0.0000189', txHash: '0xwhale...001', entryDelay: '-', actorPnl: '-18%', followerPnl: '-24%' },
      { id: 2, type: 'SELL', token: 'WIF', size: '$124K', time: '1h ago', price: '$2.01', txHash: '0xwhale...002', entryDelay: '-', actorPnl: '-12%', followerPnl: '-18%' },
      { id: 3, type: 'SELL', token: 'POPCAT', size: '$45K', time: '3h ago', price: '$0.89', txHash: '0xwhale...003', entryDelay: '-', actorPnl: '-8%', followerPnl: '-14%' },
      { id: 4, type: 'SWAP', token: 'SOL→USDC', size: '$340K', time: '6h ago', price: '-', txHash: '0xwhale...004', entryDelay: '-', actorPnl: '-', followerPnl: '-' },
    ],
    simulatedPortfolio: {
      startingCapital: 10000,
      periods: [
        { period: '7d', actorReturn: -4.2, followerReturn: -8.8, slippageLoss: 2.8, delayLoss: 1.8 },
        { period: '30d', actorReturn: -8.4, followerReturn: -18.2, slippageLoss: 5.4, delayLoss: 4.4 },
        { period: '90d', actorReturn: -22.1, followerReturn: -38.4, slippageLoss: 8.2, delayLoss: 8.1 },
      ],
      trades: { total: 18, profitable: 7, avgWin: '+12.4%', avgLoss: '-24.8%' },
      impactByDelay: [
        { delay: '1h', returnLoss: '+10%', recommendation: 'Makes losses worse' },
        { delay: '2h', returnLoss: '+18%', recommendation: 'Avoid' },
        { delay: '4h', returnLoss: '+28%', recommendation: 'Avoid' },
        { delay: '6h+', returnLoss: '+35%', recommendation: 'Avoid' },
      ],
    },
    whyFollow: [
      { positive: false, text: 'Negative PnL (-$124K realized)' },
      { positive: false, text: 'High risk profile (67/100)' },
      { positive: false, text: 'Currently exiting all positions' },
      { positive: false, text: 'Inconsistent strategy — momentum chaser' },
    ],
    performance: {
      realizedPnl: '-$124K',
      winRate: '41.2%',
      avgHoldTime: '0.6 days',
      avgDrawdown: '28.4%',
      entryDelay: '4.2 hours',
      tradesAnalyzed: 189,
    },
    strategyFingerprint: {
      dexUsage: 85,
      holdDuration: 10,
      riskTolerance: 90,
      narrativeFocus: 70,
      entryTiming: 25,
    },
    strategies: ['Momentum', 'Quick Flips', 'Meme Chaser'],
    topExposures: [
      { token: 'USDC', direction: 'Increasing', allocation: '65%', change: '+40%' },
      { token: 'SOL', direction: 'Decreasing', allocation: '20%', change: '-25%' },
      { token: 'Meme', direction: 'Decreasing', allocation: '15%', change: '-35%' },
    ],
    assetBehavior: [
      { token: 'Meme', behavior: 'Exit', bias: 'Bearish', allocation: '15%' },
      { token: 'SOL', behavior: 'Exit', bias: 'Bearish', allocation: '20%' },
      { token: 'Stables', behavior: 'Accumulate', bias: 'Safe', allocation: '65%' },
    ],
    riskFlags: {
      sanctions: false,
      mixers: true,
      riskyApprovals: 12,
      unverifiedContracts: 8,
      overallRisk: 67,
    },
    currentBehavior: 'Exiting',
    behaviorTrend: 'Bearish',
    activeAlerts: [],
  },
};

// Default actor
const defaultActor = {
  id: 'unknown',
  real_name: 'Unknown Actor',
  strategy_name: 'Unknown Strategy',
  identity_confidence: 0,
  type: 'Unknown',
  confidence: 0,
  edgeScore: 0,
  exitConditions: [],
  correlation: {
    movesWith: [],
    frontRunners: [],
    followedBy: [],
    cluster: { name: '-', phase: '-', size: 0 },
  },
  cluster: { size: 0, confidence: 0, wallets: [], linkReason: '-' },
  playbook: { currentAction: '-', tokensToWatch: [], suggestedAction: 'Avoid', latencyStatus: '-', confidenceLevel: 0, reasoning: '-' },
  timingEdge: { medianPrecedePrice: '-', successRateWithin6h: '-', lateEntryDropoff: '-', bestPerformsIn: '-' },
  copyFeed: [],
  simulatedPortfolio: {
    startingCapital: 10000,
    periods: [],
    trades: { total: 0, profitable: 0, avgWin: '-', avgLoss: '-' },
    impactByDelay: [],
  },
  whyFollow: [],
  performance: { realizedPnl: '-', winRate: '-', avgHoldTime: '-', avgDrawdown: '-', entryDelay: '-', tradesAnalyzed: 0 },
  strategyFingerprint: { dexUsage: 0, holdDuration: 0, riskTolerance: 0, narrativeFocus: 0, entryTiming: 0 },
  strategies: [],
  topExposures: [],
  assetBehavior: [],
  riskFlags: { sanctions: false, mixers: false, riskyApprovals: 0, unverifiedContracts: 0, overallRisk: 50 },
  currentBehavior: '-',
  behaviorTrend: '-',
  activeAlerts: [],
};

// Suggested action colors
const actionSuggestionColors = {
  'Watch': 'bg-blue-100 text-blue-700 border-blue-200',
  'Entry': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Reduce': 'bg-amber-100 text-amber-700 border-amber-200',
  'Avoid': 'bg-red-100 text-red-700 border-red-200',
};

// Confidence colors
const getConfidenceColor = (confidence) => {
  if (confidence >= 70) return { bg: 'bg-[#16C784]', text: 'text-[#16C784]', label: 'High' };
  if (confidence >= 40) return { bg: 'bg-[#F5A524]', text: 'text-[#F5A524]', label: 'Medium' };
  return { bg: 'bg-[#EF4444]', text: 'text-[#EF4444]', label: 'Low' };
};

// Strategy Radar
const StrategyRadar = ({ fingerprint }) => {
  const items = [
    { key: 'dexUsage', label: 'DEX Usage' },
    { key: 'holdDuration', label: 'Hold Duration' },
    { key: 'riskTolerance', label: 'Risk Tolerance' },
    { key: 'narrativeFocus', label: 'Narrative Focus' },
    { key: 'entryTiming', label: 'Entry Timing' },
  ];

  return (
    <div className="space-y-2.5">
      {items.map(item => (
        <div key={item.key}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-900">{fingerprint[item.key]}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
  const [showClusterDetails, setShowClusterDetails] = useState(false);
  const [feedTimeframe, setFeedTimeframe] = useState('24h');
  const [copiedAddress, setCopiedAddress] = useState(null);
  
  // Simulated Portfolio state
  const [simCapital, setSimCapital] = useState(10000);
  const [simPeriod, setSimPeriod] = useState('30d');
  const [showTradeDetails, setShowTradeDetails] = useState(false);
  
  // HYBRID Identity Toggle: Default = Strategy names (anonymized)
  const [showRealNames, setShowRealNames] = useState(false);

  const actor = actorDetailedData[actorId] || defaultActor;
  const confidenceColor = getConfidenceColor(actor.confidence);
  const chain = chainConfig[actor.primaryChain] || { color: 'bg-gray-500', label: actor.primaryChain };
  
  // HYBRID identity: show strategy_name by default, real_name when toggle is on
  const displayName = showRealNames ? actor.real_name : actor.strategy_name;
  const secondaryName = showRealNames ? actor.strategy_name : (actor.identity_confidence >= 0.8 ? actor.real_name : null);

  // Calculate simulated results
  const getSimulatedResults = () => {
    const sim = actor.simulatedPortfolio;
    if (!sim || !sim.periods || sim.periods.length === 0) return null;
    const periodData = sim.periods.find(p => p.period === simPeriod) || sim.periods[0];
    const actorFinalValue = simCapital * (1 + periodData.actorReturn / 100);
    const followerFinalValue = simCapital * (1 + periodData.followerReturn / 100);
    const returnGap = periodData.actorReturn - periodData.followerReturn;
    return {
      ...periodData,
      actorFinalValue,
      followerFinalValue,
      returnGap,
      slippageCost: simCapital * (periodData.slippageLoss / 100),
      delayCost: simCapital * (periodData.delayLoss / 100),
    };
  };

  const simResults = getSimulatedResults();

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

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
        
        <div className="px-4 py-6 max-w-[1400px] mx-auto">
          {/* Back link */}
          <Link 
            to="/actors" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Actors
          </Link>

          {/* Actor Header */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  {actor.avatar ? (
                    <img src={actor.avatar} alt={actor.label} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
                    {/* Secondary name hint */}
                    {secondaryName && (
                      <span className="text-sm text-gray-400">({secondaryName})</span>
                    )}
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">{actor.type}</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${chain.color}`} />
                      <span className="text-xs text-gray-500">{chain.label}</span>
                    </div>
                    {/* EDGE SCORE BADGE */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-sm font-bold ${getEdgeScoreColor(actor.edgeScore)}`}>
                          <Gauge className="w-3.5 h-3.5" />
                          {actor.edgeScore}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white max-w-xs">
                        <p className="text-xs font-semibold mb-1">Edge Score: {actor.edgeScore}/100</p>
                        <p className="text-xs text-gray-300">Timing (30%) + ROI Adjusted (25%) + Stability (20%) + Risk (15%) + Signals (10%)</p>
                      </TooltipContent>
                    </Tooltip>
                    {/* IDENTITY TOGGLE */}
                    <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5 ml-2">
                      <button
                        onClick={() => setShowRealNames(false)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          !showRealNames ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Strategy
                      </button>
                      <button
                        onClick={() => setShowRealNames(true)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          showRealNames ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Real Name
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">Strategy: <span className="font-semibold text-gray-900">{actor.strategy}</span></span>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${confidenceColor.bg}`} />
                      <span className={`font-semibold ${confidenceColor.text}`}>{actor.confidence}%</span>
                      <span className="text-gray-500">confidence</span>
                    </div>
                    {/* Identity confidence indicator */}
                    {actor.identity_confidence && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-500">
                          ID: <span className={`font-semibold ${actor.identity_confidence >= 0.8 ? 'text-emerald-600' : actor.identity_confidence >= 0.5 ? 'text-amber-600' : 'text-red-500'}`}>
                            {(actor.identity_confidence * 100).toFixed(0)}%
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                  {/* Cluster info teaser */}
                  <button 
                    onClick={() => setShowClusterDetails(!showClusterDetails)}
                    className="mt-2 flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Cluster of <span className="font-semibold text-gray-700">{actor.cluster.size} wallets</span> ({actor.cluster.confidence}% confidence)</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showClusterDetails ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFollowed(!isFollowed)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isFollowed ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  Alerts
                </button>
                <Link
                  to="/watchlist"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Watchlist
                </Link>
              </div>
            </div>

            {/* Cluster Details - Expandable */}
            {showClusterDetails && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Known Wallets (Source of Truth)</h3>
                  <span className="text-xs text-gray-500">{actor.cluster.linkReason}</span>
                </div>
                <div className="space-y-2">
                  {actor.cluster.wallets.map((wallet, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Wallet className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono text-gray-900">{wallet.address}</code>
                            <button onClick={() => handleCopyAddress(wallet.address)} className="p-1 hover:bg-gray-200 rounded">
                              {copiedAddress === wallet.address ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-medium text-gray-600">{wallet.role}</span>
                            <span className="text-xs text-gray-500">Last active: {wallet.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{wallet.confidence}% conf</span>
                        <Link to={`/wallets?address=${wallet.address}`} className="p-1 hover:bg-gray-200 rounded">
                          <ArrowUpRight className="w-4 h-4 text-gray-400" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* ACTIONABLE PLAYBOOK - NEW TOP SECTION */}
              <div className="bg-gray-900 text-white rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg font-bold">Actionable Playbook</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${actionSuggestionColors[actor.playbook.suggestedAction]}`}>
                    {actor.playbook.suggestedAction}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <div className="text-xs text-gray-400 mb-1">Current Action</div>
                    <div className="text-lg font-bold">{actor.playbook.currentAction}</div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <div className="text-xs text-gray-400 mb-1">Latency Status</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        actor.playbook.latencyStatus === 'Early' ? 'bg-emerald-500/20 text-emerald-400' :
                        actor.playbook.latencyStatus === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {actor.playbook.latencyStatus}
                      </span>
                      <span className="text-lg font-bold">{actor.playbook.confidenceLevel}%</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Tokens to Watch</div>
                  <div className="flex items-center gap-2">
                    {actor.playbook.tokensToWatch.map((token, i) => (
                      <Link 
                        key={i} 
                        to={`/tokens?search=${token}`}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors"
                      >
                        {token}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Reasoning</div>
                  <p className="text-sm">{actor.playbook.reasoning}</p>
                </div>
              </div>

              {/* FOLLOWER REALITY CHECK - NEW */}
              {actor.followerReality && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-bold text-gray-900">Follower Reality Check</h2>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1 hover:bg-blue-100 rounded"><Info className="w-4 h-4 text-blue-400" /></button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white max-w-xs">
                        <p className="text-xs">Expected returns adjusted for entry delay, slippage, and crowding. This is what YOU can realistically expect.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-blue-100">
                      <div className="text-xs text-gray-500 mb-1">Avg Entry Delay</div>
                      <div className="text-lg font-bold text-gray-900">{actor.followerReality.avgEntryDelay}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-blue-100">
                      <div className="text-xs text-gray-500 mb-1">Expected Slippage</div>
                      <div className="text-lg font-bold text-gray-900">{actor.followerReality.expectedSlippage}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-blue-100">
                      <div className="text-xs text-gray-500 mb-1">Actor ROI (30d)</div>
                      <div className={`text-lg font-bold ${actor.followerReality.modeledROI30d.actor.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                        {actor.followerReality.modeledROI30d.actor}
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-sm">
                      <div className="text-xs text-blue-600 font-medium mb-1">Your Modeled ROI</div>
                      <div className={`text-xl font-bold ${actor.followerReality.modeledROI30d.follower.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                        {actor.followerReality.modeledROI30d.follower}
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-blue-100">
                      <div className="text-xs text-gray-500 mb-1">Max DD (Follower)</div>
                      <div className="text-lg font-bold text-amber-600">{actor.followerReality.maxDDFollower}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <span>Crowding Factor:</span>
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      actor.followerReality.crowdingFactor === 'Low' ? 'bg-emerald-100 text-emerald-700' :
                      actor.followerReality.crowdingFactor === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      actor.followerReality.crowdingFactor === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {actor.followerReality.crowdingFactor}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{actor.followerReality.crowdingFactor === 'Low' ? 'Minimal impact on entry' : 
                           actor.followerReality.crowdingFactor === 'Medium' ? 'Some slippage expected' :
                           'High competition for entries'}</span>
                  </div>
                </div>
              )}

              {/* EDGE DECAY INDICATOR - NEW */}
              {actor.edgeDecay && (
                <div className={`rounded-2xl p-5 border ${
                  actor.edgeDecay.status === 'stable' ? 'bg-emerald-50 border-emerald-200' :
                  actor.edgeDecay.status === 'degrading' ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        actor.edgeDecay.status === 'stable' ? 'bg-emerald-100' :
                        actor.edgeDecay.status === 'degrading' ? 'bg-amber-100' :
                        'bg-red-100'
                      }`}>
                        {actor.edgeDecay.status === 'stable' ? <Check className="w-5 h-5 text-emerald-600" /> :
                         actor.edgeDecay.status === 'degrading' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                         <X className="w-5 h-5 text-red-600" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Edge {actor.edgeDecay.status === 'stable' ? 'Stable ✓' : 
                                actor.edgeDecay.status === 'degrading' ? 'Degrading ⚠' : 
                                'Exhausted ✗'}
                        </h3>
                        <p className="text-sm text-gray-600">{actor.edgeDecay.trend}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>Success rate: <span className={`font-semibold ${
                        actor.edgeDecay.successRateTrend.startsWith('+') ? 'text-emerald-600' :
                        actor.edgeDecay.successRateTrend.startsWith('-') ? 'text-red-500' : 'text-gray-600'
                      }`}>{actor.edgeDecay.successRateTrend}</span></div>
                      <div className="mt-1">{actor.edgeDecay.crowdFollowing}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* CORRELATION & INFLUENCE - ETAP 4 ENHANCED */}
              {actor.correlation && (
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-violet-600" />
                      <h2 className="text-lg font-bold text-gray-900">Correlation & Influence</h2>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1 hover:bg-violet-100 rounded"><Info className="w-4 h-4 text-violet-400" /></button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white max-w-xs">
                        <p className="text-xs">Behavioral patterns and timing relationships with other actors. Use to find earlier signals or avoid crowded trades.</p>
                        <p className="text-xs text-gray-400 mt-1">Note: Behavioral correlation, not causal truth.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* ETAP 4: INFLUENCE SUMMARY - Key Decision Block */}
                  {actor.correlation.influenceSummary && (
                    <div className={`mb-4 p-4 rounded-xl border-2 ${
                      actor.correlation.influenceSummary.strength === 'very high' ? 'bg-emerald-50 border-emerald-300' :
                      actor.correlation.influenceSummary.strength === 'high' ? 'bg-green-50 border-green-200' :
                      actor.correlation.influenceSummary.strength === 'medium' ? 'bg-amber-50 border-amber-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          actor.correlation.influenceSummary.strength === 'very high' ? 'bg-emerald-100' :
                          actor.correlation.influenceSummary.strength === 'high' ? 'bg-green-100' :
                          actor.correlation.influenceSummary.strength === 'medium' ? 'bg-amber-100' :
                          'bg-red-100'
                        }`}>
                          {actor.correlation.influenceSummary.role.includes('Leader') ? (
                            <TrendingUp className={`w-5 h-5 ${
                              actor.correlation.influenceSummary.strength === 'very high' ? 'text-emerald-600' :
                              actor.correlation.influenceSummary.strength === 'high' ? 'text-green-600' : 'text-amber-600'
                            }`} />
                          ) : actor.correlation.influenceSummary.role.includes('Follower') ? (
                            <Users className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Activity className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-bold ${
                              actor.correlation.influenceSummary.strength === 'very high' ? 'text-emerald-700' :
                              actor.correlation.influenceSummary.strength === 'high' ? 'text-green-700' :
                              actor.correlation.influenceSummary.strength === 'medium' ? 'text-amber-700' :
                              'text-red-700'
                            }`}>
                              {actor.correlation.influenceSummary.role}
                            </span>
                            <span className="text-xs text-gray-500">in {actor.correlation.influenceSummary.ecosystem}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{actor.correlation.influenceSummary.recommendation}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>Avg follower lag: <span className="font-medium text-gray-700">{actor.correlation.influenceSummary.avgLag}</span></span>
                            {actor.influenceScore && (
                              <span className="px-2 py-0.5 bg-white rounded-full border">
                                Influence Score: <span className="font-bold text-violet-600">{actor.influenceScore}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Strategy Cluster */}
                  {actor.correlation.cluster && (
                    <div className="mb-4 p-3 bg-violet-100 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-violet-600 font-medium">Strategy Cluster</span>
                          <div className="font-bold text-gray-900">{actor.correlation.cluster.name}</div>
                          {actor.correlation.cluster.dominantStrategy && (
                            <div className="text-xs text-gray-500 mt-0.5">Dominant: {actor.correlation.cluster.dominantStrategy}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            actor.correlation.cluster.phase === 'Accumulating' ? 'bg-emerald-100 text-emerald-700' :
                            actor.correlation.cluster.phase === 'Distributing' ? 'bg-red-100 text-red-700' :
                            actor.correlation.cluster.phase === 'Rotating' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {actor.correlation.cluster.phase}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{actor.correlation.cluster.size} actors in cluster</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Moves With (Similar Behavior) - ENHANCED with overlap type */}
                  {actor.correlation.movesWith && actor.correlation.movesWith.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <Link2 className="w-3.5 h-3.5" />
                        Moves With (Similar Behavior)
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 text-white max-w-xs">
                            <p className="text-xs">Behavioral similarity, not copying. These actors show correlated patterns without clear leader/follower relationship.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="space-y-2">
                        {actor.correlation.movesWith.map((related, i) => (
                          <Link 
                            key={i} 
                            to={`/actors/${related.id}`}
                            className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-violet-100 hover:border-violet-300 transition-colors"
                          >
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{showRealNames ? related.real_name || related.strategy_name : related.strategy_name}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-500">{related.overlap}</span>
                                {related.overlapType && (
                                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                                    related.overlapType === 'timing' ? 'bg-blue-100 text-blue-600' :
                                    related.overlapType === 'token' ? 'bg-purple-100 text-purple-600' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {related.overlapType}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <div className="text-sm font-bold text-violet-600">{related.similarity}%</div>
                                <div className="text-xs text-gray-400">similarity</div>
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Front-Runners - RENAMED in ETAP 4 */}
                  {actor.correlation.frontRunners && actor.correlation.frontRunners.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Often Front-Runs This Actor
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-amber-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 text-white max-w-xs">
                            <p className="text-xs font-medium text-amber-300 mb-1">⚠️ This actor often front-runs you</p>
                            <p className="text-xs">These actors typically move BEFORE this one enters. Consider following them for earlier signals.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="space-y-2">
                        {actor.correlation.frontRunners.map((runner, i) => (
                          <Link 
                            key={i} 
                            to={`/actors/${runner.id}`}
                            className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-200 hover:border-amber-400 transition-colors"
                          >
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{showRealNames ? runner.real_name || runner.strategy_name : runner.strategy_name}</div>
                              <div className="text-xs text-amber-700">Leads by {runner.avgLeadTime}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-xs font-medium text-amber-600">{runner.frequency} of trades</div>
                                {runner.tradesMatched && (
                                  <div className="text-xs text-gray-400">{runner.tradesMatched} matches</div>
                                )}
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-amber-500" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Followed By - WHO ACTS AFTER */}
                  {actor.correlation.followedBy && actor.correlation.followedBy.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        Usually Follows This Actor
                      </div>
                      <div className="space-y-2">
                        {actor.correlation.followedBy.map((follower, i) => (
                          <Link 
                            key={i} 
                            to={`/actors/${follower.id}`}
                            className="flex items-center justify-between p-2.5 bg-blue-50 rounded-xl border border-blue-100 hover:border-blue-300 transition-colors"
                          >
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{showRealNames ? follower.real_name || follower.strategy_name : follower.strategy_name}</div>
                              <div className="text-xs text-blue-600">Lags by {follower.avgLagTime}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs font-medium text-blue-600">{follower.frequency} of trades</div>
                              <ArrowUpRight className="w-4 h-4 text-blue-400" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No correlation data */}
                  {(!actor.correlation.movesWith || actor.correlation.movesWith.length === 0) && 
                   (!actor.correlation.frontRunners || actor.correlation.frontRunners.length === 0) && 
                   (!actor.correlation.followedBy || actor.correlation.followedBy.length === 0) && (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No significant correlations detected
                    </div>
                  )}
                </div>
              )}

              {/* DO NOT FOLLOW IF - NEW */}
              {actor.doNotFollowIf && actor.doNotFollowIf.length > 0 && (
                <div className="bg-white border border-red-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-bold text-gray-900">Do NOT Follow If</h2>
                  </div>
                  <div className="space-y-2">
                    {actor.doNotFollowIf.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-gray-900">{item.condition}</span>
                          <span className="text-gray-500"> — </span>
                          <span className="text-gray-600">{item.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXIT CONDITIONS - NEW */}
              {actor.exitConditions && actor.exitConditions.length > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <LogOut className="w-5 h-5 text-orange-600" />
                      <h2 className="text-lg font-bold text-gray-900">Exit Conditions</h2>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1 hover:bg-orange-100 rounded"><Info className="w-4 h-4 text-orange-400" /></button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white max-w-xs">
                        <p className="text-xs">Pre-defined rules for when to stop following this actor. Setting these up front prevents emotional decision-making.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="space-y-2">
                    {actor.exitConditions.map((condition, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${
                        condition.priority === 'critical' ? 'bg-red-100 border border-red-200' :
                        condition.priority === 'high' ? 'bg-orange-100 border border-orange-200' :
                        'bg-amber-50 border border-amber-200'
                      }`}>
                        <div className={`p-1 rounded ${
                          condition.priority === 'critical' ? 'bg-red-200' :
                          condition.priority === 'high' ? 'bg-orange-200' :
                          'bg-amber-200'
                        }`}>
                          <LogOut className={`w-3.5 h-3.5 ${
                            condition.priority === 'critical' ? 'text-red-700' :
                            condition.priority === 'high' ? 'text-orange-700' :
                            'text-amber-700'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-gray-900 text-sm">{condition.trigger}</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium uppercase ${
                              condition.priority === 'critical' ? 'bg-red-200 text-red-800' :
                              condition.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                              'bg-amber-200 text-amber-800'
                            }`}>
                              {condition.priority}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">→ {condition.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-orange-200 text-xs text-orange-700">
                    <span className="font-semibold">Pro tip:</span> Set these as alerts to get notified when conditions are met
                  </div>
                </div>
              )}

              {/* TIMING EDGE - NEW */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-bold text-gray-900">Timing Edge</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 hover:bg-gray-100 rounded"><Info className="w-4 h-4 text-gray-400" /></button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white max-w-xs">
                      <p className="text-xs">How early this actor moves vs price action — key for following profitably</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="text-xs text-emerald-600 mb-1">Precedes Price By</div>
                    <div className="text-xl font-bold text-emerald-700">{actor.timingEdge.medianPrecedePrice}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-xs text-blue-600 mb-1">Success Rate (≤6h)</div>
                    <div className="text-xl font-bold text-blue-700">{actor.timingEdge.successRateWithin6h}</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="text-xs text-amber-600 mb-1">Late Entry Drops After</div>
                    <div className="text-xl font-bold text-amber-700">{actor.timingEdge.lateEntryDropoff}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Best Performs In</div>
                    <div className="text-xl font-bold text-gray-900">{actor.timingEdge.bestPerformsIn}</div>
                  </div>
                </div>
              </div>

              {/* SIMULATED PORTFOLIO - ETAP 2 */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-700" />
                    <h2 className="text-lg font-bold text-gray-900">Simulated Portfolio</h2>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1 hover:bg-indigo-100 rounded"><Info className="w-4 h-4 text-indigo-400" /></button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white max-w-xs">
                        <p className="text-xs">What-if calculator showing hypothetical results if you had copied this actor&apos;s trades with realistic delays and slippage.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg font-medium">BETA</span>
                </div>

                {/* Capital Input + Period Selector */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600 mb-1 block">Starting Capital</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={simCapital}
                        onChange={(e) => setSimCapital(Number(e.target.value) || 10000)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-200">
                    {['7d', '30d', '90d'].map(p => (
                      <button
                        key={p}
                        onClick={() => setSimPeriod(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          simPeriod === p ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Comparison */}
                {simResults && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Actor Results */}
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Actor&apos;s Return</div>
                        <div className={`text-2xl font-bold ${simResults.actorReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {simResults.actorReturn >= 0 ? '+' : ''}{simResults.actorReturn.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          ${simResults.actorFinalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                      </div>

                      {/* Follower Results */}
                      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-4 border border-indigo-200">
                        <div className="text-xs text-indigo-600 mb-1">Your Simulated Return</div>
                        <div className={`text-2xl font-bold ${simResults.followerReturn >= 0 ? 'text-indigo-700' : 'text-red-600'}`}>
                          {simResults.followerReturn >= 0 ? '+' : ''}{simResults.followerReturn.toFixed(1)}%
                        </div>
                        <div className="text-sm text-indigo-600 mt-1">
                          ${simResults.followerFinalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                    </div>

                    {/* Return Gap Breakdown */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-900">Return Gap: {simResults.returnGap.toFixed(1)}%</span>
                        <span className="text-xs text-gray-500">Why you earn less than the actor</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-xs text-gray-600">Slippage Cost</span>
                          </div>
                          <span className="text-xs font-semibold text-amber-600">-{simResults.slippageLoss.toFixed(1)}% (${simResults.slippageCost.toFixed(0)})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-xs text-gray-600">Entry Delay Cost</span>
                          </div>
                          <span className="text-xs font-semibold text-red-600">-{simResults.delayLoss.toFixed(1)}% (${simResults.delayCost.toFixed(0)})</span>
                        </div>
                      </div>
                      {/* Visual bar */}
                      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-500" style={{ width: `${Math.max(0, simResults.followerReturn / Math.max(simResults.actorReturn, 1) * 100)}%` }} />
                        <div className="h-full bg-amber-400" style={{ width: `${simResults.slippageLoss}%` }} />
                        <div className="h-full bg-red-400" style={{ width: `${simResults.delayLoss}%` }} />
                      </div>
                    </div>

                    {/* Delay Impact Table */}
                    {actor.simulatedPortfolio?.impactByDelay && (
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="text-sm font-semibold text-gray-900 mb-3">Impact by Entry Delay</div>
                        <div className="space-y-2">
                          {actor.simulatedPortfolio.impactByDelay.map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                              <span className="text-xs font-medium text-gray-700">{item.delay} delay</span>
                              <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold ${
                                  item.returnLoss.includes('+') ? 'text-red-600' : 
                                  parseInt(item.returnLoss) > -30 ? 'text-amber-600' : 'text-red-600'
                                }`}>{item.returnLoss}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  item.recommendation === 'Optimal' ? 'bg-emerald-100 text-emerald-700' :
                                  item.recommendation === 'Acceptable' ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>{item.recommendation}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Trade Stats */}
                {actor.simulatedPortfolio?.trades && (
                  <div className="mt-4 pt-4 border-t border-indigo-200">
                    <button 
                      onClick={() => setShowTradeDetails(!showTradeDetails)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <span className="text-sm font-semibold text-gray-900">Trade Statistics</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showTradeDetails ? 'rotate-180' : ''}`} />
                    </button>
                    {showTradeDetails && (
                      <div className="grid grid-cols-4 gap-3 mt-3">
                        <div className="text-center p-2 bg-white rounded-lg">
                          <div className="text-lg font-bold text-gray-900">{actor.simulatedPortfolio.trades.total}</div>
                          <div className="text-xs text-gray-500">Trades</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <div className="text-lg font-bold text-emerald-600">{actor.simulatedPortfolio.trades.profitable}</div>
                          <div className="text-xs text-gray-500">Winners</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <div className="text-lg font-bold text-emerald-600">{actor.simulatedPortfolio.trades.avgWin}</div>
                          <div className="text-xs text-gray-500">Avg Win</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <div className="text-lg font-bold text-red-600">{actor.simulatedPortfolio.trades.avgLoss}</div>
                          <div className="text-xs text-gray-500">Avg Loss</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* COPY FEED - Recent Trades with PnL */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-700" />
                    <h2 className="text-lg font-bold text-gray-900">Recent Trades</h2>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                    {['24h', '7d', '30d'].map(tf => (
                      <button
                        key={tf}
                        onClick={() => setFeedTimeframe(tf)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          feedTimeframe === tf ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {actor.copyFeed.map((action) => {
                    const actionConfig = actionColors[action.type] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: Activity };
                    const Icon = actionConfig.icon;
                    return (
                      <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${actionConfig.bg}`}>
                            <Icon className={`w-4 h-4 ${actionConfig.text}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold text-sm ${actionConfig.text}`}>{action.type}</span>
                              <span className="font-medium text-gray-900">{action.token}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{action.size}</span>
                              {action.price !== '-' && <span>@ {action.price}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* PnL Comparison */}
                          {action.actorPnl && action.actorPnl !== '-' && (
                            <div className="text-right border-r border-gray-200 pr-4">
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="text-xs text-gray-400">Actor</div>
                                  <div className={`text-xs font-bold ${action.actorPnl.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>{action.actorPnl}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-400">You</div>
                                  <div className={`text-xs font-bold ${action.followerPnl?.startsWith('+') ? 'text-indigo-600' : 'text-red-600'}`}>{action.followerPnl || '-'}</div>
                                </div>
                              </div>
                            </div>
                          )}
                          {action.entryDelay !== '-' && (
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Delay</div>
                              <div className="text-sm font-semibold text-gray-900">{action.entryDelay}</div>
                            </div>
                          )}
                          <div className="text-right">
                            <div className="text-xs text-gray-400">{action.time}</div>
                            <a href={`https://etherscan.io/tx/${action.txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                              View tx
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Current State */}
              <div className="bg-gray-900 text-white rounded-2xl p-5">
                <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Current State</h3>
                <div className="text-2xl font-bold mb-1">{actor.currentBehavior}</div>
                <div className="text-sm text-gray-400 mb-4">{actor.behaviorTrend}</div>
                
                {/* Top Exposures - Lite Positions */}
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Top Exposures</h4>
                  <div className="space-y-2">
                    {actor.topExposures?.map((exp, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="font-medium">{exp.token}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${
                            exp.direction === 'Increasing' ? 'text-emerald-400' :
                            exp.direction === 'Decreasing' ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {exp.direction === 'Increasing' ? '↑' : exp.direction === 'Decreasing' ? '↓' : '→'} {exp.change}
                          </span>
                          <span className="text-sm text-gray-400">{exp.allocation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strategy Fingerprint */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Strategy Fingerprint</h3>
                <StrategyRadar fingerprint={actor.strategyFingerprint} />
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
                  {actor.strategies.map((strategy, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                      {strategy}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Alerts */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Alerts</h3>
                  <button onClick={() => setShowAlertModal(true)} className="text-sm text-gray-500 hover:text-gray-900">Configure</button>
                </div>
                
                {actor.activeAlerts.length > 0 ? (
                  <div className="space-y-2">
                    {actor.activeAlerts.map((alert, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
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

              {/* Why Follow - compact in sidebar */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Why follow</h3>
                <div className="space-y-1.5">
                  {actor.whyFollow.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {item.positive ? (
                        <Check className="w-3.5 h-3.5 text-[#16C784] mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#F5A524] mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${item.positive ? 'text-gray-900' : 'text-gray-500'}`}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance - compact in sidebar */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Performance</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-500 uppercase">PnL</div>
                    <div className={`text-sm font-bold ${actor.performance.realizedPnl.startsWith('+') ? 'text-[#16C784]' : 'text-[#EF4444]'}`}>
                      {actor.performance.realizedPnl}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-500 uppercase">Win</div>
                    <div className="text-sm font-bold text-gray-900">{actor.performance.winRate}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-500 uppercase">Hold</div>
                    <div className="text-sm font-bold text-gray-900">{actor.performance.avgHoldTime}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-500 uppercase">DD</div>
                    <div className="text-sm font-bold text-gray-900">{actor.performance.avgDrawdown}</div>
                  </div>
                </div>
              </div>

              {/* What Actor Trades - compact in sidebar */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Trades</h3>
                <div className="space-y-1.5">
                  {actor.assetBehavior.slice(0, 4).map((asset, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-900">{asset.token}</span>
                        <span className="text-gray-400">—</span>
                        <span className="text-gray-600">{asset.behavior}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        asset.bias.includes('Bullish') ? 'bg-emerald-100 text-emerald-700' :
                        asset.bias === 'Neutral' ? 'bg-gray-100 text-gray-600' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {asset.bias}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk - compact in sidebar */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-bold text-gray-900">Risk</h3>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    actor.riskFlags.overallRisk < 30 ? 'bg-emerald-100 text-emerald-700' :
                    actor.riskFlags.overallRisk < 60 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {actor.riskFlags.overallRisk}/100
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="p-1.5 bg-gray-50 rounded flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">Sanctions</span>
                    {!actor.riskFlags.sanctions ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-red-500" />}
                  </div>
                  <div className="p-1.5 bg-gray-50 rounded flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">Mixers</span>
                    {!actor.riskFlags.mixers ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-red-500" />}
                  </div>
                  <div className="p-1.5 bg-gray-50 rounded flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">Approvals</span>
                    <span className={`text-[10px] font-semibold ${actor.riskFlags.riskyApprovals > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>{actor.riskFlags.riskyApprovals}</span>
                  </div>
                  <div className="p-1.5 bg-gray-50 rounded flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">Unverified</span>
                    <span className={`text-[10px] font-semibold ${actor.riskFlags.unverifiedContracts > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>{actor.riskFlags.unverifiedContracts}</span>
                  </div>
                </div>
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
                  Select events for <span className="font-semibold text-gray-900">{actor.label}</span>
                </p>
                
                <div className="space-y-2">
                  {alertTypes.map(alert => (
                    <label key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{alert.name}</div>
                        <div className="text-xs text-gray-500">{alert.description}</div>
                      </div>
                      <input type="checkbox" defaultChecked={actor.activeAlerts.some(a => a.type === alert.name)} className="w-4 h-4 text-gray-900 rounded" />
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
