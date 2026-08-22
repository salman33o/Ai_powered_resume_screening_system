import React, { useState } from 'react';
import { TokenUsageState } from '../types';
import { 
  Zap, 
  Coins, 
  TrendingDown, 
  History, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  X,
  Layers,
  Activity
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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#131F30] border border-[#223348] rounded-lg max-w-2xl w-full shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-[#0E1A29] border-b border-[#223348] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-[#131F30] border border-[#223348] flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-[#E6EAF0] font-display">AI Compute & Token Quota Specification</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131F30] text-teal-400 border border-[#223348]">
                  {tokenState.tier}
                </span>
              </div>
              <p className="text-[11px] text-[#8A97A8]">
                Deterministic scoring, batch OCR parsing, and LLM synthesis telemetry
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-[#8A97A8] hover:text-[#E6EAF0] hover:bg-[#17263B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded bg-[#0E1A29] border border-[#223348]">
              <span className="text-[11px] font-medium text-[#8A97A8] flex items-center justify-between">
                Available Tokens
                <Coins className="w-3.5 h-3.5 text-amber-400" />
              </span>
              <p className="text-xl font-mono font-bold text-[#E6EAF0] mt-1.5">
                {tokenState.availableTokens.toLocaleString()}
              </p>
              <span className="text-[10px] text-teal-400 font-mono">Ready for execution</span>
            </div>

            <div className="p-3.5 rounded bg-[#0E1A29] border border-[#223348]">
              <span className="text-[11px] font-medium text-[#8A97A8] flex items-center justify-between">
                Session Consumption
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              </span>
              <p className="text-xl font-mono font-bold text-[#E6EAF0] mt-1.5">
                {tokenState.usedTokens.toLocaleString()}
              </p>
              <span className="text-[10px] text-[#8A97A8] font-mono">Deducted telemetry</span>
            </div>

            <div className="p-3.5 rounded bg-[#0E1A29] border border-[#223348]">
              <span className="text-[11px] font-medium text-[#8A97A8] flex items-center justify-between">
                Allocated Cap
                <Activity className="w-3.5 h-3.5 text-teal-400" />
              </span>
              <p className="text-xl font-mono font-bold text-[#E6EAF0] mt-1.5">
                {tokenState.totalAllocated.toLocaleString()}
              </p>
              <span className="text-[10px] text-[#8A97A8] font-mono">{percentageUsed}% quota consumed</span>
            </div>
          </div>

          {/* Precision Quota Meter */}
          <div className="space-y-1.5 bg-[#0E1A29] p-3.5 rounded border border-[#223348]">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8A97A8]">Quota Utilization</span>
              <span className="text-teal-400 font-semibold">{tokenState.availableTokens.toLocaleString()} tokens free</span>
            </div>
            <div className="instrument-gauge">
              <div 
                className="instrument-gauge-fill"
                style={{ width: `${Math.min(100, 100 - percentageUsed)}%` }}
              />
            </div>
          </div>

          {/* Unit Consumption Rates Specification */}
          <div className="bg-[#0E1A29] p-3.5 rounded border border-[#223348] space-y-2">
            <h4 className="text-[10px] font-mono font-bold text-[#8A97A8] uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Unit Operation Costs</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#131F30] border border-[#223348] text-center">
                <span className="block text-[10px] text-[#8A97A8]">Bulk Screen</span>
                <span className="font-bold text-teal-400">1 tok / doc</span>
              </div>
              <div className="p-2 rounded bg-[#131F30] border border-[#223348] text-center">
                <span className="block text-[10px] text-[#8A97A8]">ATS Deep Scan</span>
                <span className="font-bold text-teal-400">5 tok / doc</span>
              </div>
              <div className="p-2 rounded bg-[#131F30] border border-[#223348] text-center">
                <span className="block text-[10px] text-[#8A97A8]">Optimization</span>
                <span className="font-bold text-teal-400">25 tok / run</span>
              </div>
              <div className="p-2 rounded bg-[#131F30] border border-[#223348] text-center">
                <span className="block text-[10px] text-[#8A97A8]">Interview Prep</span>
                <span className="font-bold text-teal-400">20 tok / role</span>
              </div>
            </div>
          </div>

          {/* Top-up Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#E6EAF0] flex items-center space-x-1.5">
                <Plus className="w-3.5 h-3.5 text-teal-400" />
                <span>Simulate Quota Allocation</span>
              </h4>
              {topUpSuccess && (
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tokens Added to Quota</span>
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2 font-mono">
              <button
                onClick={() => handleTopUpClick(5000)}
                className="p-2.5 rounded bg-[#0E1A29] border border-[#223348] hover:border-teal-500/50 hover:bg-[#17263B] text-center transition-colors cursor-pointer"
              >
                <span className="block text-xs font-bold text-[#E6EAF0]">+5,000</span>
                <span className="text-[10px] text-[#8A97A8]">Standard Block</span>
              </button>

              <button
                onClick={() => handleTopUpClick(20000)}
                className="p-2.5 rounded bg-[#0E1A29] border border-[#223348] hover:border-teal-500/50 hover:bg-[#17263B] text-center transition-colors cursor-pointer"
              >
                <span className="block text-xs font-bold text-teal-300">+20,000</span>
                <span className="text-[10px] text-[#8A97A8]">Batch Screen Pack</span>
              </button>

              <button
                onClick={() => handleTopUpClick(50000)}
                className="p-2.5 rounded bg-[#0E1A29] border border-[#223348] hover:border-teal-500/50 hover:bg-[#17263B] text-center transition-colors cursor-pointer"
              >
                <span className="block text-xs font-bold text-[#E6EAF0]">+50,000</span>
                <span className="text-[10px] text-[#8A97A8]">Enterprise Scale</span>
              </button>
            </div>
          </div>

          {/* Usage History */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-[#223348] pb-1.5">
              <h4 className="text-[11px] font-mono font-bold text-[#8A97A8] uppercase tracking-wider flex items-center space-x-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Transaction Ledger</span>
              </h4>
              <div className="flex space-x-1 font-mono">
                {['all', 'screening', 'optimization', 'interview_prep'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-[10px] px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                      filterCategory === cat ? 'bg-teal-600 text-slate-950 font-bold' : 'text-[#8A97A8] hover:text-[#E6EAF0]'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {filteredHistory.length === 0 ? (
                <p className="text-xs text-[#8A97A8] text-center py-4 font-mono">No telemetry events logged.</p>
              ) : (
                filteredHistory.slice(0, 15).map((log) => (
                  <div 
                    key={log.id} 
                    className="p-2 rounded bg-[#0E1A29] border border-[#223348] flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        log.category === 'screening' ? 'bg-teal-400' :
                        log.category === 'optimization' ? 'bg-amber-400' :
                        log.category === 'interview_prep' ? 'bg-emerald-400' : 'bg-slate-400'
                      }`} />
                      <div>
                        <p className="font-semibold text-[#E6EAF0] text-[11px]">{log.action}</p>
                        <p className="text-[9px] text-[#8A97A8]">{log.targetName} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <span className="font-bold text-amber-400 text-xs">
                      -{log.tokensDeducted} tok
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#0E1A29] border-t border-[#223348] flex items-center justify-between">
          <button
            onClick={onResetTokens}
            className="flex items-center space-x-1.5 text-xs font-mono text-[#8A97A8] hover:text-rose-400 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Quota (25,000)</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#17263B] hover:bg-[#223348] text-[#E6EAF0] font-semibold text-xs border border-[#223348] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
