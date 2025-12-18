
import React, { useState } from 'react';
import { Vertiport, DroneFlight, LogEntry, FlightStatus } from '../types';

interface SidebarLeftProps {
  vertiports: Vertiport[];
  flights: DroneFlight[];
  logs: LogEntry[];
  onOpenDashboard: () => void;
  onTargetSelect: (pos: [number, number], vp?: Vertiport) => void;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ vertiports, flights, logs, onOpenDashboard, onTargetSelect }) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    flights: false,
    vertiports: false,
    logs: false
  });

  const toggle = (section: string) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-screen md:w-[420px] flex flex-col gap-4 p-4 h-full overflow-y-auto custom-scrollbar pointer-events-none">
      
      {/* 1. UOCC Global Control Access */}
      <div className="bg-[#00ff9d]/5 border border-[#00ff9d]/30 rounded-2xl pointer-events-auto p-1 shadow-lg backdrop-blur-xl shrink-0">
        <button 
          onClick={onOpenDashboard}
          className="w-full py-4 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] text-[#00ff9d] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <i className="bi bi-cpu-fill text-lg"></i>
          UOCC INFRASTRUCTURE SYSTEM
        </button>
      </div>

      {/* 2. Active Flight Strips Card */}
      <div className="bg-[#0b1014]/90 border border-white/10 rounded-2xl pointer-events-auto flex flex-col shadow-xl backdrop-blur-xl overflow-hidden shrink-0">
        <div 
          onClick={() => toggle('flights')}
          className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <h2 className="text-[11px] font-black tracking-widest text-[#00ff9d] uppercase flex items-center gap-2">
            <i className="bi bi-airplane-engines"></i> Active Flight Strips
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-gray-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">{flights.length} LIVE</span>
            <i className={`bi bi-chevron-${collapsed.flights ? 'down' : 'up'} text-gray-500 text-[10px]`}></i>
          </div>
        </div>
        {!collapsed.flights && (
          <div className="p-3 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
            {flights.map(f => (
              <div 
                key={f.id}
                onClick={() => onTargetSelect(f.currentPos)}
                className={`group relative bg-[#13171c] border-l-4 border-r border-y border-white/5 p-3 rounded-r-lg cursor-pointer hover:bg-[#1a1f26] transition-all
                  ${f.status === FlightStatus.CONFLICT ? 'border-l-magenta-500 bg-magenta-500/5' : 'border-l-[#00ff9d]'}`}
                style={{ borderLeftColor: f.status === FlightStatus.CONFLICT ? '#ff00ff' : '#00ff9d' }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-black font-mono text-white tracking-tighter">{f.callSign}</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] font-mono text-gray-400">SQ {f.squawk}</span>
                  </div>
                  <div className={`text-[8px] font-black tracking-tighter uppercase px-1.5 py-0.5 rounded ${f.status === FlightStatus.CONFLICT ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500'}`}>
                    {f.status}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-gray-600 font-black uppercase">Alt</span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{f.altitude.toFixed(0)}FT</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] text-gray-600 font-black uppercase">Spd</span>
                    <span className="text-[10px] font-mono text-white font-bold">{f.speed.toFixed(0)}KT</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[7px] text-gray-600 font-black uppercase">Batt</span>
                    <span className={`text-[10px] font-mono font-bold ${f.battery < 20 ? 'text-red-500' : 'text-gray-400'}`}>{f.battery.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Vertiport Status Card */}
      <div className="bg-[#0b1014]/90 border border-white/10 rounded-2xl pointer-events-auto flex flex-col shadow-xl backdrop-blur-xl overflow-hidden shrink-0">
        <div 
          onClick={() => toggle('vertiports')}
          className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <h2 className="text-[11px] font-black tracking-widest text-cyan-400 uppercase flex items-center gap-2">
            <i className="bi bi-buildings"></i> Vertiport Network
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-gray-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">OPS READY</span>
            <i className={`bi bi-chevron-${collapsed.vertiports ? 'down' : 'up'} text-gray-500 text-[10px]`}></i>
          </div>
        </div>
        {!collapsed.vertiports && (
          <div className="p-3 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
            {vertiports.map(vp => (
              <div 
                key={vp.id}
                className="bg-[#13171c] border border-white/5 p-3 rounded-xl transition-all group hover:border-white/20"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-400/10 rounded-lg flex items-center justify-center text-cyan-400 border border-cyan-400/30 font-black text-xs">H</div>
                    <div>
                      <div className="text-[12px] font-black text-white leading-tight">{vp.name}</div>
                      <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">{vp.code}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter ${vp.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {vp.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                    <div className="text-[7px] text-gray-600 font-black uppercase mb-1">Pads Occ</div>
                    <div className="text-[10px] font-mono font-bold text-white flex justify-between">
                      <span>{vp.occupiedStands}/{vp.stands}</span>
                      <span className="text-[#00ff9d]">{Math.round((vp.occupiedStands/vp.stands)*100)}%</span>
                    </div>
                  </div>
                  <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                    <div className="text-[7px] text-gray-600 font-black uppercase mb-1">Local Wind</div>
                    <div className="text-[10px] font-mono font-bold text-cyan-400">{vp.weather.wind}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onTargetSelect([vp.lat, vp.lng])}
                    className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    MOV
                  </button>
                  <button 
                    onClick={() => onTargetSelect([vp.lat, vp.lng], vp)}
                    className="flex-1 py-1.5 bg-cyan-400/10 hover:bg-cyan-400/20 rounded-lg border border-cyan-400/20 text-[9px] font-black uppercase tracking-widest text-cyan-400 transition-all flex items-center justify-center gap-2"
                  >
                    DET
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Event Logs Card */}
      <div className="bg-[#0b1014]/90 border border-white/10 rounded-2xl pointer-events-auto flex flex-col shadow-xl backdrop-blur-xl overflow-hidden mb-4 shrink-0">
        <div 
          onClick={() => toggle('logs')}
          className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <h2 className="text-[11px] font-black tracking-widest text-yellow-500 uppercase flex items-center gap-2">
            <i className="bi bi-terminal"></i> Mission Log Stream
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-gray-500 animate-pulse">● LIVE</span>
            <i className={`bi bi-chevron-${collapsed.logs ? 'down' : 'up'} text-gray-500 text-[10px]`}></i>
          </div>
        </div>
        {!collapsed.logs && (
          <div className="p-4 h-[200px] overflow-y-auto custom-scrollbar space-y-2 font-mono text-[9px] animate-in slide-in-from-top-2 duration-200">
            {logs.map(log => (
              <div key={log.id} className="flex gap-2 border-b border-white/5 pb-2 last:border-0">
                <span className="text-gray-600">[{log.time}]</span>
                <span className={`${log.type === 'ERR' ? 'text-red-500' : 'text-[#00ff9d]'} font-bold`}>{log.source}</span>
                <span className="text-gray-400 leading-tight">{log.message}</span>
              </div>
            ))}
            <div className="text-gray-600 animate-pulse">_</div>
          </div>
        )}
      </div>

    </aside>
  );
};

export default SidebarLeft;
