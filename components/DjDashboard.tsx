
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import { LogOut, Play, Square, Save, Disc, Zap, Monitor, Trash2, Users, Trophy } from 'lucide-react';

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
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DjDashboard: React.FC<DjDashboardProps> = ({ 
  activeMode, activeSongs, activeGenres, votes, onReset, onLogout, 
  onUpdateSession, votingEndsAt, onStartVoting, onStopVoting 
}) => {
  const [editMode, setEditMode] = useState<VotingMode>(activeMode);
  const [songInputs, setSongInputs] = useState<string[]>(() => {
    const titles = activeSongs.map(s => s.title);
    while(titles.length < 5) titles.push('');
    return titles.slice(0, 5);
  });

  const FIXED_GENRES = ['Reguetón', 'Salsa', 'Rock', 'Merengue', 'Electrónica'];
  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722460/LOGO_DJ_PELIGRO_ihglvl.png";

  const leader = useMemo(() => {
    if (votes.length === 0) return null;
    const items = activeMode === 'songs' ? activeSongs.map(s => s.id) : activeGenres;
    const counts = items.map(id => ({ id, count: votes.filter(v => v.targetId === id).length }));
    const sorted = counts.sort((a, b) => b.count - a.count);
    const winId = sorted[0].id;
    if (activeMode === 'songs') return activeSongs.find(s => s.id === winId)?.title || '...';
    return winId;
  }, [votes, activeSongs, activeGenres, activeMode]);

  const handleSave = () => {
    const newSongs: Song[] = songInputs
      .filter(t => t.trim() !== '')
      .map((title, i) => ({
        id: `s-${i}-${Date.now()}`,
        title: title.trim(),
        artist: 'DJ PELIGRO',
        coverUrl: `https://picsum.photos/seed/${title}/300/300`
      }));
    onUpdateSession(editMode, newSongs, FIXED_GENRES);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 py-4 bg-black min-h-screen text-white flex flex-col gap-4">
      {/* BARRA SUPERIOR PRO */}
      <header className="flex justify-between items-center bg-[#111] p-4 rounded-2xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
          <img src={DJ_LOGO} className="w-16 h-16 object-contain" alt="DJ Peligro" />
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">VOTE SYSTEM <span className="text-[#F2CB05]">PRO</span></h1>
            <p className="text-[9px] font-black text-white/30 tracking-[0.3em] mt-1">OPERACIÓN EN VIVO</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/results" target="_blank" className="px-6 py-3 bg-white text-black rounded-xl font-black text-xs uppercase italic flex items-center gap-2 hover:bg-[#F2CB05] transition-colors shadow-lg">
            <Monitor className="w-4 h-4" /> PANTALLA PÚBLICA
          </Link>
          <button onClick={onLogout} className="px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl font-black text-xs uppercase italic hover:bg-red-600 hover:text-white transition-all">SALIR</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* MONITOR DE ESTADÍSTICAS (IZQUIERDA) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#111] p-6 rounded-3xl border border-[#F2CB05]/20 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-[#F2CB05] text-black px-3 py-1 rounded-lg font-black text-[10px] italic uppercase">En Vivo</span>
              <div className="flex items-center gap-2 text-white/40">
                <Users className="w-4 h-4" />
                <span className="font-black text-sm">{votes.length} Votos</span>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Líder Actual</p>
              <h2 className="text-4xl font-black italic text-[#F2CB05] uppercase tracking-tighter truncate leading-none">
                {leader || "SIN VOTOS"}
              </h2>
            </div>

            <div className="space-y-4">
              { (activeMode === 'songs' ? activeSongs : activeGenres).map((item, i) => {
                const id = typeof item === 'string' ? item : item.id;
                const name = typeof item === 'string' ? item : item.title;
                const count = votes.filter(v => v.targetId === id).length;
                const pct = votes.length > 0 ? (count / votes.length) * 100 : 0;
                return (
                  <div key={id} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-black uppercase italic">
                      <span className="text-white/80">{name}</span>
                      <span className="text-[#F2CB05]">{count}</span>
                    </div>
                    <div className="h-2 bg-black rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-[#F2CB05] shadow-[0_0_10px_#F2CB05]" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] font-black text-[#F2CB05] uppercase tracking-widest mb-4">Control de Tiempo</p>
            {!votingEndsAt ? (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => onStartVoting(3)} className="bg-white text-black py-4 rounded-2xl font-black text-xs italic uppercase hover:bg-[#F2CB05] transition-all">3 MIN</button>
                <button onClick={() => onStartVoting(5)} className="bg-white text-black py-4 rounded-2xl font-black text-xs italic uppercase hover:bg-[#F2CB05] transition-all">5 MIN</button>
              </div>
            ) : (
              <button onClick={onStopVoting} className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-xl italic uppercase flex items-center justify-center gap-3 animate-pulse shadow-2xl">
                <Square className="w-6 h-6 fill-current" /> CERRAR VOTOS
              </button>
            )}
            <button onClick={onReset} className="w-full mt-4 py-3 bg-white/5 rounded-xl text-[10px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-red-500 transition-colors">Resetear sesión</button>
          </div>
        </div>

        {/* EDITOR DE CONTENIDO (DERECHA) */}
        <div className="lg:col-span-8 bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-[#F2CB05] uppercase tracking-widest mb-1">Editor de Turno</p>
              <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Preparar Siguiente Votación</h3>
            </div>
            <div className="flex bg-black p-1.5 rounded-2xl gap-1">
              <button onClick={() => setEditMode('songs')} className={`px-6 py-2.5 rounded-xl font-black text-xs italic uppercase transition-all ${editMode === 'songs' ? 'bg-[#F2CB05] text-black shadow-lg' : 'text-white/40'}`}>Canciones</button>
              <button onClick={() => setEditMode('genres')} className={`px-6 py-2.5 rounded-xl font-black text-xs italic uppercase transition-all ${editMode === 'genres' ? 'bg-[#F2CB05] text-black shadow-lg' : 'text-white/40'}`}>Géneros</button>
            </div>
          </div>

          <div className="flex-grow space-y-2">
            {editMode === 'songs' ? (
              songInputs.map((song, i) => (
                <div key={i} className="flex gap-2 group">
                  <div className="w-12 h-14 flex items-center justify-center bg-black border border-white/10 rounded-2xl text-[#F2CB05] font-black italic">{i+1}</div>
                  <input 
                    type="text" 
                    placeholder="Escribe el nombre del track..." 
                    value={song}
                    onChange={(e) => { const n = [...songInputs]; n[i] = e.target.value; setSongInputs(n); }}
                    className="flex-grow bg-[#050505] border border-white/10 rounded-2xl px-6 font-bold text-white focus:border-[#F2CB05] outline-none transition-all placeholder:text-white/10"
                  />
                  {song && (
                    <button onClick={() => { const n = [...songInputs]; n[i] = ''; setSongInputs(n); }} className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="grid grid-cols-2 gap-4 h-full content-start">
                {FIXED_GENRES.map(g => (
                  <div key={g} className="bg-black/40 p-6 rounded-3xl border border-[#F2CB05]/10 flex items-center gap-4">
                    <div className="p-3 bg-[#F2CB05] rounded-xl text-black"><Disc className="w-6 h-6" /></div>
                    <span className="text-xl font-black italic uppercase text-white">{g}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-white text-black py-8 rounded-3xl font-black text-2xl italic uppercase tracking-tighter hover:bg-[#F2CB05] transition-all shadow-[0_20px_40px_rgba(242,203,5,0.2)] flex items-center justify-center gap-4"
          >
            <Save className="w-8 h-8" /> PUBLICAR AHORA EN TODOS LOS MÓVILES
          </button>
        </div>
      </div>
    </div>
  );
};

export default DjDashboard;
