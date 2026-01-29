
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import StatsChart from './StatsChart';
import { LogOut, RotateCcw, Activity, BarChart3, ListMusic, Home, Timer, Play, Square, Save, Music, Disc } from 'lucide-react';

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
    if (confirm('¿Quieres cambiar el modo de votación? Se reiniciarán los votos actuales.')) {
      onUpdateSession(editMode, editSongs, editGenres);
    }
  };

  const stats = useMemo(() => {
    const total = votes.length;
    const items = editMode === 'songs' ? editSongs.map(s => s.title) : editGenres;
    return items.map(name => {
      const count = votes.filter(v => v.targetId === (editMode === 'songs' ? editSongs.find(s => s.title === name)?.id : name)).length;
      return { name, voteCount: count, percentage: total > 0 ? (count / total) * 100 : 0 };
    }).sort((a, b) => b.voteCount - a.voteCount);
  }, [votes, editSongs, editGenres, editMode]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 theme-transition">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex items-center gap-6">
          <img src={DJ_LOGO} className="w-16 h-16 bg-[#F2CB05] p-2 rounded-2xl shadow-lg" alt="Logo" />
          <div>
            <h1 className="text-4xl font-black italic">PANEL <span className="text-[#F2B705]">CONTROL</span></h1>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Master Dashboard</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onReset} className="p-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl hover:text-red-500 transition-all shadow-sm">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={onLogout} className="px-6 py-4 bg-red-500/10 text-red-600 rounded-2xl font-black text-sm">CERRAR</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CONFIGURACIÓN DE RONDA */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-[3rem] shadow-xl">
            <h2 className="text-2xl font-black italic mb-8 flex items-center gap-3">
              <Disc className="text-[#F2CB05]" /> CONFIGURAR RONDA
            </h2>
            
            <div className="flex p-1 bg-[var(--bg-primary)] rounded-2xl mb-8">
              <button 
                onClick={() => setEditMode('songs')}
                className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${editMode === 'songs' ? 'bg-[#F2CB05] text-[#0D0D0D]' : 'text-neutral-500'}`}
              >
                CANCIONES
              </button>
              <button 
                onClick={() => setEditMode('genres')}
                className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${editMode === 'genres' ? 'bg-[#F2CB05] text-[#0D0D0D]' : 'text-neutral-500'}`}
              >
                GÉNEROS
              </button>
            </div>

            {editMode === 'songs' ? (
              <div className="space-y-4">
                {editSongs.map((song, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4">
                    <input 
                      placeholder="Título canción"
                      value={song.title}
                      onChange={e => handleSongChange(i, 'title', e.target.value)}
                      className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] font-bold text-sm"
                    />
                    <input 
                      placeholder="Artista"
                      value={song.artist}
                      onChange={e => handleSongChange(i, 'artist', e.target.value)}
                      className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] font-bold text-sm"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {['Reggaetón', 'Electrónica', 'Salsa', 'Cumbia'].map(g => (
                  <button 
                    key={g}
                    onClick={() => setEditGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                    className={`p-6 rounded-2xl border-2 font-black transition-all ${editGenres.includes(g) ? 'border-[#F2CB05] bg-[#F2CB05]/10 text-[#F2CB05]' : 'border-[var(--border-color)] text-neutral-400'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}

            <button 
              onClick={handleSaveSession}
              className="w-full mt-8 bg-[#F2CB05] text-[#0D0D0D] font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#F2CB05]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Save className="w-5 h-5" /> ACTUALIZAR PANTALLA PÚBLICO
            </button>
          </section>

          {/* TIMER CONTROL */}
          <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-[3rem] shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black italic mb-1">CRONÓMETRO</h3>
              <p className="text-neutral-500 text-xs font-bold uppercase">Ronda de votación activa</p>
            </div>
            <div className="text-6xl font-black tabular-nums">
              {timeLeft !== null ? `${Math.floor(timeLeft/60000)}:${String(Math.floor((timeLeft%60000)/1000)).padStart(2,'0')}` : '05:00'}
            </div>
            <div className="flex gap-3">
              {!votingEndsAt ? (
                <button onClick={() => onStartVoting(5)} className="bg-[#0D0D0D] text-white dark:bg-white dark:text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2">
                  <Play className="w-4 h-4 fill-current" /> START
                </button>
              ) : (
                <button onClick={onStopVoting} className="bg-red-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2">
                  <Square className="w-4 h-4 fill-current" /> STOP
                </button>
              )}
            </div>
          </section>
        </div>

        {/* RANKING EN VIVO */}
        <div className="space-y-8">
          <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-[3rem] shadow-xl h-full">
            <h2 className="text-2xl font-black italic mb-8 flex items-center gap-3">
              <BarChart3 className="text-[#F2CB05]" /> RANKING LIVE
            </h2>
            <div className="space-y-4">
              {stats.map((s, i) => (
                <div key={i} className="relative p-4 bg-[var(--bg-primary)] rounded-2xl overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 bg-[#F2CB05]/10 transition-all duration-1000" style={{ width: `${s.percentage}%` }}></div>
                  <div className="relative flex justify-between items-center">
                    <div>
                      <p className="font-black text-sm uppercase italic">{s.name}</p>
                      <p className="text-[10px] font-bold text-neutral-400">{s.voteCount} VOTOS</p>
                    </div>
                    <span className="text-lg font-black text-[#F2B705]">{s.percentage.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
              {votes.length === 0 && <p className="text-center py-12 text-neutral-400 font-bold uppercase text-xs italic">Esperando votos...</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DjDashboard;
