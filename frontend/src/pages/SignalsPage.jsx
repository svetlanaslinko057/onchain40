import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, Search, Filter, Star, TrendingUp, TrendingDown, Eye, EyeOff, Trash2, 
  Wallet, ChevronLeft, ExternalLink, AlertTriangle, CheckCircle, Activity,
  Bell, BellRing, Settings, Coins, Users, Info, MoreVertical, Volume2, VolumeX,
  Repeat, Bookmark, BellPlus, Clock, Zap, Link2, HelpCircle
} from 'lucide-react';
import Header from '../components/Header';
import { PageHeader } from '../components/PageHeader';
import { InfoIcon } from '../components/Tooltip';
import AlertsPanel from '../components/AlertsPanel';

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

const GlassCard = ({ children, className = "", hover = false }) => (
  <div className={`glass-card ${hover ? 'glass-card-hover' : ''} ${className}`}>
    {children}
  </div>
);

// AddAddressModal component removed

// === CONFIDENCE DECAY SYSTEM ===
// Score decreases over time without confirmations
const applyConfidenceDecay = (baseScore, timestamp, hasRecentActivity = false) => {
  if (!timestamp) return baseScore;
  
  const now = Date.now();
  const ageInHours = (now - timestamp) / (1000 * 60 * 60);
  
  // Decay rate: -2 points per hour without activity
  // No decay if recent activity (< 6h) or hasRecentActivity flag
  if (ageInHours < 6 || hasRecentActivity) {
    return baseScore;
  }
  
  const decayRate = 2; // points per hour
  const decay = Math.floor((ageInHours - 6) * decayRate);
  const decayedScore = Math.max(0, baseScore - decay);
  
  return {
    score: decayedScore,
    originalScore: baseScore,
    decay: decay,
    ageInHours: Math.floor(ageInHours),
    decayed: decay > 0
  };
};

// === SIGNAL LIFECYCLE SYSTEM ===
// Auto-transition: New → Active → Cooling → Archived
const getSignalLifecycle = (timestamp, score) => {
  if (!timestamp) return 'active';
  
  const ageInHours = (Date.now() - timestamp) / (1000 * 60 * 60);
  
  // New: < 2 hours old
  if (ageInHours < 2) return 'new';
  
  // Archived: > 72 hours OR score < 20
  if (ageInHours > 72 || score < 20) return 'archived';
  
  // Cooling: 24-72 hours OR score dropped below 40
  if (ageInHours > 24 || score < 40) return 'cooling';
  
  // Active: everything else
  return 'active';
};

// === SIGNAL SCORE CALCULATION ENGINE ===
// Weighted scoring system with explainable components
const calculateSignalScore = (item) => {
  const weights = {
    behavior: 25,      // Behavior change significance
    risk: 20,          // Risk level impact
    coordination: 20,  // Bridge/cluster alignment
    magnitude: 20,     // Flow magnitude vs average
    recency: 15        // How recent the activity is
  };

  const breakdown = [];
  let totalScore = 0;

  // 1. BEHAVIOR (0-25 points)
  let behaviorScore = 0;
  if (item.behaviorChanged) {
    if (item.behavior === 'distributing') {
      behaviorScore = 25; // Full points for shift to distribution
      breakdown.push({ 
        component: 'Behavior', 
        score: 25, 
        reason: 'Shifted to distribution',
        icon: '🔄'
      });
    } else if (item.behavior === 'accumulating') {
      behaviorScore = 20;
      breakdown.push({ 
        component: 'Behavior', 
        score: 20, 
        reason: 'Started accumulating',
        icon: '📈'
      });
    } else {
      behaviorScore = 15;
      breakdown.push({ 
        component: 'Behavior', 
        score: 15, 
        reason: 'Behavior changed',
        icon: '🔄'
      });
    }
  } else if (item.behavior === 'distributing') {
    behaviorScore = 10;
    breakdown.push({ 
      component: 'Behavior', 
      score: 10, 
      reason: 'Active distribution',
      icon: '📉'
    });
  }
  totalScore += behaviorScore;

  // 2. RISK (0-20 points)
  let riskScore = 0;
  if (item.riskLevel === 'high') {
    riskScore = 20;
    breakdown.push({ 
      component: 'Risk', 
      score: 20, 
      reason: 'High risk level',
      icon: '⚠️'
    });
  } else if (item.riskLevel === 'medium') {
    riskScore = 10;
    breakdown.push({ 
      component: 'Risk', 
      score: 10, 
      reason: 'Elevated risk',
      icon: '⚡'
    });
  }
  totalScore += riskScore;

  // 3. COORDINATION (0-20 points)
  let coordScore = 0;
  if (item.bridgeAligned) {
    const alignedCount = item.alignedCount || 2;
    coordScore = Math.min(20, 10 + alignedCount * 3);
    breakdown.push({ 
      component: 'Coordination', 
      score: coordScore, 
      reason: `Aligned with ${alignedCount} entities`,
      icon: '🔗'
    });
  }
  totalScore += coordScore;

  // 4. MAGNITUDE (0-20 points)
  let magScore = 0;
  if (item.deltaSignals?.length > 0) {
    magScore = Math.min(20, 10 + item.deltaSignals.length * 5);
    breakdown.push({ 
      component: 'Magnitude', 
      score: magScore, 
      reason: 'Flow spike detected',
      icon: '📊'
    });
  } else if (item.attentionScore > 60) {
    magScore = 15;
    breakdown.push({ 
      component: 'Magnitude', 
      score: 15, 
      reason: 'Above-average activity',
      icon: '📊'
    });
  }
  totalScore += magScore;

  // 5. RECENCY (0-15 points)
  let recencyScore = 0;
  if (item.statusChange === '24h') {
    recencyScore = 15;
    breakdown.push({ 
      component: 'Recency', 
      score: 15, 
      reason: 'Activity < 24h ago',
      icon: '🕐'
    });
  } else if (item.dormantDays === 0) {
    recencyScore = 5;
    breakdown.push({ 
      component: 'Recency', 
      score: 5, 
      reason: 'Recently active',
      icon: '🕐'
    });
  }
  totalScore += recencyScore;

  // Sort breakdown by score (highest first)
  breakdown.sort((a, b) => b.score - a.score);

  // Apply confidence decay
  const baseScore = Math.min(totalScore, 100);
  const decayResult = applyConfidenceDecay(baseScore, item.timestamp, item.statusChange === '24h');
  const finalScore = typeof decayResult === 'object' ? decayResult.score : decayResult;
  
  // Determine lifecycle based on final score
  const lifecycle = getSignalLifecycle(item.timestamp, finalScore);

  return {
    score: finalScore,
    originalScore: typeof decayResult === 'object' ? decayResult.originalScore : baseScore,
    decayed: typeof decayResult === 'object' ? decayResult.decayed : false,
    decay: typeof decayResult === 'object' ? decayResult.decay : 0,
    ageInHours: typeof decayResult === 'object' ? decayResult.ageInHours : 0,
    breakdown,
    topReasons: breakdown.slice(0, 3),
    tier: finalScore >= 70 ? 'critical' : finalScore >= 40 ? 'notable' : 'low',
    lifecycle
  };
};

