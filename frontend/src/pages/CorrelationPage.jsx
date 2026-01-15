import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Header from '../components/Header';
import SearchInput from '../components/shared/SearchInput';
import { 
  Filter, ChevronDown, TrendingUp, Users, Zap, Crown, 
  GitBranch, ArrowRight, Eye, X, Activity, Target
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';

// Strategy colors for nodes
const strategyColors = {
  'Smart Money': { bg: '#10b981', border: '#059669', text: '#ecfdf5' },
  'Momentum': { bg: '#f59e0b', border: '#d97706', text: '#fef3c7' },
  'Infrastructure': { bg: '#6366f1', border: '#4f46e5', text: '#e0e7ff' },
  'Market Maker': { bg: '#8b5cf6', border: '#7c3aed', text: '#ede9fe' },
  'DeFi': { bg: '#06b6d4', border: '#0891b2', text: '#cffafe' },
  'Meme': { bg: '#ec4899', border: '#db2777', text: '#fce7f3' },
  'Default': { bg: '#64748b', border: '#475569', text: '#f1f5f9' },
};

// Role colors
const roleColors = {
  'Leader': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🟢' },
  'Follower': { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🟡' },
  'Neutral': { bg: 'bg-gray-100', text: 'text-gray-600', icon: '⚪' },
};

// Mock actors data with correlation relationships (same as ActorsPage)
const actorsData = [
  {
    id: 'vitalik',
    real_name: 'Vitalik.eth',
    strategy_name: 'L2 Infrastructure Builder',
    strategy: 'Smart Money',
    influenceScore: 72,
    role: 'Leader',
    followers: ['dwf-labs', 'unknown-whale-1'],
    frontRuns: [],
    followedBy: ['pantera'],
    chain: 'ETH',
    edgeScore: 78,
  },
  {
    id: 'alameda',
    real_name: 'Alameda Research',
    strategy_name: 'SOL Ecosystem Accumulator',
    strategy: 'Momentum',
    influenceScore: 89,
    role: 'Leader',
    followers: ['dwf-labs'],
    frontRuns: ['dwf-labs'],
    followedBy: [],
    chain: 'SOL',
    edgeScore: 86,
  },
  {
    id: 'a16z',
    real_name: 'a16z Crypto',
    strategy_name: 'Institutional Infrastructure Play',
    strategy: 'Infrastructure',
    influenceScore: 94,
    role: 'Leader',
    followers: ['vitalik', 'pantera'],
    frontRuns: ['alameda'],
    followedBy: [],
    chain: 'ETH',
    edgeScore: 91,
  },
  {
    id: 'pantera',
    real_name: 'Pantera Capital',
    strategy_name: 'AI Narrative Accumulator',
    strategy: 'Smart Money',
    influenceScore: 86,
    role: 'Leader',
    followers: ['dwf-labs'],
    frontRuns: ['vitalik'],
    followedBy: [],
    chain: 'ETH',
    edgeScore: 84,
  },
  {
    id: 'dwf-labs',
    real_name: 'DWF Labs',
    strategy_name: 'Meme Momentum Rider',
    strategy: 'Meme',
    influenceScore: 38,
    role: 'Follower',
    followers: [],
    frontRuns: [],
    followedBy: ['alameda', 'pantera'],
    chain: 'ETH',
    edgeScore: 52,
  },
  {
    id: 'wintermute',
    real_name: 'Wintermute',
    strategy_name: 'DeFi Yield Optimizer',
    strategy: 'Market Maker',
    influenceScore: 52,
    role: 'Neutral',
    followers: [],
    frontRuns: [],
    followedBy: [],
    chain: 'ETH',
    edgeScore: 45,
  },
  {
    id: 'jump-trading',
    real_name: 'Jump Trading',
    strategy_name: 'HFT Arbitrage Engine',
    strategy: 'Market Maker',
    influenceScore: 45,
    role: 'Neutral',
    followers: [],
    frontRuns: [],
    followedBy: [],
    chain: 'ETH',
    edgeScore: 28,
  },
  {
    id: 'unknown-whale-1',
    real_name: 'Smart Whale #4721',
    strategy_name: 'High-Risk Flip Trader',
    strategy: 'Meme',
    influenceScore: 18,
    role: 'Follower',
    followers: [],
    frontRuns: [],
    followedBy: ['vitalik'],
    chain: 'SOL',
    edgeScore: 15,
  },
];

// Strategy clusters for layout
const strategyClusters = {
  'Smart Money': { x: 100, y: 100, label: 'Smart Money' },
  'Infrastructure': { x: 400, y: 80, label: 'Infrastructure' },
  'Momentum': { x: 600, y: 200, label: 'Momentum/SOL' },
  'Meme': { x: 300, y: 350, label: 'Meme/High Risk' },
  'Market Maker': { x: 550, y: 400, label: 'Market Makers' },
  'DeFi': { x: 150, y: 300, label: 'DeFi' },
};

// Custom node component
const ActorNode = ({ data }) => {
  const colors = strategyColors[data.strategy] || strategyColors['Default'];
  const roleConfig = roleColors[data.role];
  
  return (
    <div 
      className="relative group cursor-pointer"
      style={{ 
        width: Math.max(80, 40 + data.influenceScore * 0.6),
        height: Math.max(80, 40 + data.influenceScore * 0.6),
      }}
    >
      {/* Main node circle */}
      <div 
        className="rounded-full flex items-center justify-center border-4 transition-transform group-hover:scale-110"
        style={{ 
          backgroundColor: colors.bg,
          borderColor: colors.border,
          width: '100%',
          height: '100%',
        }}
      >
        {data.role === 'Leader' && (
          <Crown className="w-5 h-5 text-white absolute -top-2 left-1/2 -translate-x-1/2" />
        )}
        <span className="text-white font-bold text-sm">{data.influenceScore}</span>
      </div>
      
      {/* Label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
        <div className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">{data.label}</div>
        <div className={`text-xs px-1.5 py-0.5 rounded mt-0.5 inline-block ${roleConfig.bg} ${roleConfig.text}`}>
          {roleConfig.icon} {data.role}
        </div>
      </div>
      
      {/* Hover tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-20 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white p-2 rounded-lg text-xs whitespace-nowrap z-50">
        <div className="font-bold">{data.fullName}</div>
        <div className="text-gray-300">{data.strategy}</div>
        <div className="text-emerald-400">Edge: {data.edgeScore}</div>
      </div>
    </div>
  );
};

// Node types for ReactFlow
const nodeTypes = {
  actor: ActorNode,
};

// Filter options
const chainFilters = ['All', 'ETH', 'SOL', 'BASE', 'ARB'];
const strategyFilters = ['All', 'Smart Money', 'Infrastructure', 'Momentum', 'Meme', 'Market Maker', 'DeFi'];
const roleFilters = ['All', 'Leader', 'Follower', 'Neutral'];

// Influence Leaderboard component
const InfluenceLeaderboard = ({ actors, showRealNames }) => {
  const sortedActors = [...actors].sort((a, b) => b.influenceScore - a.influenceScore);
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-gray-900">Influence Leaderboard</h3>
      </div>
      <p className="text-xs text-gray-500 mb-3">Actors who MOVE the market (not by PnL)</p>
      
      <div className="space-y-2">
        {sortedActors.slice(0, 8).map((actor, idx) => (
          <Link 
            key={actor.id}
            to={`/actors/${actor.id}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              idx === 0 ? 'bg-amber-400 text-amber-900' :
              idx === 1 ? 'bg-gray-300 text-gray-700' :
              idx === 2 ? 'bg-amber-600 text-amber-100' :
              'bg-gray-100 text-gray-600'
            }`}>
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">
                {showRealNames ? actor.real_name : actor.strategy_name}
              </div>
              <div className="text-xs text-gray-500">{actor.strategy}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-violet-600">{actor.influenceScore}</div>
              <div className={`text-xs px-1.5 py-0.5 rounded ${roleColors[actor.role].bg} ${roleColors[actor.role].text}`}>
                {actor.role}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Strategy Flow Map component
const StrategyFlowMap = ({ actors }) => {
  // Calculate activity per strategy/phase
  const phases = ['Accumulating', 'Active', 'Rotating', 'Distributing'];
  const strategies = ['Smart Money', 'Infrastructure', 'Momentum', 'Meme', 'Market Maker'];
  
  // Mock activity data (in real app, calculate from actor behaviors)
  const activityMatrix = {
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
    return 'bg-gray-50 text-gray-400';
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-violet-500" />
        <h3 className="font-bold text-gray-900">Strategy Flow Map</h3>
      </div>
      <p className="text-xs text-gray-500 mb-3">Current activity by strategy × market phase</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-2 text-gray-500 font-medium">Strategy</th>
              {phases.map(phase => (
                <th key={phase} className="p-2 text-gray-500 font-medium text-center">{phase}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {strategies.map(strategy => (
              <tr key={strategy}>
                <td className="p-2 font-medium text-gray-700">{strategy}</td>
                {phases.map(phase => (
                  <td key={phase} className="p-1">
                    <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center font-bold ${getIntensity(activityMatrix[strategy]?.[phase] || 0)}`}>
                      {activityMatrix[strategy]?.[phase] || 0}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500"></div> High (3+)
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-300"></div> Medium (2)
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-100"></div> Low (1)
        </span>
      </div>
    </div>
  );
};

// Main Correlation Page
export default function CorrelationPage() {
  const [showRealNames, setShowRealNames] = useState(false);
  const [chainFilter, setChainFilter] = useState('All');
  const [strategyFilter, setStrategyFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Filter actors
  const filteredActors = useMemo(() => {
    return actorsData.filter(actor => {
      if (chainFilter !== 'All' && actor.chain !== chainFilter) return false;
      if (strategyFilter !== 'All' && actor.strategy !== strategyFilter) return false;
      if (roleFilter !== 'All' && actor.role !== roleFilter) return false;
      return true;
    });
  }, [chainFilter, strategyFilter, roleFilter]);
  
  // Generate nodes for ReactFlow
  const initialNodes = useMemo(() => {
    return filteredActors.map((actor, idx) => {
      const cluster = strategyClusters[actor.strategy] || strategyClusters['Smart Money'];
      // Add some offset within cluster based on index
      const offsetX = (idx % 3) * 120;
      const offsetY = Math.floor(idx / 3) * 100;
      
      return {
        id: actor.id,
        type: 'actor',
        position: { 
          x: cluster.x + offsetX + Math.random() * 40, 
          y: cluster.y + offsetY + Math.random() * 40 
        },
        data: {
          label: showRealNames ? actor.real_name : actor.strategy_name,
          fullName: actor.real_name,
          strategy: actor.strategy,
          influenceScore: actor.influenceScore,
          role: actor.role,
          edgeScore: actor.edgeScore,
        },
      };
    });
  }, [filteredActors, showRealNames]);
  
  // Generate edges (relationships)
  const initialEdges = useMemo(() => {
    const edges = [];
    
    filteredActors.forEach(actor => {
      // Front-running edges (Actor A front-runs Actor B)
      actor.frontRuns?.forEach(targetId => {
        if (filteredActors.find(a => a.id === targetId)) {
          edges.push({
            id: `fr-${actor.id}-${targetId}`,
            source: actor.id,
            target: targetId,
            type: 'default',
            animated: true,
            style: { stroke: '#f59e0b', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
            label: 'front-runs',
            labelStyle: { fill: '#f59e0b', fontSize: 10 },
          });
        }
      });
      
      // Follow edges (Actor A follows Actor B)
      actor.followedBy?.forEach(sourceId => {
        if (filteredActors.find(a => a.id === sourceId)) {
          edges.push({
            id: `fw-${sourceId}-${actor.id}`,
            source: sourceId,
            target: actor.id,
            type: 'default',
            style: { stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '5,5' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
          });
        }
      });
    });
    
    return edges;
  }, [filteredActors]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Update nodes/edges when filters change
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(actorsData.find(a => a.id === node.id));
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
                <GitBranch className="w-8 h-8 text-violet-600" />
                <h1 className="text-2xl font-bold text-gray-900">Influence Graph</h1>
              </div>
              <p className="text-gray-500 mt-1">
                Visualize who leads and who follows in the market
              </p>
            </div>
            
            {/* Identity Toggle */}
            <button
              onClick={() => setShowRealNames(!showRealNames)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {showRealNames ? <Eye className="w-4 h-4" /> : <Target className="w-4 h-4" />}
              <span className="text-sm font-medium">{showRealNames ? 'Real Names' : 'Strategies'}</span>
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              Filters:
            </div>
            
            {/* Chain filter */}
            <select
              value={chainFilter}
              onChange={(e) => setChainFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            >
              {chainFilters.map(chain => (
                <option key={chain} value={chain}>{chain === 'All' ? 'All Chains' : chain}</option>
              ))}
            </select>
            
            {/* Strategy filter */}
            <select
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            >
              {strategyFilters.map(strategy => (
                <option key={strategy} value={strategy}>{strategy === 'All' ? 'All Strategies' : strategy}</option>
              ))}
            </select>
            
            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            >
              {roleFilters.map(role => (
                <option key={role} value={role}>{role === 'All' ? 'All Roles' : role}</option>
              ))}
            </select>
            
            {/* Legend */}
            <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-8 h-0.5 bg-amber-400"></div>
                <Zap className="w-3 h-3 text-amber-500" /> Front-runs
              </span>
              <span className="flex items-center gap-1">
                <div className="w-8 h-0.5 bg-violet-400 border-dashed border-t-2 border-violet-400"></div>
                <Users className="w-3 h-3 text-violet-500" /> Follows
              </span>
            </div>
          </div>
          
          {/* Main content grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Graph */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-gray-200 rounded-2xl overflow-hidden" style={{ height: '600px' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
              >
                <Background color="#e5e7eb" gap={20} />
                <Controls />
                <MiniMap 
                  nodeColor={(node) => strategyColors[node.data?.strategy]?.bg || '#64748b'}
                  maskColor="rgba(255,255,255,0.8)"
                />
              </ReactFlow>
            </div>
            
            {/* Right sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Selected node details */}
              {selectedNode && (
                <div className="bg-white border border-violet-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">Selected Actor</h3>
                    <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-gray-100 rounded">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-lg">{showRealNames ? selectedNode.real_name : selectedNode.strategy_name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className={`px-2 py-0.5 rounded ${roleColors[selectedNode.role].bg} ${roleColors[selectedNode.role].text}`}>
                        {roleColors[selectedNode.role].icon} {selectedNode.role}
                      </span>
                      <span>•</span>
                      <span>Edge: {selectedNode.edgeScore}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">Influence Score</div>
                      <div className="text-2xl font-bold text-violet-600">{selectedNode.influenceScore}</div>
                    </div>
                    <Link 
                      to={`/actors/${selectedNode.id}`}
                      className="flex items-center justify-center gap-2 mt-3 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
                    >
                      View Full Profile <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Influence Leaderboard */}
              <InfluenceLeaderboard actors={actorsData} showRealNames={showRealNames} />
              
              {/* Strategy Flow Map */}
              <StrategyFlowMap actors={actorsData} />
            </div>
          </div>
          
          {/* Cluster legend */}
          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-3">Detected Strategy Clusters</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(strategyColors).filter(([k]) => k !== 'Default').map(([strategy, colors]) => (
                <div key={strategy} className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: colors.border }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.bg }}></div>
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
