export type UserRole = 'student' | 'admin' | 'mentor' | 'placement_cell';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  gpa?: string;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai_ml' | 'soft_skill' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  score: number; // 0 - 100
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  highlights: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location?: string;
  description: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  twitter?: string;
}

export interface CareerGoals {
  targetRoles: string[];
  preferredWorkplaceType: ('remote' | 'hybrid' | 'onsite')[];
  expectedStipend?: string;
  targetLocations: string[];
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  readinessScore: number; // 0 - 100
  completionPercentage: number; // 0 - 100
  education: Education[];
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  socials: SocialLinks;
  careerGoals: CareerGoals;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedResume {
  id: string;
  userId: string;
  fileName: string;
  uploadedAt: string;
  atsScore: number; // 0 - 100
  formatScore: number;
  keywordScore: number;
  impactScore: number;
  extractedSkills: string[];
  missingKeywords: string[];
  formattingIssues: string[];
  improvementSuggestions: string[];
  parsedText: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workplaceType: 'remote' | 'hybrid' | 'onsite';
  stipend: string;
  duration: string;
  deadline: string;
  postedDate: string;
  requiredSkills: string[];
  description: string;
  responsibilities: string[];
  perks: string[];
  applicationUrl?: string;
  postedBy: string;
  featured?: boolean;
}

export interface AICompatibilityMatch {
  internshipId: string;
  compatibilityScore: number; // 0 - 100
  skillMatchScore: number;
  missingSkills: string[];
  weakConcepts: string[];
  estimatedPrepWeeks: number;
  successProbability: number; // 0 - 100
  keyRecommendations: string[];
}

export type ApplicationStage = 'saved' | 'applied' | 'assessment' | 'interview' | 'hr' | 'offer' | 'rejected';

export interface ApplicationTimeline {
  stage: ApplicationStage;
  timestamp: string;
  note?: string;
}

export interface Application {
  id: string;
  userId: string;
  internshipId: string;
  internshipTitle: string;
  company: string;
  status: ApplicationStage;
  appliedDate: string;
  reminderDate?: string;
  notes?: string;
  stipend?: string;
  timeline: ApplicationTimeline[];
}

export interface DailyGoal {
  id: string;
  title: string;
  category: 'learning' | 'coding' | 'project' | 'interview_prep';
  durationMinutes: number;
  completed: boolean;
}

export interface LearningRoadmap {
  id: string;
  userId: string;
  targetRole: string;
  overallProgress: number; // 0 - 100
  dailyGoals: DailyGoal[];
  weeklyMilestones: {
    week: number;
    title: string;
    description: string;
    completed: boolean;
    topics: string[];
  }[];
  monthlyObjectives: string[];
  recommendedProjects: {
    title: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    description: string;
    skillsLearned: string[];
  }[];
}

export type InterviewTrack = 'technical' | 'hr' | 'behavioral' | 'coding';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedConcepts: string[];
}

export interface InterviewResponse {
  questionId: string;
  questionText: string;
  userAnswer: string;
  score: number; // 0 - 100
  feedback: string;
  keyStrengths: string[];
  improvements: string[];
  modelAnswer: string;
}

export interface MockInterviewSession {
  id: string;
  userId: string;
  track: InterviewTrack;
  date: string;
  overallScore: number; // 0 - 100
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  responses: InterviewResponse[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline' | 'roadmap' | 'interview' | 'resume' | 'system';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AdminAnalytics {
  totalStudents: number;
  totalInternships: number;
  totalApplications: number;
  averageReadinessScore: number;
  topMissingSkills: { skill: string; count: number }[];
  applicationConversionRate: number;
}
