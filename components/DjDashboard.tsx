
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import { LogOut, RotateCcw, BarChart3, Home, Timer, Play, Square, Save, Music, Disc, Radio, Activity, Sun, Moon, Mic2, Zap, Trophy } from 'lucide-react';

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
      const targetId = activeMode === 'songs' ? activeSongs.find(s => s.title === name)?.id : name;
      const count = votes.filter(v => v.targetId === targetId).length;
      return { name, voteCount: count, percentage: total > 0 ? (count / total) * 100 : 0 };
    }).sort((a, b) => b.voteCount - a.voteCount);
  }, [votes, activeSongs, activeGenres, activeMode]);

  const winner = stats[0]?.voteCount > 0 ? stats[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 theme-transition">
      {/* 1. HEADER PRINCIPAL */}
      <header className="flex flex-col lg:flex-row justify-between items-center bg-[var(--card-bg)] p-6 md:p-8 rounded-[2.5rem] border border-[var(--border-color)] shadow-xl theme-transition gap-6">
        <div className="flex items-center gap-5">
          <img src={DJ_LOGO} className="w-16 h-16 bg-[#F2CB05] p-2.5 rounded-2xl shadow-lg rotate-3" alt="DJ Peligro" />
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-[var(--text-primary)] leading-tight uppercase">SISTEMA <span className="text-[#F2B705]">VOTE FLOW</span></h1>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.4em]">Master Control • Live</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={toggleTheme} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:scale-105 transition-all">
            {isDarkMode ? <Sun className="w-5 h-5 text-[#F2CB05]" /> : <Moon className="w-5 h-5 text-[#594302]" />}
          </button>
          <Link to="/" className="flex items-center gap-2 px-6 py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl font-black text-xs hover:scale-105 transition-all text-[var(--text-primary)] uppercase tracking-widest">
            <Home className="w-4 h-4 text-[#F2CB05]" /> VISTA PÚBLICO
          </Link>
          <button onClick={onReset} className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl hover:text-red-500 transition-all text-[var(--text-primary)]">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={onLogout} className="px-6 py-4 bg-red-500 text-white rounded-xl font-black text-xs shadow-lg shadow-red-500/20 hover:opacity-90 transition-all uppercase tracking-widest italic">CERRAR</button>
        </div>
      </header>

      {/* 2. PANEL DE CONTROL EN TIEMPO REAL (TIMER + BOTÓN INICIAR) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-2 border-[#F2CB05]/30 p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-32 h-32 text-[#F2CB05]" />
          </div>
          
          <div className="text-center md:text-left space-y-2 relative z-10">
            <div className="flex items-center gap-2 text-[#F2CB05] font-black text-[10px] uppercase tracking-[0.5em] mb-1">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${votingEndsAt ? 'bg-red-400' : 'bg-green-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${votingEndsAt ? 'bg-red-500' : 'bg-green-500'}`}></span>
              </span>
              {votingEndsAt ? 'Votación Activa' : 'Sistema en Espera'}
            </div>
            <div className={`text-7xl md:text-9xl font-black tabular-nums tracking-tighter italic leading-none transition-all ${votingEndsAt ? 'text-white' : 'text-neutral-700'}`}>
              {timeLeft !== null ? `${Math.floor(timeLeft/60000)}:${String(Math.floor((timeLeft%60000)/1000)).padStart(2,'0')}` : '05:00'}
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            {!votingEndsAt ? (
              <button 
                onClick={() => onStartVoting(5)} 
                className="w-full bg-[#F2CB05] hover:bg-[#F2B705] text-[#0D0D0D] px-16 py-8 rounded-3xl font-black flex flex-col items-center gap-1 shadow-[0_20px_60px_-10px_rgba(242,203,5,0.4)] hover:scale-[1.05] active:scale-95 transition-all text-2xl italic uppercase group"
              >
                <div className="flex items-center gap-3">
                  <Play className="w-8 h-8 fill-current" /> INICIAR
                </div>
                <span className="text-[10px] tracking-[0.3em] font-bold opacity-70">ABRIR VOTOS (5:00)</span>
              </button>
            ) : (
              <button 
                onClick={onStopVoting} 
                className="w-full bg-red-500 text-white px-16 py-8 rounded-3xl font-black flex flex-col items-center gap-1 shadow-[0_20px_60px_-10px_rgba(239,68,68,0.4)] hover:scale-[1.05] active:scale-95 transition-all text-2xl italic uppercase"
              >
                <div className="flex items-center gap-3">
                  <Square className="w-8 h-8 fill-current" /> DETENER
                </div>
                <span className="text-[10px] tracking-[0.3em] font-bold opacity-70">CERRAR VOTOS AHORA</span>
              </button>
            )}
          </div>
        </div>

        {/* WINNER PREVIEW CARD */}
        <div className="bg-[#151515] border border-[var(--border-color)] p-8 rounded-[3rem] shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden group">
          {winner ? (
            <>
              <div className="absolute top-0 right-0 p-3 bg-[#F2CB05] text-[#0D0D0D] rounded-bl-3xl font-black text-[10px] uppercase tracking-tighter italic">LÍDER ACTUAL</div>
              <Trophy className="w-12 h-12 text-[#F2CB05] mb-4 animate-bounce" />
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1 leading-none">{winner.name}</h3>
              <p className="text-[#F2CB05] font-black text-4xl italic">{winner.voteCount} <span className="text-[12px] uppercase opacity-60">Votos</span></p>
              <div className="mt-4 w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-[#F2CB05] h-full transition-all duration-1000 shadow-[0_0_15px_#F2CB05]" style={{ width: `${winner.percentage}%` }}></div>
              </div>
            </>
          ) : (
            <>
              <Activity className="w-12 h-12 text-neutral-800 mb-4" />
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-neutral-600">ESPERANDO DATOS...</h3>
            </>
          )}
        </div>
      </section>

      {/* 3. RANKING LIVE CON BARRAS DE PROGRESO */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 md:p-10 rounded-[3.5rem] shadow-2xl theme-transition overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-black italic flex items-center gap-4 uppercase text-[var(--text-primary)]">
              <BarChart3 className="text-[#F2CB05] w-8 h-8" /> RESULTADOS EN TIEMPO REAL
            </h2>
            <p className="text-neutral-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-1 ml-12">Total acumulado: {votes.length} votos registrados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="group relative p-6 bg-[var(--bg-primary)] rounded-[2.5rem] border border-[var(--border-color)] hover:border-[#F2CB05]/40 transition-all theme-transition">
              <div className="flex justify-between items-end mb-4 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1 italic">#0{i+1} RANK</span>
                  <span className="font-black text-xl uppercase italic text-[var(--text-primary)] leading-none truncate max-w-[180px]">{s.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-[#F2B705] italic leading-none">{Math.round(s.percentage)}<span className="text-xs ml-0.5">%</span></span>
                  <p className="text-[10px] font-black text-neutral-500 uppercase">{s.voteCount} VOTOS</p>
                </div>
              </div>
              
              <div className="h-3 bg-neutral-900/50 rounded-full border border-white/5 relative overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out shadow-[0_0_20px_-2px_currentColor] ${i === 0 ? 'bg-[#F2CB05] text-[#F2CB05]' : 'bg-neutral-600 text-neutral-600 opacity-60'}`}
                  style={{ width: `${s.percentage}%` }}
                ></div>
                {/* Indicador de carga sutil */}
                {votingEndsAt && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PREPARACIÓN DE SESIÓN (ABAJO) */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 md:p-10 rounded-[3.5rem] shadow-2xl theme-transition">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-black italic flex items-center gap-4 uppercase text-[var(--text-primary)]">
              <Disc className="text-[#F2CB05] w-8 h-8" /> PREPARAR PRÓXIMA RONDA
            </h2>
            <p className="text-neutral-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-1 ml-12">Configura la Playlist o Géneros para votar</p>
          </div>
          
          <div className="flex p-1.5 bg-[var(--bg-primary)] rounded-2xl theme-transition self-start">
            <button onClick={() => setEditMode('songs')} className={`px-6 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${editMode === 'songs' ? 'bg-[#F2CB05] text-[#0D0D0D]' : 'text-neutral-500 hover:text-white'}`}>
              <Music className="w-4 h-4" /> CANCIONES
            </button>
            <button onClick={() => setEditMode('genres')} className={`px-6 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2 uppercase tracking-widest ${editMode === 'genres' ? 'bg-[#F2CB05] text-[#0D0D0D]' : 'text-neutral-500 hover:text-white'}`}>
              <Radio className="w-4 h-4" /> GÉNEROS
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            {editMode === 'songs' ? (
              <div className="space-y-4">
                {editSongs.map((song, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 shrink-0 bg-[var(--bg-primary)] rounded-xl flex items-center justify-center font-black text-[#F2CB05] border border-[var(--border-color)] text-xs">
                      {i + 1}
                    </div>
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input 
                        placeholder="Título canción..."
                        value={song.title}
                        onChange={e => handleSongChange(i, 'title', e.target.value)}
                        className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] font-bold text-xs focus:border-[#F2CB05] focus:outline-none transition-all theme-transition text-white"
                      />
                      <input 
                        placeholder="Artista"
                        value={song.artist}
                        onChange={e => handleSongChange(i, 'artist', e.target.value)}
                        className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] font-bold text-xs focus:border-[#F2CB05] focus:outline-none transition-all theme-transition text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {['Merengue', 'Villera', 'Reguetón', 'Electrónica', 'Rock', 'Salsa'].map(g => (
                  <button 
                    key={g}
                    onClick={() => setEditGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                    className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all theme-transition ${editGenres.includes(g) ? 'border-[#F2CB05] bg-[#F2CB05]/10 text-[#F2CB05] shadow-lg shadow-[#F2CB05]/10 scale-[1.02]' : 'border-[var(--border-color)] text-neutral-500 opacity-60 hover:opacity-100 hover:border-[#F2CB05]/40'}`}
                  >
                    {g === 'Merengue' && <Music className="w-6 h-6" />}
                    {g === 'Villera' && <Radio className="w-6 h-6" />}
                    {g === 'Reguetón' && <Disc className="w-6 h-6" />}
                    {g === 'Electrónica' && <Activity className="w-6 h-6" />}
                    {g === 'Rock' && <Mic2 className="w-6 h-6" />}
                    {g === 'Salsa' && <Music className="w-6 h-6 animate-pulse" />}
                    <span className="text-sm font-black italic uppercase tracking-tighter">{g}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-end">
            <div className="bg-[#0D0D0D] p-8 rounded-[2.5rem] border border-[var(--border-color)] space-y-6">
              <div className="space-y-2">
                <h4 className="text-[#F2CB05] font-black italic uppercase tracking-widest text-sm">Advertencia de Sesión</h4>
                <p className="text-neutral-500 text-xs font-medium leading-relaxed">
                  Al actualizar, los votos actuales se borrarán y el público verá las nuevas opciones inmediatamente en su dispositivo. Asegúrate de que la ronda actual haya terminado.
                </p>
              </div>
              <button 
                onClick={handleSaveSession}
                className="w-full bg-white text-[#0D0D0D] font-black py-6 rounded-2xl flex items-center justify-center gap-4 shadow-xl hover:bg-[#F2CB05] transition-all text-sm italic uppercase tracking-widest active:scale-95"
              >
                <Save className="w-5 h-5" /> PUBLICAR NUEVA RONDA
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default DjDashboard;
