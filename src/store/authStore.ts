'use client';
import { create } from 'zustand';
import {
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
  onAuthStateChanged, updateProfile, User
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export interface UserProfile {
  uid: string;
  studentId: string;
  name: string;
  email: string;
  avatar?: string;
  targetExam: 'JEE' | 'NEET' | 'BOTH';
  preferredLanguage: 'english' | 'hindi' | 'tamil' | 'telugu';
  grade?: string;
  board?: string;
  streakDays: number;
  totalAttempted: number;
  totalCorrect: number;
  subjectMastery: { physics: number; chemistry: number; mathematics: number; biology: number };
  onboardingComplete: boolean;
  role: 'student' | 'admin';
  createdAt: any;
}

interface AuthState {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  initialized: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  initialize: () => () => void;
}

const createUserProfile = async (firebaseUser: User, extra?: Partial<UserProfile>) => {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const profile: UserProfile = {
      uid: firebaseUser.uid,
      studentId: 'VID-' + uuidv4().split('-')[0].toUpperCase(),
      name: firebaseUser.displayName || extra?.name || 'Student',
      email: firebaseUser.email || '',
      avatar: firebaseUser.photoURL || '',
      targetExam: 'JEE',
      preferredLanguage: 'english',
      grade: '12',
      board: 'CBSE',
      streakDays: 0,
      totalAttempted: 0,
      totalCorrect: 0,
      subjectMastery: { physics: 0, chemistry: 0, mathematics: 0, biology: 0 },
      onboardingComplete: false,
      role: 'student',
      createdAt: serverTimestamp(),
      ...extra,
    };
    await setDoc(ref, profile);
    return profile;
  }
  return snap.data() as UserProfile;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  firebaseUser: null,
  loading: false,
  initialized: false,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(ref);
        const profile = snap.exists() ? snap.data() as UserProfile : await createUserProfile(firebaseUser);
        set({ user: profile, firebaseUser, initialized: true });
      } else {
        set({ user: null, firebaseUser: null, initialized: true });
      }
    });
    return unsubscribe;
  },

  signInWithGoogle: async () => {
    set({ loading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await createUserProfile(result.user);
      set({ user: profile, firebaseUser: result.user });
    } finally {
      set({ loading: false });
    }
  },

  signInWithEmail: async (email, password) => {
    set({ loading: true });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const ref = doc(db, 'users', result.user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) set({ user: snap.data() as UserProfile, firebaseUser: result.user });
    } finally {
      set({ loading: false });
    }
  },

  signUpWithEmail: async (email, password, name) => {
    set({ loading: true });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      const profile = await createUserProfile(result.user, { name });
      set({ user: profile, firebaseUser: result.user });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, firebaseUser: null });
  },

  updateUserProfile: async (data) => {
    const { user } = get();
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, data, { merge: true });
    set({ user: { ...user, ...data } });
  },
}));
