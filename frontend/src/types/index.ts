export interface User {
  id: string;
  name: string;
  role: 'player' | 'observer';
}

export interface Card {
  value: string;
  selected: boolean;
}

export interface Vote {
  userId: string;
  userName: string;
  value: string | null;
}

export interface Session {
  id: string;
  name: string;
  description: string;
  status: 'waiting' | 'voting' | 'results';
  currentStory: Story | null;
  participants: User[];
}

export interface Story {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  finalEstimate: string | null;
  votes: Vote[];
}