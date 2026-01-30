
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import { LogOut, Play, Square, Save, Disc, Zap, Monitor, Edit3, Trash2 } from 'lucide-react';

interface DjDashboardProps {
  activeMode: VotingMode;
  activeSongs: Song[];
  activeGenres: string[];
  votes: Vote[];
  onReset: () => void;
  onLogout: () => void;
  onUpdateSession: (mode: VotingMode, songs: Song[], genres: string[]) => void;
  votingEndsAt: number | null;
  onStartVoting: (minutes: number) => void;
  onStopVoting: () => void;
  // Added missing props to match App.tsx usage
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DjDashboard: React.FC<DjDashboardProps> = ({ 
  activeMode, activeSongs, activeGenres, votes, onReset, onLogout, 
  onUpdateSession, votingEndsAt, onStartVoting, onStopVoting,
  // Destructuring added props
  isDarkMode, toggleTheme
}) => {
  const [editMode, setEditMode] = useState<VotingMode>(activeMode);
  
  // 5 espacios para canciones
  const [songInputs, setSongInputs] = useState<string[]>(() => {
    const titles = activeSongs.map(s => s.title);
    while(titles.length < 5) titles.push('');
    return titles.slice(0, 5);
  });

  const FIXED_GENRES = ['Salsa', 'Rock', 'Merengue', 'Electrónica', 'Reguetón'];
  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722460/LOGO_DJ_PELIGRO_ihglvl.png";

  const handleSave = () => {
    const newSongs: Song[] = songInputs
      .filter(t => t.trim() !== '')
      .map((title, i) => ({
        id: `s-${i}-${Date.now()}`,
        title: title.trim(),
        artist: 'DJ PELIGRO',
        coverUrl: `https://picsum.photos/seed/${title}/300/300`
      }));

    if (newSongs.length === 0 && editMode === 'songs') {
      alert('Escribe al menos una canción');
      return;
    }

    onUpdateSession(editMode, newSongs, FIXED_GENRES);
    alert('¡PUBLICADO! Todos los celulares están actualizados.');
  };

  return (
    <div className="max-w-4xl mx-auto px-2 py-2 bg-[#0D0D0D] min-h-screen text-white font-sans">
      {/* HEADER COMPACTO */}
      <header className="flex justify-between items-center bg-[#1A1A1A] p-3 rounded-xl border border-white/5 mb-1">
        <div className="flex items-center gap-3">
          <img src={DJ_LOGO} className="w-12 h-12 object-contain" alt="DJ Peligro" />
          <h1 className="text-lg font-black italic tracking-tighter uppercase">PANEL <span className="text-[#F2CB05]">PELIGRO</span></h1>
        </div>
        <div className="flex gap-1">
          <Link to="/results" target="_blank" className="p-2 bg-white text-black rounded-lg font-black text-[9px] uppercase italic flex items-center gap-1">
            <Monitor className="w-3 h-3" /> PANTALLA
          </Link>
          <button onClick={onLogout} className="p-2 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase italic">SALIR</button>
        </div>
      </header>

      {/* CONFIGURACIÓN "AL ROSE" */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {/* COLUMNA IZQUIERDA: MODO Y TIEMPO */}
        <div className="md:col-span-1 space-y-1">
          <div className="bg-[#1A1A1A] p-4 rounded-xl border border-white/5">
            <p className="text-[8px] font-black text-[#F2CB05] uppercase tracking-[0.3em] mb-2">1. ELEGIR MODO</p>
            <div className="grid grid-cols-2 gap-1 bg-black p-1 rounded-lg">
              <button 
                onClick={() => setEditMode('songs')}
                className={`py-3 rounded-md font-black text-[9px] uppercase italic ${editMode === 'songs' ? 'bg-[#F2CB05] text-black' : 'text-neutral-600'}`}
              >
                CANCIONES
              </button>
              <button 
                onClick={() => setEditMode('genres')}
                className={`py-3 rounded-md font-black text-[9px] uppercase italic ${editMode === 'genres' ? 'bg-[#F2CB05] text-black' : 'text-neutral-600'}`}
              >
                GÉNEROS
              </button>
            </div>
          </div>

          <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#F2CB05]/20">
            <p className="text-[8px] font-black text-[#F2CB05] uppercase tracking-[0.3em] mb-2">2. TIEMPO DE VOTACIÓN</p>
            {!votingEndsAt ? (
              <button onClick={() => onStartVoting(5)} className="w-full bg-[#F2CB05] text-black py-4 rounded-lg font-black text-xs uppercase italic flex items-center justify-center gap-2">
                <Play className="w-4 h-4 fill-current" /> ABRIR (5 MIN)
              </button>
            ) : (
              <button onClick={onStopVoting} className="w-full bg-red-600 text-white py-4 rounded-lg font-black text-xs uppercase italic flex items-center justify-center gap-2">
                <Square className="w-4 h-4 fill-current" /> CERRAR AHORA
              </button>
            )}
            <button onClick={onReset} className="w-full mt-1 bg-white/5 text-neutral-500 py-2 rounded-lg font-black text-[8px] uppercase tracking-widest">
              LIMPIAR VOTOS
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: ENTRADA DE CANCIONES */}
        <div className="md:col-span-2 bg-[#1A1A1A] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
          <div>
            <p className="text-[8px] font-black text-[#F2CB05] uppercase tracking-[0.3em] mb-3">3. EDITAR CONTENIDO (MAX 5)</p>
            
            {editMode === 'songs' ? (
              <div className="space-y-1">
                {songInputs.map((song, i) => (
                  <div key={i} className="flex gap-1">
                    <div className="bg-black px-3 flex items-center justify-center text-[10px] font-black text-[#F2CB05] italic rounded-lg">0{i+1}</div>
                    <input 
                      type="text" 
                      placeholder="Escribe el nombre de la canción aquí..."
                      value={song}
                      onChange={(e) => {
                        const next = [...songInputs];
                        next[i] = e.target.value;
                        setSongInputs(next);
                      }}
                      className="flex-grow bg-[#0D0D0D] border border-white/5 rounded-lg px-4 py-3 text-sm font-bold text-white focus:border-[#F2CB05] outline-none"
                    />
                    {song && (
                      <button onClick={() => {
                        const next = [...songInputs];
                        next[i] = '';
                        setSongInputs(next);
                      }} className="bg-white/5 p-3 rounded-lg text-neutral-600 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {FIXED_GENRES.map(g => (
                  <div key={g} className="bg-black/50 border border-[#F2CB05]/20 p-4 rounded-xl flex items-center gap-3">
                    <Disc className="w-4 h-4 text-[#F2CB05]" />
                    <span className="font-black italic uppercase text-xs">{g}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleSave}
            className="mt-4 w-full bg-white text-black py-5 rounded-xl font-black text-sm uppercase italic tracking-[0.2em] hover:bg-[#F2CB05] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" /> GUARDAR Y PUBLICAR EN TODOS LOS CELULARES
          </button>
        </div>
      </div>

      {/* MONITOR DE VOTOS RÁPIDO */}
      <div className="mt-1 bg-[#1A1A1A] p-3 rounded-xl border border-white/5">
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-[10px] font-black uppercase italic tracking-widest text-neutral-500">MONITOR EN VIVO</span>
          <span className="text-[10px] font-black text-[#F2CB05]">{votes.length} VOTOS</span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {songInputs.filter(s => s !== '').map((s, i) => {
            const count = votes.filter(v => v.targetId.includes(i.toString())).length;
            const pct = votes.length > 0 ? (count / votes.length) * 100 : 0;
            return (
              <div key={i} className="bg-black rounded-lg p-2 border border-white/5">
                <p className="text-[8px] font-black text-white truncate uppercase mb-1">{s}</p>
                <div className="h-1 bg-white/5 rounded-full">
                  <div className="h-full bg-[#F2CB05]" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DjDashboard;
