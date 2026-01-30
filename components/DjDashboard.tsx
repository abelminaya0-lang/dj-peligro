
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import { LogOut, RotateCcw, BarChart3, Home, Timer, Play, Square, Save, Music, Disc, Radio, Activity, Sun, Moon, Mic2, Zap, Trophy, QrCode, Share2, Download, Copy, Check, Info, Smartphone, Laptop, Globe, Monitor, Edit3 } from 'lucide-react';
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
  onUpdateSession, votingEndsAt, onStartVoting, onStopVoting, isDarkMode, toggleTheme
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<VotingMode>(activeMode);
  
  // Estado para editar las 5 canciones directamente
  const [editableSongs, setEditableSongs] = useState<Song[]>(() => {
    // Aseguramos que siempre haya 5 espacios
    const base = [...activeSongs];
    while(base.length < 5) {
      base.push({ id: Math.random().toString(36).substr(2, 9), title: '', artist: '', coverUrl: `https://picsum.photos/seed/${Math.random()}/300/300` });
    }
    return base.slice(0, 5);
  });

  const [editableGenres, setEditableGenres] = useState<string[]>(['Salsa', 'Rock', 'Merengue', 'Electrónica', 'Reguetón']);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722460/LOGO_DJ_PELIGRO_ihglvl.png";
  const publicUrl = window.location.origin + window.location.pathname + '#/';

  useEffect(() => {
    if (!votingEndsAt) { setTimeLeft(null); return; }
    const interval = setInterval(() => {
      const diff = votingEndsAt - Date.now();
      setTimeLeft(diff <= 0 ? 0 : diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [votingEndsAt]);

  const handleUpdateSong = (index: number, field: 'title' | 'artist', value: string) => {
    const newSongs = [...editableSongs];
    newSongs[index] = { ...newSongs[index], [field]: value };
    setEditableSongs(newSongs);
  };

  const handleSaveAndPublish = () => {
    // Filtrar canciones vacías antes de publicar
    const songsToPublish = editableSongs.filter(s => s.title.trim() !== '');
    if (songsToPublish.length === 0 && editMode === 'songs') {
      alert('Debes poner al menos una canción.');
      return;
    }
    onUpdateSession(editMode, songsToPublish, editableGenres);
    alert('¡SESIÓN ACTUALIZADA! El público ya puede ver los cambios.');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = useMemo(() => {
    const total = votes.length;
    const items = activeMode === 'songs' ? activeSongs.map(s => s.title) : activeGenres;
    return items.map(name => {
      const targetId = activeMode === 'songs' ? activeSongs.find(s => s.title === name)?.id : name;
      const count = votes.filter(v => v.targetId === targetId).length;
      return { name, voteCount: count, percentage: total > 0 ? (count / total) * 100 : 0 };
    }).sort((a, b) => b.voteCount - a.voteCount);
  }, [votes, activeSongs, activeGenres, activeMode]);

  return (
    <div className="max-w-7xl mx-auto px-2 py-2 space-y-1 bg-[#0D0D0D] min-h-screen text-white">
      {/* HEADER COMPACTO "AL ROSE" */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-[#1A1A1A] p-3 rounded-2xl border border-[#2A2A2A] gap-4">
        <div className="flex items-center gap-4">
          <img src={DJ_LOGO} className="w-16 h-16 object-contain drop-shadow-[0_0_10px_#F2CB05]" alt="DJ Peligro" />
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">CENTRAL <span className="text-[#F2CB05]">PELIGRO</span></h1>
            <p className="text-neutral-500 text-[8px] font-black uppercase tracking-[0.4em]">SISTEMA DE CONTROL EN VIVO</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Link to="/results" target="_blank" className="p-3 bg-white text-black rounded-lg font-black text-[10px] uppercase italic tracking-tighter flex items-center gap-2 hover:scale-105 transition-all">
            <Monitor className="w-4 h-4" /> PANTALLA GIGANTE
          </Link>
          <button onClick={() => setShowQrModal(true)} className="p-3 bg-[#F2CB05] text-black rounded-lg font-black text-[10px] uppercase italic tracking-tighter flex items-center gap-2 hover:scale-105 transition-all">
            <QrCode className="w-4 h-4" /> MOSTRAR QR
          </button>
          <button onClick={onLogout} className="p-3 bg-red-600 text-white rounded-lg font-black text-[10px] uppercase italic tracking-tighter">SALIR</button>
        </div>
      </header>

      {/* CONFIGURADOR DE SESIÓN (LO QUE PIDIÓ EL USUARIO) */}
      <section className="bg-[#1A1A1A] border-2 border-[#F2CB05]/20 p-4 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <Edit3 className="text-[#F2CB05] w-6 h-6" /> CONFIGURAR SESIÓN ACTUAL
          </h2>
          <div className="flex gap-1 p-1 bg-black rounded-xl">
            <button 
              onClick={() => setEditMode('songs')} 
              className={`px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${editMode === 'songs' ? 'bg-[#F2CB05] text-black' : 'text-neutral-600 hover:text-white'}`}
            >
              MODO CANCIONES
            </button>
            <button 
              onClick={() => setEditMode('genres')} 
              className={`px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${editMode === 'genres' ? 'bg-[#F2CB05] text-black' : 'text-neutral-600 hover:text-white'}`}
            >
              MODO GÉNEROS
            </button>
          </div>
        </div>

        {editMode === 'songs' ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {editableSongs.map((song, index) => (
              <div key={index} className="bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col gap-2">
                <span className="text-[9px] font-black text-[#F2CB05] italic uppercase tracking-widest">CANCIÓN #{index + 1}</span>
                <input 
                  type="text" 
                  placeholder="Título..."
                  value={song.title}
                  onChange={(e) => handleUpdateSong(index, 'title', e.target.value)}
                  className="bg-[#0D0D0D] border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white focus:border-[#F2CB05] outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Artista..."
                  value={song.artist}
                  onChange={(e) => handleUpdateSong(index, 'artist', e.target.value)}
                  className="bg-[#0D0D0D] border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold text-neutral-400 focus:border-[#F2CB05] outline-none"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {editableGenres.map((genre, index) => (
              <div key={index} className="bg-black/40 border border-[#F2CB05]/20 px-6 py-3 rounded-xl flex items-center gap-3">
                 <Disc className="w-4 h-4 text-[#F2CB05]" />
                 <span className="font-black italic uppercase text-sm">{genre}</span>
              </div>
            ))}
            <div className="px-4 py-2 text-[10px] text-neutral-500 font-bold uppercase italic flex items-center">Los 5 géneros base están activos</div>
          </div>
        )}

        <button 
          onClick={handleSaveAndPublish}
          className="w-full bg-white text-black py-4 rounded-xl font-black text-sm uppercase italic tracking-[0.2em] hover:bg-[#F2CB05] transition-all shadow-xl shadow-white/5 active:scale-[0.99] flex items-center justify-center gap-3"
        >
          <Save className="w-5 h-5" /> GUARDAR Y PUBLICAR AHORA
        </button>
      </section>

      {/* CONTROL DE VOTOS Y MONITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-1">
        <div className="lg:col-span-3 bg-[#1A1A1A] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-[#F2CB05] uppercase tracking-widest mb-1">TIEMPO DE RONDA</span>
              <div className="text-6xl font-black tabular-nums tracking-tighter italic text-white leading-none">
                {timeLeft !== null ? `${Math.floor(timeLeft/60000)}:${String(Math.floor((timeLeft%60000)/1000)).padStart(2,'0')}` : '05:00'}
              </div>
            </div>
            <div className="flex gap-1">
              {!votingEndsAt ? (
                <button onClick={() => onStartVoting(5)} className="bg-[#F2CB05] text-black px-10 py-4 rounded-xl font-black text-xs uppercase italic tracking-tighter flex items-center gap-2 hover:scale-105 transition-all">
                  <Play className="w-4 h-4 fill-current" /> ABRIR VOTACIÓN
                </button>
              ) : (
                <button onClick={onStopVoting} className="bg-red-600 text-white px-10 py-4 rounded-xl font-black text-xs uppercase italic tracking-tighter flex items-center gap-2 hover:scale-105 transition-all">
                  <Square className="w-4 h-4 fill-current" /> CERRAR
                </button>
              )}
              <button onClick={() => { if(confirm('¿Reiniciar conteo?')) onReset(); }} className="bg-white/5 text-neutral-500 p-4 rounded-xl hover:text-white transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
        </div>

        <div className="bg-[#151515] border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
           <Trophy className="w-6 h-6 text-[#F2CB05] mb-1" />
           <span className="text-4xl font-black italic text-white leading-none">{votes.length}</span>
           <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">VOTOS TOTALES</span>
        </div>
      </div>

      {/* MONITOR DE RESULTADOS MINIATURA */}
      <section className="bg-[#1A1A1A] border border-[#2A2A2A] p-2 rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
          {stats.slice(0, 5).map((s, i) => (
            <div key={i} className={`p-2 rounded-xl border transition-all ${i === 0 ? 'bg-[#F2CB05]/10 border-[#F2CB05]/40' : 'bg-black/40 border-white/5'}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="text-[7px] font-black text-neutral-600 italic">#{i+1}</span>
                <span className="text-[9px] font-black text-[#F2CB05] italic">{Math.round(s.percentage)}%</span>
              </div>
              <p className="text-[9px] font-black text-white uppercase truncate leading-none mb-1">{s.name || '---'}</p>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${i === 0 ? 'bg-[#F2CB05]' : 'bg-neutral-700'}`} style={{ width: `${s.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border-2 border-[#F2CB05] p-6 rounded-[3rem] flex flex-col items-center max-w-xs w-full text-center relative shadow-[0_0_80px_rgba(242,203,5,0.2)]">
            <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white transition-colors">
              <LogOut className="w-5 h-5 rotate-180" />
            </button>
            <img src={DJ_LOGO} className="w-32 mb-4" alt="DJ Peligro" />
            <div className="bg-white p-4 rounded-2xl mb-6">
              <QRCodeSVG value={publicUrl} size={220} level="H" includeMargin={true} />
            </div>
            <button onClick={copyToClipboard} className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest italic">
              {copied ? <span className="text-green-500">¡COPIADO!</span> : 'COPIAR ENLACE'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DjDashboard;
