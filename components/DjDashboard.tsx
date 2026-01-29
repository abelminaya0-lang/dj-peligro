
import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, SongWithStats } from '../types';
import StatsChart from './StatsChart';
import { LogOut, RotateCcw, Activity, BarChart3, ListMusic, Home, ChevronLeft, Timer, Play, Square, AlertCircle } from 'lucide-react';

interface DjDashboardProps {
  songs: Song[];
  votes: Vote[];
  onReset: () => void;
  onLogout: () => void;
  onUpdateSongs: (songs: Song[]) => void;
  votingEndsAt: number | null;
  onStartVoting: (minutes: number) => void;
  onStopVoting: () => void;
}

const DjDashboard: React.FC<DjDashboardProps> = ({ 
  songs, votes, onReset, onLogout, onUpdateSongs, 
  votingEndsAt, onStartVoting, onStopVoting 
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
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 animate-in fade-in duration-700 bg-[#F2F2F2]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#F2CB05] rounded-2xl flex items-center justify-center shadow-lg p-2 overflow-hidden">
            <img src={DJ_LOGO} alt="DJ Peligro" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4 text-[#0D0D0D]">
              PANEL <span className="text-[#F2B705]">DJ</span>
            </h1>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mt-1 italic">Control maestro de la pista</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link 
            to="/"
            className="flex items-center space-x-2 bg-white hover:bg-neutral-50 text-[#0D0D0D] px-6 py-4 rounded-2xl border border-neutral-200 transition-all font-bold text-sm shadow-sm"
          >
            <Home className="w-4 h-4 text-[#F2CB05]" />
            <span className="hidden sm:inline">Ver como Público</span>
          </Link>
          <button 
            onClick={() => { if(confirm('¿Reiniciar todos los votos y el temporizador?')) onReset(); }}
            className="flex items-center space-x-2 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-red-500 px-6 py-4 rounded-2xl border border-neutral-200 transition-all font-bold text-sm shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Resetear Todo</span>
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 px-6 py-4 rounded-2xl border border-red-100 transition-all font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Control del Temporizador */}
      <section className="bg-white rounded-[3rem] border border-neutral-200 p-8 md:p-12 mb-12 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Timer className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Timer className={`w-8 h-8 ${isVotingActive ? 'text-[#F2CB05] animate-pulse' : 'text-neutral-300'}`} />
              <h2 className="text-3xl font-black tracking-tight uppercase italic text-[#0D0D0D]">Control de Tiempo</h2>
            </div>
            <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Define la duración de la sesión de votación activa</p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className={`text-7xl md:text-9xl font-black tracking-tighter tabular-nums ${isVotingActive ? 'text-[#0D0D0D]' : 'text-neutral-200'}`}>
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
                  className="bg-[#0D0D0D] hover:bg-neutral-800 text-white font-black px-12 py-5 rounded-[1.5rem] flex items-center gap-3 shadow-xl transition-all active:scale-95 text-lg"
                >
                  <Square className="w-6 h-6 fill-current" />
                  <span>DETENER RONDAS</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="hidden lg:block bg-[#F2F2F2] p-8 rounded-[2.5rem] border border-neutral-200 max-w-xs shadow-inner">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-[#F2CB05]" />
              <span className="text-xs font-black uppercase text-[#0D0D0D] tracking-widest">Estado Live</span>
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
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm">
          <p className="text-neutral-400 font-black uppercase tracking-widest text-[10px] mb-4">Votos Totales</p>
          <p className="text-5xl font-black text-[#0D0D0D]">{totalVotes}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm">
          <p className="text-neutral-400 font-black uppercase tracking-widest text-[10px] mb-4">Canciones Activas</p>
          <p className="text-5xl font-black text-[#0D0D0D]">{songs.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm border-l-4 border-l-[#F2CB05]">
          <p className="text-neutral-400 font-black uppercase tracking-widest text-[10px] mb-4">Más Votada</p>
          <p className="text-2xl font-black text-[#F2B705] truncate uppercase italic">{topSong ? topSong.title : '---'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[3rem] border border-neutral-200 p-8 md:p-12 min-h-[450px] flex flex-col shadow-lg">
          <div className="flex items-center gap-3 mb-10">
            <BarChart3 className="text-[#F2CB05] w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight uppercase italic text-[#0D0D0D]">Gráfico en Vivo</h2>
          </div>
          <div className="flex-grow">
            <StatsChart data={songStats} />
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-neutral-200 p-8 md:p-12 shadow-lg">
          <div className="flex items-center gap-3 mb-10">
            <ListMusic className="text-[#F2CB05] w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight uppercase italic text-[#0D0D0D]">Ranking Real</h2>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {songStats.length > 0 ? (
              songStats.map((song) => (
                <div key={song.id} className="flex items-center p-4 bg-[#F2F2F2] rounded-2xl border border-neutral-100 hover:border-[#F2CB05] transition-colors group">
                  <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover mr-4 shadow-sm" alt="" />
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-[#0D0D0D] truncate group-hover:text-[#F2B705] transition-colors">{song.title}</h4>
                    <p className="text-[10px] text-neutral-400 font-black uppercase">{song.artist}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-[#0D0D0D] block">{song.voteCount}</span>
                    <span className="text-[9px] font-black text-[#F2CB05] uppercase tracking-tighter">{song.percentage.toFixed(0)}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-neutral-300 font-black uppercase tracking-widest text-xs">
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
