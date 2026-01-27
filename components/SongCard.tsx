
import React from 'react';
import { Song } from '../types';
import { Check } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onClick?: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  return (
    <div 
      className="group relative flex items-center p-4 bg-neutral-900 rounded-2xl border border-neutral-800 transition-all duration-300 hover:bg-neutral-800/80 hover:border-neutral-700 shadow-lg"
    >
      <div className="relative w-16 h-16 flex-shrink-0 mr-4">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover rounded-xl shadow-md"
        />
      </div>
      
      <div className="flex-grow min-w-0 pr-4">
        <h3 className="font-bold text-lg text-neutral-100 truncate">
          {song.title}
        </h3>
        <p className="text-sm text-neutral-400 truncate">
          {song.artist}
        </p>
      </div>

      <button 
        onClick={onClick}
        className="flex-shrink-0 bg-green-500 hover:bg-green-400 text-black font-bold py-2.5 px-6 rounded-xl flex items-center space-x-2 transition-all active:scale-95 shadow-lg shadow-green-500/20"
      >
        <span className="text-sm whitespace-nowrap">Vota aquí</span>
        <Check className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SongCard;
