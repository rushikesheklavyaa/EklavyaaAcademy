import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Download,
  LogIn,
  LogOut,
  MessageCircle,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  Camera,
  Eye,
  EyeOff,
  Check,
  FileSpreadsheet,
  Inbox,
} from 'lucide-react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  AdminMemberRecord,
  AdmissionEnquiryRecord,
  EnquiryStatus,
  EventCategory,
  EventPostRecord,
  EventStatusLabel,
  ProgramRegistrationRecord,
  RegistrationStatus,
} from '../types';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../utils/firebase';
import {
  addAdminEmail,
  buildStudentWhatsAppUrl,
  checkIsAdminUser,
  compressImageFileToDataUrl,
  createEventPost,
  deleteAdmissionEnquiry,
  deleteEventPost,
  deleteProgramRegistration,
  removeAdminEmail,
  timestampToDate,
  updateAdmissionEnquiry,
  updateEventPost,
  updateProgramRegistration,
} from '../utils/api';

interface AdminDashboardProps {
  onBackHome: () => void;
}

type AdminTab = 'registrations' | 'enquiries' | 'events' | 'team';

const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'felicitation', label: 'Felicitation Program' },
  { value: 'rural-immersion', label: 'Rural Immersion' },
  { value: 'diwali', label: 'Diwali Celebration' },
  { value: 'educational-trip', label: 'Educational Trip' },
  { value: 'field-visit', label: 'Field Visits' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackHome }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPrimaryAdmin, setIsPrimaryAdmin] = useState(false);
  const [canUploadEvents, setCanUploadEvents] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('registrations');

  const [registrations, setRegistrations] = useState<ProgramRegistrationRecord[]>([]);
  const [enquiries, setEnquiries] = useState<AdmissionEnquiryRecord[]>([]);
  const [events, setEvents] = useState<EventPostRecord[]>([]);
  const [adminMembers, setAdminMembers] = useState<AdminMemberRecord[]>([]);

  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [enqStatusFilter, setEnqStatusFilter] = useState<string>('all');
  const [enqSearch, setEnqSearch] = useState('');

  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [enqNotesDraft, setEnqNotesDraft] = useState<Record<string, string>>({});
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Team access state
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [teamMsg, setTeamMsg] = useState<string | null>(null);

  // Event uploader state
  const [eventCategory, setEventCategory] = useState<EventCategory>('felicitation');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCaption, setEventCaption] = useState('');
  const [eventStatusLabel, setEventStatusLabel] = useState<EventStatusLabel>('Completed');
  const [eventFiles, setEventFiles] = useState<File[]>([]);
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [eventMsg, setEventMsg] = useState<string | null>(null);

  const flashToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 3000);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthError(null);
      if (currentUser) {
        const perms = await checkIsAdminUser();
        setIsAdmin(perms.isAdmin);
        setIsPrimaryAdmin(perms.isPrimaryAdmin);
        setCanUploadEvents(perms.canUploadEvents);
        if (!perms.isAdmin && perms.canUploadEvents) {
          setActiveTab('events');
        } else {
          setActiveTab('registrations');
        }
      } else {
        setIsAdmin(false);
        setIsPrimaryAdmin(false);
        setCanUploadEvents(false);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Admin-only listeners (registrations, enquiries, team)
  useEffect(() => {
    if (!isAdmin) {
      setRegistrations([]);
      setEnquiries([]);
      setAdminMembers([]);
      return;
    }

    const regQ = query(collection(db, 'program_registrations'), orderBy('createdAt', 'desc'));
    const unsubReg = onSnapshot(
      regQ,
      (snap) => {
        const items: ProgramRegistrationRecord[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            programId: data.programId,
            programName: data.programName || '',
            programKind: data.programKind || '',
            feeLabel: data.feeLabel || 'FREE',
            studentName: data.studentName || '',
            standard: data.standard || 'Std 10',
            board: data.board || 'CBSE',
            schoolName: data.schoolName || '',
            parentMobile: data.parentMobile || '',
            studentMobile: data.studentMobile || '',
            consentAccepted: Boolean(data.consentAccepted),
            status: (data.status || 'new') as RegistrationStatus,
            adminNotes: data.adminNotes || '',
            createdAt: timestampToDate(data.createdAt),
            updatedAt: timestampToDate(data.updatedAt),
          };
        });
        setRegistrations(items);
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'program_registrations');
        } catch {
          // logged
        }
      }
    );

    const enqQ = query(collection(db, 'admission_enquiries'), orderBy('createdAt', 'desc'));
    const unsubEnq = onSnapshot(
      enqQ,
      (snap) => {
        const items: AdmissionEnquiryRecord[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            studentName: data.studentName || '',
            parentName: data.parentName || '',
            grade: data.grade || '',
            board: data.board || '',
            schoolName: data.schoolName || '',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            message: data.message || '',
            status: (data.status || 'new') as EnquiryStatus,
            adminNotes: data.adminNotes || '',
            createdAt: timestampToDate(data.createdAt),
            updatedAt: timestampToDate(data.updatedAt),
          };
        });
        setEnquiries(items);
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'admission_enquiries');
        } catch {
          // logged
        }
      }
    );

    const teamQ = query(collection(db, 'admin_emails'));
    const unsubTeam = onSnapshot(
      teamQ,
      (snap) => {
        const list: AdminMemberRecord[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            email: data.email || d.id,
            name: data.name || '',
            role: 'admin',
            addedBy: data.addedBy || '',
            createdAt: timestampToDate(data.createdAt),
          };
        });
        setAdminMembers(list);
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'admin_emails');
        } catch {
          // logged
        }
      }
    );

    return () => {
      unsubReg();
      unsubEnq();
      unsubTeam();
    };
  }, [isAdmin]);

  // Event posts listener (for both admins and event photo uploaders)
  useEffect(() => {
    if (!canUploadEvents && !isAdmin) {
      setEvents([]);
      return;
    }

    const evQ = query(collection(db, 'event_posts'), orderBy('createdAt', 'desc'));
    const unsubEv = onSnapshot(
      evQ,
      (snap) => {
        const items: EventPostRecord[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            category: (data.category || 'felicitation') as EventCategory,
            categoryLabel: data.categoryLabel || '',
            title: data.title || '',
            caption: data.caption || '',
            eventDate: data.eventDate || '',
            statusLabel: (data.statusLabel || 'Completed') as EventStatusLabel,
            imageUrl: data.imageUrl || '',
            isPublished: Boolean(data.isPublished),
            postedBy: data.postedBy || '',
            createdAt: timestampToDate(data.createdAt),
            updatedAt: timestampToDate(data.updatedAt),
          };
        });
        setEvents(items);
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'event_posts');
        } catch {
          // logged
        }
      }
    );

    return () => unsubEv();
  }, [canUploadEvents, isAdmin]);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setAuthError('Google sign-in could not complete. Please allow popups and try again.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const metrics = useMemo(() => {
    const total = registrations.length;
    const esatCount = registrations.filter((r) => r.programId === 'esat').length;
    const tenthCount = registrations.filter(
      (r) => r.programId === 'finish-line' || r.programId === 'blitz'
    ).length;
    const twelfthCount = registrations.filter(
      (r) => r.programId === 'accounts-30' || r.programId === 'accounts-3'
    ).length;
    return { total, esatCount, tenthCount, twelfthCount };
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      if (batchFilter === 'esat' && r.programId !== 'esat') return false;
      if (
        batchFilter === 'finish-line' &&
        r.programId !== 'finish-line' &&
        r.programId !== 'blitz'
      )
        return false;
      if (
        batchFilter === 'accounts-30' &&
        r.programId !== 'accounts-30' &&
        r.programId !== 'accounts-3'
      )
        return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const match =
          r.studentName.toLowerCase().includes(q) ||
          r.schoolName.toLowerCase().includes(q) ||
          r.parentMobile.includes(q) ||
          r.studentMobile.includes(q) ||
          r.programName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [registrations, batchFilter, statusFilter, searchQuery]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (enqStatusFilter !== 'all' && e.status !== enqStatusFilter) return false;
      if (enqSearch.trim()) {
        const q = enqSearch.trim().toLowerCase();
        const match =
          e.studentName.toLowerCase().includes(q) ||
          e.parentName.toLowerCase().includes(q) ||
          e.schoolName.toLowerCase().includes(q) ||
          e.phone.includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [enquiries, enqStatusFilter, enqSearch]);

  const exportRegistrationsCsv = () => {
    const headers = [
      'Date',
      'Program',
      'Fee',
      'Student Name',
      'Standard',
      'Board',
      'School',
      'Parent Mobile',
      'Student Mobile',
      'Status',
      'Admin Notes',
    ];
    const rows = filteredRegistrations.map((r) => [
      r.createdAt ? r.createdAt.toLocaleDateString('en-IN') : '',
      r.programName,
      r.feeLabel,
      r.studentName,
      r.standard,
      r.board,
      r.schoolName,
      r.parentMobile,
      r.studentMobile || '',
      r.status,
      r.adminNotes || '',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eklavyaa-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveReg = async (r: ProgramRegistrationRecord, nextStatus?: RegistrationStatus) => {
    const notes = notesDraft[r.id] !== undefined ? notesDraft[r.id] : r.adminNotes;
    await updateProgramRegistration(r.id, nextStatus || r.status, notes);
    flashToast(`Updated ${r.studentName}`);
  };

  const handleSaveEnq = async (eRec: AdmissionEnquiryRecord, nextStatus?: EnquiryStatus) => {
    const notes = enqNotesDraft[eRec.id] !== undefined ? enqNotesDraft[eRec.id] : eRec.adminNotes;
    await updateAdmissionEnquiry(eRec.id, nextStatus || eRec.status, notes);
    flashToast(`Updated enquiry for ${eRec.studentName}`);
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeamMsg(null);
    if (!newAdminEmail.includes('@')) {
      setTeamMsg('Enter a valid Gmail address.');
      return;
    }
    await addAdminEmail(newAdminEmail, newAdminName);
    setNewAdminEmail('');
    setNewAdminName('');
    setTeamMsg('Staff account granted access.');
  };

  const handleUploadEvents = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventMsg(null);
    if (!eventTitle.trim()) {
      setEventMsg('Please enter an event title.');
      return;
    }
    const categoryMeta =
      EVENT_CATEGORIES.find((c) => c.value === eventCategory) || EVENT_CATEGORIES[0];

    setUploadingEvent(true);
    try {
      if (eventFiles.length > 0) {
        let count = 0;
        for (const f of eventFiles) {
          const dataUrl = await compressImageFileToDataUrl(f);
          await createEventPost({
            category: eventCategory,
            categoryLabel: categoryMeta.label,
            title:
              eventFiles.length > 1
                ? `${eventTitle.trim()} (${count + 1}/${eventFiles.length})`
                : eventTitle.trim(),
            caption: eventCaption.trim(),
            eventDate: eventDate.trim() || 'Academy Highlight',
            statusLabel: eventStatusLabel,
            imageUrl: dataUrl,
            isPublished: true,
          });
          count += 1;
        }
        setEventMsg(`Uploaded ${count} event photo(s).`);
      } else if (eventImageUrl.trim().startsWith('http')) {
        await createEventPost({
          category: eventCategory,
          categoryLabel: categoryMeta.label,
          title: eventTitle.trim(),
          caption: eventCaption.trim(),
          eventDate: eventDate.trim() || 'Academy Highlight',
          statusLabel: eventStatusLabel,
          imageUrl: eventImageUrl.trim(),
          isPublished: true,
        });
        setEventMsg('Uploaded event photo.');
      } else {
        setEventMsg('Select photo files or enter an https image link.');
        setUploadingEvent(false);
        return;
      }
      setEventTitle('');
      setEventDate('');
      setEventCaption('');
      setEventFiles([]);
      setEventImageUrl('');
    } catch (err) {
      setEventMsg(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadingEvent(false);
    }
  };

  // Unauthenticated view (No hardcoded emails revealed)
  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-sm font-semibold text-slate-500">Checking session...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            Academy Staff &amp; Admin Portal
          </h1>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Sign in with an authorized Eklavyaa Academy Gmail account to manage student
            registrations, enquiries, and event galleries.
          </p>
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {authError}
            </div>
          )}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all mb-3"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={onBackHome}
            className="w-full py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            Return to Website
          </button>
        </div>
      </div>
    );
  }

  // Signed in but unauthorized (Do not reveal target admin emails)
  if (!isAdmin && !canUploadEvents) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24">
        <div className="bg-white rounded-3xl border border-amber-200 shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mb-2">Access Restricted</h1>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            This Google account does not have staff or administrator permissions for the portal.
            Please switch to an authorized Academy account.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm"
            >
              Sign Out &amp; Switch Account
            </button>
            <button
              type="button"
              onClick={onBackHome}
              className="w-full py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Website
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {isAdmin ? 'Eklavyaa Admin Portal' : 'Event Photos Manager'}
              </h1>
              <p className="text-xs text-slate-500">
                {isPrimaryAdmin
                  ? 'Primary Owner Session'
                  : isAdmin
                    ? 'Staff Admin Session'
                    : 'Authorized Event Photos Uploader'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {savedToast && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg">
                <Check className="w-3.5 h-3.5" />
                {savedToast}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('registrations')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'registrations'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Registrations ({registrations.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('enquiries')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'enquiries'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                <Inbox className="w-4 h-4" />
                Enquiries ({enquiries.length})
              </button>
            </>
          )}
          {canUploadEvents && (
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'events'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              Events &amp; Photos ({events.length})
            </button>
          )}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'team'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Team Access
            </button>
          )}
        </div>

        {/* REGISTRATIONS TAB */}
        {isAdmin && activeTab === 'registrations' && (
          <div className="space-y-6">
            {/* Separated Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => setBatchFilter('all')}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  batchFilter === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold uppercase opacity-75">All Records</div>
                <div className="text-2xl font-extrabold mt-1">{metrics.total}</div>
              </button>

              <button
                type="button"
                onClick={() => setBatchFilter('esat')}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  batchFilter === 'esat'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-xs font-bold uppercase opacity-75">E-SAT Exam</div>
                <div className="text-2xl font-extrabold mt-1">{metrics.esatCount}</div>
              </button>

              <button
                type="button"
                onClick={() => setBatchFilter('finish-line')}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  batchFilter === 'finish-line'
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-orange-300'
                }`}
              >
                <div className="text-xs font-bold uppercase opacity-75">
                  Finish Line 30 · Std 10
                </div>
                <div className="text-2xl font-extrabold mt-1">{metrics.tenthCount}</div>
              </button>

              <button
                type="button"
                onClick={() => setBatchFilter('accounts-30')}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  batchFilter === 'accounts-30'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="text-xs font-bold uppercase opacity-75">
                  Finish Line 30 · 12th Accounts
                </div>
                <div className="text-2xl font-extrabold mt-1">{metrics.twelfthCount}</div>
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student, school, mobile..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  />
                </div>
                <select
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium"
                >
                  <option value="all">All Batches</option>
                  <option value="esat">E-SAT Exam</option>
                  <option value="finish-line">Finish Line 30 · Std 10</option>
                  <option value="accounts-30">Finish Line 30 · 12th Accounts</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                type="button"
                onClick={exportRegistrationsCsv}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold"
              >
                <Download className="w-4 h-4" />
                Export CSV ({filteredRegistrations.length})
              </button>
            </div>

            {/* Registrations List */}
            {filteredRegistrations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
                No matching student registrations found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRegistrations.map((reg) => {
                  const whatsappHref = buildStudentWhatsAppUrl(
                    reg.parentMobile,
                    reg.studentName,
                    reg.programName,
                    reg.standard,
                    reg.board
                  );
                  return (
                    <div
                      key={reg.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-extrabold text-slate-900">
                            {reg.studentName}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                            {reg.programName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                            {reg.standard} · {reg.board}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            Fee: {reg.feeLabel}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">
                          School: <span className="font-semibold">{reg.schoolName}</span> · Submitted:{' '}
                          {reg.createdAt ? reg.createdAt.toLocaleString('en-IN') : 'Recent'}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <a
                            href={`tel:+91${reg.parentMobile}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Parent: {reg.parentMobile}
                          </a>
                          {reg.studentMobile && (
                            <a
                              href={`tel:+91${reg.studentMobile}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              Student: {reg.studentMobile}
                            </a>
                          )}
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#25D366] text-white text-xs font-bold"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp Parent
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 lg:w-[430px]">
                        <select
                          value={reg.status}
                          onChange={(e) =>
                            handleSaveReg(reg, e.target.value as RegistrationStatus)
                          }
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <input
                          type="text"
                          value={notesDraft[reg.id] !== undefined ? notesDraft[reg.id] : reg.adminNotes}
                          onChange={(e) =>
                            setNotesDraft((prev) => ({ ...prev, [reg.id]: e.target.value }))
                          }
                          placeholder="Counselor note..."
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveReg(reg)}
                          className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                        >
                          Save
                        </button>
                        {confirmDeleteId === reg.id ? (
                          <button
                            type="button"
                            onClick={() => {
                              deleteProgramRegistration(reg.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                          >
                            Confirm
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(reg.id)}
                            aria-label="Delete registration"
                            className="p-2 rounded-xl text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ENQUIRIES TAB */}
        {isAdmin && activeTab === 'enquiries' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={enqSearch}
                  onChange={(e) => setEnqSearch(e.target.value)}
                  placeholder="Search student, parent, school, mobile..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                />
              </div>
              <select
                value={enqStatusFilter}
                onChange={(e) => setEnqStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="enrolled">Enrolled</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
                No admission enquiries yet.
              </div>
            ) : (
              filteredEnquiries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900">
                        {item.studentName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {item.grade} · {item.board}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Parent: <span className="font-semibold">{item.parentName}</span> · School:{' '}
                      {item.schoolName}
                    </p>
                    {item.message && (
                      <p className="text-xs text-slate-500 italic">"{item.message}"</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={`tel:+91${item.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {item.phone}
                      </a>
                      <a
                        href={buildStudentWhatsAppUrl(
                          item.phone,
                          item.studentName,
                          'Admission Enquiry',
                          item.grade,
                          item.board
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#25D366] text-white text-xs font-bold"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:w-[410px]">
                    <select
                      value={item.status}
                      onChange={(e) => handleSaveEnq(item, e.target.value as EnquiryStatus)}
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="closed">Closed</option>
                    </select>
                    <input
                      type="text"
                      value={
                        enqNotesDraft[item.id] !== undefined
                          ? enqNotesDraft[item.id]
                          : item.adminNotes
                      }
                      onChange={(e) =>
                        setEnqNotesDraft((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      placeholder="Notes..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEnq(item)}
                      className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAdmissionEnquiry(item.id)}
                      aria-label="Delete enquiry"
                      className="p-2 rounded-xl text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* EVENTS & PHOTOS TAB */}
        {canUploadEvents && activeTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">
                Upload Event Photographs
              </h2>
              {eventMsg && (
                <div className="mb-4 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs sm:text-sm text-indigo-800 font-medium">
                  {eventMsg}
                </div>
              )}
              <form onSubmit={handleUploadEvents} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Category
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as EventCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  >
                    {EVENT_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Event title"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Date / Month
                  </label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. November 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Status
                  </label>
                  <select
                    value={eventStatusLabel}
                    onChange={(e) => setEventStatusLabel(e.target.value as EventStatusLabel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={eventCaption}
                    onChange={(e) => setEventCaption(e.target.value)}
                    placeholder="Short highlight..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Select Device Photo(s)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setEventFiles(Array.from(e.target.files || []))}
                    className="w-full text-xs text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Or Image HTTPS Link
                  </label>
                  <input
                    type="url"
                    value={eventImageUrl}
                    onChange={(e) => setEventImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={uploadingEvent}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm disabled:opacity-60"
                  >
                    {uploadingEvent ? 'Uploading...' : 'Publish Photo(s)'}
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                >
                  <img
                    src={ev.imageUrl}
                    alt={ev.title}
                    className="w-full h-44 object-cover bg-slate-100"
                  />
                  <div className="p-4">
                    <div className="text-xs font-bold text-indigo-600 mb-1">
                      {ev.categoryLabel} · {ev.eventDate}
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 mb-3">{ev.title}</div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => updateEventPost(ev.id, { isPublished: !ev.isPublished })}
                        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700"
                      >
                        {ev.isPublished ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                            Hidden
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteEventPost(ev.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEAM ACCESS TAB (Protected emails never rendered in UI) */}
        {isAdmin && activeTab === 'team' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                Grant Staff Portal Access
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Add faculty Gmail addresses to grant them admin portal &amp; event gallery access.
              </p>
              {teamMsg && (
                <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                  {teamMsg}
                </div>
              )}
              <form onSubmit={handleAddTeamMember} className="space-y-3">
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Staff Gmail address"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                />
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Staff Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm"
                >
                  Add Authorized Staff Member
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-extrabold text-slate-900 mb-2">Authorized Accounts</h2>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">Primary Academy Owner</div>
                  <div className="text-xs text-slate-500">
                    Full Admin + Team Management (Protected by security rules)
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800">
                  Built-in
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Authorized Enquiry Event Uploader
                  </div>
                  <div className="text-xs text-slate-500">
                    Event Gallery Upload Only · No student data access (Protected by rules)
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                  Events Only
                </span>
              </div>

              {adminMembers.map((member) => (
                <div
                  key={member.email}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">{member.name || 'Staff'}</div>
                    <div className="text-xs text-slate-500">{member.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAdminEmail(member.email)}
                    className="text-xs font-bold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
