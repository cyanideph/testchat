import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  updateUser: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  updateUser: async () => {}
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUser = async (updates: { displayName?: string; photoURL?: string }) => {
    if (user) {
      try {
        await updateProfile(user, updates);
        setUser({ ...user, ...updates } as User);
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
