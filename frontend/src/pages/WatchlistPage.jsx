import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Eye, Trash2, Bell, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Activity, Clock, Link2, ArrowUpRight, 
  ArrowDownRight, ChevronDown, Wallet, Users, Coins, X, Settings,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Header from '../components/Header';

// Add Address Modal Component
const AddAddressModal = ({ isOpen, onClose, onAdd }) => {
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState('whale');
  const [watchType, setWatchType] = useState('address'); // address, cluster, token

  const handleSubmit = () => {
    if ((watchType !== 'token' && address && label) || (watchType === 'token' && label)) {
      onAdd({ 
        address: address || label, 
        label, 
        type: watchType === 'token' ? 'token' : type, 
        watchType 
      });
      setAddress('');
      setLabel('');
      setType('whale');
      setWatchType('address');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add to Watchlist</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Watch Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">What to watch?</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'address', label: 'Address', icon: Wallet },
                { value: 'cluster', label: 'Cluster', icon: Users },
                { value: 'token', label: 'Token', icon: Coins },
              ].map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setWatchType(option.value)}
                    className={`flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 transition-all ${
                      watchType === option.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallet Address Input */}
          {watchType !== 'token' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {watchType === 'cluster' ? 'Cluster ID / Address' : 'Wallet Address'}
              </label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={watchType === 'cluster' ? 'Cluster ID or seed address...' : '0x...'} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm transition-all"
              />
            </div>
          )}
          
          {/* Label Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {watchType === 'token' ? 'Token Symbol' : 'Label'}
            </label>
            <input 
              type="text" 
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={watchType === 'token' ? 'e.g., ETH, BTC, UNI' : 'e.g., Vitalik Buterin'} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Type Selector - Only for non-tokens */}
          {watchType !== 'token' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <div className="relative">
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all bg-white"
                >
                  <option value="whale">🐋 Whale</option>
                  <option value="influencer">📢 Influencer</option>
                  <option value="exchange">🏦 Exchange</option>
                  <option value="fund">💼 Fund</option>
                  <option value="smart_contract">📄 Smart Contract</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([
    {
      id: 1,
      name: 'Vitalik Buterin',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      type: 'Influencer',
      verified: true,
      behavior: 'accumulating',
      behaviorChanged: false,
      risk: 'low',
      bridgeAligned: false,
      balance: '$45.2M',
      change24h: 5.4,
      watchScore: 45, // NOT signal score - attention weight
      hasActiveSignals: false
    },
    {
      id: 2,
      name: 'Binance Hot Wallet',
      address: '0x28C6c06298d514Db089934071355E5743bf21d60',
      type: 'Exchange',
      verified: true,
      behavior: 'distributing',
      behaviorChanged: true,
      risk: 'high',
      bridgeAligned: true,
      balance: '$2.8B',
      change24h: -2.1,
      watchScore: 87,
      hasActiveSignals: true
    },
    {
      id: 3,
      name: 'Unknown Whale',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      type: 'Whale',
      verified: false,
      behavior: 'accumulating',
      behaviorChanged: true,
      risk: 'medium',
      bridgeAligned: false,
      balance: '$127.5M',
      change24h: 12.8,
      watchScore: 72,
      hasActiveSignals: false
    },
    {
      id: 4,
      name: 'a16z Crypto Fund',
      address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
      type: 'Fund',
      verified: true,
      behavior: 'dormant',
      behaviorChanged: false,
      risk: 'low',
      bridgeAligned: false,
      balance: '$890.2M',
      change24h: 0,
      watchScore: 12,
      hasActiveSignals: false
    },
    {
      id: 5,
      name: 'Jump Trading',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEc',
      type: 'Fund',
      verified: true,
      behavior: 'distributing',
      behaviorChanged: false,
      risk: 'medium',
      bridgeAligned: true,
      balance: '$345.8M',
      change24h: -5.2,
      watchScore: 58,
      hasActiveSignals: true
    },
    {
      id: 6,
      name: 'Coinbase Exchange',
      address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D507',
      type: 'Exchange',
      verified: true,
      behavior: 'rotating',
      behaviorChanged: false,
      risk: 'low',
      bridgeAligned: false,
      balance: '$1.2B',
      change24h: 1.8,
      watchScore: 35,
      hasActiveSignals: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterBehavior, setFilterBehavior] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [showOnlyChanges, setShowOnlyChanges] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick summary stats
  const stats = {
    behaviorChanged: watchlist.filter(w => w.behaviorChanged).length,
    highRisk: watchlist.filter(w => w.risk === 'high').length,
    bridgeAligned: watchlist.filter(w => w.bridgeAligned).length,
    dormant: watchlist.filter(w => w.dormant).length
  };

  // Filtering logic
  const filteredWatchlist = watchlist.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type.toLowerCase() === filterType;
    const matchesBehavior = filterBehavior === 'all' || item.behavior === filterBehavior;
    const matchesRisk = filterRisk === 'all' || item.risk === filterRisk;
    const matchesChanges = !showOnlyChanges || item.changes.length > 0;
    
    return matchesSearch && matchesType && matchesBehavior && matchesRisk && matchesChanges;
  });

  const handleRemove = (id) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
  };

  const handleAdd = (newItem) => {
    const newWatchlistItem = {
      id: Math.max(...watchlist.map(w => w.id)) + 1,
      name: newItem.label,
      address: newItem.address,
      type: newItem.type,
      verified: false,
      behavior: 'unknown',
      behaviorChanged: false,
      risk: 'medium',
      bridgeAligned: false,
      balance: '$0',
      change24h: 0,
      signalScore: 0,
      changes: [],
      dormant: false,
      exposure: 'Unknown'
    };
    setWatchlist([...watchlist, newWatchlistItem]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header - Светлый, спокойный */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Watchlist</h1>
              <p className="text-sm text-gray-500 mt-1">My tracked wallets & entities</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add address
            </button>
          </div>

          {/* Quick Summary - Светлый блок */}
          {(stats.behaviorChanged > 0 || stats.highRisk > 0 || stats.bridgeAligned > 0) && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">Quick summary:</span>
                {stats.behaviorChanged > 0 && (
                  <span className="text-gray-700">• {stats.behaviorChanged} address{stats.behaviorChanged > 1 ? 'es' : ''} changed behavior (24h)</span>
                )}
                {stats.highRisk > 0 && (
                  <span className="text-gray-700">• {stats.highRisk} high-risk address{stats.highRisk > 1 ? 'es' : ''}</span>
                )}
                {stats.bridgeAligned > 0 && (
                  <span className="text-gray-700">• {stats.bridgeAligned} bridge-aligned cluster{stats.bridgeAligned > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Control Bar - Single level */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 rounded-lg w-80">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search addresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Filters Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOnlyChanges(!showOnlyChanges)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  showOnlyChanges ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Changes (24h)
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                Filters
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Advanced Filters Drawer */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Type:</span>
                {['all', 'whale', 'exchange', 'fund', 'influencer'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                      filterType === t ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Behavior:</span>
                {['all', 'accumulating', 'distributing', 'rotating', 'dormant'].map(b => (
                  <button
                    key={b}
                    onClick={() => setFilterBehavior(b)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                      filterBehavior === b ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {b.charAt(0).toUpperCase() + b.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Risk:</span>
                {['all', 'low', 'medium', 'high'].map(r => (
                  <button
                    key={r}
                    onClick={() => setFilterRisk(r)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                      filterRisk === r ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Watchlist Grid - Светлые карточки */}
        {filteredWatchlist.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No addresses in watchlist</h3>
            <p className="text-gray-500 text-sm mb-4">Start tracking wallets by adding addresses</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add first address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWatchlist.map(item => (
              <div
                key={item.id}
                className={`bg-white rounded-lg border p-4 hover:shadow-md transition-all ${
                  item.behavior === 'accumulating' ? 'border-emerald-200' :
                  item.behavior === 'distributing' ? 'border-red-200' :
                  item.bridgeAligned ? 'border-blue-200' :
                  'border-gray-200'
                }`}
              >
                {/* Top: Name + Actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                      {item.verified && <CheckCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500">{item.type}</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors">
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status Pills - Цветные, но мягкие */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    item.behavior === 'accumulating' ? 'bg-emerald-100 text-emerald-700' :
                    item.behavior === 'distributing' ? 'bg-red-100 text-red-700' :
                    item.behavior === 'rotating' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {item.behavior}
                  </span>
                  
                  {item.risk !== 'low' && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      item.risk === 'high' ? 'bg-red-50 text-red-600 border border-red-200' :
                      'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {item.risk} risk
                    </span>
                  )}
                  
                  {item.bridgeAligned && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-blue-50 text-blue-600 border border-blue-200">
                      Bridge
                    </span>
                  )}
                  
                  {item.dormant && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-gray-100 text-gray-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      Dormant {item.dormantDays}d
                    </span>
                  )}
                </div>

                {/* Changes List - Если есть */}
                {item.changes.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {item.changes.map((change, idx) => {
                      const Icon = change.icon;
                      return (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Icon className="w-3 h-3 text-gray-400" />
                          <span>{change.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Mini Indicators */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs">
                    <div>
                      <div className="text-gray-500 text-[10px] uppercase mb-0.5">Balance</div>
                      <div className="font-semibold text-gray-900">{item.balance}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[10px] uppercase mb-0.5">24h</div>
                      <div className={`font-semibold flex items-center gap-0.5 ${
                        item.change24h > 0 ? 'text-emerald-600' :
                        item.change24h < 0 ? 'text-red-600' :
                        'text-gray-500'
                      }`}>
                        {item.change24h > 0 ? <ArrowUpRight className="w-3 h-3" /> : 
                         item.change24h < 0 ? <ArrowDownRight className="w-3 h-3" /> : null}
                        {item.change24h > 0 ? '+' : ''}{item.change24h}%
                      </div>
                    </div>
                  </div>

                  {/* Signal Score - Вторичен */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">Score</span>
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                      item.signalScore >= 70 ? 'bg-red-100 text-red-700' :
                      item.signalScore >= 40 ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {item.signalScore}
                    </span>
                  </div>
                </div>

                {/* Exposure Hint - Subtle */}
                {item.exposure && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-[10px] text-gray-500">{item.exposure}</span>
                  </div>
                )}

                {/* View CTA */}
                <Link
                  to={`/wallet/${item.address}`}
                  className="mt-3 block text-center text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  View address →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      <AddAddressModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default WatchlistPage;
