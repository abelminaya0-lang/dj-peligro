
import React, { useMemo } from 'react';
import { Song, Vote, SongWithStats } from '../types';
import StatsChart from './StatsChart';
import { LogOut, RotateCcw, Users, TrendingUp, Music, ListMusic, BarChart3, Activity, Info } from 'lucide-react';

interface DjDashboardProps {
  songs: Song[];
  votes: Vote[];
  onReset: () => void;
  onLogout: () => void;
  onUpdateSongs: (songs: Song[]) => void;
}

const DjDashboard: React.FC<DjDashboardProps> = ({ songs, votes, onReset, onLogout, onUpdateSongs }) => {
  const songStats: SongWithStats[] = useMemo(() => {
    const totalVotes = votes.length;
    return songs.map(song => {
      const voteCount = votes.filter(v => v.songId === song.id).length;
      return {
        ...song,
        voteCount,
        percentage: totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
      };
    }).sort((a, b) => b.voteCount - a.voteCount);
  }, [songs, votes]);

  const totalVotes = votes.length;
  const topSong = songStats[0]?.voteCount > 0 ? songStats[0] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4">
            <Activity className="text-green-500 w-10 h-10" />
            PANEL <span className="text-green-500">DJ</span>
          </h1>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mt-2">Control de votaciones en tiempo real</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { if(confirm('¿Reiniciar votos?')) onReset(); }}
            className="flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white px-6 py-4 rounded-2xl border border-neutral-800 transition-all font-bold text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Resetear</span>
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-4 rounded-2xl border border-red-500/20 transition-all font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-neutral-900/50 p-8 rounded-[2.5rem] border border-neutral-800">
          <p className="text-neutral-500 font-black uppercase tracking-widest text-[10px] mb-4">Votos Totales</p>
          <p className="text-5xl font-black text-white">{totalVotes}</p>
        </div>
        <div className="bg-neutral-900/50 p-8 rounded-[2.5rem] border border-neutral-800">
          <p className="text-neutral-500 font-black uppercase tracking-widest text-[10px] mb-4">Canciones</p>
          <p className="text-5xl font-black text-white">{songs.length}</p>
        </div>
        <div className="bg-neutral-900/50 p-8 rounded-[2.5rem] border border-neutral-800">
          <p className="text-neutral-500 font-black uppercase tracking-widest text-[10px] mb-4">Favorita</p>
          <p className="text-xl font-black text-green-500 truncate uppercase">{topSong ? topSong.title : 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-900 rounded-[3rem] border border-neutral-800 p-8 md:p-12 min-h-[450px] flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <BarChart3 className="text-green-500 w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight uppercase italic">Gráfico de Votos</h2>
          </div>
          <div className="flex-grow">
            <StatsChart data={songStats} />
          </div>
        </div>

        <div className="bg-neutral-900 rounded-[3rem] border border-neutral-800 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-10">
            <ListMusic className="text-green-500 w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight uppercase italic">Ranking</h2>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {songStats.map((song) => (
              <div key={song.id} className="flex items-center p-4 bg-black/40 rounded-2xl border border-neutral-800">
                <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover mr-4" alt="" />
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-white truncate">{song.title}</h4>
                  <p className="text-[10px] text-neutral-500 font-black uppercase">{song.artist}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-green-500 block">{song.voteCount}</span>
                  <span className="text-[9px] font-black text-neutral-700 uppercase">{song.percentage.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DjDashboard;
