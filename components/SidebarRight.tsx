
import React, { useState } from 'react';
import { VisibilityState } from '../types';
import { VERTIPORTS } from '../constants';

interface SidebarRightProps {
  visibility: VisibilityState;
  setVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  onTargetSelect: (pos: [number, number]) => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ visibility, setVisibility, onTargetSelect }) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    metrics: false,
    readiness: false,
    overlays: false
  });

  const toggle = (section: string) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleLayer = (key: keyof VisibilityState) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-screen md:w-[320px] flex flex-col gap-3 p-3 h-full bg-[#080a0c]/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none pointer-events-auto md:pointer-events-none overflow-y-auto custom-scrollbar">
      
      {/* 1. Ops Metrics */}
      <div className="bg-[#0b1014]/95 border border-white/10 rounded-2xl md:pointer-events-auto shadow-xl overflow-hidden shrink-0">
        <div 
          onClick={() => toggle('metrics')}
          className="p-4 border-b border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
        >
          <h2 className="text-[11px] font-black tracking-widest text-gray-500 uppercase flex items-center gap-2">
            <i className="bi bi-speedometer2 text-[#00ff9d]"></i> Ops Metrics
          </h2>
          <i className={`bi bi-chevron-${collapsed.metrics ? 'down' : 'up'} text-gray-500 text-[10px]`}></i>
        </div>
        {!collapsed.metrics && (
          <div className="p-4 grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-200">
            {[
              { l: 'Live', v: '4', c: '#00ff9d' },
              { l: 'Plan', v: '15', c: '#60a5fa' },
              { l: 'OTP', v: '98%', c: '#fff' },
              { l: 'Alert', v: '1', c: '#ff4757' }
            ].map((k, i) => (
              <div key={i} className="bg-white/5 p-3 text-center rounded-xl border border-white/5">
                <div className="text-xl font-black tabular-nums" style={{ color: k.c }}>{k.v}</div>
                <div className="text-[9px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">{k.l}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Pad Readiness (Height Reduced) */}
      <div className="bg-[#0b1014]/95 border border-white/10 rounded-2xl md:pointer-events-auto flex flex-col shadow-xl overflow-hidden shrink-0">
        <div 
          onClick={() => toggle('readiness')}
          className="p-4 border-b border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
        >
          <h2 className="text-[11px] font-black tracking-widest text-gray-500 uppercase flex items-center gap-2">
            <i className="bi bi-box-seam text-yellow-500"></i> Pad Readiness
          </h2>
          <i className={`bi bi-chevron-${collapsed.readiness ? 'down' : 'up'} text-gray-500 text-[10px]`}></i>
        </div>
        {!collapsed.readiness && (
          <div className="max-h-[220px] overflow-y-auto custom-scrollbar p-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {VERTIPORTS.map((vp) => (
              <div 
                key={vp.id} 
                className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center transition-all hover:bg-white/10 cursor-pointer active:scale-95"
                onClick={() => onTargetSelect([vp.lat, vp.lng])}
              >
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-200">{vp.name}</span>
                  <span className="text-[9px] text-gray-600 font-mono uppercase">{vp.code}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-gray-400">{vp.occupiedStands}/{vp.stands}</div>
                    <div className="text-[7px] text-gray-600 font-black uppercase tracking-tighter">Pads</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${vp.status === 'Active' ? 'bg-[#00ff9d] shadow-[0_0_8px_#00ff9d]' : 'bg-yellow-500'}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Data Overlays */}
      <div className="bg-[#0b1014]/95 border border-white/10 rounded-2xl md:pointer-events-auto shadow-xl overflow-hidden mb-4 shrink-0">
        <div 
          onClick={() => toggle('overlays')}
          className="p-4 border-b border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
        >
          <h2 className="text-[11px] font-black tracking-widest text-gray-500 uppercase flex items-center gap-2">
            <i className="bi bi-layers text-cyan-400"></i> Data Overlays
          </h2>
          <i className={`bi bi-chevron-${collapsed.overlays ? 'down' : 'up'} text-gray-500 text-[10px]`}></i>
        </div>
        {!collapsed.overlays && (
          <div className="p-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {Object.entries(visibility).map(([key, val]) => (
              <label key={key} className="flex justify-between items-center p-2.5 rounded-xl hover:bg-white/5 cursor-pointer group">
                <span className="text-[10px] text-gray-400 group-hover:text-gray-200 font-bold uppercase tracking-tight">{key.replace(/([A-Z])/g, ' $1')}</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={val} 
                    onChange={() => toggleLayer(key as keyof VisibilityState)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#00ff9d]"></div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarRight;
