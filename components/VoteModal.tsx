
import React, { useState } from 'react';
import { Song } from '../types';
import { X, Send, User } from 'lucide-react';

interface VoteModalProps {
  song: Song;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const VoteModal: React.FC<VoteModalProps> = ({ song, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(242,203,5,0.15)] animate-in zoom-in-95 duration-300">
        <div className="relative p-6 flex items-center justify-between border-b border-white/5">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Confirma tu elección</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-neutral-400" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center space-x-4 mb-10 bg-black/40 p-5 rounded-2xl border border-white/5">
            <img src={song.coverUrl} className="w-20 h-20 rounded-xl object-cover shadow-2xl" alt={song.title} />
            <div>
              <p className="text-[#F2CB05] text-[10px] font-black uppercase tracking-widest mb-1">Elegiste:</p>
              <h3 className="font-black text-2xl uppercase italic tracking-tighter text-white leading-none">{song.title}</h3>
              <p className="text-neutral-500 text-xs font-bold uppercase mt-1">DJ PELIGRO EDIT</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-2">
                Ingresa tu nombre para votar
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  id="name"
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre aquí..."
                  className="w-full bg-black border border-white/10 rounded-2xl pl-12 pr-6 py-5 focus:outline-none focus:border-[#F2CB05] transition-all placeholder:text-neutral-700 font-bold text-white text-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={name.trim().length < 2}
              className="w-full bg-[#F2CB05] hover:bg-[#F2B705] disabled:opacity-30 disabled:grayscale text-black font-black py-6 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-[0.98] shadow-2xl shadow-[#F2CB05]/20"
            >
              <span className="text-sm uppercase tracking-[0.15em] italic">ENVIAR VOTO AHORA</span>
              <Send className="w-5 h-5" />
            </button>
          </form>
          
          <p className="text-center text-[8px] text-neutral-600 mt-6 font-black uppercase tracking-[0.5em]">
            PELIGRO FLOW SYSTEM • 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoteModal;
