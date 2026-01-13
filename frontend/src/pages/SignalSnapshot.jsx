import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Wallet, Shield, CheckCircle, AlertTriangle, Copy,
  TrendingUp, TrendingDown, Activity, ArrowUpRight, Clock, 
  Bell, Plus, Eye, Users, Zap, Info, X
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import Header from '../components/Header';

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-200 rounded-xl ${className}`}>
    {children}
  </div>
);

// === SIGNAL SCORE CALCULATION (same logic as SignalsPage) ===
const calculateSignalScore = (entity) => {
  const breakdown = [];
  let totalScore = 0;

  // 1. BEHAVIOR (0-25 points)
  if (entity.behavior?.current) {
    const behavior = entity.behavior;
    if (behavior.change) {
      if (behavior.current === 'distributing') {
        totalScore += 25;
        breakdown.push({ component: 'Behavior', score: 25, reason: 'Shifted to distribution', icon: '🔄' });
      } else if (behavior.current === 'accumulating') {
        totalScore += 20;
        breakdown.push({ component: 'Behavior', score: 20, reason: 'Started accumulating', icon: '📈' });
      } else {
        totalScore += 15;
        breakdown.push({ component: 'Behavior', score: 15, reason: 'Behavior changed', icon: '🔄' });
      }
    } else if (behavior.current === 'distributing') {
      totalScore += 10;
      breakdown.push({ component: 'Behavior', score: 10, reason: 'Active distribution', icon: '📉' });
    }
  }

  // 2. RISK (0-20 points)
  if (entity.riskScore > 40) {
    totalScore += 20;
    breakdown.push({ component: 'Risk', score: 20, reason: `Risk score ${entity.riskScore}/100`, icon: '⚠️' });
  } else if (entity.riskScore > 20) {
    totalScore += 10;
    breakdown.push({ component: 'Risk', score: 10, reason: 'Elevated risk', icon: '⚡' });
  }

  // 3. COORDINATION (0-20 points)
  if (entity.behavior?.alignedWith?.length > 0) {
    const count = entity.behavior.alignedWith.length;
    const coordScore = Math.min(20, 10 + count * 3);
    totalScore += coordScore;
    breakdown.push({ component: 'Coordination', score: coordScore, reason: `Aligned with ${count} entities`, icon: '🔗' });
  }

  // 4. MAGNITUDE (0-20 points)
  if (entity.contextSignals?.bridge) {
    totalScore += 15;
    breakdown.push({ component: 'Magnitude', score: 15, reason: 'Bridge cluster detected', icon: '📊' });
  }

  // 5. RECENCY (0-15 points)
  if (entity.behavior?.change?.time?.includes('h')) {
    totalScore += 15;
    breakdown.push({ component: 'Recency', score: 15, reason: `Changed ${entity.behavior.change.time}`, icon: '🕐' });
  }

  breakdown.sort((a, b) => b.score - a.score);

  return {
    score: Math.min(totalScore, 100),
    breakdown,
    topReasons: breakdown.slice(0, 3),
    tier: totalScore >= 70 ? 'critical' : totalScore >= 40 ? 'notable' : 'low'
  };
};

// Signal Score Display Component
const SignalScorePanel = ({ entity }) => {
  const { score, breakdown, tier } = calculateSignalScore(entity);
  
  // Цветовая система: чёрный только для critical (score > 70)
  const tierConfig = {
    critical: { label: 'Critical', color: 'bg-gray-900', textColor: 'text-gray-900', bgLight: 'bg-gray-100' },
    notable: { label: 'Notable', color: 'bg-amber-100 border border-amber-200', textColor: 'text-amber-700', bgLight: 'bg-white' },
    low: { label: 'Low', color: 'bg-gray-100', textColor: 'text-gray-500', bgLight: 'bg-white' }
  };
  
  const config = tierConfig[tier];

  return (
    <GlassCard className={`p-4 ${config.bgLight}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">Signal Score</h3>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-black ${config.textColor}`}>{score}</span>
            <span className="text-gray-400 text-lg">/100</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              tier === 'critical' ? 'bg-gray-900 text-white' : 
              tier === 'notable' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
              'bg-gray-100 text-gray-500'
            }`}>
              {config.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-400 mb-1">Components</div>
          <div className="text-sm font-semibold text-gray-700">{breakdown.length} factors</div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-gray-400 uppercase">Why this score?</div>
        {breakdown.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-base">{item.icon}</span>
            <span className="flex-1 text-gray-700">{item.reason}</span>
            <span className={`font-bold ${item.score >= 15 ? 'text-gray-900' : 'text-gray-500'}`}>
              +{item.score}
            </span>
          </div>
        ))}
      </div>

      {/* Score Bar */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              tier === 'critical' ? 'bg-gray-900' : 
              tier === 'notable' ? 'bg-amber-400' : 
              'bg-gray-400'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[9px] text-gray-400">
          <span>0</span>
          <span>Low {'<'}40</span>
          <span>Notable {'<'}70</span>
          <span>Critical</span>
          <span>100</span>
        </div>
      </div>
    </GlassCard>
  );
};

// Entity Header
const EntityHeader = ({ entity, viewMode, setViewMode }) => {
  const [copied, setCopied] = useState(false);
  const copyAddress = () => {
    navigator.clipboard.writeText(entity.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 py-4">
      <GlassCard className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-900 flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-900">{entity.label}</h1>
                {entity.verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
                <span className="px-2 py-0.5 bg-gray-900 text-white rounded text-xs font-semibold uppercase">
                  {entity.type}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm text-gray-400 font-mono">{entity.address}</code>
                <button onClick={copyAddress} className="p-1 hover:bg-gray-100 rounded">
                  {copied ? <CheckCircle className="w-4 h-4 text-gray-500" /> : <Copy className="w-4 h-4 text-gray-300" />}
                </button>
              </div>
              
              {/* Mode Tabs */}
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5 mt-3">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'timeline', label: 'Timeline' },
                  { id: 'raw', label: 'Activity' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      viewMode === mode.id 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-xs text-gray-400 mb-1">Balance</div>
                <div className="text-lg font-bold text-gray-900">{entity.balance}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Transactions</div>
                <div className="text-lg font-bold text-gray-900">{entity.txCount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Risk</div>
                <div className="text-lg font-bold text-gray-900">{entity.riskScore}/100</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800">
                <Plus className="w-4 h-4" />
                Watchlist
              </button>
              <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50">
                <Bell className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// === COMBINED: Entity Behavior + Portfolio ===
const BehaviorAndPortfolio = ({ behavior, entityType, holdings }) => {
  const getInterpretation = () => {
    if (behavior.current === 'distributing' && behavior.alignedWith?.length > 0) {
      return 'Large net outflows to exchanges detected after accumulation phase';
    }
    if (behavior.current === 'accumulating') {
      return 'Consistent inflow pattern suggests long-term positioning';
    }
    if (behavior.current === 'distributing') {
      return 'Active distribution phase — monitoring for exit signals';
    }
    if (behavior.current === 'rotating') {
      return 'Portfolio rebalancing detected — neutral market signal';
    }
    return 'Monitoring for behavioral changes';
  };

  const top5 = holdings?.slice(0, 5) || [];
  const topHolding = holdings?.[0];
  const showPortfolio = !['exchange', 'market maker', 'cluster'].includes(entityType) && holdings?.length > 0;

  // Цвет иконки по типу поведения
  const getBehaviorIconStyle = () => {
    if (behavior.current === 'accumulating') return 'bg-emerald-500';
    if (behavior.current === 'distributing') return 'bg-red-500';
    if (behavior.current === 'rotating') return 'bg-blue-500';
    return 'bg-gray-400'; // monitoring/neutral
  };

  return (
    <GlassCard className="p-4 h-full">
      {/* Entity Behavior Section */}
      <h2 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4" />
        Entity Behavior
      </h2>
      
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getBehaviorIconStyle()}`}>
            {behavior.current === 'accumulating' && <TrendingUp className="w-4 h-4 text-white" />}
            {behavior.current === 'distributing' && <TrendingDown className="w-4 h-4 text-white" />}
            {behavior.current === 'rotating' && <Activity className="w-4 h-4 text-white" />}
            {!['accumulating', 'distributing', 'rotating'].includes(behavior.current) && <Eye className="w-4 h-4 text-white" />}
          </div>
          <div>
            <div className="text-xs text-gray-400">Current</div>
            <div className={`text-base font-bold capitalize ${
              behavior.current === 'accumulating' ? 'text-emerald-600' :
              behavior.current === 'distributing' ? 'text-red-600' :
              'text-gray-900'
            }`}>{behavior.current}</div>
          </div>
        </div>

        {behavior.change && (
          <div className="border-l border-gray-100 pl-4">
            <div className="text-xs text-gray-400">Changed</div>
            <div className="text-sm font-medium text-gray-900">{behavior.change.time}</div>
          </div>
        )}

        {behavior.alignedWith?.length > 0 && (
          <div className="border-l border-gray-100 pl-4">
            <div className="text-xs text-gray-400">Aligned</div>
            <div className="text-sm font-medium text-gray-900">{behavior.alignedWith.length} entities</div>
          </div>
        )}

        <div className="border-l border-gray-100 pl-4">
          <div className="text-xs text-gray-400">Confidence</div>
          <div className="text-base font-bold text-gray-900">{behavior.confidence}%</div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="px-3 py-2 bg-gray-50 rounded-lg border-l-2 border-gray-400 mb-4">
        <p className="text-xs text-gray-600">{getInterpretation()}</p>
      </div>

      {/* Portfolio Section (if applicable) */}
      {showPortfolio && (
        <>
          <div className="border-t border-gray-100 pt-3 mt-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Portfolio</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Top 5:</span>
              {top5.map((h, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold text-gray-700">
                  {h.symbol}
                </span>
              ))}
              {topHolding && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className={`text-xs font-medium ${topHolding.percentage > 50 ? 'text-amber-600' : 'text-gray-500'}`}>
                    {topHolding.percentage > 50 ? 'concentrated' : topHolding.percentage > 30 ? 'moderate' : 'diversified'} ({topHolding.percentage}% {topHolding.symbol})
                  </span>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </GlassCard>
  );
};

// Context Signals with Bias
const ContextSignals = ({ signals }) => {
  const getBias = () => {
    if (signals.marketTrend === 'bullish' && signals.peers?.some(p => p.behavior === 'Accumulating')) {
      return { label: 'Bullish', confidence: 'High' };
    }
    if (signals.marketTrend === 'bearish' && signals.peers?.some(p => p.behavior === 'Distributing')) {
      return { label: 'Bearish', confidence: 'High' };
    }
    if (signals.marketTrend === 'bullish') {
      return { label: 'Bullish', confidence: 'Medium' };
    }
    return { label: 'Neutral', confidence: 'Low' };
  };

  const bias = getBias();
  const biasInterpretation = bias.label === 'Bearish' 
    ? 'Behavior contradicts market trend — potential distribution pressure'
    : bias.label === 'Bullish'
    ? 'Behavior aligns with market momentum — accumulation signal'
    : 'Mixed signals — wait for directional clarity';

  return (
    <div className="px-4 py-2">
      <GlassCard className="p-5">
        <h2 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Context Signals
        </h2>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-400 uppercase mb-2">Context Bias</div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-bold">{bias.label}</span>
              <span className="text-xs text-gray-500">{bias.confidence} confidence</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400 uppercase mb-2">Market Trend</div>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold capitalize">{signals.marketTrend}</span>
          </div>

          <div>
            <div className="text-xs text-gray-400 uppercase mb-2">Peer Behavior</div>
            <div className="space-y-1">
              {signals.peers?.slice(0, 2).map((peer, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium text-gray-900">{peer.name}</span>
                  <span className="text-gray-500 ml-1">{peer.behavior}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400 uppercase mb-2">Bridge</div>
            {signals.bridge ? (
              <div>
                <div className="font-semibold text-gray-900">Cluster {signals.bridge.cluster}</div>
                <div className="text-xs text-gray-500">{signals.bridge.entities} aligned</div>
              </div>
            ) : (
              <span className="text-sm text-gray-400">No overlap</span>
            )}
          </div>
        </div>

        {/* Bias Interpretation */}
        <div className="px-4 py-3 bg-gray-50 rounded-lg border-l-2 border-gray-400">
          <p className="text-sm text-gray-600">{biasInterpretation}</p>
        </div>
      </GlassCard>
    </div>
  );
};

// Timeline View
// === ENHANCED TIMELINE VIEW ===
const EntityTimeline = ({ events, transactions }) => {
  const [filter, setFilter] = useState('all');
  
  // Combine timeline events with transactions for a complete view
  const allEvents = [
    ...events.map(e => ({ ...e, source: 'event' })),
    ...(transactions || []).slice(0, 5).map(tx => ({
      type: 'transaction',
      title: `${tx.type.toUpperCase()} ${tx.token}`,
      date: tx.time,
      description: `${tx.valueUsd} ${tx.pattern ? `• ${tx.pattern.replace(/_/g, ' ')}` : ''}`,
      source: 'transaction',
      txType: tx.type
    }))
  ];

  const filteredEvents = filter === 'all' 
    ? allEvents 
    : allEvents.filter(e => e.type === filter);

  const eventTypeConfig = {
    behavior: { icon: Activity, color: 'bg-purple-100 text-purple-600', label: 'Behavior' },
    bridge: { icon: Users, color: 'bg-blue-100 text-blue-600', label: 'Bridge' },
    risk: { icon: AlertTriangle, color: 'bg-red-100 text-red-600', label: 'Risk' },
    transfer: { icon: ArrowUpRight, color: 'bg-gray-100 text-gray-600', label: 'Transfer' },
    transaction: { icon: Activity, color: 'bg-emerald-100 text-emerald-600', label: 'Transaction' }
  };

  return (
    <div className="px-4 py-2">
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Activity Timeline
          </h2>
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-1">
            {['all', 'behavior', 'transaction', 'risk'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2 py-1 rounded text-[10px] font-semibold capitalize transition-all ${
                  filter === type 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No events found for this filter
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-3">
              {filteredEvents.map((event, i) => {
                const config = eventTypeConfig[event.type] || eventTypeConfig.transfer;
                const IconComponent = config.icon;
                return (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${config.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 pb-3 border-b border-gray-50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{event.title}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${config.color}`}>
                            {event.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{event.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

// === RAW ACTIVITY VIEW (All Transactions Table) ===
const RawActivityView = ({ transactions, holdings }) => {
  const [activeTab, setActiveTab] = useState('transactions');
  
  return (
    <div className="px-4 py-2 space-y-4">
      {/* Tab Selector */}
      <div className="flex items-center gap-2">
        {[
          { id: 'transactions', label: 'All Transactions' },
          { id: 'holdings', label: 'Holdings Detail' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'transactions' && (
        <GlassCard className="p-5">
          <h2 className="text-xs font-bold text-gray-400 uppercase mb-4">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase">Token</th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                  <th className="py-3 px-4 text-right text-xs font-bold text-gray-500 uppercase">Value (USD)</th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase">Pattern</th>
                  <th className="py-3 px-4 text-right text-xs font-bold text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        tx.type === 'buy' ? 'bg-emerald-100 text-emerald-700' :
                        tx.type === 'sell' ? 'bg-red-100 text-red-700' : 
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{tx.token}</td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">{tx.amount}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">{tx.valueUsd}</td>
                    <td className="py-3 px-4">
                      {tx.pattern ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                          {tx.pattern.replace(/_/g, ' ')}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-gray-400">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {activeTab === 'holdings' && (
        <GlassCard className="p-5">
          <h2 className="text-xs font-bold text-gray-400 uppercase mb-4">Holdings Breakdown</h2>
          
          {/* Layout: Donut Chart + List */}
          <div className="grid grid-cols-2 gap-6">
            {/* Donut Chart */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <PieChart width={220} height={220}>
                  <Pie
                    data={holdings}
                    cx={110}
                    cy={110}
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="percentage"
                    nameKey="symbol"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {holdings.map((entry, index) => {
                      // Muted, professional colors
                      const COLORS = ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'];
                      return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />;
                    })}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
                {/* Center Label - positioned over the chart */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="text-xl font-bold text-gray-900">
                    ${(holdings.reduce((a, b) => a + (b.value || 0), 0) / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-[10px] text-gray-500">Total Value</div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {holdings.slice(0, 6).map((h, i) => {
                  const COLORS = ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'];
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs font-medium text-gray-600">{h.symbol}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Holdings List - Clean, no colored backgrounds */}
            <div className="space-y-3">
              {holdings.map((holding, i) => {
                // Muted grayscale progression
                const COLORS = ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'];
                const color = COLORS[i % COLORS.length];
                
                return (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: color }}
                    >
                      {holding.symbol.slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900">{holding.symbol}</span>
                        <span className="text-sm font-semibold text-gray-700">
                          ${(holding.value / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ width: `${holding.percentage}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600 w-10 text-right">
                          {holding.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Summary Stats - Single consistent color */}
          <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Top Holding</div>
              <div className="text-lg font-bold text-gray-900">{holdings[0]?.symbol}</div>
              <div className="text-xs text-gray-500">{holdings[0]?.percentage}% of portfolio</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Diversity</div>
              <div className="text-lg font-bold text-gray-900">{holdings.length} tokens</div>
              <div className="text-xs text-gray-500">across holdings</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Concentration</div>
              <div className="text-lg font-bold text-gray-900">
                {holdings[0]?.percentage > 50 ? 'High' : holdings[0]?.percentage > 30 ? 'Moderate' : 'Low'}
              </div>
              <div className="text-xs text-gray-500">risk level</div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

// Portfolio — однострочный компактный summary
const Holdings = ({ holdings, entityType, recentRotation }) => {
  // Hide for Exchange/Cluster/Market Maker
  if (['exchange', 'market maker', 'cluster'].includes(entityType)) {
    return null;
  }

  const top5 = holdings.slice(0, 5);
  const topHolding = holdings[0];
  const concentrationLevel = topHolding.percentage > 50 ? 'concentrated' : topHolding.percentage > 30 ? 'moderate' : 'diversified';
  
  // Recent rotation detection (mock)
  const rotation = recentRotation || { from: 'USDC', to: 'ETH', timeAgo: '2d' };
  
  return (
    <GlassCard className="p-4 h-full">
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Portfolio</h3>
      
      {/* Single-line Summary */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-600">Top 5:</span>
        <div className="flex items-center gap-1">
          {top5.map((h, i) => (
            <span key={i} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold text-gray-700">
              {h.symbol}
            </span>
          ))}
        </div>
        <span className="text-gray-300">|</span>
        <span className={`text-xs font-medium ${
          concentrationLevel === 'concentrated' ? 'text-amber-600' : 'text-gray-500'
        }`}>
          {concentrationLevel} ({topHolding.percentage}% {topHolding.symbol})
        </span>
      </div>
      
      {/* Recent Rotation */}
      {rotation && (
        <div className="mt-2 text-xs text-gray-500">
          Recent rotation: <span className="font-medium text-gray-700">{rotation.from} → {rotation.to}</span>
          <span className="text-gray-400 ml-1">({rotation.timeAgo})</span>
        </div>
      )}
    </GlassCard>
  );
};

// Accumulation Chart with context overlay and micro-caption
// === ENHANCED FLOW TREND CHART (50% width version) ===
const FlowTrendChart = ({ data, behavior, events, entity }) => {
  const [period, setPeriod] = useState('1M');
  const [selectedMetrics, setSelectedMetrics] = useState([
    { id: 'netFlow', label: 'NF', name: 'Net Flow', color: '#3B82F6' },
    { id: 'inflow', label: 'IN', name: 'Inflow', color: '#10B981' },
    { id: 'outflow', label: 'OUT', name: 'Outflow', color: '#EF4444' }
  ]);

  const allMetrics = [
    { id: 'netFlow', label: 'NF', name: 'Net Flow', color: '#3B82F6' },
    { id: 'inflow', label: 'IN', name: 'Inflow', color: '#10B981' },
    { id: 'outflow', label: 'OUT', name: 'Outflow', color: '#EF4444' },
    { id: 'volume', label: 'VOL', name: 'Volume', color: '#8B5CF6' }
  ];

  // Transform data for multi-line chart
  const chartData = data.map((d, i) => ({
    date: d.date,
    netFlow: d.amount,
    inflow: d.amount > 0 ? d.amount : Math.abs(d.amount) * 0.3,
    outflow: d.amount < 0 ? Math.abs(d.amount) : d.amount * 0.2,
    volume: Math.abs(d.amount) * (1 + Math.random() * 0.5)
  }));

  // Calculate metrics
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b.amount, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b.amount, 0) / secondHalf.length;
  const flowRatio = Math.abs(secondAvg / firstAvg).toFixed(1);
  const totalFlow = data.reduce((a, b) => a + b.amount, 0);
  const avgFlow = (totalFlow / data.length).toFixed(0);
  const inflows = data.filter(d => d.amount > 0).reduce((a, b) => a + b.amount, 0);
  const outflows = Math.abs(data.filter(d => d.amount < 0).reduce((a, b) => a + b.amount, 0));
  const ioRatio = outflows > 0 ? (inflows / outflows).toFixed(1) : '∞';

  const removeMetric = (metricId) => {
    if (selectedMetrics.length > 1) {
      setSelectedMetrics(selectedMetrics.filter(m => m.id !== metricId));
    }
  };

  const addMetric = (metric) => {
    if (!selectedMetrics.find(m => m.id === metric.id)) {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const getChartInterpretation = () => {
    if (behavior === 'accumulating' && secondAvg > firstAvg) {
      return `Inflows accelerating ${flowRatio}×. Strong accumulation.`;
    }
    if (behavior === 'distributing') {
      return `Outflows exceed inflows ${ioRatio > 1 ? (1/ioRatio).toFixed(1) : ioRatio}×. Distribution active.`;
    }
    return 'Stable flow pattern.';
  };

  const chartEvents = events || [{ date: 'W4', label: 'Behavior shift', type: 'behavior' }];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-lg text-xs">
          <p className="font-bold text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => {
            const metric = selectedMetrics.find(m => m.id === entry.dataKey);
            return (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-600">{metric?.name}:</span>
                <span className="font-semibold">${Math.abs(entry.value).toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase">Flow Trend</h3>
        <div className="flex items-center bg-gray-100 rounded p-0.5">
          {['1W', '1M', '3M'].map(p => (
            <button 
              key={p} 
              onClick={() => setPeriod(p)}
              className={`px-2 py-1 text-[10px] font-semibold rounded transition-all ${
                period === p ? 'bg-gray-900 text-white' : 'text-gray-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row - Compact */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center">
          <div className="text-[9px] text-gray-400">Avg</div>
          <div className="text-sm font-bold text-gray-900">${avgFlow}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-gray-400">I/O</div>
          <div className={`text-sm font-bold ${parseFloat(ioRatio) > 1 ? 'text-emerald-600' : 'text-red-600'}`}>{ioRatio}×</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-gray-400">Trend</div>
          <div className={`text-sm font-bold ${secondAvg > firstAvg ? 'text-emerald-600' : 'text-red-600'}`}>
            {secondAvg > firstAvg ? '↑' : '↓'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-gray-400">Momentum</div>
          <div className="text-sm font-bold text-gray-900">{flowRatio}×</div>
        </div>
      </div>

      {/* Metric Pills - Compact */}
      <div className="flex items-center gap-1 mb-2 flex-wrap">
        {selectedMetrics.map(metric => (
          <div 
            key={metric.id}
            className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded border border-gray-100"
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metric.color }} />
            <span className="text-[10px] font-medium text-gray-600">{metric.label}</span>
            {selectedMetrics.length > 1 && (
              <button onClick={() => removeMetric(metric.id)} className="text-gray-400 hover:text-red-500">
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
        {selectedMetrics.length < 4 && (
          <div className="relative group">
            <button className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500 hover:bg-gray-200">+</button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg hidden group-hover:block z-10">
              {allMetrics.filter(m => !selectedMetrics.find(s => s.id === m.id)).map(metric => (
                <button
                  key={metric.id}
                  onClick={() => addMetric(metric)}
                  className="flex items-center gap-2 w-full px-2 py-1 text-[10px] text-gray-700 hover:bg-gray-50"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
                  {metric.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            {chartEvents.map((event, i) => (
              <ReferenceLine key={i} x={event.date} stroke="#F59E0B" strokeDasharray="3 3" />
            ))}
            {selectedMetrics.map(metric => (
              <Line key={metric.id} type="monotone" dataKey={metric.id} stroke={metric.color} strokeWidth={2} dot={{ r: 3, fill: metric.color }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Interpretation */}
      <div className="mt-2 p-2 bg-gray-50 rounded border-l-2 border-gray-400">
        <p className="text-[11px] text-gray-600">{getChartInterpretation()}</p>
      </div>
    </GlassCard>
  );
};

// === COMPACT TRANSACTION ACTIVITY (for side panel) ===
const CompactTransactionActivity = ({ transactions }) => {
  const patternEvents = transactions.filter(tx => tx.pattern);
  const recentTx = transactions.slice(0, 6);

  return (
    <GlassCard className="p-4 h-full flex flex-col">
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Transaction Activity</h3>
      
      {/* Key Patterns Summary */}
      {patternEvents.length > 0 && (
        <div className="mb-3 pb-3 border-b border-gray-100">
          <div className="text-[10px] text-gray-400 mb-2">Key Patterns</div>
          <div className="flex flex-wrap gap-1">
            {patternEvents.slice(0, 3).map((tx, i) => (
              <span 
                key={i} 
                className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-[10px] font-semibold"
              >
                {tx.pattern.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions List */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-2">
          {recentTx.map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  tx.type === 'buy' ? 'bg-emerald-500' :
                  tx.type === 'sell' ? 'bg-red-500' : 'bg-gray-400'
                }`} />
                <span className="text-xs font-semibold text-gray-900">{tx.token}</span>
                <span className={`text-[10px] font-medium ${
                  tx.type === 'buy' ? 'text-emerald-600' :
                  tx.type === 'sell' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {tx.type.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-700">{tx.valueUsd}</div>
                <div className="text-[9px] text-gray-400">{tx.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <div className="pt-2 mt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500 cursor-pointer hover:text-gray-900">
          View all {transactions.length} transactions →
        </span>
      </div>
    </GlassCard>
  );
};

// Pattern Tooltip Component
const PatternTooltip = ({ pattern, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const patternInfo = {
    'first_entry': {
      title: 'First Entry',
      description: 'First significant purchase in 30+ days',
      meaning: 'Often precedes continued accumulation phase',
      signal: 'bullish'
    },
    'exit_after_accumulation': {
      title: 'Exit After Accumulation',
      description: 'Sell following sustained buying period',
      meaning: 'May signal local top or profit-taking',
      signal: 'bearish'
    },
    'cross_entity': {
      title: 'Cross-Entity Transfer',
      description: 'Internal wallet rebalancing',
      meaning: 'Usually not market-significant',
      signal: 'neutral'
    },
    'dca_pattern': {
      title: 'DCA Pattern',
      description: 'Regular periodic purchases',
      meaning: 'Long-term positioning strategy',
      signal: 'bullish'
    },
    'size_spike': {
      title: 'Size Spike',
      description: 'Transaction 3x+ normal size',
      meaning: 'High conviction move',
      signal: 'notable'
    }
  };

  const info = patternInfo[pattern] || { title: pattern, description: 'Unknown pattern', meaning: 'Monitor for follow-up', signal: 'neutral' };
  const signalColors = {
    bullish: 'border-emerald-300 bg-emerald-50',
    bearish: 'border-red-300 bg-red-50',
    notable: 'border-amber-300 bg-amber-50',
    neutral: 'border-gray-200 bg-gray-50'
  };

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {showTooltip && (
        <div className={`absolute z-20 bottom-full left-0 mb-2 w-56 p-3 rounded-lg border shadow-lg ${signalColors[info.signal]}`}>
          <div className="text-xs font-bold text-gray-900 mb-1">{info.title}</div>
          <div className="text-[10px] text-gray-600 mb-2">{info.description}</div>
          <div className="text-[10px] font-medium text-gray-700">→ {info.meaning}</div>
          <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-inherit border-r border-b border-inherit"></div>
        </div>
      )}
    </div>
  );
};

// Transaction History — Signal-first with Tooltips
const TransactionHistory = ({ transactions }) => {
  const [showRaw, setShowRaw] = useState(false);

  // Separate pattern events from raw transactions
  const patternEvents = transactions.filter(tx => tx.pattern);
  const rawTransactions = transactions;

  return (
    <div className="px-4 py-2">
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase">Transaction Activity</h3>
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setShowRaw(false)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                !showRaw ? 'bg-gray-900 text-white' : 'text-gray-500'
              }`}
            >
              Key Events
            </button>
            <button
              onClick={() => setShowRaw(true)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                showRaw ? 'bg-gray-900 text-white' : 'text-gray-500'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {!showRaw ? (
          // Signal-first: Key Events with Tooltips
          <div className="space-y-3">
            {patternEvents.length > 0 ? patternEvents.map((tx, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      tx.type === 'buy' ? 'bg-emerald-600 text-white' :
                      tx.type === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {tx.type.toUpperCase()}
                    </span>
                    <span className="font-semibold text-gray-900">{tx.token}</span>
                    <span className="text-gray-500">{tx.valueUsd}</span>
                  </div>
                  <span className="text-xs text-gray-400">{tx.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PatternTooltip pattern={tx.pattern}>
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-semibold border-b border-dashed border-gray-400">
                      {tx.pattern.replace(/_/g, ' ')}
                    </span>
                  </PatternTooltip>
                </div>
              </div>
            )) : (
              <div className="text-sm text-gray-400 italic">No significant pattern events detected</div>
            )}
          </div>
        ) : (
          // Raw transactions table
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">Type</th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">Token</th>
                  <th className="py-2 px-3 text-right text-xs font-semibold text-gray-400">Value</th>
                  <th className="py-2 px-3 text-right text-xs font-semibold text-gray-400">Time</th>
                </tr>
              </thead>
              <tbody>
                {rawTransactions.map((tx, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        tx.type === 'buy' ? 'bg-emerald-600 text-white' :
                        tx.type === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold text-gray-900">{tx.token}</td>
                    <td className="py-2 px-3 text-right text-gray-600">{tx.valueUsd}</td>
                    <td className="py-2 px-3 text-right text-xs text-gray-400">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

// Action Insight Block — ЛЕГКАЯ ПАНЕЛЬ с icon tags
const ActionInsight = ({ entity }) => {
  const getInsight = () => {
    const { behavior, contextSignals, type } = entity;
    
    if (behavior.current === 'distributing' && behavior.alignedWith?.length > 0) {
      return {
        text: `Distribution phase aligned with ${behavior.alignedWith.length} entities. Similar patterns preceded volatility spikes.`,
        severity: 'high',
        tags: ['volatility', 'coordination', 'exit_risk']
      };
    }
    if (behavior.current === 'accumulating' && contextSignals.marketTrend === 'bullish') {
      return {
        text: `Accumulation aligns with bullish momentum. High conviction signal.`,
        severity: 'positive',
        tags: ['trend_aligned', 'accumulation']
      };
    }
    if (behavior.current === 'accumulating' && contextSignals.marketTrend === 'bearish') {
      return {
        text: `Counter-trend accumulation. Building position against market sentiment.`,
        severity: 'notable',
        tags: ['contrarian', 'high_conviction']
      };
    }
    if (type === 'exchange' && behavior.current === 'distributing') {
      return {
        text: `Exchange outflows detected. User withdrawals or repositioning.`,
        severity: 'neutral',
        tags: ['exchange_flow']
      };
    }
    return {
      text: `Monitoring for behavioral changes. Activity within normal range.`,
      severity: 'neutral',
      tags: ['monitoring']
    };
  };

  const insight = getInsight();
  
  const tagConfig = {
    volatility: { icon: '⚠️', label: 'Volatility', color: 'bg-amber-100 text-amber-700' },
    coordination: { icon: '🔗', label: 'Coordination', color: 'bg-blue-100 text-blue-700' },
    exit_risk: { icon: '🚪', label: 'Exit Risk', color: 'bg-red-100 text-red-700' },
    trend_aligned: { icon: '📈', label: 'Trend Aligned', color: 'bg-emerald-100 text-emerald-700' },
    accumulation: { icon: '💰', label: 'Accumulation', color: 'bg-emerald-100 text-emerald-700' },
    contrarian: { icon: '🔄', label: 'Contrarian', color: 'bg-purple-100 text-purple-700' },
    high_conviction: { icon: '💎', label: 'High Conviction', color: 'bg-purple-100 text-purple-700' },
    exchange_flow: { icon: '🏦', label: 'Exchange Flow', color: 'bg-gray-100 text-gray-600' },
    monitoring: { icon: '👁️', label: 'Monitoring', color: 'bg-gray-100 text-gray-500' }
  };

  // Цветовая система по типу сигнала (soft colors)
  const severityStyles = {
    high: 'bg-gray-100 border-gray-300', // Coordinated Distribution — тёмный акцент через border
    positive: 'bg-emerald-50/50 border-emerald-200', // Accumulation — soft green
    notable: 'bg-amber-50/50 border-amber-200', // Notable — soft amber
    neutral: 'bg-white border-gray-100' // Monitoring — серо-белый
  };

  return (
    <div className="px-4 py-2">
      <div className={`p-3 rounded-lg border ${severityStyles[insight.severity]}`}>
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-gray-700 flex-1">{insight.text}</p>
          <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
            {insight.tags?.map(tag => (
              <span 
                key={tag} 
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${tagConfig[tag]?.color || 'bg-gray-100 text-gray-600'}`}
                title={tagConfig[tag]?.label}
              >
                <span>{tagConfig[tag]?.icon}</span>
                <span className="hidden sm:inline">{tagConfig[tag]?.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Entity Page
export default function EntityPage() {
  const { id } = useParams();
  const [entity, setEntity] = useState(null);
  const [viewMode, setViewMode] = useState('overview');

  useEffect(() => {
    const entityDatabase = {
      '1': { label: 'Vitalik Buterin', type: 'influencer', balance: '$45.2M', txCount: '1,247', behavior: 'accumulating' },
      '2': { label: 'Binance Hot Wallet', type: 'exchange', balance: '$2.8B', txCount: '89,234', behavior: 'distributing' },
      'binance': { label: 'Binance', type: 'exchange', balance: '$28.4B', txCount: '125,000+', behavior: 'accumulating' },
      'coinbase': { label: 'Coinbase', type: 'exchange', balance: '$18.9B', txCount: '89,000+', behavior: 'distributing' },
      'kraken': { label: 'Kraken', type: 'exchange', balance: '$8.2B', txCount: '45,000+', behavior: 'accumulating' },
      'a16z': { label: 'a16z Crypto', type: 'fund', balance: '$4.5B', txCount: '2,340', behavior: 'accumulating' },
      'paradigm': { label: 'Paradigm', type: 'fund', balance: '$3.2B', txCount: '1,560', behavior: 'holding' },
      'jump': { label: 'Jump Trading', type: 'market maker', balance: '$1.2B', txCount: '67,000+', behavior: 'distributing' },
      'grayscale': { label: 'Grayscale', type: 'fund', balance: '$21.5B', txCount: '450', behavior: 'accumulating' },
      'galaxy': { label: 'Galaxy Digital', type: 'fund', balance: '$1.8B', txCount: '1,340', behavior: 'accumulating' },
    };

    const entityInfo = entityDatabase[id] || { label: `Entity ${id}`, type: 'unknown', balance: '$0', txCount: '0', behavior: 'neutral' };
    
    setEntity({
      id,
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      ...entityInfo,
      verified: true,
      riskScore: entityInfo.behavior === 'distributing' ? 45 : 12,
      firstSeen: 'Jul 2015',
      
      behavior: {
        current: entityInfo.behavior,
        change: { from: 'Neutral', to: entityInfo.behavior, time: '18h ago' },
        alignedWith: ['Binance', 'Kraken', 'Jump Trading'],
        confidence: 78
      },

      contextSignals: {
        marketTrend: 'bullish',
        peers: [
          { name: 'a16z', behavior: 'Accumulating' },
          { name: 'Paradigm', behavior: 'Holding' }
        ],
        bridge: { cluster: 'A', entities: 3 }
      },

      timeline: [
        { type: 'behavior', title: 'Behavior Change', date: 'Week 5', description: 'Started accumulating ETH after market dip' },
        { type: 'bridge', title: 'Bridge Alignment', date: 'Week 4', description: 'Joined Cluster A with Binance, Kraken' },
        { type: 'risk', title: 'Risk Shift', date: 'Week 3', description: 'Risk level decreased: Medium → Low' },
        { type: 'transfer', title: 'Major Transfer', date: 'Week 2', description: 'Received $5M from Coinbase' }
      ],

      holdings: [
        { symbol: 'ETH', value: 25000000, percentage: 55 },
        { symbol: 'USDC', value: 10000000, percentage: 22 },
        { symbol: 'UNI', value: 5000000, percentage: 11 },
        { symbol: 'AAVE', value: 3000000, percentage: 7 },
        { symbol: 'Other', value: 2200000, percentage: 5 }
      ],

      accumulation: [
        { date: 'W1', amount: 1000 },
        { date: 'W2', amount: 1200 },
        { date: 'W3', amount: 1150 },
        { date: 'W4', amount: 1400 },
        { date: 'W5', amount: 1600 },
        { date: 'W6', amount: 1800 },
        { date: 'W7', amount: 2000 }
      ],

      transactions: [
        { type: 'buy', token: 'UNI', amount: '1,250', valueUsd: '$125,000', pattern: 'first_entry', time: '2h ago' },
        { type: 'sell', token: 'AAVE', amount: '450', valueUsd: '$87,500', pattern: 'exit_after_accumulation', time: '5h ago' },
        { type: 'transfer', token: 'ETH', amount: '15', valueUsd: '$50,000', pattern: 'cross_entity', time: '1d ago' },
        { type: 'buy', token: 'ETH', amount: '60', valueUsd: '$200,000', pattern: null, time: '2d ago' },
        { type: 'transfer', token: 'USDC', amount: '100,000', valueUsd: '$100,000', pattern: null, time: '3d ago' }
      ]
    });
  }, [id]);

  if (!entity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="px-4 pt-4">
        <Link to="/signals" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ChevronLeft className="w-4 h-4" />
          Signals
        </Link>
      </div>

      <EntityHeader entity={entity} viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === 'overview' && (
        <>
          <ActionInsight entity={entity} />
          
          {/* Signal Score + Entity Behavior & Portfolio (combined) */}
          <div className="px-4 py-2 grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <SignalScorePanel entity={entity} />
            </div>
            <div className="col-span-2">
              <BehaviorAndPortfolio 
                behavior={entity.behavior} 
                entityType={entity.type} 
                holdings={entity.holdings}
              />
            </div>
          </div>
          
          {/* Flow Trend (50%) + Transaction Activity (50%) - side by side */}
          <div className="px-4 py-2 grid grid-cols-2 gap-4">
            <FlowTrendChart data={entity.accumulation} behavior={entity.behavior.current} entity={entity} />
            <CompactTransactionActivity transactions={entity.transactions} />
          </div>
          
          {/* Context Signals */}
          <ContextSignals signals={entity.contextSignals} />
        </>
      )}

      {viewMode === 'timeline' && (
        <EntityTimeline events={entity.timeline} transactions={entity.transactions} />
      )}

      {viewMode === 'raw' && (
        <RawActivityView transactions={entity.transactions} holdings={entity.holdings} />
      )}
    </div>
  );
}
