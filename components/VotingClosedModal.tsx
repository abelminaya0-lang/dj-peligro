
import React from 'react';
import { Instagram, AlertTriangle, ChevronRight, Trophy } from 'lucide-react';

interface VotingClosedModalProps {
  isVisible: boolean;
}

const VotingClosedModal: React.FC<VotingClosedModalProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722460/LOGO_DJ_PELIGRO_ihglvl.png";

  return (
    <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      {/* Efecto de luz roja de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/20 blur-[120px] rounded-full opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center animate-in zoom-in-95 duration-500">
        {/* Icono de Alerta / Fin */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-red-600 blur-2xl opacity-40 animate-pulse"></div>
          <div className="bg-red-600 p-6 rounded-full relative z-10 border-4 border-white shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-white font-black italic text-5xl md:text-6xl uppercase tracking-tighter leading-none mb-4">
          ¡SE ACABÓ LA <br/> <span className="text-red-600">VOTACIÓN!</span>
        </h2>
        
        <p className="text-neutral-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-12">
          EL TIEMPO HA EXPIRADO • DJ PELIGRO EN MEZCLAS
        </p>

        {/* Botón Instagram */}
        <div className="w-full space-y-4">
          <a 
            href="https://www.instagram.com/djpeligroperu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between bg-white text-black px-8 py-6 rounded-[2.5rem] font-black text-lg uppercase italic tracking-tighter shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-[1.05] active:scale-95 transition-all w-full border-b-4 border-neutral-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-black rounded-xl">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <span>MIRA LOS RESULTADOS</span>
            </div>
            <ChevronRight className="w-6 h-6 opacity-30 group-hover:translate-x-1 transition-transform" />
          </a>

          <p className="text-white/30 text-[9px] font-black uppercase tracking-widest pt-4">
            PREPÁRATE PARA EL SIGUIENTE TRACK
          </p>
        </div>

        {/* Logo pequeño inferior */}
        <img 
          src={DJ_LOGO} 
          className="w-24 mt-16 opacity-50 grayscale invert" 
          alt="DJ Peligro" 
        />
      </div>
    </div>
  );
};

export default VotingClosedModal;
