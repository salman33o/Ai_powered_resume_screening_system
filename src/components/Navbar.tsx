import React, { useState } from 'react';
import { 
  UserRole, 
  StructuredResume, 
  JobRequirement,
  AuthUser 
} from '../types';
import { 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Bell, 
  UserCheck, 
  Briefcase, 
  FileText, 
  Sparkles,
  Layers,
  ChevronDown,
  LogOut,
  KeyRound,
  Zap,
  MessageSquare
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  isMobileView: boolean;
  setIsMobileView: (val: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  resumes: StructuredResume[];
  selectedResume: StructuredResume;
  setSelectedResume: (resume: StructuredResume) => void;
  jobs: JobRequirement[];
  selectedJob: JobRequirement;
  setSelectedJob: (job: JobRequirement) => void;
  onOpenPrivacy: () => void;
  onOpenAudit: () => void;
  unreadNotifications: number;
  onToggleNotifications: () => void;
  authUser: AuthUser | null;
  onLogout: () => void;
  onOpenLoginPortal: () => void;
  availableTokens?: number;
  onOpenTokenModal?: () => void;
  unreadMessagesCount?: number;
  onOpenMessages?: () => void;
  setRole?: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  isMobileView,
  setIsMobileView,
  activeView,
  setActiveView,
  resumes,
  selectedResume,
  setSelectedResume,
  jobs,
  selectedJob,
  setSelectedJob,
  onOpenPrivacy,
  onOpenAudit,
  unreadNotifications,
  onToggleNotifications,
  authUser,
  onLogout,
  onOpenLoginPortal,
  availableTokens = 25000,
  onOpenTokenModal,
  unreadMessagesCount = 0,
  onOpenMessages,
  setRole
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleSwitchRole = (newRole: UserRole) => {
    if (setRole) setRole(newRole);
    setActiveView(newRole === 'candidate' ? 'candidate-dashboard' : 'recruiter-dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B1420] border-b border-[#223348] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setActiveView(currentRole === 'candidate' ? 'candidate-dashboard' : 'recruiter-dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-[#131F30] border border-[#223348] flex items-center justify-center text-teal-400 font-mono font-bold text-xs">
              ATS
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base text-[#E6EAF0] tracking-tight font-display">
                  PrimeATS
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#131F30] text-teal-400 border border-[#223348]">
                  v4.2 Spec
                </span>
              </div>
            </div>
          </div>

          {/* Quick Context Selectors */}
          <div className="hidden lg:flex items-center space-x-2 bg-[#0E1A29] p-1 rounded-lg border border-[#223348]">
            {currentRole === 'candidate' ? (
              <div className="flex items-center space-x-1.5 px-2">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs text-[#8A97A8] font-medium">Resume:</span>
                <select
                  value={selectedResume.id}
                  onChange={(e) => {
                    const found = resumes.find(r => r.id === e.target.value);
                    if (found) setSelectedResume(found);
                  }}
                  aria-label="Active Candidate Resume"
                  className="bg-[#131F30] text-xs font-mono text-[#E6EAF0] rounded px-2 py-1 border border-[#223348] focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  {resumes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.fullName} ({r.versionName.split('—')[1]?.trim() || 'General'})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="flex items-center space-x-1.5 px-2 border-l border-[#223348]">
              <Briefcase className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs text-[#8A97A8] font-medium">Target Job:</span>
              <select
                value={selectedJob.id}
                onChange={(e) => {
                  const found = jobs.find(j => j.id === e.target.value);
                  if (found) setSelectedJob(found);
                }}
                aria-label="Target Job Position"
                className="bg-[#131F30] text-xs font-mono text-[#E6EAF0] rounded px-2 py-1 border border-[#223348] focus:outline-none focus:border-teal-500 cursor-pointer max-w-[220px] truncate"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.company})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5">
            
            {/* View Mode Toggle: Desktop vs Android App Frame */}
            <div className="flex items-center bg-[#0E1A29] p-0.5 rounded-lg border border-[#223348]">
              <button
                onClick={() => setIsMobileView(false)}
                title="Desktop Web Console View"
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer ${
                  !isMobileView
                    ? 'bg-[#17263B] text-[#E6EAF0] border border-[#223348]'
                    : 'text-[#8A97A8] hover:text-[#E6EAF0]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Desktop</span>
              </button>
              <button
                onClick={() => setIsMobileView(true)}
                title="Android App Preview (Flutter / Material 3)"
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer ${
                  isMobileView
                    ? 'bg-[#17263B] text-teal-300 border border-teal-500/40'
                    : 'text-[#8A97A8] hover:text-[#E6EAF0]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Android App</span>
              </button>
            </div>

            {/* Interactive Role Switcher Toggle */}
            <div className="flex items-center bg-[#0E1A29] p-0.5 rounded-lg border border-[#223348]">
              <button
                onClick={() => handleSwitchRole('candidate')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                  currentRole === 'candidate'
                    ? 'bg-teal-600 text-slate-950 font-bold'
                    : 'text-[#8A97A8] hover:text-[#E6EAF0]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Candidate</span>
              </button>
              <button
                onClick={() => handleSwitchRole('recruiter')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                  currentRole === 'recruiter'
                    ? 'bg-teal-600 text-slate-950 font-bold'
                    : 'text-[#8A97A8] hover:text-[#E6EAF0]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Recruiter</span>
              </button>
            </div>

            {/* Logged in User Profile Dropdown / Login Portal Launcher */}
            <div className="relative flex items-center space-x-1.5">
              {authUser ? (
                <>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 bg-[#0E1A29] hover:bg-[#131F30] px-2.5 py-1.5 rounded-lg border border-[#223348] transition-colors text-xs font-medium text-[#E6EAF0]"
                  >
                    <div className="w-5 h-5 rounded bg-teal-600/30 border border-teal-500/40 flex items-center justify-center font-mono font-bold text-[10px] text-teal-300">
                      {authUser.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">{authUser.name}</span>
                    <ChevronDown className="w-3 h-3 text-[#8A97A8]" />
                  </button>

                  {/* Direct Visible Logout Button */}
                  <button
                    onClick={onLogout}
                    title="Log Out of Current Session"
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold font-mono transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden md:inline">Log Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onOpenLoginPortal}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Login Portal</span>
                </button>
              )}

              {showUserDropdown && authUser && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#131F30] rounded-lg border border-[#223348] shadow-2xl p-3 z-50 animate-in fade-in duration-100">
                  <div className="border-b border-[#223348] pb-2.5 mb-2.5">
                    <p className="font-semibold text-xs text-[#E6EAF0]">{authUser.name}</p>
                    <p className="text-[11px] text-[#8A97A8] truncate font-mono">{authUser.email}</p>
                    <span className="inline-block text-[10px] font-mono uppercase px-2 py-0.5 mt-1.5 rounded bg-[#0E1A29] text-teal-400 border border-[#223348]">
                      {authUser.role} Session Active
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenLoginPortal();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded text-xs font-medium text-[#8A97A8] hover:text-[#E6EAF0] hover:bg-[#17263B] flex items-center space-x-2 transition-colors mb-1.5 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                    <span>Switch Auth Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Confirm Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Token Quota Badge & Modal Trigger */}
            <button
              onClick={onOpenTokenModal}
              title="View AI Token Quota"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#0E1A29] hover:bg-[#131F30] border border-[#223348] text-[#E6EAF0] font-mono text-xs transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{availableTokens.toLocaleString()}</span>
            </button>

            {/* Direct Messages Center Trigger */}
            <button
              onClick={onOpenMessages || (() => setActiveView('messages'))}
              title="Direct Messages"
              className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
                activeView === 'messages' 
                  ? 'bg-[#17263B] border-teal-500/40 text-teal-300' 
                  : 'text-[#8A97A8] hover:text-[#E6EAF0] bg-[#0E1A29] border-[#223348]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded bg-teal-500 text-slate-950 font-mono font-bold text-[9px]">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* ATS Audit Logs Button */}
            <button
              onClick={onOpenAudit}
              title="Inspect ATS Audit Trail"
              className="p-2 rounded-lg text-[#8A97A8] hover:text-[#E6EAF0] bg-[#0E1A29] border border-[#223348] transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            {/* Privacy & Security Compliance */}
            <button
              onClick={onOpenPrivacy}
              title="Privacy & Bias Protection"
              className="p-2 rounded-lg text-[#8A97A8] hover:text-[#E6EAF0] bg-[#0E1A29] border border-[#223348] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>

            {/* Notifications Button */}
            <button
              onClick={onToggleNotifications}
              className="relative p-2 rounded-lg text-[#8A97A8] hover:text-[#E6EAF0] bg-[#0E1A29] border border-[#223348] transition-colors"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

