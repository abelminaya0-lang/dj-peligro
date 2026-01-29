
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
      className={`group relative flex items-center p-3.5 md:p-5 rounded-[1.8rem] md:rounded-[2rem] border theme-transition ${
        disabled 
          ? 'bg-[#121212] border-transparent opacity-60' 
          : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[#F2CB05] active:scale-[0.97]'
      }`}
    >
      <div className="relative w-12 h-12 md:w-20 md:h-20 flex-shrink-0 mr-3.5 md:mr-6">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover rounded-xl md:rounded-[1.2rem] shadow-lg"
        />
      </div>
      
      <div className="flex-grow min-w-0 pr-1">
        <h3 className={`font-black text-sm md:text-xl truncate uppercase italic tracking-tighter leading-none ${disabled ? 'text-neutral-500' : 'text-white'}`}>
          {song.title}
        </h3>
        <p className={`text-[8px] md:text-[11px] font-black truncate uppercase tracking-[0.2em] mt-1 ${disabled ? 'text-neutral-600' : 'text-[#F2CB05]'}`}>
          {song.artist}
        </p>
      </div>

      <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex-shrink-0 font-black py-3.5 px-5 md:py-5 md:px-10 rounded-xl md:rounded-2xl flex items-center space-x-2 transition-all uppercase tracking-tighter text-[10px] md:text-sm italic ${
          disabled 
            ? 'bg-transparent text-neutral-500 border border-neutral-800' 
            : 'bg-[#F2CB05] text-[#0D0D0D] shadow-xl shadow-[#F2CB05]/20'
        }`}
      >
        <span>
          {disabled ? 'REGISTRADO' : 'VOTAR'}
        </span>
        {disabled ? <Heart className="w-3 h-3 md:w-4 md:h-4 fill-current" /> : <Music className="w-3 h-3 md:w-4 md:h-4" />}
      </button>
    </div>
  );
};

export default SongCard;
