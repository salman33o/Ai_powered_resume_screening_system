import React, { useState } from 'react';
import { TokenUsageState } from '../types';
import { 
  Zap, 
  Coins, 
  TrendingDown, 
  History, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  RefreshCw, 
  X,
  Flame
} from 'lucide-react';

interface TokenUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenState: TokenUsageState;
  onTopUp: (amount: number) => void;
  onResetTokens: () => void;
}

export const TokenUsageModal: React.FC<TokenUsageModalProps> = ({
  isOpen,
  onClose,
  tokenState,
  onTopUp,
  onResetTokens,
}) => {
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen) return null;

  const handleTopUpClick = (amount: number) => {
    onTopUp(amount);
    setTopUpSuccess(true);
    setTimeout(() => setTopUpSuccess(false), 2500);
  };

  const percentageUsed = Math.min(
    100,
    Math.round((tokenState.usedTokens / (tokenState.totalAllocated || 1)) * 100)
  );

  const filteredHistory = filterCategory === 'all' 
    ? tokenState.history 
    : tokenState.history.filter(h => h.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">AI Token & Compute Quota</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  {tokenState.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time tracking of AI screening, deterministic scoring, and LLM optimization tokens.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 glow-border-amber shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                Available Tokens
                <Coins className="w-4 h-4 text-amber-400" />
              </span>
              <p className="text-2xl font-black text-amber-300 mt-2">
                {tokenState.availableTokens.toLocaleString()}
              </p>
              <span className="text-[10px] text-amber-400/80 font-medium">Ready for immediate scans</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                Used in Session
                <TrendingDown className="w-4 h-4 text-rose-400" />
              </span>
              <p className="text-2xl font-black text-white mt-2">
                {tokenState.usedTokens.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500">Across all AI operations</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                Total Allocated
                <Flame className="w-4 h-4 text-purple-400" />
              </span>
              <p className="text-2xl font-black text-purple-300 mt-2">
                {tokenState.totalAllocated.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500">{percentageUsed}% quota consumed</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Quota Consumption</span>
              <span className="text-amber-400">{tokenState.availableTokens.toLocaleString()} tokens remaining</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.min(100, 100 - percentageUsed)}%` }}
              />
            </div>
          </div>

          {/* Token Rates & Info */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Token Consumption Rates</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="block text-[10px] text-slate-400">Bulk Screening</span>
                <span className="font-bold text-emerald-400">1 Token / Resume</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="block text-[10px] text-slate-400">ATS Deep Scoring</span>
                <span className="font-bold text-indigo-400">5 Tokens / Scan</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="block text-[10px] text-slate-400">Resume Optimization</span>
                <span className="font-bold text-purple-400">25 Tokens / Run</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="block text-[10px] text-slate-400">Interview Generator</span>
                <span className="font-bold text-cyan-400">20 Tokens / Role</span>
              </div>
            </div>
          </div>

          {/* Top-up Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Token Top-Up (Simulation)</span>
              </h4>
              {topUpSuccess && (
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tokens Added Successfully!</span>
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => handleTopUpClick(5000)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-center transition-all group cursor-pointer"
              >
                <span className="block text-xs font-black text-white group-hover:text-emerald-300">+5,000 Tokens</span>
                <span className="text-[10px] text-slate-500">Quick Booster</span>
              </button>

              <button
                onClick={() => handleTopUpClick(20000)}
                className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-950/20 text-center transition-all group cursor-pointer"
              >
                <span className="block text-xs font-black text-indigo-300 group-hover:text-white">+20,000 Tokens</span>
                <span className="text-[10px] text-slate-500">Pro Bulk Pack</span>
              </button>

              <button
                onClick={() => handleTopUpClick(50000)}
                className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 hover:border-purple-500 hover:bg-purple-950/20 text-center transition-all group cursor-pointer"
              >
                <span className="block text-xs font-black text-purple-300 group-hover:text-white">+50,000 Tokens</span>
                <span className="text-[10px] text-slate-500">Enterprise Scale</span>
              </button>
            </div>
          </div>

          {/* Usage History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Token Consumption Log</span>
              </h4>
              <div className="flex space-x-1">
                {['all', 'screening', 'optimization', 'interview_prep'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-[10px] px-2 py-0.5 rounded-lg capitalize transition-colors cursor-pointer ${
                      filterCategory === cat ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {filteredHistory.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No token consumption logged yet.</p>
              ) : (
                filteredHistory.slice(0, 15).map((log) => (
                  <div 
                    key={log.id} 
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-2 h-2 rounded-full ${
                        log.category === 'screening' ? 'bg-emerald-400' :
                        log.category === 'optimization' ? 'bg-purple-400' :
                        log.category === 'interview_prep' ? 'bg-cyan-400' : 'bg-indigo-400'
                      }`} />
                      <div>
                        <p className="font-semibold text-white">{log.action}</p>
                        <p className="text-[10px] text-slate-400">{log.targetName} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-amber-400">
                      -{log.tokensDeducted} tokens
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onResetTokens}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Default 25,000</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
