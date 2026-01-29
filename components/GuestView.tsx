
import React, { useState, useEffect } from 'react';
import { Song, Vote, VotingMode } from '../types';
import SongCard from './SongCard';
import { Instagram, Heart, Timer, AlarmClockOff, Disc, Radio, Activity, Sun, Moon, Music, Mic2 } from 'lucide-react';
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

  // Logos de DJ Peligro
  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722460/LOGO_DJ_PELIGRO_ihglvl.png";
  const RAYO_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722452/LOGO_RAYO_qd5arr.png";

  useEffect(() => {
    setHasVoted(localStorage.getItem('has_voted') === 'true');
  }, [votingEndsAt, mode, songs, genres]);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isClosed = votingEndsAt !== null && timeLeft === 0;

  const getGenreIcon = (genre: string) => {
    const g = genre.toLowerCase();
    if (g.includes('reggaetón') || g.includes('regueton')) return <Disc className="text-[#0D0D0D] w-8 h-8" />;
    if (g.includes('electrónica')) return <Activity className="text-[#0D0D0D] w-8 h-8" />;
    if (g.includes('rock')) return <Mic2 className="text-[#0D0D0D] w-8 h-8" />;
    if (g.includes('villera') || g.includes('cumbia')) return <Radio className="text-[#0D0D0D] w-8 h-8" />;
    if (g.includes('salsa')) return <Music className="text-[#0D0D0D] w-8 h-8" />;
    return <Music className="text-[#0D0D0D] w-8 h-8" />;
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 flex flex-col min-h-screen theme-transition bg-[#0D0D0D] pt-0">
      {/* Botón de Tema Flotante */}
      <button 
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-2xl hover:scale-110 active:scale-95 transition-all theme-transition group"
      >
        {isDarkMode ? <Sun className="w-4 h-4 text-[#F2CB05]" /> : <Moon className="w-4 h-4 text-[#594302]" />}
      </button>

      {/* HEADER - AL RAS DEL TECHO Y BLOQUE UNIFICADO A LA MEDIDA */}
      <header className="text-center mb-4 flex flex-col items-center pt-0 mt-[-25px] md:mt-[-40px] animate-in fade-in duration-1000 overflow-visible">
        <div className="relative group z-10 w-full flex justify-center pt-0">
          <div className="absolute inset-0 bg-[#F2CB05] blur-[140px] opacity-40 rounded-full animate-pulse group-hover:opacity-60 transition-opacity"></div>
          <img 
            src={DJ_LOGO} 
            className="w-[115%] max-w-[440px] md:max-w-[750px] relative z-20 object-contain transition-all duration-700 drop-shadow-[0_20px_50px_rgba(242,203,5,0.7)]" 
            alt="DJ Peligro" 
          />
        </div>
        
        {/* Banner a la medida perfecta, ultra integrado */}
        <div className="relative z-30 mt-[-100px] md:mt-[-180px] animate-in slide-in-from-top-12 duration-1000 w-full flex justify-center px-4">
          <div className="inline-block bg-white text-[#0D0D0D] px-6 py-4 md:px-14 md:py-8 transform -skew-x-12 shadow-[0_40px_100px_rgba(0,0,0,1)] border-r-[12px] border-b-[12px] md:border-r-[20px] md:border-b-[20px] border-[#F2CB05]">
            <h2 className="text-xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none whitespace-nowrap">
              La próxima canción la eliges tú
            </h2>
          </div>
        </div>

        {votingEndsAt && (
          <div className="flex justify-center pt-6 animate-in zoom-in duration-500">
            <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 shadow-2xl backdrop-blur-xl theme-transition ${isClosed ? 'bg-red-500 text-white border-red-600' : 'bg-[var(--card-bg)] border-[#F2CB05] text-white'}`}>
              {isClosed ? <AlarmClockOff className="w-4 h-4" /> : <Timer className="w-4 h-4 animate-spin-slow text-[#F2CB05]" />}
              <span className="text-lg md:text-2xl font-black tracking-[0.2em] tabular-nums leading-none">
                {isClosed ? 'CERRADO' : `${Math.floor(timeLeft!/60000)}:${String(Math.floor((timeLeft!%60000)/1000)).padStart(2,'0')}`}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* CONTENIDO - COMPACTO Y SIN HUECOS */}
      <main className="flex-grow space-y-4 animate-in slide-in-from-bottom-8 duration-1000 pt-2">
        {hasVoted ? (
          <div className="bg-[var(--card-bg)] border-4 border-[#F2CB05] rounded-[3rem] p-8 text-center shadow-[0_30px_80px_-15px_rgba(242,203,5,0.4)] relative overflow-hidden theme-transition">
            <Heart className="w-14 h-14 text-[#F2CB05] mx-auto mb-4 animate-bounce fill-current" />
            <h3 className="text-3xl font-black italic mb-2 tracking-tighter text-white uppercase leading-none">¡TU VOTO ES LEY!</h3>
            <p className="text-neutral-500 font-black mb-6 uppercase text-[9px] tracking-[0.4em] max-w-xs mx-auto">La pista va a detonar.</p>
            <a 
              href="https://www.instagram.com/djpeligroperu" 
              target="_blank" 
              className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-black py-4 px-10 rounded-2xl inline-flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs tracking-widest uppercase italic"
            >
              <Instagram className="w-5 h-5" /> RESULTADOS EN VIVO
            </a>
          </div>
        ) : mode === 'songs' ? (
          <div className="space-y-2 pb-6">
            <p className="text-center text-neutral-600 font-black uppercase text-[9px] tracking-[0.5em] mb-1 opacity-40">TOCA PARA VOTAR:</p>
            {songs.map(song => (
              <SongCard key={song.id} song={song} onClick={() => handleVoteAction(song.id)} disabled={isClosed} isDarkMode={isDarkMode} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 pb-6">
            {genres.map(g => (
              <button 
                key={g} 
                onClick={() => handleVoteAction(g)}
                disabled={isClosed}
                className="group relative flex items-center justify-between bg-[var(--card-bg)] p-6 md:p-10 rounded-[2rem] border-2 border-transparent hover:border-[#F2CB05] transition-all shadow-xl active:scale-95 disabled:opacity-50 theme-transition overflow-hidden"
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className="bg-[#F2CB05] p-4 rounded-xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-[#F2CB05]/20">
                    {getGenreIcon(g)}
                  </div>
                  <span className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter group-hover:text-[#F2B705] transition-colors">{g}</span>
                </div>
                <div className="bg-[#F2CB05] text-[#0D0D0D] font-black px-8 py-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 italic text-sm">VOTAR</div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER - AL RAS CON EL RAYO OCULTO Y ESPACIO LARGO */}
      <footer className="mt-20 py-16 text-center border-t border-[var(--border-color)] space-y-12 theme-transition">
        {/* Separador de Marca Actualizado */}
        <div className="flex flex-col items-center">
          <p className="text-neutral-500 text-[8px] font-black uppercase tracking-[0.6em] mb-3">PANEL EXCLUSIVO • DJ PELIGRO</p>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-[#F2CB05] rounded-full"></div>
            <div className="w-12 h-1 bg-[#F2CB05] rounded-full"></div>
            <div className="w-1 h-1 bg-[#F2CB05] rounded-full"></div>
          </div>
        </div>

        {/* REDES SOCIALES OFICIALES */}
        <div className="flex justify-center items-center gap-10">
          <a 
            href="https://www.instagram.com/djpeligroperu?igsh=MWQ1NmhhcjFubXFvbg==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-[#F2CB05] transform hover:scale-125 transition-all duration-300 group relative"
          >
            <div className="absolute inset-0 bg-[#F2CB05] blur-xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full"></div>
            <Instagram className="w-8 h-8 relative z-10" />
          </a>
          <a 
            href="https://www.tiktok.com/@djpeligro?_r=1&_t=ZS-93UIHRWRZ20" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-[#F2CB05] transform hover:scale-125 transition-all duration-300 group relative"
          >
            <div className="absolute inset-0 bg-[#F2CB05] blur-xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full"></div>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative z-10">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
            </svg>
          </a>
        </div>

        {/* El Rayo Oculto - Botón de acceso al Panel */}
        <div className="flex justify-center group">
          <Link 
            to="/admin" 
            className="relative p-4 grayscale opacity-10 hover:grayscale-0 hover:opacity-100 transition-all duration-500 transform hover:scale-125 hover:rotate-12"
          >
            <div className="absolute inset-0 bg-[#F2CB05] blur-2xl opacity-0 group-hover:opacity-30 transition-opacity rounded-full"></div>
            <img src={RAYO_LOGO} alt="DJ Access" className="w-12 h-12 object-contain relative z-10" />
          </Link>
        </div>

        {/* Espacio largo final */}
        <div className="pt-24 pb-12">
          <p className="text-[7px] text-neutral-800 font-bold uppercase tracking-[0.4em]">
            Copyright &copy; 2024 • Vote Flow • Peligro Edition
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GuestView;
