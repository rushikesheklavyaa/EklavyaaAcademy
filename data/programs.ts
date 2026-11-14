import { ProgramDefinition, ProgramId } from '../types';

export const ACADEMY_WHATSAPP_NUMBER = '919011141618';

export const PROGRAMS: Record<ProgramId, ProgramDefinition> = {
  esat: {
    id: 'esat',
    name: 'E-SAT Scholarship Test',
    kind: 'Std 5 to 12 · Eklavyaa Scholarship & Aptitude Test',
    durationBadge: 'Std 5 to 12 · 30 Min Online',
    standards: [
      'Std 5',
      'Std 6',
      'Std 7',
      'Std 8',
      'Std 9',
      'Std 10',
      'Std 11',
      'Std 12',
    ],
    boards: ['CBSE', 'SSC', 'HSC'],
    feeLabel: 'FREE',
    isPaid: false,
    accentColor: 'indigo',
    tagline:
      '50 MCQs in 30 minutes showing how a student thinks — open to all Std 5th to 12th students with an instant scorecard and 15%–50% tuition scholarship.',
    points: [
      'Open to all Std 5th to 12th students (CBSE, SSC & HSC)',
      '50 MCQs in 30 minutes · +2 marks each · -1 for each wrong answer (100 total)',
      '3 sections: Quantitative Aptitude (20), Logical Reasoning (20), Verbal & Analytical (10)',
      'Fee scholarship for every participant: 15% to 50% off Eklavyaa Academy fees',
    ],
    ctaLabel: 'Register for E-SAT (Free)',
    whatsappGroupUrl: 'https://chat.whatsapp.com/K9uqFoRrE5t3KQZRVwkTpi?s=cl&p=i&iam=2',
    whatsappGroupLabel: 'Join E-SAT Official WhatsApp Group',
    successHeadline: 'E-SAT Entrance Exam Registration Confirmed!',
    successMessage:
      'Congratulations! Your seat for the E-SAT Scholarship & Aptitude Test (Std 5 to 12) is confirmed. Please join our official E-SAT WhatsApp group below to receive your exam link, slot schedule, sample aptitude tips, and scholarship results.',
    successHighlights: [
      'Exam Format: 50 MCQs · 30 Minutes · +2 / -1 Marking Scheme',
      'Sections: Quantitative Aptitude (20), Logical Reasoning (20), Analytical (10)',
      'Scholarship Rewards: 15% to 50% tuition fee waiver + Merit Certificate',
    ],
  },
  'finish-line': {
    id: 'finish-line',
    name: 'Finish Line 30 (Std 10 Crash Course)',
    kind: 'Std 10 · 30-Day Board Crash Course',
    durationBadge: '30 Days Intensive · Std 10 Boards',
    standards: ['Std 10'],
    boards: ['CBSE', 'SSC'],
    feeLabel: 'Rs. 2,999',
    isPaid: true,
    accentColor: 'coral',
    tagline:
      'Master Std 10 Boards in Just 30 Days! Complete syllabus revision in Mathematics, Science & English with Eklavyaa notes and full-length prelim evaluation.',
    points: [
      'Complete Std 10 Maths, Science & English syllabus in 30 days',
      'Printed Eklavyaa revision modules, formula sheets & scoring strategy',
      'Chapter-wise tests and 1 full-syllabus Prelims exam with paper checking',
      'Daily doubt solving, missed-class backup & mentorship till last board paper',
    ],
    ctaLabel: 'Register for Finish Line 30 (Std 10)',
    feeNote:
      'Finish Line 30 (Std 10) Course Fee: Rs. 2,999. Our team will share batch timings and payment details on WhatsApp after registration. No payment is collected on this page.',
    whatsappGroupUrl: 'https://chat.whatsapp.com/G3ANA4pCDlQJYEph0DqFEF?s=cl&p=i&iam=2',
    whatsappGroupLabel: 'Join 10th Std Crash Course WhatsApp Group',
    successHeadline: 'Finish Line 30 (Std 10) Registration Confirmed!',
    successMessage:
      'Welcome to Finish Line 30! Your registration for the Std 10 Board Crash Course (CBSE & SSC) has been saved. Please join our dedicated 10th Std Crash Course WhatsApp group below to receive batch timings, timetable, study notes, and fee payment details (Rs. 2,999).',
    successHighlights: [
      'Coverage: Complete Std 10 Maths, Science & English revision in 30 days',
      'Study Material: Printed Eklavyaa revision modules & formula sheets',
      'Evaluation: Chapter-wise tests & 1 full-syllabus Board Prelims exam',
    ],
  },
  blitz: {
    id: 'blitz',
    name: '3-Day Free Trial (Std 10)',
    kind: 'Std 10 · Legacy Trial',
    durationBadge: '3 Days · Std 10',
    standards: ['Std 10'],
    boards: ['CBSE', 'SSC'],
    feeLabel: 'FREE',
    isPaid: false,
    accentColor: 'teal',
    tagline: 'Legacy 3-Day Std 10 trial.',
    points: [],
    ctaLabel: 'Register',
  },
  'accounts-30': {
    id: 'accounts-30',
    name: 'Finish Line 30 (12th Commerce – Accountancy)',
    kind: 'Std 12 Commerce · 30-Day Intensive Crash Course',
    durationBadge: '30 Days Intensive · Std 12 Commerce',
    standards: ['Std 12 (Commerce)'],
    boards: ['HSC', 'CBSE'],
    feeLabel: 'Rs. 2,999',
    isPaid: true,
    accentColor: 'slate',
    tagline:
      'Master Accountancy in Just 30 Days! Get ready to strengthen your Accountancy concepts and boost your board examination preparation with our specially designed 30-Day Intensive Crash Course.',
    points: [
      'Complete syllabus coverage in 30 days',
      'Concept-wise teaching and practical problem solving',
      'Important questions and MCQ practice',
      'Chapter-wise tests and assessments',
      'Board-pattern question paper practice',
      'Formula, formats and journal entry revision',
      'Final revision and exam preparation',
    ],
    ctaLabel: 'Register for Finish Line 30 (12th Accounts)',
    feeNote:
      'Finish Line 30 (12th Commerce Accountancy) Course Fee: Rs. 2,999. Limited seats available — our team will share batch timings and payment details on WhatsApp after registration.',
    whatsappGroupUrl: 'https://chat.whatsapp.com/Ez69TQlulZ0405SwCvSZ6X?s=cl&p=i&iam=2',
    whatsappGroupLabel: 'Join 12th Accounts Crash Course WhatsApp Group',
    successHeadline: '12th Commerce – Accountancy Registration Confirmed!',
    successMessage:
      'Welcome to Finish Line 30! Your registration for the 12th Commerce – Accountancy 30-Day Intensive Crash Course has been saved. Please join our dedicated 12th Accounts WhatsApp group below for batch timings, journal format sheets, test schedule, and fee confirmation (Rs. 2,999).',
    successHighlights: [
      'Complete Syllabus: Partnership, NPO, Bills of Exchange, Shares, Ratios & Cash Flow',
      'Practice Focus: Concept-wise problem solving, MCQs & board-pattern question papers',
      'Exam Prep: Formula & journal entry revision + chapter-wise assessments',
    ],
  },
  'accounts-3': {
    id: 'accounts-3',
    name: '12th Commerce – Accountancy 3-Day Free Trial',
    kind: 'Std 12 Commerce · Legacy Trial',
    durationBadge: '3 Days · Std 12 Commerce',
    standards: ['Std 12 (Commerce)'],
    boards: ['HSC', 'CBSE'],
    feeLabel: 'FREE',
    isPaid: false,
    accentColor: 'teal',
    tagline: 'Legacy 3-Day Std 12 trial.',
    points: [],
    ctaLabel: 'Register',
  },
  'boards-unlocked': {
    id: 'boards-unlocked',
    name: 'Boards Unlocked',
    kind: 'Std 10 · 2-Hour Free Board Guidance Session',
    durationBadge: '2 Hours · Std 10',
    standards: ['Std 10'],
    boards: ['CBSE', 'SSC'],
    feeLabel: 'FREE',
    isPaid: false,
    accentColor: 'amber',
    tagline: 'A 2-hour live guidance session on how to plan, revise and write for Boards 2027.',
    points: [
      'The 90-day winning plan & 60-30-10 study formula',
      'Paper pattern, marking scheme & 75% safe-score strategy explained live',
      'Science Special: solve the paper two smart ways (Zero-Numerical & Smart-Chapter)',
      'Answer writing like a topper, spaced revision & calm exam mindset',
    ],
    ctaLabel: 'Reserve Guidance Seat',
  },
};

