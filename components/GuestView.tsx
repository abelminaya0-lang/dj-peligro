
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import SongCard from './SongCard';
import { Instagram, Heart, Timer, AlarmClockOff, Disc, Radio, Activity, Music, Mic2, Users, BarChart3, Zap } from 'lucide-react';
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
    if (g.includes('reggaetón') || g.includes('regueton')) return <Disc className="text-black w-7 h-7" />;
    if (g.includes('electrónica')) return <Activity className="text-black w-7 h-7" />;
    if (g.includes('rock')) return <Mic2 className="text-black w-7 h-7" />;
    if (g.includes('villera') || g.includes('cumbia')) return <Radio className="text-black w-7 h-7" />;
    if (g.includes('salsa')) return <Music className="text-black w-7 h-7" />;
    return <Music className="text-black w-7 h-7" />;
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 flex flex-col min-h-[100dvh] bg-[#0D0D0D] pb-10 overflow-x-hidden relative">
      {/* PANTALLA DE BLOQUEO TEMPORAL POST-VOTO */}
      <PostVoteModal isVisible={cooldownRemaining > 0} cooldownMs={cooldownRemaining} />

      {/* ACCESO RÁPIDO DJ (EL RAYO) */}
      <Link 
        to="/admin" 
        className="fixed bottom-6 right-6 z-[80] p-4 bg-[#F2CB05] text-black rounded-full shadow-[0_10px_30px_rgba(242,203,5,0.4)] hover:scale-110 active:scale-95 transition-all group"
        aria-label="Acceso DJ"
      >
        <Zap className="w-6 h-6 fill-current animate-pulse group-hover:animate-none" />
      </Link>

      {/* MODAL DE REGISTRO */}
      {selectedItem && (
        <VoteModal 
          song={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onSubmit={handleFinalVote} 
        />
      )}

      <header className="text-center pt-8 mb-4 animate-in fade-in duration-700">
        <div className="relative w-full flex justify-center mb-4">
          <img src={DJ_LOGO} className="w-40 md:w-64 object-contain drop-shadow-[0_0_25px_rgba(242,203,5,0.4)]" alt="DJ Peligro" />
        </div>
        
        <div className="inline-block bg-white text-black px-8 py-4 md:px-12 md:py-6 transform -skew-x-12 shadow-[0_15px_40px_-10px_rgba(242,203,5,0.4)] border-r-[6px] border-b-[6px] border-[#F2CB05] mb-10">
          <h2 className="text-base md:text-3xl font-[900] uppercase italic tracking-tighter leading-none">
            LA PRÓXIMA CANCIÓN LA ELIGES TÚ
          </h2>
        </div>

        <div className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-6 flex items-center justify-around shadow-2xl mb-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#F2CB05] font-black text-[10px] uppercase tracking-[0.3em] mb-1">
              <Users className="w-3.5 h-3.5" /> PARTICIPANTES
            </div>
            <span className="text-3xl font-black italic tracking-tighter">{votes.length}</span>
          </div>
          <div className="h-12 w-px bg-white/10"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#F2CB05] font-black text-[10px] uppercase tracking-[0.3em] mb-1">
               <BarChart3 className="w-3.5 h-3.5" /> LÍDER ACTUAL
            </div>
            <span className="text-base font-black italic uppercase truncate max-w-[150px]">
              {stats[0]?.count > 0 ? stats[0].name : "---"}
            </span>
          </div>
        </div>

        {votingEndsAt && (
          <div className={`w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] border-2 ${isClosed ? 'bg-red-500 border-red-600' : 'bg-[#151515] border-[#F2CB05] text-white shadow-lg shadow-[#F2CB05]/10'}`}>
            {!isClosed && <Timer className="w-6 h-6 animate-pulse text-[#F2CB05]" />}
            <span className="text-2xl font-black tracking-[0.15em] italic">
              {isClosed ? 'VOTACIÓN CERRADA' : `${Math.floor(timeLeft!/60000)}:${String(Math.floor((timeLeft!%60000)/1000)).padStart(2,'0')}`}
            </span>
          </div>
        )}
      </header>

      <main className="flex-grow space-y-4 px-1">
        <p className="text-center text-neutral-600 font-black uppercase text-[10px] tracking-[0.5em] mb-6 opacity-50">
          TOCA PARA VOTAR:
        </p>
        
        {mode === 'songs' ? (
          <div className="space-y-4">
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
          <div className="grid grid-cols-1 gap-4">
            {genres.map(g => (
              <button 
                key={g} 
                onClick={() => handleInitiateVote(g, g, 'DJ PELIGRO', 'https://picsum.photos/seed/genre/300/300')}
                disabled={isClosed || cooldownRemaining > 0}
                className="group relative flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all active:scale-95 bg-[#1A1A1A] border-white/5 disabled:opacity-50 shadow-xl"
              >
                <div className="flex items-center gap-6">
                  <div className="p-5 rounded-2xl bg-[#F2CB05] shadow-lg shadow-[#F2CB05]/20">
                    {getGenreIcon(g)}
                  </div>
                  <span className="text-2xl font-[900] italic uppercase tracking-tighter text-white">
                    {g}
                  </span>
                </div>
                <div className="font-black px-8 py-5 rounded-2xl italic text-sm bg-white text-black shadow-lg">
                  VOTAR
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-16 py-12 text-center border-t border-white/5 opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[1em] mb-6">DJ PELIGRO • ID SYSTEM</p>
        <div className="flex justify-center gap-8">
           <Instagram className="w-6 h-6" />
           <Music className="w-6 h-6" />
        </div>
      </footer>
    </div>
  );
};

export default GuestView;
