import { LucideIcon } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  description: string;
  grades: string;
  boards: string;
  icon: LucideIcon;
  image: string;
  color: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image?: string;
}

export type EventCategory =
  | 'felicitation'
  | 'rural-immersion'
  | 'diwali'
  | 'educational-trip'
  | 'field-visit';

export type EventStatusLabel = 'Completed' | 'Upcoming';

export interface EventPostInput {
  category: EventCategory;
  categoryLabel: string;
  title: string;
  caption: string;
  eventDate: string;
  statusLabel: EventStatusLabel;
  imageUrl: string;
  isPublished: boolean;
}

export interface EventPostRecord extends EventPostInput {
  id: string;
  postedBy: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface EnquiryFormData {
  studentName: string;
  parentName: string;
  grade: string;
  board: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  message: string;
}

export type ProgramId =
  | 'esat'
  | 'finish-line'
  | 'blitz'
  | 'accounts-30'
  | 'accounts-3'
  | 'boards-unlocked';

export type CoursePageTabId = 'esat' | 'finish-line';

export type FinishLineStdChoice = '10th' | '12th';

export type StudentStandard =
  | 'Std 5'
  | 'Std 6'
  | 'Std 7'
  | 'Std 8'
  | 'Std 9'
  | 'Std 10'
  | 'Std 11'
  | 'Std 12'
  | 'Std 12 (Commerce)';

export type EducationBoard = 'CBSE' | 'SSC' | 'HSC';

export type RegistrationStatus = 'new' | 'contacted' | 'enrolled' | 'cancelled';
export type EnquiryStatus = 'new' | 'contacted' | 'enrolled' | 'closed';

export interface ProgramDefinition {
  id: ProgramId;
  name: string;
  kind: string;
  durationBadge: string;
  standards: StudentStandard[];
  boards: EducationBoard[];
  feeLabel: 'FREE' | 'Rs. 2,999';
  isPaid: boolean;
  accentColor: 'amber' | 'teal' | 'coral' | 'indigo' | 'slate';
  tagline: string;
  points: string[];
  ctaLabel: string;
  feeNote?: string;
  whatsappGroupUrl?: string;
  whatsappGroupLabel?: string;
  successHeadline?: string;
  successMessage?: string;
  successHighlights?: string[];
}

export interface ProgramRegistrationInput {
  programId: ProgramId;
  programName: string;
  programKind: string;
  feeLabel: 'FREE' | 'Rs. 2,999';
  studentName: string;
  standard: StudentStandard;
  board: EducationBoard;
  schoolName: string;
  parentMobile: string;
  studentMobile: string;
  consentAccepted: boolean;
}

export interface ProgramRegistrationRecord extends ProgramRegistrationInput {
  id: string;
  status: RegistrationStatus;
  adminNotes: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface AdmissionEnquiryRecord extends EnquiryFormData {
  id: string;
  status: EnquiryStatus;
  adminNotes: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface AdminMemberRecord {
  email: string;
  name: string;
  role: 'admin';
  addedBy: string;
  createdAt: Date | null;
}