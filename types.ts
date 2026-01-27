
export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

export interface Vote {
  id: string;
  songId: string;
  voterName: string;
  whatsapp?: string;
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
