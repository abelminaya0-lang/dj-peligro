
import React from 'react';
import { Instagram, Heart, ExternalLink, Zap } from 'lucide-react';

interface PostVoteModalProps {
  isVisible: boolean;
}

const PostVoteModal: React.FC<PostVoteModalProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[150%] h-[50%] bg-[#F2CB05] opacity-[0.03] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#F2CB05]/5 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-sm w-full space-y-12">
        {/* Icono Principal */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#F2CB05] blur-3xl opacity-20 animate-pulse"></div>
            <div className="bg-[#F2CB05] p-6 rounded-[2.5rem] rotate-12 shadow-[0_20px_50px_rgba(242,203,5,0.4)] relative z-10">
              <Heart className="w-16 h-16 text-black fill-current" />
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-[#F2CB05] font-black italic text-4xl md:text-5xl uppercase tracking-tighter leading-none">
              ¡GRACIAS POR <br/>TU VOTO!
            </h2>
            <div className="flex justify-center gap-1 opacity-50">
              <div className="w-8 h-1 bg-[#F2CB05] rounded-full"></div>
              <div className="w-2 h-1 bg-[#F2CB05] rounded-full"></div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-white font-black text-lg md:text-xl uppercase italic tracking-tight leading-tight">
              ¿QUIERES SABER <span className="text-[#F2CB05]">QUIÉN ESTÁ GANANDO</span>?
            </p>
            <p className="text-neutral-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] leading-relaxed max-w-[280px] mx-auto">
              LOS RESULTADOS FINALES Y EL CONTEO EN VIVO ESTÁN DISPONIBLES EN MI INSTAGRAM OFICIAL
            </p>
          </div>
        </div>

        {/* Botón Instagram de Alto Impacto */}
        <div className="pt-4">
          <a 
            href="https://www.instagram.com/djpeligroperu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-4 bg-white text-black px-10 py-6 rounded-2xl font-black text-sm uppercase italic tracking-widest shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <Instagram className="w-6 h-6 text-[#ee2a7b]" />
            VER RESULTADOS
            <ExternalLink className="w-4 h-4 opacity-30 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-neutral-800">
             <Zap className="w-3 h-3 fill-current" />
             <span className="text-[8px] font-black uppercase tracking-[0.5em]">Peligro Edition • Official Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostVoteModal;
