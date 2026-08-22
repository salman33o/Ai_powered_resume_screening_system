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
    setPassword('CandidatePass2026!');
    setFullName('Alex Rivera');
    setErrorMsg(null);
  };

  const prefillRecruiter = () => {
    setSelectedRole('recruiter');
    setAuthMode('login');
    setEmail('recruiter@apexanalytics.com');
    setPassword('CorporateSecure2026#');
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
      setSuccessMsg(`Entity Verified: ${companyName} (${govtRegId}) is in good standing.`);
    }, 800);
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
        setErrorMsg('Government registration credentials required for corporate recruiter accounts.');
        return;
      }
    }

    if (authMode === 'verify_2fa') {
      if (otpCode !== '829410' && otpCode.length !== 6) {
        setErrorMsg('Invalid token. Enter demo code 829410.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (authMode === 'login' && selectedRole === 'recruiter' && !otpCode) {
        setAuthMode('verify_2fa');
        setSuccessMsg('2FA code dispatched. Demo OTP: 829410');
        return;
      }

      const mockUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: fullName || (selectedRole === 'candidate' ? 'Alex Rivera' : 'Sarah Jenkins'),
        email,
        role: selectedRole,
        companyName: selectedRole === 'recruiter' ? (companyName || 'Apex Analytics & FinTech Inc.') : undefined,
        token: `jwt_session_${Date.now()}_gov_verified_key`
      };

      onLoginSuccess(mockUser);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md surface-panel p-6 space-y-5">
        
        {/* Brand & Auth Context Header */}
        <div className="border-b border-[var(--border)] pb-4 text-center space-y-1">
          <div className="inline-flex items-center space-x-2 text-[var(--accent)] font-mono font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span className="tracking-wider uppercase">Enterprise Authentication</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] font-display tracking-tight">
            PrimeATS Portal
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono">
            Deterministic evaluation & recruitment management
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 surface-subtle rounded border border-[var(--border)] font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('candidate');
              setErrorMsg(null);
            }}
            className={`py-1.5 rounded font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
              selectedRole === 'candidate'
                ? 'bg-[var(--surface)] text-[var(--text-primary)] font-bold border border-[var(--border-strong)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Candidate</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('recruiter');
              setErrorMsg(null);
            }}
            className={`py-1.5 rounded font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
              selectedRole === 'recruiter'
                ? 'bg-[var(--surface)] text-[var(--text-primary)] font-bold border border-[var(--border-strong)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Recruiter</span>
          </button>
        </div>

        {/* Quick Demo Autofill Bar */}
        <div className="surface-subtle p-2.5 rounded border border-[var(--border)] flex items-center justify-between text-xs font-mono">
          <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Quick Demo:</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={prefillCandidate}
              className="px-2 py-0.5 rounded surface-panel hover:bg-[var(--surface-raised)] text-[10.5px] text-[var(--text-secondary)] transition-colors cursor-pointer"
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={prefillRecruiter}
              className="px-2 py-0.5 rounded surface-panel hover:bg-[var(--surface-raised)] text-[10.5px] text-[var(--text-secondary)] transition-colors cursor-pointer"
            >
              Recruiter (Verified)
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-2.5 rounded surface-subtle border border-[var(--danger)] text-xs text-[var(--danger)] font-mono flex items-center space-x-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 rounded surface-subtle border border-[var(--success)] text-xs text-[var(--success)] font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {authMode === 'register' && (
            <div className="space-y-1">
              <label className="block text-[10.5px] font-mono text-[var(--text-secondary)]">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full bg-[var(--surface-subtle)] p-2 rounded border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--focus)] font-sans"
              />
            </div>
          )}

          {authMode !== 'verify_2fa' ? (
            <>
              <div className="space-y-1">
                <label className="block text-[10.5px] font-mono text-[var(--text-secondary)]">Corporate / Personal Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-[var(--surface-subtle)] pl-8 pr-3 py-2 rounded border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--focus)] font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10.5px] font-mono">
                  <label className="text-[var(--text-secondary)]">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[var(--surface-subtle)] pl-8 pr-8 py-2 rounded border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--focus)] font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Recruiter Verification Verification Box */}
              {selectedRole === 'recruiter' && authMode === 'register' && (
                <div className="surface-subtle p-3 rounded border border-[var(--border)] space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Corporate Entity Verification</span>
                    <span className={`text-[10px] font-bold ${isGovtVerified ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
                      {isGovtVerified ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-0.5">Company Legal Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Apex Analytics & FinTech Inc."
                      className="w-full bg-[var(--surface)] p-1.5 rounded border border-[var(--border)] text-[var(--text-primary)] text-xs font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-0.5">Government Registration / EIN ID</label>
                    <input
                      type="text"
                      value={govtRegId}
                      onChange={(e) => setGovtRegId(e.target.value)}
                      placeholder="EIN-84-2948102-US"
                      className="w-full bg-[var(--surface)] p-1.5 rounded border border-[var(--border)] text-[var(--text-primary)] text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={verifyGovtCredentials}
                    disabled={isVerifyingGovt || isGovtVerified}
                    className="w-full py-1.5 rounded surface-panel hover:bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isVerifyingGovt ? 'Verifying Registry...' : isGovtVerified ? 'Verified Entity' : 'Validate Legal Entity'}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* 2FA Token Verification */
            <div className="surface-subtle p-4 rounded border border-[var(--border)] space-y-2 text-center font-mono">
              <KeyRound className="w-6 h-6 text-[var(--accent)] mx-auto mb-1" />
              <h3 className="font-bold text-xs text-[var(--text-primary)]">Two-Factor Authentication Token</h3>
              <p className="text-[11px] text-[var(--text-muted)] font-sans">
                Enter the 6-digit cryptographic token dispatched to your device. (Demo: <strong>829410</strong>)
              </p>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="829410"
                className="w-full bg-[var(--surface)] p-2 rounded border border-[var(--border)] text-center text-base tracking-widest font-bold text-[var(--accent)] focus:outline-none focus:border-[var(--focus)]"
              />
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary text-xs py-2 mt-2"
          >
            <span>{isLoading ? 'Authenticating...' : authMode === 'login' ? 'Authenticate Session' : authMode === 'verify_2fa' ? 'Verify Token' : 'Register Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Mode Toggle Footer */}
        <div className="pt-2 border-t border-[var(--border)] text-center font-mono text-xs">
          {authMode === 'login' ? (
            <p className="text-[var(--text-muted)]">
              Need access?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMsg(null); }}
                className="text-[var(--accent)] hover:underline font-bold"
              >
                Register Entity
              </button>
            </p>
          ) : (
            <p className="text-[var(--text-muted)]">
              Existing credentials?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(null); }}
                className="text-[var(--accent)] hover:underline font-bold"
              >
                Authenticate Here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
