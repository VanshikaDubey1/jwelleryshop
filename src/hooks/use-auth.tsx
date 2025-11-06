'use client';

import { 
    createContext, 
    useContext, 
    useEffect, 
    useState, 
    type ReactNode 
} from 'react';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    type User 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = (email: string, password: string) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).finally(() => setLoading(false));
  };

  const signOut = async () => {
    setLoading(true);
    await firebaseSignOut(auth);
    // Use window.location for a more reliable client-side redirect after sign-out.
    window.location.href = '/login';
    setLoading(false);
  };

  const value = { user, loading, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
