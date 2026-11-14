import { initializeApp } from 'firebase/app';
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  UserCredential,
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  doc,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const isCustomVercelDomain =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'eklavyaa-academy.vercel.app' ||
    window.location.hostname.endsWith('.eklavyaa-academy.vercel.app'));

const effectiveConfig = {
  ...firebaseConfig,
  authDomain: isCustomVercelDomain
    ? window.location.hostname
    : firebaseConfig.authDomain,
};

const app = initializeApp(effectiveConfig);

function createFirestoreInstance(): Firestore {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
}

export const db = createFirestoreInstance();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const PRIMARY_ADMIN_EMAIL = 'rushikesh.eklavyaa@gmail.com';
export const EVENT_UPLOADER_EMAILS = [
  PRIMARY_ADMIN_EMAIL,
  'enquiry.eklavya@gmail.com',
] as const;

export function formatFirebaseAuthError(error: unknown): string {
  const errObj = error as { code?: string; message?: string };
  const code = errObj?.code || '';
  const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';

  if (code === 'auth/unauthorized-domain') {
    return `Domain "${host}" is not authorized yet. Add "${host}" under Firebase Console -> Authentication -> Settings -> Authorized domains.`;
  }
  if (code === 'auth/popup-blocked') {
    return 'Sign-in popup was blocked by the browser. Use "Use Redirect Sign-In" below or allow popups.';
  }
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return 'Google sign-in popup was closed before completing. On mobile browsers, please use "Redirect Sign-In" below.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Google sign-in provider is disabled in Firebase Authentication settings.';
  }
  if (code) {
    return `Sign-in failed (${code}). ${errObj?.message || ''}`.trim();
  }
  return errObj?.message || 'Google sign-in could not complete. Please try again.';
}

export async function resolvePendingGoogleRedirect(): Promise<UserCredential | null> {
  try {
    return await getRedirectResult(auth);
  } catch (error) {
    console.error('Google redirect sign-in error:', error);
    throw error;
  }
}

export async function signInWithGoogleSmart(
  preferRedirect = false
): Promise<UserCredential | null> {
  const isTopWindow = typeof window !== 'undefined' && window.self === window.top;
  const isMobileDevice =
    typeof navigator !== 'undefined' &&
    /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);

  if (isTopWindow && (preferRedirect || (isCustomVercelDomain && isMobileDevice))) {
    await signInWithRedirect(auth, googleProvider);
    return null;
  }

  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code || '';
    const shouldFallbackToRedirect =
      isTopWindow &&
      (code === 'auth/popup-blocked' ||
        code === 'auth/operation-not-supported-in-this-environment');

    if (shouldFallbackToRedirect) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();
