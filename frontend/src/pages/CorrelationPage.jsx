import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import Header from '../components/Header';
import { 
  Filter, ChevronDown, TrendingUp, Users, Zap, Crown, 
  GitBranch, ArrowRight, Eye, X, Activity, Target, 
  Expand, Layers, Copy, Network, EyeOff, Info
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';

// ==================== CONSTANTS ====================

// Fixed strategy color palette (consistent with UI)
const STRATEGY_COLORS = {
  'Smart Money': '#22c55e',      // green
  'Infrastructure': '#6366f1',   // indigo
  'Momentum': '#f59e0b',         // orange/amber
  'Meme': '#ec4899',             // pink
  'Market Maker': '#06b6d4',     // cyan
  'High Risk': '#ef4444',        // red
  'DeFi': '#8b5cf6',             // purple
  'Default': '#64748b',          // gray
};

// Role colors
const ROLE_CONFIG = {
  'Leader': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🟢', color: '#22c55e' },
  'Follower': { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🟡', color: '#f59e0b' },
  'Neutral': { bg: 'bg-gray-100', text: 'text-gray-600', icon: '⚪', color: '#64748b' },
};

// Graph modes
const GRAPH_MODES = [
  { id: 'influence', label: 'Market Influence', icon: Crown, description: 'Who leads, who moves first' },
  { id: 'copy', label: 'Copy Trading', icon: Copy, description: 'Who to copy, entry timing' },
  { id: 'clusters', label: 'Strategy Clusters', icon: Layers, description: 'Group rotation patterns' },
];

// ==================== MOCK DATA ====================

// Comprehensive actor data with all metrics
const actorsData = [
  {
    id: 'a16z',
    real_name: 'a16z Crypto',
    strategy_name: 'Institutional Infrastructure Play',
    strategy: 'Infrastructure',
    chain: 'ETH',
    edgeScore: 91,
    // Raw metrics for Influence Score calculation
    followers_count: 5,
    avg_follower_lag: 6.2,  // hours
    consistency: 0.91,
    market_impact: 0.85,
    // Relationships
    frontRuns: ['alameda'],
    followedBy: ['vitalik', 'pantera'],
    correlations: [
      { id: 'vitalik', strength: 0.72, type: 'similar' },
      { id: 'pantera', strength: 0.68, type: 'similar' },
    ],
  },
  {
    id: 'alameda',
    real_name: 'Alameda Research',
    strategy_name: 'SOL Ecosystem Accumulator',
    strategy: 'Momentum',
    chain: 'SOL',
    edgeScore: 86,
    followers_count: 6,
    avg_follower_lag: 4.5,
    consistency: 0.85,
    market_impact: 0.78,
    frontRuns: ['dwf-labs'],
    followedBy: [],
    correlations: [
      { id: 'pantera', strength: 0.76, type: 'similar' },
      { id: 'dwf-labs', strength: 0.52, type: 'follows' },
    ],
  },
  {
    id: 'pantera',
    real_name: 'Pantera Capital',
    strategy_name: 'AI Narrative Accumulator',
    strategy: 'Smart Money',
    chain: 'ETH',
    edgeScore: 84,
    followers_count: 5,
    avg_follower_lag: 4.8,
    consistency: 0.82,
    market_impact: 0.72,
    frontRuns: ['vitalik', 'dwf-labs'],
    followedBy: [],
    correlations: [
      { id: 'a16z', strength: 0.68, type: 'similar' },
      { id: 'vitalik', strength: 0.71, type: 'similar' },
    ],
  },
  {
    id: 'vitalik',
    real_name: 'Vitalik.eth',
    strategy_name: 'L2 Infrastructure Builder',
    strategy: 'Smart Money',
    chain: 'ETH',
    edgeScore: 78,
    followers_count: 4,
    avg_follower_lag: 5.8,
    consistency: 0.78,
    market_impact: 0.65,
    frontRuns: [],
    followedBy: ['pantera'],
    correlations: [
      { id: 'a16z', strength: 0.72, type: 'similar' },
      { id: 'pantera', strength: 0.71, type: 'similar' },
    ],
  },
  {
    id: 'wintermute',
    real_name: 'Wintermute',
    strategy_name: 'DeFi Yield Optimizer',
    strategy: 'Market Maker',
    chain: 'ETH',
    edgeScore: 45,
    followers_count: 1,
    avg_follower_lag: 3.2,
    consistency: 0.58,
    market_impact: 0.42,
    frontRuns: [],
    followedBy: [],
    correlations: [
      { id: 'jump-trading', strength: 0.64, type: 'similar' },
    ],
  },
  {
    id: 'jump-trading',
    real_name: 'Jump Trading',
    strategy_name: 'HFT Arbitrage Engine',
    strategy: 'Market Maker',
    chain: 'ETH',
    edgeScore: 28,
    followers_count: 2,
    avg_follower_lag: 1.2,
    consistency: 0.62,
    market_impact: 0.35,
    frontRuns: [],
    followedBy: [],
    correlations: [
      { id: 'wintermute', strength: 0.64, type: 'similar' },
    ],
  },
  {
    id: 'dwf-labs',
    real_name: 'DWF Labs',
    strategy_name: 'Meme Momentum Rider',
    strategy: 'Meme',
    chain: 'ETH',
    edgeScore: 52,
    followers_count: 1,
    avg_follower_lag: 2.1,
    consistency: 0.52,
    market_impact: 0.38,
    frontRuns: [],
    followedBy: ['alameda', 'pantera'],
    correlations: [
      { id: 'unknown-whale-1', strength: 0.68, type: 'similar' },
    ],
  },
  {
    id: 'unknown-whale-1',
    real_name: 'Smart Whale #4721',
    strategy_name: 'High-Risk Flip Trader',
    strategy: 'High Risk',
    chain: 'SOL',
    edgeScore: 15,
    followers_count: 0,
    avg_follower_lag: 0,
    consistency: 0.28,
    market_impact: 0.15,
    frontRuns: [],
    followedBy: ['vitalik'],
    correlations: [
      { id: 'dwf-labs', strength: 0.68, type: 'similar' },
    ],
  },
];

// ==================== UTILITIES ====================

// Normalize value to 0-1 range
const normalize = (value, min, max) => {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

// Calculate normalized Influence Score (0-100)
const calculateInfluenceScore = (actor, allActors) => {
  // Get min/max for normalization
  const maxFollowers = Math.max(...allActors.map(a => a.followers_count));
  const maxLag = Math.max(...allActors.map(a => a.avg_follower_lag || 24));
  
  const followers_norm = normalize(actor.followers_count, 0, maxFollowers);
  const lag_norm = actor.avg_follower_lag > 0 
    ? 1 - normalize(actor.avg_follower_lag, 0, maxLag) // Inverse: less lag = better
    : 0;
  const consistency_norm = actor.consistency;
  const impact_norm = actor.market_impact;
  
  const score = (
    (followers_norm * 0.35) +
    (lag_norm * 0.25) +
    (consistency_norm * 0.25) +
    (impact_norm * 0.15)
  ) * 100;
  
  return Math.round(score);
};

// Determine role based on influence metrics
const getRole = (actor) => {
  const leadsCount = actor.frontRuns?.length || 0;
  const followedByCount = actor.followedBy?.length || 0;
  
  const leadsRatio = followedByCount > 0 ? leadsCount / followedByCount : leadsCount;
  const followsRatio = leadsCount > 0 ? followedByCount / leadsCount : followedByCount;
  
  if (actor.followers_count >= 3 && leadsRatio >= 0.5) return 'Leader';
  if (followedByCount >= 2 && followsRatio > 1.2) return 'Follower';
  return 'Neutral';
};

// Clamp node size
const clampSize = (influenceScore, min = 20, max = 60) => {
  return Math.max(min, Math.min(max, min + (influenceScore / 100) * (max - min)));
};

// ==================== COMPONENTS ====================

// Mode selector tabs
const ModeSelector = ({ mode, setMode }) => (
  <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
    {GRAPH_MODES.map(m => (
      <Tooltip key={m.id}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m.id 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <m.icon className="w-4 h-4" />
            {m.label}
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 text-white">
          <p className="text-xs">{m.description}</p>
        </TooltipContent>
      </Tooltip>
    ))}
  </div>
);

// Influence Leaderboard
const InfluenceLeaderboard = ({ actors, showRealNames, onSelectActor }) => {
  const sorted = [...actors].sort((a, b) => b.influenceScore - a.influenceScore);
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Crown className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-gray-900">Influence Leaderboard</h3>
      </div>
      <p className="text-xs text-gray-500 mb-3">Market movers (not by PnL)</p>
      
      <div className="space-y-1.5">
        {sorted.slice(0, 10).map((actor, idx) => (
          <button 
            key={actor.id}
            onClick={() => onSelectActor(actor)}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              idx === 0 ? 'bg-amber-400 text-amber-900' :
              idx === 1 ? 'bg-gray-300 text-gray-700' :
              idx === 2 ? 'bg-amber-600 text-amber-100' :
              'bg-gray-100 text-gray-500'
            }`}>
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">
                {showRealNames ? actor.real_name : actor.strategy_name}
              </div>
              <div className="text-xs text-gray-400">{actor.strategy}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-violet-600 text-sm">{actor.influenceScore}</div>
              <div className={`text-xs px-1.5 py-0.5 rounded ${ROLE_CONFIG[actor.role].bg} ${ROLE_CONFIG[actor.role].text}`}>
                {actor.role}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Strategy Flow Map
const StrategyFlowMap = () => {
  const phases = ['Accumulating', 'Active', 'Rotating', 'Distributing'];
  const strategies = ['Smart Money', 'Infrastructure', 'Momentum', 'Meme', 'Market Maker'];
  
  // Mock activity matrix
  const matrix = {
    'Smart Money': { 'Accumulating': 3, 'Active': 1, 'Rotating': 0, 'Distributing': 0 },
    'Infrastructure': { 'Accumulating': 2, 'Active': 0, 'Rotating': 1, 'Distributing': 0 },
    'Momentum': { 'Accumulating': 1, 'Active': 2, 'Rotating': 1, 'Distributing': 0 },
    'Meme': { 'Accumulating': 0, 'Active': 1, 'Rotating': 0, 'Distributing': 1 },
    'Market Maker': { 'Accumulating': 0, 'Active': 0, 'Rotating': 2, 'Distributing': 0 },
  };
  
  const getIntensity = (count) => {
    if (count >= 3) return 'bg-emerald-500 text-white';
    if (count === 2) return 'bg-emerald-300 text-emerald-900';
    if (count === 1) return 'bg-emerald-100 text-emerald-700';
    return 'bg-gray-50 text-gray-300';
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5 text-violet-500" />
        <h3 className="font-bold text-gray-900">Strategy Flow Map</h3>
      </div>
      <p className="text-xs text-gray-500 mb-3">Activity by strategy × phase</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-1.5 text-gray-500 font-medium"></th>
              {phases.map(p => (
                <th key={p} className="p-1.5 text-gray-500 font-medium text-center w-14">{p.slice(0, 4)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {strategies.map(s => (
              <tr key={s}>
                <td className="p-1.5 font-medium text-gray-700 text-xs whitespace-nowrap">{s}</td>
                {phases.map(p => (
                  <td key={p} className="p-1">
                    <div className={`w-8 h-8 mx-auto rounded flex items-center justify-center font-bold text-xs ${getIntensity(matrix[s]?.[p] || 0)}`}>
                      {matrix[s]?.[p] || 0}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Copy Trading Metrics Panel (for Copy mode)
const CopyTradingPanel = ({ selectedActor }) => {
  if (!selectedActor) return null;
  
  const metrics = {
    avgLeadTime: selectedActor.avg_follower_lag ? `${selectedActor.avg_follower_lag.toFixed(1)}h` : 'N/A',
    followerSuccess: '+11%',  // Mock
    slippageRisk: selectedActor.influenceScore > 70 ? 'Low' : selectedActor.influenceScore > 40 ? 'Medium' : 'High',
    bestEntryWindow: selectedActor.avg_follower_lag ? `0-${Math.round(selectedActor.avg_follower_lag / 2)}h` : 'N/A',
  };
  
  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Copy className="w-5 h-5 text-violet-600" />
        <h3 className="font-bold text-gray-900">Copy Metrics</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-2.5">
          <div className="text-xs text-gray-500">Avg Lead Time</div>
          <div className="font-bold text-gray-900">{metrics.avgLeadTime}</div>
        </div>
        <div className="bg-white rounded-lg p-2.5">
          <div className="text-xs text-gray-500">Follower Success</div>
          <div className="font-bold text-emerald-600">{metrics.followerSuccess}</div>
        </div>
        <div className="bg-white rounded-lg p-2.5">
          <div className="text-xs text-gray-500">Slippage Risk</div>
          <div className={`font-bold ${
            metrics.slippageRisk === 'Low' ? 'text-emerald-600' :
            metrics.slippageRisk === 'Medium' ? 'text-amber-600' : 'text-red-600'
          }`}>{metrics.slippageRisk}</div>
        </div>
        <div className="bg-white rounded-lg p-2.5">
          <div className="text-xs text-gray-500">Best Entry</div>
          <div className="font-bold text-gray-900">{metrics.bestEntryWindow}</div>
        </div>
      </div>
    </div>
  );
};

// Selected Actor Panel
const SelectedActorPanel = ({ actor, showRealNames, onClose }) => {
  if (!actor) return null;
  
  return (
    <div className="bg-white border border-violet-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">Selected Actor</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: STRATEGY_COLORS[actor.strategy] || STRATEGY_COLORS.Default }}
        >
          {actor.influenceScore}
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-900">
            {showRealNames ? actor.real_name : actor.strategy_name}
          </div>
          <div className="text-xs text-gray-500">{actor.strategy}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-gray-50 rounded p-2">
          <div className="text-gray-500">Edge Score</div>
          <div className="font-bold text-gray-900">{actor.edgeScore}</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-gray-500">Role</div>
          <div className={`font-bold ${ROLE_CONFIG[actor.role].text}`}>
            {ROLE_CONFIG[actor.role].icon} {actor.role}
          </div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-gray-500">Followers</div>
          <div className="font-bold text-gray-900">{actor.followers_count}</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-gray-500">Consistency</div>
          <div className="font-bold text-gray-900">{Math.round(actor.consistency * 100)}%</div>
        </div>
      </div>
      
      <Link 
        to={`/actors/${actor.id}`}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
      >
        View Full Profile <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export default function CorrelationPage() {
  const [mode, setMode] = useState('influence');
  const [showRealNames, setShowRealNames] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null);
  const [expandedView, setExpandedView] = useState(false);
  const [chainFilter, setChainFilter] = useState('All');
  const [strategyFilter, setStrategyFilter] = useState('All');
  const graphRef = useRef();
  
  // Process actors with calculated metrics
  const processedActors = useMemo(() => {
    return actorsData.map(actor => ({
      ...actor,
      influenceScore: calculateInfluenceScore(actor, actorsData),
      role: getRole(actor),
    }));
  }, []);
  
  // Filter actors for graph (two-level filtering)
  const filteredActors = useMemo(() => {
    let result = processedActors;
    
    // Apply UI filters
    if (chainFilter !== 'All') {
      result = result.filter(a => a.chain === chainFilter);
    }
    if (strategyFilter !== 'All') {
      result = result.filter(a => a.strategy === strategyFilter);
    }
    
    // Auto-limit (unless expanded)
    if (!expandedView) {
      // Keep actors that match: influenceScore > 50 OR Leader OR strong correlation
      result = result.filter(a => 
        a.influenceScore > 50 || 
        a.role === 'Leader' ||
        a.correlations?.some(c => c.strength > 0.5)
      );
      
      // Limit to max 15
      result = result.slice(0, 15);
    }
    
    return result;
  }, [processedActors, chainFilter, strategyFilter, expandedView]);
  
  // Build graph data based on mode
  const graphData = useMemo(() => {
    const nodes = filteredActors.map(actor => ({
      id: actor.id,
      name: showRealNames ? actor.real_name : actor.strategy_name,
      strategy: actor.strategy,
      influenceScore: actor.influenceScore,
      role: actor.role,
      edgeScore: actor.edgeScore,
      color: STRATEGY_COLORS[actor.strategy] || STRATEGY_COLORS.Default,
      size: clampSize(actor.influenceScore),
      // Full actor data for click handling
      ...actor,
    }));
    
    const links = [];
    const nodeIds = new Set(nodes.map(n => n.id));
    
    if (mode === 'influence' || mode === 'copy') {
      // Directed edges: front-runs and follows
      filteredActors.forEach(actor => {
        // Front-run edges (yellow, thicker)
        actor.frontRuns?.forEach(targetId => {
          if (nodeIds.has(targetId)) {
            links.push({
              source: actor.id,
              target: targetId,
              type: 'frontrun',
              color: '#f59e0b',
              width: 3,
              label: mode === 'copy' ? `Leads by ${actor.avg_follower_lag || '?'}h` : null,
            });
          }
        });
        
        // Follow edges (purple, thinner)
        actor.followedBy?.forEach(sourceId => {
          if (nodeIds.has(sourceId)) {
            links.push({
              source: sourceId,
              target: actor.id,
              type: 'follow',
              color: '#8b5cf6',
              width: 1.5,
            });
          }
        });
      });
    } else if (mode === 'clusters') {
      // Undirected edges based on correlation strength
      const addedPairs = new Set();
      
      filteredActors.forEach(actor => {
        actor.correlations?.forEach(corr => {
          if (nodeIds.has(corr.id) && corr.strength > 0.3) {
            const pairKey = [actor.id, corr.id].sort().join('-');
            if (!addedPairs.has(pairKey)) {
              addedPairs.add(pairKey);
              links.push({
                source: actor.id,
                target: corr.id,
                type: 'correlation',
                color: `rgba(139, 92, 246, ${corr.strength})`, // Opacity = strength
                width: corr.strength * 3,
              });
            }
          }
        });
      });
    }
    
    return { nodes, links };
  }, [filteredActors, mode, showRealNames]);
  
  // Node canvas renderer
  const nodeCanvasRenderer = useCallback((node, ctx, globalScale) => {
    const size = node.size / 2;
    const fontSize = 10 / globalScale;
    
    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
    
    // Draw border for leaders
    if (node.role === 'Leader') {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3 / globalScale;
      ctx.stroke();
    }
    
    // Draw influence score
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${fontSize * 1.2}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.influenceScore, node.x, node.y);
    
    // Draw label below
    if (globalScale > 0.5) {
      ctx.fillStyle = '#374151';
      ctx.font = `${fontSize}px Sans-Serif`;
      const label = node.name.length > 15 ? node.name.slice(0, 15) + '...' : node.name;
      ctx.fillText(label, node.x, node.y + size + 10 / globalScale);
      
      // Draw role badge
      ctx.fillStyle = ROLE_CONFIG[node.role]?.color || '#64748b';
      ctx.font = `bold ${fontSize * 0.8}px Sans-Serif`;
      ctx.fillText(node.role, node.x, node.y + size + 20 / globalScale);
    }
  }, []);
  
  // Link canvas renderer
  const linkCanvasRenderer = useCallback((link, ctx, globalScale) => {
    if (!link.source.x || !link.target.x) return;
    
    const start = link.source;
    const end = link.target;
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = link.color;
    ctx.lineWidth = link.width / globalScale;
    
    if (link.type === 'follow') {
      ctx.setLineDash([5 / globalScale, 5 / globalScale]);
    } else {
      ctx.setLineDash([]);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw arrow for directed edges
    if (link.type === 'frontrun' || link.type === 'follow') {
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const arrowLength = 8 / globalScale;
      const targetRadius = (end.size || 20) / 2;
      
      const arrowX = end.x - Math.cos(angle) * targetRadius;
      const arrowY = end.y - Math.sin(angle) * targetRadius;
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
        arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
        arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = link.color;
      ctx.fill();
    }
  }, []);
  
  // Handle node click
  const handleNodeClick = useCallback((node) => {
    setSelectedActor(node);
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 500);
      graphRef.current.zoom(2, 500);
    }
  }, []);
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-[1800px] mx-auto px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <Network className="w-8 h-8 text-violet-600" />
                <h1 className="text-2xl font-bold text-gray-900">Influence Graph</h1>
              </div>
              <p className="text-gray-500 mt-1">
                Visualize market leaders, followers, and strategy patterns
              </p>
            </div>
            
            {/* Identity Toggle */}
            <button
              onClick={() => setShowRealNames(!showRealNames)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {showRealNames ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="text-sm font-medium">{showRealNames ? 'Real Names' : 'Strategies'}</span>
            </button>
          </div>
          
          {/* Mode Selector */}
          <div className="flex items-center justify-between mb-6">
            <ModeSelector mode={mode} setMode={setMode} />
            
            {/* Filters & Actions */}
            <div className="flex items-center gap-3">
              {/* Chain filter */}
              <select
                value={chainFilter}
                onChange={(e) => setChainFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              >
                <option value="All">All Chains</option>
                <option value="ETH">ETH</option>
                <option value="SOL">SOL</option>
              </select>
              
              {/* Strategy filter */}
              <select
                value={strategyFilter}
                onChange={(e) => setStrategyFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              >
                <option value="All">All Strategies</option>
                {Object.keys(STRATEGY_COLORS).filter(s => s !== 'Default').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              
              {/* Expand toggle */}
              <button
                onClick={() => setExpandedView(!expandedView)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  expandedView 
                    ? 'bg-violet-100 text-violet-700' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Expand className="w-4 h-4" />
                {expandedView ? 'Focused View' : 'Expand Graph'}
              </button>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-6 mb-4 px-4 py-2 bg-white rounded-lg border border-gray-100 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Legend:</span>
            <span className="flex items-center gap-1.5">
              <div className="w-4 h-1 bg-amber-400 rounded"></div>
              <Zap className="w-3 h-3 text-amber-500" /> Front-runs
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-violet-400" style={{ borderTop: '2px dashed #8b5cf6' }}></div>
              <Users className="w-3 h-3 text-violet-500" /> Follows
            </span>
            <span className="flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-amber-400" /> Leader (gold border)
            </span>
            <span className="ml-auto text-gray-400">
              Showing {filteredActors.length} actors
              {!expandedView && ' (auto-filtered)'}
            </span>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Graph */}
            <div className="col-span-12 lg:col-span-8 bg-gray-900 rounded-2xl overflow-hidden" style={{ height: '600px' }}>
              <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeCanvasObject={nodeCanvasRenderer}
                linkCanvasObject={linkCanvasRenderer}
                nodeRelSize={1}
                linkDirectionalParticles={mode !== 'clusters' ? 2 : 0}
                linkDirectionalParticleWidth={2}
                linkDirectionalParticleSpeed={0.005}
                onNodeClick={handleNodeClick}
                onBackgroundClick={() => setSelectedActor(null)}
                cooldownTicks={100}
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.3}
                backgroundColor="#111827"
                width={undefined}
                height={600}
              />
            </div>
            
            {/* Right sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              {/* Selected Actor */}
              <SelectedActorPanel 
                actor={selectedActor} 
                showRealNames={showRealNames}
                onClose={() => setSelectedActor(null)}
              />
              
              {/* Copy Trading Metrics (only in copy mode) */}
              {mode === 'copy' && selectedActor && (
                <CopyTradingPanel selectedActor={selectedActor} />
              )}
              
              {/* Leaderboard */}
              <InfluenceLeaderboard 
                actors={processedActors} 
                showRealNames={showRealNames}
                onSelectActor={setSelectedActor}
              />
              
              {/* Strategy Flow Map */}
              <StrategyFlowMap />
            </div>
          </div>
          
          {/* Strategy Colors Legend */}
          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-3">Strategy Colors</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(STRATEGY_COLORS).filter(([k]) => k !== 'Default').map(([strategy, color]) => (
                <div key={strategy} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                  <span className="text-sm font-medium text-gray-700">{strategy}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
