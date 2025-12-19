
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { DroneFlight, VisibilityState, FlightStatus, Vertiport } from '../types';
import { JEOLLANAMDO_CENTER, VERTIPORTS, NO_FLY_ZONES, DRONE_COLORS, WAYPOINTS, DETAILED_SECTORS } from '../constants';

interface MapComponentProps {
  flights: DroneFlight[];
  visibility: VisibilityState;
  onDroneClick: (id: string) => void;
  onVertiportClick: (vp: Vertiport) => void;
  cameraCommand: { pos: [number, number]; timestamp: number } | null;
  weatherTimeOffset: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  flights, 
  visibility, 
  onDroneClick, 
  onVertiportClick,
  cameraCommand, 
  weatherTimeOffset 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routesRef = useRef<Record<string, L.Polyline>>({});
  const trailsRef = useRef<Record<string, L.Polyline>>({});
  const layerGroupsRef = useRef<Record<string, L.LayerGroup>>({});
  const radarLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: JEOLLANAMDO_CENTER,
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(mapRef.current);
      
      layerGroupsRef.current = {
        vp: L.layerGroup().addTo(mapRef.current),
        nfz: L.layerGroup().addTo(mapRef.current),
        route: L.layerGroup().addTo(mapRef.current),
        wp: L.layerGroup().addTo(mapRef.current),
        sectors: L.layerGroup().addTo(mapRef.current),
        trails: L.layerGroup().addTo(mapRef.current),
      };

      // Waypoints
      WAYPOINTS.forEach(wp => {
        L.circleMarker([wp.lat, wp.lng], {
          radius: 2,
          color: 'rgba(255,255,255,0.6)',
          weight: 1,
          fillOpacity: 0.8
        }).bindTooltip(wp.name, { permanent: true, direction: 'bottom', className: 'wp-label' })
          .addTo(layerGroupsRef.current.wp);
      });

      // FIR Sectors Rendering
      DETAILED_SECTORS.forEach(sec => {
        const poly = L.polygon(sec.path as any, {
          color: (sec as any).isMainBoundary ? '#ff4757' : sec.color,
          weight: (sec as any).isMainBoundary ? 3.5 : 1.5,
          fill: false,
          opacity: 0.9,
          dashArray: (sec as any).isMainBoundary ? '12, 12' : ((sec as any).isDashed ? '6, 10' : '')
        }).addTo(layerGroupsRef.current.sectors);

        poly.bindTooltip(sec.name, {
          permanent: true,
          direction: 'center',
          className: 'sector-label-overlay',
          offset: [0, 0]
        });
      });

