import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone, Navigation } from "lucide-react";

interface Doctor {
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

const DoctorMap = ({ doctors, onDoctorSelect }: { doctors: Doctor[], onDoctorSelect: (doctor: Doctor) => void }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = () => {
    if (!mapboxToken) {
      setShowTokenInput(true);
      return;
    }

    if (!mapContainer.current) return;

    // Simple map placeholder for now - in production, this would use the actual Mapbox API
    const mapElement = mapContainer.current;
    mapElement.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
        <div class="text-center p-8">
          <div class="text-4xl mb-4">🗺️</div>
          <h3 class="text-lg font-semibold mb-2">Interactive Map</h3>
          <p class="text-sm text-muted-foreground mb-4">Showing ${doctors.length} doctors in your area</p>
          <div class="space-y-2">
            ${doctors.map(doctor => `
              <button 
                onclick="window.selectDoctor(${doctor.id})" 
                class="block w-full p-2 text-left hover:bg-primary/5 rounded text-sm border"
              >
                📍 ${doctor.name} - ${doctor.location}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Add global function for doctor selection
    (window as any).selectDoctor = (doctorId: number) => {
      const doctor = doctors.find(d => d.id === doctorId);
      if (doctor) onDoctorSelect(doctor);
    };
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
      setShowTokenInput(false);
    }
  }, [mapboxToken, doctors]);

  if (showTokenInput) {
    return (
      <Card className="h-full shadow-card">
        <CardContent className="p-6 h-full flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold mb-4">Map Integration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To enable interactive maps, please enter your Mapbox public token.
              Get yours free at <a href="https://mapbox.com" target="_blank" className="text-primary hover:underline">mapbox.com</a>
            </p>
            <div className="space-y-3">
              <Input
                placeholder="Enter Mapbox public token..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <div className="flex gap-2">
                <Button 
                  variant="medical" 
                  onClick={() => mapboxToken && initializeMap()}
                  disabled={!mapboxToken}
                  className="flex-1"
                >
                  Enable Map
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTokenInput(false)}
                >
                  Skip for now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-card">
      <div ref={mapContainer} className="h-full min-h-[400px] rounded-lg" />
    </Card>
  );
};

export { DoctorMap, type Doctor };