
import React from 'react';
import { Vertiport, DroneFlight, FlightStatus } from '../types';
import { VERTIPORTS, DRONE_COLORS } from '../constants';

interface SidebarProps {
  flights: DroneFlight[];
  activeFlightId: string | null;
  onSelectFlight: (id: string) => void;
  weatherData?: {
    summary?: string;
    temperature?: string;
    wind?: string;
    rain?: string;
    sources?: any[];
  };
  isLoadingWeather?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  flights, 
  activeFlightId, 
  onSelectFlight, 
  weatherData,
  isLoadingWeather 
}) => {
  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-4 w-80 h-[calc(100vh-2rem)] overflow-hidden pointer-events-none">
      {/* Real-time Weather Briefing Card */}
      <div className="bg-[#111827]/80 backdrop-blur-md border border-white/10 p-4 pointer-events-auto rounded-lg shadow-2xl">
        <h2 className="text-sm font-bold text-[#fbbf24] mb-3 flex items-center gap-2">
          <i className="bi bi-cloud-sun"></i> REAL-TIME WEATHER
        </h2>
        {isLoadingWeather ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-3 bg-white/10 rounded w-1/2"></div>
            <div className="h-3 bg-white/10 rounded w-5/6"></div>
          </div>
        ) : weatherData ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">{weatherData.temperature || '--°C'}</span>
              <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">Wind Speed</div>
                <div className="text-xs font-mono">{weatherData.wind || '-- m/s'}</div>
              </div>
            </div>
            <div className="text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-2 italic">
              {weatherData.summary || "Weather briefing unavailable."}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="text-[8px] text-gray-500 uppercase">Precipitation</div>
                <div className="text-[10px] font-bold">{weatherData.rain || '0.0 mm/h'}</div>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="text-[8px] text-gray-500 uppercase">Flight Safety</div>
                <div className="text-[10px] font-bold text-green-400">OPTIMAL</div>
              </div>
            </div>
            {weatherData.sources && weatherData.sources.length > 0 && (
              <div className="mt-2 text-[8px] text-gray-500 truncate">
                Source: <a href={weatherData.sources[0].web?.uri} target="_blank" className="hover:text-blue-400 underline">{weatherData.sources[0].web?.title || 'Google Search'}</a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-500 italic">No weather data loaded.</div>
        )}
      </div>

      {/* Vertiport Status Card */}
      <div className="bg-[#111827]/80 backdrop-blur-md border border-white/10 p-4 pointer-events-auto rounded-lg shadow-2xl">
        <h2 className="text-sm font-bold text-[#60a5fa] mb-3 flex items-center gap-2">
          <i className="bi bi-buildings"></i> VERTIPORT STATUS
        </h2>
        <div className="space-y-2 overflow-y-auto max-h-[20vh] pr-1">
          {VERTIPORTS.map(vp => (
            <div key={vp.id} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div>
                <div className="text-xs font-bold">{vp.name}</div>
                <div className="text-[10px] text-gray-400">STANDS: {vp.occupiedStands}/{vp.stands}</div>
              </div>
              {/* Corrected comparison values to match 'Active' | 'Busy' | 'Standby' | 'Maintenance' */}
              <div className={`w-2 h-2 rounded-full ${vp.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : vp.status === 'Busy' ? 'bg-yellow-500' : 'bg-red-500'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Flight Plans Card */}
      <div className="bg-[#111827]/80 backdrop-blur-md border border-white/10 p-4 pointer-events-auto flex-1 flex flex-col rounded-lg shadow-2xl min-h-0">
        <h2 className="text-sm font-bold text-[#60a5fa] mb-3 flex items-center gap-2">
          <i className="bi bi-geo-alt"></i> ACTIVE FLIGHT PLANS
        </h2>
        <div className="space-y-3 overflow-y-auto flex-1 pr-1">
          {flights.map(flight => (
            <div 
              key={flight.id} 
              onClick={() => onSelectFlight(flight.id)}
              className={`p-3 bg-white/5 rounded border transition-all cursor-pointer ${activeFlightId === flight.id ? 'border-[#60a5fa] bg-[#60a5fa]/10' : 'border-white/5 hover:border-white/20'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black tracking-wider" style={{ color: DRONE_COLORS[flight.status] }}>{flight.callSign}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/40 rounded border border-white/10 text-gray-300">{flight.status}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-gray-400">{flight.origin}</span>
                <div className="h-[1px] flex-1 bg-white/10 relative">
                  <div className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 rounded" style={{ width: `${flight.progress * 100}%` }} />
                </div>
                <span className="text-[10px] font-bold text-gray-400">{flight.destination}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-500">ALT</span>
                  <span className="text-[10px]">{flight.altitude.toFixed(0)}ft</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-500">SPD</span>
                  <span className="text-[10px]">{flight.speed.toFixed(0)}km/h</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-500">BATT</span>
                  <span className="text-[10px]" style={{ color: flight.battery < 20 ? '#ef4444' : '#fff' }}>{flight.battery.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
