
import React from 'react';
import { Song } from '../types';
import { Check, Music } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onClick?: () => void;
  disabled?: boolean;
  isDarkMode?: boolean;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick, disabled, isDarkMode }) => {
  return (
    <div 
      className={`group relative flex items-center p-4 md:p-5 rounded-[2rem] border theme-transition ${
        disabled 
          ? 'bg-[#121212] border-transparent opacity-60' 
          : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[#F2CB05] hover:shadow-[0_20px_50px_-15px_rgba(242,203,5,0.2)] active:scale-[0.97]'
      }`}
    >
      <div className="relative w-14 h-14 md:w-20 md:h-20 flex-shrink-0 mr-4 md:mr-6 group-hover:scale-110 transition-transform duration-500">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover rounded-[1.2rem] shadow-xl border border-white/5"
        />
        {!disabled && (
          <div className="absolute inset-0 bg-[#F2CB05]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.2rem] flex items-center justify-center">
            <Music className="w-6 h-6 text-[#F2CB05] animate-pulse" />
          </div>
        )}
      </div>
      
      <div className="flex-grow min-w-0 pr-2">
        <h3 className={`font-black text-base md:text-xl truncate uppercase italic tracking-tighter transition-colors leading-tight ${disabled ? 'text-neutral-500' : 'text-white'}`}>
          {song.title}
        </h3>
        <p className={`text-[9px] md:text-[11px] font-black truncate uppercase tracking-[0.2em] mt-1 transition-colors ${disabled ? 'text-neutral-600' : 'text-[#F2CB05]'}`}>
          {song.artist}
        </p>
      </div>

      <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex-shrink-0 font-black py-4 px-6 md:px-10 rounded-2xl flex items-center space-x-2 transition-all shadow-2xl uppercase tracking-tighter text-xs md:text-sm italic ${
          disabled 
            ? 'bg-transparent text-neutral-600 border border-neutral-800' 
            : 'bg-[#F2CB05] hover:bg-[#F2B705] text-[#0D0D0D] shadow-[#F2CB05]/30'
        }`}
      >
        <span className="leading-none">
          {disabled ? 'REGISTRADO' : 'VOTAR'}
        </span>
        {disabled ? <Check className="w-4 h-4 shrink-0" /> : <Music className="w-4 h-4 shrink-0" />}
      </button>
    </div>
  );
};

export default SongCard;
