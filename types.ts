
export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

export type VotingMode = 'songs' | 'genres';

export interface Vote {
  id: string;
  targetId: string; 
  voterId: string; 
  voterName?: string;
  voterPhone?: string;
  timestamp: number;
}

export interface DJUser {
  email: string;
  isAuthenticated: boolean;
}

export interface SongWithStats extends Song {
  voteCount: number;
  percentage: number;
}

export interface GenreStats {
  name: string;
  voteCount: number;
  percentage: number;
}
