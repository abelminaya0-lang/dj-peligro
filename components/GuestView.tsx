
import React, { useState, useEffect } from 'react';
import { Song, Vote, VotingMode } from '../types';
import SongCard from './SongCard';
import { Music, CheckCircle, Instagram, Heart, Timer, AlarmClockOff, Disc, Radio } from 'lucide-react';

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

const GuestView: React.FC<GuestViewProps> = ({ mode, songs, genres, onVote, votingEndsAt, isDarkMode }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769720682/avatars-000658755773-nboqus-t500x500-removebg-preview_r7cgsp.png";

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
    }
  };

  const isClosed = votingEndsAt !== null && timeLeft === 0;

  return (
    <div className="max-w-screen-md mx-auto px-4 py-12 flex flex-col min-h-screen">
      {/* HEADER DINÁMICO */}
      <header className="text-center mb-12 space-y-6 pt-12 animate-in fade-in duration-700">
        <div className="inline-block relative">
          <div className="absolute inset-0 bg-[#F2CB05] blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <img src={DJ_LOGO} className="w-32 h-32 relative z-10 bg-[#F2CB05] rounded-[2.5rem] p-2 rotate-6 hover:rotate-0 transition-all duration-500 shadow-2xl" alt="Logo" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic text-[var(--text-primary)]">
            DJ <span className="text-[#F2B705]">PELIGRO</span>
          </h1>
          <div className="bg-[#F2CB05] text-[#0D0D0D] px-6 py-2 inline-block transform -skew-x-12">
            <h2 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter">
              La próxima canción la eliges tú
            </h2>
          </div>
        </div>

        {votingEndsAt && (
          <div className={`flex items-center justify-center gap-3 font-black text-2xl tabular-nums ${isClosed ? 'text-red-500' : 'text-[#F2B705]'}`}>
            {isClosed ? <AlarmClockOff /> : <Timer className="animate-spin-slow" />}
            {isClosed ? 'VOTACIÓN CERRADA' : `${Math.floor(timeLeft!/60000)}:${String(Math.floor((timeLeft!%60000)/1000)).padStart(2,'0')}`}
          </div>
        )}
      </header>

      {/* CONTENIDO DE VOTACIÓN */}
      <main className="flex-grow space-y-6 animate-in slide-in-from-bottom-12 duration-1000">
        {hasVoted ? (
          <div className="bg-[var(--card-bg)] border-2 border-[#F2CB05] rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden">
            <Heart className="w-16 h-16 text-[#F2CB05] mx-auto mb-6 animate-bounce fill-current" />
            <h3 className="text-3xl font-black italic mb-4">¡VOTO REGISTRADO!</h3>
            <p className="text-neutral-500 font-bold mb-8 uppercase text-sm tracking-widest">Atento a la mezcla, tu elección sonará pronto.</p>
            <a 
              href="https://www.instagram.com/djpeligroperu" 
              target="_blank" 
              className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-black py-4 px-8 rounded-2xl inline-flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
            >
              <Instagram /> VER RESULTADOS EN IG
            </a>
          </div>
        ) : mode === 'songs' ? (
          <div className="space-y-4">
            {songs.map(song => (
              <SongCard key={song.id} song={song} onClick={() => handleVoteAction(song.id)} disabled={isClosed} isDarkMode={isDarkMode} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {genres.map(g => (
              <button 
                key={g} 
                onClick={() => handleVoteAction(g)}
                disabled={isClosed}
                className="group flex items-center justify-between bg-[var(--card-bg)] p-8 rounded-[2rem] border-2 border-transparent hover:border-[#F2CB05] transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-[#F2CB05] p-4 rounded-2xl group-hover:rotate-12 transition-transform">
                    {g === 'Reggaetón' ? <Disc className="text-[#0D0D0D]" /> : <Radio className="text-[#0D0D0D]" />}
                  </div>
                  <span className="text-3xl font-black italic uppercase tracking-tighter">{g}</span>
                </div>
                <div className="bg-[#F2CB05] text-[#0D0D0D] font-black px-6 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">VOTAR</div>
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-20 py-12 text-center border-t border-[var(--border-color)]">
        <p className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4">DJ PELIGRO • EXCLUSIVE EXPERIENCE</p>
        <div className="w-12 h-1.5 bg-[#F2CB05] mx-auto rounded-full"></div>
      </footer>
    </div>
  );
};

export default GuestView;
