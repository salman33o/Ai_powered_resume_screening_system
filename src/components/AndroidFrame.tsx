import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Home, 
  FileSearch, 
  Wand2, 
  FileText, 
  Briefcase, 
  Users, 
  Layers, 
  BarChart3,
  Bot,
  HelpCircle,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  currentRole: UserRole;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  currentRole,
  activeView,
  setActiveView
}) => {
  const [showBeginnerGuide, setShowBeginnerGuide] = useState(false);

  const candidateNavItems = [
    { id: 'candidate-dashboard', label: 'Home', icon: Home },
    { id: 'resume-analyzer', label: 'ATS Score', icon: FileSearch },
    { id: 'resume-optimizer', label: 'Optimize', icon: Wand2 },
    { id: 'resume-builder', label: 'Builder', icon: FileText },
    { id: 'ai-interview', label: 'Interview', icon: Bot },
  ];

  const recruiterNavItems = [
    { id: 'recruiter-dashboard', label: 'Home', icon: Home },
    { id: 'recruiter-bulk', label: 'Bulk ATS', icon: Layers },
    { id: 'candidate-ranking', label: 'Ranking', icon: Users },
    { id: 'candidate-pipeline', label: 'Pipeline', icon: Briefcase },
    { id: 'recruiter-analytics', label: 'Metrics', icon: BarChart3 },
  ];

  const navItems = currentRole === 'candidate' ? candidateNavItems : recruiterNavItems;

  return (
    <div className="py-4 sm:py-8 flex justify-center items-center px-2">
      {/* Android Device Outer Chassis */}
      <div className="w-full max-w-[440px] h-[890px] bg-[#101A26] rounded-[48px] p-3 shadow-2xl border-4 border-[#223348] relative flex flex-col overflow-hidden">
        
        {/* Hardware Antenna Accents */}
        <div className="absolute top-28 -left-[6px] w-1.5 h-12 bg-[#223348] rounded-l-md"></div>
        <div className="absolute top-44 -left-[6px] w-1.5 h-16 bg-[#223348] rounded-l-md"></div>
        <div className="absolute top-36 -right-[6px] w-1.5 h-16 bg-[#223348] rounded-r-md"></div>

        {/* Screen Display Area */}
        <div className="w-full h-full bg-[#0B1420] rounded-[38px] flex flex-col overflow-hidden relative border border-[#1E2D3D]">
          
          {/* Status Bar */}
          <div className="h-8 bg-[#0E1A29] px-6 flex items-center justify-between text-[#8A97A8] text-xs select-none z-30 shrink-0 border-b border-[#1A2838]">
            <span className="font-mono font-bold text-[#E6EAF0] text-[12px]">09:41</span>
            
            {/* Front Camera Punch-hole */}
            <div className="w-4 h-4 rounded-full bg-black border border-[#223348] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#17263B]"></div>
            </div>

            <div className="flex items-center space-x-2 text-[#8A97A8]">
              <Signal className="w-3.5 h-3.5 text-teal-400" />
              <Wifi className="w-3.5 h-3.5 text-teal-400" />
              <Battery className="w-4 h-4 text-teal-400" />
            </div>
          </div>

          {/* Top Android App Header */}
          <div className="px-3.5 py-2.5 bg-[#131F30] border-b border-[#223348] flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-teal-600 text-slate-950 flex items-center justify-center font-mono font-black text-[10px]">
                ATS
              </div>
              <div>
                <span className="font-bold text-xs tracking-tight text-[#E6EAF0] font-display block leading-tight">
                  PrimeATS Mobile
                </span>
                <span className="text-[9px] font-mono text-[#8A97A8] capitalize">
                  {currentRole} Workstation
                </span>
              </div>
            </div>

            {/* Beginner Quick Guide Toggle */}
            <button
              onClick={() => setShowBeginnerGuide(!showBeginnerGuide)}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-[#0E1A29] hover:bg-[#17263B] border border-[#223348] text-teal-300 text-[10px] font-mono font-medium transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3 h-3 text-teal-400" />
              <span>{showBeginnerGuide ? 'Hide Guide' : 'Beginner Guide'}</span>
            </button>
          </div>

          {/* Beginner Onboarding Guide Banner */}
          {showBeginnerGuide && (
            <div className="p-3 bg-[#0E1A29] border-b border-teal-500/40 text-xs animate-in slide-in-from-top-2 duration-150 shrink-0">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#223348] mb-2">
                <span className="text-[10px] font-mono font-bold uppercase text-teal-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>3-Step Quick Start Guide</span>
                </span>
                <button 
                  onClick={() => setShowBeginnerGuide(false)}
                  className="text-[#8A97A8] hover:text-[#E6EAF0]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-[11px] text-[#A2B1C2]">
                <div className="flex items-start space-x-2">
                  <span className="font-mono font-bold text-teal-400 bg-[#131F30] w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0">1</span>
                  <p><strong className="text-[#E6EAF0]">Select or Build Resume:</strong> Go to <em className="text-teal-300">Builder</em> to enter your details manually or test sample profiles.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-mono font-bold text-teal-400 bg-[#131F30] w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0">2</span>
                  <p><strong className="text-[#E6EAF0]">Run ATS Diagnostic:</strong> Tap <em className="text-teal-300">ATS Score</em> to view your 7-factor match against any job role.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-mono font-bold text-teal-400 bg-[#131F30] w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0">3</span>
                  <p><strong className="text-[#E6EAF0]">Optimize & Interview:</strong> Use <em className="text-teal-300">Optimizer</em> and <em className="text-teal-300">Interview</em> to prepare tailored answers.</p>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable View Content with Custom Fluid Padding */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-24 scrollbar-thin">
            {children}
          </div>

          {/* Android Material 3 Bottom Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#131F30] border-t border-[#223348] flex items-center justify-around px-2 z-30 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex flex-col items-center justify-center w-14 py-1 rounded transition-colors cursor-pointer ${
                    isActive
                      ? 'text-teal-300 font-bold'
                      : 'text-[#8A97A8] hover:text-[#E6EAF0]'
                  }`}
                >
                  <div
                    className={`w-9 h-7 rounded-lg flex items-center justify-center mb-0.5 transition-colors ${
                      isActive ? 'bg-[#17263B] text-teal-300 border border-teal-500/40' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] tracking-tight leading-none font-mono">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Android Home Navigation Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#223348] rounded-full z-40"></div>
        </div>
      </div>
    </div>
  );
};
