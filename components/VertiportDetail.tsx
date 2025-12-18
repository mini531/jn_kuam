
import React from 'react';
import { Vertiport } from '../types';

interface VertiportDetailProps {
  vp: Vertiport | null;
  onClose: () => void;
}

const VertiportDetail: React.FC<VertiportDetailProps> = ({ vp, onClose }) => {
  if (!vp) return null;

  return (
    <div className="fixed top-[80px] left-1/2 -translate-x-1/2 md:left-[450px] md:translate-x-0 z-[2000] w-[90%] md:w-[400px] bg-[#0b1014]/98 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="w-10 h-10 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center font-black text-[#00ff9d]">H</div>
             <div>
               <h2 className="text-xl font-black tracking-tight text-white">{vp.name}</h2>
               <p className="text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase">{vp.code} | ELEV {vp.elevation}FT</p>
             </div>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 border border-white/10 transition-colors">
          <i className="bi bi-x"></i>
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Operational METAR/Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="text-[8px] font-black text-gray-500 uppercase mb-2 tracking-widest">Local Pressure</div>
            <div className="text-lg font-mono font-bold text-[#00ff9d]">{vp.weather.pressure}</div>
          </div>
          <div className={`rounded-2xl p-4 border flex flex-col justify-center ${vp.lights === 'Green' ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
            <div className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Ground Safety</div>
            <div className={`text-sm font-black uppercase ${vp.lights === 'Green' ? 'text-green-400' : 'text-yellow-400'}`}>
              <i className="bi bi-shield-check mr-2"></i>{vp.lights === 'Green' ? 'SAFE' : 'CAUTION'}
            </div>
          </div>
        </div>

        {/* METAR-like Weather */}
        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-3">
           <div className="flex justify-between items-center text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
             <span>Aviation Weather Summary</span>
             <i className="bi bi-broadcast text-[#00ff9d]"></i>
           </div>
           <div className="grid grid-cols-3 gap-2">
             <div className="text-center">
               <div className="text-[8px] text-gray-600 font-bold mb-1">WIND</div>
               <div className="text-[11px] font-mono font-bold">{vp.weather.wind}</div>
             </div>
             <div className="text-center border-x border-white/5">
               <div className="text-[8px] text-gray-600 font-bold mb-1">TEMP</div>
               <div className="text-[11px] font-mono font-bold">{vp.weather.temp}°C</div>
             </div>
             <div className="text-center">
               <div className="text-[8px] text-gray-600 font-bold mb-1">VISIB</div>
               <div className="text-[11px] font-mono font-bold">{vp.weather.visibility}</div>
             </div>
           </div>
        </div>

        {/* Stand Management */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Stand Real-time Occupancy</h3>
            <span className="text-[10px] font-mono text-[#00ff9d]">{vp.occupiedStands}/{vp.stands}</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {vp.standDetails.map((stand) => (
              <div key={stand.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-gray-500">{stand.id}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${stand.status === 'Occupied' ? 'bg-red-500' : stand.status === 'Maintenance' ? 'bg-yellow-500' : 'bg-[#00ff9d]'}`}></div>
                  <span className={`text-[11px] font-bold ${stand.status === 'Occupied' ? 'text-gray-300' : 'text-gray-500'}`}>
                    {stand.status === 'Occupied' ? 'Occupied' : stand.status === 'Maintenance' ? 'Under Maintenance' : 'Ready to Approach'}
                  </span>
                </div>
                {stand.assignedDrone && (
                  <span className="text-[9px] font-mono font-black text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/20">{stand.assignedDrone}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comms */}
        <div className="pt-2">
          <div className="text-[9px] font-mono text-gray-600 bg-black/40 p-3 rounded-lg border border-dashed border-white/10 text-center">
            PRI COMMS: <span className="text-[#00ff9d] font-bold">{vp.frequency}</span> | ATIS: 126.400
          </div>
        </div>
      </div>
    </div>
  );
};

export default VertiportDetail;
