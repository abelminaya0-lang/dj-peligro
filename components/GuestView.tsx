
import React, { useState, useEffect } from 'react';
import { Song, Vote, VotingMode } from '../types';
import SongCard from './SongCard';
import { Instagram, Heart, Timer, AlarmClockOff, Disc, Radio, Activity, Sun, Moon, ShieldCheck, ChevronRight, Music, Mic2 } from 'lucide-react';
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

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769720682/avatars-000658755773-nboqus-t500x500-removebg-preview_r7cgsp.png";

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
    <div className="max-w-screen-md mx-auto px-4 py-12 flex flex-col min-h-screen theme-transition bg-[#0D0D0D]">
      {/* Botón de Tema Flotante */}
      <button 
        onClick={toggleTheme}
        className="fixed top-8 right-8 z-50 p-4 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-2xl hover:scale-110 active:scale-95 transition-all theme-transition group"
      >
        {isDarkMode ? <Sun className="w-6 h-6 text-[#F2CB05]" /> : <Moon className="w-6 h-6 text-[#594302]" />}
      </button>

      {/* HEADER */}
      <header className="text-center mb-16 space-y-8 pt-12 animate-in fade-in duration-700">
        <div className="inline-block relative group">
          <div className="absolute inset-0 bg-[#F2CB05] blur-3xl opacity-20 rounded-full animate-pulse group-hover:opacity-40 transition-opacity"></div>
          <img src={DJ_LOGO} className="w-36 h-36 relative z-10 bg-[#F2CB05] rounded-[2.5rem] p-3 rotate-6 hover:rotate-0 transition-all duration-700 shadow-[0_20px_60px_rgba(242,203,5,0.4)] cursor-pointer" alt="DJ Peligro Logo" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic text-white leading-none uppercase">
            DJ <span className="text-[#F2CB05]">PELIGRO</span>
          </h1>
          <div className="inline-block bg-[#F2CB05] text-[#0D0D0D] px-8 py-3 transform -skew-x-12 shadow-xl shadow-[#F2CB05]/20">
            <h2 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter">
              La próxima canción la eliges tú
            </h2>
          </div>
        </div>

        {votingEndsAt && (
          <div className="flex justify-center animate-in zoom-in duration-500">
            <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-full border-2 shadow-2xl backdrop-blur-xl theme-transition ${isClosed ? 'bg-red-500 text-white border-red-600' : 'bg-[var(--card-bg)] border-[#F2CB05] text-white'}`}>
              {isClosed ? <AlarmClockOff className="w-6 h-6" /> : <Timer className="w-6 h-6 animate-spin-slow text-[#F2CB05]" />}
              <span className="text-2xl md:text-3xl font-black tracking-[0.2em] tabular-nums leading-none">
                {isClosed ? 'VOTACIÓN CERRADA' : `${Math.floor(timeLeft!/60000)}:${String(Math.floor((timeLeft!%60000)/1000)).padStart(2,'0')}`}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* CONTENIDO */}
      <main className="flex-grow space-y-8 animate-in slide-in-from-bottom-12 duration-1000">
        {hasVoted ? (
          <div className="bg-[var(--card-bg)] border-4 border-[#F2CB05] rounded-[3.5rem] p-12 text-center shadow-[0_30px_80px_-15px_rgba(242,203,5,0.2)] relative overflow-hidden theme-transition">
            <Heart className="w-20 h-20 text-[#F2CB05] mx-auto mb-8 animate-bounce fill-current" />
            <h3 className="text-4xl font-black italic mb-4 tracking-tighter text-white uppercase">¡TU VOTO ES LEY!</h3>
            <p className="text-neutral-500 font-black mb-10 uppercase text-xs tracking-[0.3em] max-w-xs mx-auto">Prepárate para la detonación en la pista.</p>
            <a 
              href="https://www.instagram.com/djpeligroperu" 
              target="_blank" 
              className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-black py-5 px-10 rounded-[1.5rem] inline-flex items-center gap-4 shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm tracking-widest uppercase italic"
            >
              <Instagram className="w-6 h-6" /> SEGUIR RESULTADOS
            </a>
          </div>
        ) : mode === 'songs' ? (
          <div className="space-y-6">
            <p className="text-center text-neutral-400 font-black uppercase text-[10px] tracking-[0.4em] mb-4">Selecciona un Hit del Playlist:</p>
            {songs.map(song => (
              <SongCard key={song.id} song={song} onClick={() => handleVoteAction(song.id)} disabled={isClosed} isDarkMode={isDarkMode} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {genres.map(g => (
              <button 
                key={g} 
                onClick={() => handleVoteAction(g)}
                disabled={isClosed}
                className="group relative flex items-center justify-between bg-[var(--card-bg)] p-8 rounded-[2.5rem] border-2 border-transparent hover:border-[#F2CB05] transition-all shadow-xl active:scale-95 disabled:opacity-50 theme-transition overflow-hidden"
              >
                <div className="flex items-center gap-8 relative z-10">
                  <div className="bg-[#F2CB05] p-5 rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-[#F2CB05]/20">
                    {getGenreIcon(g)}
                  </div>
                  <span className="text-4xl font-black italic uppercase tracking-tighter group-hover:text-[#F2B705] transition-colors">{g}</span>
                </div>
                <div className="bg-[#F2CB05] text-[#0D0D0D] font-black px-8 py-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 italic text-sm">VOTAR</div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER CON ACCESO DJ */}
      <footer className="mt-24 py-16 text-center border-t border-[var(--border-color)] space-y-10 theme-transition">
        <div className="flex flex-col items-center">
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.6em] mb-6">DJ PELIGRO • EXCLUSIVE SYSTEM</p>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-[#F2CB05] rounded-full"></div>
            <div className="w-12 h-1.5 bg-[#F2CB05] rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-[#F2CB05] rounded-full"></div>
          </div>
        </div>

        {/* ACCESO DJ ESTILIZADO */}
        <div className="flex justify-center">
          <Link 
            to="/admin" 
            className="group flex items-center gap-4 bg-[var(--card-bg)] hover:bg-[#F2CB05] border border-[var(--border-color)] hover:border-[#F2CB05] px-10 py-5 rounded-[2rem] transition-all shadow-xl hover:shadow-[#F2CB05]/20 group active:scale-95"
          >
            <div className="bg-[#F2CB05] group-hover:bg-[#0D0D0D] p-3 rounded-xl transition-colors">
              <ShieldCheck className="w-5 h-5 text-[#0D0D0D] group-hover:text-[#F2CB05]" />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black text-neutral-500 group-hover:text-[#0D0D0D]/70 uppercase tracking-widest leading-none mb-1">Espace Maestro</p>
              <p className="text-sm font-black text-white group-hover:text-[#0D0D0D] uppercase italic tracking-tighter">INGRESAR AL PANEL DJ</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#F2CB05] group-hover:text-[#0D0D0D] group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.3em]">
          Todos los derechos reservados &copy; 2024
        </p>
      </footer>
    </div>
  );
};

export default GuestView;
