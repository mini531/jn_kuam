
import { Vertiport, FlightStatus } from './types';

export const JEOLLANAMDO_CENTER: [number, number] = [34.75, 126.9];

// --- 3대 주요 UAM 항로 정의 (Waypoints) ---
export const ROUTES = {
  COASTAL: [
    [34.811, 126.392], // 목포항
    [34.482, 126.262], // 진도대교
    [34.312, 126.755], // 완도항
    [34.600, 127.202], // 고흥 항공센터
    [34.745, 127.747]  // 여수 엑스포
  ] as [number, number][],
  URBAN_TOUR: [
    [34.942, 127.691], // 광양
    [34.951, 127.481], // 순천
    [34.842, 127.617], // 여수 공항
    [34.600, 127.202]  // 고흥 항공센터
  ] as [number, number][],
  ISLAND: [
    [34.811, 126.392], // 목포항
    [34.750, 126.130], // 신안 안좌도
    [34.872, 126.052], // 자은도
    [34.721, 125.922], // 비금도
    [34.811, 126.392]  // 목포항 리턴
  ] as [number, number][]
};

/**
 * 이미지 기반 대한민국 관제 섹터 정밀 데이터 (Border Only)
 */
export const DETAILED_SECTORS = [
  // --- INCHEON ACC (Green Group: 서측) ---
  { 
    name: '서해북부', id: 'ICH-NW', color: '#4ade80', 
    path: [[38.5, 124.0], [38.5, 126.3], [37.7, 126.3], [37.7, 125.5], [37.0, 125.0], [37.0, 124.0]] 
  },
  { 
    name: '서해남부', id: 'ICH-SW', color: '#4ade80', 
    path: [[37.0, 124.0], [37.0, 125.0], [37.0, 126.5], [36.2, 126.5], [36.2, 124.0]] 
  },
  { 
    name: '군산서부', id: 'ICH-GW', color: '#4ade80', 
    path: [[36.2, 124.0], [36.2, 126.5], [35.2, 126.5], [35.2, 124.0]] 
  },
  { 
    name: '광주서부', id: 'ICH-GJW', color: '#4ade80', 
    path: [[35.2, 124.0], [35.2, 126.5], [34.2, 126.5], [34.2, 124.0]] 
  },
  { 
    name: '제주북부', id: 'ICH-JJN', color: '#4ade80', 
    path: [[34.2, 124.0], [34.2, 127.3], [33.3, 127.3], [33.3, 124.0]] 
  },
  { 
    name: '제주남부', id: 'ICH-JJS', color: '#4ade80', 
    path: [[33.3, 124.0], [33.3, 127.3], [31.0, 127.3], [31.0, 124.0]], 
    isDashed: true 
  },

  // --- TRANSITION ZONE (Red Main Boundary: 중앙 지그재그 경계) ---
  { 
    name: '군산동부', id: 'TR-GE', color: '#ff4757', 
    path: [[37.3, 126.5], [37.3, 127.5], [36.5, 127.8], [35.8, 127.5], [35.8, 126.5]], 
    isMainBoundary: true 
  },
  { 
    name: '광주동부', id: 'TR-GJE', color: '#ff4757', 
    path: [[35.8, 126.5], [35.8, 127.5], [35.0, 127.8], [34.2, 127.3], [34.2, 126.5]], 
    isMainBoundary: true 
  },
  { 
    name: '남해', id: 'TR-NH', color: '#60a5fa', 
    path: [[34.2, 127.3], [34.8, 127.3], [34.8, 128.5], [33.8, 129.0], [33.8, 127.3]] 
  },

  // --- DAEGU ACC (Blue Group: 동측) ---
  { 
    name: '강릉', id: 'DGU-GN', color: '#60a5fa', 
    path: [[38.5, 126.3], [38.5, 129.0], [37.5, 129.0], [37.5, 127.8], [37.3, 127.5], [37.3, 126.3]] 
  },
  { 
    name: '동해', id: 'DGU-EH', color: '#60a5fa', 
    path: [[38.5, 129.0], [38.5, 131.5], [36.5, 131.5], [36.5, 129.0]] 
  },
  { 
    name: '포항', id: 'DGU-PH', color: '#60a5fa', 
    path: [[37.5, 127.8], [37.5, 129.0], [36.3, 130.0], [36.3, 128.5], [36.5, 127.8]] 
  },
  { 
    name: '대구', id: 'DGU-DG', color: '#60a5fa', 
    path: [[36.5, 127.8], [36.3, 130.0], [34.8, 129.5], [34.8, 128.5], [35.8, 127.5]] 
  }
];

