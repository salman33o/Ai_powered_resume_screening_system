import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  UserRole, 
  StructuredResume, 
  JobRequirement, 
  ATSScoreBreakdown, 
  PipelineCandidate, 
  ATSAuditRecord,
  CandidateApplication,
  AuthUser
} from './types';
import { 
  SAMPLE_JOBS, 
  SAMPLE_CANDIDATE_RESUMES, 
  generateInitialCandidateApplications,
  INITIAL_AUDIT_LOGS 
} from './lib/mockData';
import { evaluateResumeAgainstJob } from './lib/atsEngine';
import { analyzeResumeApi } from './services/apiClient';
import { exportATSReportPDF, exportResumePDF } from './lib/pdfExport';

// Global Navigation & Framework
import { Navbar } from './components/Navbar';
import { AndroidFrame } from './components/AndroidFrame';
import { LoginPortal } from './components/LoginPortal';

// Candidate Views
import { CandidateDashboard } from './components/candidate/CandidateDashboard';
import { ResumeAnalyzer } from './components/candidate/ResumeAnalyzer';
import { ResumeOptimizer } from './components/candidate/ResumeOptimizer';
import { ResumeBuilder } from './components/candidate/ResumeBuilder';
import { ResumeVersions } from './components/candidate/ResumeVersions';
import { CareerSkillGap } from './components/candidate/CareerSkillGap';
import { AIInterviewPrep } from './components/candidate/AIInterviewPrep';
import { JobTracker } from './components/candidate/JobTracker';

// Recruiter Views
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { BulkScreening } from './components/recruiter/BulkScreening';
import { CandidateRanking } from './components/recruiter/CandidateRanking';
import { CandidateComparison } from './components/recruiter/CandidateComparison';
import { CandidatePipeline } from './components/recruiter/CandidatePipeline';
import { JobManager } from './components/recruiter/JobManager';
import { RecruiterAnalytics } from './components/recruiter/RecruiterAnalytics';

