
import React, { useMemo, useState, useEffect } from 'react';
import { Song, Vote, VotingMode } from '../types';
import { Trophy, Users, Timer, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PublicResultsProps {
  mode: VotingMode;
  songs: Song[];
  genres: string[];
  votes: Vote[];
  votingEndsAt: number | null;
}

const PublicResults: React.FC<PublicResultsProps> = ({ mode, songs, genres, votes, votingEndsAt }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
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

  const stats = useMemo(() => {
    const total = votes.length;
    const items = mode === 'songs' ? songs : genres;
    return items.map(item => {
      const id = typeof item === 'string' ? item : item.id;
      const name = typeof item === 'string' ? item : item.title;
      const count = votes.filter(v => v.targetId === id).length;
      return { name, count, percentage: total > 0 ? (count / total) * 100 : 0 };
    }).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [votes, songs, genres, mode]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-between p-2 overflow-hidden">
      <header className="w-full flex justify-between items-center p-4 bg-[#0D0D0D] border-b border-white/5">
        <div className="flex items-center gap-6">
           <img src={DJ_LOGO} className="w-32 h-32 object-contain drop-shadow-[0_0_20px_#F2CB05]" alt="DJ Peligro" />
           <div className="border-l-2 border-[#F2CB05] pl-6">
             <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">VOTACIÓN <span className="text-[#F2CB05]">ENVIVO</span></h1>
             <p className="text-sm font-black uppercase tracking-[0.5em] text-neutral-600">PELIGRO FLOW SYSTEM</p>
           </div>
        </div>

        <div className="bg-[#151515] border-2 border-[#F2CB05] rounded-2xl p-6 flex flex-col items-center min-w-[200px]">
            <span className="text-6xl font-black tabular-nums italic text-white tracking-tighter leading-none">
              {timeLeft !== null ? `${Math.floor(timeLeft/60000)}:${String(Math.floor((timeLeft%60000)/1000)).padStart(2,'0')}` : '00:00'}
            </span>
            <span className="text-[10px] font-black text-[#F2CB05] uppercase tracking-widest mt-1">TIEMPO RESTANTE</span>
        </div>
      </header>

      <main className="w-full grid grid-cols-4 gap-2 flex-grow items-stretch p-2">
        {/* Lado Izquierdo: El QR */}
        <div className="bg-[#0D0D0D] rounded-3xl border border-white/5 flex flex-col items-center justify-center p-4">
           <div className="bg-white p-4 rounded-3xl mb-6">
              <QRCodeSVG value={publicUrl} size={280} level="H" includeMargin={true} />
           </div>
           <h3 className="text-2xl font-black italic uppercase text-white text-center leading-tight">
             ESCANEA Y ELIGE <br/> <span className="text-[#F2CB05]">LA SIGUIENTE</span>
           </h3>
        </div>

        {/* Listado de Resultados al Rose */}
        <div className="col-span-3 flex flex-col gap-1 overflow-hidden">
          {stats.map((s, i) => (
            <div key={i} className={`flex-grow flex flex-col justify-center px-8 rounded-2xl bg-[#0D0D0D] border-2 transition-all duration-700 ${i === 0 ? 'border-[#F2CB05] bg-gradient-to-r from-[#F2CB05]/10 to-transparent' : 'border-white/5 opacity-80'}`}>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-6">
                  <span className={`text-5xl font-black italic ${i === 0 ? 'text-[#F2CB05]' : 'text-neutral-800'}`}>#0{i+1}</span>
                  <span className="text-5xl font-black italic uppercase text-white truncate max-w-[800px] tracking-tighter">{s.name}</span>
                </div>
                <div className="text-right">
                   <span className="text-6xl font-black text-[#F2CB05] italic leading-none">{Math.round(s.percentage)}%</span>
                </div>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${i === 0 ? 'bg-gradient-to-r from-[#F2CB05] to-[#F2B705]' : 'bg-neutral-800'}`}
                  style={{ width: `${s.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full p-4 bg-[#0D0D0D] border-t border-white/5 flex justify-between items-center text-neutral-700">
         <span className="text-xl font-black italic uppercase tracking-widest">{votes.length} FANS PARTICIPANDO</span>
         <span className="text-lg font-black italic uppercase tracking-[0.4em]">DJ PELIGRO • EL MEJOR DEL PERÚ</span>
      </footer>
    </div>
  );
};

export default PublicResults;
