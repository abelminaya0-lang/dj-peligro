
import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import SongCard from './SongCard';
import { Music, CheckCircle, Lock, ChevronRight, ListMusic, Info, Instagram, Heart } from 'lucide-react';

interface GuestViewProps {
  songs: Song[];
  onVote: (songId: string, name: string, whatsapp?: string) => void;
}

const GuestView: React.FC<GuestViewProps> = ({ songs, onVote }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [votedSongTitle, setVotedSongTitle] = useState('');

  useEffect(() => {
    const voted = localStorage.getItem('has_voted') === 'true';
    setHasVoted(voted);
  }, []);

  const handleDirectVote = (song: Song) => {
    if (!hasVoted) {
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
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-black">
        <div className="max-w-md w-full bg-neutral-900 rounded-[3rem] p-10 md:p-14 border border-neutral-800 shadow-2xl animate-in fade-in zoom-in duration-500 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-500/10 blur-[80px] rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full"></div>

          <div className="flex justify-center mb-10 relative">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150"></div>
            <div className="bg-green-500 p-5 rounded-full relative z-10 shadow-2xl shadow-green-500/40">
              <CheckCircle className="w-12 h-12 text-black" />
            </div>
          </div>
          
          <h1 className="text-4xl font-black mb-4 tracking-tighter text-white">¡GRACIAS POR VOTAR!</h1>
          <p className="text-neutral-400 text-lg font-medium mb-10">
            Tu voto por <span className="text-green-500 font-bold">"{votedSongTitle || 'tu canción'}"</span> ha sido registrado.
          </p>
          
          <div className="bg-black/40 rounded-[2.5rem] p-8 mb-8 border border-neutral-800/50 backdrop-blur-md">
            <div className="flex justify-center mb-4">
              <Heart className="w-8 h-8 text-red-500 fill-red-500 animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-white mb-4 leading-tight">¿QUIERES VER QUIÉN VA GANANDO?</h2>
            <p className="text-neutral-400 text-sm font-medium mb-8">
              Sigue el conteo en vivo y los resultados finales en mis historias de Instagram.
            </p>
            
            <a 
              href="https://www.instagram.com/djpeligroperu?igsh=MWQ1NmhhcjFubXFvbg=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center space-x-3 transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-purple-500/20"
            >
              <Instagram className="w-6 h-6" />
              <span className="tracking-tight text-lg">SEGUIR EN INSTAGRAM</span>
            </a>
          </div>
          
          <button 
            onClick={handleViewList}
            className="w-full bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95 mb-8"
          >
            <ListMusic className="w-5 h-5" />
            <span>Ver todas las canciones</span>
          </button>

          <div className="pt-8 border-t border-neutral-800/50">
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
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-[2.5rem] rotate-12 mb-4 shadow-2xl shadow-green-500/20 group hover:rotate-0 transition-all duration-700 cursor-pointer">
          <Music className="w-12 h-12 text-black -rotate-12 group-hover:rotate-0 transition-all duration-700" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white uppercase italic">
          DJ <span className="text-green-500">PELIGRO</span> <br/>VOTE FLOW
        </h1>
        {hasVoted ? (
          <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-[2rem] inline-flex flex-col md:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-neutral-200 text-base font-bold">
                ¡Voto registrado con éxito!
              </p>
            </div>
            <div className="h-4 w-px bg-neutral-800 hidden md:block"></div>
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
          <p className="text-neutral-400 text-xl font-medium max-w-sm mx-auto">
            Selecciona tu canción favorita y <span className="text-green-500 font-bold">vota al instante</span>.
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-4 flex-grow animate-in fade-in slide-in-from-bottom-8 duration-700">
        {songs.map((song) => (
          <SongCard 
            key={song.id} 
            song={song} 
            disabled={hasVoted}
            onClick={() => handleDirectVote(song)} 
          />
        ))}
      </div>

      <footer className="mt-24 text-center pb-12 border-t border-neutral-900 pt-16 space-y-10">
        <div className="flex flex-col items-center">
          <p className="text-neutral-700 text-[10px] font-black uppercase tracking-[0.5em] mb-6">
            DJ PELIGRO • EXCLUSIVE EVENT
          </p>
          <div className="w-16 h-1.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <a 
            href="https://www.instagram.com/djpeligroperu?igsh=MWQ1NmhhcjFubXFvbg=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-neutral-400 hover:text-white transition-all group"
          >
            <Instagram className="w-5 h-5 group-hover:text-pink-500 transition-colors" />
            <span className="font-bold text-sm tracking-widest uppercase">@djpeligroperu</span>
          </a>

          <a 
            href="#/admin" 
            className="flex items-center space-x-3 text-neutral-600 hover:text-green-500 transition-all bg-neutral-900/30 hover:bg-neutral-900 px-8 py-4 rounded-2xl border border-neutral-800/50 group"
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
