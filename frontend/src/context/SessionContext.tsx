import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User, Story, Vote } from '../types';
import * as api from '../api/apiClient';

interface SessionContextType {
  currentUser: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  joinSession: (sessionId: string, name: string, role: 'player' | 'observer') => Promise<void>;
  createSession: (name: string, description: string) => Promise<string>;
  addStory: (title: string, description: string) => Promise<void>;
  startVoting: (storyId: string) => Promise<void>;
  submitVote: (value: string) => Promise<void>;
  revealVotes: () => Promise<void>;
  resetVoting: () => Promise<void>;
  finalizeEstimate: (estimate: string) => Promise<void>;
  fetchSession: (sessionId: string) => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load session data if we have a sessionId in localStorage
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole') as 'player' | 'observer';
    
    if (sessionId && userId && userName && userRole) {
      setCurrentUser({
        id: userId,
        name: userName,
        role: userRole
      });
      
      fetchSession(sessionId);
    }
  }, []);

  const fetchSession = async (sessionId: string) => {
    try {
      setLoading(true);
      const sessionData = await api.getSession(sessionId);
      setSession(sessionData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch session data');
      console.error('Error fetching session:', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const joinSession = async (sessionId: string, name: string, role: 'player' | 'observer') => {
    try {
      setLoading(true);
      const user = await api.joinSession(sessionId, { name, role });
      setCurrentUser(user);
      
      // Save to localStorage
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userRole', user.role);
      
      await fetchSession(sessionId);
    } catch (err) {
      setError('Failed to join session');
      console.error('Error joining session:', err instanceof Error ? err.message : String(err));
      throw new Error('Failed to join session');
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (name: string, description: string): Promise<string> => {
    try {
      setLoading(true);
      const newSession = await api.createSession({
        name,
        description,
        status: 'waiting',
        currentStory: null,
        participants: []
      });
      setSession(newSession);
      return newSession.id;
    } catch (err) {
      setError('Failed to create session');
      console.error('Error creating session:', err instanceof Error ? err.message : String(err));
      throw new Error('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const addStory = async (title: string, description: string) => {
    if (!session) return;
    
    try {
      setLoading(true);
      const newStory: Omit<Story, 'id'> = {
        title,
        description,
        status: 'pending',
        finalEstimate: null,
        votes: []
      };
      
      const createdStory = await api.createStory(session.id, newStory);
      
      // If this is the first story, set it as the current story
      if (!session.currentStory) {
        await api.updateStory(session.id, createdStory.id, { status: 'active' });
      }
      
      await fetchSession(session.id);
    } catch (err) {
      setError('Failed to add story');
      console.error('Error adding story:', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const startVoting = async (storyId: string) => {
    if (!session) return;
    
    try {
      setLoading(true);
      await api.updateStory(session.id, storyId, { status: 'active' });
      await fetchSession(session.id);
    } catch (err) {
      setError('Failed to start voting');
      console.error('Error starting voting:', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async (value: string) => {
    if (!session || !session.currentStory || !currentUser) return;
    
    try {
      setLoading(true);
      const vote: Omit<Vote, 'id'> = {
        userId: currentUser.id,
        userName: currentUser.name,
        value
      };
      
      await api.submitVote(session.id, session.currentStory.id, vote);
      await fetchSession(session.id);
    } catch (err) {
      setError('Failed to submit vote');
      console.error('Error submitting vote:', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const revealVotes = async () => {
    if (!session || !session.currentStory) return;
    
    try {
      setLoading(true);
      await api.revealVotes(session.id, session.currentStory.id);
      await fetchSession(session.id);
    } catch (err) {
      setError('Failed to reveal votes');
      console.error('Error revealing votes:', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const resetVoting = async () => {
    if (!session || !session.currentStory) return;
    
    try {
      setLoading(true);
      await api.resetVotes(session.id, session.currentStory.id);
      await fetchSession(session.id);
    } catch (err) {
      setError('Failed to reset voting');
      console.error('Error resetting votes:', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const finalizeEstimate = async (estimate: string) => {
    if (!session || !session.currentStory) return;
    
    try {
      setLoading(true);
      await api.finalizeEstimate(session.id, session.currentStory.id, estimate);
      await fetchSession(session.id);
    } catch (err) {
      setError('Failed to finalize estimate');
      console.error('Error finalizing estimate:', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    session,
    loading,
    error,
    joinSession,
    createSession,
    addStory,
    startVoting,
    submitVote,
    revealVotes,
    resetVoting,
    finalizeEstimate,
    fetchSession
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};