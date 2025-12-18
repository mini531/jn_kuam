
import React, { useEffect, useState, useMemo } from 'react';

interface SystemNode {
  id: string;
  name: string;
  layer: 'CORE' | 'GATEWAY' | 'LOGIC' | 'EDGE';
  status: 'ONLINE' | 'BUSY' | 'WARN' | 'OFFLINE';
  load: number;
  uptime: string;
  description: string;
  subModules: string[];
  connections: string[];
  pos: { x: number; y: number };
}

const SYSTEM_NODES: SystemNode[] = [
  { 
    id: 'kernel-01', name: 'CORE KERNEL', layer: 'CORE', status: 'ONLINE', load: 12, uptime: '45d 12h',
    description: '전체 시스템의 리소스 분배 및 프로세스 스케줄링을 담당하는 최상위 커널 모듈입니다.',
    subModules: ['Auth-Service', 'Event-Bus', 'Kernel-Monitor'],
    connections: ['gtw-01', 'atc-logic-01', 'conf-res-01'],
    pos: { x: 400, y: 80 }
  },
  { 
    id: 'gtw-01', name: 'COMM GATEWAY', layer: 'GATEWAY', status: 'ONLINE', load: 45, uptime: '12d 04h',
    description: '버티포트 및 기체와의 암호화된 통신 링크를 관리하며 데이터 패킷 유효성을 검사합니다.',
    subModules: ['U-Sync-v4', 'Packet-Filter', 'SSL-Terminator'],
    connections: ['kernel-01', 'edge-gh-01', 'edge-ys-01'],
    pos: { x: 200, y: 200 }
  },
  { 
    id: 'atc-logic-01', name: 'ATC LOGIC HUB', layer: 'LOGIC', status: 'BUSY', load: 78, uptime: '08d 21h',
    description: '비행 경로 최적화 및 항로 분리 간격을 계산하는 실시간 관제 연산 엔진입니다.',
    subModules: ['Route-Optimizer', 'Traffic-Separator', 'Flow-Manager'],
    connections: ['kernel-01', 'conf-res-01'],
    pos: { x: 400, y: 220 }
  },
  { 
    id: 'conf-res-01', name: 'CONFLICT RESOLVER', layer: 'LOGIC', status: 'ONLINE', load: 32, uptime: '124d 18h',
    description: '기체 간 잠재적 충돌 위험을 탐지하고 회피 기동 시나리오를 자동 생성합니다.',
    subModules: ['Proximity-Sensor', 'Evasive-Engine', 'Safe-Buffer-v2'],
    connections: ['kernel-01', 'atc-logic-01'],
    pos: { x: 600, y: 200 }
  },
  { 
    id: 'edge-gh-01', name: 'EDGE-GOHEUNG', layer: 'EDGE', status: 'ONLINE', load: 22, uptime: '02d 11h',
    description: '고흥 지역 버티포트의 센서 데이터 및 기상 정보를 수집하는 현장 엣지 노드입니다.',
    subModules: ['Sensor-Aggregator', 'Local-Weather-Sync', 'Pad-Camera-Stream'],
    connections: ['gtw-01'],
    pos: { x: 100, y: 350 }
  },
  { 
    id: 'edge-ys-01', name: 'EDGE-YEOSU', layer: 'EDGE', status: 'WARN', load: 56, uptime: '01d 08h',
    description: '여수 국가산단 및 엑스포 지역의 비행 승인 요청을 처리하는 현장 엣지 노드입니다.',
    subModules: ['Industrial-Zone-Monitor', 'Expo-Heliport-Link'],
    connections: ['gtw-01'],
    pos: { x: 300, y: 350 }
  }
];

