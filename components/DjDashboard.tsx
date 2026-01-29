
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import StatsChart from './StatsChart';
import { LogOut, RotateCcw, BarChart3, Home, Timer, Play, Square, Save, Music, Disc, Radio, LayoutDashboard, Activity, Sun, Moon, Mic2 } from 'lucide-react';

interface DjDashboardProps {
  activeMode: VotingMode;
  activeSongs: Song[];
  activeGenres: string[];
  votes: Vote[];
  onReset: () => void;
  onLogout: () => void;
  onUpdateSession: (mode: VotingMode, songs: Song[], genres: string[]) => void;
  votingEndsAt: number | null;
  onStartVoting: (minutes: number) => void;
  onStopVoting: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DjDashboard: React.FC<DjDashboardProps> = ({ 
  activeMode, activeSongs, activeGenres, votes, onReset, onLogout, 
  onUpdateSession, votingEndsAt, onStartVoting, onStopVoting, isDarkMode, toggleTheme
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<VotingMode>(activeMode);
  const [editSongs, setEditSongs] = useState<Song[]>(activeSongs);
  const [editGenres, setEditGenres] = useState<string[]>(activeGenres);

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769720682/avatars-000658755773-nboqus-t500x500-removebg-preview_r7cgsp.png";

  useEffect(() => {
    if (!votingEndsAt) { setTimeLeft(null); return; }
    const interval = setInterval(() => {
      const diff = votingEndsAt - Date.now();
      setTimeLeft(diff <= 0 ? 0 : diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [votingEndsAt]);

  const handleSongChange = (index: number, field: keyof Song, value: string) => {
    const newSongs = [...editSongs];
    newSongs[index] = { ...newSongs[index], [field]: value };
    setEditSongs(newSongs);
  };

  const handleSaveSession = () => {
    if (editMode === 'genres' && editGenres.length === 0) {
      alert("Selecciona al menos un género musical.");
      return;
    }
    if (editMode === 'songs' && editSongs.some(s => !s.title.trim())) {
      alert("Completa todos los títulos de las 5 canciones.");
      return;
    }
    if (confirm('¿Confirmar nueva ronda? Esto actualizará la pantalla de tu público y reiniciará los votos.')) {
      onUpdateSession(editMode, editSongs, editGenres);
    }
  };

  const stats = useMemo(() => {
    const total = votes.length;
    const items = activeMode === 'songs' ? activeSongs.map(s => s.title) : activeGenres;
    return items.map(name => {
      const count = votes.filter(v => v.targetId === (activeMode === 'songs' ? activeSongs.find(s => s.title === name)?.id : name)).length;
      return { name, voteCount: count, percentage: total > 0 ? (count / total) * 100 : 0 };
    }).sort((a, b) => b.voteCount - a.voteCount);
  }, [votes, activeSongs, activeGenres, activeMode]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 theme-transition">
      {/* Header Premium con Toggle de Tema */}
      <header className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-8 bg-[var(--card-bg)] p-8 rounded-[3rem] border border-[var(--border-color)] shadow-xl theme-transition">
        <div className="flex items-center gap-6">
          <img src={DJ_LOGO} className="w-20 h-20 bg-[#F2CB05] p-3 rounded-[1.8rem] shadow-xl rotate-3" alt="DJ Peligro" />
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-[var(--text-primary)]">SISTEMA <span className="text-[#F2B705]">VOTE FLOW</span></h1>
            <p className="text-neutral-500 text-xs font-black uppercase tracking-[0.4em] mt-1">DJ Peligro • Master Control</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-sm hover:scale-105 transition-all"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-[#F2CB05]" /> : <Moon className="w-5 h-5 text-[#594302]" />}
          </button>
          <Link to="/" className="flex items-center gap-2 px-6 py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl font-black text-sm hover:scale-105 transition-all text-[var(--text-primary)]">
            <Home className="w-4 h-4 text-[#F2CB05]" /> VISTA PÚBLICO
          </Link>
          <button onClick={onReset} className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl hover:text-red-500 transition-all shadow-sm text-[var(--text-primary)]">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={onLogout} className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-red-500/20 hover:opacity-90 transition-all">SALIR</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-10">
          <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden theme-transition">
            <h2 className="text-2xl font-black italic mb-10 flex items-center gap-4 uppercase text-[var(--text-primary)]">
              <Disc className="text-[#F2CB05] w-8 h-8" /> PREPARAR RONDA
            </h2>
            
            <div className="flex p-2 bg-[var(--bg-primary)] rounded-[2rem] mb-12 theme-transition">
              <button 
                onClick={() => setEditMode('songs')}
                className={`flex-1 py-6 rounded-[1.5rem] font-black text-base transition-all flex items-center justify-center gap-3 ${editMode === 'songs' ? 'bg-[#F2CB05] text-[#0D0D0D] shadow-xl' : 'text-neutral-500 hover:text-[var(--text-primary)]'}`}
              >
                <Music className="w-5 h-5" /> 5 CANCIONES
              </button>
              <button 
                onClick={() => setEditMode('genres')}
                className={`flex-1 py-6 rounded-[1.5rem] font-black text-base transition-all flex items-center justify-center gap-3 ${editMode === 'genres' ? 'bg-[#F2CB05] text-[#0D0D0D] shadow-xl' : 'text-neutral-500 hover:text-[var(--text-primary)]'}`}
              >
                <Radio className="w-5 h-5" /> GÉNEROS
              </button>
            </div>

            <div className="min-h-[320px]">
              {editMode === 'songs' ? (
                <div className="space-y-6">
                  {editSongs.map((song, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[var(--bg-primary)] rounded-full flex items-center justify-center font-black text-[#F2CB05] border border-[var(--border-color)]">
                        {i + 1}
                      </div>
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          placeholder="Título canción..."
                          value={song.title}
                          onChange={e => handleSongChange(i, 'title', e.target.value)}
                          className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] font-bold text-sm focus:border-[#F2CB05] focus:outline-none transition-all theme-transition text-[var(--text-primary)]"
                        />
                        <input 
                          placeholder="Artista"
                          value={song.artist}
                          onChange={e => handleSongChange(i, 'artist', e.target.value)}
                          className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] font-bold text-sm focus:border-[#F2CB05] focus:outline-none transition-all theme-transition text-[var(--text-primary)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {['Merengue', 'Villera', 'Reguetón', 'Electrónica', 'Rock', 'Salsa'].map(g => (
                    <button 
                      key={g}
                      onClick={() => setEditGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                      className={`p-10 rounded-[2.5rem] border-4 flex flex-col items-center gap-4 transition-all theme-transition ${editGenres.includes(g) ? 'border-[#F2CB05] bg-[#F2CB05]/5 text-[#F2CB05] shadow-lg shadow-[#F2CB05]/20 scale-105' : 'border-[var(--border-color)] text-neutral-400 opacity-60 hover:opacity-100 hover:border-[#F2CB05]/50'}`}
                    >
                      <div className="mb-2">
                        {g === 'Merengue' && <Music className="w-8 h-8" />}
                        {g === 'Villera' && <Radio className="w-8 h-8" />}
                        {g === 'Reguetón' && <Disc className="w-8 h-8" />}
                        {g === 'Electrónica' && <Activity className="w-8 h-8" />}
                        {g === 'Rock' && <Mic2 className="w-8 h-8" />}
                        {g === 'Salsa' && <Music className="w-8 h-8 animate-pulse" />}
                      </div>
                      <span className="text-xl font-black italic uppercase tracking-tighter">{g}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={handleSaveSession}
              className="w-full mt-12 bg-[#F2CB05] text-[#0D0D0D] font-black py-7 rounded-[2rem] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(242,203,5,0.3)] hover:scale-[1.03] active:scale-95 transition-all text-lg italic uppercase"
            >
              <Save className="w-7 h-7" /> ACTUALIZAR PÚBLICO
            </button>
          </section>

          <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-10 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 theme-transition">
            <div className={`text-8xl font-black tabular-nums tracking-tighter italic ${votingEndsAt ? 'text-[var(--text-primary)]' : 'text-neutral-400'}`}>
              {timeLeft !== null ? `${Math.floor(timeLeft/60000)}:${String(Math.floor((timeLeft%60000)/1000)).padStart(2,'0')}` : '05:00'}
            </div>
            
            <div className="flex gap-4">
              {!votingEndsAt ? (
                <button 
                  onClick={() => onStartVoting(5)} 
                  className="bg-[#0D0D0D] text-white dark:bg-white dark:text-black px-12 py-6 rounded-3xl font-black flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all text-lg"
                >
                  <Play className="w-5 h-5 fill-current" /> INICIAR
                </button>
              ) : (
                <button 
                  onClick={onStopVoting} 
                  className="bg-red-500 text-white px-12 py-6 rounded-3xl font-black flex items-center gap-3 shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all text-lg"
                >
                  <Square className="w-5 h-5 fill-current" /> DETENER
                </button>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-10">
          <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-10 rounded-[3.5rem] shadow-2xl h-full flex flex-col theme-transition">
            <h2 className="text-2xl font-black italic flex items-center gap-4 uppercase mb-10 text-[var(--text-primary)]">
              <BarChart3 className="text-[#F2CB05] w-8 h-8" /> RANKING LIVE
            </h2>

            <div className="flex-grow space-y-5">
              {stats.map((s, i) => (
                <div key={i} className="relative p-6 bg-[var(--bg-primary)] rounded-[2rem] overflow-hidden border border-[var(--border-color)] theme-transition">
                  <div className="absolute left-0 top-0 bottom-0 bg-[#F2CB05]/10" style={{ width: `${s.percentage}%` }}></div>
                  <div className="relative flex justify-between items-center">
                    <span className="font-black text-lg uppercase italic text-[var(--text-primary)]">{s.name}</span>
                    <span className="text-2xl font-black text-[#F2B705] italic">{s.voteCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DjDashboard;
