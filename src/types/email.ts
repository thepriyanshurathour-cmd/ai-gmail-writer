export type EmailLength = 'concise' | 'standard' | 'detailed';

export interface SubjectLineOption {
  text: string;
  badge: string;
}

export interface PrimaryEmail {
  greeting: string;
  body: string;
  closing: string;
  signOff: string;
  fullText: string;
}

export interface AlternativeVariant {
  title: string;
  description: string;
  fullText: string;
}

export interface ToneAnalysis {
  primaryTone: string;
  politenessRating: string;
  estimatedReadTimeSeconds: number;
  keyTakeaway: string;
}

export interface GeneratedEmailResponse {
  subjectLines: SubjectLineOption[];
  selectedSubject: string;
  primaryEmail: PrimaryEmail;
  alternativeVariant: AlternativeVariant;
  toneAnalysis: ToneAnalysis;
  suggestedFollowUps: string[];
}

export interface EmailDraftRecord {
  id: string;
  timestamp: number;
  description: string;
  tone: string;
  subject: string;
  fullText: string;
  recipient?: string;
  isStarred?: boolean;
}

export interface RefineResponse {
  refinedSubject: string;
  refinedEmail: string;
  summaryOfChanges: string;
}
