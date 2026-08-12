// @ts-nocheck
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  devices: any[];
}

export const MapView: React.FC<MapViewProps> = ({ devices }) => {
  const defaultPos: [number, number] = [24.8607, 67.0011];
  const active = devices.filter(d => d.last_latitude && d.last_longitude);
  const center = active.length > 0 
    ? [active[0].last_latitude!, active[0].last_longitude!] 
    : defaultPos;

  return (
    <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%', background: '#1a1a1a' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {devices.map((d) => (
        d.last_latitude && d.last_longitude && (
          <Marker key={d.id} position={[d.last_latitude, d.last_longitude]}>
            <Popup>{d.device_name} - {d.imei}</Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};