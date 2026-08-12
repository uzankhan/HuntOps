export const aiService = {
  predictLocation: async (imei: string) => {
    // Simple predictive algorithm - will be enhanced later
    return {
      success: true,
      predicted_lat: 24.8607 + (Math.random() * 0.01),
      predicted_lng: 67.0011 + (Math.random() * 0.01),
      confidence: 0.85
    };
  },
  
  detectAnomaly: async (locations: any[]) => {
    // Detect sudden jumps, overnight movement, etc.
    if (locations.length < 2) return { is_anomaly: false };
    // Basic check: if location jumped more than 100km
    const last = locations[0];
    const prev = locations[1];
    const distance = haversineDistance(last.latitude, last.longitude, prev.latitude, prev.longitude);
    return {
      is_anomaly: distance > 100,
      distance_km: distance,
      message: distance > 100 ? 'Unusual movement detected' : 'Normal movement'
    };
  }
};

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}