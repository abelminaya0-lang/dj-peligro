
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import SongCard from './SongCard';
import { Instagram, Timer, Disc, Radio, Activity, Music, Mic2, Zap } from 'lucide-react';
import PostVoteModal from './PostVoteModal';
import VoteModal from './VoteModal';

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
  onVote: (targetId: string, name?: string, phone?: string) => void;
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
    const interval = setInterval(() => {
      const diff = votingEndsAt - Date.now();
      setTimeLeft(diff <= 0 ? 0 : diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [votingEndsAt]);

  const handleInitiateVote = (id: string, title: string, artist: string, cover: string) => {
    if (cooldownRemaining === 0 && (!votingEndsAt || (timeLeft && timeLeft > 0))) {
      setSelectedItem({ id, title, artist, coverUrl: cover });
    }
  };

  const isClosed = votingEndsAt !== null && timeLeft === 0;

  return (
    <div className="max-w-screen-md mx-auto px-1 flex flex-col min-h-[100dvh] bg-black pb-10 overflow-x-hidden relative">
      <PostVoteModal isVisible={cooldownRemaining > 0} cooldownMs={cooldownRemaining} />
      {selectedItem && (
        <VoteModal song={selectedItem} onClose={() => setSelectedItem(null)} onSubmit={(n, p) => { onVote(selectedItem.id, n, p); setSelectedItem(null); }} />
      )}

      <header className="text-center pt-6 mb-4 flex flex-col items-center">
        <div className="relative w-full flex justify-center -mb-10 md:-mb-16">
          <img src={DJ_LOGO} className="w-64 md:w-96 object-contain drop-shadow-[0_0_50px_rgba(242,203,5,0.4)] relative z-10" alt="DJ Peligro" />
        </div>
        
        <div className="relative z-20 bg-white text-black py-3 px-8 md:py-4 md:px-12 transform -skew-x-2 border-b-4 border-r-4 border-[#F2CB05] mb-6 shadow-2xl">
          <h2 className="text-[11px] md:text-sm font-black uppercase italic tracking-[0.25em] leading-none text-center">
            LA PRÓXIMA CANCIÓN LA ELIGES TÚ
          </h2>
        </div>

        {votingEndsAt && (
          <div className={`w-full max-w-[180px] flex items-center justify-center gap-2 py-1.5 rounded-lg border-2 ${isClosed ? 'bg-red-600 border-red-700' : 'bg-[#111] border-[#F2CB05] text-white'}`}>
            {!isClosed && <Timer className="w-3.5 h-3.5 animate-pulse text-[#F2CB05]" />}
            <span className="text-xl font-black italic tabular-nums">
              {isClosed ? 'CERRADO' : `${Math.floor(timeLeft!/60000)}:${String(Math.floor((timeLeft!%60000)/1000)).padStart(2,'0')}`}
            </span>
          </div>
        )}
      </header>

      <main className="flex-grow space-y-1.5 px-2">
        {mode === 'songs' ? (
          songs.map(song => (
            <SongCard key={song.id} song={song} onClick={() => handleInitiateVote(song.id, song.title, song.artist, song.coverUrl)} disabled={isClosed || cooldownRemaining > 0} />
          ))
        ) : (
          genres.map(g => (
            <button key={g} onClick={() => handleInitiateVote(g, g, 'DJ PELIGRO', 'https://picsum.photos/seed/genre/300/300')} disabled={isClosed || cooldownRemaining > 0} className="group flex items-center justify-between p-5 rounded-2xl bg-[#111] border border-white/5 w-full active:scale-95 transition-all">
              <span className="text-2xl font-black italic uppercase text-white tracking-tighter">{g}</span>
              <div className="bg-[#F2CB05] text-black font-black px-6 py-3 rounded-xl italic text-xs">VOTAR</div>
            </button>
          ))
        )}
      </main>

      <footer className="mt-20 py-10 flex flex-col items-center">
        <div className="flex justify-center gap-16 items-center mb-40">
           <a href="https://instagram.com/djpeligroperu" className="text-white/40 hover:text-[#F2CB05] transition-colors"><Instagram className="w-10 h-10" /></a>
           <a href="https://tiktok.com/@djpeligroperu" className="text-white/40 hover:text-[#F2CB05] transition-colors"><TikTokIcon className="w-10 h-10" /></a>
        </div>
        <Link to="/admin" className="opacity-[0.02] hover:opacity-100 p-10 transition-opacity"><Zap className="w-6 h-6 text-[#F2CB05] fill-current" /></Link>
        <p className="text-[7px] font-black uppercase tracking-[1.5em] opacity-10">DJ PELIGRO FLOW</p>
      </footer>
    </div>
  );
};

export default GuestView;
