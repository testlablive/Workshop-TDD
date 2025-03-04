import { Session, Story, User, Vote } from "../types";
import { v4 as uuidv4 } from "uuid";

// Mock data for testing
const sessions: Session[] = [
  {
    id: "1",
    name: "Sprint Planning",
    description: "Planning session for Sprint 23",
    status: "waiting",
    currentStory: null,
    participants: [
      {
        id: "host-1",
        name: "John Doe",
        role: "player",
      },
    ],
  },
  {
    id: "2",
    name: "Backlog Refinement",
    description: "Refining user stories for the next sprint",
    status: "voting",
    currentStory: {
      id: "story-1",
      title: "User Authentication",
      description: "Implement user authentication using OAuth",
      status: "active",
      finalEstimate: null,
      votes: [
        {
          userId: "host-2",
          userName: "Jane Smith",
          value: "5",
        },
      ],
    },
    participants: [
      {
        id: "host-2",
        name: "Jane Smith",
        role: "player",
      },
      {
        id: "user-1",
        name: "Bob Johnson",
        role: "player",
      },
    ],
  },
];

const stories: Record<string, Story[]> = {
  "1": [
    {
      id: "story-2",
      title: "User Registration",
      description: "Allow users to register with email and password",
      status: "pending",
      finalEstimate: null,
      votes: [],
    },
    {
      id: "story-3",
      title: "Password Reset",
      description: "Implement password reset functionality",
      status: "completed",
      finalEstimate: "3",
      votes: [
        {
          userId: "host-1",
          userName: "John Doe",
          value: "3",
        },
        {
          userId: "user-2",
          userName: "Alice Williams",
          value: "3",
        },
      ],
    },
  ],
  "2": [
    {
      id: "story-1",
      title: "User Authentication",
      description: "Implement user authentication using OAuth",
      status: "active",
      finalEstimate: null,
      votes: [
        {
          userId: "host-2",
          userName: "Jane Smith",
          value: "5",
        },
      ],
    },
    {
      id: "story-4",
      title: "Email Notifications",
      description: "Send email notifications for important events",
      status: "pending",
      finalEstimate: null,
      votes: [],
    },
  ],
};

// Helper functions
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const mockGetSessions = async (): Promise<Session[]> => {
  await delay(500); // Simulate network delay
  return [...sessions];
};

export const mockGetSession = async (sessionId: string): Promise<Session> => {
  await delay(500);
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  // If the session has a current story, make sure it's up to date
  if (session.currentStory) {
    const sessionStories = stories[sessionId] || [];
    const currentStory = sessionStories.find(
      (s) => s.id === session.currentStory?.id
    );
    if (currentStory) {
      session.currentStory = { ...currentStory };
    }
  }

  return { ...session };
};

export const mockCreateSession = async (
  session: Omit<Session, "id">
): Promise<Session> => {
  await delay(500);
  const newSession: Session = {
    ...session,
    id: uuidv4(),
  };
  sessions.push(newSession);
  stories[newSession.id] = [];
  return { ...newSession };
};

export const mockGetStories = async (sessionId: string): Promise<Story[]> => {
  await delay(500);
  return [...(stories[sessionId] || [])];
};

export const mockCreateStory = async (
  sessionId: string,
  story: Omit<Story, "id">
): Promise<Story> => {
  await delay(500);
  const newStory: Story = {
    ...story,
    id: uuidv4(),
  };

  if (!stories[sessionId]) {
    stories[sessionId] = [];
  }

  stories[sessionId].push(newStory);
  return { ...newStory };
};

export const mockUpdateStory = async (
  sessionId: string,
  storyId: string,
  storyUpdate: Partial<Story>
): Promise<Story> => {
  await delay(500);
  const sessionStories = stories[sessionId];
  if (!sessionStories) {
    throw new Error("Session not found");
  }

  const storyIndex = sessionStories.findIndex((s) => s.id === storyId);
  if (storyIndex === -1) {
    throw new Error("Story not found");
  }

  const updatedStory = {
    ...sessionStories[storyIndex],
    ...storyUpdate,
  };

  sessionStories[storyIndex] = updatedStory;

  // If this is the active story, update it in the session
  const session = sessions.find((s) => s.id === sessionId);
  if (session && session.currentStory && session.currentStory.id === storyId) {
    session.currentStory = { ...updatedStory };
  }

  return { ...updatedStory };
};

