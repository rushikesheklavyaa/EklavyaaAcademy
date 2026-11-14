import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  db,
  auth,
  PRIMARY_ADMIN_EMAIL,
  EVENT_UPLOADER_EMAILS,
  OperationType,
  handleFirestoreError,
} from './firebase';
import {
  EnquiryFormData,
  EnquiryStatus,
  EventPostInput,
  ProgramRegistrationInput,
  RegistrationStatus,
} from '../types';

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyq2Ms4c1dmofZuQxPoRlUD9Ly6dsa3k_VQovhMOJ9DjuNim0o6PANN4vmES4R7F6J5xA/exec';

const PROGRAM_REGISTRATIONS_COLLECTION = 'program_registrations';
const ADMISSION_ENQUIRIES_COLLECTION = 'admission_enquiries';
const ADMIN_EMAILS_COLLECTION = 'admin_emails';
const EVENT_POSTS_COLLECTION = 'event_posts';

function syncToGoogleSheetBackground(payload: Record<string, string>) {
  if (!GOOGLE_SCRIPT_URL || !GOOGLE_SCRIPT_URL.startsWith('https')) return;
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value || '');
    });
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    }).catch(() => {
      // Ignore optional sheet sync failures when Firestore succeeds
    });
  } catch {
    // Ignore
  }
}

export async function submitProgramRegistration(
  input: ProgramRegistrationInput
): Promise<string> {
  const colRef = collection(db, PROGRAM_REGISTRATIONS_COLLECTION);
  const newDocRef = doc(colRef);
  const docId = newDocRef.id;

  const sanitized = {
    programId: input.programId,
    programName: input.programName.trim().slice(0, 80),
    programKind: input.programKind.trim().slice(0, 80),
    feeLabel: input.feeLabel,
    studentName: input.studentName.trim().slice(0, 100),
    standard: input.standard,
    board: input.board,
    schoolName: input.schoolName.trim().slice(0, 150),
    parentMobile: input.parentMobile.trim().slice(0, 10),
    studentMobile: input.studentMobile.trim().slice(0, 10),
    consentAccepted: true,
    status: 'new' as const,
    adminNotes: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(newDocRef, sanitized);
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.CREATE,
      `${PROGRAM_REGISTRATIONS_COLLECTION}/${docId}`
    );
  }

  syncToGoogleSheetBackground({
    SheetName: 'Term 2 Registrations',
    FormType: sanitized.programName,
    StudentName: sanitized.studentName,
    Standard: sanitized.standard,
    Board: sanitized.board,
    SchoolName: sanitized.schoolName,
    Phone: sanitized.parentMobile,
    AlternatePhone: sanitized.studentMobile || 'N/A',
    Message: `${sanitized.programKind} (${sanitized.feeLabel})`,
  });

  return docId;
}

export async function submitEnquiry(data: EnquiryFormData): Promise<boolean> {
  const colRef = collection(db, ADMISSION_ENQUIRIES_COLLECTION);
  const newDocRef = doc(colRef);
  const docId = newDocRef.id;

  const sanitized = {
    studentName: (data.studentName || '').trim().slice(0, 100),
    parentName: (data.parentName || '').trim().slice(0, 100),
    grade: (data.grade || '').trim().slice(0, 40),
    board: (data.board || '').trim().slice(0, 40),
    schoolName: (data.schoolName || '').trim().slice(0, 150),
    phone: (data.phone || '').replace(/\D/g, '').slice(0, 10),
    address: (data.address || '').trim().slice(0, 300),
    email: (data.email || '').trim().slice(0, 120),
    message: (data.message || '').trim().slice(0, 500),
    status: 'new' as const,
    adminNotes: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(newDocRef, sanitized);
  } catch (error) {
    console.error('Error submitting admission enquiry:', error);
    try {
      handleFirestoreError(
        error,
        OperationType.CREATE,
        `${ADMISSION_ENQUIRIES_COLLECTION}/${docId}`
      );
    } catch {
      return false;
    }
  }

  syncToGoogleSheetBackground({
    SheetName: 'Sheet1',
    FormType: 'Admission Enquiry',
    StudentName: sanitized.studentName,
    ParentName: sanitized.parentName,
    Standard: sanitized.grade,
    Board: sanitized.board,
    SchoolName: sanitized.schoolName,
    Phone: sanitized.phone,
    Email: sanitized.email,
    Message: sanitized.message,
    Address: sanitized.address,
  });

  return true;
}

export async function checkIsAdminUser(): Promise<{
  isAdmin: boolean;
  isPrimaryAdmin: boolean;
  canUploadEvents: boolean;
}> {
  const user = auth.currentUser;
  if (!user || !user.email || !user.emailVerified) {
    return { isAdmin: false, isPrimaryAdmin: false, canUploadEvents: false };
  }
  const email = user.email.toLowerCase();
  const isBuiltInEventUploader = EVENT_UPLOADER_EMAILS.some(
    (allowed) => allowed.toLowerCase() === email
  );
  if (email === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    return { isAdmin: true, isPrimaryAdmin: true, canUploadEvents: true };
  }
  try {
    const snap = await getDoc(doc(db, ADMIN_EMAILS_COLLECTION, email));
    const isStaffAdmin = snap.exists();
    return {
      isAdmin: isStaffAdmin,
      isPrimaryAdmin: false,
      canUploadEvents: isStaffAdmin || isBuiltInEventUploader,
    };
  } catch {
    return {
      isAdmin: false,
      isPrimaryAdmin: false,
      canUploadEvents: isBuiltInEventUploader,
    };
  }
}

