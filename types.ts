import { LucideIcon } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  description: string;
  grades: string; // Changed to string for easier "5th - 7th" display
  boards: string; // Changed to string for display consistency
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
  role: string; // Student or Parent
  content: string;
  image?: string;
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