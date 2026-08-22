import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  UserRole, 
  StructuredResume, 
  JobRequirement, 
  ATSScoreBreakdown, 
  PipelineCandidate, 
  ATSAuditRecord,
  CandidateApplication,
  AuthUser,
  DirectMessage,
  TokenUsageState
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
import { TokenUsageModal } from './components/TokenUsageModal';
import { DirectMessagingModal } from './components/messaging/DirectMessagingModal';
import { MessagingCenter } from './components/messaging/MessagingCenter';

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
  ChevronRight,
  MessageSquare,
  Zap,
  Coins
} from 'lucide-react';

export default function App() {
  // --- Core State ---
  const [role, setRole] = useState<UserRole>('candidate');
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeView, setActiveView] = useState<string>('candidate-dashboard');

  // Auth User State — Login is required before accessing portal
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = sessionStorage.getItem('primeats_auth_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
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

  // Token Quota Management State
  const [tokenState, setTokenState] = useState<TokenUsageState>(() => {
    const saved = localStorage.getItem('resumeai_token_state');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      availableTokens: 25000,
      totalAllocated: 25000,
      usedTokens: 0,
      tier: 'Pro Recruiter',
      history: [
        {
          id: 'tok-init-1',
          action: 'Provisioning Grant',
          tokensDeducted: 0,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          targetName: 'Platform Subscription Quota',
          category: 'system'
        }
      ]
    };
  });
  const [showTokenModal, setShowTokenModal] = useState(false);

  // Direct Candidate-Company Messages State
  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem('resumeai_direct_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'msg-1',
        threadId: 'thread-job-data-analyst-usr-1',
        senderId: 'rec-apex-1',
        senderName: 'Apex Analytics Talent Team',
        senderRole: 'recruiter',
        recipientId: 'usr-1',
        recipientName: 'Alex Rivera',
        recipientRole: 'candidate',
        jobId: 'job-data-analyst',
        jobTitle: 'Senior Data Analyst',
        companyName: 'Apex Analytics & FinTech',
        content: 'Hi Alex! We reviewed your structured profile for Senior Data Analyst (89% ATS match). Your experience with Power BI and SQL pipelines stands out. Would you be free for a 20-min technical screen this week?',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        isRead: false,
        candidateAtsScore: 89,
        tags: ['Interview Invite', 'Senior Data Analyst']
      },
      {
        id: 'msg-2',
        threadId: 'thread-job-data-analyst-usr-1',
        senderId: 'usr-1',
        senderName: 'Alex Rivera',
        senderRole: 'candidate',
        recipientId: 'rec-apex-1',
        recipientName: 'Apex Analytics Talent Team',
        recipientRole: 'recruiter',
        jobId: 'job-data-analyst',
        jobTitle: 'Senior Data Analyst',
        companyName: 'Apex Analytics & FinTech',
        content: 'Thank you! Yes, I am available Thursday morning or Friday afternoon for the chat. Looking forward to discussing the pipeline architecture.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true,
        candidateAtsScore: 89,
        tags: ['Candidate Reply']
      }
    ];
  });
  
  // Direct Message Modal Trigger State
  const [activeMessagingJob, setActiveMessagingJob] = useState<JobRequirement | null>(null);
  const [activeMessagingCandidate, setActiveMessagingCandidate] = useState<PipelineCandidate | null>(null);

  // Sync token state to localStorage
  useEffect(() => {
    localStorage.setItem('resumeai_token_state', JSON.stringify(tokenState));
  }, [tokenState]);

  // Sync messages to localStorage
  useEffect(() => {
    localStorage.setItem('resumeai_direct_messages', JSON.stringify(messages));
  }, [messages]);

  // Token handlers
  const handleDeductTokens = (amount: number, actionName: string, targetName: string, category: any): boolean => {
    if (tokenState.availableTokens < amount) {
      setShowTokenModal(true);
      return false;
    }
    setTokenState(prev => ({
      ...prev,
      availableTokens: Math.max(0, prev.availableTokens - amount),
      usedTokens: prev.usedTokens + amount,
      history: [
        {
          id: `tok-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          action: actionName,
          tokensDeducted: amount,
          timestamp: new Date().toISOString(),
          targetName,
          category
        },
        ...prev.history
      ]
    }));
    return true;
  };

  const handleTopUpTokens = (amount: number) => {
    setTokenState(prev => ({
      ...prev,
      availableTokens: prev.availableTokens + amount,
      totalAllocated: prev.totalAllocated + amount,
      history: [
        {
          id: `tok-topup-${Date.now()}`,
          action: `Token Quota Top-Up (+${amount.toLocaleString()})`,
          tokensDeducted: 0,
          timestamp: new Date().toISOString(),
          targetName: 'Instant Top-Up Pack',
          category: 'system'
        },
        ...prev.history
      ]
    }));
  };

  const handleResetTokens = () => {
    setTokenState({
      availableTokens: 25000,
      totalAllocated: 25000,
      usedTokens: 0,
      tier: 'Pro Recruiter',
      history: [
        {
          id: `tok-reset-${Date.now()}`,
          action: 'Quota Reset to 25,000 Tokens',
          tokensDeducted: 0,
          timestamp: new Date().toISOString(),
          targetName: 'System Reset',
          category: 'system'
        }
      ]
    });
  };

  // Messaging handler
  const handleSendMessage = (msgData: Omit<DirectMessage, 'id' | 'timestamp' | 'isRead'>) => {
    const newMsg: DirectMessage = {
      ...msgData,
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [newMsg, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-msg-${Date.now()}`,
        title: 'New Message Sent',
        desc: `Sent to ${msgData.recipientName} regarding ${msgData.jobTitle}`,
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);

    handleDeductTokens(2, 'Direct Message Dispatch', msgData.jobTitle, 'messaging');
  };

  // Unread messages count for current role
  const unreadMessagesCount = useMemo(() => {
    const myId = authUser?.id || (role === 'candidate' ? 'usr-1' : 'rec-1');
    return messages.filter(m => m.recipientId === myId && !m.isRead).length;
  }, [messages, authUser, role]);

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
    { id: 'messages', label: 'Company Messages', icon: MessageSquare, badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined },
  ];

  // Recruiter Navigation Items
  const recruiterNavItems = [
    { id: 'recruiter-dashboard', label: 'Recruiter Console', icon: Home },
    { id: 'recruiter-bulk', label: 'High-Speed Bulk Screen', icon: Layers, badge: 'Max 600' },
    { id: 'candidate-ranking', label: 'Candidate Ranking', icon: Users },
    { id: 'candidate-pipeline', label: 'Hiring Pipeline', icon: Briefcase, badge: `${candidates.length}` },
    { id: 'job-manager', label: 'Job Requirements', icon: Sliders },
    { id: 'messages', label: 'Candidate Inquiries', icon: MessageSquare, badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined },
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
              onOpenMessageModal={(job) => setActiveMessagingJob(job)}
              onApplyJob={(job) => {
                const newScore = evaluateResumeAgainstJob(selectedResume, job);
                const newApp: PipelineCandidate = {
                  id: `app-cand-${Date.now()}`,
                  candidateId: selectedResume.id,
                  candidateName: selectedResume.fullName,
                  candidateEmail: selectedResume.email,
                  candidatePhone: selectedResume.phone,
                  jobId: job.id,
                  jobTitle: job.title,
                  companyName: job.company,
                  appliedDate: new Date().toISOString(),
                  stage: 'applied',
                  resume: selectedResume,
                  atsAnalysis: newScore,
                  atsScore: newScore,
                  recruiterNotes: [],
                  tags: ['Direct Portal Application'],
                  recruiterRating: newScore.overallScore >= 80 ? 5 : 4
                };
                setCandidates(prev => [newApp, ...prev]);
                setNotifications(prev => [
                  {
                    id: `notif-app-${Date.now()}`,
                    title: 'Application Submitted',
                    desc: `Successfully applied to ${job.title} at ${job.company}`,
                    time: 'Just now',
                    unread: true
                  },
                  ...prev
                ]);
              }}
            />
          );
        case 'messages':
          return (
            <MessagingCenter
              messages={messages}
              currentRole={role}
              currentUser={authUser}
              jobs={jobs}
              activeJob={selectedJob}
              onSendMessage={handleSendMessage}
              onSelectJobForContext={(j) => {
                setSelectedJob(j);
                setActiveView('job-tracker');
              }}
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
              tokenState={tokenState}
              onDeductTokens={handleDeductTokens}
              onOpenTokenModal={() => setShowTokenModal(true)}
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
              onOpenMessageModal={(cand) => setActiveMessagingCandidate(cand)}
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
        case 'messages':
          return (
            <MessagingCenter
              messages={messages}
              currentRole={role}
              currentUser={authUser}
              jobs={jobs}
              activeJob={selectedJob}
              onSendMessage={handleSendMessage}
              onSelectJobForContext={(j) => {
                setSelectedJob(j);
                setActiveView('job-manager');
              }}
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
          sessionStorage.setItem('primeats_auth_user', JSON.stringify(user));
          setShowLoginPortalModal(false);
        }}
        initialRole={role}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1420] text-[#E6EAF0] flex flex-col selection:bg-teal-500/20 selection:text-teal-200">
      
      {/* Top Main Navigation */}
      <Navbar
        currentRole={role}
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
        availableTokens={tokenState.availableTokens}
        onOpenTokenModal={() => setShowTokenModal(true)}
        unreadMessagesCount={unreadMessagesCount}
        onOpenMessages={() => setActiveView('messages')}
        onLogout={() => {
          setAuthUser(null);
          sessionStorage.removeItem('primeats_auth_user');
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
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Desktop Left Sidebar Navigation */}
            <aside className="lg:col-span-3 space-y-3.5 sticky top-16">
              
              {/* Profile / Persona Summary Card */}
              <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348]">
                <div className="flex items-center space-x-3 mb-2.5">
                  <div className="w-8 h-8 rounded bg-[#0E1A29] border border-[#223348] flex items-center justify-center font-mono font-bold text-xs text-teal-400">
                    {role === 'candidate' ? selectedResume.fullName.charAt(0) : 'HR'}
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="text-xs font-bold text-[#E6EAF0] truncate">
                      {role === 'candidate' ? selectedResume.fullName : 'Lead Talent Partner'}
                    </h2>
                    <p className="text-[11px] text-[#8A97A8] truncate">
                      {role === 'candidate' ? selectedResume.versionName.split('—')[1]?.trim() || selectedResume.location : selectedJob.company}
                    </p>
                  </div>
                </div>

                {/* Active Match Badge */}
                <div className="bg-[#0E1A29] rounded p-2 border border-[#223348] flex items-center justify-between text-xs">
                  <span className="text-[#8A97A8]">Target Job:</span>
                  <span className="font-semibold text-[#E6EAF0] truncate max-w-[130px]" title={selectedJob.title}>
                    {selectedJob.title}
                  </span>
                </div>

                {role === 'candidate' && (
                  <div className="mt-2 pt-2 border-t border-[#223348] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8A97A8]">ATS Score:</span>
                    <span className="font-bold text-teal-400 bg-[#0E1A29] px-2 py-0.5 rounded border border-[#223348]">
                      {analysis.overallScore}% ({analysis.confidenceScore}% conf)
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Menu Links */}
              <nav className="bg-[#131F30] rounded-lg p-2 border border-[#223348] space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8]">
                  {role === 'candidate' ? 'Candidate Modules' : 'Recruitment Operations'}
                </div>
                {currentNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectView(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#17263B] text-teal-300 border border-teal-500/30'
                          : 'text-[#8A97A8] hover:bg-[#0E1A29] hover:text-[#E6EAF0]'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-[#8A97A8]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          isActive 
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
                            : 'bg-[#0E1A29] text-[#8A97A8] border border-[#223348]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions Card */}
              <div className="bg-[#131F30] rounded-lg p-3 border border-[#223348] space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8]">
                  Specification Utilities
                </p>
                <button
                  onClick={() => exportATSReportPDF(selectedResume, selectedJob, analysis)}
                  className="w-full py-1.5 px-2.5 rounded bg-[#0E1A29] hover:bg-[#17263B] text-[#E6EAF0] text-xs font-medium border border-[#223348] flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-teal-400" />
                  <span>Download Spec PDF</span>
                </button>
                <button
                  onClick={() => exportResumePDF(selectedResume)}
                  className="w-full py-1.5 px-2.5 rounded bg-[#0E1A29] hover:bg-[#17263B] text-[#E6EAF0] text-xs font-medium border border-[#223348] flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Export ATS Resume</span>
                </button>
                <button
                  onClick={() => setShowAuditModal(true)}
                  className="w-full py-1.5 px-2.5 rounded bg-[#0E1A29] hover:bg-[#17263B] text-[#E6EAF0] text-xs font-medium border border-[#223348] flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Audit Verification</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-150">
          <div className="bg-[#131F30] border border-[#223348] rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col shadow-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#223348] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded bg-[#0E1A29] border border-[#223348] text-teal-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#E6EAF0] font-display">ATS Algorithm Audit & Model Governance Log</h3>
                  <p className="text-[11px] text-[#8A97A8]">Verifiable deterministic calculations, confidence indices, and OCR fidelity</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAuditModal(false)}
                className="text-[#8A97A8] hover:text-[#E6EAF0] p-1 rounded hover:bg-[#17263B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="bg-[#0E1A29] p-3.5 rounded border border-[#223348] text-xs space-y-2 font-mono">
                <div className="flex items-center justify-between text-[#8A97A8]">
                  <span className="font-semibold text-[#E6EAF0]">Model Identifier:</span>
                  <span className="text-teal-400">{analysis.modelVersion}</span>
                </div>
                <div className="flex items-center justify-between text-[#8A97A8]">
                  <span className="font-semibold text-[#E6EAF0]">Scoring Engine Protocol:</span>
                  <span className="text-teal-400">{analysis.scoringEngineVersion}</span>
                </div>
                <div className="flex items-center justify-between text-[#8A97A8]">
                  <span className="font-semibold text-[#E6EAF0]">Fairness / Bias Safeguard:</span>
                  <span className="text-emerald-400 font-medium">Active (Zero PII Weighting, EEOC Compliant)</span>
                </div>
              </div>

              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8A97A8] mt-4">
                Telemetry Audit Records
              </h4>

              <div className="space-y-2.5">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded bg-[#0E1A29] border border-[#223348] text-xs space-y-1.5 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#E6EAF0]">{log.candidateName}</span>
                      <span className="text-[10px] text-[#8A97A8]">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[#8A97A8] text-[11px]">
                      <span>Target: <strong className="text-[#E6EAF0]">{log.jobTitle}</strong></span>
                      <span>Score: <strong className="text-teal-400">{log.overallScore}%</strong></span>
                      <span>Confidence: <strong className="text-teal-300">{log.confidenceScore}%</strong></span>
                    </div>
                    <p className="text-[11px] text-[#8A97A8]">
                      Extraction: {log.extractionQuality} | Decision: {log.reviewerDecision || 'Automatic Analysis'}
                    </p>
                    {log.reviewerNotes && (
                      <p className="text-[11px] text-[#8A97A8] bg-[#131F30] p-2 rounded border border-[#223348]">
                        {log.reviewerNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#223348] bg-[#0E1A29] flex justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-3.5 py-1.5 bg-[#17263B] hover:bg-[#223348] text-[#E6EAF0] rounded border border-[#223348] text-xs font-semibold"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PRIVACY & BIAS PROTECTION MODAL --- */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-150">
          <div className="bg-[#131F30] border border-[#223348] rounded-lg w-full max-w-2xl max-h-[85vh] flex flex-col shadow-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#223348] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-[#E6EAF0] font-display">Algorithmic Transparency & Fairness Standards</h3>
              </div>
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="text-[#8A97A8] hover:text-[#E6EAF0] p-1 rounded hover:bg-[#17263B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3.5 text-xs text-[#8A97A8] leading-relaxed">
              <div className="p-3.5 rounded bg-[#0E1A29] border border-teal-500/30 text-teal-300">
                <p className="font-bold mb-1 text-teal-200">Ethical Screening Commitment</p>
                <p className="text-xs">
                  PrimeATS scores candidates purely on verified technical competencies, quantified achievements, and role-relevant experience. Personal demographic markers are completely excluded from scoring equations.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded bg-[#0E1A29] border border-[#223348]">
                  <h4 className="font-bold text-[#E6EAF0] text-xs mb-1">1. Zero PII Bias Weighting</h4>
                  <p className="text-[#8A97A8] text-[11px]">
                    Names, age indicators, gender, photo data, and address lines receive zero mathematical weight in ATS evaluation.
                  </p>
                </div>

                <div className="p-3 rounded bg-[#0E1A29] border border-[#223348]">
                  <h4 className="font-bold text-[#E6EAF0] text-xs mb-1">2. Explainable Deterministic Core</h4>
                  <p className="text-[#8A97A8] text-[11px]">
                    Unlike opaque AI classifiers, scores are calculated using a deterministic 7-component formula. AI is used solely for natural-language feedback synthesis.
                  </p>
                </div>

                <div className="p-3 rounded bg-[#0E1A29] border border-[#223348]">
                  <h4 className="font-bold text-[#E6EAF0] text-xs mb-1">3. Human-in-the-Loop Safeguards</h4>
                  <p className="text-[#8A97A8] text-[11px]">
                    ATS scores serve as prioritization decision-support metrics, not automated rejection verdicts. Recruiters review evidence cards before disqualifying candidates.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#223348] bg-[#0E1A29] flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-3.5 py-1.5 bg-[#17263B] hover:bg-[#223348] text-[#E6EAF0] rounded border border-[#223348] text-xs font-semibold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CANDIDATE DETAIL SCORECARD MODAL (FOR RECRUITERS) --- */}
      {selectedCandidateDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-150">
          <div className="bg-[#131F30] border border-[#223348] rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#223348] flex items-center justify-between bg-[#0E1A29]">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-[#E6EAF0] font-display">{selectedCandidateDetail.candidateName}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded font-bold bg-[#131F30] text-teal-400 border border-teal-500/30">
                    {selectedCandidateDetail.atsScore?.overallScore || selectedCandidateDetail.atsAnalysis.overallScore}% ATS Match
                  </span>
                </div>
                <p className="text-[11px] text-[#8A97A8] font-mono mt-0.5">
                  {selectedCandidateDetail.candidateEmail} | {selectedCandidateDetail.resume.location} | Stage: <span className="capitalize text-[#E6EAF0]">{selectedCandidateDetail.stage}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedCandidateDetail(null)}
                className="text-[#8A97A8] hover:text-[#E6EAF0] p-1 rounded hover:bg-[#17263B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              
              {/* Summary & Key Strengths */}
              <div className="bg-[#0E1A29] p-3.5 rounded border border-[#223348] space-y-1.5">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8]">Candidate Profile Summary</p>
                <p className="text-xs text-[#E6EAF0] leading-relaxed">{selectedCandidateDetail.resume.summary}</p>
              </div>

              {/* Matched Skills vs Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded bg-[#0E1A29] border border-[#223348]">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Verified Matched Skills ({selectedCandidateDetail.atsAnalysis.components.skillsMatch.matched.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidateDetail.atsAnalysis.components.skillsMatch.matched.map((m, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded bg-[#131F30] text-emerald-300 border border-emerald-500/30 flex items-center space-x-1 font-mono">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{m.skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded bg-[#0E1A29] border border-[#223348]">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 mb-2">
                    Missing Target Skills ({selectedCandidateDetail.atsAnalysis.components.skillsMatch.missingRequired.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidateDetail.atsAnalysis.components.skillsMatch.missingRequired.length === 0 ? (
                      <span className="text-xs text-emerald-400 font-mono">All required skills present</span>
                    ) : (
                      selectedCandidateDetail.atsAnalysis.components.skillsMatch.missingRequired.map((s, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded bg-[#131F30] text-rose-300 border border-rose-500/30 font-mono">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8]">Work Experience History</p>
                {selectedCandidateDetail.resume.experience.map((exp, idx) => (
                  <div key={idx} className="p-3 rounded bg-[#0E1A29] border border-[#223348] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#E6EAF0]">{exp.jobTitle} — {exp.company}</span>
                      <span className="text-[11px] text-[#8A97A8] font-mono">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-[#8A97A8] leading-relaxed text-[11px]">{exp.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {exp.technologies.map((t, tidx) => (
                        <span key={tidx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131F30] text-[#8A97A8] border border-[#223348]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="px-5 py-3 border-t border-[#223348] bg-[#0E1A29] flex items-center justify-between">
              <button
                onClick={() => exportATSReportPDF(selectedCandidateDetail.resume, selectedJob, selectedCandidateDetail.atsAnalysis)}
                className="px-3 py-1.5 bg-[#17263B] hover:bg-[#223348] text-[#E6EAF0] rounded text-xs font-medium border border-[#223348] flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>Export Audit PDF</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedCandidateDetail(null)}
                  className="px-3 py-1.5 bg-[#131F30] hover:bg-[#17263B] text-[#8A97A8] hover:text-[#E6EAF0] rounded border border-[#223348] text-xs font-medium"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setCandidates(prev => prev.map(c => c.id === selectedCandidateDetail.id ? { ...c, stage: 'interview' } : c));
                    setSelectedCandidateDetail(null);
                    setActiveView('candidate-pipeline');
                  }}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded text-xs transition-colors"
                >
                  Advance to Interview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- NOTIFICATIONS POPUP PANEL --- */}
      {showNotifications && (
        <div className="fixed top-16 right-4 sm:right-8 w-80 bg-[#131F30] border border-[#223348] rounded-lg shadow-lg p-3 z-50 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#223348] mb-2.5">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8]">System Notifications</h4>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-[#8A97A8] hover:text-[#E6EAF0]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="p-2.5 rounded bg-[#0E1A29] border border-[#223348] text-xs">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-[#E6EAF0] text-[11px]">{n.title}</span>
                  <span className="text-[9px] font-mono text-[#8A97A8]">{n.time}</span>
                </div>
                <p className="text-[#8A97A8] text-[11px] leading-relaxed">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TOKEN & COMPUTE USAGE MODAL --- */}
      <TokenUsageModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        tokenState={tokenState}
        onTopUp={handleTopUpTokens}
        onResetTokens={handleResetTokens}
      />

      {/* --- DIRECT CANDIDATE <-> COMPANY MESSAGING MODAL --- */}
      <DirectMessagingModal
        isOpen={!!activeMessagingJob || !!activeMessagingCandidate}
        onClose={() => {
          setActiveMessagingJob(null);
          setActiveMessagingCandidate(null);
        }}
        targetJob={activeMessagingJob || (activeMessagingCandidate ? jobs.find(j => j.id === activeMessagingCandidate.jobId) || selectedJob : selectedJob)}
        resume={selectedResume}
        currentUser={authUser}
        currentRole={role}
        recipientName={activeMessagingCandidate?.resume.fullName}
        recipientId={activeMessagingCandidate?.candidateId}
        onSendMessage={handleSendMessage}
      />

    </div>
  );
}
