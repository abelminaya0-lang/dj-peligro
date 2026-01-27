
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

// Complete the DjDashboard component and ensure it has a default export
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
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4">
            <Activity className="text-green-500 w-10 h-10" />
            PANEL <span className="text-green-500">CONTROL</span>
          </h1>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mt-2">Dashboard de administración para DJ</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onReset}
            className="flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white px-6 py-4 rounded-2xl border border-neutral-800 transition-all font-bold text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Resetear Votos</span>
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-4 rounded-2xl border border-red-500/20 transition-all font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-neutral-900/50 p-8 rounded-[2.5rem] border border-neutral-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Users className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-neutral-500 font-black uppercase tracking-widest text-[10px]">Votos Totales</p>
          </div>
          <p className="text-5xl font-black text-white">{totalVotes}</p>
        </div>

        <div className="bg-neutral-900/50 p-8 rounded-[2.5rem] border border-neutral-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Music className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-neutral-500 font-black uppercase tracking-widest text-[10px]">Canciones Activas</p>
          </div>
          <p className="text-5xl font-black text-white">{songs.length}</p>
        </div>

        <div className="bg-neutral-900/50 p-8 rounded-[2.5rem] border border-neutral-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-neutral-500 font-black uppercase tracking-widest text-[10px]">Tendencia</p>
          </div>
          <p className="text-xl font-black text-white truncate">{topSong ? topSong.title : 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Stats */}
        <div className="bg-neutral-900 rounded-[3rem] border border-neutral-800 p-8 md:p-12 flex flex-col min-h-[400px]">
          <div className="flex items-center gap-3 mb-10">
            <BarChart3 className="text-green-500 w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight uppercase italic">Top Ranking</h2>
          </div>
          <div className="flex-grow">
            <StatsChart data={songStats} />
          </div>
          <div className="mt-8 flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-neutral-800/50">
            <Info className="w-5 h-5 text-neutral-600 shrink-0" />
            <p className="text-xs text-neutral-500 font-medium">
              Datos actualizados en tiempo real basados en los votos de los invitados.
            </p>
          </div>
        </div>

        {/* Detailed List */}
        <div className="bg-neutral-900 rounded-[3rem] border border-neutral-800 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-10">
            <ListMusic className="text-green-500 w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight uppercase italic">Desglose de Votos</h2>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            {songStats.map((song) => (
              <div 
                key={song.id} 
                className="flex items-center p-4 bg-black/40 rounded-[1.5rem] border border-neutral-800 group hover:border-neutral-700 transition-all"
              >
                <img src={song.coverUrl} className="w-14 h-14 rounded-xl object-cover mr-4" alt="" />
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-white truncate">{song.title}</h4>
                  <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest truncate">{song.artist}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-2xl font-black text-green-500">{song.voteCount}</span>
                  <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Votos</span>
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
