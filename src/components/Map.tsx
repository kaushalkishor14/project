import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { MapPin } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';
import { MemoryType, Memory } from '../types/memory';
import { CreateMemoryForm } from './CreateMemoryForm';
import 'leaflet/dist/leaflet.css';

const markerColors: Record<MemoryType, string> = {
  milestone: '#ef4444', // red
  romantic: '#ec4899', // pink
  adventure: '#3b82f6', // blue
  celebration: '#a855f7', // purple
  travel: '#22c55e', // green
};

const createCustomMarker = (color: string) => {
  return new DivIcon({
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
        <path d="M12 2a8 8 0 0 0-8 8c0 4.416 5.333 12 8 12 2.667 0 8-7.584 8-12a8 8 0 0 0-8-8zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
      </svg>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const markerIcons: Record<MemoryType, DivIcon> = {
  milestone: createCustomMarker(markerColors.milestone),
  romantic: createCustomMarker(markerColors.romantic),
  adventure: createCustomMarker(markerColors.adventure),
  celebration: createCustomMarker(markerColors.celebration),
  travel: createCustomMarker(markerColors.travel),
};

function MapController({ memories }: { memories: Memory[] }) {
  const map = useMap();

  useEffect(() => {
    if (memories.length === 0) return;

    if (memories.length === 1) {
      // For single memory, center on it with closer zoom
      map.setView(
        [memories[0].location.lat, memories[0].location.lng],
        12
      );
    } else if (memories.length === 2) {
      // For two memories, fit bounds but maintain reasonable zoom
      const bounds = memories.reduce(
        (bounds, memory) => bounds.extend([memory.location.lat, memory.location.lng]),
        map.getBounds()
      );
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 10 // Prevent zooming out too far for just 2 points
      });
    } else {
      // For 3 or more memories, fit all points
      const bounds = memories.reduce(
        (bounds, memory) => bounds.extend([memory.location.lat, memory.location.lng]),
        map.getBounds()
      );
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 7 // Allow zooming out more for multiple points
      });
    }
  }, [memories, map]);

  return null;
}

interface NewMemoryMarker {
  lat: number;
  lng: number;
  locationName: string;
}

function MapEvents() {
  const [newMemory, setNewMemory] = useState<NewMemoryMarker | null>(null);
  const map = useMapEvents({
    click: async (e) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
        );
        const data = await response.json();
        setNewMemory({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          locationName: data.display_name,
        });
      } catch (error) {
        console.error('Error getting location name:', error);
        setNewMemory({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          locationName: 'Unknown location',
        });
      }
    },
  });

  return newMemory ? (
    <>
      <Marker
        position={[newMemory.lat, newMemory.lng]}
        icon={createCustomMarker(markerColors.milestone)}
      />
      <CreateMemoryForm
        location={{ lat: newMemory.lat, lng: newMemory.lng }}
        locationName={newMemory.locationName}
        onClose={() => setNewMemory(null)}
      />
    </>
  ) : null;
}

interface MapProps {
  memories: Memory[];
}

export function Map({ memories }: MapProps) {
  const selectMemory = useMemoryStore((state) => state.selectMemory);

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5} // Zoomed to show most of India
        className="w-full h-full absolute inset-0 rounded-xl"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController memories={memories} />
        <MapEvents />
        {memories.map((memory) => (
          <Marker
            key={memory.id}
            position={[memory.location.lat, memory.location.lng]}
            icon={markerIcons[memory.type]}
            eventHandlers={{
              click: () => selectMemory(memory.id),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}