      // Vertiports
      VERTIPORTS.forEach(vp => {
        const icon = L.divIcon({
          className: 'custom-vp-marker',
          html: `<div class="relative flex items-center justify-center cursor-pointer">
                  <div class="absolute w-6 h-6 bg-[#00ff9d]/10 rounded-full animate-ping"></div>
                  <div class="w-4 h-4 rounded-full border border-[#00ff9d] bg-black flex items-center justify-center text-[7px] font-black text-[#00ff9d]">H</div>
                </div>`,
          iconSize: [20, 20]
        });
        L.marker([vp.lat, vp.lng], { icon })
          .on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            onVertiportClick(vp);
          })
          .addTo(layerGroupsRef.current.vp);
      });

      // No Fly Zones
      NO_FLY_ZONES.forEach(zone => {
        L.circle([zone.lat, zone.lng], {
          radius: zone.radius,
          color: '#ff4757',
          weight: 1,
          fillOpacity: 0.03,
          dashArray: '5, 5'
        }).addTo(layerGroupsRef.current.nfz);
      });

      // Radar Layer
      const RadarLayer = L.Layer.extend({
        onAdd: function(map: L.Map) {
          this._canvas = L.DomUtil.create('canvas', 'radar-canvas');
          this._canvas.style.position = 'absolute';
          this._canvas.style.pointerEvents = 'none';
          this._canvas.style.zIndex = '400';
          this._canvas.style.opacity = '0.6';
          map.getPanes().overlayPane.appendChild(this._canvas);
          map.on('move moveend zoom zoomend', this._reset, this);
          this._reset();
          this._draw();
        },
        _reset: function() {
          const topLeft = mapRef.current!.containerPointToLayerPoint([0, 0]);
          L.DomUtil.setPosition(this._canvas, topLeft);
          const size = mapRef.current!.getSize();
          this._canvas.width = size.x;
          this._canvas.height = size.y;
        },
        _draw: function() {
          const ctx = this._canvas.getContext('2d');
          const stormSystems = [
            { base: [34.7, 127.3], vector: [0.003, 0.001], spin: 0.2, blobs: [[0,0,1.2], [0.04,0.02,0.8]], intensity: 1.0 },
            { base: [34.4, 126.8], vector: [0.002, 0.004], spin: -0.1, blobs: [[0,0,1.5], [-0.05,-0.03,0.7]], intensity: 0.8 }
          ];
          const animate = () => {
            if (!this._canvas || !mapRef.current) return;
            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
            if (!this._visible) { requestAnimationFrame(animate); return; }
            const tOffset = this._timeOffset || 0;
            stormSystems.forEach(sys => {
              sys.blobs.forEach(([dx, dy, rMult]) => {
                const angle = (tOffset * 0.005) * sys.spin;
                const rotX = dx * Math.cos(angle) - dy * Math.sin(angle);
                const rotY = dx * Math.sin(angle) + dy * Math.cos(angle);
                const lat = sys.base[0] + (sys.vector[0] * tOffset * 0.05) + rotX;
                const lng = sys.base[1] + (sys.vector[1] * tOffset * 0.05) + rotY;
                const p = mapRef.current!.latLngToContainerPoint([lat, lng]);
                const radius = 70 * rMult * Math.pow(1.1, mapRef.current!.getZoom() - 9);
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
                grad.addColorStop(0, `rgba(255, 0, 80, ${0.4 * sys.intensity})`);
                grad.addColorStop(0.5, `rgba(0, 255, 150, ${0.2 * sys.intensity})`);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
              });
            });
            requestAnimationFrame(animate);
          };
          animate();
        },
        setVisible: function(v: boolean) { this._visible = v; if(this._canvas) this._canvas.style.display = v ? 'block' : 'none'; },
        setTimeOffset: function(t: number) { this._timeOffset = t; }
      });
      radarLayerRef.current = new (RadarLayer as any)();
      (radarLayerRef.current as any).setVisible(visibility.weather);
      radarLayerRef.current?.addTo(mapRef.current!);
    }
  }, [onVertiportClick]);

  useEffect(() => {
    if (mapRef.current && cameraCommand) {
      mapRef.current.flyTo(cameraCommand.pos, 12, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [cameraCommand]);

  useEffect(() => {
    if (!mapRef.current) return;
    Object.entries(visibility).forEach(([key, visible]) => {
      const group = layerGroupsRef.current[key];
      if (group) visible ? mapRef.current?.addLayer(group) : mapRef.current?.removeLayer(group);
    });
    if (radarLayerRef.current) {
      (radarLayerRef.current as any).setVisible(visibility.weather);
      (radarLayerRef.current as any).setTimeOffset(weatherTimeOffset);
    }
  }, [visibility, weatherTimeOffset]);

  useEffect(() => {
    if (!mapRef.current) return;

    flights.forEach(f => {
      const color = DRONE_COLORS[f.status];
      
      if (visibility.route) {
        if (!routesRef.current[f.id]) {
          routesRef.current[f.id] = L.polyline(f.path, {
            color: color,
            weight: 2,
            opacity: 0.4,
            dashArray: '5, 10',
            className: 'route-line'
          }).addTo(layerGroupsRef.current.route);
        } else {
          routesRef.current[f.id].setStyle({ color: color });
        }
      } else if (routesRef.current[f.id]) {
        layerGroupsRef.current.route.removeLayer(routesRef.current[f.id]);
        delete routesRef.current[f.id];
      }

      const idx = Math.floor(f.progress * (f.path.length - 1));
      const nextIdx = Math.min(idx + 1, f.path.length - 1);
      const p1 = f.path[idx];
      const p2 = f.path[nextIdx];
      
      // 기체 비행 방향 계산 (Bearing)
      // Math.atan2(lng_diff, lat_diff)는 북쪽 기준(0도) 시계방향 각도를 반환함
      // SVG 아이콘이 위쪽(North)을 바라보게 그려져 있으므로 별도의 오프셋 없이 적용
      let angle = 0;
      if (p2[0] !== p1[0] || p2[1] !== p1[1]) {
        angle = (Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI);
      }

      // 유인 UAM (eVTOL) 스타일 아이콘 디자인
      const droneHtml = `
        <div style="transform: rotate(${angle}deg); transition: transform 0.1s linear;">
          <svg viewBox="0 0 100 100" width="54" height="54" style="filter: drop-shadow(0 0 8px ${color});">
            <!-- 기체 날개/암 구조 -->
            <path d="M15 45 L85 45 M25 70 L75 70" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
            <path d="M50 30 L15 45 M50 30 L85 45 M50 80 L25 70 M50 80 L75 70" stroke="${color}" stroke-width="1.5" opacity="0.3"/>
            
            <!-- 캐빈 (Fuselage) -->
            <path d="M40 30 C40 20, 60 20, 60 30 L60 75 C60 85, 40 85, 40 75 Z" fill="#080a0c" stroke="${color}" stroke-width="3"/>
            <!-- 윈드쉴드 (조종석 부분 - 위쪽이 전면임이 명확하도록 강조) -->
            <path d="M43 32 C43 28, 57 28, 57 32 L57 48 C57 52, 43 52, 43 48 Z" fill="${color}" fill-opacity="0.5"/>
            <!-- 꼬리 핀 (방향성 강조) -->
            <path d="M50 75 L50 88" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>

            <!-- 4개 로터 (Spinning Props) -->
            <g class="prop-spin" style="transform-origin: 15px 45px;"><rect x="5" y="43" width="20" height="4" fill="white" opacity="0.7" rx="2"/></g>
            <g class="prop-spin" style="transform-origin: 85px 45px;"><rect x="75" y="43" width="20" height="4" fill="white" opacity="0.7" rx="2"/></g>
            <g class="prop-spin" style="transform-origin: 25px 70px;"><rect x="15" y="68" width="20" height="4" fill="white" opacity="0.7" rx="2"/></g>
            <g class="prop-spin" style="transform-origin: 75px 70px;"><rect x="65" y="68" width="20" height="4" fill="white" opacity="0.7" rx="2"/></g>
            
            ${f.status === FlightStatus.CONFLICT ? '<circle cx="50" cy="50" r="42" fill="none" stroke="#ff00ff" stroke-width="2.5" class="animate-ping" />' : ''}
          </svg>
        </div>
      `;

      const icon = L.divIcon({
        className: 'drone-container',
        html: droneHtml,
        iconSize: [54, 54],
        iconAnchor: [27, 27]
      });

      if (markersRef.current[f.id]) {
        markersRef.current[f.id].setLatLng(f.currentPos).setIcon(icon);
      } else {
        markersRef.current[f.id] = L.marker(f.currentPos, { icon })
          .addTo(mapRef.current!)
          .on('click', () => onDroneClick(f.id));
      }

      if (visibility.trails) {
        if (trailsRef.current[f.id]) {
          trailsRef.current[f.id].setLatLngs(f.history);
        } else {
          trailsRef.current[f.id] = L.polyline(f.history, {
            color: color,
            weight: 1.5,
            opacity: 0.3,
            dashArray: '2, 5'
          }).addTo(layerGroupsRef.current.trails);
        }
      } else if (trailsRef.current[f.id]) {
        layerGroupsRef.current.trails.removeLayer(trailsRef.current[f.id]);
        delete trailsRef.current[f.id];
      }
    });
  }, [flights, visibility.route, visibility.trails]);

  return <div id="map" className="absolute inset-0 z-0 bg-[#05080a]" />;
};

export default MapComponent;