export async function updateProgramRegistration(
  id: string,
  status: RegistrationStatus,
  adminNotes: string
): Promise<void> {
  const path = `${PROGRAM_REGISTRATIONS_COLLECTION}/${id}`;
  try {
    await updateDoc(doc(db, PROGRAM_REGISTRATIONS_COLLECTION, id), {
      status,
      adminNotes: adminNotes.trim().slice(0, 500),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProgramRegistration(id: string): Promise<void> {
  const path = `${PROGRAM_REGISTRATIONS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, PROGRAM_REGISTRATIONS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateAdmissionEnquiry(
  id: string,
  status: EnquiryStatus,
  adminNotes: string
): Promise<void> {
  const path = `${ADMISSION_ENQUIRIES_COLLECTION}/${id}`;
  try {
    await updateDoc(doc(db, ADMISSION_ENQUIRIES_COLLECTION, id), {
      status,
      adminNotes: adminNotes.trim().slice(0, 500),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAdmissionEnquiry(id: string): Promise<void> {
  const path = `${ADMISSION_ENQUIRIES_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, ADMISSION_ENQUIRIES_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function addAdminEmail(email: string, name: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const path = `${ADMIN_EMAILS_COLLECTION}/${normalizedEmail}`;
  const currentEmail = (auth.currentUser?.email || PRIMARY_ADMIN_EMAIL).toLowerCase();
  try {
    await setDoc(doc(db, ADMIN_EMAILS_COLLECTION, normalizedEmail), {
      email: normalizedEmail,
      name: name.trim().slice(0, 100),
      role: 'admin',
      addedBy: currentEmail,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removeAdminEmail(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const path = `${ADMIN_EMAILS_COLLECTION}/${normalizedEmail}`;
  try {
    await deleteDoc(doc(db, ADMIN_EMAILS_COLLECTION, normalizedEmail));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function createEventPost(input: EventPostInput): Promise<string> {
  const colRef = collection(db, EVENT_POSTS_COLLECTION);
  const newDocRef = doc(colRef);
  const docId = newDocRef.id;
  const postedBy = (auth.currentUser?.email || PRIMARY_ADMIN_EMAIL).toLowerCase().slice(0, 120);

  const sanitized = {
    category: input.category,
    categoryLabel: input.categoryLabel.trim().slice(0, 50),
    title: input.title.trim().slice(0, 100),
    caption: input.caption.trim().slice(0, 400),
    eventDate: input.eventDate.trim().slice(0, 40),
    statusLabel: input.statusLabel,
    imageUrl: input.imageUrl.trim().slice(0, 350000),
    isPublished: Boolean(input.isPublished),
    postedBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(newDocRef, sanitized);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${EVENT_POSTS_COLLECTION}/${docId}`);
  }

  return docId;
}

export async function updateEventPost(
  id: string,
  patch: Partial<EventPostInput>
): Promise<void> {
  const path = `${EVENT_POSTS_COLLECTION}/${id}`;
  const cleanPatch: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (patch.category !== undefined) cleanPatch.category = patch.category;
  if (patch.categoryLabel !== undefined)
    cleanPatch.categoryLabel = patch.categoryLabel.trim().slice(0, 50);
  if (patch.title !== undefined) cleanPatch.title = patch.title.trim().slice(0, 100);
  if (patch.caption !== undefined) cleanPatch.caption = patch.caption.trim().slice(0, 400);
  if (patch.eventDate !== undefined) cleanPatch.eventDate = patch.eventDate.trim().slice(0, 40);
  if (patch.statusLabel !== undefined) cleanPatch.statusLabel = patch.statusLabel;
  if (patch.imageUrl !== undefined) cleanPatch.imageUrl = patch.imageUrl.trim().slice(0, 350000);
  if (patch.isPublished !== undefined) cleanPatch.isPublished = Boolean(patch.isPublished);

  try {
    await updateDoc(doc(db, EVENT_POSTS_COLLECTION, id), cleanPatch);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteEventPost(id: string): Promise<void> {
  const path = `${EVENT_POSTS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, EVENT_POSTS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function compressImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported or corrupted image file.'));
      img.onload = () => {
        const maxWidth = 960;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        if (dataUrl.length > 280000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        }
        if (dataUrl.length > 340000) {
          reject(
            new Error(
              'Image is still too large after compression. Please pick a smaller photo or paste an image link.'
            )
          );
          return;
        }
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function timestampToDate(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  return null;
}

export function buildStudentWhatsAppUrl(
  mobile10Digits: string,
  studentName: string,
  programName: string,
  standard: string,
  board: string
): string {
  const cleanDigits = mobile10Digits.replace(/\D/g, '').slice(-10);
  const fullPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
  const text = `Hello! Greeting from *Eklavyaa Academy*.\n\nWe received *${studentName}*'s registration (${standard} · ${board}) for *${programName}*.\n\nOur team is reaching out to share batch dates, timings, and next steps. Let us know a good time to connect!`;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
}