export const mockJoinSession = async (
  sessionId: string,
  user: Omit<User, "id">
): Promise<User> => {
  await delay(500);
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  const newUser: User = {
    ...user,
    id: uuidv4(),
  };

  session.participants.push(newUser);
  return { ...newUser };
};

export const mockSubmitVote = async (
  sessionId: string,
  storyId: string,
  vote: Omit<Vote, "id">
): Promise<Vote> => {
  await delay(500);
  const sessionStories = stories[sessionId];
  if (!sessionStories) {
    throw new Error("Session not found");
  }

  const story = sessionStories.find((s) => s.id === storyId);
  if (!story) {
    throw new Error("Story not found");
  }

  // Remove existing vote from this user if it exists
  story.votes = story.votes.filter((v) => v.userId !== vote.userId);

  // Add the new vote
  story.votes.push(vote);

  // Update the story in the session if it's the current story
  const session = sessions.find((s) => s.id === sessionId);
  if (session && session.currentStory && session.currentStory.id === storyId) {
    session.currentStory = { ...story };
  }

  return { ...vote };
};

export const mockRevealVotes = async (
  sessionId: string,
  storyId: string
): Promise<Story> => {
  await delay(500);
  const sessionStories = stories[sessionId];
  if (!sessionStories) {
    throw new Error("Session not found");
  }

  const storyIndex = sessionStories.findIndex((s) => s.id === storyId);
  if (storyIndex === -1) {
    throw new Error("Story not found");
  }

  const updatedStory = {
    ...sessionStories[storyIndex],
    status: "completed" as const,
  };

  sessionStories[storyIndex] = updatedStory;

  // Update the story in the session if it's the current story
  const session = sessions.find((s) => s.id === sessionId);
  if (session && session.currentStory && session.currentStory.id === storyId) {
    session.currentStory = { ...updatedStory };
  }

  return { ...updatedStory };
};

export const mockResetVotes = async (
  sessionId: string,
  storyId: string
): Promise<Story> => {
  await delay(500);
  const sessionStories = stories[sessionId];
  if (!sessionStories) {
    throw new Error("Session not found");
  }

  const storyIndex = sessionStories.findIndex((s) => s.id === storyId);
  if (storyIndex === -1) {
    throw new Error("Story not found");
  }

  const updatedStory = {
    ...sessionStories[storyIndex],
    votes: [],
  };

  sessionStories[storyIndex] = updatedStory;

  // Update the story in the session if it's the current story
  const session = sessions.find((s) => s.id === sessionId);
  if (session && session.currentStory && session.currentStory.id === storyId) {
    session.currentStory = { ...updatedStory };
  }

  return { ...updatedStory };
};

export const mockFinalizeEstimate = async (
  sessionId: string,
  storyId: string,
  estimate: string
): Promise<Story> => {
  await delay(500);
  const sessionStories = stories[sessionId];
  if (!sessionStories) {
    throw new Error("Session not found");
  }

  const storyIndex = sessionStories.findIndex((s) => s.id === storyId);
  if (storyIndex === -1) {
    throw new Error("Story not found");
  }

  const updatedStory = {
    ...sessionStories[storyIndex],
    finalEstimate: estimate,
  };

  sessionStories[storyIndex] = updatedStory;

  // Update the story in the session if it's the current story
  const session = sessions.find((s) => s.id === sessionId);
  if (session && session.currentStory && session.currentStory.id === storyId) {
    session.currentStory = { ...updatedStory };

    // Find the next pending story and set it as current
    const nextStory = sessionStories.find((s) => s.status === "pending");
    if (nextStory) {
      session.currentStory = { ...nextStory };
    } else {
      session.currentStory = null;
    }
  }

  return { ...updatedStory };
};
