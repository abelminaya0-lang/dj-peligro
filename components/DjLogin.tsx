
import React, { useState } from 'react';
import { Lock, Mail, ChevronRight, X, AlertCircle, Sun, Moon, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DjLoginProps {
  onLogin: (email: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DjLogin: React.FC<DjLoginProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const DJ_LOGO = "https://res.cloudinary.com/drvs81bl0/image/upload/v1769722460/LOGO_DJ_PELIGRO_ihglvl.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (cleanEmail === 'peligro.dj@email.com' && cleanPassword === '1234') {
        onLogin(cleanEmail);
      } else {
        setError('Acceso denegado. Credenciales incorrectas.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D0D0D] overflow-hidden">
      {/* Botón Volver */}
      <Link 
        to="/"
        className="absolute top-8 left-8 z-[110] flex items-center gap-3 px-6 py-4 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-white shadow-2xl hover:bg-[#F2CB05] hover:text-[#0D0D0D] transition-all font-black text-xs uppercase italic tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> VOLVER
      </Link>

      <div className="relative w-full max-w-lg bg-[var(--card-bg)] rounded-[3.5rem] border border-[var(--border-color)] shadow-[0_40px_100px_-20px_rgba(242,203,5,0.1)] animate-in zoom-in duration-700 overflow-hidden theme-transition">
        <div className="p-10 md:p-16">
          <header className="mb-12 flex flex-col items-center">
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-[#F2CB05] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img src={DJ_LOGO} className="w-32 h-32 relative z-10 object-contain drop-shadow-[0_10px_20px_rgba(242,203,5,0.4)]" alt="Logo" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-[#F2CB05]" />
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">CENTRAL DJ</h1>
            </div>
            <p className="text-neutral-500 font-bold text-center text-[10px] uppercase tracking-[0.4em]">Acceso Maestro • Peligro System</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-black flex items-center gap-4 animate-in slide-in-from-top-2">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-3">
              <label className="text-[11px] font-black text-neutral-500 uppercase tracking-widest ml-1">E-mail Administrativo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="peligro.dj@email.com"
                className="w-full bg-[#0D0D0D] border border-[var(--border-color)] rounded-2xl px-6 py-6 focus:outline-none focus:border-[#F2CB05] transition-all text-white font-bold"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-neutral-500 uppercase tracking-widest ml-1">Código de Seguridad</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full bg-[#0D0D0D] border border-[var(--border-color)] rounded-2xl px-6 py-6 focus:outline-none focus:border-[#F2CB05] transition-all text-white font-bold tracking-[0.5em]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#F2CB05] hover:bg-[#F2B705] text-[#0D0D0D] font-black py-6 rounded-2xl flex items-center justify-center group transition-all shadow-2xl active:scale-[0.98] mt-6 ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? <div className="w-6 h-6 border-4 border-[#0D0D0D]/30 border-t-[#0D0D0D] rounded-full animate-spin"></div> : (
                <span className="text-sm uppercase tracking-[0.2em] italic">AUTENTICAR ACCESO</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DjLogin;
