
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Song, Vote, DJUser, VotingMode } from './types';
import GuestView from './components/GuestView';
import DjDashboard from './components/DjDashboard';
import DjLogin from './components/DjLogin';
import PublicResults from './components/PublicResults';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [votingMode, setVotingMode] = useState<VotingMode>('songs');
  const [activeSongs, setActiveSongs] = useState<Song[]>([]);
  const [activeGenres, setActiveGenres] = useState<string[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [votingEndsAt, setVotingEndsAt] = useState<number | null>(null);
  const [djUser, setDjUser] = useState<DJUser>(() => {
    const saved = localStorage.getItem('dj_user');
    return saved ? JSON.parse(saved) : { email: '', isAuthenticated: false };
  });

  const loadData = async () => {
    // 1. Cargar Canciones y Votos
    const { data: canciones } = await supabase.from('CANCIONES').select('*');
    if (canciones) {
      const isSongsMode = canciones.some(c => c.genero === 'pista');
      setVotingMode(isSongsMode ? 'songs' : 'genres');
      
      const songs = canciones.filter(c => c.genero === 'pista').map(c => ({
        id: c.id.toString(),
        title: c.nombre,
        artist: 'DJ PELIGRO',
        coverUrl: `https://picsum.photos/seed/${c.nombre}/300/300`
      }));
      const genres = canciones.filter(c => c.genero !== 'pista').map(c => c.nombre);
      
      setActiveSongs(songs);
      setActiveGenres(genres);

      const allVotes: Vote[] = [];
      canciones.forEach(c => {
        const voteCount = Number(c.votos || 0);
        for(let i = 0; i < voteCount; i++) {
          allVotes.push({
            id: `${c.id}-${i}`,
            targetId: c.id.toString(),
            voterId: 'sys',
            timestamp: Date.now()
          });
        }
      });
      setVotes(allVotes);
    }

    // 2. Cargar Cronómetro Real-time
    const { data: crono } = await supabase.from('CRONOMETRO').select('*').order('created_at', { ascending: false }).limit(1);
    if (crono && crono[0] && crono[0].tiempo_fin) {
      setVotingEndsAt(new Date(crono[0].tiempo_fin).getTime());
    } else {
      setVotingEndsAt(null);
    }
  };

  useEffect(() => {
    loadData();

    const cancionesSub = supabase.channel('canciones_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'CANCIONES' }, () => loadData())
      .subscribe();

    const cronoSub = supabase.channel('crono_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'CRONOMETRO' }, () => loadData())
      .subscribe();

    return () => {
      supabase.removeChannel(cancionesSub);
      supabase.removeChannel(cronoSub);
    };
  }, []);

  const handleVote = useCallback(async (targetId: string, voterName?: string) => {
    const name = voterName || 'Anónimo';
    const { data: current } = await supabase.from('CANCIONES').select('votos, usuario').eq('id', targetId).single();
    
    if (current) {
      const newVotos = Number(current.votos || 0) + 1;
      const currentUsers = current.usuario ? current.usuario + ', ' : '';
      const newUsers = currentUsers + name;

      await supabase.from('CANCIONES').update({ 
        votos: newVotos, 
        usuario: newUsers 
      }).eq('id', targetId);

      await supabase.from('USUARIOS').insert([{ nombres: name }]);
    }
  }, []);

  const updateSession = useCallback(async (mode: VotingMode, items: string[]) => {
    await supabase.from('CANCIONES').delete().neq('id', 0);
    await supabase.from('USUARIOS').delete().neq('id', 0);
    await supabase.from('CRONOMETRO').delete().neq('id', 0);

    const toInsert = items.map(name => ({
      nombre: name,
      votos: 0,
      usuario: '',
      genero: mode === 'songs' ? 'pista' : 'genero'
    }));

    await supabase.from('CANCIONES').insert(toInsert);
    setVotingEndsAt(null);
  }, []);

  const handleStartVoting = async (minutes: number) => {
    // Primero limpiamos cronómetros viejos
    await supabase.from('CRONOMETRO').delete().neq('id', 0);
    
    const now = new Date();
    const end = new Date(now.getTime() + minutes * 60000);
    await supabase.from('CRONOMETRO').insert([{
      tiempo_inicio: now.toISOString(),
      tiempo_fin: end.toISOString()
    }]);
  };

  const handleStopVoting = async () => {
    await supabase.from('CRONOMETRO').delete().neq('id', 0);
    setVotingEndsAt(null);
  };

  const handleReset = async () => {
    await supabase.from('CANCIONES').update({ votos: 0, usuario: '' }).neq('id', 0);
    await supabase.from('USUARIOS').delete().neq('id', 0);
    await supabase.from('CRONOMETRO').delete().neq('id', 0);
    setVotes([]);
    setVotingEndsAt(null);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Routes>
          <Route path="/" element={<GuestView mode={votingMode} songs={activeSongs} genres={activeGenres} votes={votes} onVote={handleVote} votingEndsAt={votingEndsAt} isDarkMode={true} toggleTheme={() => {}} />} />
          <Route path="/results" element={<PublicResults mode={votingMode} songs={activeSongs} genres={activeGenres} votes={votes} votingEndsAt={votingEndsAt} />} />
          <Route path="/admin" element={djUser.isAuthenticated ? <Navigate to="/dashboard" replace /> : <DjLogin onLogin={(email) => { const user = { email, isAuthenticated: true }; setDjUser(user); localStorage.setItem('dj_user', JSON.stringify(user)); }} isDarkMode={true} toggleTheme={() => {}} />} />
          <Route path="/dashboard" element={djUser.isAuthenticated ? (
            <DjDashboard 
              activeMode={votingMode} activeSongs={activeSongs} activeGenres={activeGenres} votes={votes} 
              onReset={handleReset} 
              onLogout={() => { setDjUser({ email: '', isAuthenticated: false }); localStorage.removeItem('dj_user'); }}
              onUpdateSession={(mode, songs, genres) => {
                const names = mode === 'songs' ? songs.map(s => s.title) : genres;
                updateSession(mode, names);
              }}
              votingEndsAt={votingEndsAt}
              onStartVoting={handleStartVoting}
              onStopVoting={handleStopVoting}
              isDarkMode={true}
              toggleTheme={() => {}}
            />
          ) : <Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
