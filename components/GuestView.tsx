
import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import SongCard from './SongCard';
import VoteModal from './VoteModal';
import { Music, CheckCircle, Lock, ChevronRight, ListMusic, Info } from 'lucide-react';

interface GuestViewProps {
  songs: Song[];
  onVote: (songId: string, name: string, whatsapp?: string) => void;
}

const GuestView: React.FC<GuestViewProps> = ({ songs, onVote }) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  useEffect(() => {
    const voted = localStorage.getItem('has_voted') === 'true';
    setHasVoted(voted);
    // Si ya votó anteriormente y refresca, le mostramos el mensaje de confirmación primero
    if (voted) {
      setShowSuccessScreen(true);
    }
  }, []);

  const handleVoteSubmit = (name: string, whatsapp?: string) => {
    if (selectedSong) {
      onVote(selectedSong.id, name, whatsapp);
      setHasVoted(true);
      setShowSuccessScreen(true);
      setSelectedSong(null);
    }
  };

  const handleViewList = () => {
    setShowSuccessScreen(false);
  };

  if (hasVoted && showSuccessScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-black">
        <div className="max-w-md w-full bg-neutral-900 rounded-[2.5rem] p-12 border border-neutral-800 shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
            <CheckCircle className="w-24 h-24 text-green-500 relative z-10" />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tighter">¡Voto Registrado!</h1>
          <p className="text-neutral-400 text-lg leading-relaxed font-medium mb-10">
            Tu participación ha sido enviada con éxito. Ya no puedes volver a votar en este evento.
          </p>
          
          <button 
            onClick={handleViewList}
            className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all hover:bg-neutral-200 active:scale-95 mb-6 shadow-xl"
          >
            <ListMusic className="w-5 h-5" />
            <span>Ver lista de canciones</span>
          </button>

          <div className="pt-8 border-t border-neutral-800">
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
        {hasVoted ? (
          <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl inline-flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <Info className="w-5 h-5 text-green-500" />
            <p className="text-neutral-300 text-sm font-bold">
              Ya has emitido tu voto. <span className="text-green-500">¡Gracias por participar!</span>
            </p>
          </div>
        ) : (
          <p className="text-neutral-400 text-xl font-medium max-w-sm mx-auto">
            Toca en <span className="text-green-500 font-bold">Vota aquí</span> para pedir tu tema favorito
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-5 flex-grow animate-in fade-in slide-in-from-bottom-8 duration-700">
        {songs.map((song) => (
          <SongCard 
            key={song.id} 
            song={song} 
            disabled={hasVoted}
            onClick={() => !hasVoted && setSelectedSong(song)} 
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
