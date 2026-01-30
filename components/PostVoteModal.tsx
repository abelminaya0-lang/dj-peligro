
import React from 'react';
import { Instagram, ExternalLink, Trophy, Clock } from 'lucide-react';

interface PostVoteModalProps {
  isVisible: boolean;
  cooldownMs?: number;
}

const PostVoteModal: React.FC<PostVoteModalProps> = ({ isVisible, cooldownMs = 0 }) => {
  if (!isVisible) return null;

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722460/LOGO_DJ_PELIGRO_ihglvl.png";

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#000000] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#F2CB05]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-sm w-full space-y-10">
        <div className="flex justify-center animate-in zoom-in duration-1000">
          <div className="relative">
            <div className="absolute inset-0 bg-[#F2CB05] blur-3xl opacity-20"></div>
            <img 
              src={DJ_LOGO} 
              className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(242,203,5,0.4)]" 
              alt="DJ Peligro" 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-[#F2CB05] font-black italic text-3xl md:text-5xl uppercase tracking-tighter leading-none animate-in slide-in-from-top-4 duration-700 delay-200">
              ¡VOTO <br/>ENVIADO!
            </h2>
            <div className="flex justify-center gap-1.5">
              <div className="w-12 h-1 bg-[#F2CB05] rounded-full"></div>
              <div className="w-3 h-1 bg-[#F2CB05] rounded-full"></div>
            </div>
          </div>

          <div className="space-y-4 animate-in fade-in duration-1000 delay-500">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-[#F2CB05]/30 px-6 py-3 rounded-2xl">
              <Clock className="w-5 h-5 text-[#F2CB05] animate-pulse" />
              <p className="text-white font-black text-xl uppercase italic tracking-tighter">
                NUEVO VOTO EN: <span className="text-[#F2CB05] ml-1">{formatTime(cooldownMs)}</span>
              </p>
            </div>
            <p className="text-neutral-500 font-bold text-[10px] uppercase tracking-[0.4em] leading-relaxed mx-auto max-w-[280px]">
              Sigue la fiesta mientras esperas tu próximo turno
            </p>
          </div>
        </div>

        <div className="pt-6 animate-in slide-in-from-bottom-6 duration-700 delay-700">
          <a 
            href="https://www.instagram.com/djpeligroperu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-5 bg-white text-black px-8 py-7 rounded-[2.2rem] font-black text-sm md:text-base uppercase italic tracking-[0.15em] shadow-[0_25px_60px_-10px_rgba(255,255,255,0.25)] hover:scale-[1.03] active:scale-95 transition-all w-full overflow-hidden"
          >
            <div className="p-2 bg-black rounded-xl">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <span>VER RESULTADOS</span>
            <ExternalLink className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="mt-12 flex items-center justify-center gap-3 text-neutral-800">
             <Trophy className="w-4 h-4 fill-current" />
             <span className="text-[9px] font-black uppercase tracking-[0.6em]">Peligro Edition • Re-voting System</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostVoteModal;
