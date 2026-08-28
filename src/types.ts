export type UserRole = 
  | 'Super Admin' 
  | 'Admin' 
  | 'HR Manager' 
  | 'Recruiter' 
  | 'Hiring Manager' 
  | 'Interviewer' 
  | 'Candidate' 
  | 'Guest';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface JobDescriptionAnalysis {
  requiredSkills: string[];
  preferredSkills: string[];
  education: string;
  experienceYearsRequired: number;
  responsibilities: string[];
  keywords: string[];
  certifications: string[];
  seniorityLevel: string;
  industry: string;
  department: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  status: string;
  postedDate: string;
  applicantsCount: number;
  extractedAnalysis?: JobDescriptionAnalysis;
}

export interface EducationRecord {
  degree: string;
  institution: string;
  graduationYear?: string | number;
  fieldOfStudy?: string;
}

export interface WorkExperienceRecord {
  title: string;
  company: string;
  duration?: string;
  description?: string;
}

export interface JdMatchBreakdown {
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  projectMatch: number;
  certificationMatch: number;
  keywordMatch: number;
  semanticSimilarity: number;
  overallMatchScore: number;
}

export interface SkillGapAnalysis {
  missingSkills: string[];
  missingCertifications: string[];
  missingExperience: string[];
  recommendations: string[];
  recommendationRoadmap?: string;
}

export interface HiringRecommendation {
  verdict: 'Strong Hire' | 'Hire' | 'Review Further' | 'Borderline' | 'Reject';
  confidenceScore: number;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
  hiringRisk: string;
}

export interface ExplainableAiBreakdown {
  skillContribution: number;
  experienceContribution: number;
  educationContribution: number;
  projectContribution: number;
  resumeQualityContribution: number;
  skillContributionScore?: number;
  experienceContributionScore?: number;
  educationContributionScore?: number;
  projectContributionScore?: number;
  resumeQualityContributionScore?: number;
}

export interface ExtractedResumeDetails {
  address?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  codingProfileUrl?: string; // LeetCode / HackerRank / CodeChef / Codeforces URL
  schoolBoard?: string; // CBSE, ICSE, Stateboard, Matriculation, Kendriya Vidhyalaya, etc.
  percentage10th?: string; // 10%
  percentage12thOrDiploma?: string; // 12% or Diploma or ITI
  collegeCgpa?: string; // College CGPA
  skills?: string; // Skills list
  projectsDescription?: string; // Projects in short description
  internships?: string; // Internships
  training?: string; // Training (if any)
  extraCurricular?: string; // Extra Curricular
  coCurricular?: string; // Co-Curricular
  hobbies?: string; // Hobbies
  certificates?: string; // Course / Winning / Participation Certificates
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedJobId: string;
  appliedJobTitle: string;
  department?: string;
  expectedSalary?: string;
  experienceYears: number;
  skills: string[];
  matchScore: number; // overall fit (0-100)
  
  // Enterprise Extracted Resume Profile Details
  extractedDetails?: ExtractedResumeDetails;
  
  // Enterprise Scores & Metrics (Sprint 1 & Sprint 2)
  resumeScore?: number; // 0-100 evaluated based on resume quality/structure
  mlScore?: number;     // 0-100 evaluated based on ML/predictive skill match
  finalScore?: number;  // weighted combination of resumeScore & mlScore

  // Sprint 2 Intelligence Additions
  summary?: string;
  professionalSummary?: string;
  resumeQualityScore?: number;
  resumeStrengths?: string[];
  resumeWeaknesses?: string[];
  missingSkills?: string[];
  atsCompatibilityScore?: number;
  resumeSuggestions?: string[];
  resumeImprovementSuggestions?: string[];

  jdMatchBreakdown?: JdMatchBreakdown;
  skillGaps?: SkillGapAnalysis;
  skillGapAnalysis?: SkillGapAnalysis;
  hiringRecommendation?: HiringRecommendation;
  explainableAi?: ExplainableAiBreakdown;

  educationList?: EducationRecord[];
  experienceList?: WorkExperienceRecord[];

  status: 'Shortlisted' | 'Review' | 'Rejected' | 'Hired' | 'Interview Scheduled' | string;
  matchBreakdown?: {
    skillsMatch: number;
    experienceMatch: number;
    culturalFit: number;
  };
  missingQualifications?: string[];
  justification?: string;
  resumeText?: string;
  appliedDate?: string;
  source?: 'Direct Upload' | 'QR Registration' | 'CSV Import' | string;
}

