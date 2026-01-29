
import React, { useState, useEffect } from 'react';
import { Song, Vote, VotingMode } from '../types';
import SongCard from './SongCard';
import { Instagram, Heart, Timer, AlarmClockOff, Disc, Radio, Activity, Sun, Moon, Music, Mic2, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import PostVoteModal from './PostVoteModal';

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
      {/* PANTALLA POST-VOTO (INSTAGRAM REDIRECT) */}
      <PostVoteModal isVisible={hasVoted} />

      {/* Botón Flotante de Tema */}
      <button 
        onClick={toggleTheme}
        className="fixed top-3 right-3 z-[100] p-3 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-2xl active:scale-90 transition-all theme-transition"
      >
        {isDarkMode ? <Sun className="w-5 h-5 text-[#F2CB05]" /> : <Moon className="w-5 h-5 text-[#594302]" />}
      </button>

      {/* HEADER COMPACTO PARA CELULAR */}
      <header className="text-center mb-2 flex flex-col items-center pt-0 mt-[-15px] md:mt-[-40px] animate-in fade-in duration-1000">
        <div className="relative group w-full flex justify-center pt-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#F2CB05] blur-[70px] md:blur-[140px] opacity-30 md:opacity-40 rounded-full animate-pulse"></div>
          <img 
            src={DJ_LOGO} 
            className="w-[90%] md:w-[115%] max-w-[320px] md:max-w-[750px] relative z-20 object-contain drop-shadow-[0_10px_30px_rgba(242,203,5,0.5)]" 
            alt="DJ Peligro" 
          />
        </div>
        
        {/* Banner de Acción principal */}
        <div className="relative z-30 mt-[-40px] md:mt-[-180px] w-full flex justify-center px-4">
          <div className="inline-block bg-white text-[#0D0D0D] px-4 py-3 md:px-14 md:py-8 transform -skew-x-12 shadow-2xl border-r-[8px] border-b-[8px] md:border-r-[20px] md:border-b-[20px] border-[#F2CB05]">
            <h2 className="text-base md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none whitespace-nowrap">
              La próxima canción la eliges tú
            </h2>
          </div>
        </div>

        {/* CRONÓMETRO DE 6 MINUTOS */}
        {votingEndsAt && (
          <div className="flex flex-col items-center gap-1.5 pt-4 md:pt-10 animate-in zoom-in duration-500">
            {!isClosed && (
              <div className="flex items-center gap-1 bg-[#F2CB05] text-[#0D0D0D] px-2 py-0.5 rounded-md font-black text-[7px] md:text-[8px] tracking-[0.3em] uppercase animate-pulse">
                • VOTACIÓN ACTIVA (6 MINUTOS)
              </div>
            )}
            <div className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-2xl border-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl theme-transition ${isClosed ? 'bg-red-500 text-white border-red-600' : 'bg-[#151515] border-[#F2CB05] text-white'}`}>
              {isClosed ? <AlarmClockOff className="w-5 h-5" /> : <Timer className="w-5 h-5 animate-spin-slow text-[#F2CB05]" />}
              <span className="text-2xl md:text-4xl font-black tracking-[0.2em] tabular-nums leading-none italic">
                {isClosed ? 'CERRADO' : `${Math.floor(timeLeft!/60000)}:${String(Math.floor((timeLeft!%60000)/1000)).padStart(2,'0')}`}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow space-y-4 animate-in slide-in-from-bottom-8 duration-1000 pt-2">
        {mode === 'songs' ? (
          <div className="space-y-3 pb-12">
            <p className="text-center text-neutral-600 font-black uppercase text-[10px] tracking-[0.5em] mb-1 opacity-50">
              TOCA PARA ELEGIR LA SIGUIENTE:
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
          <div className="grid grid-cols-1 gap-4 pb-12">
            <p className="text-center text-neutral-600 font-black uppercase text-[10px] tracking-[0.5em] mb-1 opacity-50">
              ¿QUÉ GÉNERO QUIERES ESCUCHAR?
            </p>
            {genres.map(g => (
              <button 
                key={g} 
                onClick={() => handleVoteAction(g)}
                disabled={isClosed || hasVoted}
                className={`group relative flex items-center justify-between p-7 md:p-10 rounded-[2.5rem] border-2 transition-all shadow-2xl active:scale-95 theme-transition overflow-hidden ${
                  hasVoted || isClosed 
                  ? 'bg-[#121212] border-transparent opacity-60 grayscale' 
                  : 'bg-[var(--card-bg)] border-transparent hover:border-[#F2CB05]'
                }`}
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className={`p-5 rounded-2xl transition-all duration-500 shadow-xl ${hasVoted || isClosed ? 'bg-neutral-800 shadow-none' : 'bg-[#F2CB05] group-hover:rotate-12 shadow-[#F2CB05]/30'}`}>
                    {getGenreIcon(g)}
                  </div>
                  <span className={`text-2xl md:text-5xl font-black italic uppercase tracking-tighter transition-colors ${hasVoted || isClosed ? 'text-neutral-500' : 'group-hover:text-[#F2B705] text-white'}`}>{g}</span>
                </div>
                
                <div className={`font-black px-8 py-5 rounded-2xl italic text-xs md:text-sm transition-all flex items-center gap-3 ${
                  hasVoted || isClosed 
                  ? 'bg-transparent text-neutral-600 border border-neutral-800' 
                  : 'bg-[#F2CB05] text-[#0D0D0D] md:opacity-0 md:group-hover:opacity-100'
                }`}>
                  {hasVoted || isClosed ? (
                    <>REGISTRADO <Heart className="w-5 h-5 fill-current text-red-500" /></>
                  ) : (
                    <>VOTAR <Music className="w-4 h-4" /></>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-12 py-20 text-center border-t border-[var(--border-color)] space-y-12 theme-transition">
        <div className="flex flex-col items-center">
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.6em] mb-4">PANEL EXCLUSIVO • DJ PELIGRO</p>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-[#F2CB05] rounded-full"></div>
            <div className="w-20 h-2 bg-[#F2CB05] rounded-full"></div>
            <div className="w-2 h-2 bg-[#F2CB05] rounded-full"></div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-14">
          <a href="https://www.instagram.com/djpeligroperu" target="_blank" className="text-white hover:text-[#F2CB05] transform hover:scale-125 transition-all duration-300">
            <Instagram className="w-10 h-10" />
          </a>
          <a href="https://www.tiktok.com/@djpeligro" target="_blank" className="text-white hover:text-[#F2CB05] transform hover:scale-125 transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
            </svg>
          </a>
        </div>

        <div className="flex justify-center opacity-10">
          <Link to="/admin" className="p-4 hover:opacity-100 transition-opacity">
            <img src={RAYO_LOGO} alt="DJ" className="w-12 h-12 object-contain" />
          </Link>
        </div>

        <div className="pt-24 pb-12">
          <p className="text-[9px] text-neutral-800 font-black uppercase tracking-[0.5em]">
            &copy; 2024 PELIGRO EDITION • VOTE FLOW SYSTEM
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GuestView;
