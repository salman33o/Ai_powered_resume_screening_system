import React, { useState } from 'react';
import { AuthUser, UserRole } from '../types';
import { 
  ShieldCheck, 
  Building2, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Eye, 
  EyeOff, 
  BadgeCheck, 
  Check, 
  KeyRound, 
  Smartphone,
  UserCheck,
  Briefcase
} from 'lucide-react';

interface LoginPortalProps {
  onLoginSuccess: (user: AuthUser) => void;
  initialRole?: UserRole;
}

type AuthMode = 'login' | 'register' | 'verify_2fa' | 'forgot';

export const LoginPortal: React.FC<LoginPortalProps> = ({
  onLoginSuccess,
  initialRole = 'candidate',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Recruiter Company Registration Proof State
  const [companyName, setCompanyName] = useState('');
  const [govtRegId, setGovtRegId] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [uploadedGovtDocName, setUploadedGovtDocName] = useState<string | null>(null);
  const [isGovtVerified, setIsGovtVerified] = useState(false);
  const [isVerifyingGovt, setIsVerifyingGovt] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Pre-fill demo credentials
  const prefillCandidate = () => {
    setSelectedRole('candidate');
    setAuthMode('login');
    setEmail('alex.rivera@example.com');
    setPassword('CandidatePass2025!');
    setFullName('Alex Rivera');
    setErrorMsg(null);
  };

  const prefillRecruiter = () => {
    setSelectedRole('recruiter');
    setAuthMode('login');
    setEmail('recruiter@apexanalytics.com');
    setPassword('CorporateSecure2025#');
    setFullName('Sarah Jenkins');
    setCompanyName('Apex Analytics & FinTech Inc.');
    setGovtRegId('EIN-84-2948102-US');
    setIsGovtVerified(true);
    setErrorMsg(null);
  };

  const verifyGovtCredentials = () => {
    if (!companyName || !govtRegId) {
      setErrorMsg('Please enter both Company Legal Name and Government Registration ID.');
      return;
    }
    setIsVerifyingGovt(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsVerifyingGovt(false);
      setIsGovtVerified(true);
      setSuccessMsg(`Government Entity Verified: ${companyName} (${govtRegId}) is in good standing.`);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (authMode === 'login') {
      if (!email || !password) {
        setErrorMsg('Please provide both corporate email and password.');
        return;
      }
    }

    if (authMode === 'register' && selectedRole === 'recruiter') {
      if (!companyName || !govtRegId) {
        setErrorMsg('Mandatory government registration credentials required for corporate recruiter accounts.');
        return;
      }
    }

    if (authMode === 'verify_2fa') {
      if (otpCode !== '829410' && otpCode.length !== 6) {
        setErrorMsg('Invalid 2FA Verification Token. Enter code 829410 for demo session.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (authMode === 'login' && selectedRole === 'recruiter' && !otpCode) {
        setAuthMode('verify_2fa');
        setSuccessMsg('2FA code dispatched to registered corporate domain. Demo OTP: 829410');
        return;
      }

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
    <div className="min-h-screen bg-[#0B1420] flex flex-col justify-center items-center p-4 relative font-sans text-[#E6EAF0]">
      
      <div className="w-full max-w-5xl bg-[#131F30] rounded-lg border border-[#223348] shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left 5 Cols: Brand Feature Showcase */}
        <div className="lg:col-span-5 bg-[#0E1A29] p-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#223348] relative">
          
          <div>
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 rounded bg-[#131F30] border border-[#223348] flex items-center justify-center text-teal-400 font-mono font-bold text-xs">
                ATS
              </div>
              <div>
                <h1 className="font-bold text-xl text-[#E6EAF0] font-display tracking-tight">
                  PrimeATS
                </h1>
                <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#131F30] text-teal-400 border border-[#223348]">
                  Verified ATS Platform
                </span>
              </div>
            </div>

            {/* Value Proposition Items */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded bg-[#131F30] border border-[#223348]">
                <div className="flex items-center space-x-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-[#E6EAF0]">Verified Employer Identity</h4>
                </div>
                <p className="text-[#8A97A8] text-[11px] leading-relaxed">
                  Recruiter and employer profiles require verified organization credentials (EIN / CIN / LLC) to maintain candidate trust and eliminate unverified postings.
                </p>
              </div>

              <div className="p-3 rounded bg-[#131F30] border border-[#223348]">
                <div className="flex items-center space-x-2 mb-1">
                  <BadgeCheck className="w-4 h-4 text-teal-400" />
                  <h4 className="font-bold text-[#E6EAF0]">Deterministic ATS Matrix</h4>
                </div>
                <p className="text-[#8A97A8] text-[11px] leading-relaxed">
                  Deterministic 7-component formula for objective skill matching, keyword coverage, experience evaluation, and explainable audit logs.
                </p>
              </div>

              <div className="p-3 rounded bg-[#131F30] border border-[#223348]">
                <div className="flex items-center space-x-2 mb-1">
                  <Lock className="w-4 h-4 text-teal-300" />
                  <h4 className="font-bold text-[#E6EAF0]">End-to-End Privacy</h4>
                </div>
                <p className="text-[#8A97A8] text-[11px] leading-relaxed">
                  Candidate resume parsing and corporate applicant pipelines run in isolated, encrypted evaluation containers with zero PII score weighting.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials Footer */}
          <div className="mt-6 pt-3.5 border-t border-[#223348] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8] block">
              Direct Sandbox Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={prefillCandidate}
                className="px-2.5 py-1.5 rounded bg-[#131F30] hover:bg-[#17263B] border border-[#223348] text-[#E6EAF0] text-xs font-mono transition-colors text-center cursor-pointer"
              >
                Candidate Demo
              </button>
              <button
                type="button"
                onClick={prefillRecruiter}
                className="px-2.5 py-1.5 rounded bg-[#131F30] hover:bg-[#17263B] border border-[#223348] text-teal-300 text-xs font-mono transition-colors text-center cursor-pointer"
              >
                Recruiter Demo
              </button>
            </div>
          </div>

        </div>

        {/* Right 7 Cols: Authentication & Onboarding Form */}
        <div className="lg:col-span-7 p-7 flex flex-col justify-center bg-[#131F30] max-h-[85vh] overflow-y-auto">
          
          {/* Header Switcher */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#E6EAF0] font-display">
                {authMode === 'login' && 'Sign In to Workspace'}
                {authMode === 'register' && (selectedRole === 'candidate' ? 'Create Candidate Profile' : 'Register Employer Account')}
                {authMode === 'verify_2fa' && 'Two-Factor Authentication'}
                {authMode === 'forgot' && 'Reset Password'}
              </h2>
              
              {authMode !== 'verify_2fa' && (
                <div className="flex items-center bg-[#0E1A29] p-0.5 rounded border border-[#223348]">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      authMode === 'login' ? 'bg-[#17263B] text-[#E6EAF0] border border-[#223348]' : 'text-[#8A97A8] hover:text-[#E6EAF0]'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      authMode === 'register' ? 'bg-[#17263B] text-[#E6EAF0] border border-[#223348]' : 'text-[#8A97A8] hover:text-[#E6EAF0]'
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Role Switcher Pills */}
            {authMode !== 'verify_2fa' && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('candidate')}
                  className={`p-2.5 rounded border text-xs font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
                    selectedRole === 'candidate'
                      ? 'bg-[#17263B] text-teal-300 border-teal-500/40'
                      : 'bg-[#0E1A29] text-[#8A97A8] border-[#223348] hover:text-[#E6EAF0]'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-teal-400" />
                  <span>Job Seeker / Candidate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('recruiter')}
                  className={`p-2.5 rounded border text-xs font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
                    selectedRole === 'recruiter'
                      ? 'bg-[#17263B] text-teal-300 border-teal-500/40'
                      : 'bg-[#0E1A29] text-[#8A97A8] border-[#223348] hover:text-[#E6EAF0]'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-teal-400" />
                  <span>Verified Recruiter</span>
                </button>
              </div>
            )}
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-3.5 p-3 rounded bg-[#0E1A29] border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2 font-mono">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-3.5 p-3 rounded bg-[#0E1A29] border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {authMode === 'verify_2fa' ? (
              <div className="space-y-3 text-center py-2">
                <div className="w-10 h-10 rounded bg-[#0E1A29] border border-[#223348] flex items-center justify-center mx-auto text-teal-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#E6EAF0]">Two-Factor Authorization</h3>
                  <p className="text-[11px] text-[#8A97A8] mt-0.5">
                    Enter the code sent to your registered corporate email to confirm your identity.
                  </p>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="• • • • • •"
                  className="text-center font-mono text-lg tracking-widest w-40 py-2 bg-[#0E1A29] rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 mx-auto block"
                />
                <button
                  type="button"
                  onClick={() => setOtpCode('829410')}
                  className="text-[11px] font-mono text-teal-400 hover:underline cursor-pointer"
                >
                  Auto-fill demo code (829410)
                </button>
              </div>
            ) : (
              <>
                {/* Registration Name Field */}
                {authMode === 'register' && (
                  <div>
                    <label className="text-[11px] font-medium text-[#8A97A8] block mb-1">
                      {selectedRole === 'candidate' ? 'Full Legal Name' : 'Authorized HR / Recruiter Name'}
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[#8A97A8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full pl-9 pr-3 py-2 bg-[#0E1A29] rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                )}

                {/* Recruiter-Specific Mandatory Government Proof Fields */}
                {selectedRole === 'recruiter' && authMode === 'register' && (
                  <div className="p-3.5 rounded bg-[#0E1A29] border border-[#223348] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Corporate Verification</span>
                      </span>
                      {isGovtVerified && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131F30] text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <label className="text-[10px] text-[#8A97A8] block mb-1">Company Legal Entity</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Apex Analytics Inc."
                          className="w-full px-2.5 py-1.5 bg-[#131F30] rounded border border-[#223348] text-xs text-[#E6EAF0] focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#8A97A8] block mb-1">Registration Identifier (EIN/CIN)</label>
                        <input
                          type="text"
                          required
                          value={govtRegId}
                          onChange={(e) => setGovtRegId(e.target.value)}
                          placeholder="e.g. EIN-84-2948102-US"
                          className="w-full px-2.5 py-1.5 bg-[#131F30] rounded border border-[#223348] text-xs font-mono text-[#E6EAF0] focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <label className="text-[10px] text-[#8A97A8] block mb-1">Official Domain</label>
                        <input
                          type="url"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                          placeholder="https://company.com"
                          className="w-full px-2.5 py-1.5 bg-[#131F30] rounded border border-[#223348] text-xs text-[#E6EAF0] focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#8A97A8] block mb-1">HQ Location</label>
                        <input
                          type="text"
                          value={companyLocation}
                          onChange={(e) => setCompanyLocation(e.target.value)}
                          placeholder="San Francisco, CA"
                          className="w-full px-2.5 py-1.5 bg-[#131F30] rounded border border-[#223348] text-xs text-[#E6EAF0] focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* Government Proof Document Upload */}
                    <div className="p-2.5 rounded bg-[#131F30] border border-[#223348] flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3.5 h-3.5 text-teal-400" />
                        <div>
                          <p className="font-medium text-[#E6EAF0] text-[11px]">Incorporation Proof</p>
                          <p className="text-[9px] font-mono text-[#8A97A8]">{uploadedGovtDocName || 'Upload Certificate (PDF/JPG)'}</p>
                        </div>
                      </div>
                      <label className="px-2.5 py-1 bg-[#17263B] hover:bg-[#223348] text-[#E6EAF0] rounded text-xs font-mono border border-[#223348] cursor-pointer">
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
                      className="w-full py-1.5 bg-[#17263B] hover:bg-[#223348] text-teal-300 rounded text-xs font-semibold border border-teal-500/30 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>{isVerifyingGovt ? 'Querying Corporate Database...' : 'Verify Registry Credentials'}</span>
                    </button>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="text-[11px] font-medium text-[#8A97A8] block mb-1">
                    {selectedRole === 'candidate' ? 'Email Address' : 'Corporate Work Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#8A97A8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === 'candidate' ? "name@example.com" : "hr@company.com"}
                      className="w-full pl-9 pr-3 py-2 bg-[#0E1A29] rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-medium text-[#8A97A8]">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[10px] text-teal-400 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#8A97A8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-9 py-2 bg-[#0E1A29] rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A97A8] hover:text-[#E6EAF0] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>
                    {authMode === 'login' && `Access ${selectedRole === 'candidate' ? 'Candidate Console' : 'Verified Recruiter Hub'}`}
                    {authMode === 'register' && `Activate ${selectedRole === 'candidate' ? 'Candidate Profile' : 'Verified Company'}`}
                    {authMode === 'verify_2fa' && 'Verify 2FA & Complete Sign In'}
                    {authMode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};