interface SystemDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const SystemDashboard: React.FC<SystemDashboardProps> = ({ isOpen, onClose }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('kernel-01');
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setPulse(p => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, [isOpen]);

  const activeNode = useMemo(() => 
    SYSTEM_NODES.find(n => n.id === selectedNodeId) || SYSTEM_NODES[0]
  , [selectedNodeId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4">
      <div className="bg-[#0b1013] border border-white/10 w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl rounded-3xl overflow-hidden border-t-[#00ff9d]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#131a20]/50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00ff9d 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="flex items-center gap-4 relative">
            <div className="w-10 h-10 bg-[#00ff9d]/10 rounded-xl border border-[#00ff9d]/30 flex items-center justify-center">
              <i className="bi bi-cpu text-[#00ff9d] text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">UOCC Infrastructure <span className="text-gray-600 text-sm not-italic ml-2">v4.2.0-stable</span></h2>
              <div className="flex gap-4 mt-1">
                <span className="text-[9px] text-[#00ff9d] font-black tracking-widest uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#00ff9d] rounded-full animate-pulse"></span> Network Active
                </span>
                <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Encryption: AES-256-GCM</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-all text-white border border-white/10 active:scale-90 relative z-10">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Topology View */}
          <div className="flex-1 bg-black/40 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Topology Diagram</span>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00ff9d] rounded-full"></div>
                  <span className="text-[8px] text-gray-500 font-bold">STABLE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-[8px] text-gray-500 font-bold">HEAVY LOAD</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative cursor-grab active:cursor-grabbing">
              <svg className="w-full h-full" viewBox="0 0 800 500">
                {/* Connections with animations */}
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="10" refX="25" refY="5" orientation="auto">
                    <path d="M0,0 L0,10 L10,5 Z" fill="rgba(255,255,255,0.2)" />
                  </marker>
                  <filter id="node-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {SYSTEM_NODES.map(node => (
                  node.connections.map(targetId => {
                    const target = SYSTEM_NODES.find(n => n.id === targetId);
                    if (!target) return null;
                    return (
                      <g key={`${node.id}-${targetId}`}>
                        <line 
                          x1={node.pos.x} y1={node.pos.y} 
                          x2={target.pos.x} y2={target.pos.y} 
                          stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                        {/* Data pulse animation */}
                        <circle r="2" fill="#00ff9d" opacity="0.6">
                          <animateMotion 
                            dur={`${1 + Math.random() * 2}s`} 
                            repeatCount="indefinite" 
                            path={`M${node.pos.x},${node.pos.y} L${target.pos.x},${target.pos.y}`} 
                          />
                        </circle>
                      </g>
                    );
                  })
                ))}

                {/* Nodes */}
                {SYSTEM_NODES.map(node => (
                  <g 
                    key={node.id} 
                    className="cursor-pointer transition-all hover:opacity-80"
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    <rect 
                      x={node.pos.x - 60} y={node.pos.y - 25} 
                      width="120" height="50" rx="8" 
                      fill={selectedNodeId === node.id ? '#131a20' : '#0b1013'} 
                      stroke={selectedNodeId === node.id ? '#00ff9d' : 'rgba(255,255,255,0.1)'}
                      strokeWidth={selectedNodeId === node.id ? '2' : '1'}
                      style={selectedNodeId === node.id ? { filter: 'url(#node-glow)' } : {}}
                    />
                    <text 
                      x={node.pos.x} y={node.pos.y - 5} 
                      textAnchor="middle" 
                      fill={selectedNodeId === node.id ? '#00ff9d' : '#eef2f5'} 
                      fontSize="9" fontWeight="900" 
                      className="uppercase tracking-tighter"
                    >
                      {node.name}
                    </text>
                    <text 
                      x={node.pos.x} y={node.pos.y + 12} 
                      textAnchor="middle" 
                      fill={node.status === 'WARN' ? '#fbbf24' : node.status === 'BUSY' ? '#60a5fa' : '#4ade80'} 
                      fontSize="7" fontWeight="bold"
                    >
                      {node.status} {node.load}%
                    </text>
                    {/* Status indicator dot */}
                    <circle 
                      cx={node.pos.x + 45} cy={node.pos.y - 12} r="3" 
                      fill={node.status === 'WARN' ? '#fbbf24' : node.status === 'BUSY' ? '#60a5fa' : '#4ade80'}
                      className={node.status !== 'ONLINE' ? 'animate-pulse' : ''}
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Live Terminal Log */}
            <div className="h-40 border-t border-white/5 bg-black/60 p-4 font-mono text-[9px] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-2 text-gray-500 uppercase tracking-widest font-black">
                <span>Infrastructure Log Stream</span>
                <span className="text-[#00ff9d]">LIVE_CAPTURE</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-gray-500">[ {new Date().toISOString()} ] <span className="text-cyan-400">DEBUG</span>: Global heart-beat sync successful across {SYSTEM_NODES.length} nodes.</div>
                <div className="text-gray-500">[ {new Date().toISOString()} ] <span className="text-yellow-500">WARN</span>: {SYSTEM_NODES.find(n => n.status === 'WARN')?.name} reporting high IO-wait.</div>
                <div className="text-gray-500">[ {new Date().toISOString()} ] <span className="text-green-500">INFO</span>: Encrypted tunnel established with Vertiport VP-GH-01.</div>
                <div className="text-gray-500 animate-pulse">_</div>
              </div>
            </div>
          </div>

          {/* Right: Detailed Node Analysis */}
          <div className="w-[400px] border-l border-white/5 bg-[#0f1419]/80 backdrop-blur-xl p-6 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
              <div className="text-[10px] font-black text-[#00ff9d] uppercase tracking-[0.2em] mb-2 italic">Node Properties</div>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-4">{activeNode.name}</h3>
              <p className="text-xs text-gray-400 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                {activeNode.description}
              </p>
            </div>

            <div className="space-y-6">
              {/* Resource Meter */}
              <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Load Analysis</span>
                  <span className={`text-xl font-mono font-black ${activeNode.load > 70 ? 'text-yellow-500' : 'text-[#00ff9d]'}`}>{activeNode.load}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${activeNode.load > 70 ? 'bg-yellow-500' : 'bg-[#00ff9d]'}`}
                    style={{ width: `${activeNode.load}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-[8px] text-gray-600 font-black uppercase tracking-widest">
                  <span>Idle</span>
                  <span>Critical</span>
                </div>
              </div>

              {/* Sub-processes */}
              <div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex justify-between">
                  <span>Active Sub-Modules</span>
                  <span className="text-cyan-400">{activeNode.subModules.length} Processed</span>
                </div>
                <div className="space-y-2">
                  {activeNode.subModules.map((mod, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-[#00ff9d]/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9d]"></div>
                        <span className="text-[11px] font-bold text-gray-300">{mod}</span>
                      </div>
                      <span className="text-[9px] font-mono text-gray-500">PID:{1000 + i * 154}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-[8px] text-gray-600 font-black uppercase mb-1">UPTIME</div>
                  <div className="text-sm font-mono font-black text-white">{activeNode.uptime}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-[8px] text-gray-600 font-black uppercase mb-1">LATENCY</div>
                  <div className="text-sm font-mono font-black text-[#00ff9d]">{12 + (activeNode.load / 10).toFixed(1)}ms</div>
                </div>
              </div>

              {/* Connected Targets */}
              <div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Linked Infrastructure</div>
                <div className="flex flex-wrap gap-2">
                  {activeNode.connections.map(connId => {
                    const conn = SYSTEM_NODES.find(n => n.id === connId);
                    return (
                      <button 
                        key={connId} 
                        onClick={() => setSelectedNodeId(connId)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-[#00ff9d] transition-all"
                      >
                        {conn?.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDashboard;
