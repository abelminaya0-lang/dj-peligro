
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import SongCard from './SongCard';
import { Instagram, Heart, Timer, AlarmClockOff, Disc, Radio, Activity, Music, Mic2, Users, BarChart3, Zap, Trophy } from 'lucide-react';
import PostVoteModal from './PostVoteModal';
import VoteModal from './VoteModal';

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

  const stats = useMemo(() => {
    const total = votes.length;
    const items = mode === 'songs' ? songs : genres;
    return items.map(item => {
      const id = typeof item === 'string' ? item : item.id;
      const name = typeof item === 'string' ? item : item.title;
      const count = votes.filter(v => v.targetId === id).length;
      return { name, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 };
    }).sort((a, b) => b.count - a.count);
  }, [votes, songs, genres, mode]);

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
    <div className="max-w-screen-md mx-auto px-1 flex flex-col min-h-[100dvh] bg-[#0D0D0D] pb-2 overflow-x-hidden relative">
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

      <header className="text-center pt-2 mb-2 animate-in fade-in duration-1000">
        <div className="relative w-full flex justify-center mb-1">
          <div className="relative">
             <div className="absolute inset-0 bg-[#F2CB05] blur-[80px] opacity-20 animate-pulse"></div>
             <img 
               src={DJ_LOGO} 
               className="w-80 md:w-[40rem] object-contain drop-shadow-[0_0_60px_rgba(242,203,5,0.7)] transform hover:scale-105 transition-transform duration-700 relative z-10" 
               alt="DJ Peligro" 
             />
          </div>
        </div>
        
        <div className="inline-block bg-white text-black px-12 py-4 md:px-20 md:py-8 transform -skew-x-6 shadow-[0_20px_50px_-20px_rgba(242,203,5,0.7)] border-r-[8px] border-b-[8px] border-[#F2CB05] mb-4 w-full">
          <h2 className="text-xl md:text-5xl font-[900] uppercase italic tracking-tighter leading-none">
            LA PRÓXIMA CANCIÓN <span className="text-[#F2B705]">LA ELIGES TÚ</span>
          </h2>
        </div>

        {/* STATS COMPACTOS */}
        <div className="grid grid-cols-2 gap-1 mb-2">
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-4">
               <Users className="w-5 h-5 text-[#F2CB05]" />
               <span className="text-3xl font-black italic text-white">{votes.length} <span className="text-[10px] uppercase tracking-widest opacity-40">VOTOS</span></span>
            </div>
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-4 overflow-hidden">
               <Trophy className="w-5 h-5 text-[#F2CB05] shrink-0" />
               <span className="text-lg font-black italic uppercase text-white truncate">{stats[0]?.count > 0 ? stats[0].name : "---"}</span>
            </div>
        </div>

        {votingEndsAt && (
          <div className={`w-full flex items-center justify-center gap-4 py-4 rounded-2xl border-2 mb-2 transition-all ${isClosed ? 'bg-red-500 border-red-600' : 'bg-[#151515] border-[#F2CB05] text-white'}`}>
            {!isClosed && <Timer className="w-6 h-6 animate-pulse text-[#F2CB05]" />}
            <span className="text-3xl font-black tracking-widest italic tabular-nums">
              {isClosed ? 'CERRADO' : `${Math.floor(timeLeft!/60000)}:${String(Math.floor((timeLeft!%60000)/1000)).padStart(2,'0')}`}
            </span>
          </div>
        )}
      </header>

      <main className="flex-grow space-y-1 px-0.5">
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
                className="group relative flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98] bg-[#1A1A1A] border-white/5 disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-[#F2CB05] shadow-lg group-hover:rotate-6 transition-transform">
                    {getGenreIcon(g)}
                  </div>
                  <span className="text-2xl font-[900] italic uppercase tracking-tighter text-white">
                    {g}
                  </span>
                </div>
                <div className="font-black px-8 py-4 rounded-xl italic text-sm bg-white text-black group-hover:bg-[#F2CB05] transition-colors">
                  VOTAR
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-4 py-6 text-center border-t border-white/5 flex flex-col items-center gap-4">
        <div className="flex justify-center gap-10 items-center">
           <a href="https://instagram.com/djpeligroperu" target="_blank" rel="noopener noreferrer" className="opacity-20 hover:opacity-100 transition-opacity">
              <Instagram className="w-8 h-8" />
           </a>
           <Music className="w-8 h-8 opacity-20 hover:opacity-100 transition-opacity" />
           <Activity className="w-8 h-8 opacity-20 hover:opacity-100 transition-opacity" />
           <Link 
             to="/admin" 
             className="opacity-5 hover:opacity-100 transition-opacity p-2 hover:scale-110 active:scale-95 duration-300"
             aria-label="Panel DJ"
           >
             <Zap className="w-7 h-7 text-[#F2CB05] fill-current" />
           </Link>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[1em] opacity-10 leading-none">DJ PELIGRO • VOTE SYSTEM</p>
      </footer>
    </div>
  );
};

export default GuestView;
