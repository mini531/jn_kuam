
import React from 'react';
import { VisibilityState } from '../types';

interface RightPanelProps {
  visibility: VisibilityState;
  setVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
}

const RightPanel: React.FC<RightPanelProps> = ({ visibility, setVisibility }) => {
  const toggleLayer = (key: keyof VisibilityState) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-4 w-72 h-[calc(100vh-2rem)] overflow-hidden pointer-events-none">
      {/* Layer Control Panel */}
      <div className="bg-[#111827]/80 backdrop-blur-md border border-white/10 p-4 pointer-events-auto rounded-lg shadow-2xl">
        <h2 className="text-sm font-bold text-[#60a5fa] mb-3 flex items-center gap-2">
          <i className="bi bi-layer-forward"></i> LAYER MANAGEMENT
        </h2>
        <div className="space-y-2">
          {Object.entries(visibility).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-2 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
              <span className="text-[10px] uppercase font-bold text-gray-400">{key.replace(/([A-Z])/g, ' $1')}</span>
              <input 
                type="checkbox" 
                checked={value} 
                onChange={() => toggleLayer(key as keyof VisibilityState)}
                className="w-3 h-3 accent-[#60a5fa]"
              />
            </label>
          ))}
        </div>
      </div>

      {/* System Topology Diagram */}
      <div className="bg-[#111827]/80 backdrop-blur-md border border-white/10 p-4 pointer-events-auto flex-1 flex flex-col rounded-lg shadow-2xl min-h-0">
        <h2 className="text-sm font-bold text-[#60a5fa] mb-3 flex items-center gap-2">
          <i className="bi bi-diagram-3"></i> SYSTEM TOPOLOGY
        </h2>
        <div className="relative flex-1 bg-black/40 rounded border border-white/5 overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 200 300">
            {/* Simple connections */}
            <line x1="100" y1="50" x2="60" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="100" y1="50" x2="140" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            
            {/* Core Node */}
            <circle cx="100" cy="50" r="12" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" className="animate-pulse" />
            <text x="100" y="75" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="bold">G-01 (CORE)</text>

            {/* Edge Nodes */}
            <rect x="50" y="120" width="20" height="20" fill="#064e3b" stroke="#10b981" />
            <text x="60" y="155" textAnchor="middle" fill="#10b981" fontSize="6">ALPHA</text>
            
            <rect x="130" y="120" width="20" height="20" fill="#064e3b" stroke="#10b981" />
            <text x="140" y="155" textAnchor="middle" fill="#10b981" fontSize="6">BETA</text>

            {/* Terminal Nodes */}
            {[0, 1, 2, 3].map(i => (
              <circle key={i} cx={40 + i * 40} cy="220" r="6" fill="#111827" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
            ))}
          </svg>
        </div>
        
        <div className="mt-4 space-y-2">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Network Health</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/5 rounded overflow-hidden">
              <div className="w-[92%] h-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
            </div>
            <span className="text-[10px] font-mono">92%</span>
          </div>
          <div className="text-[9px] text-gray-400 bg-white/5 p-2 rounded border border-white/5 italic">
            "Secure handshake established with all regional sectors. Encrypted U-Sync v4.2 operational."
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
