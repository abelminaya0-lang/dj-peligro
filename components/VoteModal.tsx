
import React, { useState } from 'react';
import { Song } from '../types';
import { X, Send } from 'lucide-react';

interface VoteModalProps {
  song: Song;
  onClose: () => void;
  onSubmit: (name: string, whatsapp?: string) => void;
}

const VoteModal: React.FC<VoteModalProps> = ({ song, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enviamos el voto incluso si los campos están vacíos
    onSubmit(name.trim() || 'Anónimo', whatsapp.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative p-6 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Confirma tu voto</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-6 h-6 text-neutral-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-8 bg-neutral-950/50 p-4 rounded-2xl border border-neutral-800">
            <img src={song.coverUrl} className="w-16 h-16 rounded-lg object-cover" alt={song.title} />
            <div>
              <p className="text-neutral-400 text-sm">Votando por:</p>
              <h3 className="font-bold text-lg">{song.title}</h3>
              <p className="text-neutral-500 text-sm">{song.artist}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">
                Tu Nombre (Opcional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-neutral-600 font-medium"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">
                WhatsApp (Opcional)
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+34 123 456 789"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-neutral-600 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-green-500/20"
            >
              <span>{name.trim() ? 'Enviar Voto' : 'Votar de forma anónima'}</span>
              <Send className="w-5 h-5" />
            </button>
          </form>
          
          <p className="text-center text-[10px] text-neutral-600 mt-4 font-bold uppercase tracking-widest">
            Puedes votar sin completar tus datos
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoteModal;
