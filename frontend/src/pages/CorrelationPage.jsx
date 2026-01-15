import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import Header from '../components/Header';
import { 
  Filter, TrendingUp, Users, Zap, Crown, 
  GitBranch, ArrowRight, Eye, X, Activity, Target, 
  Expand, Layers, Copy, Network, EyeOff,
  ZoomIn, RotateCcw
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';

// ==================== CONSTANTS ====================

const STRATEGY_COLORS = {
  'Smart Money': '#22c55e',
  'Infrastructure': '#6366f1',
  'Momentum': '#f59e0b',
  'Meme': '#ec4899',
  'Market Maker': '#06b6d4',
  'High Risk': '#ef4444',
  'DeFi': '#8b5cf6',
  'Default': '#64748b',
};

const ROLE_CONFIG = {
  'Leader': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🟢', color: '#22c55e' },
  'Follower': { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🟡', color: '#f59e0b' },
  'Neutral': { bg: 'bg-gray-100', text: 'text-gray-600', icon: '⚪', color: '#64748b' },
};

const GRAPH_MODES = [
  { id: 'influence', label: 'Market Influence', icon: Crown, description: 'Who leads the market' },
  { id: 'copy', label: 'Copy Trading', icon: Copy, description: 'Who to copy, timing' },
  { id: 'clusters', label: 'Strategy Clusters', icon: Layers, description: 'Group patterns' },
];

// ==================== MOCK DATA ====================

const actorsData = [
  {
    id: 'a16z',
    real_name: 'a16z Crypto',
    strategy_name: 'Institutional Infrastructure',
    strategy: 'Infrastructure',
    chain: 'ETH',
    edgeScore: 91,
    followers_count: 5,
    avg_follower_lag: 6.2,
    consistency: 0.91,
    market_impact: 0.85,
    frontRuns: ['alameda'],
    followedBy: ['vitalik', 'pantera'],
    correlations: [{ id: 'vitalik', strength: 0.72 }, { id: 'pantera', strength: 0.68 }],
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
    correlations: [{ id: 'pantera', strength: 0.76 }, { id: 'dwf-labs', strength: 0.52 }],
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
    correlations: [{ id: 'a16z', strength: 0.68 }, { id: 'vitalik', strength: 0.71 }],
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
    correlations: [{ id: 'a16z', strength: 0.72 }, { id: 'pantera', strength: 0.71 }],
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
    correlations: [{ id: 'jump-trading', strength: 0.64 }],
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
    correlations: [{ id: 'wintermute', strength: 0.64 }],
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
    correlations: [{ id: 'unknown-whale-1', strength: 0.68 }],
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
    correlations: [{ id: 'dwf-labs', strength: 0.68 }],
  },
];

// ==================== UTILITIES ====================

const normalize = (value, min, max) => {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

const calculateInfluenceScore = (actor, allActors) => {
  const maxFollowers = Math.max(...allActors.map(a => a.followers_count));
  const maxLag = Math.max(...allActors.map(a => a.avg_follower_lag || 24));
  
  const followers_norm = normalize(actor.followers_count, 0, maxFollowers);
  const lag_norm = actor.avg_follower_lag > 0 ? 1 - normalize(actor.avg_follower_lag, 0, maxLag) : 0;
  
  return Math.round((
    (followers_norm * 0.35) +
    (lag_norm * 0.25) +
    (actor.consistency * 0.25) +
    (actor.market_impact * 0.15)
  ) * 100);
};

const getRole = (actor) => {
  if (actor.followers_count >= 3) return 'Leader';
  if (actor.followedBy?.length >= 2) return 'Follower';
  return 'Neutral';
};

// ==================== COMPONENTS ====================

const ModeSelector = ({ mode, setMode }) => (
  <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
    {GRAPH_MODES.map(m => (
      <Tooltip key={m.id}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
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

const InfluenceLeaderboard = ({ actors, showRealNames, onSelectActor, selectedId }) => {
  const sorted = [...actors].sort((a, b) => b.influenceScore - a.influenceScore);
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Crown className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-gray-900">Influence Leaders</h3>
      </div>
      
      <div className="space-y-1">
        {sorted.slice(0, 8).map((actor, idx) => (
          <button 
            key={actor.id}
            onClick={() => onSelectActor(actor)}
            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left ${
              selectedId === actor.id ? 'bg-violet-100 border border-violet-300' : 'hover:bg-gray-50'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              idx === 0 ? 'bg-amber-400 text-amber-900' :
              idx === 1 ? 'bg-gray-300 text-gray-700' :
              idx === 2 ? 'bg-amber-600 text-white' :
              'bg-gray-100 text-gray-500'
            }`}>
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">
                {showRealNames ? actor.real_name : actor.strategy_name}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-violet-600 text-sm">{actor.influenceScore}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${ROLE_CONFIG[actor.role].bg} ${ROLE_CONFIG[actor.role].text}`}>
                {actor.role}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const SelectedActorPanel = ({ actor, showRealNames, onClose, mode }) => {
  if (!actor) return null;
  
  return (
    <div className="bg-white border-2 border-violet-300 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-violet-600 uppercase">Selected</span>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md"
          style={{ backgroundColor: STRATEGY_COLORS[actor.strategy] || STRATEGY_COLORS.Default }}
        >
          {actor.influenceScore}
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-900">
            {showRealNames ? actor.real_name : actor.strategy_name}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{actor.strategy}</span>
            <span>•</span>
            <span className={ROLE_CONFIG[actor.role].text}>
              {ROLE_CONFIG[actor.role].icon} {actor.role}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-500">Edge Score</div>
          <div className="font-bold text-gray-900">{actor.edgeScore}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-500">Followers</div>
          <div className="font-bold text-gray-900">{actor.followers_count}</div>
        </div>
        {mode === 'copy' && (
          <>
            <div className="bg-amber-50 rounded-lg p-2">
              <div className="text-xs text-amber-600">Avg Lead</div>
              <div className="font-bold text-amber-700">{actor.avg_follower_lag || 0}h</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-2">
              <div className="text-xs text-emerald-600">Consistency</div>
              <div className="font-bold text-emerald-700">{Math.round(actor.consistency * 100)}%</div>
            </div>
          </>
        )}
      </div>
      
      {(actor.frontRuns?.length > 0 || actor.followedBy?.length > 0) && (
        <div className="border-t border-gray-100 pt-3 mb-4 space-y-2 text-xs">
          {actor.frontRuns?.length > 0 && (
            <div><span className="text-amber-600 font-medium">Front-runs:</span> {actor.frontRuns.join(', ')}</div>
          )}
          {actor.followedBy?.length > 0 && (
            <div><span className="text-violet-600 font-medium">Followed by:</span> {actor.followedBy.join(', ')}</div>
          )}
        </div>
      )}
      
      <Link 
        to={`/actors/${actor.id}`}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
      >
        View Profile <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

const StrategyFlowMap = () => {
  const phases = ['Accum', 'Active', 'Rotate', 'Dist'];
  const strategies = ['Smart Money', 'Infrastructure', 'Momentum', 'Meme', 'Market Maker'];
  const matrix = {
    'Smart Money': [3, 1, 0, 0],
    'Infrastructure': [2, 0, 1, 0],
    'Momentum': [1, 2, 1, 0],
    'Meme': [0, 1, 0, 1],
    'Market Maker': [0, 0, 2, 0],
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
        <h3 className="font-bold text-gray-900">Strategy Flow</h3>
      </div>
      
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left p-1 text-gray-400"></th>
            {phases.map(p => <th key={p} className="p-1 text-gray-500 font-medium text-center">{p}</th>)}
          </tr>
        </thead>
        <tbody>
          {strategies.map(s => (
            <tr key={s}>
              <td className="p-1 font-medium text-gray-600 text-xs truncate max-w-[80px]">{s.split(' ')[0]}</td>
              {matrix[s].map((count, i) => (
                <td key={i} className="p-0.5">
                  <div className={`w-7 h-7 mx-auto rounded flex items-center justify-center font-bold text-xs ${getIntensity(count)}`}>
                    {count || ''}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export default function CorrelationPage() {
  const [mode, setMode] = useState('influence');
  const [showRealNames, setShowRealNames] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null);
  const [expandedView, setExpandedView] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const graphRef = useRef();
  
  const processedActors = useMemo(() => {
    return actorsData.map(actor => ({
      ...actor,
      influenceScore: calculateInfluenceScore(actor, actorsData),
      role: getRole(actor),
    }));
  }, []);
  
  const filteredActors = useMemo(() => {
    let result = processedActors;
    if (!expandedView) {
      result = result.filter(a => a.influenceScore > 40 || a.role === 'Leader');
    }
    return result;
  }, [processedActors, expandedView]);
  
  const graphData = useMemo(() => {
    const nodes = filteredActors.map((actor, idx) => {
      // Initial positions in a circle for better starting layout
      const angle = (idx / filteredActors.length) * 2 * Math.PI;
      const radius = 150;
      
      return {
        id: actor.id,
        name: showRealNames ? actor.real_name : actor.strategy_name,
        strategy: actor.strategy,
        influenceScore: actor.influenceScore,
        role: actor.role,
        color: STRATEGY_COLORS[actor.strategy] || STRATEGY_COLORS.Default,
        val: actor.role === 'Leader' ? 10 + actor.influenceScore * 0.2 : 5 + actor.influenceScore * 0.1,
        // Initial position in circle
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        ...actor,
      };
    });
    
    const links = [];
    const nodeIds = new Set(nodes.map(n => n.id));
    
    if (mode === 'influence' || mode === 'copy') {
      filteredActors.forEach(actor => {
        actor.frontRuns?.forEach(targetId => {
          if (nodeIds.has(targetId)) {
            links.push({ source: actor.id, target: targetId, type: 'frontrun', color: '#f59e0b', width: 3 });
          }
        });
        actor.followedBy?.forEach(sourceId => {
          if (nodeIds.has(sourceId)) {
            links.push({ source: sourceId, target: actor.id, type: 'follow', color: '#8b5cf6', width: 1.5 });
          }
        });
      });
    } else {
      const addedPairs = new Set();
      filteredActors.forEach(actor => {
        actor.correlations?.forEach(corr => {
          if (nodeIds.has(corr.id) && corr.strength > 0.3) {
            const pairKey = [actor.id, corr.id].sort().join('-');
            if (!addedPairs.has(pairKey)) {
              addedPairs.add(pairKey);
              links.push({ source: actor.id, target: corr.id, type: 'correlation', color: `rgba(139, 92, 246, ${corr.strength})`, width: corr.strength * 4 });
            }
          }
        });
      });
    }
    
    return { nodes, links };
  }, [filteredActors, mode, showRealNames]);
  
  // Auto-fit on load and when data changes
  useEffect(() => {
    if (graphRef.current && graphData.nodes.length > 0) {
      // Wait for initial render
      setTimeout(() => {
        graphRef.current.zoomToFit(400, 50);
      }, 500);
    }
  }, [graphData.nodes.length]);
  
  useEffect(() => {
    if (graphRef.current) {
      const fg = graphRef.current;
      fg.d3Force('charge').strength(node => node.role === 'Leader' ? -400 : -200);
      fg.d3Force('link').distance(link => link.type === 'frontrun' ? 100 : 150);
      fg.d3ReheatSimulation();
    }
  }, [mode, graphData]);
  
  const handleNodeClick = useCallback((node) => {
    const actor = processedActors.find(a => a.id === node.id);
    setSelectedActor(actor);
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 500);
      graphRef.current.zoom(2.5, 500);
    }
  }, [processedActors]);
  
  const handleReset = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.centerAt(0, 0, 500);
      graphRef.current.zoom(1, 500);
    }
    setSelectedActor(null);
  }, []);
  
  const nodeCanvasRenderer = useCallback((node, ctx, globalScale) => {
    const size = Math.sqrt(node.val) * 4;
    const isSelected = selectedActor?.id === node.id;
    const isHovered = hoveredNode?.id === node.id;
    
    // Glow
    if (isSelected || isHovered) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, size + 6, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
    }
    
    // Circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
    
    // Leader ring
    if (node.role === 'Leader') {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4 / globalScale;
      ctx.stroke();
    }
    
    // Score
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${14 / globalScale}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.influenceScore, node.x, node.y);
    
    // Label on zoom/hover
    if (globalScale > 1.2 || isHovered || isSelected) {
      ctx.fillStyle = '#1f2937';
      ctx.font = `${11 / globalScale}px Arial`;
      const label = node.name.length > 16 ? node.name.slice(0, 14) + '...' : node.name;
      ctx.fillText(label, node.x, node.y + size + 14 / globalScale);
      
      ctx.fillStyle = ROLE_CONFIG[node.role]?.color || '#64748b';
      ctx.font = `bold ${9 / globalScale}px Arial`;
      ctx.fillText(node.role, node.x, node.y + size + 26 / globalScale);
    }
  }, [selectedActor, hoveredNode]);
  
  const linkCanvasRenderer = useCallback((link, ctx, globalScale) => {
    if (!link.source.x || !link.target.x) return;
    
    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.strokeStyle = link.color;
    ctx.lineWidth = link.width / globalScale;
    if (link.type === 'follow') ctx.setLineDash([5 / globalScale, 5 / globalScale]);
    else ctx.setLineDash([]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Arrow
    if (link.type !== 'correlation') {
      const angle = Math.atan2(link.target.y - link.source.y, link.target.x - link.source.x);
      const targetSize = Math.sqrt(link.target.val || 5) * 4;
      const arrowX = link.target.x - Math.cos(angle) * (targetSize + 5);
      const arrowY = link.target.y - Math.sin(angle) * (targetSize + 5);
      const arrowLen = 10 / globalScale;
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - arrowLen * Math.cos(angle - Math.PI / 6), arrowY - arrowLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(arrowX - arrowLen * Math.cos(angle + Math.PI / 6), arrowY - arrowLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = link.color;
      ctx.fill();
    }
  }, []);
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-[1800px] mx-auto px-6 py-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <Network className="w-7 h-7 text-violet-600" />
                <h1 className="text-xl font-bold text-gray-900">Influence Graph</h1>
              </div>
              <p className="text-sm text-gray-500">Who leads, who follows, who to copy</p>
            </div>
            
            <button
              onClick={() => setShowRealNames(!showRealNames)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 text-sm"
            >
              {showRealNames ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showRealNames ? 'Real Names' : 'Strategies'}
            </button>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <ModeSelector mode={mode} setMode={setMode} />
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpandedView(!expandedView)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  expandedView ? 'bg-violet-100 text-violet-700' : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                <Expand className="w-3.5 h-3.5" />
                {expandedView ? 'Focused' : 'Expand'}
              </button>
              
              <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 mb-3 px-3 py-2 bg-white rounded-lg border text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-amber-400 rounded"></div>
              <Zap className="w-3 h-3 text-amber-500" /> Front-runs
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-4 border-t-2 border-dashed border-violet-400"></div>
              <Users className="w-3 h-3 text-violet-500" /> Follows
            </span>
            <span className="flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-amber-400" /> Leader
            </span>
            <span className="ml-auto text-gray-400">{filteredActors.length} actors</span>
          </div>
          
          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8 bg-gray-900 rounded-2xl overflow-hidden relative" style={{ height: '550px' }}>
              {graphData.nodes.length > 0 ? (
                <ForceGraph2D
                  ref={graphRef}
                  graphData={graphData}
                  nodeCanvasObject={nodeCanvasRenderer}
                  linkCanvasObject={linkCanvasRenderer}
                  nodeRelSize={6}
                  onNodeClick={handleNodeClick}
                  onNodeHover={setHoveredNode}
                  onBackgroundClick={() => setSelectedActor(null)}
                  cooldownTicks={100}
                  linkDirectionalParticles={mode !== 'clusters' ? 2 : 0}
                  linkDirectionalParticleWidth={2}
                  linkDirectionalParticleSpeed={0.006}
                  d3AlphaDecay={0.02}
                  d3VelocityDecay={0.25}
                  backgroundColor="#111827"
                  width={800}
                  height={550}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">Loading graph...</div>
              )}
              <div className="absolute bottom-3 left-3 text-xs text-gray-500 bg-gray-800/80 px-2 py-1 rounded">
                Scroll to zoom • Drag to pan • Click node
              </div>
            </div>
            
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <SelectedActorPanel actor={selectedActor} showRealNames={showRealNames} onClose={() => setSelectedActor(null)} mode={mode} />
              <InfluenceLeaderboard actors={processedActors} showRealNames={showRealNames} onSelectActor={setSelectedActor} selectedId={selectedActor?.id} />
              <StrategyFlowMap />
            </div>
          </div>
          
          {/* Strategy Colors */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(STRATEGY_COLORS).filter(([k]) => k !== 'Default').map(([strategy, color]) => (
              <div key={strategy} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-gray-600">{strategy}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
