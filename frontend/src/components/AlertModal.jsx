import { useState } from 'react';
import { X, Bell, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export default function AlertModal({ isOpen, onClose, defaultEntity = '' }) {
  const [entity, setEntity] = useState(defaultEntity || 'Alameda Research');
  const [threshold, setThreshold] = useState('$10M');
  const [timeframe, setTimeframe] = useState('24h');
  const [condition, setCondition] = useState('accumulation');

  if (!isOpen) return null;

  const entities = [
    'Any Smart Money',
    'Alameda Research',
    'DWF Labs',
    'Pantera Capital',
    'a16z Crypto',
    'Galaxy Digital',
    'Jump Trading',
    'Wintermute',
  ];

  const conditions = [
    { value: 'accumulation', label: 'Accumulation Detected' },
    { value: 'distribution', label: 'Distribution Detected' },
    { value: 'new_position', label: 'New Position Opened' },
    { value: 'large_transfer', label: 'Large Transfer (>$50M)' },
  ];

  const timeframes = [
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating alert:', { entity, threshold, timeframe, condition });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Alert</h2>
              <p className="text-sm text-gray-500">Get notified of market movements</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Entity Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Smart Money Entity
            </label>
            <Select value={entity} onValueChange={setEntity}>
              <SelectTrigger className="w-full h-12 px-4 bg-gray-50 border-gray-200 text-sm font-medium text-gray-900">
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {entities.map(e => (
                  <SelectItem 
                    key={e} 
                    value={e}
                    className="py-3 px-4 text-sm font-medium text-gray-900 hover:bg-gray-50 cursor-pointer rounded-xl"
                  >
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Alert Condition
            </label>
            <div className="space-y-2">
              {conditions.map((cond) => (
                <label
                  key={cond.value}
                  className={`flex items-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    condition === cond.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="condition"
                    value={cond.value}
                    checked={condition === cond.value}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">{cond.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Threshold */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Minimum Threshold
            </label>
            <input
              type="text"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="e.g., $10M"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Timeframe Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Timeframe
            </label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-full h-12 px-4 bg-gray-50 border-gray-200 text-sm font-medium text-gray-900">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {timeframes.map(tf => (
                  <SelectItem 
                    key={tf.value} 
                    value={tf.value}
                    className="py-3 px-4 text-sm font-medium text-gray-900 hover:bg-gray-50 cursor-pointer rounded-xl"
                  >
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Alert Preview</div>
            <div className="text-sm font-medium text-gray-900">
              Notify when <span className="font-bold">{entity}</span> shows{' '}
              <span className="font-bold">{conditions.find(c => c.value === condition)?.label.toLowerCase()}</span>{' '}
              with ≥{threshold} within{' '}
              <span className="font-bold">{timeframes.find(t => t.value === timeframe)?.label}</span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-semibold text-sm transition-colors"
            >
              Create Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
