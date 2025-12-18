
export const generateCurvedPath = (start: [number, number], end: [number, number], segments: number = 20): [number, number][] => {
  const path: [number, number][] = [];
  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;
  const offset = 0.03;
  const controlPoint: [number, number] = [
    midLat + (Math.random() > 0.5 ? offset : -offset),
    midLng + (Math.random() > 0.5 ? offset : -offset)
  ];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * controlPoint[0] + t * t * end[0];
    const lng = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * controlPoint[1] + t * t * end[1];
    path.push([lat, lng]);
  }
  return path;
};

/**
 * 여러 지점을 경유하는 부드러운 경로 생성
 */
export const generateMultiPointCurvedPath = (points: [number, number][], segmentsPerLeg: number = 15): [number, number][] => {
  let fullPath: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const leg = generateCurvedPath(points[i], points[i + 1], segmentsPerLeg);
    // 중복 지점 제거하고 합치기
    fullPath = [...fullPath, ...(i === 0 ? leg : leg.slice(1))];
  }
  return fullPath;
};

export const getPointOnPath = (path: [number, number][], progress: number): [number, number] => {
  const totalPoints = path.length;
  const index = Math.floor(progress * (totalPoints - 1));
  const nextIndex = Math.min(index + 1, totalPoints - 1);
  const localT = (progress * (totalPoints - 1)) - index;
  
  const p1 = path[index];
  const p2 = path[nextIndex];
  
  return [
    p1[0] + (p2[0] - p1[0]) * localT,
    p1[1] + (p2[1] - p1[1]) * localT
  ];
};
