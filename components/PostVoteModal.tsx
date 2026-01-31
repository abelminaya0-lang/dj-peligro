
import React from 'react';
import { Instagram, ExternalLink, Trophy, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-[999] bg-[#000000] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      {/* Fondo con Brillo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#F2CB05]/10 blur-[150px] rounded-full opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center">
        {/* Logo con Animación */}
        <div className="mb-12 animate-in zoom-in duration-1000">
          <div className="relative">
            <div className="absolute inset-0 bg-[#F2CB05] blur-3xl opacity-30 animate-pulse"></div>
            <img 
              src={DJ_LOGO} 
              className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-[0_0_40px_rgba(242,203,5,0.5)]" 
              alt="DJ Peligro" 
            />
          </div>
        </div>

        {/* Mensaje de Éxito */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col items-center gap-3">
             <div className="bg-[#F2CB05] p-2 rounded-full mb-2">
                <CheckCircle2 className="w-8 h-8 text-black" />
             </div>
             <h2 className="text-white font-black italic text-4xl md:text-5xl uppercase tracking-tighter leading-none animate-in slide-in-from-top-4 duration-700">
              ¡GRACIAS POR <br/> <span className="text-[#F2CB05]">TU VOTO!</span>
            </h2>
          </div>

          <div className="bg-white/5 border border-[#F2CB05]/20 px-8 py-5 rounded-[2rem] inline-block animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#F2CB05] animate-pulse" />
              <p className="text-white font-black text-xl uppercase italic tracking-tighter">
                PRÓXIMO TURNO: <span className="text-[#F2CB05] ml-1">{formatTime(cooldownMs)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="w-full space-y-4 animate-in slide-in-from-bottom-8 duration-700 delay-700">
          {/* Botón Ver Resultados */}
          <a 
            href="https://www.instagram.com/djpeligroperu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between bg-white text-black px-8 py-6 rounded-[2rem] font-black text-base uppercase italic tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all w-full"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-black rounded-xl">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <span>VER RESULTADOS</span>
            </div>
            <ChevronRight className="w-6 h-6 opacity-30 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Botón Seguir a DJ Peligro */}
          <a 
            href="https://www.instagram.com/djpeligroperu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 bg-transparent border-2 border-white/10 text-white px-8 py-6 rounded-[2rem] font-black text-sm uppercase italic tracking-widest hover:border-[#F2CB05] hover:text-[#F2CB05] transition-all w-full"
          >
            <Instagram className="w-5 h-5" />
            <span>SEGUIR A DJ PELIGRO</span>
          </a>
        </div>

        {/* Badge Inferior */}
        <div className="mt-16 flex items-center gap-3 text-white/10">
           <Trophy className="w-4 h-4 fill-current" />
           <span className="text-[8px] font-black uppercase tracking-[0.8em]">EDICIÓN LIMITADA • PELIGRO FLOW</span>
        </div>
      </div>
    </div>
  );
};

export default PostVoteModal;
