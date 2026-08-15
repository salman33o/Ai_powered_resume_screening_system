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
  FileCheck,
  UploadCloud,
  FileText,
  BadgeCheck,
  Check,
  AlertTriangle,
  Globe,
  MapPin,
  Smartphone
} from 'lucide-react';

interface LoginPortalProps {
  onLoginSuccess: (user: AuthUser) => void;
  initialRole?: UserRole;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  onLoginSuccess,
  initialRole = 'candidate'
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'verify_2fa'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Common Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Recruiter / Enterprise Company Verification Fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('https://apexanalytics.com');
  const [companyLocation, setCompanyLocation] = useState('San Francisco, CA, USA');
  const [govtRegId, setGovtRegId] = useState('U72200MH2020PTC345678');
  const [govtAuthority, setGovtAuthority] = useState('Ministry of Corporate Affairs / US SEC');
  const [uploadedGovtDocName, setUploadedGovtDocName] = useState<string | null>('Certificate_of_Incorporation_2026.pdf');
  const [isGovtVerified, setIsGovtVerified] = useState<boolean>(true);
  const [isVerifyingGovt, setIsVerifyingGovt] = useState(false);

  // 2FA OTP state
  const [otpCode, setOtpCode] = useState('');

  // Demo auto-fill helpers
  const prefillCandidate = () => {
    setSelectedRole('candidate');
    setAuthMode('login');
    setEmail('alex.rivera.analyst@example.com');
    setPassword('CandidatePass2026!');
    setFullName('Alex Rivera');
    setErrorMsg(null);
  };

  const prefillRecruiter = () => {
    setSelectedRole('recruiter');
    setAuthMode('login');
    setEmail('sarah.jenkins@apexanalytics.com');
    setPassword('RecruiterSecure2026!');
    setFullName('Sarah Jenkins');
    setCompanyName('Apex Analytics & FinTech Inc.');
    setCompanyWebsite('https://apexanalytics.com');
    setCompanyLocation('San Francisco, CA, USA');
    setGovtRegId('EIN-84-2948102-US');
    setGovtAuthority('US Delaware Division of Corporations & SEC');
    setUploadedGovtDocName('State_Incorporation_Filing_Apex.pdf');
    setIsGovtVerified(true);
    setErrorMsg(null);
  };