export interface AnalyticsData {
  totalCandidates?: number;
  totalJobs?: number;
  averageMatchScore?: number;
  totalApplicants?: number;
  shortlistedCount?: number;
  avgMatchScore?: number;
  avgTimeToHireDays?: number;
  topSkills?: { skill: string; count: number }[];
  topSkillsInPool?: { skill: string; count: number }[];
  statusDistribution?: { status: string; count: number }[];
  matchScoreDistribution?: { range: string; count: number }[];
  pipelineFunnel?: { stage: string; count: number }[];
  skillGapTrends?: { category: string; frequency: number }[];
  recruiterProductivity?: {
    resumesScreenedToday: number;
    interviewsScheduledThisWeek: number;
    offersReleasedThisMonth?: number;
    avgScreeningTimeSeconds?: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface InterviewQuestion {
  question: string;
  focusArea: string;
  evaluationGuideline: string;
}

export interface CategorizedInterviewQuestions {
  technicalQuestions: InterviewQuestion[];
  hrQuestions: InterviewQuestion[];
  behavioralQuestions: InterviewQuestion[];
  codingQuestions: InterviewQuestion[];
  projectQuestions: InterviewQuestion[];
}

export interface CandidateComparisonResult {
  candidates: Candidate[];
  comparisonGrid: {
    category: string;
    scores: Record<string, string | number>;
  }[];
  aiVerdict: {
    recommendedCandidateId: string;
    recommendedCandidateName: string;
    executiveSummary: string;
    keyDifferentiator: string;
    riskComparison: string;
  };
}

export type PipelineStage = 
  | 'Applied'
  | 'Resume Screening'
  | 'AI Evaluation'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Technical Interview'
  | 'HR Interview'
  | 'Manager Review'
  | 'Offer Released'
  | 'Accepted'
  | 'Rejected'
  | 'Onboarding';

export interface WorkflowRule {
  id: string;
  name: string;
  trigger: 'Resume Uploaded' | 'AI Screening Completed' | 'Interview Completed' | 'Offer Released' | 'Offer Accepted' | 'Candidate Rejected';
  minMatchScore?: number;
  actions: string[];
  enabled: boolean;
  executionCount: number;
  lastTriggered?: string;
}

export interface AutomationLog {
  id: string;
  workflowName: string;
  candidateName: string;
  triggerEvent: string;
  actionTaken: string;
  status: 'Success' | 'Failed' | 'Pending';
  timestamp: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'Application Received' | 'Resume Accepted' | 'Resume Rejected' | 'Interview Invitation' | 'Interview Reminder' | 'Offer Letter' | 'Joining Instructions';
  variables: string[];
}

export interface SentEmailLog {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  templateName: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'Delivered' | 'Opened' | 'Clicked';
}

export interface ScheduledInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  appliedJobTitle: string;
  interviewerName: string;
  interviewerRole: string;
  stage: 'Technical Interview' | 'HR Interview' | 'Manager Review';
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM AM/PM
  durationMinutes: number;
  meetingLink: string;
  status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
  notes?: string;
}

export interface RecruiterTask {
  id: string;
  title: string;
  category: 'Interview' | 'Candidate Review' | 'Offer Approval' | 'AI Action' | 'Deadline';
  candidateName?: string;
  jobTitle?: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  actionLinkTab?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Candidate Registered' | 'Resume Uploaded' | 'Interview Scheduled' | 'Interview Completed' | 'Offer Accepted' | 'Offer Rejected' | 'AI Screening Completed';
  timestamp: string;
  read: boolean;
  candidateId?: string;
}

export type ApprovalRole = 'Recruiter' | 'HR Manager' | 'Department Manager' | 'Technical Lead' | 'Director';

export interface ApprovalChainLevel {
  role: ApprovalRole;
  approverName: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Skipped';
  timestamp?: string;
  comments?: string;
}

export interface ApprovalRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  appliedJobTitle: string;
  offeredSalary: string;
  joiningDate: string;
  currentStep: ApprovalRole;
  overallStatus: 'In Progress' | 'Approved' | 'Rejected';
  chain: ApprovalChainLevel[];
  createdAt: string;
}

export interface OfferLetter {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  department: string;
  baseSalary: string;
  bonus: string;
  equity: string;
  joiningDate: string;
  reportingManager: string;
  location: string;
  benefitsSummary: string;
  expirationDate: string;
  status: 'Draft' | 'Sent' | 'Signed' | 'Declined';
  signatureData?: string;
  generatedAt: string;
}

export interface CandidateDocument {
  id: string;
  candidateId: string;
  candidateName: string;
  fileName: string;
  fileType: 'Resume' | 'Certificate' | 'Educational Document' | 'Offer Letter' | 'Identity Document' | 'Experience Letter';
  fileSize: string;
  uploadedAt: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Rejected';
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  userName: string;
  userRole: string;
  operation: string;
  candidateName: string;
  candidateId?: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface AutomationAnalyticsData {
  automationSuccessRate: number;
  totalAiTasksCompleted: number;
  avgRecruitmentDays: number;
  timeToHireReductionPercent: number;
  activeWorkflowsCount: number;
  recruiterProductivityScore: number;
  monthlyAutomatedActions: { month: string; tasksCompleted: number; hoursSaved: number }[];
  stageVelocityDays: { stage: string; avgDays: number }[];
}