// Icons
import { 
  Home, 
  FileSearch, 
  Wand2, 
  FileText, 
  Layers, 
  TrendingUp, 
  Bot, 
  Briefcase, 
  Users, 
  BarChart3, 
  Sliders, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Clock, 
  Eye, 
  Star, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // --- Core State ---
  const [role, setRole] = useState<UserRole>('candidate');
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeView, setActiveView] = useState<string>('candidate-dashboard');

  // Auth User State
  const [authUser, setAuthUser] = useState<AuthUser | null>({
    id: 'usr-1',
    name: 'Alex Rivera',
    email: 'alex.rivera.analyst@example.com',
    role: 'candidate',
    companyName: 'Apex Analytics',
    token: 'jwt_demo_session_candidate'
  });
  const [showLoginPortalModal, setShowLoginPortalModal] = useState(false);

  // Jobs & Resumes
  const [jobs, setJobs] = useState<JobRequirement[]>(SAMPLE_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobRequirement>(SAMPLE_JOBS[0]);
  
  const [resumes, setResumes] = useState<StructuredResume[]>(SAMPLE_CANDIDATE_RESUMES);
  const [selectedResume, setSelectedResume] = useState<StructuredResume>(SAMPLE_CANDIDATE_RESUMES[0]);

  // Live ATS Analysis for current Candidate + Job
  const [analysis, setAnalysis] = useState<ATSScoreBreakdown>(() => 
    evaluateResumeAgainstJob(SAMPLE_CANDIDATE_RESUMES[0], SAMPLE_JOBS[0])
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Recruiter Candidates Pipeline
  const [candidates, setCandidates] = useState<PipelineCandidate[]>(() => {
    const apps = generateInitialCandidateApplications();
    return apps.map(c => ({
      ...c,
      atsScore: evaluateResumeAgainstJob(c.resume, SAMPLE_JOBS[0])
    }));
  });

  // Comparison & Modal States
  const [comparisonCandidates, setComparisonCandidates] = useState<PipelineCandidate[]>([]);
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState<PipelineCandidate | null>(null);
  
  // Audit Trail & Privacy Modals
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<ATSAuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'ATS Scan Completed',
      desc: 'Alex Rivera scored 89% against Senior Data Analyst.',
      time: '5m ago',
      unread: true
    },
    {
      id: 'notif-2',
      title: 'New Candidate Applied',
      desc: 'David Kim submitted a verified Power BI resume profile.',
      time: '30m ago',
      unread: true
    },
    {
      id: 'notif-3',
      title: 'Scoring Engine Updated',
      desc: 'Deterministic weights calibrated with 7-factor explainability.',
      time: '2h ago',
      unread: false
    }
  ]);

  // Re-run ATS scoring when candidate resume or target job changes
  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeResumeApi(selectedResume, selectedJob);
      setAnalysis(result);
    } catch (e) {
      console.warn('Analysis fallback:', e);
      setAnalysis(evaluateResumeAgainstJob(selectedResume, selectedJob));
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedResume, selectedJob]);

  // Trigger analysis when resume or job changes
  useEffect(() => {
    runAnalysis();
  }, [selectedResume.id, selectedJob.id, runAnalysis]);

  // Update candidate pipeline scores when active job changes
  useEffect(() => {
    setCandidates(prev => prev.map(c => ({
      ...c,
      atsScore: evaluateResumeAgainstJob(c.resume, selectedJob)
    })));
  }, [selectedJob]);

  // Candidate Navigation Items
  const candidateNavItems = [
    { id: 'candidate-dashboard', label: 'Overview', icon: Home, badge: `${analysis.overallScore}%` },
    { id: 'resume-analyzer', label: 'ATS Evidence Scan', icon: FileSearch },
    { id: 'resume-optimizer', label: 'Resume Optimizer', icon: Wand2 },
    { id: 'resume-builder', label: 'ATS Resume Builder', icon: FileText },
    { id: 'resume-versions', label: 'Multi-Versions', icon: Layers },
    { id: 'career-skill-gap', label: 'Skill Gap & Roadmap', icon: TrendingUp },
    { id: 'ai-interview', label: 'AI Interview Prep', icon: Bot },
    { id: 'job-tracker', label: 'Job Tracker', icon: Briefcase },
  ];

  // Recruiter Navigation Items
  const recruiterNavItems = [
    { id: 'recruiter-dashboard', label: 'Recruiter Console', icon: Home },
    { id: 'recruiter-bulk', label: 'High-Speed Bulk Screen', icon: Layers, badge: '500/s' },
    { id: 'candidate-ranking', label: 'Candidate Ranking', icon: Users },
    { id: 'candidate-pipeline', label: 'Hiring Pipeline', icon: Briefcase, badge: `${candidates.length}` },
    { id: 'job-manager', label: 'Job Requirements', icon: Sliders },
    { id: 'recruiter-analytics', label: 'Recruitment Analytics', icon: BarChart3 },
  ];

  const currentNavItems = role === 'candidate' ? candidateNavItems : recruiterNavItems;

  // Handle switching view safely
  const handleSelectView = (view: string) => {
    setActiveView(view);
  };

  // Launch Candidate Comparison from ranking
  const handleOpenComparison = (list: PipelineCandidate[]) => {
    setComparisonCandidates(list);
    setActiveView('candidate-comparison');
  };

  // When bulk screening finishes, update candidate list
  const handleScreeningComplete = (newCandidates: PipelineCandidate[]) => {
    setCandidates(newCandidates);
    // Add audit log
    const newLog: ATSAuditRecord = {
      id: `audit-${Date.now()}`,
      candidateName: `Batch (${newCandidates.length} Resumes)`,
      jobTitle: selectedJob.title,
      overallScore: Math.round(newCandidates.reduce((acc, c) => acc + c.atsScore.overallScore, 0) / newCandidates.length),
      confidenceScore: 95,
      breakdown: {
        skills: 88,
        experience: 85,
        responsibilities: 80,
        projects: 78,
        education: 90
      },
      modelVersion: 'ATS-Hybrid-v2.6',
      scoringVersion: 'Deterministic-Evidence-v1.4',
      timestamp: new Date().toISOString(),
      extractionQuality: 'high (High-throughput batch parser)',
      reviewerDecision: 'Automated Batch Ingestion Complete',
      reviewerNotes: `Screened ${newCandidates.length} resumes in high-speed worker pool.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setActiveView('candidate-ranking');
  };

  // Render the active view component
  const renderActiveView = () => {
    // Candidate Views
    if (role === 'candidate') {
      switch (activeView) {
        case 'candidate-dashboard':
          return (
            <CandidateDashboard
              resume={selectedResume}
              job={selectedJob}
              analysis={analysis}
              setActiveView={handleSelectView}
              onOpenReport={() => exportATSReportPDF(selectedResume, selectedJob, analysis)}
            />
          );
        case 'resume-analyzer':
          return (
            <ResumeAnalyzer
              resume={selectedResume}
              setResume={setSelectedResume}
              job={selectedJob}
              setJob={setSelectedJob}
              allJobs={jobs}
              analysis={analysis}
              onReAnalyze={runAnalysis}
              isAnalyzing={isAnalyzing}
              onOpenReport={() => exportATSReportPDF(selectedResume, selectedJob, analysis)}
              setActiveView={handleSelectView}
            />
          );
        case 'resume-optimizer':
          return (
            <ResumeOptimizer
              resume={selectedResume}
              setResume={setSelectedResume}
              job={selectedJob}
              analysis={analysis}
              onReAnalyze={runAnalysis}
            />
          );
        case 'resume-builder':
          return (
            <ResumeBuilder
              resume={selectedResume}
              setResume={setSelectedResume}
              targetJob={selectedJob}
              onReAnalyze={runAnalysis}
            />
          );
        case 'resume-versions':
          return (
            <ResumeVersions
              resumes={resumes}
              selectedResume={selectedResume}
              setSelectedResume={setSelectedResume}
              targetJob={selectedJob}
              onReAnalyze={runAnalysis}
            />
          );
        case 'career-skill-gap':
          return (
            <CareerSkillGap
              resume={selectedResume}
              job={selectedJob}
              analysis={analysis}
              setActiveView={handleSelectView}
            />
          );
        case 'ai-interview':
          return (
            <AIInterviewPrep
              resume={selectedResume}
              job={selectedJob}
            />
          );
        case 'job-tracker':
          return (
            <JobTracker
              jobs={jobs}
              resume={selectedResume}
              onSelectJob={(job) => {
                setSelectedJob(job);
                setActiveView('candidate-dashboard');
              }}
              setActiveView={handleSelectView}
            />
          );
        default:
          return (
            <CandidateDashboard
              resume={selectedResume}
              job={selectedJob}
              analysis={analysis}
              setActiveView={handleSelectView}
              onOpenReport={() => exportATSReportPDF(selectedResume, selectedJob, analysis)}
            />
          );
      }
    }

    // Recruiter Views
    if (role === 'recruiter') {
      switch (activeView) {
        case 'recruiter-dashboard':
          return (
            <RecruiterDashboard
              candidates={candidates}
              activeJob={selectedJob}
              setActiveView={handleSelectView}
              onSelectCandidate={(c) => setSelectedCandidateDetail(c)}
            />
          );
        case 'recruiter-bulk':
          return (
            <BulkScreening
              activeJob={selectedJob}
              onScreeningComplete={handleScreeningComplete}
              setActiveView={handleSelectView}
            />
          );
        case 'candidate-ranking':
          return (
            <CandidateRanking
              candidates={candidates}
              activeJob={selectedJob}
              onSelectCandidate={(c) => setSelectedCandidateDetail(c)}
              onOpenComparison={handleOpenComparison}
              onOpenAudit={() => setShowAuditModal(true)}
            />
          );
        case 'candidate-comparison':
          return (
            <CandidateComparison
              candidates={comparisonCandidates.length > 0 ? comparisonCandidates : candidates.slice(0, 3)}
              activeJob={selectedJob}
              onBack={() => setActiveView('candidate-ranking')}
              onSelectCandidate={(c) => setSelectedCandidateDetail(c)}
            />
          );
        case 'candidate-pipeline':
          return (
            <CandidatePipeline
              candidates={candidates}
              setCandidates={setCandidates}
              activeJob={selectedJob}
              onSelectCandidate={(c) => setSelectedCandidateDetail(c)}
            />
          );
        case 'job-manager':
          return (
            <JobManager
              jobs={jobs}
              setJobs={setJobs}
              selectedJob={selectedJob}
              setSelectedJob={setSelectedJob}
              onJobChanged={runAnalysis}
            />
          );
        case 'recruiter-analytics':
          return (
            <RecruiterAnalytics
              candidates={candidates}
              activeJob={selectedJob}
            />
          );
        default:
          return (
            <RecruiterDashboard
              candidates={candidates}
              activeJob={selectedJob}
              setActiveView={handleSelectView}
              onSelectCandidate={(c) => setSelectedCandidateDetail(c)}
            />
          );
      }
    }

    return null;
  };

  // If user is unauthenticated or explicitly opened Login Portal modal
  if (!authUser || showLoginPortalModal) {
    return (
      <LoginPortal
        onLoginSuccess={(user) => {
          setAuthUser(user);
          setRole(user.role);
          setActiveView(user.role === 'candidate' ? 'candidate-dashboard' : 'recruiter-dashboard');
          setShowLoginPortalModal(false);
        }}
        initialRole={role}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Main Navigation */}
      <Navbar
        currentRole={role}
        setRole={(newRole) => {
          setRole(newRole);
          setActiveView(newRole === 'candidate' ? 'candidate-dashboard' : 'recruiter-dashboard');
        }}
        isMobileView={isMobileView}
        setIsMobileView={setIsMobileView}
        activeView={activeView}
        setActiveView={handleSelectView}
        resumes={resumes}
        selectedResume={selectedResume}
        setSelectedResume={(r) => {
          setSelectedResume(r);
        }}
        jobs={jobs}
        selectedJob={selectedJob}
        setSelectedJob={(j) => {
          setSelectedJob(j);
        }}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenAudit={() => setShowAuditModal(true)}
        unreadNotifications={notifications.filter(n => n.unread).length}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
        authUser={authUser}
        onLogout={() => {
          setAuthUser(null);
          setShowLoginPortalModal(true);
        }}
        onOpenLoginPortal={() => setShowLoginPortalModal(true)}
      />

      {/* Main Content Body */}
      {isMobileView ? (
        // Android Phone Frame (Pixel 8 / Material 3 Simulation)
        <main className="flex-1 flex items-center justify-center p-4">
          <AndroidFrame
            currentRole={role}
            activeView={activeView}
            setActiveView={handleSelectView}
          >
            {renderActiveView()}
          </AndroidFrame>
        </main>
      ) : (
        // Standard Desktop Console Layout
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Desktop Left Sidebar Navigation */}
            <aside className="lg:col-span-3 space-y-4 sticky top-20">
              
              {/* Profile / Persona Summary Card */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
                    role === 'candidate' 
                      ? 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/20' 
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20'
                  }`}>
                    {role === 'candidate' ? selectedResume.fullName.charAt(0) : 'HR'}
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="text-xs font-bold text-white truncate">
                      {role === 'candidate' ? selectedResume.fullName : 'Lead Talent Partner'}
                    </h2>
                    <p className="text-[11px] text-slate-400 truncate">
                      {role === 'candidate' ? selectedResume.versionName.split('—')[1]?.trim() || selectedResume.location : selectedJob.company}
                    </p>
                  </div>
                </div>

                {/* Active Match Badge */}
                <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Role:</span>
                  <span className="font-semibold text-white truncate max-w-[130px]" title={selectedJob.title}>
                    {selectedJob.title}
                  </span>
                </div>

                {role === 'candidate' && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">ATS Score:</span>
                    <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      {analysis.overallScore}% ({analysis.confidenceScore}% conf)
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Menu Links */}
              <nav className="bg-slate-900/90 rounded-2xl p-2.5 border border-slate-800 shadow-md space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {role === 'candidate' ? 'Candidate Modules' : 'Recruitment Operations'}
                </div>
                {currentNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectView(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions Card */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Utilities
                </p>
                <button
                  onClick={() => exportATSReportPDF(selectedResume, selectedJob, analysis)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download Score PDF</span>
                </button>
                <button
                  onClick={() => exportResumePDF(selectedResume)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export ATS Resume</span>
                </button>
                <button
                  onClick={() => setShowAuditModal(true)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Explainability Audit</span>
                </button>
              </div>

            </aside>

            {/* Right Main Dashboard / Module Area */}
            <main className="lg:col-span-9">
              {renderActiveView()}
            </main>

          </div>
        </div>
      )}

      {/* --- AUDIT TRAIL MODAL --- */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">ATS Algorithm Audit & Model Governance Log</h3>
                  <p className="text-xs text-slate-400">Verifiable deterministic calculations, confidence indices, and OCR fidelity</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold text-white">Current Model Version:</span>
                  <span className="font-mono text-indigo-400">{analysis.modelVersion}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold text-white">Scoring Protocol:</span>
                  <span className="font-mono text-cyan-400">{analysis.scoringEngineVersion}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold text-white">Bias Protection:</span>
                  <span className="text-emerald-400 font-medium">Active (Zero PII weighting, EEOC compliant)</span>
                </div>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-4">
                Recent Audit Trail Events
              </h4>

              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{log.candidateName}</span>
                      <span className="text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <span>Job: <strong className="text-slate-100">{log.jobTitle}</strong></span>
                      <span>Score: <strong className="text-indigo-400">{log.overallScore}%</strong></span>
                      <span>Confidence: <strong className="text-cyan-400">{log.confidenceScore}%</strong></span>
                    </div>
                    <p className="text-slate-400 italic">
                      OCR Fidelity: {log.extractionQuality} | Reviewer: {log.reviewerDecision || 'Pending'}
                    </p>
                    {log.reviewerNotes && (
                      <p className="text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                        {log.reviewerNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PRIVACY & BIAS PROTECTION MODAL --- */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Algorithmic Transparency & Fairness Standards</h3>
              </div>
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <p className="font-bold mb-1">Ethical Screening Commitment</p>
                <p>
                  PrimeATS scores candidates purely on verified technical competencies, quantified achievements, and role-relevant experience. Personal demographic markers are completely excluded from scoring equations.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-bold text-white text-xs mb-1">1. Zero PII Bias Weighting</h4>
                  <p className="text-slate-400">
                    Names, age indicators, gender, photo data, and address lines receive zero mathematical weight in ATS evaluation.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-bold text-white text-xs mb-1">2. Explainable Deterministic Core</h4>
                  <p className="text-slate-400">
                    Unlike black-box AI classifiers, scores are calculated using a deterministic 7-component formula. AI is used solely for natural-language feedback synthesis.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-bold text-white text-xs mb-1">3. Human-in-the-Loop Safeguards</h4>
                  <p className="text-slate-400">
                    ATS scores serve as prioritization decision-support metrics, not automated rejection verdicts. Recruiters review evidence cards before disqualifying candidates.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CANDIDATE DETAIL SCORECARD MODAL (FOR RECRUITERS) --- */}
      {selectedCandidateDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">{selectedCandidateDetail.candidateName}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedCandidateDetail.atsScore?.overallScore || selectedCandidateDetail.atsAnalysis.overallScore}% ATS Match
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedCandidateDetail.candidateEmail} | {selectedCandidateDetail.resume.location} | Stage: <span className="capitalize font-semibold text-slate-200">{selectedCandidateDetail.stage}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedCandidateDetail(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Summary & Key Strengths */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Candidate Summary</p>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedCandidateDetail.resume.summary}</p>
              </div>

              {/* Matched Skills vs Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Verified Matched Skills ({selectedCandidateDetail.atsAnalysis.components.skillsMatch.matched.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidateDetail.atsAnalysis.components.skillsMatch.matched.map((m, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{m.skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                    Missing Target Skills ({selectedCandidateDetail.atsAnalysis.components.skillsMatch.missingRequired.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidateDetail.atsAnalysis.components.skillsMatch.missingRequired.length === 0 ? (
                      <span className="text-xs text-emerald-400 font-medium">All required skills present</span>
                    ) : (
                      selectedCandidateDetail.atsAnalysis.components.skillsMatch.missingRequired.map((s, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Work Experience</p>
                {selectedCandidateDetail.resume.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{exp.jobTitle} - {exp.company}</span>
                      <span className="text-slate-400">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{exp.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {exp.technologies.map((t, tidx) => (
                        <span key={tidx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <button
                onClick={() => exportATSReportPDF(selectedCandidateDetail.resume, selectedJob, selectedCandidateDetail.atsAnalysis)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit PDF</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedCandidateDetail(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setCandidates(prev => prev.map(c => c.id === selectedCandidateDetail.id ? { ...c, stage: 'interview' } : c));
                    setSelectedCandidateDetail(null);
                    setActiveView('candidate-pipeline');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Schedule Interview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- NOTIFICATIONS POPUP PANEL --- */}
      {showNotifications && (
        <div className="fixed top-16 right-4 sm:right-8 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Notifications</h4>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-white">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
