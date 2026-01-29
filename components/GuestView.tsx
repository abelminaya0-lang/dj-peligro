
import React, { useState, useEffect } from 'react';
import { Song, Vote, VotingMode } from '../types';
import SongCard from './SongCard';
import { Instagram, Heart, Timer, AlarmClockOff, Disc, Radio, Activity, Sun, Moon, Music, Mic2, Check, RadioReceiver } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GuestViewProps {
  mode: VotingMode;
  songs: Song[];
  genres: string[];
  votes: Vote[];
  onVote: (targetId: string) => void;
  votingEndsAt: number | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const GuestView: React.FC<GuestViewProps> = ({ mode, songs, genres, onVote, votingEndsAt, isDarkMode, toggleTheme }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722460/LOGO_DJ_PELIGRO_ihglvl.png";
  const RAYO_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722452/LOGO_RAYO_qd5arr.png";

  useEffect(() => {
    setHasVoted(localStorage.getItem('has_voted') === 'true');
  }, [votingEndsAt, mode]);

  useEffect(() => {
    if (!votingEndsAt) { setTimeLeft(null); return; }
    const interval = setInterval(() => {
      const diff = votingEndsAt - Date.now();
      setTimeLeft(diff <= 0 ? 0 : diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [votingEndsAt]);

  const handleVoteAction = (id: string) => {
    if (!hasVoted && (!votingEndsAt || (timeLeft && timeLeft > 0))) {
      onVote(id);
      setHasVoted(true);
      localStorage.setItem('has_voted', 'true');
    }
  };

  const isClosed = votingEndsAt !== null && timeLeft === 0;

  const getGenreIcon = (genre: string) => {
    const g = genre.toLowerCase();
    if (g.includes('reggaetón') || g.includes('regueton')) return <Disc className="text-[#0D0D0D] w-8 h-8 md:w-10 md:h-10" />;
    if (g.includes('electrónica')) return <Activity className="text-[#0D0D0D] w-8 h-8 md:w-10 md:h-10" />;
    if (g.includes('rock')) return <Mic2 className="text-[#0D0D0D] w-8 h-8 md:w-10 md:h-10" />;
    if (g.includes('villera') || g.includes('cumbia')) return <Radio className="text-[#0D0D0D] w-8 h-8 md:w-10 md:h-10" />;
    if (g.includes('salsa')) return <Music className="text-[#0D0D0D] w-8 h-8 md:w-10 md:h-10" />;
    return <Music className="text-[#0D0D0D] w-8 h-8 md:w-10 md:h-10" />;
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 flex flex-col min-h-screen theme-transition bg-[#0D0D0D] pt-0">
      {/* Botón Flotante Optimizado */}
      <button 
        onClick={toggleTheme}
        className="fixed top-3 right-3 z-[100] p-3 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-2xl active:scale-90 transition-all theme-transition"
      >
        {isDarkMode ? <Sun className="w-5 h-5 text-[#F2CB05]" /> : <Moon className="w-5 h-5 text-[#594302]" />}
      </button>

      {/* HEADER COMPACTO PARA MÓVILES */}
      <header className="text-center mb-2 flex flex-col items-center pt-0 mt-[-10px] md:mt-[-40px] animate-in fade-in duration-1000">
        <div className="relative group w-full flex justify-center pt-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#F2CB05] blur-[80px] md:blur-[140px] opacity-30 md:opacity-40 rounded-full animate-pulse"></div>
          <img 
            src={DJ_LOGO} 
            className="w-[100%] md:w-[115%] max-w-[380px] md:max-w-[750px] relative z-20 object-contain drop-shadow-[0_10px_30px_rgba(242,203,5,0.5)]" 
            alt="DJ Peligro" 
          />
        </div>
        
        {/* Banner de Acción más compacto en móvil */}
        <div className="relative z-30 mt-[-50px] md:mt-[-180px] w-full flex justify-center px-4">
          <div className="inline-block bg-white text-[#0D0D0D] px-4 py-3 md:px-14 md:py-8 transform -skew-x-12 shadow-2xl border-r-[8px] border-b-[8px] md:border-r-[20px] md:border-b-[20px] border-[#F2CB05]">
            <h2 className="text-base md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none whitespace-nowrap">
              La próxima canción la eliges tú
            </h2>
          </div>
        </div>

        {/* CRONÓMETRO DE ALTA VISIBILIDAD */}
        {votingEndsAt && (
          <div className="flex flex-col items-center gap-2 pt-6 md:pt-10 animate-in zoom-in duration-500">
            {!isClosed && (
              <div className="flex items-center gap-1 bg-[#F2CB05] text-[#0D0D0D] px-2 py-0.5 rounded-md font-black text-[8px] tracking-[0.3em] uppercase animate-pulse">
                • EN VIVO
              </div>
            )}
            <div className={`inline-flex items-center gap-3 px-8 py-3 rounded-2xl border-2 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl theme-transition ${isClosed ? 'bg-red-500 text-white border-red-600' : 'bg-[#151515] border-[#F2CB05] text-white'}`}>
              {isClosed ? <AlarmClockOff className="w-5 h-5" /> : <Timer className="w-5 h-5 animate-spin-slow text-[#F2CB05]" />}
              <span className="text-2xl md:text-4xl font-black tracking-[0.2em] tabular-nums leading-none italic">
                {isClosed ? 'CERRADO' : `${Math.floor(timeLeft!/60000)}:${String(Math.floor((timeLeft!%60000)/1000)).padStart(2,'0')}`}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow space-y-4 animate-in slide-in-from-bottom-8 duration-1000 pt-4">
        {hasVoted && (
          <div className="flex justify-center animate-in fade-in zoom-in duration-500 mb-4">
            <div className="bg-[#F2CB05]/10 border border-[#F2CB05]/30 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
              <Check className="w-4 h-4 text-[#F2CB05]" />
              <span className="text-xs font-black text-[#F2CB05] uppercase tracking-[0.1em]">¡TU VOTO HA SIDO REGISTRADO!</span>
            </div>
          </div>
        )}

        {mode === 'songs' ? (
          <div className="space-y-3 pb-10">
            <p className="text-center text-neutral-600 font-black uppercase text-[10px] tracking-[0.4em] mb-2 opacity-50">
              {hasVoted ? 'LISTA DE VOTACIÓN:' : 'TOCA TU CANCIÓN FAVORITA:'}
            </p>
            {songs.map(song => (
              <SongCard 
                key={song.id} 
                song={song} 
                onClick={() => handleVoteAction(song.id)} 
                disabled={isClosed || hasVoted} 
                isDarkMode={isDarkMode} 
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pb-10">
            <p className="text-center text-neutral-600 font-black uppercase text-[10px] tracking-[0.4em] mb-2 opacity-50">
              {hasVoted ? 'GÉNEROS MUSICALES:' : 'TOCA PARA VOTAR EL GÉNERO:'}
            </p>
            {genres.map(g => (
              <button 
                key={g} 
                onClick={() => handleVoteAction(g)}
                disabled={isClosed || hasVoted}
                className={`group relative flex items-center justify-between p-7 md:p-10 rounded-[2.5rem] border-2 transition-all shadow-xl active:scale-95 theme-transition overflow-hidden ${
                  hasVoted || isClosed 
                  ? 'bg-[#121212] border-transparent opacity-60 grayscale' 
                  : 'bg-[var(--card-bg)] border-transparent hover:border-[#F2CB05]'
                }`}
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className={`p-5 rounded-2xl transition-all duration-500 shadow-xl ${hasVoted || isClosed ? 'bg-neutral-800' : 'bg-[#F2CB05] group-hover:rotate-12 shadow-[#F2CB05]/30'}`}>
                    {getGenreIcon(g)}
                  </div>
                  <span className={`text-3xl md:text-5xl font-black italic uppercase tracking-tighter transition-colors ${hasVoted || isClosed ? 'text-neutral-500' : 'group-hover:text-[#F2B705] text-white'}`}>{g}</span>
                </div>
                <div className={`font-black px-8 py-5 rounded-2xl italic text-sm transition-all flex items-center gap-2 ${
                  hasVoted || isClosed 
                  ? 'bg-transparent text-neutral-600 border border-neutral-800' 
                  : 'bg-[#F2CB05] text-[#0D0D0D] md:opacity-0 md:group-hover:opacity-100 md:translate-x-4 md:group-hover:translate-x-0'
                }`}>
                  {hasVoted || isClosed ? (
                    <>REGISTRADO <Check className="w-5 h-5" /></>
                  ) : 'VOTAR'}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER ESPACIADO */}
      <footer className="mt-10 py-20 text-center border-t border-[var(--border-color)] space-y-12 theme-transition">
        <div className="flex flex-col items-center">
          <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.5em] mb-4">PANEL EXCLUSIVO • DJ PELIGRO</p>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-[#F2CB05] rounded-full"></div>
            <div className="w-16 h-1.5 bg-[#F2CB05] rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-[#F2CB05] rounded-full"></div>
          </div>
        </div>

        {/* REDES SOCIALES */}
        <div className="flex justify-center items-center gap-12">
          <a href="https://www.instagram.com/djpeligroperu?igsh=MWQ1NmhhcjFubXFvbg==" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F2CB05] transform hover:scale-125 transition-all duration-300 group relative p-4">
            <Instagram className="w-9 h-9 relative z-10" />
            <div className="absolute inset-0 bg-[#F2CB05] blur-2xl opacity-0 group-hover:opacity-20 rounded-full"></div>
          </a>
          <a href="https://www.tiktok.com/@djpeligro?_r=1&_t=ZS-93UIHRWRZ20" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F2CB05] transform hover:scale-125 transition-all duration-300 group relative p-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 relative z-10">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
            </svg>
            <div className="absolute inset-0 bg-[#F2CB05] blur-2xl opacity-0 group-hover:opacity-20 rounded-full"></div>
          </a>
        </div>

        {/* RAYO OCULTO ACCESO ADMIN */}
        <div className="flex justify-center opacity-20 hover:opacity-100 transition-opacity">
          <Link to="/admin" className="p-4 transform hover:rotate-12 transition-transform">
            <img src={RAYO_LOGO} alt="DJ" className="w-14 h-14 object-contain" />
          </Link>
        </div>

        <div className="pt-20 pb-10">
          <p className="text-[8px] text-neutral-800 font-black uppercase tracking-[0.5em]">
            &copy; 2024 PELIGRO EDITION • VOTE FLOW SYSTEM
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GuestView;
