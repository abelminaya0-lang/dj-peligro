
import React from 'react';
import { Song } from '../types';
import { Heart, Music } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onClick?: () => void;
  disabled?: boolean;
  isDarkMode?: boolean;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick, disabled, isDarkMode }) => {
  return (
    <div 
      className={`group relative flex items-center p-2.5 md:p-4 rounded-2xl border theme-transition ${
        disabled 
          ? 'bg-[#121212] border-transparent opacity-60 grayscale' 
          : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[#F2CB05] active:scale-[0.99] shadow-md hover:shadow-[#F2CB05]/5'
      }`}
    >
      <div className="relative w-12 h-12 md:w-20 md:h-20 flex-shrink-0 mr-3 md:mr-6 group-hover:scale-105 transition-transform duration-500">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover rounded-xl md:rounded-2xl shadow-xl border border-white/5"
        />
      </div>
      
      <div className="flex-grow min-w-0 pr-1">
        <h3 className={`font-black text-sm md:text-xl truncate uppercase italic tracking-tighter leading-none transition-colors ${disabled ? 'text-neutral-500' : 'text-white'}`}>
          {song.title}
        </h3>
        <p className={`text-[9px] md:text-[11px] font-black truncate uppercase tracking-[0.1em] mt-1 transition-colors ${disabled ? 'text-neutral-600' : 'text-[#F2CB05]'}`}>
          {song.artist}
        </p>
      </div>

      <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex-shrink-0 font-black py-3 px-6 md:py-4 md:px-10 rounded-xl flex items-center space-x-2 transition-all uppercase tracking-tighter text-[10px] md:text-sm italic ${
          disabled 
            ? 'bg-transparent text-neutral-600 border border-neutral-800' 
            : 'bg-[#F2CB05] text-[#0D0D0D] shadow-lg hover:bg-[#F2B705]'
        }`}
      >
        <span className="leading-none">
          {disabled ? 'LISTO' : 'VOTAR'}
        </span>
        {disabled ? (
          <Heart className="w-3 h-3 md:w-5 md:h-5 fill-current text-red-500" />
        ) : (
          <Music className="w-3 h-3 md:w-5 md:h-5" />
        )}
      </button>
    </div>
  );
};

export default SongCard;