export const TENTH_FINISH_LINE_MODULES = [
  'Mathematics Part I (Algebra & Linear Equations)',
  'Mathematics Part II (Geometry, Trigonometry & Mensuration)',
  'Science I (Physics Numericals, Laws & Optics)',
  'Science II (Chemistry Equations & Biology Diagrams)',
  'English Grammar, Comprehension & Writing Skills',
  'Board Marking-Scheme Answer Presentation',
  'Most-Repeated Board Question Bank Practice',
  '1 Full-Syllabus Board Prelims + Live Paper Checking',
];

export const TENTH_FINISH_LINE_HIGHLIGHTS = [
  'Complete Maths, Science & English revision in 30 days',
  'Printed Eklavyaa formula sheets & crisp revision notes',
  'Daily doubt solving and missed-class recording backup',
  'Chapter-wise practice tests and speed accuracy drills',
  'Full-length Prelims evaluation with personal feedback',
  'Continuous mentor support until the final board paper',
];

export const TWELFTH_ACCOUNTS_SYLLABUS = [
  'Partnership – Introduction & Fundamentals',
  'Not-for-Profit Concerns',
  'Admission of a Partner',
  'Retirement of a Partner',
  'Death of a Partner',
  'Dissolution of Partnership Firm',
  'Bills of Exchange',
  'Issue of Shares',
  'Financial Statement Analysis, Cash Flow & Ratios',
  'Theory & Objective Preparation',
];

export const TWELFTH_ACCOUNTS_HIGHLIGHTS = [
  'Complete syllabus coverage in 30 days',
  'Concept-wise teaching and practical problem solving',
  'Important questions and MCQ practice',
  'Chapter-wise tests and assessments',
  'Board-pattern question paper practice',
  'Formula, formats and journal entry revision',
  'Final revision and exam preparation',
];

export const ESAT_SCHOLARSHIP_TIERS = [
  {
    tier: 'Gold Merit Scholar',
    score: '90% and above',
    discount: '50% OFF Fees',
    detail: 'Gold Merit certificate & highest fee waiver',
  },
  {
    tier: 'Silver Distinction',
    score: '80% and above',
    discount: '30% OFF Fees',
    detail: 'Distinction certificate & fee scholarship',
  },
  {
    tier: 'Qualified for Counseling',
    score: '50% and above',
    discount: '25% OFF Fees',
    detail: 'Qualification certificate & family counseling',
  },
  {
    tier: 'Participant',
    score: 'Below 50%',
    discount: '15% OFF Fees',
    detail: 'Participation certificate & improvement tips',
  },
];
