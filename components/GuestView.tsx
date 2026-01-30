
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import SongCard from './SongCard';
import { Instagram, Timer, Disc, Radio, Activity, Music, Mic2, Zap } from 'lucide-react';
import PostVoteModal from './PostVoteModal';
import VoteModal from './VoteModal';

// Icono de TikTok personalizado ya que Lucide no lo incluye por defecto
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
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

const GuestView: React.FC<GuestViewProps> = ({ mode, songs, genres, onVote, votingEndsAt, votes, isDarkMode, toggleTheme }) => {
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
    window.addEventListener('storage', updateCooldown);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', updateCooldown);
    };
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

  const handleFinalVote = (name: string, phone?: string) => {
    if (selectedItem) {
      onVote(selectedItem.id, name, phone);
      setSelectedItem(null);
    }
  };

  const isClosed = votingEndsAt !== null && timeLeft === 0;

  const getGenreIcon = (genre: string) => {
    const g = genre.toLowerCase();
    if (g.includes('reggaetón') || g.includes('regueton')) return <Disc className="text-black w-8 h-8" />;
    if (g.includes('electrónica')) return <Activity className="text-black w-8 h-8" />;
    if (g.includes('rock')) return <Mic2 className="text-black w-8 h-8" />;
    if (g.includes('villera') || g.includes('cumbia')) return <Radio className="text-black w-8 h-8" />;
    if (g.includes('salsa')) return <Music className="text-black w-8 h-8" />;
    return <Music className="text-black w-8 h-8" />;
  };

  return (
    <div className="max-w-screen-md mx-auto px-1 flex flex-col min-h-[100dvh] bg-[#000000] pb-10 overflow-x-hidden relative">
      {/* PANTALLA DE BLOQUEO TEMPORAL POST-VOTO */}
      <PostVoteModal isVisible={cooldownRemaining > 0} cooldownMs={cooldownRemaining} />

      {/* MODAL DE REGISTRO */}
      {selectedItem && (
        <VoteModal 
          song={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onSubmit={handleFinalVote} 
        />
      )}

      <header className="text-center pt-4 mb-2 animate-in fade-in duration-700 flex flex-col items-center">
        {/* LOGO MÁS GRANDE Y CERCA DEL BANNER */}
        <div className="relative w-full flex justify-center -mb-8 md:-mb-14">
          <div className="relative">
             <div className="absolute inset-0 bg-[#F2CB05] blur-[80px] opacity-15"></div>
             <img 
               src={DJ_LOGO} 
               className="w-56 md:w-96 object-contain drop-shadow-[0_0_50px_rgba(242,203,5,0.4)] relative z-10 transition-transform hover:scale-105 duration-500" 
               alt="DJ Peligro" 
             />
          </div>
        </div>
        
        {/* BANNER MÁS GRANDE, FONDO BLANCO, LETRA NEGRA */}
        <div className="relative z-20 bg-white text-black py-4 px-10 md:py-6 md:px-14 transform -skew-x-3 border-b-4 border-r-4 border-[#F2CB05] mb-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] inline-block">
          <h2 className="text-base md:text-2xl font-black uppercase italic tracking-tighter leading-none text-center">
            LA PRÓXIMA CANCIÓN LA ELIGES TÚ
          </h2>
        </div>

        {votingEndsAt && (
          <div className={`w-full max-w-[240px] flex items-center justify-center gap-3 py-2 rounded-xl border-2 mb-4 transition-all ${isClosed ? 'bg-red-600 border-red-700' : 'bg-[#111] border-[#F2CB05] text-white'}`}>
            {!isClosed && <Timer className="w-4 h-4 animate-pulse text-[#F2CB05]" />}
            <span className="text-2xl font-black tracking-widest italic tabular-nums">
              {isClosed ? 'CERRADO' : `${Math.floor(timeLeft!/60000)}:${String(Math.floor((timeLeft!%60000)/1000)).padStart(2,'0')}`}
            </span>
          </div>
        )}
      </header>

      <main className="flex-grow space-y-1 px-1">
        {mode === 'songs' ? (
          <div className="space-y-1">
            {songs.map(song => (
              <SongCard 
                key={song.id} 
                song={song} 
                onClick={() => handleInitiateVote(song.id, song.title, song.artist, song.coverUrl)} 
                disabled={isClosed || cooldownRemaining > 0} 
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1">
            {genres.map(g => (
              <button 
                key={g} 
                onClick={() => handleInitiateVote(g, g, 'DJ PELIGRO', 'https://picsum.photos/seed/genre/300/300')}
                disabled={isClosed || cooldownRemaining > 0}
                className="group relative flex items-center justify-between p-5 rounded-2xl border transition-all active:scale-[0.98] bg-[#111] border-white/5 disabled:opacity-50"
              >
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-xl bg-[#F2CB05] shadow-lg group-hover:rotate-6 transition-transform">
                    {getGenreIcon(g)}
                  </div>
                  <span className="text-2xl font-black italic uppercase tracking-tighter text-white">
                    {g}
                  </span>
                </div>
                <div className="font-black px-8 py-4 rounded-xl italic text-sm bg-white text-black group-hover:bg-[#F2CB05] transition-colors shadow-lg">
                  VOTAR
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-16 py-10 text-center flex flex-col items-center">
        {/* Redes Sociales con TikTok oficial */}
        <div className="flex justify-center gap-14 items-center mb-32">
           <a href="https://instagram.com/djpeligroperu" target="_blank" rel="noopener noreferrer" className="text-white opacity-40 hover:opacity-100 transition-all hover:scale-110">
              <Instagram className="w-10 h-10" />
           </a>
           <a href="https://tiktok.com/@djpeligroperu" target="_blank" rel="noopener noreferrer" className="text-white opacity-40 hover:opacity-100 transition-all hover:scale-110">
              <TikTokIcon className="w-10 h-10" />
           </a>
        </div>

        {/* Acceso Panel (El Rayo) - Espacio extremo */}
        <Link 
          to="/admin" 
          className="opacity-[0.01] hover:opacity-100 transition-opacity p-10 mb-6 group"
        >
          <Zap className="w-6 h-6 text-[#F2CB05] fill-current group-hover:animate-bounce" />
        </Link>
        
        <p className="text-[8px] font-black uppercase tracking-[1.2em] opacity-10 leading-none">
          DJ PELIGRO • VOTE SYSTEM PRO
        </p>
      </footer>
    </div>
  );
};

export default GuestView;
