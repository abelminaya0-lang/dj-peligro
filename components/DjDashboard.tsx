
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import { 
  LogOut, 
  Square, 
  Save, 
  Disc, 
  Zap, 
  Monitor, 
  Trash2, 
  Users, 
  Trophy, 
  Activity, 
  Clock,
  History,
  TrendingUp
} from 'lucide-react';

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

  // Estadísticas en tiempo real
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

  const leader = stats[0]?.count > 0 ? stats[0] : null;

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

  // Obtener los últimos 5 votos para el feed "espontáneo"
  const recentVotes = useMemo(() => {
    return [...votes].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
  }, [votes]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-4 bg-black min-h-screen text-white flex flex-col gap-4 font-sans">
      {/* BARRA DE ESTADO SUPERIOR */}
      <header className="flex justify-between items-center bg-[#111] p-4 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-6">
          <img src={DJ_LOGO} className="w-16 h-16 object-contain" alt="DJ Peligro" />
          <div className="border-l border-white/10 pl-6">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
              COMMAND <span className="text-[#F2CB05]">CENTER</span>
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-[#F2CB05] uppercase tracking-widest bg-[#F2CB05]/10 px-2 py-0.5 rounded-md">
                <Activity className="w-3 h-3" /> LIVE SESSION
              </span>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">PELIGRO OS v3.0</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">DISPOSITIVOS CONECTADOS</span>
            <span className="text-xl font-black text-white italic">142</span>
          </div>
          <Link to="/results" target="_blank" className="px-6 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase italic flex items-center gap-2 hover:bg-[#F2CB05] transition-all shadow-xl active:scale-95">
            <Monitor className="w-4 h-4" /> PANTALLA PÚBLICA
          </Link>
          <button onClick={onLogout} className="p-4 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow">
        {/* COLUMNA IZQUIERDA: RESULTADOS ESPONTÁNEOS */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* MONITOR PRINCIPAL DE VOTACIÓN */}
          <section className="bg-[#111] p-6 rounded-[2rem] border border-[#F2CB05]/20 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Trophy className="w-32 h-32 text-[#F2CB05]" />
            </div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#F2CB05]" />
                <h2 className="text-sm font-black uppercase italic tracking-widest">Resultados en Vivo</h2>
              </div>
              <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                <Users className="w-4 h-4 text-[#F2CB05]" />
                <span className="font-black text-lg tabular-nums">{votes.length} <span className="text-[10px] text-white/40 ml-1">VOTOS</span></span>
              </div>
            </div>

            <div className="flex-grow space-y-5 relative z-10">
              {stats.map((s, i) => (
                <div key={s.id} className={`group p-4 rounded-2xl transition-all ${i === 0 && s.count > 0 ? 'bg-[#F2CB05]/5 border border-[#F2CB05]/20 shadow-inner' : 'bg-black/20 border border-white/5'}`}>
                  <div className="flex justify-between items-end mb-2.5">
                    <div className="flex items-center gap-4">
                      <span className={`text-2xl font-black italic ${i === 0 && s.count > 0 ? 'text-[#F2CB05]' : 'text-white/20'}`}>0{i+1}</span>
                      <span className={`text-xl font-black italic uppercase tracking-tighter truncate max-w-[200px] ${i === 0 && s.count > 0 ? 'text-white' : 'text-white/60'}`}>{s.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black italic text-[#F2CB05] leading-none">{Math.round(s.percentage)}%</span>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">{s.count} VOTOS</p>
                    </div>
                  </div>
                  <div className="h-2.5 bg-black rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(242,203,5,0.3)] ${i === 0 && s.count > 0 ? 'bg-[#F2CB05]' : 'bg-white/10'}`} 
                      style={{ width: `${s.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {stats.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <Disc className="w-16 h-16 animate-spin-slow mb-4" />
                  <p className="font-black italic uppercase tracking-widest">Esperando inicio de sesión</p>
                </div>
              )}
            </div>
          </section>

          {/* FEED DE ACTIVIDAD RECIENTE */}
          <section className="bg-[#111] p-6 rounded-[2rem] border border-white/5 flex-grow">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-4 h-4 text-white/40" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Actividad Reciente</h2>
            </div>
            <div className="space-y-3">
              {recentVotes.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-white/5 animate-in fade-in slide-in-from-left-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F2CB05]/10 flex items-center justify-center text-[#F2CB05]">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-white leading-none">{v.voterName || 'Anónimo'}</p>
                      <p className="text-[9px] font-bold text-[#F2CB05] uppercase mt-1">Votó por {
                        activeMode === 'songs' 
                          ? activeSongs.find(s => s.id === v.targetId)?.title || '...' 
                          : v.targetId
                      }</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-white/20 uppercase italic">Hace instantes</span>
                </div>
              ))}
              {recentVotes.length === 0 && (
                <p className="text-center py-10 text-[10px] font-black text-white/10 uppercase tracking-widest">Sin actividad reciente</p>
              )}
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA: CONFIGURACIÓN Y CONTROLES */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* EDITOR DE VOTACIÓN */}
          <section className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-[#F2CB05] uppercase tracking-widest mb-1">Configuración del Set</p>
                <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Preparar Votación</h3>
              </div>
              <div className="flex bg-black p-1.5 rounded-2xl gap-1">
                <button 
                  onClick={() => setEditMode('songs')} 
                  className={`px-8 py-3 rounded-xl font-black text-xs italic uppercase transition-all ${editMode === 'songs' ? 'bg-[#F2CB05] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  <Disc className="w-4 h-4 inline mr-2" /> Canciones
                </button>
                <button 
                  onClick={() => setEditMode('genres')} 
                  className={`px-8 py-3 rounded-xl font-black text-xs italic uppercase transition-all ${editMode === 'genres' ? 'bg-[#F2CB05] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  <Activity className="w-4 h-4 inline mr-2" /> Géneros
                </button>
              </div>
            </div>

            <div className="space-y-2 flex-grow min-h-[300px]">
              {editMode === 'songs' ? (
                songInputs.map((song, i) => (
                  <div key={i} className="flex gap-2 group animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="w-14 h-14 flex items-center justify-center bg-black border border-white/10 rounded-2xl text-[#F2CB05] font-black italic text-xl shadow-inner">
                      {i+1}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Nombre del track para la pista..." 
                      value={song}
                      onChange={(e) => { const n = [...songInputs]; n[i] = e.target.value; setSongInputs(n); }}
                      className="flex-grow bg-[#050505] border border-white/10 rounded-2xl px-6 font-bold text-white focus:border-[#F2CB05] focus:bg-[#0A0A0A] outline-none transition-all placeholder:text-white/10 text-lg shadow-inner"
                    />
                    {song && (
                      <button onClick={() => { const n = [...songInputs]; n[i] = ''; setSongInputs(n); }} className="w-14 h-14 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all group-hover:opacity-100">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-2 gap-4 h-full content-start animate-in zoom-in-95 duration-500">
                  {FIXED_GENRES.map((g, i) => (
                    <div key={g} className="bg-black/40 p-6 rounded-[2rem] border border-[#F2CB05]/10 flex items-center gap-5 group hover:border-[#F2CB05]/40 transition-all">
                      <div className="p-4 bg-[#F2CB05] rounded-2xl text-black shadow-lg group-hover:rotate-6 transition-transform">
                        <Disc className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none">{g}</span>
                        <p className="text-[9px] font-black text-white/20 mt-1 uppercase tracking-widest">Pre-configurado</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-white text-black py-10 rounded-[2.5rem] font-black text-3xl italic uppercase tracking-tighter hover:bg-[#F2CB05] transition-all shadow-[0_25px_60px_-10px_rgba(242,203,5,0.4)] flex items-center justify-center gap-6 active:scale-[0.98]"
            >
              <Save className="w-10 h-10" /> LANZAR VOTACIÓN AHORA
            </button>
          </section>

          {/* PANEL DE CONTROL DE TIEMPO */}
          <div className="grid grid-cols-2 gap-4">
            <section className="bg-[#111] p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black text-[#F2CB05] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Temporizador
                </p>
                {!votingEndsAt ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[3, 5, 10, 15].map(m => (
                      <button 
                        key={m}
                        onClick={() => onStartVoting(m)} 
                        className="bg-white/5 border border-white/5 text-white py-5 rounded-2xl font-black text-sm italic uppercase hover:bg-[#F2CB05] hover:text-black transition-all active:scale-95"
                      >
                        {m} MIN
                      </button>
                    ))}
                  </div>
                ) : (
                  <button onClick={onStopVoting} className="w-full bg-red-600 text-white py-8 rounded-3xl font-black text-2xl italic uppercase flex items-center justify-center gap-4 animate-pulse shadow-2xl">
                    <Square className="w-8 h-8 fill-current" /> CERRAR YA
                  </button>
                )}
              </div>
            </section>

            <section className="bg-[#111] p-8 rounded-[2rem] border border-white/5 flex flex-col justify-center gap-4">
               <button onClick={onReset} className="w-full py-6 bg-red-600/10 border border-red-600/20 rounded-3xl text-sm font-black text-red-500 uppercase italic tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95">
                 <History className="w-5 h-5 inline mr-2" /> Resetear Sesión
               </button>
               <p className="text-[9px] font-black text-center text-white/10 uppercase tracking-[0.4em] leading-relaxed">
                 Borra todos los votos acumulados y limpia el monitor principal.
               </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DjDashboard;
