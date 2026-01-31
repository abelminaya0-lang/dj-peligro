
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import SongCard from './SongCard';
import { Instagram, Timer, Zap, AlertTriangle, ChevronRight } from 'lucide-react';
import PostVoteModal from './PostVoteModal';
import VoteModal from './VoteModal';
import VotingClosedModal from './VotingClosedModal';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.44-4.14-1.17-.07 2.1-.03 4.21-.05 6.31-.03 1.59-.46 3.23-1.53 4.44-1.39 1.63-3.71 2.44-5.81 2.05-2.22-.32-4.22-1.92-4.93-4.11-.84-2.5.21-5.46 2.47-6.81.7-.44 1.49-.71 2.31-.83v4.11c-.53.11-1.05.35-1.47.73-1.02.89-1.27 2.5-.55 3.69.64 1.13 2.09 1.67 3.32 1.25 1.1-.33 1.83-1.41 1.84-2.55V4.74c-.01-1.57-.01-3.14-.01-4.72Z"/>
  </svg>
);

interface GuestViewProps {
  mode: VotingMode;
  songs: Song[];
  genres: string[];
  votes: Vote[];
  onVote: (targetId: string, name?: string) => void;
  votingEndsAt: number | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const GuestView: React.FC<GuestViewProps> = ({ mode, songs, genres, onVote, votingEndsAt, isDarkMode }) => {
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<{id: string, title: string, artist: string, coverUrl: string} | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722460/LOGO_DJ_PELIGRO_ihglvl.png";
  const VOTE_COOLDOWN_MS = 5 * 60 * 1000;

  useEffect(() => {
    const updateCooldown = () => {
      const lastVote = localStorage.getItem('last_vote_timestamp');
      if (lastVote) {
        const elapsed = Date.now() - Number(lastVote);
        const remaining = VOTE_COOLDOWN_MS - elapsed;
        setCooldownRemaining(remaining > 0 ? remaining : 0);
      } else {
        setCooldownRemaining(0);
      }
    };
    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!votingEndsAt) { setTimeLeft(null); return; }
    const updateTimer = () => {
      const diff = votingEndsAt - Date.now();
      setTimeLeft(diff <= 0 ? 0 : diff);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [votingEndsAt]);

  const handleInitiateVote = (id: string, title: string, artist: string, cover: string) => {
    if (cooldownRemaining === 0 && (!votingEndsAt || (timeLeft && timeLeft > 0))) {
      setSelectedItem({ id, title, artist, coverUrl: cover });
    }
  };

  const handleFinalVote = (name: string) => {
    if (selectedItem) {
      onVote(selectedItem.id, name);
      localStorage.setItem('last_vote_timestamp', Date.now().toString());
      setSelectedItem(null);
    }
  };

  const isClosed = votingEndsAt !== null && timeLeft === 0;
  const isUrgent = timeLeft !== null && timeLeft > 0 && timeLeft <= 60000;

  return (
    <div className="max-w-screen-md mx-auto px-1 flex flex-col min-h-[100dvh] bg-black pb-10 overflow-x-hidden relative">
      {/* Modales de estado */}
      <PostVoteModal isVisible={cooldownRemaining > 0 && !isClosed} cooldownMs={cooldownRemaining} />
      <VotingClosedModal isVisible={isClosed} />
      
      {selectedItem && !isClosed && (
        <VoteModal 
          song={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onSubmit={handleFinalVote} 
        />
      )}

      <header className="text-center pt-8 mb-4 flex flex-col items-center relative">
        {/* Glow effect for urgency */}
        {isUrgent && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-red-600/20 blur-[100px] pointer-events-none animate-pulse"></div>
        )}

        <div className="relative w-full flex justify-center -mb-8 md:-mb-12">
          <img src={DJ_LOGO} className="w-56 md:w-80 object-contain drop-shadow-[0_0_40px_rgba(242,203,5,0.4)] relative z-10" alt="DJ Peligro" />
        </div>
        
        <div className="relative z-20 bg-white text-black py-4 px-10 transform -skew-x-3 border-b-4 border-r-4 border-[#F2CB05] mb-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <h2 className="text-[12px] md:text-base font-black uppercase italic tracking-[0.3em] leading-none text-center">
            LA PRÓXIMA LA ELIGES <span className="text-[#F2CB05] bg-black px-2 ml-1">TÚ</span>
          </h2>
        </div>

        {votingEndsAt && (
          <div className={`w-full max-w-[280px] flex flex-col items-center justify-center gap-1 py-5 px-6 rounded-3xl border-4 transition-all duration-500 scale-110 mb-10 ${
            isClosed 
              ? 'bg-neutral-900 border-neutral-700 text-neutral-500 shadow-none' 
              : isUrgent 
                ? 'bg-red-600 border-white text-white animate-bounce shadow-[0_0_60px_rgba(220,38,38,0.7)]' 
                : 'bg-black border-[#F2CB05] text-[#F2CB05] shadow-[0_0_30px_rgba(242,203,5,0.2)]'
          }`}>
            <div className="flex items-center gap-3">
              {isClosed ? <AlertTriangle className="w-5 h-5" /> : <Timer className={`w-6 h-6 ${isUrgent ? 'animate-spin' : ''}`} />}
              <span className={`text-5xl font-black italic tabular-nums tracking-tighter leading-none`}>
                {isClosed ? 'FIN' : `${Math.floor(timeLeft!/60000)}:${String(Math.floor((timeLeft!%60000)/1000)).padStart(2,'0')}`}
              </span>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] mt-2 ${isUrgent ? 'animate-pulse' : 'opacity-60'}`}>
              {isClosed ? 'VOTACIÓN TERMINADA' : isUrgent ? '¡CORRE, VOTA YA!' : 'CIERRA EN'}
            </p>
          </div>
        )}
      </header>

      <main className={`flex-grow space-y-3 px-3 transition-all duration-700 ${isClosed ? 'opacity-30 grayscale blur-[2px] pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="flex items-center justify-between mb-4 px-2">
           <h3 className="text-xs font-black text-neutral-500 uppercase tracking-widest italic flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-[#F2CB05] rounded-full"></div>
             {mode === 'songs' ? 'Siguiente Track' : 'Elegir Género'}
           </h3>
           <div className="text-[10px] font-black text-[#F2CB05] uppercase tracking-widest flex items-center gap-1">
             LIVE <div className="w-1 h-1 bg-red-600 rounded-full animate-ping"></div>
           </div>
        </div>

        {mode === 'songs' ? (
          songs.map(song => (
            <SongCard key={song.id} song={song} onClick={() => handleInitiateVote(song.id, song.title, song.artist, song.coverUrl)} disabled={isClosed || cooldownRemaining > 0} />
          ))
        ) : (
          genres.map(g => (
            <button 
              key={g} 
              onClick={() => handleInitiateVote(g, g, 'DJ PELIGRO', 'https://picsum.photos/seed/genre/300/300')} 
              disabled={isClosed || cooldownRemaining > 0} 
              className="group flex items-center justify-between p-6 rounded-3xl bg-[#111] border-2 border-white/5 w-full active:scale-95 hover:border-[#F2CB05] transition-all shadow-xl"
            >
              <span className="text-3xl font-black italic uppercase text-white tracking-tighter">{g}</span>
              <div className="bg-[#F2CB05] text-black font-black px-8 py-4 rounded-2xl italic text-xs flex items-center gap-2">
                VOTAR <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))
        )}
      </main>

      <footer className="mt-24 py-12 flex flex-col items-center">
        <div className="flex justify-center gap-20 items-center mb-48">
           <a href="https://instagram.com/djpeligroperu" target="_blank" className="text-white/20 hover:text-[#F2CB05] transition-all hover:scale-125"><Instagram className="w-12 h-12" /></a>
           <a href="https://tiktok.com/@djpeligroperu" target="_blank" className="text-white/20 hover:text-[#F2CB05] transition-all hover:scale-125"><TikTokIcon className="w-12 h-12" /></a>
        </div>
        <Link to="/admin" className="opacity-[0.01] hover:opacity-100 p-10 transition-opacity"><Zap className="w-8 h-8 text-[#F2CB05] fill-current" /></Link>
        <p className="text-[8px] font-black uppercase tracking-[2em] opacity-5">DJ PELIGRO • EL QUE SABE SABE</p>
      </footer>
    </div>
  );
};

export default GuestView;
