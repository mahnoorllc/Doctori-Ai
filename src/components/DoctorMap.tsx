import React, { useEffect, useMemo, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon paths for Leaflet in Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  address: string;
  coordinates: [number, number];
  availability: string;
  image: string;
  bio: string;
  phone: string;
}

const FitBounds: React.FC<{ positions: [number, number][] }>
= ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (!positions.length) return;
    const bounds = L.latLngBounds(positions.map(([lng, lat]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [positions, map]);
  return null;
};

const DoctorMap = ({ doctors, onDoctorSelect }: { doctors: Doctor[], onDoctorSelect: (doctor: Doctor) => void }) => {
  const positions = useMemo(() => doctors.map(d => d.coordinates), [doctors]);
  const center = useMemo(() => {
    if (!positions.length) return { lat: 23.8103, lng: 90.4125 }; // Dhaka fallback
    const avg = positions.reduce((acc, [lng, lat]) => ({ lat: acc.lat + lat, lng: acc.lng + lng }), { lat: 0, lng: 0 });
    return { lat: avg.lat / positions.length, lng: avg.lng / positions.length };
  }, [positions]);

  return (
    <Card className="h-full shadow-card">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds positions={positions} />
        {doctors.map((doctor) => (
          <Marker key={doctor.id} position={[doctor.coordinates[1], doctor.coordinates[0]]}
            eventHandlers={{ click: () => onDoctorSelect(doctor) }}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{doctor.name}</p>
                <p className="text-sm">{doctor.specialty}</p>
                <p className="text-xs text-muted-foreground">{doctor.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
};

export { DoctorMap, type Doctor };