export const WAYPOINTS = [
  { name: 'MOKPO-HARBOR', lat: 34.811, lng: 126.392 },
  { name: 'JINDO-BRIDGE', lat: 34.482, lng: 126.262 },
  { name: 'WANDO-PORT', lat: 34.312, lng: 126.755 },
  { name: 'SUNCHEON-GARDEN', lat: 34.951, lng: 127.481 },
  { name: 'GWANGYANG-IND', lat: 34.942, lng: 127.691 }
];

export const VERTIPORTS: Vertiport[] = [
  { 
    id: 'VP-GH-01', code: 'RKGH', name: '고흥 항공센터', lat: 34.6005, lng: 127.2025, stands: 5, occupiedStands: 2, status: 'Active',
    frequency: '122.85 MHz', elevation: 42, lights: 'Green',
    weather: { temp: 22, wind: '240/08KT', visibility: '10KM+', pressure: '1013 hPa' },
    standDetails: [
      { id: 'S1', status: 'Occupied', assignedDrone: 'HL-A001' },
      { id: 'S2', status: 'Available' },
      { id: 'S3', status: 'Occupied', assignedDrone: 'HL-A002' },
      { id: 'S4', status: 'Available' },
      { id: 'S5', status: 'Available' },
    ]
  },
  { 
    id: 'VP-YS-01', code: 'RKYS-E', name: '여수 엑스포', lat: 34.7450, lng: 127.7470, stands: 6, occupiedStands: 3, status: 'Busy',
    frequency: '118.45 MHz', elevation: 8, lights: 'Amber',
    weather: { temp: 23, wind: '180/15G22KT', visibility: '8KM', pressure: '1011 hPa' },
    standDetails: [
      { id: 'S1', status: 'Occupied', assignedDrone: 'HL-B001' },
      { id: 'S2', status: 'Available' },
      { id: 'S3', status: 'Available' },
      { id: 'S4', status: 'Available' },
      { id: 'S5', status: 'Available' },
      { id: 'S6', status: 'Available' },
    ]
  },
  { 
    id: 'VP-SN-01', code: 'RKSN', name: '신안 안좌도', lat: 34.7500, lng: 126.1300, stands: 3, occupiedStands: 1, status: 'Active',
    frequency: '125.50 MHz', elevation: 12, lights: 'Green',
    weather: { temp: 20, wind: '300/05KT', visibility: '10KM+', pressure: '1014 hPa' },
    standDetails: [
      { id: 'S1', status: 'Occupied', assignedDrone: 'HL-C001' },
      { id: 'S2', status: 'Available' },
      { id: 'S3', status: 'Available' },
    ]
  },
];

export const NO_FLY_ZONES = [
  { name: 'P-518 나로 우주센터', lat: 34.43, lng: 127.45, radius: 12000, type: 'PROHIBITED' },
  { name: 'R-74 여수 국가산단', lat: 34.82, lng: 127.70, radius: 6000, type: 'RESTRICTED' },
];

export const DRONE_COLORS = {
  [FlightStatus.NORMAL]: '#00ff9d',
  [FlightStatus.DELAYED]: '#ffca28',
  [FlightStatus.EMERGENCY]: '#ff4757',
  [FlightStatus.LANDING]: '#00e5ff',
  [FlightStatus.CONFLICT]: '#ff00ff',
};
