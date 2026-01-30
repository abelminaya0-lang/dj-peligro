
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import { LogOut, RotateCcw, BarChart3, Home, Timer, Play, Square, Save, Music, Disc, Radio, Activity, Sun, Moon, Mic2, Zap, Trophy, QrCode, Share2, Download, Copy, Check, Info, Smartphone, Laptop, Globe, Monitor } from 'lucide-react';
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
  const [editSongs, setEditSongs] = useState<Song[]>(activeSongs);
  const [editGenres, setEditGenres] = useState<string[]>(activeGenres);
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

  const handleSaveSession = () => {
    if (confirm('¿Publicar cambios?')) {
      onUpdateSession(editMode, editSongs, editGenres);
    }
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
    <div className="max-w-7xl mx-auto px-2 py-2 space-y-1">
      {/* HEADER COMPACTO */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-[#1A1A1A] p-4 rounded-2xl border border-[#2A2A2A] gap-4">
        <div className="flex items-center gap-4">
          <img src={DJ_LOGO} className="w-16 h-16 object-contain" alt="DJ Peligro" />
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">CENTRAL <span className="text-[#F2CB05]">CONTROL</span></h1>
            <p className="text-neutral-500 text-[8px] font-black uppercase tracking-[0.4em]">LIVE EDITION</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/results" target="_blank" className="p-3 bg-white text-black rounded-lg font-black text-[10px] uppercase italic tracking-tighter flex items-center gap-2">
            <Monitor className="w-4 h-4" /> PANTALLA
          </Link>
          <button onClick={() => setShowQrModal(true)} className="p-3 bg-[#F2CB05] text-black rounded-lg font-black text-[10px] uppercase italic tracking-tighter flex items-center gap-2">
            <QrCode className="w-4 h-4" /> QR
          </button>
          <button onClick={onLogout} className="p-3 bg-red-600 text-white rounded-lg font-black text-[10px] uppercase italic tracking-tighter">SALIR</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-1">
        {/* CONTROL DE TIEMPO "AL ROSE" */}
        <div className="lg:col-span-3 bg-[#1A1A1A] border border-[#F2CB05]/30 p-6 rounded-2xl flex items-center justify-between gap-6 overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-[#F2CB05] uppercase tracking-widest mb-1">RELOJ DE RONDA</span>
              <div className="text-7xl font-black tabular-nums tracking-tighter italic text-white leading-none">
                {timeLeft !== null ? `${Math.floor(timeLeft/60000)}:${String(Math.floor((timeLeft%60000)/1000)).padStart(2,'0')}` : '05:00'}
              </div>
            </div>
            <div className="flex flex-col gap-1 w-48">
              {!votingEndsAt ? (
                <button onClick={() => onStartVoting(5)} className="w-full bg-[#F2CB05] text-black py-4 rounded-xl font-black text-xs uppercase italic tracking-tighter flex items-center justify-center gap-2">
                  <Play className="w-4 h-4 fill-current" /> ABRIR
                </button>
              ) : (
                <button onClick={onStopVoting} className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-xs uppercase italic tracking-tighter flex items-center justify-center gap-2">
                  <Square className="w-4 h-4 fill-current" /> CERRAR
                </button>
              )}
              <button onClick={onReset} className="w-full bg-white/5 text-neutral-400 py-3 rounded-xl font-black text-[8px] uppercase tracking-widest hover:text-white transition-colors">
                 REINICIAR VOTOS
              </button>
            </div>
        </div>

        {/* STAT RÁPIDO */}
        <div className="bg-[#151515] border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
           <Trophy className="w-8 h-8 text-[#F2CB05] mb-2" />
           <span className="text-4xl font-black italic text-white leading-none">{votes.length}</span>
           <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest mt-1">VOTOS TOTALES</span>
        </div>
      </div>

      {/* MONITOR DE RESULTADOS COMPACTO */}
      <section className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
          {stats.slice(0, 12).map((s, i) => (
            <div key={i} className="p-3 bg-[#0D0D0D] rounded-xl border border-white/5">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[8px] font-black text-neutral-600 italic">#{i+1}</span>
                <span className="text-[10px] font-black text-[#F2CB05] italic">{Math.round(s.percentage)}%</span>
              </div>
              <p className="text-[10px] font-black text-white uppercase truncate leading-none mb-2">{s.name}</p>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${i === 0 ? 'bg-[#F2CB05]' : 'bg-neutral-700'}`} style={{ width: `${s.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONFIGURACIÓN RÁPIDA */}
      <section className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-1 p-1 bg-black rounded-xl border border-white/5">
            <button onClick={() => setEditMode('songs')} className={`px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest ${editMode === 'songs' ? 'bg-[#F2CB05] text-black' : 'text-neutral-500'}`}>CANCIONES</button>
            <button onClick={() => setEditMode('genres')} className={`px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest ${editMode === 'genres' ? 'bg-[#F2CB05] text-black' : 'text-neutral-500'}`}>GÉNEROS</button>
          </div>
          <button onClick={handleSaveSession} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase italic tracking-widest hover:bg-[#F2CB05] transition-all">
             PUBLICAR CAMBIOS AHORA
          </button>
      </section>

      {/* QR MODAL COMPACTO */}
      {showQrModal && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-2">
          <div className="bg-[#1A1A1A] border-2 border-[#F2CB05] p-6 rounded-3xl flex flex-col items-center max-w-xs w-full text-center relative">
            <button onClick={() => setShowQrModal(false)} className="absolute top-2 right-2 p-2 text-neutral-500 hover:text-white transition-colors">
              <LogOut className="w-5 h-5 rotate-180" />
            </button>
            <div className="bg-white p-4 rounded-2xl mb-4">
              <QRCodeSVG value={publicUrl} size={200} level="H" includeMargin={true} />
            </div>
            <button onClick={copyToClipboard} className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-lg font-black text-[9px] uppercase tracking-widest italic">
              {copied ? 'COPIADO' : 'COPIAR ENLACE'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DjDashboard;
