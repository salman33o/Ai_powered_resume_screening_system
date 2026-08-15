export type UserRole = 'candidate' | 'recruiter' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  avatarUrl?: string;
  token?: string;
}

export type PipelineStage = 
  | 'applied' 
  | 'screening' 
  | 'shortlisted' 
  | 'interview' 
  | 'selected' 
  | 'rejected' 
  | 'on_hold';

export interface SkillItem {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'tool' | 'framework' | 'language' | 'database';
  aliases: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  location?: string;
  description: string;
  technologies: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  metrics?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
}

export interface StructuredResume {
  id: string;
  versionName: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  experience: WorkExperience[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  rawText?: string;
  extractionQuality: 'high' | 'medium' | 'low' | 'uncertain';
  extractionNotes?: string[];
}

export interface JobRequirement {
  id: string;
  title: string;
  company: string;
  department?: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  seniority: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Staff';
  minExperienceYears: number;
  salaryRange?: string;
  summary: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  educationRequirement: string;
  requiredCertifications: string[];
  keywords: string[];
  scoringWeights?: ScoringWeights;
  published: boolean;
  createdAt: string;
  applicationsCount: number;
}

export interface ScoringWeights {
  skillsMatch: number;          // Default: 30%
  experienceMatch: number;      // Default: 25%
  responsibilitiesMatch: number;// Default: 20%
  projectsMatch: number;        // Default: 10%
  educationMatch: number;       // Default: 5%
  keywordsMatch: number;        // Default: 5%
  certificationsMatch: number;  // Default: 5%
}

export interface ATSScoreBreakdown {
  overallScore: number;
  confidenceScore: number;
  confidenceReason: string;
  weights: ScoringWeights;
  components: {
    skillsMatch: {
      score: number;
      weight: number;
      matched: { skill: string; evidence: string; matchType: 'exact' | 'alias' | 'semantic' }[];
      missingRequired: string[];
      missingPreferred: string[];
      notes: string;
    };
    experienceMatch: {
      score: number;
      weight: number;
      candidateYears: number;
      requiredYears: number;
      titleAlignment: string;
      evidence: string;
    };
    responsibilitiesMatch: {
      score: number;
      weight: number;
      alignedPoints: { jdPoint: string; resumeEvidence: string; similarity: number }[];
      gapPoints: string[];
    };
    projectsMatch: {
      score: number;
      weight: number;
      relevantProjects: { title: string; alignment: string }[];
      suggestions: string;
    };
    educationMatch: {
      score: number;
      weight: number;
      status: 'matched' | 'partial' | 'unspecified';
      details: string;
    };
    keywordsMatch: {
      score: number;
      weight: number;
      matchedKeywords: string[];
      missingKeywords: string[];
    };
    certificationsMatch: {
      score: number;
      weight: number;
      matched: string[];
      missing: string[];
    };
  };
  aiExplanation?: string;
  topStrengths: string[];
  criticalGaps: string[];
  improvementActionItems: string[];
  modelVersion: string;
  scoringEngineVersion: string;
  analyzedAt: string;
}

export interface CandidateApplication {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  stage: PipelineStage;
  resume: StructuredResume;
  atsAnalysis: ATSScoreBreakdown;
  atsScore?: ATSScoreBreakdown;
  recruiterNotes: string[];
  tags: string[];
  recruiterRating?: number;
  interviewScheduledDate?: string;
  interviewNotes?: string;
  feedback?: string;
}

export type PipelineCandidate = CandidateApplication & {
  atsScore: ATSScoreBreakdown;
};

export interface BulkScreeningJob {
  id: string;
  jobId: string;
  jobTitle: string;
  totalResumes: number;
  processedCount: number;
  successfulCount: number;
  failedCount: number;
  status: 'idle' | 'parsing' | 'scoring' | 'completed' | 'paused';
  currentBatch: number;
  progressPercent: number;
  startedAt: string;
  completedAt?: string;
  results: CandidateApplication[];
  errors: { filename: string; reason: string }[];
}

export interface InterviewQuestionItem {
  id: string;
  category: 'technical' | 'behavioral' | 'project_deep_dive' | 'role_specific';
  question: string;
  contextWhyAsked: string;
  expectedKeyPoints: string[];
  candidateBackgroundEvidence: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
}

export interface ATSAuditRecord {
  id: string;
  candidateName: string;
  jobTitle: string;
  overallScore: number;
  confidenceScore: number;
  breakdown: {
    skills: number;
    experience: number;
    responsibilities: number;
    projects: number;
    education: number;
  };
  modelVersion: string;
  scoringVersion: string;
  timestamp: string;
  extractionQuality: string;
  reviewerDecision?: string;
  reviewerNotes?: string;
}

export interface DirectMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  recipientRole: UserRole;
  jobId: string;
  jobTitle: string;
  companyName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  candidateAtsScore?: number;
  tags?: string[];
}

export interface MessageThread {
  threadId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  candidateAtsScore?: number;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  messages: DirectMessage[];
}

export interface TokenLogItem {
  id: string;
  action: string;
  tokensDeducted: number;
  timestamp: string;
  targetName: string;
  category: 'screening' | 'optimization' | 'interview_prep' | 'messaging' | 'system';
}

export interface TokenUsageState {
  availableTokens: number;
  totalAllocated: number;
  usedTokens: number;
  tier: 'Free Explorer' | 'Pro Recruiter' | 'Enterprise ATS';
  history: TokenLogItem[];
}
