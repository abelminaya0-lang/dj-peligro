
import React, { useState } from 'react';
import { Lock, Mail, ChevronRight, Music, X, AlertCircle } from 'lucide-react';

interface DjLoginProps {
  onLogin: (email: string) => void;
}

const DjLogin: React.FC<DjLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciales EXACTAS solicitadas: peligro.dj@email.com / 1234
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === 'peligro.dj@email.com' && cleanPassword === '1234') {
      onLogin(cleanEmail);
    } else {
      setError('Acceso denegado. Email o contraseña incorrectos.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Fondo oscuro con desenfoque para dar efecto pop-up */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500"></div>
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-neutral-900 rounded-[2.5rem] border border-neutral-800 shadow-[0_0_80px_-20px_rgba(34,197,94,0.4)] animate-in zoom-in slide-in-from-bottom-12 duration-500 overflow-hidden">
        
        {/* Botón de cerrar para volver a la votación */}
        <a 
          href="#/" 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-800 transition-all text-neutral-500 hover:text-white z-10 hover:rotate-90"
        >
          <X className="w-6 h-6" />
        </a>

        <div className="p-8 md:p-12">
          <header className="mb-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500 rounded-[2rem] rotate-6 flex items-center justify-center shadow-2xl shadow-green-500/30 mb-6 group transition-transform hover:rotate-0 duration-500">
              <Music className="w-12 h-12 text-black -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Panel DJ</h1>
            <p className="text-neutral-500 mt-2 font-bold text-center text-xs uppercase tracking-[0.2em]">Elaboración de Resultados</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 text-xs font-black flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Email de Acceso</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="peligro.dj@email.com"
                  className="w-full bg-black border border-neutral-800 rounded-[1.2rem] pl-14 pr-5 py-5 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all text-neutral-100 placeholder:text-neutral-800 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-black border border-neutral-800 rounded-[1.2rem] pl-14 pr-5 py-5 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all text-neutral-100 placeholder:text-neutral-800 font-bold tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-5 rounded-[1.2rem] flex items-center justify-center group transition-all shadow-xl shadow-green-500/20 active:scale-95 mt-4"
            >
              <span className="text-sm uppercase tracking-widest">Entrar al Panel</span>
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-neutral-800/50 text-center">
            <p className="text-neutral-700 text-[9px] font-black uppercase tracking-[0.4em] leading-relaxed">
              Autenticación Requerida • DJ Vote Flow V1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DjLogin;
