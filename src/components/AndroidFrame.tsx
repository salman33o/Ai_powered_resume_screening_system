import React from 'react';
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
  Bot
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
  const candidateNavItems = [
    { id: 'candidate-dashboard', label: 'Home', icon: Home },
    { id: 'resume-analyzer', label: 'ATS Score', icon: FileSearch },
    { id: 'resume-optimizer', label: 'Optimizer', icon: Wand2 },
    { id: 'resume-builder', label: 'Builder', icon: FileText },
    { id: 'ai-interview', label: 'Interview', icon: Bot },
  ];

  const recruiterNavItems = [
    { id: 'recruiter-dashboard', label: 'Dashboard', icon: Home },
    { id: 'recruiter-bulk', label: 'Bulk Screen', icon: Layers },
    { id: 'candidate-ranking', label: 'Ranking', icon: Users },
    { id: 'candidate-pipeline', label: 'Pipeline', icon: Briefcase },
    { id: 'recruiter-analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const navItems = currentRole === 'candidate' ? candidateNavItems : recruiterNavItems;

  return (
    <div className="py-6 flex justify-center items-center">
      {/* Android Device Outer Bezel (Pixel 8 Pro Style) */}
      <div className="w-full max-w-[420px] h-[860px] bg-slate-900 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-[5px] border-slate-700/80 relative flex flex-col overflow-hidden">
        
        {/* Antenna / Edge Accents */}
        <div className="absolute top-24 -left-[7px] w-1.5 h-12 bg-slate-700 rounded-l-md"></div>
        <div className="absolute top-40 -left-[7px] w-1.5 h-16 bg-slate-700 rounded-l-md"></div>
        <div className="absolute top-32 -right-[7px] w-1.5 h-16 bg-slate-700 rounded-r-md"></div>

        {/* Screen Bezel & Screen Glass */}
        <div className="w-full h-full bg-slate-950 rounded-[38px] flex flex-col overflow-hidden relative border border-slate-800">
          
          {/* Android Status Bar */}
          <div className="h-7 bg-slate-950/95 px-6 flex items-center justify-between text-slate-400 text-xs select-none z-30 shrink-0">
            <span className="font-semibold text-slate-300 text-[11px]">9:41</span>
            
            {/* Center Camera Punch-hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800/80 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900/60"></div>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Android App Bar (Material 3 Header) */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight text-white">
                {currentRole === 'candidate' ? 'ATS Candidate Hub' : 'ATS Recruiter Console'}
              </span>
            </div>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Flutter Engine
            </span>
          </div>

          {/* Scrollable Android App Content Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4 pb-20 custom-scrollbar">
            {children}
          </div>

          {/* Material Design 3 Bottom Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 z-30">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex flex-col items-center justify-center w-14 py-1 rounded-2xl transition-all ${
                    isActive
                      ? 'text-indigo-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`w-10 h-7 rounded-full flex items-center justify-center mb-0.5 transition-all ${
                      isActive ? 'bg-indigo-500/20 text-indigo-400' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] tracking-tight leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Android Gesture Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-600/70 rounded-full z-40"></div>
        </div>
      </div>
    </div>
  );
};
