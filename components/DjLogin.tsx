
import React, { useState } from 'react';
import { Lock, Mail, ChevronRight, X, AlertCircle, Sun, Moon } from 'lucide-react';

interface DjLoginProps {
  onLogin: (email: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DjLogin: React.FC<DjLoginProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769720682/avatars-000658755773-nboqus-t500x500-removebg-preview_r7cgsp.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === 'peligro.dj@email.com' && cleanPassword === '1234') {
      onLogin(cleanEmail);
    } else {
      setError('Acceso denegado. Credenciales incorrectas.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--bg-primary)] opacity-90 backdrop-blur-md animate-in fade-in duration-500 theme-transition"></div>
      
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="absolute top-10 left-10 z-[110] p-3 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-lg hover:scale-110 active:scale-95 transition-all theme-transition"
      >
        {isDarkMode ? <Sun className="w-6 h-6 text-[#F2CB05]" /> : <Moon className="w-6 h-6 text-[#594302]" />}
      </button>

      <div className="relative w-full max-w-md bg-[var(--card-bg)] rounded-[3rem] border border-[var(--border-color)] shadow-[0_20px_60px_-15px_rgba(242,203,5,0.3)] animate-in zoom-in slide-in-from-bottom-12 duration-500 overflow-hidden theme-transition">
        
        <a 
          href="#/" 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--bg-primary)] transition-all text-neutral-400 hover:text-[var(--text-primary)] z-10"
        >
          <X className="w-6 h-6" />
        </a>

        <div className="p-8 md:p-12">
          <header className="mb-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-[#F2CB05] rounded-[2rem] rotate-6 flex items-center justify-center shadow-2xl shadow-[#F2CB05]/30 mb-6 transition-transform hover:rotate-0 duration-500 overflow-hidden p-2">
              <img 
                src={DJ_LOGO} 
                alt="DJ Peligro Logo" 
                className="w-full h-full object-contain -rotate-6 group-hover:rotate-0 transition-transform duration-500" 
              />
            </div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic theme-transition">PANEL DJ</h1>
            <p className="text-neutral-400 mt-2 font-bold text-center text-[10px] uppercase tracking-[0.3em]">Acceso Restringido • Peligro</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-black flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Email de Acceso</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="peligro.dj@email.com"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[1.2rem] pl-14 pr-5 py-5 focus:outline-none focus:ring-2 focus:ring-[#F2CB05]/30 transition-all text-[var(--text-primary)] placeholder:text-neutral-400 font-bold theme-transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Pin Maestro</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[1.2rem] pl-14 pr-5 py-5 focus:outline-none focus:ring-2 focus:ring-[#F2CB05]/30 transition-all text-[var(--text-primary)] placeholder:text-neutral-400 font-bold tracking-widest theme-transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F2CB05] hover:bg-[#F2B705] text-[#0D0D0D] font-black py-5 rounded-[1.2rem] flex items-center justify-center group transition-all shadow-xl shadow-[#F2CB05]/10 active:scale-95 mt-4"
            >
              <span className="text-sm uppercase tracking-widest">INGRESAR AL PANEL</span>
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-[var(--border-color)] text-center theme-transition">
            <p className="text-neutral-400 text-[9px] font-black uppercase tracking-[0.4em] leading-relaxed">
              DJ PELIGRO SYSTEM • V2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DjLogin;
