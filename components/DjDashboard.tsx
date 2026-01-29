
import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, SongWithStats } from '../types';
import StatsChart from './StatsChart';
import { LogOut, RotateCcw, Activity, BarChart3, ListMusic, Home, Timer, Play, Square, AlertCircle, Sun, Moon } from 'lucide-react';

interface DjDashboardProps {
  songs: Song[];
  votes: Vote[];
  onReset: () => void;
  onLogout: () => void;
  onUpdateSongs: (songs: Song[]) => void;
  votingEndsAt: number | null;
  onStartVoting: (minutes: number) => void;
  onStopVoting: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DjDashboard: React.FC<DjDashboardProps> = ({ 
  songs, votes, onReset, onLogout, 
  votingEndsAt, onStartVoting, onStopVoting,
  isDarkMode, toggleTheme
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769720682/avatars-000658755773-nboqus-t500x500-removebg-preview_r7cgsp.png";

  useEffect(() => {
    if (!votingEndsAt) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = votingEndsAt - now;
      if (difference <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(difference);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [votingEndsAt]);

  const songStats: SongWithStats[] = useMemo(() => {
    const totalVotes = votes.length;
    return songs.map(song => {
      const voteCount = votes.filter(v => v.songId === song.id).length;
      return {
        ...song,
        voteCount,
        percentage: totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
      };
    }).sort((a, b) => b.voteCount - a.voteCount);
  }, [songs, votes]);

  const totalVotes = votes.length;
  const topSong = songStats[0]?.voteCount > 0 ? songStats[0] : null;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isVotingActive = votingEndsAt && timeLeft !== null && timeLeft > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 animate-in fade-in duration-700 bg-[var(--bg-primary)] theme-transition">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#F2CB05] rounded-2xl flex items-center justify-center shadow-lg p-2 overflow-hidden">
            <img src={DJ_LOGO} alt="DJ Peligro" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4 text-[var(--text-primary)] theme-transition">
              PANEL <span className="text-[#F2B705]">DJ</span>
            </h1>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mt-1 italic">Control maestro de la pista</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="flex items-center space-x-2 bg-[var(--card-bg)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)] px-5 py-4 rounded-2xl border border-[var(--border-color)] transition-all font-bold text-sm shadow-sm theme-transition"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#F2CB05]" /> : <Moon className="w-4 h-4 text-[#594302]" />}
            <span className="hidden sm:inline">{isDarkMode ? 'Tema Claro' : 'Tema Oscuro'}</span>
          </button>
          <Link 
            to="/"
            className="flex items-center space-x-2 bg-[var(--card-bg)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-4 rounded-2xl border border-[var(--border-color)] transition-all font-bold text-sm shadow-sm theme-transition"
          >
            <Home className="w-4 h-4 text-[#F2CB05]" />
            <span className="hidden sm:inline">Ver como Público</span>
          </Link>
          <button 
            onClick={() => { if(confirm('¿Reiniciar todos los votos y el temporizador?')) onReset(); }}
            className="flex items-center space-x-2 bg-[var(--card-bg)] hover:bg-red-500/10 text-neutral-500 hover:text-red-500 px-6 py-4 rounded-2xl border border-[var(--border-color)] transition-all font-bold text-sm shadow-sm theme-transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Resetear Todo</span>
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-4 rounded-2xl border border-red-500/20 transition-all font-bold text-sm theme-transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Control del Temporizador */}
      <section className="bg-[var(--card-bg)] rounded-[3rem] border border-[var(--border-color)] p-8 md:p-12 mb-12 relative overflow-hidden shadow-xl theme-transition">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-[#F2CB05]">
          <Timer className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Timer className={`w-8 h-8 ${isVotingActive ? 'text-[#F2CB05] animate-pulse' : 'text-neutral-400'}`} />
              <h2 className="text-3xl font-black tracking-tight uppercase italic text-[var(--text-primary)]">Control de Tiempo</h2>
            </div>
            <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Define la duración de la sesión de votación activa</p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className={`text-7xl md:text-9xl font-black tracking-tighter tabular-nums theme-transition ${isVotingActive ? 'text-[var(--text-primary)]' : 'text-neutral-500/30'}`}>
              {timeLeft !== null ? formatTime(timeLeft) : '05:00'}
            </div>
            
            <div className="flex gap-4">
              {!isVotingActive ? (
                <button
                  onClick={() => onStartVoting(5)}
                  className="bg-[#F2CB05] hover:bg-[#F2B705] text-[#0D0D0D] font-black px-12 py-5 rounded-[1.5rem] flex items-center gap-3 shadow-xl shadow-[#F2CB05]/20 transition-all active:scale-95 text-lg"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>INICIAR 5 MIN</span>
                </button>
              ) : (
                <button
                  onClick={onStopVoting}
                  className="bg-[#0D0D0D] hover:bg-neutral-800 text-white dark:bg-white dark:text-black font-black px-12 py-5 rounded-[1.5rem] flex items-center gap-3 shadow-xl transition-all active:scale-95 text-lg"
                >
                  <Square className="w-6 h-6 fill-current" />
                  <span>DETENER RONDAS</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="hidden lg:block bg-[var(--bg-primary)] p-8 rounded-[2.5rem] border border-[var(--border-color)] max-w-xs shadow-inner theme-transition">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-[#F2CB05]" />
              <span className="text-xs font-black uppercase text-[var(--text-primary)] tracking-widest">Estado Live</span>
            </div>
            <p className="text-sm font-bold text-neutral-500 leading-relaxed">
              {isVotingActive 
                ? "Votación abierta. El público puede elegir sus canciones ahora mismo." 
                : timeLeft === 0 
                  ? "Sesión finalizada. Los resultados están bloqueados para el público." 
                  : "Sistema listo para iniciar una nueva ronda de 5 minutos."}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[var(--card-bg)] p-8 rounded-[2.5rem] border border-[var(--border-color)] shadow-sm theme-transition">
          <p className="text-neutral-400 font-black uppercase tracking-widest text-[10px] mb-4">Votos Totales</p>
          <p className="text-5xl font-black text-[var(--text-primary)]">{totalVotes}</p>
        </div>
        <div className="bg-[var(--card-bg)] p-8 rounded-[2.5rem] border border-[var(--border-color)] shadow-sm theme-transition">
          <p className="text-neutral-400 font-black uppercase tracking-widest text-[10px] mb-4">Canciones Activas</p>
          <p className="text-5xl font-black text-[var(--text-primary)]">{songs.length}</p>
        </div>
        <div className="bg-[var(--card-bg)] p-8 rounded-[2.5rem] border border-[var(--border-color)] shadow-sm border-l-4 border-l-[#F2CB05] theme-transition">
          <p className="text-neutral-400 font-black uppercase tracking-widest text-[10px] mb-4">Más Votada</p>
          <p className="text-2xl font-black text-[#F2B705] truncate uppercase italic">{topSong ? topSong.title : '---'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--card-bg)] rounded-[3rem] border border-[var(--border-color)] p-8 md:p-12 min-h-[450px] flex flex-col shadow-lg theme-transition">
          <div className="flex items-center gap-3 mb-10">
            <BarChart3 className="text-[#F2CB05] w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight uppercase italic text-[var(--text-primary)]">Gráfico en Vivo</h2>
          </div>
          <div className="flex-grow">
            <StatsChart data={songStats} isDarkMode={isDarkMode} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-[3rem] border border-[var(--border-color)] p-8 md:p-12 shadow-lg theme-transition">
          <div className="flex items-center gap-3 mb-10">
            <ListMusic className="text-[#F2CB05] w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight uppercase italic text-[var(--text-primary)]">Ranking Real</h2>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {songStats.length > 0 ? (
              songStats.map((song) => (
                <div key={song.id} className="flex items-center p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] hover:border-[#F2CB05] transition-colors group theme-transition">
                  <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover mr-4 shadow-sm" alt="" />
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-[var(--text-primary)] truncate group-hover:text-[#F2B705] transition-colors">{song.title}</h4>
                    <p className="text-[10px] text-neutral-400 font-black uppercase">{song.artist}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-[var(--text-primary)] block">{song.voteCount}</span>
                    <span className="text-[9px] font-black text-[#F2CB05] uppercase tracking-tighter">{song.percentage.toFixed(0)}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-neutral-300 font-black uppercase tracking-widest text-xs italic">
                Sin datos por ahora
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DjDashboard;
