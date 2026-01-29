
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
      className={`group relative flex items-center p-5 rounded-[1.8rem] border theme-transition ${
        disabled 
          ? 'bg-[#151515] border-[#222] opacity-60 grayscale-[0.4]' 
          : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[#F2CB05] hover:shadow-[0_15px_40px_-10px_rgba(242,203,5,0.15)] active:scale-[0.98]'
      }`}
    >
      <div className="relative w-16 h-16 flex-shrink-0 mr-5 group-hover:scale-110 transition-transform duration-500">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover rounded-2xl shadow-lg border border-white/5"
        />
        {!disabled && (
          <div className="absolute inset-0 bg-[#F2CB05]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
            <Music className="w-6 h-6 text-[#F2CB05] animate-pulse" />
          </div>
        )}
      </div>
      
      <div className="flex-grow min-w-0 pr-4">
        <h3 className={`font-black text-lg truncate uppercase italic tracking-tighter transition-colors ${disabled ? 'text-neutral-500' : 'text-white'}`}>
          {song.title}
        </h3>
        <p className={`text-[10px] font-bold truncate uppercase tracking-[0.2em] transition-colors ${disabled ? 'text-neutral-600' : 'text-[#F2CB05]'}`}>
          {song.artist}
        </p>
      </div>

      <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex-shrink-0 font-black py-4 px-8 rounded-2xl flex items-center space-x-2 transition-all shadow-xl uppercase tracking-tighter text-sm italic ${
          disabled 
            ? 'bg-transparent text-neutral-600 border border-neutral-800' 
            : 'bg-[#F2CB05] hover:bg-[#F2B705] text-[#0D0D0D] shadow-[#F2CB05]/20'
        }`}
      >
        <span>
          {disabled ? 'REGISTRADO' : 'VOTAR'}
        </span>
        {disabled ? <Check className="w-4 h-4" /> : <Music className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SongCard;
