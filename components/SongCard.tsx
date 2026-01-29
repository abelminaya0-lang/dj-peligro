
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
      className={`group relative flex items-center p-4 md:p-6 rounded-[2rem] border theme-transition ${
        disabled 
          ? 'bg-[#121212] border-transparent opacity-60 grayscale' 
          : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[#F2CB05] active:scale-[0.97] shadow-xl hover:shadow-[#F2CB05]/10'
      }`}
    >
      <div className="relative w-14 h-14 md:w-24 md:h-24 flex-shrink-0 mr-4 md:mr-8 group-hover:scale-105 transition-transform duration-500">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover rounded-2xl md:rounded-[1.5rem] shadow-2xl border border-white/5"
        />
      </div>
      
      <div className="flex-grow min-w-0 pr-2">
        <h3 className={`font-black text-base md:text-2xl truncate uppercase italic tracking-tighter leading-none transition-colors ${disabled ? 'text-neutral-500' : 'text-white'}`}>
          {song.title}
        </h3>
        <p className={`text-[10px] md:text-xs font-black truncate uppercase tracking-[0.2em] mt-1.5 transition-colors ${disabled ? 'text-neutral-600' : 'text-[#F2CB05]'}`}>
          {song.artist}
        </p>
      </div>

      <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex-shrink-0 font-black py-4 px-6 md:py-6 md:px-12 rounded-xl md:rounded-[1.5rem] flex items-center space-x-3 transition-all uppercase tracking-tighter text-xs md:text-base italic ${
          disabled 
            ? 'bg-transparent text-neutral-600 border border-neutral-800' 
            : 'bg-[#F2CB05] text-[#0D0D0D] shadow-[0_10px_30px_rgba(242,203,5,0.3)] hover:bg-[#F2B705]'
        }`}
      >
        <span className="leading-none">
          {disabled ? 'REGISTRADO' : 'VOTAR'}
        </span>
        {disabled ? (
          <Heart className="w-4 h-4 md:w-6 md:h-6 fill-current text-red-500" />
        ) : (
          <Music className="w-4 h-4 md:w-6 md:h-6" />
        )}
      </button>
    </div>
  );
};

export default SongCard;
