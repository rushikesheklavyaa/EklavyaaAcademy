import React, { useEffect, useMemo, useState } from 'react';
import {
  Camera,
  Calendar,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  X,
  Upload,
  Link as LinkIcon,
  ShieldAlert,
  LayoutDashboard,
} from 'lucide-react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import Section from './ui/Section';
import { EventCategory, EventPostRecord, EventStatusLabel } from '../types';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../utils/firebase';
import {
  checkIsAdminUser,
  compressImageFileToDataUrl,
  createEventPost,
  deleteEventPost,
  timestampToDate,
  updateEventPost,
} from '../utils/api';

interface EventsGalleryProps {
  onOpenAdmin?: () => void;
}

const CATEGORY_OPTIONS: { value: EventCategory; label: string }[] = [
  { value: 'felicitation', label: 'Felicitation Program' },
  { value: 'rural-immersion', label: 'Rural Immersion' },
  { value: 'diwali', label: 'Diwali Celebration' },
  { value: 'educational-trip', label: 'Educational Trip' },
  { value: 'field-visit', label: 'Field Visits' },
];

const EventsGallery: React.FC<EventsGalleryProps> = ({ onOpenAdmin }) => {
  const [events, setEvents] = useState<EventPostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | EventCategory>('all');
  const [lightboxPost, setLightboxPost] = useState<EventPostRecord | null>(null);

  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [canUploadEvents, setCanUploadEvents] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [showUploader, setShowUploader] = useState(false);
  const [category, setCategory] = useState<EventCategory>('felicitation');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [statusLabel, setStatusLabel] = useState<EventStatusLabel>('Completed');
  const [uploadMode, setUploadMode] = useState<'files' | 'url'>('files');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthError(null);
      if (currentUser) {
        const perms = await checkIsAdminUser();
        setCanUploadEvents(perms.canUploadEvents);
        setIsAdmin(perms.isAdmin);
      } else {
        setCanUploadEvents(false);
        setIsAdmin(false);
        setShowUploader(false);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setLoading(true);
    const eventsQuery = canUploadEvents
      ? query(collection(db, 'event_posts'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'event_posts'), where('isPublished', '==', true));

    const unsub = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const list: EventPostRecord[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            category: (data.category || 'felicitation') as EventCategory,
            categoryLabel: data.categoryLabel || 'Academy Event',
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
        list.sort((a, b) => {
          const timeA = a.createdAt ? a.createdAt.getTime() : 0;
          const timeB = b.createdAt ? b.createdAt.getTime() : 0;
          return timeB - timeA;
        });
        setEvents(list);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        try {
          handleFirestoreError(error, OperationType.LIST, 'event_posts');
        } catch {
          // Recorded via handleFirestoreError
        }
      }
    );

    return () => unsub();
  }, [canUploadEvents]);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'all') return events;
    return events.filter((ev) => ev.category === selectedCategory);
  }, [events, selectedCategory]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      setAuthError('Google sign-in was cancelled or blocked by the browser.');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setShowUploader(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setUploadError(null);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setUploadStatusMsg(null);

    const categoryMeta =
      CATEGORY_OPTIONS.find((c) => c.value === category) || CATEGORY_OPTIONS[0];

    if (title.trim().length < 2) {
      setUploadError('Please enter a short event title.');
      return;
    }

    setIsUploading(true);
    try {
      if (uploadMode === 'url') {
        if (!imageUrlInput.trim().startsWith('http')) {
          setUploadError('Please enter a valid https image URL.');
          setIsUploading(false);
          return;
        }
        await createEventPost({
          category,
          categoryLabel: categoryMeta.label,
          title: title.trim(),
          caption: caption.trim(),
          eventDate: eventDate.trim() || 'Academy Highlight',
          statusLabel,
          imageUrl: imageUrlInput.trim(),
          isPublished: true,
        });
        setUploadStatusMsg('Photo uploaded and published to the gallery.');
      } else {
        if (selectedFiles.length === 0) {
          setUploadError('Please select at least one photo to upload.');
          setIsUploading(false);
          return;
        }
        let uploadedCount = 0;
        for (const file of selectedFiles) {
          const dataUrl = await compressImageFileToDataUrl(file);
          const photoTitle =
            selectedFiles.length > 1
              ? `${title.trim()} (${uploadedCount + 1}/${selectedFiles.length})`
              : title.trim();
          await createEventPost({
            category,
            categoryLabel: categoryMeta.label,
            title: photoTitle,
            caption: caption.trim(),
            eventDate: eventDate.trim() || 'Academy Highlight',
            statusLabel,
            imageUrl: dataUrl,
            isPublished: true,
          });
          uploadedCount += 1;
        }
        setUploadStatusMsg(
          `${uploadedCount} ${uploadedCount === 1 ? 'photo' : 'photos'} uploaded to the gallery.`
        );
      }

      setTitle('');
      setCaption('');
      setEventDate('');
      setImageUrlInput('');
      setSelectedFiles([]);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Could not upload photo. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleVisibility = async (post: EventPostRecord) => {
    await updateEventPost(post.id, { isPublished: !post.isPublished });
  };

  const handleDeletePost = async (id: string) => {
    await deleteEventPost(id);
    setConfirmDeleteId(null);
    if (lightboxPost?.id === id) {
      setLightboxPost(null);
    }
  };

  return (
    <Section id="events" bg="light">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600 mb-2">
              <Camera className="w-4 h-4" />
              Life at Eklavyaa Academy
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Academy Events, Trips &amp; Celebrations
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base">
              Real moments from Felicitation Programs, Rural Immersion, Diwali Celebrations,
              Educational Trips, and Field Visits uploaded directly by our faculty.
            </p>
          </div>

          {/* Google Auth Control */}
          <div className="flex flex-wrap items-center gap-2.5">
            {!authLoading && !user && (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 font-semibold text-xs sm:text-sm shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4 text-indigo-600" />
                Sign in with Google to Upload Photos
              </button>
            )}

            {user && canUploadEvents && (
              <>
                <button
                  type="button"
                  onClick={() => setShowUploader((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 hover:-translate-y-0.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {showUploader ? 'Close Uploader' : 'Upload Event Photos'}
                </button>
                {isAdmin && onOpenAdmin && (
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Portal
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            )}

            {user && !canUploadEvents && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Authorized Academy Gmail required to upload.</span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="font-bold underline ml-1 hover:text-amber-950"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        {authError && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {authError}
          </div>
        )}

        {/* Uploader Form for Authorized Gmail Accounts */}
        {canUploadEvents && showUploader && (
          <div className="mb-10 bg-white rounded-3xl border border-indigo-200 p-6 sm:p-8 shadow-lg">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Add Event Photos to Gallery
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload single or multiple event photographs directly from your device.
                </p>
              </div>
              <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUploadMode('files')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    uploadMode === 'files'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Device Photos
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    uploadMode === 'url'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  Image URL
                </button>
              </div>
            </div>

            {uploadError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700">
                {uploadError}
              </div>
            )}
            {uploadStatusMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 font-medium">
                {uploadStatusMsg}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Event Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Toppers Felicitation 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Event Date / Month
                </label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="e.g. November 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Status Badge
                </label>
                <select
                  value={statusLabel}
                  onChange={(e) => setStatusLabel(e.target.value as EventStatusLabel)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                >
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Caption / Event Story
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Short description of the moment, students, or activity..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                {uploadMode === 'files' ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Select Photo(s) *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {selectedFiles.length > 0 && (
                      <p className="text-xs text-indigo-700 font-medium mt-1.5">
                        {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} ready
                        for upload
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Image URL (https) *
                    </label>
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm shadow-md shadow-indigo-500/20 disabled:opacity-60"
                >
                  {isUploading ? 'Uploading Photos...' : 'Publish to Gallery'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            All Activities
          </button>
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedCategory(opt.value)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === opt.value
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid or Clean Empty State (Zero Demo Photos) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-72 rounded-2xl bg-slate-200/70 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 sm:p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              No Event Photos Posted Yet
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Real photographs from Eklavyaa Academy celebrations, field visits, and student trips
              will appear here as soon as faculty upload them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => setLightboxPost(post)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold">
                      {post.categoryLabel}
                    </span>
                    {!post.isPublished && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-bold">
                        Hidden
                      </span>
                    )}
                  </div>
                </button>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        {post.eventDate || 'Academy Event'}
                      </span>
                      <span className="font-semibold text-emerald-700">{post.statusLabel}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mb-1.5">
                      {post.title}
                    </h3>
                    {post.caption && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                        {post.caption}
                      </p>
                    )}
                  </div>

                  {canUploadEvents && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(post)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg bg-slate-100"
                      >
                        {post.isPublished ? (
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

                      {confirmDeleteId === post.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-600 text-white"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-xs font-semibold px-2 py-1.5 text-slate-500"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(post.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxPost && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxPost(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-slate-900 max-h-[65vh] flex items-center justify-center">
              <img
                src={lightboxPost.imageUrl}
                alt={lightboxPost.title}
                className="max-h-[65vh] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setLightboxPost(null)}
                aria-label="Close lightbox"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  {lightboxPost.categoryLabel}
                </span>
                <span>{lightboxPost.eventDate}</span>
                <span>·</span>
                <span className="font-semibold text-emerald-700">{lightboxPost.statusLabel}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">{lightboxPost.title}</h3>
              {lightboxPost.caption && (
                <p className="text-sm text-slate-600 leading-relaxed">{lightboxPost.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

export default EventsGallery;
