
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import { 
  LogOut, 
  Square, 
  Activity, 
  Monitor, 
  Clock,
  History,
  QrCode,
  Play
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
  const [customMinutes, setCustomMinutes] = useState<string>('3');
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');
  const [itemInputs, setItemInputs] = useState<string[]>(() => {
    const existing = editMode === 'songs' ? activeSongs.map(s => s.title) : activeGenres;
    const initial = [...existing];
    while(initial.length < 5) initial.push('');
    return initial;
  });

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722460/LOGO_DJ_PELIGRO_ihglvl.png";
  const publicUrl = window.location.origin + window.location.pathname + '#/';

  // Actualizar el string del tiempo restante para el DJ
  useEffect(() => {
    if (!votingEndsAt) {
      setTimeLeftStr('');
      return;
    }
    const interval = setInterval(() => {
      const diff = votingEndsAt - Date.now();
      if (diff <= 0) {
        setTimeLeftStr('TERMINADO');
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeftStr(`${m}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [votingEndsAt]);

  const stats = useMemo(() => {
    const items = activeMode === 'songs' ? activeSongs : activeGenres;
    const total = votes.length;
    
    return items.map(item => {
      const id = typeof item === 'string' ? item : item.id;
      const name = typeof item === 'string' ? item : item.title;
      const count = votes.filter(v => v.targetId === id).length;
      return { id, name, count, percentage: total > 0 ? (count / total) * 100 : 0 };
    }).sort((a, b) => b.count - a.count);
  }, [votes, activeSongs, activeGenres, activeMode]);

  const handleSave = () => {
    const filtered = itemInputs.filter(t => t.trim() !== '');
    if (editMode === 'songs') {
      const songs = filtered.map(t => ({ id: '', title: t, artist: '', coverUrl: '' }));
      onUpdateSession('songs', songs, []);
    } else {
      onUpdateSession('genres', [], filtered);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-4 bg-black min-h-screen text-white flex flex-col gap-4 font-sans">
      <header className="flex justify-between items-center bg-[#111] p-4 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-6">
          <img src={DJ_LOGO} className="w-16 h-16 object-contain" alt="DJ Peligro" />
          <div className="border-l border-white/10 pl-6">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
              COMMAND <span className="text-[#F2CB05]">CENTER</span>
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-[#F2CB05] uppercase tracking-widest bg-[#F2CB05]/10 px-2 py-0.5 rounded-md">
                <Activity className="w-3 h-3" /> SUPABASE SYNC
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/results" target="_blank" className="px-6 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase italic flex items-center gap-2 hover:bg-[#F2CB05] transition-all">
            <Monitor className="w-4 h-4" /> PANTALLA PÚBLICA
          </Link>
          <button onClick={onLogout} className="p-4 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow">
        <div className="lg:col-span-4 flex flex-col gap-4">
          <section className="bg-[#111] p-6 rounded-[2rem] border border-[#F2CB05]/30 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest">Acceso Votantes</h2>
              <QrCode className="w-4 h-4 text-[#F2CB05]" />
            </div>
            <div className="bg-white p-3 rounded-2xl mb-4">
              <QRCodeSVG value={publicUrl} size={180} level="H" />
            </div>
            <p className="text-[9px] font-black text-[#F2CB05] uppercase tracking-[0.4em]">{publicUrl}</p>
          </section>

          <section className="bg-[#111] p-6 rounded-[2rem] border border-white/5 flex-grow overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest">Monitor Real-time</h2>
              <span className="text-[10px] font-black text-white/20">{votes.length} Votos</span>
            </div>
            <div className="space-y-4">
              {stats.map((s, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-black uppercase italic">
                    <span className={i === 0 ? 'text-[#F2CB05]' : 'text-white/40'}>{s.name}</span>
                    <span className="text-[#F2CB05]">{s.count}</span>
                  </div>
                  <div className="h-1.5 bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-[#F2CB05]" style={{ width: `${s.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4">
          <section className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-6 flex-grow">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black italic text-white uppercase italic">Configurar Próxima Votación</h3>
              <div className="flex bg-black p-1 rounded-xl">
                <button onClick={() => setEditMode('songs')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase ${editMode === 'songs' ? 'bg-[#F2CB05] text-black' : 'text-white/40'}`}>Tracks</button>
                <button onClick={() => setEditMode('genres')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase ${editMode === 'genres' ? 'bg-[#F2CB05] text-black' : 'text-white/40'}`}>Géneros</button>
              </div>
            </div>

            <div className="space-y-2">
              {itemInputs.map((val, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-black rounded-xl text-[#F2CB05] font-black italic">{i+1}</div>
                  <input 
                    type="text" 
                    value={val}
                    onChange={(e) => { const n = [...itemInputs]; n[i] = e.target.value; setItemInputs(n); }}
                    placeholder={editMode === 'songs' ? "Nombre de la canción..." : "Nombre del género..."}
                    className="flex-grow bg-black border border-white/5 rounded-xl px-4 font-bold text-white focus:border-[#F2CB05] outline-none"
                  />
                </div>
              ))}
            </div>

            <button onClick={handleSave} className="w-full bg-[#F2CB05] text-black py-6 rounded-2xl font-black text-xl italic uppercase tracking-tighter hover:bg-[#F2B705] transition-all">
              Sincronizar con Supabase y Publicar
            </button>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <section className="bg-[#111] p-6 rounded-[2rem] border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black text-[#F2CB05] uppercase tracking-widest">Cronómetro de Votación</p>
                {votingEndsAt && (
                  <span className="text-[10px] font-black text-red-500 animate-pulse">
                    TIME: {timeLeftStr}
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => onStartVoting(3)} className="bg-white/5 text-white py-4 rounded-xl font-black text-xs uppercase hover:bg-[#F2CB05] hover:text-black transition-all">3 MINUTOS</button>
                  <button onClick={() => onStartVoting(5)} className="bg-white/5 text-white py-4 rounded-xl font-black text-xs uppercase hover:bg-[#F2CB05] hover:text-black transition-all">5 MINUTOS</button>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative w-24">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                    <input 
                      type="number" 
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      placeholder="Min"
                      className="w-full bg-black border border-white/5 rounded-xl pl-8 pr-2 py-4 font-bold text-white outline-none focus:border-[#F2CB05] text-xs"
                    />
                  </div>
                  
                  <button 
                    onClick={() => onStartVoting(Number(customMinutes))}
                    className="flex-grow bg-[#F2CB05] text-black rounded-xl font-black text-xs uppercase italic flex items-center justify-center gap-2 hover:bg-[#F2B705] transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" /> INICIAR
                  </button>
                  
                  <button 
                    onClick={onStopVoting}
                    disabled={!votingEndsAt}
                    className={`px-6 rounded-xl font-black text-xs uppercase italic flex items-center justify-center gap-2 transition-all ${
                      votingEndsAt 
                        ? 'bg-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                        : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    <Square className="w-3 h-3 fill-current" /> STOP
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-[#111] p-6 rounded-[2rem] border border-white/5 flex flex-col justify-center gap-4">
               <button onClick={onReset} className="w-full py-6 bg-white/5 rounded-xl text-xs font-black text-white/30 uppercase tracking-widest hover:text-red-500 transition-colors border border-dashed border-white/10">
                 <History className="w-4 h-4 inline mr-2" /> REINICIAR CONTADORES
               </button>
               <div className="p-4 bg-black/50 rounded-xl border border-white/5 text-center">
                  <p className="text-[9px] font-black uppercase text-neutral-600 mb-1">Status del Sistema</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-white italic">DJ PELIGRO ONLINE</span>
                  </div>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DjDashboard;
