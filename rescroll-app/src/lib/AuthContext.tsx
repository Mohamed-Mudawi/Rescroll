'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  username: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUsername: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoized function to fetch username
  const fetchUsername = useCallback(async (userId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching username:', error);
        return null;
      }

      return data?.username || null;
    } catch (error) {
      console.error('Unexpected error fetching username:', error);
      return null;
    }
  }, []);

  // Function to refresh username (can be called externally)
  const refreshUsername = useCallback(async () => {
    if (user) {
      const newUsername = await fetchUsername(user.id);
      setUsername(newUsername);
    }
  }, [user, fetchUsername]);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setUser(null);
            setUsername(null);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setUser(session?.user ?? null);
        }

        if (session?.user) {
          const userUsername = await fetchUsername(session.user.id);
          if (mounted) {
            setUsername(userUsername);
          }
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error in getInitialSession:', error);
        if (mounted) {
          setUser(null);
          setUsername(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!mounted) return;

        setUser(session?.user ?? null);

        if (session?.user) {
          const userUsername = await fetchUsername(session.user.id);
          if (mounted) {
            setUsername(userUsername);
          }
        } else {
          if (mounted) {
            setUsername(null);
          }
        }

        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUsername]);

  const signOut = useCallback(async () => {
    try {
      console.log('Attempting to sign out...');
      
      // Clear local state immediately for better UX
      setUser(null);
      setUsername(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
        // Don't throw here, as we've already cleared local state
      } else {
        console.log('Successfully signed out from Supabase');
      }
    } catch (error) {
      console.error('Error during signOut:', error);
    }
  }, []);

  const value = {
    user,
    username,
    loading,
    signOut,
    refreshUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}