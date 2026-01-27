
import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import SongCard from './SongCard';
import VoteModal from './VoteModal';
import { Music, CheckCircle, Lock, ChevronRight } from 'lucide-react';

interface GuestViewProps {
  songs: Song[];
  onVote: (songId: string, name: string, whatsapp?: string) => void;
}

const GuestView: React.FC<GuestViewProps> = ({ songs, onVote }) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const voted = localStorage.getItem('has_voted') === 'true';
    setHasVoted(voted);
  }, []);

  const handleVoteSubmit = (name: string, whatsapp?: string) => {
    if (selectedSong) {
      onVote(selectedSong.id, name, whatsapp);
      setHasVoted(true);
      setSelectedSong(null);
    }
  };

  if (hasVoted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-black">
        <div className="max-w-md w-full bg-neutral-900 rounded-[2.5rem] p-12 border border-neutral-800 shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
            <CheckCircle className="w-24 h-24 text-green-500 relative z-10" />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tighter">¡Voto Recibido!</h1>
          <p className="text-neutral-400 text-lg leading-relaxed font-medium">
            El DJ ya sabe qué canción quieres escuchar. ¡Quédate cerca de la pista!
          </p>
          <div className="mt-12 pt-8 border-t border-neutral-800">
             <a 
              href="#/admin" 
              className="inline-flex items-center space-x-2 text-neutral-600 hover:text-green-500 transition-colors text-xs font-black uppercase tracking-widest"
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
    <div className="max-w-screen-md mx-auto px-4 py-12 md:py-20 flex flex-col min-h-screen">
      <header className="text-center mb-16 space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-3xl rotate-12 mb-4 shadow-2xl shadow-green-500/20 group hover:rotate-0 transition-all duration-500">
          <Music className="w-10 h-10 text-black -rotate-12 group-hover:rotate-0 transition-all duration-500" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-white">
          🎧 Escoge la <br/><span className="text-green-500">próxima canción</span>
        </h1>
        <p className="text-neutral-400 text-xl font-medium max-w-sm mx-auto">
          Toca en <span className="text-green-500 font-bold">Vota aquí</span> para pedir tu tema favorito
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 flex-grow animate-in fade-in slide-in-from-bottom-8 duration-700">
        {songs.map((song) => (
          <SongCard 
            key={song.id} 
            song={song} 
            onClick={() => setSelectedSong(song)} 
          />
        ))}
      </div>

      <footer className="mt-20 text-center pb-12 border-t border-neutral-900 pt-12 space-y-8">
        <div className="flex flex-col items-center">
          <p className="text-neutral-600 text-xs font-black uppercase tracking-[0.2em] mb-4">
            DJ VOTE FLOW • {new Date().getFullYear()}
          </p>
          <div className="w-12 h-1 bg-green-500 rounded-full"></div>
        </div>
        
        {/* Acceso DJ solicitado como un botón discreto pero accesible */}
        <div className="flex justify-center">
          <a 
            href="#/admin" 
            className="flex items-center space-x-3 text-neutral-500 hover:text-green-500 transition-all bg-neutral-900/40 hover:bg-neutral-900 px-6 py-3 rounded-2xl border border-neutral-800/50 group"
          >
            <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs uppercase tracking-widest">Panel del DJ</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </a>
        </div>
      </footer>

      {selectedSong && (
        <VoteModal 
          song={selectedSong} 
          onClose={() => setSelectedSong(null)} 
          onSubmit={handleVoteSubmit} 
        />
      )}
    </div>
  );
};

export default GuestView;
