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
  KeyRound
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
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
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setRole,
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
  onOpenLoginPortal
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveView(currentRole === 'candidate' ? 'candidate-dashboard' : 'recruiter-dashboard')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl text-white font-display tracking-tight group-hover:text-indigo-300 transition-colors">
                  ResumeAI
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 glow-border-indigo">
                  v4.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Explainable ATS & Hybrid Screening Platform</p>
            </div>
          </div>

          {/* Quick Context Selectors */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
            {currentRole === 'candidate' ? (
              <div className="flex items-center space-x-2 px-2.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400 font-medium">Resume:</span>
                <select
                  value={selectedResume.id}
                  onChange={(e) => {
                    const found = resumes.find(r => r.id === e.target.value);
                    if (found) setSelectedResume(found);
                  }}
                  aria-label="Active Candidate Resume"
                  className="bg-slate-950 text-xs font-semibold text-slate-200 rounded-xl px-2.5 py-1.5 border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {resumes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.fullName} ({r.versionName.split('—')[1]?.trim() || 'General'})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="flex items-center space-x-2 px-2.5 border-l border-slate-800">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-slate-400 font-medium">Target Job:</span>
              <select
                value={selectedJob.id}
                onChange={(e) => {
                  const found = jobs.find(j => j.id === e.target.value);
                  if (found) setSelectedJob(found);
                }}
                aria-label="Target Job Position"
                className="bg-slate-950 text-xs font-semibold text-slate-200 rounded-xl px-2.5 py-1.5 border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[200px] truncate"
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
          <div className="flex items-center space-x-3">
            
            {/* View Mode Toggle: Desktop vs Android App Frame */}
            <div className="flex items-center bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setIsMobileView(false)}
                title="Desktop Web Console View"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  !isMobileView
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden md:inline">Desktop</span>
              </button>
              <button
                onClick={() => setIsMobileView(true)}
                title="Android App Preview (Flutter / Material 3)"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  isMobileView
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden md:inline">Android App</span>
              </button>
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 px-3.5 py-1.5 rounded-2xl border border-slate-800 transition-all text-xs font-semibold text-slate-200 shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span className="capitalize">{currentRole} Mode</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
                    Switch Active View Mode
                  </div>
                  
                  <button
                    onClick={() => {
                      setRole('candidate');
                      setShowPersonaMenu(false);
                      setActiveView('candidate-dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      currentRole === 'candidate'
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-indigo-400" />
                      <span>Candidate View</span>
                    </div>
                    {currentRole === 'candidate' && <span className="w-2 h-2 rounded-full bg-indigo-400"></span>}
                  </button>

                  <button
                    onClick={() => {
                      setRole('recruiter');
                      setShowPersonaMenu(false);
                      setActiveView('recruiter-dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors mt-1 ${
                      currentRole === 'recruiter'
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      <span>Recruiter View</span>
                    </div>
                    {currentRole === 'recruiter' && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* Logged in User Profile Dropdown / Login Portal Launcher */}
            <div className="relative">
              {authUser ? (
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-800 transition-all text-xs font-semibold text-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-[11px] text-white shadow-sm">
                    {authUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{authUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={onOpenLoginPortal}
                  className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/25"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Login Portal</span>
                </button>
              )}

              {showUserDropdown && authUser && (
                <div className="absolute right-0 mt-2 w-60 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in duration-150">
                  <div className="border-b border-slate-800/80 pb-2 mb-2">
                    <p className="font-bold text-xs text-white">{authUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{authUser.email}</p>
                    <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 mt-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {authUser.role} Session Active
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenLoginPortal();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center space-x-2 transition-colors mb-1"
                  >
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span>Switch Auth Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 flex items-center space-x-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* ATS Audit Logs Button */}
            <button
              onClick={onOpenAudit}
              title="Inspect ATS Audit Trail & Model Logs"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Privacy & Security Compliance */}
            <button
              onClick={onOpenPrivacy}
              title="Privacy & Bias Protection Controls"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Notifications Button */}
            <button
              onClick={onToggleNotifications}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
