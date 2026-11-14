import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  FileText,
  Users,
  MessageCircle,
  GraduationCap,
  ShieldCheck,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  CoursePageTabId,
  EducationBoard,
  FinishLineStdChoice,
  ProgramDefinition,
  ProgramRegistrationRecord,
  StudentStandard,
} from '../types';
import {
  ACADEMY_WHATSAPP_NUMBER,
  ESAT_SCHOLARSHIP_TIERS,
  PROGRAMS,
  TENTH_FINISH_LINE_HIGHLIGHTS,
  TENTH_FINISH_LINE_MODULES,
  TWELFTH_ACCOUNTS_HIGHLIGHTS,
  TWELFTH_ACCOUNTS_SYLLABUS,
} from '../data/programs';
import { submitProgramRegistration } from '../utils/api';

interface ProgramRegistrationPageProps {
  activeTab: CoursePageTabId;
  finishLineStd: FinishLineStdChoice;
  onTabChange: (tab: CoursePageTabId) => void;
  onFinishLineStdChange: (std: FinishLineStdChoice) => void;
  onBackHome: () => void;
}

type RegistrationTrackKey = 'esat' | '10th' | '12th';

interface SavedTrackConfirmation {
  record: ProgramRegistrationRecord;
  program: ProgramDefinition;
}