// SIGNAL CARD — про событие + сущность + почему важно
const SignalCard = ({ item, onRemove, onOpenAlerts, onUserAction }) => {
  const { score, originalScore, decayed, decay, ageInHours, topReasons, tier, lifecycle } = calculateSignalScore(item);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(item.muted || false);
  const [isTracking, setIsTracking] = useState(item.tracking || false);

  // Event + Why it matters
  const getEventInfo = () => {
    if (item.bridgeAligned && item.behavior === 'distributing') {
      return { 
        event: 'Coordinated Distribution', 
        severity: 'high',
        why: `Outflows aligned with ${item.alignedCount || 3} entities`
      };
    }
    if (item.bridgeAligned && item.behavior === 'accumulating') {
      return { 
        event: 'Aligned Accumulation', 
        severity: 'medium',
        why: 'Multiple entities entering same position'
      };
    }
    if (item.riskLevel === 'high' && item.behavior === 'distributing') {
      return { 
        event: 'High-Risk Outflow', 
        severity: 'high',
        why: 'Large net outflows exceeding normal range'
      };
    }
    if (item.behaviorChanged && item.behavior === 'accumulating') {
      return { 
        event: 'Accumulation Started', 
        severity: 'medium',
        why: 'Behavior shifted to net inflows'
      };
    }
    if (item.behaviorChanged && item.behavior === 'distributing') {
      return { 
        event: 'Distribution Started', 
        severity: 'high',
        why: 'Behavior shifted to net outflows'
      };
    }
    if (item.behavior === 'dormant') {
      return { 
        event: 'Dormant', 
        severity: 'low',
        why: `No activity for ${item.dormantDays || 7}+ days`
      };
    }
    return { event: 'Monitoring', severity: 'neutral', why: 'No significant changes' };
  };

  const eventInfo = getEventInfo();

  // Цветовая система по типу сигнала
  // Чёрный — только для high-intent: Score > 70, Coordinated Distribution, Critical Risk
  const getCardStyle = () => {
    // Critical / Coordinated Distribution
    if (tier === 'critical' || (item.bridgeAligned && item.behavior === 'distributing')) {
      return 'border-l-gray-900 bg-gray-900/5';
    }
    // Distribution (soft red)
    if (item.behavior === 'distributing') {
      return 'border-l-red-400 bg-red-50/50';
    }
    // Accumulation (soft green)
    if (item.behavior === 'accumulating') {
      return 'border-l-emerald-400 bg-emerald-50/50';
    }
    // Bridge aligned (soft blue/purple)
    if (item.bridgeAligned) {
      return 'border-l-blue-400 bg-blue-50/50';
    }
    // Neutral / Monitoring (gray-white)
    return 'border-l-gray-200 bg-white';
  };

  return (
    <div className={`p-3 rounded-lg border border-gray-200 border-l-4 ${getCardStyle()} hover:shadow-md transition-shadow ${isMuted ? 'opacity-50' : ''}`}>
      {/* Event Label + Lifecycle + Actions */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            tier === 'critical' ? 'bg-gray-900 text-white' :
            item.behavior === 'distributing' ? 'bg-red-100 text-red-700' :
            item.behavior === 'accumulating' ? 'bg-emerald-100 text-emerald-700' :
            item.bridgeAligned ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {eventInfo.event}
          </span>
          
          {/* Lifecycle Badge */}
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase flex items-center gap-1 ${
            lifecycle === 'new' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            lifecycle === 'active' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
            lifecycle === 'cooling' ? 'bg-gray-100 text-gray-600 border border-gray-300' :
            'bg-gray-50 text-gray-400 border border-gray-200'
          }`}>
            {lifecycle === 'new' && <Zap className="w-2.5 h-2.5" />}
            {lifecycle === 'active' && <Activity className="w-2.5 h-2.5" />}
            {lifecycle === 'cooling' && <Clock className="w-2.5 h-2.5" />}
            {lifecycle}
          </span>
          
          {item.statusChange === '24h' && (
            <span className="text-[10px] text-gray-400">{'< 24h'}</span>
          )}
          
          {/* Decay Indicator */}
          {decayed && (
            <span className="text-[9px] text-gray-400 flex items-center gap-0.5" title={`Score decayed by ${decay} points (${ageInHours}h old)`}>
              <Clock className="w-2.5 h-2.5" />
              -{decay}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-0.5 relative">
          <button onClick={() => onOpenAlerts(item)} className="p-1 text-gray-300 hover:text-gray-600 rounded">
            <Bell className="w-3 h-3" />
          </button>
          
          {/* User Actions Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowActionsMenu(!showActionsMenu)} 
              className="p-1 text-gray-300 hover:text-gray-600 rounded"
            >
              <MoreVertical className="w-3 h-3" />
            </button>
            
            {showActionsMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    setIsMuted(!isMuted);
                    onUserAction?.({ action: 'mute', itemId: item.id, value: !isMuted });
                    setShowActionsMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  {isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  {isMuted ? 'Unmute Signal' : 'Mute Signal'}
                </button>
                <button
                  onClick={() => {
                    setIsTracking(!isTracking);
                    onUserAction?.({ action: 'track', itemId: item.id, value: !isTracking });
                    setShowActionsMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  {isTracking ? 'Stop Tracking Similar' : 'Track Similar'}
                </button>
                <button
                  onClick={() => {
                    onUserAction?.({ action: 'watchlist', itemId: item.id });
                    setShowActionsMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Add to Watchlist
                </button>
                <button
                  onClick={() => {
                    onUserAction?.({ action: 'escalation', itemId: item.id });
                    setShowActionsMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <BellPlus className="w-3.5 h-3.5" />
                  Notify on Escalation
                </button>
                <div className="border-t border-gray-200 mt-1"></div>
                <button
                  onClick={() => {
                    onRemove(item.id);
                    setShowActionsMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-red-50 flex items-center gap-2 text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Signal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Entity Line */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${
          tier === 'critical' ? 'bg-gray-900' :
          item.behavior === 'distributing' ? 'bg-red-500' :
          item.behavior === 'accumulating' ? 'bg-emerald-500' :
          item.bridgeAligned ? 'bg-blue-500' :
          'bg-gray-400'
        }`}>
          <Wallet className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-gray-900 truncate">{item.label}</span>
            {item.verified && <CheckCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />}
          </div>
          <span className="text-[10px] text-gray-400 uppercase">{item.type?.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Badges Row */}
      <div className="flex items-center gap-1 mb-2 flex-wrap">
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
          item.behavior === 'accumulating' ? 'bg-emerald-100 text-emerald-700' :
          item.behavior === 'distributing' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-500'
        }`}>
          {item.behavior || 'monitoring'}
        </span>
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
          item.riskLevel === 'high' ? 'bg-gray-900 text-white' :
          item.riskLevel === 'medium' ? 'bg-gray-200 text-gray-700' :
          'bg-gray-100 text-gray-500'
        }`}>
          {item.riskLevel || 'low'}
        </span>
        {item.bridgeAligned && (
          <div className="relative group/bridge">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-blue-100 text-blue-700 cursor-help flex items-center gap-1">
              <Link2 className="w-2.5 h-2.5" />
              Bridge
            </span>
            {/* Bridge Explanation Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover/bridge:block z-20">
              <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg min-w-[220px]">
                <div className="flex items-center gap-1.5 mb-2">
                  <Link2 className="w-3.5 h-3.5 text-blue-400" />
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Why Coordinated?</div>
                </div>
                <p className="text-xs mb-2 text-gray-300">
                  {item.alignedCount || 3} entities showing similar behavior pattern within {item.coordinationWindow || '6h'} window
                </p>
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Involved Entities:</div>
                <div className="space-y-1">
                  {(item.alignedEntities || ['Binance', 'Bybit', 'OKX']).slice(0, 3).map((entity, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs">
                      <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                      <span className="text-gray-300">{entity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-400">Confidence</span>
                    <span className="font-bold text-blue-400">{item.coordinationConfidence || 85}%</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>

      {/* Why it matters */}
      <p className="text-[11px] text-gray-600 mb-2 italic">{eventInfo.why}</p>

      {/* Score + Top Reasons */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
        <div className="flex items-center gap-2">
          {/* Score Badge — чёрный только для critical */}
          <div className="relative group/score">
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold cursor-help ${
              tier === 'critical' ? 'bg-gray-900 text-white' :
              tier === 'notable' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
              'bg-gray-100 text-gray-500'
            }`}>
              {score}
            </span>
            {/* Score Tooltip on hover */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover/score:block z-20">
              <div className="bg-gray-900 text-white p-2 rounded-lg shadow-lg min-w-[160px]">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Score Breakdown</div>
                {topReasons.map((r, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] py-0.5">
                    <span>{r.icon}</span>
                    <span className="flex-1">{r.reason}</span>
                    <span className="font-bold text-emerald-400">+{r.score}</span>
                  </div>
                ))}
                {decayed && (
                  <>
                    <div className="border-t border-gray-700 mt-1 pt-1 flex justify-between text-[10px]">
                      <span className="text-gray-400">Base Score</span>
                      <span className="font-bold">{originalScore}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-amber-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Decay ({ageInHours}h)</span>
                      </div>
                      <span className="font-bold">-{decay}</span>
                    </div>
                  </>
                )}
                <div className="border-t border-gray-700 mt-1 pt-1 flex justify-between text-[10px]">
                  <span className="text-gray-400">{decayed ? 'Current' : 'Total'}</span>
                  <span className="font-bold">{score}/100</span>
                </div>
              </div>
              <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
          
          {/* Top reasons mini-display */}
          <div className="flex items-center gap-1">
            {topReasons.slice(0, 2).map((r, i) => (
              <span key={i} className="text-[9px] text-gray-400" title={r.reason}>
                {r.icon}
              </span>
            ))}
          </div>
        </div>
        <Link 
          to={`/signal/${item.id}`}
          className="text-[11px] font-semibold text-gray-500 hover:text-gray-900"
        >
          View →
        </Link>
      </div>
    </div>
  );
};

const RuleBasedAlert = ({ item, onSaveRule }) => {
  const [ruleType, setRuleType] = useState('behavior_change'); // behavior_change, accumulation, distribution, narrative
  const [threshold, setThreshold] = useState(50);
  const [enabled, setEnabled] = useState(true);

  const ruleTypes = [
    { 
      value: 'behavior_change', 
      label: 'Behavior Change', 
      description: 'Alert when entity changes behavior (Accumulating → Distributing)',
      icon: Activity,
      examples: ['Binance starts distributing', 'VC fund begins rotation']
    },
    { 
      value: 'accumulation', 
      label: 'Accumulation Detected', 
      description: 'Alert when entity starts accumulating positions',
      icon: TrendingUp,
      examples: ['Net inflow > $10M', 'Holdings increase > 5%']
    },
    { 
      value: 'distribution', 
      label: 'Distribution Alert', 
      description: 'Alert when entity distributes or exits',
      icon: TrendingDown,
      examples: ['Net outflow > $10M', 'Holdings decrease > 5%']
    },
    { 
      value: 'narrative_stage', 
      label: 'Narrative Stage Change', 
      description: 'Alert when narrative moves to Crowded/Exhaustion',
      icon: Bell,
      examples: ['AI narrative → Crowded', 'L2 narrative → Exhaustion']
    },
    { 
      value: 'deposit_cex', 
      label: 'CEX Deposit', 
      description: 'Alert on deposit to exchange (sell signal)',
      icon: AlertTriangle,
      examples: ['Deposit to Binance', 'Transfer to Coinbase']
    },
    { 
      value: 'new_token', 
      label: 'New Token Purchase', 
      description: 'Alert when entity buys new token',
      icon: Coins,
      examples: ['New position opened', 'First purchase of token']
    }
  ];

  const currentRule = ruleTypes.find(r => r.value === ruleType);
  const RuleIcon = currentRule?.icon || Bell;

  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <BellRing className="w-5 h-5 text-blue-600" />
        <h4 className="text-sm font-bold text-gray-900">Rule-Based Alerts</h4>
        <label className="ml-auto flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={enabled} 
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-xs font-semibold text-gray-600">Enabled</span>
        </label>
      </div>

      {/* Rule Type Selector */}
      <div className="space-y-2 mb-4">
        {ruleTypes.map(rule => {
          const Icon = rule.icon;
          return (
            <button
              key={rule.value}
              onClick={() => setRuleType(rule.value)}
              className={`w-full p-3 rounded-2xl border-2 transition-all text-left ${
                ruleType === rule.value
                  ? 'border-blue-500 bg-white shadow-sm'
                  : 'border-gray-200 bg-white/50 hover:bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  ruleType === rule.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900 mb-0.5">{rule.label}</div>
                  <div className="text-xs text-gray-600 mb-1">{rule.description}</div>
                  {ruleType === rule.value && (
                    <div className="text-xs text-blue-600 italic">
                      e.g., {rule.examples[0]}
                    </div>
                  )}
                </div>
                {ruleType === rule.value && (
                  <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Confidence Threshold */}
      {(ruleType === 'behavior_change' || ruleType === 'accumulation' || ruleType === 'distribution') && (
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Confidence Threshold: {threshold}%
          </label>
          <input 
            type="range" 
            min="50" 
            max="95" 
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50% (Sensitive)</span>
            <span>95% (Strict)</span>
          </div>
        </div>
      )}

      {/* Save Button */}
      <button 
        onClick={() => onSaveRule({ 
          type: ruleType, 
          threshold, 
          enabled,
          entityId: item.id,
          entityLabel: item.label
        })}
        className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-shadow"
      >
        💾 Save Alert Rule
      </button>
    </div>
  );
};

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [isAlertsPanelOpen, setIsAlertsPanelOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [behaviorFilter, setBehaviorFilter] = useState('all');
  const [statusChangeFilter, setStatusChangeFilter] = useState(false);
  const [riskSpikeFilter, setRiskSpikeFilter] = useState(false);
  const [bridgeAlignedFilter, setBridgeAlignedFilter] = useState(false);
  const [dormantFilter, setDormantFilter] = useState(false);
  const [lifecycleFilter, setLifecycleFilter] = useState('all'); // all, new, active, cooling, archived
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('overview');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    // Mock data с новыми полями
    const mockWatchlist = [
      {
        id: 1,
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        label: 'Vitalik Buterin',
        type: 'influencer',
        watchType: 'address',
        verified: true,
        balance: '$45.2M',
        change24h: 5.4,
        txCount: '1,247',
        watching: true,
        behavior: 'accumulating',
        behaviorChanged: false,
        attentionScore: 45,
        deltaSignals: [
          { icon: 'spike', text: 'Flow spike vs 7d avg' }
        ],
        statusChange: null,
        riskLevel: 'low',
        bridgeAligned: false,
        dormantDays: 0,
        timestamp: Date.now() - (1000 * 60 * 60 * 8), // 8 hours ago
        muted: false,
        tracking: false
      },
      {
        id: 2,
        address: '0x28C6c06298d514Db089934071355E5743bf21d60',
        label: 'Binance Hot Wallet',
        type: 'exchange',
        watchType: 'cluster',
        verified: true,
        balance: '$2.8B',
        change24h: -2.1,
        txCount: '89,234',
        watching: true,
        behavior: 'distributing',
        behaviorChanged: true,
        attentionScore: 85,
        deltaSignals: [
          { icon: 'change', text: 'Behavior changed 6h ago' },
          { icon: 'aligned', text: 'Aligned with 2 entities' }
        ],
        statusChange: '24h',
        riskLevel: 'high',
        bridgeAligned: true,
        alignedCount: 3,
        alignedEntities: ['Bybit', 'OKX', 'Kraken'],
        coordinationWindow: '6h',
        coordinationConfidence: 87,
        dormantDays: 0,
        timestamp: Date.now() - (1000 * 60 * 60 * 1), // 1 hour ago
        muted: false,
        tracking: false
      },
      {
        id: 3,
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        label: 'Unknown Whale',
        type: 'whale',
        watchType: 'address',
        verified: false,
        balance: '$127.5M',
        change24h: 12.8,
        txCount: '456',
        watching: true,
        behavior: 'accumulating',
        behaviorChanged: true,
        attentionScore: 72,
        deltaSignals: [
          { icon: 'change', text: 'Behavior changed 3h ago' }
        ],
        statusChange: '24h',
        riskLevel: 'medium',
        bridgeAligned: false,
        dormantDays: 0,
        timestamp: Date.now() - (1000 * 60 * 60 * 3), // 3 hours ago
        muted: false,
        tracking: false
      },
      {
        id: 4,
        address: 'ETH',
        label: 'Ethereum',
        type: 'token',
        watchType: 'token',
        verified: true,
        balance: '$3,342',
        change24h: 2.4,
        txCount: '-',
        watching: true,
        behavior: 'rotating',
        behaviorChanged: false,
        attentionScore: 38,
        deltaSignals: [],
        statusChange: null,
        riskLevel: 'low',
        bridgeAligned: false,
        dormantDays: 0,
        timestamp: Date.now() - (1000 * 60 * 60 * 36), // 36 hours ago (cooling)
        muted: false,
        tracking: false
      },
      {
        id: 5,
        address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
        label: 'a16z Crypto Fund',
        type: 'fund',
        watchType: 'cluster',
        verified: true,
        balance: '$890.2M',
        change24h: 8.9,
        txCount: '234,567',
        watching: false,
        behavior: 'dormant',
        behaviorChanged: false,
        attentionScore: 12,
        deltaSignals: [],
        statusChange: null,
        riskLevel: 'low',
        bridgeAligned: false,
        dormantDays: 14,
        timestamp: Date.now() - (1000 * 60 * 60 * 80), // 80 hours ago (archived)
        muted: false,
        tracking: false
      },
      {
        id: 6,
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEc',
        label: 'Jump Trading',
        type: 'fund',
        watchType: 'cluster',
        verified: true,
        balance: '$345.8M',
        change24h: -5.2,
        txCount: '12,456',
        watching: true,
        behavior: 'distributing',
        behaviorChanged: false,
        attentionScore: 58,
        deltaSignals: [
          { icon: 'aligned', text: 'Aligned with Binance' }
        ],
        statusChange: null,
        riskLevel: 'medium',
        bridgeAligned: true,
        alignedCount: 2,
        alignedEntities: ['Binance', 'Bybit'],
        coordinationWindow: '12h',
        coordinationConfidence: 78,
        dormantDays: 0,
        timestamp: Date.now() - (1000 * 60 * 60 * 5), // 5 hours ago
        muted: false,
        tracking: false
      },
      // Дополнительные карточки для pagination
      {
        id: 7,
        address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D507',
        label: 'Coinbase Exchange',
        type: 'exchange',
        verified: true,
        balance: '$1.2B',
        change24h: 1.8,
        txCount: '156,789',
        watching: true,
        behavior: 'rotating',
        behaviorChanged: false,
        attentionScore: 35,
        deltaSignals: [],
        riskLevel: 'low',
        bridgeAligned: false,
        dormantDays: 0,
        timestamp: Date.now() - (1000 * 60 * 60 * 12), // 12 hours ago
        muted: false,
        tracking: false
      },
      {
        id: 8,
        address: '0x8e5c6c06298d514Db089934071355E5743bf21d70',
        label: 'Kraken',
        type: 'exchange',
        verified: true,
        balance: '$890M',
        change24h: -1.2,
        txCount: '98,234',
        watching: true,
        behavior: 'accumulating',
        behaviorChanged: false,
        attentionScore: 42,
        deltaSignals: [],
        riskLevel: 'low',
        bridgeAligned: false,
        dormantDays: 0,
        timestamp: Date.now() - (1000 * 60 * 60 * 18), // 18 hours ago
        muted: false,
        tracking: false
      },
      {
        id: 9,
        address: '0x9e5c6c06298d514Db089934071355E5743bf21d80',
        label: 'Pantera Capital',
        type: 'fund',
        verified: true,
        balance: '$567M',
        change24h: 4.5,
        txCount: '45,678',
        watching: true,
        behavior: 'accumulating',
        behaviorChanged: false,
        attentionScore: 55,
        deltaSignals: [{ icon: 'spike', text: 'Increased activity' }],
        riskLevel: 'medium',
        bridgeAligned: false,
        dormantDays: 0,
        timestamp: Date.now() - (1000 * 60 * 60 * 6), // 6 hours ago
        muted: false,
        tracking: false
      },
      {
        id: 10,
        address: '0xae5c6c06298d514Db089934071355E5743bf21d90',
        label: 'DWF Labs',
        type: 'fund',
        verified: true,
        balance: '$234M',
        change24h: 7.8,
        txCount: '23,456',
        watching: true,
        behavior: 'accumulating',
        behaviorChanged: true,
        attentionScore: 68,
        deltaSignals: [{ icon: 'change', text: 'Behavior changed 12h ago' }],
        statusChange: '24h',
        riskLevel: 'medium',
        bridgeAligned: false,
        dormantDays: 0,
        timestamp: Date.now() - (1000 * 60 * 60 * 12), // 12 hours ago
        muted: false,
        tracking: false
      },
      {
        id: 11,
        address: '0xbe5c6c06298d514Db089934071355E5743bf21da0',
        label: 'Galaxy Digital',
        type: 'fund',
        verified: true,
        balance: '$445M',
        change24h: -3.4,
        txCount: '34,567',
        watching: true,
        behavior: 'distributing',
        behaviorChanged: false,
        attentionScore: 48,
        deltaSignals: [],
        riskLevel: 'medium',
        bridgeAligned: false,
        dormantDays: 0,
        timestamp: Date.now() - (1000 * 60 * 60 * 28), // 28 hours ago (cooling)
        muted: false,
        tracking: false
      },
      {
        id: 12,
        address: '0xce5c6c06298d514Db089934071355E5743bf21db0',
        label: 'Polychain Capital',
        type: 'fund',
        verified: true,
        balance: '$312M',
        change24h: 2.1,
        txCount: '28,901',
        watching: true,
        behavior: 'rotating',
        behaviorChanged: false,
        attentionScore: 32,
        deltaSignals: [],
        riskLevel: 'low',
        bridgeAligned: false,
        dormantDays: 0
      },
      {
        id: 13,
        address: '0xde5c6c06298d514Db089934071355E5743bf21dc0',
        label: 'Alameda Research',
        type: 'fund',
        verified: true,
        balance: '$678M',
        change24h: -8.9,
        txCount: '67,890',
        watching: true,
        behavior: 'distributing',
        behaviorChanged: false,
        attentionScore: 88,
        deltaSignals: [{ icon: 'spike', text: 'Large outflow detected' }],
        riskLevel: 'high',
        bridgeAligned: false,
        dormantDays: 0
      },
      {
        id: 14,
        address: '0xee5c6c06298d514Db089934071355E5743bf21dd0',
        label: 'Three Arrows Capital',
        type: 'fund',
        verified: true,
        balance: '$890M',
        change24h: 5.6,
        txCount: '89,012',
        watching: false,
        behavior: 'accumulating',
        behaviorChanged: false,
        attentionScore: 25,
        deltaSignals: [],
        riskLevel: 'low',
        bridgeAligned: false,
        dormantDays: 0
      },
    ];
    setWatchlist(mockWatchlist);
  }, []);

  const handleAddAddress = (newAddress) => {
    const newItem = {
      id: watchlist.length + 1,
      ...newAddress,
      verified: false,
      balance: '$0',
      change24h: 0,
      txCount: '0',
      watching: true,
      redFlags: 0,
      alertCount: 0
    };
    setWatchlist([...watchlist, newItem]);
  };

  const handleRemove = (id) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
  };

  const handleToggleWatch = (id) => {
    setWatchlist(watchlist.map(item => 
      item.id === id ? { ...item, watching: !item.watching } : item
    ));
  };

  const handleOpenAlerts = (item) => {
    setSelectedItem(item);
    setIsAlertsPanelOpen(true);
  };

  const handleUserAction = ({ action, itemId, value }) => {
    console.log(`User action: ${action} for item ${itemId}`, value);
    
    setWatchlist(watchlist.map(item => {
      if (item.id !== itemId) return item;
      
      switch (action) {
        case 'mute':
          return { ...item, muted: value };
        case 'track':
          return { ...item, tracking: value };
        case 'watchlist':
          // В реальном приложении здесь будет API call
          console.log('Adding to watchlist:', item);
          return item;
        case 'escalation':
          // В реальном приложении здесь будет API call для настройки alert
          console.log('Setting escalation alert:', item);
          return item;
        default:
          return item;
      }
    }));
  };

  const filteredWatchlist = watchlist.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType || 
                       (filterType === 'cluster' && item.watchType === 'cluster') ||
                       (filterType === 'token' && item.watchType === 'token');
    const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Поведенческие фильтры
    const matchesBehavior = behaviorFilter === 'all' || item.behavior === behaviorFilter;
    const matchesStatusChange = !statusChangeFilter || item.statusChange === '24h';
    const matchesRiskSpike = !riskSpikeFilter || item.riskLevel === 'high';
    const matchesBridgeAligned = !bridgeAlignedFilter || item.bridgeAligned === true;
    const matchesDormant = !dormantFilter || item.dormantDays > 7;
    
    // Lifecycle filter
    const itemLifecycle = getSignalLifecycle(item.timestamp, calculateSignalScore(item).score);
    const matchesLifecycle = lifecycleFilter === 'all' || itemLifecycle === lifecycleFilter;
    
    // Mode filters
    const matchesMode = 
      viewMode === 'overview' ? true :
      viewMode === 'signals' ? (item.statusChange === '24h' || item.behaviorChanged || (item.deltaSignals && item.deltaSignals.length > 0)) :
      viewMode === 'bridge' ? item.bridgeAligned === true :
      viewMode === 'risk' ? item.riskLevel === 'high' :
      true;
    
    return matchesType && matchesSearch && matchesBehavior && 
           matchesStatusChange && matchesRiskSpike && 
           matchesBridgeAligned && matchesDormant && matchesMode && matchesLifecycle;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredWatchlist.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWatchlist = filteredWatchlist.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, behaviorFilter, statusChangeFilter, riskSpikeFilter, bridgeAlignedFilter, dormantFilter, searchQuery, viewMode]);

  const activeWatching = watchlist.filter(item => item.watching).length;
  
  // Focus Summary metrics
  const activeSignals = watchlist.filter(item => item.statusChange === '24h').length;
  const totalWatchlist = watchlist.length;
  const highRiskCount = watchlist.filter(item => item.riskLevel === 'high').length;
  const alignedWithMarket = watchlist.filter(item => item.bridgeAligned).length;
  const dormantCount = watchlist.filter(item => item.dormantDays > 7).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Signals Header - компактный */}
      <div className="px-4 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Signals</h1>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 bg-gray-900 text-white rounded font-semibold">{activeSignals}</span>
              <span className="text-gray-500">active</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..." 
                className="w-48 pl-9 pr-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Market Context - компактный alert strip */}
      {watchlist.length > 0 && (
        <div className="px-4 py-2 bg-gray-900">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">24h:</span>
            {(() => {
              const dist = watchlist.filter(i => i.behavior === 'distributing' && i.statusChange === '24h').length;
              const acc = watchlist.filter(i => i.behavior === 'accumulating' && i.statusChange === '24h').length;
              const bridge = watchlist.filter(i => i.bridgeAligned).length;
              const risk = watchlist.filter(i => i.riskLevel === 'high').length;
              
              const items = [];
              if (dist > 0) items.push(<span key="d" className="text-white">{dist} distributing</span>);
              if (acc > 0) items.push(<span key="a" className="text-white">{acc} accumulating</span>);
              if (bridge >= 2) items.push(<span key="b" className="text-gray-300">{bridge} bridge-aligned</span>);
              if (risk > 0) items.push(<span key="r" className="text-gray-300">{risk} high-risk</span>);
              if (items.length === 0) items.push(<span key="n" className="text-gray-400">No significant changes</span>);
              
              return items.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-gray-600">•</span>}
                  {item}
                </span>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Фильтры */}
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Mode tabs */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'signals', label: 'Signals' },
              { id: 'bridge', label: 'Bridge' },
              { id: 'risk', label: 'Risk' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === mode.id ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Quick chips */}
          <div className="flex items-center gap-1">
            {[
              { key: 'status', label: '<24h', state: statusChangeFilter, setter: setStatusChangeFilter },
              { key: 'risk', label: 'Risk', state: riskSpikeFilter, setter: setRiskSpikeFilter },
              { key: 'bridge', label: 'Bridge', state: bridgeAlignedFilter, setter: setBridgeAlignedFilter },
              { key: 'dormant', label: 'Dormant', state: dormantFilter, setter: setDormantFilter }
            ].map(chip => (
              <button
                key={chip.key}
                onClick={() => chip.setter(!chip.state)}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                  chip.state ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {chip.label}
              </button>
            ))}

            {/* Advanced toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400 uppercase">Type:</span>
              {['all', 'whale', 'exchange', 'fund'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    filterType === t ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {t === 'all' ? 'All' : t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400 uppercase">Behavior:</span>
              {['all', 'accumulating', 'distributing', 'dormant'].map(b => (
                <button
                  key={b}
                  onClick={() => setBehaviorFilter(b)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    behaviorFilter === b ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {b === 'all' ? 'All' : b}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400 uppercase">Lifecycle:</span>
              {[
                { value: 'all', label: 'All' },
                { value: 'new', label: 'New' },
                { value: 'active', label: 'Active' },
                { value: 'cooling', label: 'Cooling' },
                { value: 'archived', label: 'Archived' }
              ].map(l => (
                <button
                  key={l.value}
                  onClick={() => setLifecycleFilter(l.value)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    lifecycleFilter === l.value ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Signals Grid */}
      <div className="px-4 pb-4">
        {filteredWatchlist.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="text-6xl mb-4">👀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No addresses in watchlist</h3>
            <p className="text-gray-500 mb-6">Start tracking smart money by adding addresses to your watchlist</p>
          </GlassCard>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-3">
              {paginatedWatchlist.map(item => (
                <SignalCard 
                  key={item.id} 
                  item={item} 
                  onRemove={handleRemove}
                  onToggleWatch={handleToggleWatch}
                  onOpenAlerts={handleOpenAlerts}
                  onUserAction={handleUserAction}
                />
              ))}
            </div>

            {/* Pagination - как в Entities */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                {/* Left: Navigation buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg font-semibold text-sm transition-colors ${
                            currentPage === pageNum
                              ? 'bg-teal-500 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>

                {/* Right: Counter */}
                <div className="text-sm text-gray-600 font-medium">
                  Showing <span className="font-bold text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredWatchlist.length)}</span> out of <span className="font-bold text-gray-900">{filteredWatchlist.length}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddAddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddAddress}
      />

      {isAlertsPanelOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <GlassCard className="w-[600px] max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Rule-Based Alerts</h2>
                <p className="text-sm text-gray-600">Configure smart alerts for {selectedItem.label}</p>
              </div>
              <button 
                onClick={() => {
                  setIsAlertsPanelOpen(false);
                  setSelectedItem(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-2xl text-gray-400">&times;</span>
              </button>
            </div>
            
            <RuleBasedAlert 
              item={selectedItem}
              onSaveRule={(rule) => {
                console.log('Rule saved:', rule);
                // TODO: Save to backend
                alert(`✅ Alert rule saved!\n\nType: ${rule.type}\nThreshold: ${rule.threshold}%\nEntity: ${rule.entityLabel}`);
                setIsAlertsPanelOpen(false);
                setSelectedItem(null);
              }}
            />
          </GlassCard>
        </div>
      )}
    </div>
  );
}
