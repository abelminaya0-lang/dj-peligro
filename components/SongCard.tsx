
import React from 'react';
import { Song } from '../types';
import { Check, Music } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onClick?: () => void;
  disabled?: boolean;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick, disabled }) => {
  return (
    <div 
      className={`group relative flex items-center p-4 bg-neutral-900/80 rounded-[1.5rem] border border-neutral-800 transition-all duration-500 shadow-lg backdrop-blur-sm ${
        disabled ? 'opacity-60 cursor-default' : 'hover:bg-neutral-800 hover:border-neutral-700 active:scale-[0.98]'
      }`}
    >
      <div className="relative w-16 h-16 flex-shrink-0 mr-4 group-hover:scale-105 transition-transform duration-500">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover rounded-xl shadow-2xl"
        />
        {!disabled && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
            <Music className="w-6 h-6 text-green-500 animate-bounce" />
          </div>
        )}
      </div>
      
      <div className="flex-grow min-w-0 pr-4">
        <h3 className={`font-black text-lg truncate uppercase italic tracking-tighter ${disabled ? 'text-neutral-500' : 'text-white'}`}>
          {song.title}
        </h3>
        <p className={`text-xs font-bold truncate uppercase tracking-widest ${disabled ? 'text-neutral-700' : 'text-neutral-500'}`}>
          {song.artist}
        </p>
      </div>

      <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex-shrink-0 font-black py-3 px-6 rounded-2xl flex items-center space-x-2 transition-all shadow-xl uppercase tracking-tighter text-sm italic ${
          disabled 
            ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-700 shadow-none' 
            : 'bg-green-500 hover:bg-green-400 text-black shadow-green-500/20 group-hover:px-8'
        }`}
      >
        <span>
          {disabled ? 'REGISTRADO' : 'VOTAR AHORA'}
        </span>
        {disabled ? <Check className="w-4 h-4" /> : <Music className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SongCard;