  const verifyGovtCredentials = () => {
    if (!govtRegId.trim() || !companyName.trim()) {
      setErrorMsg('Please enter Company Name and Government Registration ID before verifying.');
      return;
    }
    setIsVerifyingGovt(true);
    setErrorMsg(null);
    setTimeout(() => {
      setIsVerifyingGovt(false);
      setIsGovtVerified(true);
      setSuccessMsg(`Government Registry Authenticated: Entity active & in good legal standing.`);
    }, 1200);
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
        setSuccessMsg(`Password reset instructions dispatched to ${email}.`);
      }, 900);
      return;
    }

    if (authMode === 'verify_2fa') {
      if (!otpCode.trim() || otpCode.length < 4) {
        setErrorMsg('Please enter a valid 6-digit 2FA security code.');
        return;
      }
      completeLogin();
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please fill in your email and password.');
      return;
    }

    if (authMode === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Please provide your full legal name.');
        return;
      }
      if (selectedRole === 'recruiter') {
        if (!companyName.trim() || !govtRegId.trim()) {
          setErrorMsg('Company Name and Government Business Registration ID are mandatory for verified recruiter onboarding.');
          return;
        }
        if (!isGovtVerified) {
          setErrorMsg('Please complete government verification check before proceeding.');
          return;
        }
      }
    }

    setIsLoading(true);

    // If recruiter registration or high-security mode, require 2FA OTP simulation
    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'recruiter' && authMode === 'register') {
        setAuthMode('verify_2fa');
        setSuccessMsg(`Security OTP dispatched to corporate email: ${email}`);
      } else {
        completeLogin();
      }
    }, 800);
  };

  const completeLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const mockUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: fullName || (selectedRole === 'candidate' ? 'Alex Rivera' : 'Sarah Jenkins'),
        email,
        role: selectedRole,
        companyName: selectedRole === 'recruiter' ? (companyName || 'Apex Analytics & FinTech Inc.') : undefined,
        token: `jwt_session_${Date.now()}_gov_verified_prime_key`
      };

      onLoginSuccess(mockUser);
    }, 600);
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
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-2xl text-white font-display tracking-tight">
                  PrimeATS
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Government & SOC-2 Verified
                </span>
              </div>
            </div>

            {/* Value Proposition Items */}
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Government-Verified Companies</h4>
                  <p className="text-slate-400 mt-0.5 text-[11px]">
                    Every recruiter and company account requires legal incorporation registration (EIN/CIN/LLC) to eliminate ghost jobs and fraud.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <BadgeCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Deterministic 7-Factor ATS</h4>
                  <p className="text-slate-400 mt-0.5 text-[11px]">
                    Zero-hallucination resume scoring, skill ontologies, and direct candidate-company 2-way messaging.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">256-Bit TLS & 2FA Auth</h4>
                  <p className="text-slate-400 mt-0.5 text-[11px]">
                    Candidate resumes and corporate applicant data protected by end-to-end encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials Footer */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Quick 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={prefillCandidate}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 text-indigo-300 hover:text-white text-xs font-bold transition-all text-center cursor-pointer"
              >
                Candidate Profile
              </button>
              <button
                type="button"
                onClick={prefillRecruiter}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-emerald-300 hover:text-white text-xs font-bold transition-all text-center cursor-pointer"
              >
                Verified Recruiter
              </button>
            </div>
          </div>

        </div>

        {/* Right 7 Cols: Authentication & Onboarding Form */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-center bg-slate-900/60 max-h-[85vh] overflow-y-auto custom-scrollbar">
          
          {/* Header Switcher */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {authMode === 'login' && 'Sign In to Your Workspace'}
                {authMode === 'register' && (selectedRole === 'candidate' ? 'Create Candidate Account' : 'Register Verified Employer')}
                {authMode === 'verify_2fa' && 'Two-Factor OTP Security Gate'}
                {authMode === 'forgot' && 'Reset Secure Password'}
              </h2>
              
              {authMode !== 'verify_2fa' && (
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      authMode === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      authMode === 'register' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Role Switcher Pills */}
            {authMode !== 'verify_2fa' && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole('candidate')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    selectedRole === 'candidate'
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Job Seeker / Candidate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('recruiter')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    selectedRole === 'recruiter'
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Company / Employer Side</span>
                </button>
              </div>
            )}
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {authMode === 'verify_2fa' ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-14 h-14 rounded-3xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Enter 6-Digit Authenticator Code</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the code sent to your registered corporate email to confirm your identity.
                  </p>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="• • • • • •"
                  className="text-center font-mono text-xl tracking-widest w-48 py-3 bg-slate-950 rounded-2xl border border-slate-800 text-white focus:outline-none focus:border-purple-500 mx-auto block"
                />
                <button
                  type="button"
                  onClick={() => setOtpCode('829410')}
                  className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                >
                  Auto-fill demo code (829410)
                </button>
              </div>
            ) : (
              <>
                {/* Registration Name Field */}
                {authMode === 'register' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {selectedRole === 'candidate' ? 'Full Legal Name' : 'Authorized HR / Recruiter Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Recruiter-Specific Mandatory Government Proof Fields */}
                {selectedRole === 'recruiter' && authMode === 'register' && (
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Mandatory Government Verification</span>
                      </span>
                      {isGovtVerified && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Govt Validated</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400 font-semibold block mb-1">Company Legal Name</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Apex Analytics & FinTech Inc."
                          className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 font-semibold block mb-1">Govt Registration ID (EIN / CIN / LLC)</label>
                        <input
                          type="text"
                          required
                          value={govtRegId}
                          onChange={(e) => setGovtRegId(e.target.value)}
                          placeholder="e.g. EIN-84-2948102-US"
                          className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400 font-semibold block mb-1">Official Company Website</label>
                        <input
                          type="url"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                          placeholder="https://yourcompany.com"
                          className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 font-semibold block mb-1">Headquarters Location</label>
                        <input
                          type="text"
                          value={companyLocation}
                          onChange={(e) => setCompanyLocation(e.target.value)}
                          placeholder="San Francisco, CA"
                          className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Government Proof Document Upload */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="font-bold text-white">Incorporation Certificate Proof</p>
                          <p className="text-[10px] text-slate-400">{uploadedGovtDocName || 'Upload Certificate of Incorporation (PDF/JPG)'}</p>
                        </div>
                      </div>
                      <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer">
                        <span>{uploadedGovtDocName ? 'Replace' : 'Upload'}</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setUploadedGovtDocName(e.target.files[0].name);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Verify Button */}
                    <button
                      type="button"
                      onClick={verifyGovtCredentials}
                      disabled={isVerifyingGovt}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isVerifyingGovt ? 'Querying Corporate Affairs Database...' : 'Verify Government Registry Credentials'}</span>
                    </button>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {selectedRole === 'candidate' ? 'Email Address' : 'Corporate Work Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === 'candidate' ? "name@example.com" : "hr@company.com"}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-bold rounded-2xl text-xs transition-all shadow-xl flex items-center justify-center space-x-2 cursor-pointer ${
                selectedRole === 'candidate'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/25'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/25'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating Credentials...</span>
                </>
              ) : (
                <>
                  <span>
                    {authMode === 'login' && `Access ${selectedRole === 'candidate' ? 'Candidate Portal' : 'Verified Recruiter Hub'}`}
                    {authMode === 'register' && `Register & Activate ${selectedRole === 'candidate' ? 'Candidate Profile' : 'Verified Company'}`}
                    {authMode === 'verify_2fa' && 'Verify 2FA & Complete Sign In'}
                    {authMode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};
