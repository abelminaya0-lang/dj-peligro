
import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import SongCard from './SongCard';
import { Music, CheckCircle, Lock, ChevronRight, ListMusic, Instagram, Heart, Timer, AlarmClockOff, Moon, Sun } from 'lucide-react';

interface GuestViewProps {
  songs: Song[];
  onVote: (songId: string, name: string, whatsapp?: string) => void;
  votingEndsAt: number | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const GuestView: React.FC<GuestViewProps> = ({ songs, onVote, votingEndsAt, isDarkMode, toggleTheme }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [votedSongTitle, setVotedSongTitle] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769720682/avatars-000658755773-nboqus-t500x500-removebg-preview_r7cgsp.png";

  useEffect(() => {
    const voted = localStorage.getItem('has_voted') === 'true';
    setHasVoted(voted);
  }, []);

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

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isVotingClosed = votingEndsAt !== null && (timeLeft !== null && timeLeft <= 0);
  const isVotingDisabled = isVotingClosed || hasVoted || !votingEndsAt;

  const handleDirectVote = (song: Song) => {
    if (!isVotingDisabled) {
      onVote(song.id, 'Anónimo', '');
      setVotedSongTitle(song.title);
      setHasVoted(true);
      setShowSuccessScreen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewList = () => {
    setShowSuccessScreen(false);
  };

  if (hasVoted && showSuccessScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center theme-transition bg-[var(--bg-primary)]">
        <div className="max-w-md w-full bg-[var(--card-bg)] rounded-[3rem] p-10 md:p-14 border border-[var(--border-color)] shadow-2xl animate-in fade-in zoom-in duration-500 relative overflow-hidden theme-transition">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#F2CB05]/10 blur-[80px] rounded-full"></div>
          
          <div className="flex justify-center mb-10 relative">
            <div className="absolute inset-0 bg-[#F2CB05]/20 blur-3xl rounded-full scale-150"></div>
            <div className="bg-[#F2CB05] p-5 rounded-full relative z-10 shadow-2xl shadow-[#F2CB05]/40">
              <CheckCircle className="w-12 h-12 text-[#0D0D0D]" />
            </div>
          </div>
          
          <h1 className="text-4xl font-black mb-4 tracking-tighter text-[var(--text-primary)]">¡GRACIAS POR VOTAR!</h1>
          <p className="text-neutral-500 text-lg font-medium mb-10">
            Tu voto por <span className="text-[#F2B705] font-black italic">"{votedSongTitle || 'tu canción'}"</span> ha sido registrado.
          </p>
          
          <div className="bg-[var(--bg-primary)] rounded-[2.5rem] p-8 mb-8 border border-[var(--border-color)] backdrop-blur-md theme-transition">
            <div className="flex justify-center mb-4">
              <Heart className="w-8 h-8 text-[#594302] fill-[#F2CB05] animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-[var(--text-primary)] mb-4 leading-tight uppercase">¿QUIERES VER QUIÉN VA GANANDO?</h2>
            <p className="text-neutral-500 text-sm font-medium mb-8">
              Sigue el conteo en vivo y los resultados finales en mis historias de Instagram.
            </p>
            
            <a 
              href="https://www.instagram.com/djpeligroperu?igsh=MWQ1NmhhcjFubXFvbg=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center space-x-3 transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-purple-500/20"
            >
              <span className="flex items-center gap-3">
                <Instagram className="w-6 h-6" />
                <span className="tracking-tight text-lg">SEGUIR EN INSTAGRAM</span>
              </span>
            </a>
          </div>
          
          <button 
            onClick={handleViewList}
            className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95 mb-8 ${isDarkMode ? 'bg-[#F2F2F2] text-[#0D0D0D]' : 'bg-[#0D0D0D] text-white'}`}
          >
            <ListMusic className="w-5 h-5" />
            <span>Ver todas las canciones</span>
          </button>

          <div className="pt-8 border-t border-[var(--border-color)]">
             <a 
              href="#/admin" 
              className="inline-flex items-center space-x-2 text-neutral-400 hover:text-[#F2B705] transition-colors text-xs font-black uppercase tracking-widest"
            >
              <Lock className="w-4 h-4" />
              <span>Acceso Administrador</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-12 md:py-20 flex flex-col min-h-screen theme-transition bg-[var(--bg-primary)]">
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-lg hover:scale-110 active:scale-95 transition-all"
      >
        {isDarkMode ? <Sun className="w-6 h-6 text-[#F2CB05]" /> : <Moon className="w-6 h-6 text-[#594302]" />}
      </button>

      {/* Timer Display */}
      {votingEndsAt && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${isVotingClosed ? 'scale-110' : 'scale-100'}`}>
          <div className={`flex items-center gap-4 px-8 py-4 rounded-full border shadow-2xl backdrop-blur-xl theme-transition ${
            isVotingClosed 
              ? 'bg-red-500/20 border-red-500/50 text-red-500' 
              : timeLeft && timeLeft < 30000 
                ? 'bg-orange-500/20 border-orange-500/50 text-orange-500 animate-pulse' 
                : isDarkMode ? 'bg-[#1A1A1A] border-[#F2CB05] text-[#F2CB05]' : 'bg-white border-[#F2CB05] text-[#0D0D0D]'
          }`}>
            {isVotingClosed ? <AlarmClockOff className="w-6 h-6" /> : <Timer className="w-6 h-6 animate-spin-slow text-[#F2CB05]" />}
            <span className="text-2xl font-black tracking-widest tabular-nums leading-none">
              {isVotingClosed ? 'VOTACIÓN CERRADA' : timeLeft ? formatTime(timeLeft) : '...'}
            </span>
          </div>
        </div>
      )}

      <header className="text-center mb-16 space-y-6 pt-12">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-[#F2CB05] rounded-[2.5rem] rotate-12 mb-4 shadow-2xl shadow-[#F2CB05]/20 group hover:rotate-0 transition-all duration-700 cursor-pointer overflow-hidden p-2">
          <img 
            src={DJ_LOGO} 
            alt="DJ Peligro Logo" 
            className="w-full h-full object-contain -rotate-12 group-hover:rotate-0 transition-all duration-700"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-[var(--text-primary)] uppercase italic theme-transition">
            DJ <span className="text-[#F2B705]">PELIGRO</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[#0D0D0D] uppercase italic bg-[#F2CB05] inline-block px-4 py-1 transform -skew-x-6">
            La próxima canción la eliges tú
          </h2>
        </div>
        
        {isVotingClosed ? (
          <div className="bg-[var(--card-bg)] border border-red-500/30 p-8 rounded-[3rem] inline-flex flex-col items-center gap-4 animate-in zoom-in shadow-xl theme-transition">
             <div className="bg-red-500 p-3 rounded-full shadow-lg shadow-red-500/20">
              <AlarmClockOff className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] italic">TIEMPO AGOTADO</h2>
            <p className="text-neutral-500 text-sm font-bold max-w-xs uppercase">
              La ronda de votación ha terminado. Espera a que el DJ inicie una nueva.
            </p>
            <a 
              href="https://www.instagram.com/djpeligroperu?igsh=MWQ1NmhhcjFubXFvbg=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-pink-500/20"
            >
              <Instagram className="w-5 h-5" />
              VER RESULTADOS EN IG
            </a>
          </div>
        ) : !votingEndsAt ? (
           <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-[3rem] inline-flex flex-col items-center gap-4 animate-in fade-in shadow-lg theme-transition">
             <div className="bg-[var(--bg-primary)] p-3 rounded-full animate-pulse theme-transition">
               <Music className="w-8 h-8 text-[#F2CB05]" />
             </div>
             <p className="text-neutral-400 text-sm font-black uppercase tracking-widest">Esperando inicio de sesión...</p>
           </div>
        ) : hasVoted ? (
          <div className="bg-[var(--card-bg)] border border-[#F2CB05]/30 p-5 rounded-[2.5rem] inline-flex flex-col md:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-xl theme-transition">
            <div className="flex items-center gap-3">
              <div className="bg-[#F2CB05]/20 p-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-[#F2B705]" />
              </div>
              <p className="text-[var(--text-primary)] text-base font-bold theme-transition">
                ¡Voto registrado con éxito!
              </p>
            </div>
            <div className="h-4 w-px bg-[var(--border-color)] hidden md:block"></div>
            <a 
              href="https://www.instagram.com/djpeligroperu?igsh=MWQ1NmhhcjFubXFvbg=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-pink-500/10"
            >
              <Instagram className="w-4 h-4" />
              VER RESULTADOS
            </a>
          </div>
        ) : (
          <p className="text-neutral-500 text-xl font-medium max-w-sm mx-auto">
            Selecciona tu canción favorita y <span className="text-[#F2B705] font-black italic">vota al instante</span>.
          </p>
        )}
      </header>

      <div className={`grid grid-cols-1 gap-4 flex-grow animate-in fade-in slide-in-from-bottom-8 duration-700 ${isVotingDisabled ? 'pointer-events-none' : ''}`}>
        {songs.map((song) => (
          <SongCard 
            key={song.id} 
            song={song} 
            disabled={isVotingDisabled}
            onClick={() => handleDirectVote(song)} 
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      <footer className="mt-24 text-center pb-12 border-t border-[var(--border-color)] pt-16 space-y-10 theme-transition">
        <div className="flex flex-col items-center">
          <p className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6">
            DJ PELIGRO • EVENTO EXCLUSIVO
          </p>
          <div className="w-16 h-1.5 bg-[#F2CB05] rounded-full shadow-[0_0_15px_rgba(242,203,5,0.3)]"></div>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <a 
            href="https://www.instagram.com/djpeligroperu?igsh=MWQ1NmhhcjFubXFvbg=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-neutral-500 hover:text-[var(--text-primary)] transition-all group theme-transition"
          >
            <Instagram className="w-5 h-5 group-hover:text-pink-600 transition-colors" />
            <span className="font-bold text-sm tracking-widest uppercase">@djpeligroperu</span>
          </a>

          <a 
            href="#/admin" 
            className="flex items-center space-x-3 text-neutral-400 hover:text-[var(--text-primary)] transition-all bg-[var(--card-bg)] hover:bg-[var(--bg-primary)] px-8 py-4 rounded-2xl border border-[var(--border-color)] group shadow-sm theme-transition"
          >
            <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs uppercase tracking-[0.2em]">DJ Admin Access</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default GuestView;