const ProgramRegistrationPage: React.FC<ProgramRegistrationPageProps> = ({
  activeTab,
  finishLineStd,
  onTabChange,
  onFinishLineStdChange,
  onBackHome,
}) => {
  const currentProgram: ProgramDefinition =
    activeTab === 'esat'
      ? PROGRAMS.esat
      : finishLineStd === '12th'
        ? PROGRAMS['accounts-30']
        : PROGRAMS['finish-line'];

  const trackKey: RegistrationTrackKey =
    activeTab === 'esat' ? 'esat' : finishLineStd === '12th' ? '12th' : '10th';

  const [studentName, setStudentName] = useState('');
  const [standard, setStandard] = useState<StudentStandard>(currentProgram.standards[0]);
  const [board, setBoard] = useState<EducationBoard>(currentProgram.boards[0]);
  const [schoolName, setSchoolName] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [studentMobile, setStudentMobile] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmations, setConfirmations] = useState<
    Partial<Record<RegistrationTrackKey, SavedTrackConfirmation>>
  >({});

  const syncDefaultsForProgram = (program: ProgramDefinition) => {
    setStandard(program.standards[0]);
    setBoard(program.boards[0]);
    setErrorMessage(null);
  };

  const handleSelectTab = (tab: CoursePageTabId) => {
    onTabChange(tab);
    const nextProgram =
      tab === 'esat'
        ? PROGRAMS.esat
        : finishLineStd === '12th'
          ? PROGRAMS['accounts-30']
          : PROGRAMS['finish-line'];
    syncDefaultsForProgram(nextProgram);
  };

  const handleSelectFinishLineStd = (std: FinishLineStdChoice) => {
    onFinishLineStdChange(std);
    const nextProgram = std === '12th' ? PROGRAMS['accounts-30'] : PROGRAMS['finish-line'];
    syncDefaultsForProgram(nextProgram);
  };

  const activeConfirmation = confirmations[trackKey] || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanParent = parentMobile.replace(/\D/g, '');
    const cleanStudent = studentMobile.replace(/\D/g, '');

    if (studentName.trim().length < 2) {
      setErrorMessage('Please enter the student full name.');
      return;
    }
    if (schoolName.trim().length < 2) {
      setErrorMessage('Please enter the school or junior college name.');
      return;
    }
    if (cleanParent.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit parent mobile number.');
      return;
    }
    if (cleanStudent && cleanStudent.length !== 10) {
      setErrorMessage('Student mobile number must be 10 digits if provided.');
      return;
    }
    if (!consentAccepted) {
      setErrorMessage('Please confirm consent so our mentors can reach out.');
      return;
    }

    const effectiveStandard = currentProgram.standards.includes(standard)
      ? standard
      : currentProgram.standards[0];
    const effectiveBoard = currentProgram.boards.includes(board)
      ? board
      : currentProgram.boards[0];

    setIsSubmitting(true);
    try {
      const docId = await submitProgramRegistration({
        programId: currentProgram.id,
        programName: currentProgram.name,
        programKind: currentProgram.kind,
        feeLabel: currentProgram.feeLabel,
        studentName: studentName.trim(),
        standard: effectiveStandard,
        board: effectiveBoard,
        schoolName: schoolName.trim(),
        parentMobile: cleanParent,
        studentMobile: cleanStudent,
        consentAccepted: true,
      });

      const savedRecord: ProgramRegistrationRecord = {
        id: docId,
        programId: currentProgram.id,
        programName: currentProgram.name,
        programKind: currentProgram.kind,
        feeLabel: currentProgram.feeLabel,
        studentName: studentName.trim(),
        standard: effectiveStandard,
        board: effectiveBoard,
        schoolName: schoolName.trim(),
        parentMobile: cleanParent,
        studentMobile: cleanStudent,
        consentAccepted: true,
        status: 'new',
        adminNotes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setConfirmations((prev) => ({
        ...prev,
        [trackKey]: {
          record: savedRecord,
          program: currentProgram,
        },
      }));
    } catch (err) {
      console.error(err);
      setErrorMessage(
        'Could not submit registration right now. Please check your internet connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAnother = () => {
    setConfirmations((prev) => {
      const next = { ...prev };
      delete next[trackKey];
      return next;
    });
    setStudentName('');
    setSchoolName('');
    setParentMobile('');
    setStudentMobile('');
    setErrorMessage(null);
  };

  const isEsat = activeTab === 'esat';
  const is12th = !isEsat && finishLineStd === '12th';

  const effectiveStandardValue = currentProgram.standards.includes(standard)
    ? standard
    : currentProgram.standards[0];
  const effectiveBoardValue = currentProgram.boards.includes(board)
    ? board
    : currentProgram.boards[0];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Academy Home
          </button>

          <div className="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => handleSelectTab('esat')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isEsat
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              E-SAT Entrance Exam
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('finish-line')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                !isEsat
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Finish Line 30 · Crash Course
            </button>
          </div>
        </div>

        {/* Dynamic 10th / 12th selector inside Finish Line 30 */}
        {!isEsat && (
          <div className="mb-8 bg-white rounded-2xl border border-orange-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
                Select Crash Course Standard
              </p>
              <p className="text-sm text-slate-600">
                Choose your board class to load the exact 30-day syllabus, batch highlights, and
                registration form.
              </p>
            </div>
            <div className="inline-flex bg-slate-100 p-1.5 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => handleSelectFinishLineStd('10th')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  finishLineStd === '10th'
                    ? 'bg-white text-orange-700 shadow-sm border border-orange-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Std 10th (CBSE &amp; SSC)
              </button>
              <button
                type="button"
                onClick={() => handleSelectFinishLineStd('12th')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  finishLineStd === '12th'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Std 12th Commerce (Accounts)
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Program Overview Column */}
          <div className="lg:col-span-6 space-y-6">
            <div
              className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl ${
                isEsat
                  ? 'bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-800'
                  : is12th
                    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950'
                    : 'bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider">
                  {isEsat ? <Award className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {currentProgram.durationBadge}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-white text-slate-900 text-xs font-extrabold tracking-wide">
                  Fee: {currentProgram.feeLabel}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                {currentProgram.name}
              </h1>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6">
                {currentProgram.tagline}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="bg-white/10 rounded-xl p-3 border border-white/15">
                  <div className="text-white/70 font-semibold text-xs mb-0.5">Eligible Classes</div>
                  <div className="font-bold">
                    {isEsat ? 'Std 5 to Std 12' : currentProgram.standards.join(', ')}
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/15">
                  <div className="text-white/70 font-semibold text-xs mb-0.5">Boards Covered</div>
                  <div className="font-bold">{currentProgram.boards.join(' · ')}</div>
                </div>
              </div>
            </div>

            {isEsat ? (
              <>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    E-SAT Exam Blueprint &amp; Highlights
                  </h2>
                  <ul className="space-y-3">
                    {currentProgram.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Guaranteed Fee Scholarship Slabs
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ESAT_SCHOLARSHIP_TIERS.map((slab) => (
                      <div
                        key={slab.tier}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-extrabold text-indigo-700 uppercase">
                            {slab.tier}
                          </span>
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                            {slab.discount}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 mb-1">Score: {slab.score}</p>
                        <p className="text-xs text-slate-600">{slab.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                    {is12th
                      ? '12th Commerce Accountancy — Complete 30-Day Syllabus'
                      : 'Std 10 Finish Line 30 — Complete Revision Modules'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(is12th ? TWELFTH_ACCOUNTS_SYLLABUS : TENTH_FINISH_LINE_MODULES).map(
                      (topic, index) => (
                        <div
                          key={topic}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700"
                        >
                          <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="font-medium">{topic}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    Batch Features &amp; Mentor Support
                  </h2>
                  <ul className="space-y-2.5">
                    {(is12th ? TWELFTH_ACCOUNTS_HIGHLIGHTS : TENTH_FINISH_LINE_HIGHLIGHTS).map(
                      (item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                  {currentProgram.feeNote && (
                    <div className="mt-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                      {currentProgram.feeNote}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Form or Post-Registration Confirmation Column */}
          <div className="lg:col-span-6">
            {activeConfirmation ? (
              <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3">
                    Registration Saved · {activeConfirmation.program.feeLabel}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                    {activeConfirmation.program.successHeadline || 'Registration Confirmed!'}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                    {activeConfirmation.program.successMessage}
                  </p>
                </div>

                {/* Course Highlights */}
                {activeConfirmation.program.successHighlights &&
                  activeConfirmation.program.successHighlights.length > 0 && (
                    <div className="mb-6 rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                        What Happens Next
                      </div>
                      {activeConfirmation.program.successHighlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-start gap-2 text-xs sm:text-sm text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Primary WhatsApp Group Join CTA */}
                {activeConfirmation.program.whatsappGroupUrl && (
                  <div className="mb-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 p-5 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
                      Mandatory Next Step
                    </p>
                    <p className="text-sm text-slate-700 mb-4">
                      Join the official batch WhatsApp group right away for timetable, updates, and
                      direct mentor announcements:
                    </p>
                    <a
                      href={activeConfirmation.program.whatsappGroupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {activeConfirmation.program.whatsappGroupLabel || 'Join Official WhatsApp Group'}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {/* Receipt Summary */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 mb-6">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                    Registration Receipt Details
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Reference ID</span>
                      <span className="font-mono font-bold text-slate-800">
                        {activeConfirmation.record.id.slice(0, 10).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Program Fee</span>
                      <span className="font-bold text-slate-900">
                        {activeConfirmation.record.feeLabel}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Student Name</span>
                      <span className="font-bold text-slate-900">
                        {activeConfirmation.record.studentName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Standard &amp; Board</span>
                      <span className="font-bold text-slate-900">
                        {activeConfirmation.record.standard} · {activeConfirmation.record.board}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[11px]">School / College</span>
                      <span className="font-semibold text-slate-800">
                        {activeConfirmation.record.schoolName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Parent Mobile</span>
                      <span className="font-semibold text-slate-800">
                        {activeConfirmation.record.parentMobile}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Student Mobile</span>
                      <span className="font-semibold text-slate-800">
                        {activeConfirmation.record.studentMobile || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleRegisterAnother}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Register Another Student
                  </button>
                  <a
                    href={`https://wa.me/${ACADEMY_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hello Eklavyaa Academy, I have completed registration for ${activeConfirmation.record.studentName} (${activeConfirmation.program.name}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm text-center transition-colors"
                  >
                    Message Academy Desk
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl">
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${
                      isEsat
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Admissions &amp; Batch Enrollment Open
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Register for {currentProgram.name}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Fill in student details carefully. After submitting, you will immediately get
                    the official WhatsApp group join link.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Aarav Kulkarni"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Standard *
                      </label>
                      <select
                        required
                        value={effectiveStandardValue}
                        onChange={(e) => setStandard(e.target.value as StudentStandard)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                      >
                        {currentProgram.standards.map((std) => (
                          <option key={std} value={std}>
                            {std}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Board *
                      </label>
                      <select
                        required
                        value={effectiveBoardValue}
                        onChange={(e) => setBoard(e.target.value as EducationBoard)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                      >
                        {currentProgram.boards.map((brd) => (
                          <option key={brd} value={brd}>
                            {brd}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      School / Junior College Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Current school or college name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Parent Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={parentMobile}
                        onChange={(e) => setParentMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit parent number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Student Mobile (Optional)
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={studentMobile}
                        onChange={(e) =>
                          setStudentMobile(e.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                        placeholder="10-digit student number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I authorize Eklavyaa Academy to contact the parent/student via call or
                      WhatsApp regarding exam links, batch timings, and scholarship/admission updates.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl text-white font-extrabold text-base transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 ${
                      isEsat
                        ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-800 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5'
                        : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/25 hover:-translate-y-0.5'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    {isSubmitting ? 'Submitting Registration...' : currentProgram.ctaLabel}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Instant seat confirmation + WhatsApp group access on submit</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramRegistrationPage;
