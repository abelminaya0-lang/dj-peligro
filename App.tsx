
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

  useEffect(() => {
    localStorage.setItem('dj_songs', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('dj_votes', JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem('dj_user', JSON.stringify(djUser));
  }, [djUser]);

  const handleVote = useCallback((songId: string, voterName: string, whatsapp?: string) => {
    const newVote: Vote = {
      id: Math.random().toString(36).substr(2, 9),
      songId,
      voterName,
      whatsapp,
      timestamp: Date.now(),
    };
    setVotes(prev => [...prev, newVote]);
    localStorage.setItem('has_voted', 'true');
  }, []);

  const handleResetVotes = useCallback(() => {
    setVotes([]);
  }, []);

  const handleLogout = useCallback(() => {
    setDjUser({ email: '', isAuthenticated: false });
  }, []);

  const handleUpdateSongs = useCallback((updatedSongs: Song[]) => {
    setSongs(updatedSongs);
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-neutral-950 text-white selection:bg-green-500/30">
        <Routes>
          {/* Guest Routes */}
          <Route 
            path="/" 
            element={<GuestView songs={songs} onVote={handleVote} />} 
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
