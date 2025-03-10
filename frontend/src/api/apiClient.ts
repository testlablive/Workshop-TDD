import axios from 'axios';
import { Session, Story, User, Vote } from '../types';
import { 
  mockGetSessions, 
  mockGetSession, 
  mockCreateSession, 
  mockGetStories, 
  mockCreateStory, 
  mockUpdateStory, 
  mockJoinSession, 
  mockSubmitVote, 
  mockRevealVotes, 
  mockResetVotes, 
  mockFinalizeEstimate 
} from './mockData';

// Check if we should use mock data
const USE_MOCK_API = true;

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Create a simplified error object that can be safely serialized
    const serializedError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(serializedError);
  }
);

// API functions for sessions
export const getSessions = async (): Promise<Session[]> => {
  if (USE_MOCK_API) {
    return mockGetSessions();
  }
  const response = await api.get('/sessions');
  return response.data;
};

export const getSession = async (sessionId: string): Promise<Session> => {
  if (USE_MOCK_API) {
    return mockGetSession(sessionId);
  }
  const response = await api.get(`/sessions/${sessionId}`);
  return response.data;
};

export const createSession = async (session: Omit<Session, 'id'>): Promise<Session> => {
  if (USE_MOCK_API) {
    return mockCreateSession(session);
  }
  const response = await api.post('/sessions', session);
  return response.data;
};

// API functions for stories
export const getStories = async (sessionId: string): Promise<Story[]> => {
  if (USE_MOCK_API) {
    return mockGetStories(sessionId);
  }
  const response = await api.get(`/sessions/${sessionId}/stories`);
  return response.data;
};

export const createStory = async (sessionId: string, story: Omit<Story, 'id'>): Promise<Story> => {
  if (USE_MOCK_API) {
    return mockCreateStory(sessionId, story);
  }
  const response = await api.post(`/sessions/${sessionId}/stories`, story);
  return response.data;
};

export const updateStory = async (sessionId: string, storyId: string, story: Partial<Story>): Promise<Story> => {
  if (USE_MOCK_API) {
    return mockUpdateStory(sessionId, storyId, story);
  }
  const response = await api.put(`/sessions/${sessionId}/stories/${storyId}`, story);
  return response.data;
};

// API functions for users
export const joinSession = async (sessionId: string, user: Omit<User, 'id'>): Promise<User> => {
  if (USE_MOCK_API) {
    return mockJoinSession(sessionId, user);
  }
  const response = await api.post(`/sessions/${sessionId}/users`, user);
  return response.data;
};

// API functions for votes
export const submitVote = async (sessionId: string, storyId: string, vote: Omit<Vote, 'id'>): Promise<Vote> => {
  if (USE_MOCK_API) {
    return mockSubmitVote(sessionId, storyId, vote);
  }
  const response = await api.post(`/sessions/${sessionId}/stories/${storyId}/votes`, vote);
  return response.data;
};

export const revealVotes = async (sessionId: string, storyId: string): Promise<Story> => {
  if (USE_MOCK_API) {
    return mockRevealVotes(sessionId, storyId);
  }
  const response = await api.post(`/sessions/${sessionId}/stories/${storyId}/reveal`);
  return response.data;
};

export const resetVotes = async (sessionId: string, storyId: string): Promise<Story> => {
  if (USE_MOCK_API) {
    return mockResetVotes(sessionId, storyId);
  }
  const response = await api.post(`/sessions/${sessionId}/stories/${storyId}/reset`);
  return response.data;
};

export const finalizeEstimate = async (
  sessionId: string, 
  storyId: string, 
  estimate: string
): Promise<Story> => {
  if (USE_MOCK_API) {
    return mockFinalizeEstimate(sessionId, storyId, estimate);
  }
  const response = await api.post(`/sessions/${sessionId}/stories/${storyId}/finalize`, { estimate });
  return response.data;
};