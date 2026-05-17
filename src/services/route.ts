// Haversine 거리 (km)
export const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// 도보 예상 시간 (분, 평균 4km/h)
export const walkMinutes = (km: number) => Math.round((km / 4) * 60);

// 인접 방문 순서 최적화 (nearest neighbor TSP, 3개 명소)
export const optimizeOrder = <T extends { lat: number; lng: number }>(
  items: T[],
  startLat?: number,
  startLng?: number,
): T[] => {
  if (items.length <= 1) return items;

  const remaining = [...items];
  const result: T[] = [];

  // 시작점 기준 가장 가까운 첫 번째 명소 선택
  let curLat = startLat ?? items[0].lat;
  let curLng = startLng ?? items[0].lng;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((item, i) => {
      const d = haversineKm(curLat, curLng, item.lat, item.lng);
      if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
    });
    result.push(remaining[nearestIdx]);
    curLat = remaining[nearestIdx].lat;
    curLng = remaining[nearestIdx].lng;
    remaining.splice(nearestIdx, 1);
  }
  return result;
};

// 외부 지도 딥링크
export const externalMapLinks = (lat: number, lng: number, name: string) => ({
  kakao: `https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`,
  naver: `https://map.naver.com/index.nhn?dlevel=14&lat=${lat}&lng=${lng}&title=${encodeURIComponent(name)}`,
  google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
});
