
import React from 'react';
import { Song } from '../types';
import { Heart, Music } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onClick?: () => void;
  disabled?: boolean;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick, disabled }) => {
  return (
    <div 
      className={`group relative flex items-center p-2 rounded-xl border transition-all ${
        disabled 
          ? 'bg-[#121212] border-transparent opacity-60' 
          : 'bg-[#1A1A1A] border-white/5 hover:border-[#F2CB05] active:scale-[0.98] shadow-lg'
      }`}
    >
      <div className="relative w-14 h-14 flex-shrink-0 mr-4">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover rounded-lg shadow-xl"
        />
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
      </div>
      
      <div className="flex-grow min-w-0 pr-2">
        <h3 className={`font-black text-lg md:text-xl truncate uppercase italic tracking-tighter leading-none ${disabled ? 'text-neutral-600' : 'text-white'}`}>
          {song.title}
        </h3>
        <p className="text-[9px] font-black text-[#F2CB05] uppercase tracking-widest mt-1 opacity-60">
          DJ PELIGRO SELECCIÓN
        </p>
      </div>

      <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex-shrink-0 font-black py-4 px-8 rounded-lg flex items-center space-x-2 transition-all uppercase tracking-tighter text-xs italic ${
          disabled 
            ? 'bg-transparent text-neutral-700 border border-neutral-800' 
            : 'bg-[#F2CB05] text-[#0D0D0D] shadow-lg'
        }`}
      >
        <span>{disabled ? 'LISTO' : 'VOTAR'}</span>
        {disabled ? <Heart className="w-4 h-4 fill-current text-red-500" /> : <Music className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SongCard;
