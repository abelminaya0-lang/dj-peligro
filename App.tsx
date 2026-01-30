
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
    return saved ? JSON.parse(saved) : ['Merengue', 'Villera', 'Reguetón', 'Electrónica', 'Rock', 'Salsa'];
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

  const [isDarkMode] = useState(true);

  const [voterId] = useState(() => {
    let id = localStorage.getItem('voter_device_id');
    if (!id) {
      id = 'v-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('voter_device_id', id);
    }
    return id;
  });

  // SINCRONIZACIÓN EN TIEMPO REAL ENTRE PESTAÑAS
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'voting_mode' && e.newValue) setVotingMode(e.newValue as VotingMode);
      if (e.key === 'active_songs' && e.newValue) setActiveSongs(JSON.parse(e.newValue));
      if (e.key === 'active_genres' && e.newValue) setActiveGenres(JSON.parse(e.newValue));
      if (e.key === 'dj_votes' && e.newValue) setVotes(JSON.parse(e.newValue));
      if (e.key === 'voting_ends_at') setVotingEndsAt(e.newValue ? Number(e.newValue) : null);
      if (e.key === 'dj_user' && e.newValue) setDjUser(JSON.parse(e.newValue));
      
      // Si el DJ reinicia la sesión, limpiamos el estado de voto local de esta pestaña también
      if (e.key === 'has_voted' && e.newValue === null) {
        // La pestaña reaccionará al cambio en la vista del usuario automáticamente
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('voting_mode', votingMode);
    localStorage.setItem('active_songs', JSON.stringify(activeSongs));
    localStorage.setItem('active_genres', JSON.stringify(activeGenres));
    localStorage.setItem('dj_votes', JSON.stringify(votes));
    localStorage.setItem('dj_user', JSON.stringify(djUser));
    if (votingEndsAt) localStorage.setItem('voting_ends_at', votingEndsAt.toString());
    else localStorage.removeItem('voting_ends_at');
  }, [votingMode, activeSongs, activeGenres, votes, djUser, votingEndsAt]);

  const handleVote = useCallback((targetId: string, voterName?: string, voterPhone?: string) => {
    const alreadyVoted = localStorage.getItem('has_voted') === 'true';
    if (alreadyVoted) return;

    const newVote: Vote = {
      id: Math.random().toString(36).substr(2, 9),
      targetId,
      voterId: voterId,
      voterName,
      voterPhone,
      timestamp: Date.now(),
    };

    const updatedVotes = [...votes, newVote];
    setVotes(updatedVotes);
    
    // Forzamos el guardado inmediato para que otras pestañas lo vean
    localStorage.setItem('dj_votes', JSON.stringify(updatedVotes));
    localStorage.setItem('has_voted', 'true');
    
    // Notificamos manualmente el evento storage para la misma pestaña (opcional, pero ayuda a la consistencia)
    window.dispatchEvent(new Event('storage'));
  }, [voterId, votes]);

  const updateSession = useCallback((mode: VotingMode, songs: Song[], genres: string[]) => {
    setVotingMode(mode);
    setActiveSongs(songs);
    setActiveGenres(genres);
    setVotes([]);
    setVotingEndsAt(null);
    localStorage.removeItem('has_voted');
    localStorage.removeItem('voting_ends_at');
    localStorage.setItem('dj_votes', JSON.stringify([]));
    localStorage.setItem('voting_mode', mode);
    localStorage.setItem('active_songs', JSON.stringify(songs));
    localStorage.setItem('active_genres', JSON.stringify(genres));
    
    // Disparamos evento para sincronizar inmediatamente
    window.dispatchEvent(new Event('storage'));
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0D0D0D] text-white selection:bg-[#F2CB05]/30">
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
                toggleTheme={() => {}}
              />
            } 
          />
          <Route 
            path="/admin" 
            element={
              djUser.isAuthenticated ? <Navigate to="/dashboard" replace /> : 
              <DjLogin onLogin={(email) => setDjUser({ email, isAuthenticated: true })} isDarkMode={isDarkMode} toggleTheme={() => {}} />
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
                  onReset={() => { 
                    setVotes([]); 
                    setVotingEndsAt(null); 
                    localStorage.removeItem('has_voted');
                    localStorage.setItem('dj_votes', JSON.stringify([]));
                    localStorage.removeItem('voting_ends_at');
                    window.dispatchEvent(new Event('storage'));
                  }} 
                  onLogout={() => {
                    setDjUser({ email: '', isAuthenticated: false });
                    localStorage.removeItem('dj_user');
                    window.dispatchEvent(new Event('storage'));
                  }}
                  onUpdateSession={updateSession}
                  votingEndsAt={votingEndsAt}
                  onStartVoting={(m) => {
                    const end = Date.now() + m * 60000;
                    setVotingEndsAt(end);
                    localStorage.setItem('voting_ends_at', end.toString());
                    window.dispatchEvent(new Event('storage'));
                  }}
                  onStopVoting={() => {
                    setVotingEndsAt(null);
                    localStorage.removeItem('voting_ends_at');
                    window.dispatchEvent(new Event('storage'));
                  }}
                  isDarkMode={isDarkMode}
                  toggleTheme={() => {}}
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
