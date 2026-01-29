
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { INITIAL_SONGS } from './data';
import { Song, Vote, DJUser } from './types';
import GuestView from './components/GuestView';
import DjDashboard from './components/DjDashboard';
import DjLogin from './components/DjLogin';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('dj_songs');
    return saved ? JSON.parse(saved) : INITIAL_SONGS;
  });

  const [votes, setVotes] = useState<Vote[]>(() => {
    const saved = localStorage.getItem('dj_votes');
    return saved ? JSON.parse(saved) : [];
  });

  const [djUser, setDjUser] = useState<DJUser>(() => {
    const saved = localStorage.getItem('dj_user');
    return saved ? JSON.parse(saved) : { email: '', isAuthenticated: false };
  });

  // Estado para el temporizador de votación
  const [votingEndsAt, setVotingEndsAt] = useState<number | null>(() => {
    const saved = localStorage.getItem('voting_ends_at');
    return saved ? Number(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('dj_songs', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('dj_votes', JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem('dj_user', JSON.stringify(djUser));
  }, [djUser]);

  useEffect(() => {
    if (votingEndsAt) {
      localStorage.setItem('voting_ends_at', votingEndsAt.toString());
    } else {
      localStorage.removeItem('voting_ends_at');
    }
  }, [votingEndsAt]);

  const handleVote = useCallback((songId: string, voterName: string, whatsapp?: string) => {
    const now = Date.now();
    // Validar si la votación sigue activa
    if (votingEndsAt && now > votingEndsAt) {
      alert("La votación ha terminado.");
      return;
    }

    const newVote: Vote = {
      id: Math.random().toString(36).substr(2, 9),
      songId,
      voterName,
      whatsapp,
      timestamp: now,
    };
    setVotes(prev => [...prev, newVote]);
    localStorage.setItem('has_voted', 'true');
  }, [votingEndsAt]);

  const handleResetVotes = useCallback(() => {
    setVotes([]);
    setVotingEndsAt(null);
  }, []);

  const handleLogout = useCallback(() => {
    setDjUser({ email: '', isAuthenticated: false });
  }, []);

  const handleUpdateSongs = useCallback((updatedSongs: Song[]) => {
    setSongs(updatedSongs);
  }, []);

  const startVotingSession = useCallback((minutes: number) => {
    const endTime = Date.now() + (minutes * 60 * 1000);
    setVotingEndsAt(endTime);
  }, []);

  const stopVotingSession = useCallback(() => {
    setVotingEndsAt(null);
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-neutral-950 text-white selection:bg-green-500/30">
        <Routes>
          {/* Guest Routes */}
          <Route 
            path="/" 
            element={
              <GuestView 
                songs={songs} 
                onVote={handleVote} 
                votingEndsAt={votingEndsAt}
              />
            } 
          />
          
          {/* DJ Admin Routes */}
          <Route 
            path="/admin" 
            element={
              djUser.isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <DjLogin onLogin={(email) => setDjUser({ email, isAuthenticated: true })} />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              djUser.isAuthenticated ? (
                <DjDashboard 
                  songs={songs} 
                  votes={votes} 
                  onReset={handleResetVotes} 
                  onLogout={handleLogout}
                  onUpdateSongs={handleUpdateSongs}
                  votingEndsAt={votingEndsAt}
                  onStartVoting={startVotingSession}
                  onStopVoting={stopVotingSession}
                />
              ) : (
                <Navigate to="/admin" replace />
              )
            } 
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
