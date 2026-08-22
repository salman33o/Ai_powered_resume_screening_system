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
    { id: 'candidate-dashboard', label: 'Overview', icon: Home },
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
      {/* Android Device Outer Bezel */}
      <div className="w-full max-w-[420px] h-[860px] bg-[#131F30] rounded-[44px] p-3 shadow-lg border-4 border-[#223348] relative flex flex-col overflow-hidden">
        
        {/* Antenna / Edge Accents */}
        <div className="absolute top-24 -left-[6px] w-1.5 h-12 bg-[#223348] rounded-l-md"></div>
        <div className="absolute top-40 -left-[6px] w-1.5 h-16 bg-[#223348] rounded-l-md"></div>
        <div className="absolute top-32 -right-[6px] w-1.5 h-16 bg-[#223348] rounded-r-md"></div>

        {/* Screen Bezel & Screen Glass */}
        <div className="w-full h-full bg-[#0B1420] rounded-[34px] flex flex-col overflow-hidden relative border border-[#223348]">
          
          {/* Android Status Bar */}
          <div className="h-7 bg-[#0E1A29] px-6 flex items-center justify-between text-[#8A97A8] text-xs select-none z-30 shrink-0 border-b border-[#192738]">
            <span className="font-mono font-semibold text-[#E6EAF0] text-[11px]">09:41</span>
            
            {/* Center Camera Punch-hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-[#223348] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#131F30]"></div>
            </div>

            <div className="flex items-center space-x-1.5 text-[#8A97A8]">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Android App Bar */}
          <div className="px-4 py-2 bg-[#131F30] border-b border-[#223348] flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs tracking-tight text-[#E6EAF0] font-display">
                {currentRole === 'candidate' ? 'PrimeATS Candidate' : 'PrimeATS Recruiter'}
              </span>
            </div>
            <span className="text-[9px] font-mono uppercase font-semibold px-1.5 py-0.5 rounded bg-[#0E1A29] text-teal-400 border border-[#223348]">
              v4.2
            </span>
          </div>

          {/* Scrollable Android App Content Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-20">
            {children}
          </div>

          {/* Bottom Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#131F30] border-t border-[#223348] flex items-center justify-around px-2 z-30">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex flex-col items-center justify-center w-12 py-1 rounded transition-colors ${
                    isActive
                      ? 'text-teal-300 font-semibold'
                      : 'text-[#8A97A8] hover:text-[#E6EAF0]'
                  }`}
                >
                  <div
                    className={`w-8 h-6 rounded flex items-center justify-center mb-0.5 transition-colors ${
                      isActive ? 'bg-[#17263B] text-teal-300 border border-teal-500/30' : ''
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] tracking-tight leading-none font-mono">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Android Gesture Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#223348] rounded-full z-40"></div>
        </div>
      </div>
    </div>
  );
};
