import React, { useState } from 'react';
import { UserRole, AuthUser } from '../types';
import { 
  Sparkles, 
  UserCheck, 
  Briefcase, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Zap,
  KeyRound,
  Layers,
  FileSearch,
  Bot
} from 'lucide-react';

interface LoginPortalProps {
  onLoginSuccess: (user: AuthUser) => void;
  initialRole?: UserRole;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  onLoginSuccess,
  initialRole = 'candidate'
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Pre-fill demo credentials
  const prefillCandidate = () => {
    setSelectedRole('candidate');
    setEmail('alex.rivera.analyst@example.com');
    setPassword('CandidatePass2026!');
    setFullName('Alex Rivera');
    setErrorMsg(null);
  };

  const prefillRecruiter = () => {
    setSelectedRole('recruiter');
    setEmail('recruiter@apexanalytics.com');
    setPassword('RecruiterPass2026!');
    setFullName('Sarah Jenkins');
    setCompanyName('Apex Analytics & FinTech');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (authMode === 'forgot') {
      if (!email.trim()) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMsg(`Password reset instructions sent to ${email}. Please check your inbox.`);
      }, 1000);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please complete all required email and password fields.');
      return;
    }

    if (authMode === 'register' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    // Simulate backend JWT authentication API response
    setTimeout(() => {
      setIsLoading(false);
      const mockUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: fullName || (selectedRole === 'candidate' ? 'Alex Rivera' : 'Sarah Jenkins'),
        email,
        role: selectedRole,
        companyName: selectedRole === 'recruiter' ? (companyName || 'Apex Analytics') : undefined,
        token: `jwt_session_${Date.now()}_secure_ats_key`
      };

      onLoginSuccess(mockUser);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left 5 Cols: Brand Feature Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">PrimeATS</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 ml-2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Enterprise v2.6
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Advanced Resume & ATS Platform</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white leading-tight">
                  Explainable AI & Deterministic Screening Engine
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Bridge candidates and recruiters with verifiable skill evidence, objective 7-factor scoring, and zero algorithmic hallucination.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <FileSearch className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">7-Factor ATS Match Score</h4>
                    <p className="text-[11px] text-slate-400">Skills, experience, responsibilities, projects, and keywords with full evidence trails.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <Layers className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Bulk Screening Engine</h4>
                    <p className="text-[11px] text-slate-400">Process up to 400 resumes in parallel worker threads with real-time analytics.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <Bot className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Truthful Optimizer & Interview AI</h4>
                    <p className="text-[11px] text-slate-400">Zero fabrication resume optimizer and candidate interview question generator.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bias Protection & SAIF Compliant</span>
            </span>
            <span>Google Play Ready</span>
          </div>
        </div>

        {/* Right 7 Cols: Auth Form Portal */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-between">
          <div>
            
            {/* Header Tabs: Sign In / Create Account */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`text-sm font-bold pb-2 transition-colors relative ${
                    authMode === 'login'
                      ? 'text-white border-b-2 border-indigo-500'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`text-sm font-bold pb-2 transition-colors relative ${
                    authMode === 'register'
                      ? 'text-white border-b-2 border-indigo-500'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <span className="text-xs text-slate-400">Access Console</span>
            </div>

            {/* Role Selection Switcher */}
            {authMode !== 'forgot' && (
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Select User Role Persona
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('candidate')}
                    className={`p-3 rounded-2xl border flex items-center space-x-3 transition-all ${
                      selectedRole === 'candidate'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${selectedRole === 'candidate' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold">Candidate</p>
                      <p className="text-[10px] text-slate-400">Job Seeker / CV Builder</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('recruiter')}
                    className={`p-3 rounded-2xl border flex items-center space-x-3 transition-all ${
                      selectedRole === 'recruiter'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${selectedRole === 'recruiter' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold">Recruiter</p>
                      <p className="text-[10px] text-slate-400">HR Lead / Bulk Screener</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Error or Success Banners */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-center space-x-2">
                <span className="font-bold">Error:</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name for Registration */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Alex Rivera"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Company Name for Recruiter Registration */}
              {authMode === 'register' && selectedRole === 'recruiter' && (
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Company / Organization</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Apex Analytics & FinTech"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}
              {authMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs text-slate-300 font-medium">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setErrorMsg(null);
                          setSuccessMsg(null);
                        }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me Checkbox */}
              {authMode === 'login' && (
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-indigo-500 cursor-pointer"
                    />
                    <span>Remember this session</span>
                  </label>
                  <span className="text-[11px] text-slate-500">JWT OAuth2 Protected</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span className="animate-pulse">Authenticating JWT Token...</span>
                ) : (
                  <>
                    <span>
                      {authMode === 'login' ? 'Sign In to Platform' : authMode === 'register' ? 'Register New Account' : 'Send Password Reset Link'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick One-Click Demo Logins for Instant Testing */}
            <div className="mt-6 pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>One-Click Instant Demo Login</span>
                </span>
                <span className="text-[10px] text-slate-500">Pre-filled credentials</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={prefillCandidate}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/70 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-indigo-300 flex items-center justify-between">
                    <span>Alex Rivera</span>
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Candidate Persona (Data Analyst)</p>
                </button>

                <button
                  type="button"
                  onClick={prefillRecruiter}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/70 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center justify-between">
                    <span>Sarah Jenkins</span>
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Recruiter Persona (HR Lead)</p>
                </button>
              </div>
            </div>

          </div>

          <div className="mt-6 text-center text-[11px] text-slate-500">
            By signing in, you agree to our Terms of Service & Bias Protection Policy.
          </div>
        </div>

      </div>

    </div>
  );
};
