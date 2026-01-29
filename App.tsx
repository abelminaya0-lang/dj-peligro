
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { INITIAL_SONGS } from './data';
import { Song, Vote, DJUser, VotingMode } from './types';
import GuestView from './components/GuestView';
import DjDashboard from './components/DjDashboard';
import DjLogin from './components/DjLogin';

const App: React.FC = () => {
  const [votingMode, setVotingMode] = useState<VotingMode>(() => {
    return (localStorage.getItem('voting_mode') as VotingMode) || 'songs';
  });

  const [activeSongs, setActiveSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('active_songs');
    return saved ? JSON.parse(saved) : INITIAL_SONGS.slice(0, 5);
  });

  const [activeGenres, setActiveGenres] = useState<string[]>(() => {
    const saved = localStorage.getItem('active_genres');
    return saved ? JSON.parse(saved) : ['Reggaetón', 'Electrónica', 'Salsa', 'Cumbia'];
  });

  const [votes, setVotes] = useState<Vote[]>(() => {
    const saved = localStorage.getItem('dj_votes');
    return saved ? JSON.parse(saved) : [];
  });

  const [djUser, setDjUser] = useState<DJUser>(() => {
    const saved = localStorage.getItem('dj_user');
    return saved ? JSON.parse(saved) : { email: '', isAuthenticated: false };
  });

  const [votingEndsAt, setVotingEndsAt] = useState<number | null>(() => {
    const saved = localStorage.getItem('voting_ends_at');
    return saved ? Number(saved) : null;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('voting_mode', votingMode);
    localStorage.setItem('active_songs', JSON.stringify(activeSongs));
    localStorage.setItem('active_genres', JSON.stringify(activeGenres));
    localStorage.setItem('dj_votes', JSON.stringify(votes));
    localStorage.setItem('dj_user', JSON.stringify(djUser));
    if (votingEndsAt) localStorage.setItem('voting_ends_at', votingEndsAt.toString());
    else localStorage.removeItem('voting_ends_at');
  }, [votingMode, activeSongs, activeGenres, votes, djUser, votingEndsAt]);

  const handleVote = useCallback((targetId: string) => {
    const now = Date.now();
    if (votingEndsAt && now > votingEndsAt) {
      alert("La votación ha terminado.");
      return;
    }

    const newVote: Vote = {
      id: Math.random().toString(36).substr(2, 9),
      targetId,
      voterName: 'Anónimo',
      timestamp: now,
    };
    setVotes(prev => [...prev, newVote]);
    localStorage.setItem('has_voted', 'true');
  }, [votingEndsAt]);

  const updateSession = useCallback((mode: VotingMode, songs: Song[], genres: string[]) => {
    setVotingMode(mode);
    setActiveSongs(songs);
    setActiveGenres(genres);
    setVotes([]); // Reiniciar votos al cambiar de ronda
    localStorage.removeItem('has_voted');
  }, []);

  return (
    <HashRouter>
      <div className={`min-h-screen theme-transition bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[#F2CB05]/30`}>
        <Routes>
          <Route 
            path="/" 
            element={
              <GuestView 
                mode={votingMode}
                songs={activeSongs} 
                genres={activeGenres}
                votes={votes}
                onVote={handleVote} 
                votingEndsAt={votingEndsAt}
                isDarkMode={isDarkMode}
                toggleTheme={() => setIsDarkMode(!isDarkMode)}
              />
            } 
          />
          <Route 
            path="/admin" 
            element={
              djUser.isAuthenticated ? <Navigate to="/dashboard" replace /> : 
              <DjLogin onLogin={(email) => setDjUser({ email, isAuthenticated: true })} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              djUser.isAuthenticated ? (
                <DjDashboard 
                  activeMode={votingMode}
                  activeSongs={activeSongs}
                  activeGenres={activeGenres}
                  votes={votes} 
                  onReset={() => { setVotes([]); setVotingEndsAt(null); localStorage.removeItem('has_voted'); }} 
                  onLogout={() => setDjUser({ email: '', isAuthenticated: false })}
                  onUpdateSession={updateSession}
                  votingEndsAt={votingEndsAt}
                  onStartVoting={(m) => setVotingEndsAt(Date.now() + m * 60000)}
                  onStopVoting={() => setVotingEndsAt(null)}
                  isDarkMode={isDarkMode}
                  toggleTheme={() => setIsDarkMode(!isDarkMode)}
                />
              ) : <Navigate to="/admin" replace />
            } 
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
