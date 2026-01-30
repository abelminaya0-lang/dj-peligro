
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song, Vote, VotingMode } from '../types';
import { LogOut, RotateCcw, BarChart3, Home, Timer, Play, Square, Save, Music, Disc, Radio, Activity, Sun, Moon, Mic2, Zap, Trophy, QrCode, Share2, Download, Copy, Check, Info, Smartphone, Laptop } from 'lucide-react';
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
  
  // URL CORREGIDA: Apunta a la raíz con el hash de React Router
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
    if (confirm('¿Confirmar nueva ronda? Esto actualizará la pantalla de tu público y reiniciará los votos.')) {
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

  const winner = stats[0]?.voteCount > 0 ? stats[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 theme-transition">
      {/* QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#1A1A1A] border-4 border-[#F2CB05] p-8 md:p-12 rounded-[4rem] flex flex-col items-center max-w-lg w-full text-center relative shadow-[0_0_100px_rgba(242,203,5,0.2)]">
            <button onClick={() => setShowQrModal(false)} className="absolute top-6 right-6 p-4 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors">
              <Share2 className="w-6 h-6 rotate-180" />
            </button>
            <img src={DJ_LOGO} className="w-40 mb-8 drop-shadow-[0_0_20px_#F2CB05]" alt="DJ Peligro" />
            <h2 className="text-3xl font-black italic uppercase text-[#F2CB05] mb-2">ESCANEA Y VOTA</h2>
            <p className="text-neutral-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-10">Muestra este código en las pantallas</p>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-10">
              <QRCodeSVG value={publicUrl} size={220} level="H" />
            </div>
            <div className="flex gap-4 w-full">
               <button onClick={copyToClipboard} className="flex-grow flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-[#F2CB05] text-white py-4 rounded-2xl font-black text-xs uppercase italic tracking-widest transition-all">
                 {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                 {copied ? 'COPIADO' : 'COPIAR LINK'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header className="flex flex-col lg:flex-row justify-between items-center bg-[var(--card-bg)] p-6 md:p-8 rounded-[2.5rem] border border-[var(--border-color)] shadow-xl theme-transition gap-6">
        <div className="flex items-center gap-5">
          <img src={DJ_LOGO} className="w-28 h-28 object-contain drop-shadow-[0_5px_15px_rgba(242,203,5,0.3)]" alt="DJ Peligro" />
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-[var(--text-primary)] leading-tight uppercase">PANEL <span className="text-[#F2B705]">DJ PELIGRO</span></h1>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.4em]">Master Control • Live</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => setShowQrModal(true)} className="flex items-center gap-3 px-8 py-4 bg-[#F2CB05] text-black rounded-xl font-black text-xs hover:scale-110 transition-all shadow-lg shadow-[#F2CB05]/20 uppercase tracking-widest italic">
            <QrCode className="w-5 h-5" /> MOSTRAR QR
          </button>
          <button onClick={onLogout} className="px-6 py-4 bg-red-500 text-white rounded-xl font-black text-xs shadow-lg shadow-red-500/20 hover:opacity-90 transition-all uppercase tracking-widest italic">CERRAR</button>
        </div>
      </header>

      {/* ALERTA DE SINCRONIZACIÓN (MODO SENIOR) */}
      <section className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 animate-pulse">
        <div className="p-4 bg-blue-500 rounded-full text-white">
          <Info className="w-6 h-6" />
        </div>
        <div className="text-center md:text-left">
          <h4 className="font-black italic uppercase text-blue-400">¿Cómo sincronizar con los celulares?</h4>
          <p className="text-sm text-neutral-400 font-medium">
            Actualmente usas <strong>LocalStorage</strong> (modo local). Para que tu laptop actualice los celulares en el evento, asegúrate de estar usando una URL pública (ej. Vercel o Netlify).
          </p>
        </div>
        <div className="flex gap-2 ml-auto">
          <div className="flex flex-col items-center p-3 bg-black/40 rounded-xl">
             <Laptop className="w-4 h-4 text-blue-400 mb-1" />
             <span className="text-[8px] font-black">LAPTOP</span>
          </div>
          <div className="flex items-center text-blue-500 font-black animate-bounce px-2">→</div>
          <div className="flex flex-col items-center p-3 bg-black/40 rounded-xl">
             <Smartphone className="w-4 h-4 text-blue-400 mb-1" />
             <span className="text-[8px] font-black">CELULARES</span>
          </div>
        </div>
      </section>

      {/* PANEL DE CONTROL */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-2 border-[#F2CB05]/30 p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-32 h-32 text-[#F2CB05]" /></div>
          <div className="text-center md:text-left space-y-2 relative z-10">
            <div className="flex items-center gap-2 text-[#F2CB05] font-black text-[10px] uppercase tracking-[0.5em] mb-1">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${votingEndsAt ? 'bg-red-400' : 'bg-green-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${votingEndsAt ? 'bg-red-500' : 'bg-green-500'}`}></span>
              </span>
              {votingEndsAt ? 'Votación Activa' : 'Sistema en Espera'}
            </div>
            <div className={`text-7xl md:text-9xl font-black tabular-nums tracking-tighter italic leading-none transition-all ${votingEndsAt ? 'text-white' : 'text-neutral-700'}`}>
              {timeLeft !== null ? `${Math.floor(timeLeft/60000)}:${String(Math.floor((timeLeft%60000)/1000)).padStart(2,'0')}` : '05:00'}
            </div>
          </div>
          <div className="relative z-10 w-full md:w-auto">
            {!votingEndsAt ? (
              <button onClick={() => onStartVoting(5)} className="w-full bg-[#F2CB05] hover:bg-[#F2B705] text-[#0D0D0D] px-16 py-8 rounded-3xl font-black flex flex-col items-center gap-1 shadow-[0_20px_60px_-10px_rgba(242,203,5,0.4)] hover:scale-[1.05] active:scale-95 transition-all text-2xl italic uppercase">
                <div className="flex items-center gap-3"><Play className="w-8 h-8 fill-current" /> INICIAR</div>
                <span className="text-[10px] tracking-[0.3em] font-bold opacity-70">ABRIR VOTOS (5:00)</span>
              </button>
            ) : (
              <button onClick={onStopVoting} className="w-full bg-red-500 text-white px-16 py-8 rounded-3xl font-black flex flex-col items-center gap-1 shadow-[0_20px_60px_-10px_rgba(239,68,68,0.4)] hover:scale-[1.05] active:scale-95 transition-all text-2xl italic uppercase">
                <div className="flex items-center gap-3"><Square className="w-8 h-8 fill-current" /> DETENER</div>
                <span className="text-[10px] tracking-[0.3em] font-bold opacity-70">CERRAR VOTOS AHORA</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#151515] border border-[var(--border-color)] p-8 rounded-[3rem] shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden group">
          {winner ? (
            <>
              <div className="absolute top-0 right-0 p-3 bg-[#F2CB05] text-[#0D0D0D] rounded-bl-3xl font-black text-[10px] uppercase tracking-tighter italic">LÍDER ACTUAL</div>
              <Trophy className="w-12 h-12 text-[#F2CB05] mb-4 animate-bounce" />
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1 leading-none">{winner.name}</h3>
              <p className="text-[#F2CB05] font-black text-4xl italic">{winner.voteCount} <span className="text-[12px] uppercase opacity-60">Votos</span></p>
            </>
          ) : (
            <><Activity className="w-12 h-12 text-neutral-800 mb-4" /><h3 className="text-xl font-black italic uppercase tracking-tighter text-neutral-600">ESPERANDO DATOS...</h3></>
          )}
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 md:p-10 rounded-[3.5rem] shadow-2xl">
        <h2 className="text-2xl font-black italic flex items-center gap-4 uppercase text-[var(--text-primary)] mb-10">
          <BarChart3 className="text-[#F2CB05] w-8 h-8" /> RESULTADOS EN TIEMPO REAL
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="group relative p-6 bg-[var(--bg-primary)] rounded-[2.5rem] border border-[var(--border-color)] hover:border-[#F2CB05]/40 transition-all theme-transition">
              <div className="flex justify-between items-end mb-4 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1 italic">#0{i+1} RANK</span>
                  <span className="font-black text-xl uppercase italic text-[var(--text-primary)] leading-none truncate max-w-[180px]">{s.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-[#F2B705] italic leading-none">{Math.round(s.percentage)}%</span>
                  <p className="text-[10px] font-black text-neutral-500 uppercase">{s.voteCount} VOTOS</p>
                </div>
              </div>
              <div className="h-3 bg-neutral-900/50 rounded-full border border-white/5 relative overflow-hidden">
                <div className={`h-full transition-all duration-1000 ease-out ${i === 0 ? 'bg-[#F2CB05]' : 'bg-neutral-600 opacity-60'}`} style={{ width: `${s.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PREPARACIÓN DE SESIÓN */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 md:p-10 rounded-[3.5rem] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <h2 className="text-2xl font-black italic flex items-center gap-4 uppercase text-[var(--text-primary)]">
            <Disc className="text-[#F2CB05] w-8 h-8" /> PREPARAR PRÓXIMA RONDA
          </h2>
          <div className="flex p-1.5 bg-[var(--bg-primary)] rounded-2xl">
            <button onClick={() => setEditMode('songs')} className={`px-6 py-3 rounded-xl font-black text-xs transition-all uppercase tracking-widest ${editMode === 'songs' ? 'bg-[#F2CB05] text-[#0D0D0D]' : 'text-neutral-500'}`}>CANCIONES</button>
            <button onClick={() => setEditMode('genres')} className={`px-6 py-3 rounded-xl font-black text-xs transition-all uppercase tracking-widest ${editMode === 'genres' ? 'bg-[#F2CB05] text-[#0D0D0D]' : 'text-neutral-500'}`}>GÉNEROS</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-[#0D0D0D] p-8 rounded-[2.5rem] border border-[var(--border-color)] space-y-6">
            <h4 className="text-[#F2CB05] font-black italic uppercase tracking-widest text-sm">Publicar Actualización</h4>
            <p className="text-neutral-500 text-xs font-medium leading-relaxed">
              Al presionar el botón, la laptop envía la señal de actualización. Recuerda que los dispositivos remotos necesitan una conexión estable a internet.
            </p>
            <button onClick={handleSaveSession} className="w-full bg-white text-[#0D0D0D] font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-[#F2CB05] transition-all text-sm italic uppercase tracking-widest">
              <Save className="w-5 h-5" /> PUBLICAR AHORA
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DjDashboard;
