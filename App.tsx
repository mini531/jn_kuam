
import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import SystemDashboard from './components/SystemDashboard';
import VertiportDetail from './components/VertiportDetail';
import { DroneFlight, FlightStatus, VisibilityState, LogEntry, Vertiport } from './types';
import { VERTIPORTS, ROUTES } from './constants';
import { generateMultiPointCurvedPath, getPointOnPath } from './utils';

const App: React.FC = () => {
  const [flights, setFlights] = useState<DroneFlight[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [visibility, setVisibility] = useState<VisibilityState>({
    vp: true,
    route: true,
    fix: true,
    nfz: true,
    weather: false,
    trails: true,
    sectors: false, // 초기값 OFF 유지
    wind: false
  });
  const [isDashOpen, setIsDashOpen] = useState(false);
  const [selectedVp, setSelectedVp] = useState<Vertiport | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [cameraCommand, setCameraCommand] = useState<{ pos: [number, number]; timestamp: number } | null>(null);
  
  const [weatherTime, setWeatherTime] = useState(0);
  const [mobilePanel, setMobilePanel] = useState<'NONE' | 'LEFT' | 'RIGHT'>('NONE');

  useEffect(() => {
    // 3개 루트에 대한 비행체 생성
    const initialFlights: DroneFlight[] = [
      {
        id: 'F-COAST-01', callSign: 'HL-A001', squawk: '1101', origin: 'Mokpo', destination: 'Yeosu',
        currentPos: ROUTES.COASTAL[0], altitude: 1500, speed: 185, battery: 95, status: FlightStatus.NORMAL,
        path: generateMultiPointCurvedPath(ROUTES.COASTAL), history: [], progress: 0
      },
      {
        id: 'F-URBAN-01', callSign: 'HL-B001', squawk: '2201', origin: 'Gwangyang', destination: 'Goheung',
        currentPos: ROUTES.URBAN_TOUR[0], altitude: 1200, speed: 145, battery: 88, status: FlightStatus.NORMAL,
        path: generateMultiPointCurvedPath(ROUTES.URBAN_TOUR), history: [], progress: 0.25
      },
      {
        id: 'F-ISLAND-01', callSign: 'HL-C001', squawk: '3301', origin: 'Mokpo', destination: 'Shinan-Circuit',
        currentPos: ROUTES.ISLAND[0], altitude: 1000, speed: 130, battery: 72, status: FlightStatus.NORMAL,
        path: generateMultiPointCurvedPath(ROUTES.ISLAND), history: [], progress: 0.1
      }
    ];
    setFlights(initialFlights);

    setLogs([
      { id: 'l1', time: '14:00:00', type: 'INFO', message: 'UAM Control Network Online', source: 'SYS' },
      { id: 'l2', time: '14:00:05', type: 'INFO', message: 'Route A (Coastal) Waypoint Sync Success', source: 'NAV' },
      { id: 'l3', time: '14:00:10', type: 'INFO', message: 'Route B (Urban) Traffic Flow Stable', source: 'ATC' },
      { id: 'l4', time: '14:00:15', type: 'INFO', message: 'Route C (Island) Medical Drone Departed', source: 'LOG' }
    ]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlights(prev => {
        return prev.map(f => {
          const nextProgress = (f.progress + 0.0004) % 1;
          const nextPos = getPointOnPath(f.path, nextProgress);
          const nextHistory = [...f.history.slice(-29), nextPos];
          return {
            ...f,
            progress: nextProgress,
            currentPos: nextPos,
            history: nextHistory,
            battery: Math.max(0, f.battery - 0.002),
            altitude: f.altitude + (Math.random() - 0.5) * 1.0
          };
        });
      });
      setCurrentTime(new Date());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleTargetSelect = (pos: [number, number], vp?: Vertiport) => {
    setCameraCommand({ pos, timestamp: Date.now() });
    if (vp) setSelectedVp(vp);
    else setSelectedVp(null);
  };

  return (
    <div className="relative w-screen h-screen bg-[#080a0c] overflow-hidden text-[#eef2f5] font-sans">
      <header className="absolute top-0 left-0 right-0 h-[60px] bg-[#0b1014]/95 border-b border-white/5 z-[2001] flex items-center justify-between px-4 md:px-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={() => setMobilePanel(mobilePanel === 'LEFT' ? 'NONE' : 'LEFT')} className="md:hidden w-10 h-10 flex items-center justify-center text-[#00ff9d] bg-white/5 rounded-lg active:scale-95 border border-white/5">
            <i className="bi bi-list"></i>
          </button>
          <div className="text-xl md:text-2xl font-black text-[#00ff9d] italic tracking-tighter flex items-center">
            K-UAM ATC <span className="hidden sm:inline text-gray-500 font-light text-[10px] tracking-[0.3em] uppercase ml-3 border-l border-white/10 pl-3">OPERATIONS</span>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="text-right leading-none">
            <div className="text-sm md:text-lg font-mono font-bold text-[#00ff9d]">{currentTime.toLocaleTimeString('ko-KR', { hour12: false })}</div>
            <div className="text-[7px] text-gray-600 font-black uppercase tracking-widest mt-1 hidden sm:block">LOCAL MISSION TIME</div>
          </div>
          <button onClick={() => setMobilePanel(mobilePanel === 'RIGHT' ? 'NONE' : 'RIGHT')} className="md:hidden w-10 h-10 flex items-center justify-center text-[#60a5fa] bg-white/5 rounded-lg active:scale-95 border border-white/5">
            <i className="bi bi-layers-half"></i>
          </button>
        </div>
      </header>

      <div className="absolute inset-0 top-[60px] flex justify-between pointer-events-none z-[1000]">
        <div className={`absolute md:relative inset-y-0 left-0 w-full md:w-auto h-full pointer-events-none transition-transform duration-300 ease-out z-[1002] md:z-auto ${mobilePanel === 'LEFT' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <SidebarLeft 
            vertiports={VERTIPORTS} 
            flights={flights} 
            logs={logs} 
            onOpenDashboard={() => { setIsDashOpen(true); setMobilePanel('NONE'); }} 
            onTargetSelect={handleTargetSelect} 
          />
        </div>
        <div className={`absolute md:relative inset-y-0 right-0 w-full md:w-auto h-full pointer-events-none transition-transform duration-300 ease-out z-[1002] md:z-auto ${mobilePanel === 'RIGHT' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
          <SidebarRight visibility={visibility} setVisibility={setVisibility} onTargetSelect={(pos) => handleTargetSelect(pos)} />
        </div>
      </div>

      <MapComponent 
        flights={flights} 
        visibility={visibility} 
        onDroneClick={(id) => { 
          const f = flights.find(x => x.id === id); 
          if (f) handleTargetSelect(f.currentPos);
        }} 
        onVertiportClick={(vp) => handleTargetSelect([vp.lat, vp.lng], vp)}
        cameraCommand={cameraCommand} 
        weatherTimeOffset={weatherTime} 
      />
      
      <VertiportDetail vp={selectedVp} onClose={() => setSelectedVp(null)} />

      {visibility.weather && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1001] px-6 py-4 bg-[#0b1014]/90 backdrop-blur-xl border border-white/10 rounded-2xl w-[90%] md:w-[450px] pointer-events-auto shadow-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-[#00ff9d] tracking-widest uppercase">WEATHER PREDICTION (T+{weatherTime}m)</span>
            <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">Sector Jeolla</span>
          </div>
          <input type="range" min="0" max="120" step="5" value={weatherTime} onChange={(e) => setWeatherTime(parseInt(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#00ff9d] hover:accent-green-400" />
          <div className="flex justify-between text-[7px] text-gray-600 mt-2 font-black tracking-widest uppercase">
            <span>LIVE</span>
            <span className="text-[#00ff9d]">PROJECTION</span>
            <span>+120M</span>
          </div>
        </div>
      )}

      <SystemDashboard isOpen={isDashOpen} onClose={() => setIsDashOpen(false)} />
    </div>
  );
};

export default App;
