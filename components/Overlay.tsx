
import React from 'react';

const Overlay: React.FC = () => {
  return (
    <>
      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] h-8 bg-black/90 border-t border-white/10 flex items-center justify-between px-4 text-[10px] text-gray-400 font-mono">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> SYSTEM NOMINAL</span>
          <span>LAT: 34.816 | LNG: 126.891</span>
          <span>ZONE: ROK-JEOLLANAMDO</span>
        </div>
        <div className="flex gap-4">
          <span>K-UAM INTEGRATED CONTROL v2.4.0</span>
          <span>{new Date().toISOString()}</span>
        </div>
      </div>

      {/* Weather Radar Legend */}
      <div className="absolute bottom-12 right-4 z-[1000] p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-[10px]">
        <div className="font-bold text-gray-300 mb-2 flex items-center gap-2">
          <i className="bi bi-cloud-rain"></i> PRECIPITATION RADAR
        </div>
        <div className="flex items-center gap-2">
          <span>0</span>
          <div className="w-32 h-2 bg-gradient-to-r from-blue-900/40 via-green-500 to-red-600 rounded" />
          <span>50+ mm/h</span>
        </div>
      </div>
    </>
  );
};

export default Overlay;
