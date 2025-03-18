import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Disaster } from '@shared/schema';
import { Card } from '@/components/ui/card';

// Import marker icons
const getMarkerIcon = (severity: number) => {
  const severityColors = {
    1: '#3B82F6', // blue
    2: '#EAB308', // yellow
    3: '#F97316', // orange
    4: '#EF4444', // red
    5: '#A855F7', // purple
  };

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${severityColors[severity as keyof typeof severityColors]};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

interface DisasterMapProps {
  disasters: Disaster[];
  onMarkerClick?: (disaster: Disaster) => void;
  className?: string;
}

export function DisasterMap({ disasters, onMarkerClick, className }: DisasterMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // Initialize map if not already done
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([20.5937, 78.9629], 5); // Center on India
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(mapRef.current);

      markersRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // Clear existing markers
    if (markersRef.current) {
      markersRef.current.clearLayers();
    }

    // Add markers for each disaster
    disasters.forEach((disaster) => {
      const { lat, lng } = disaster.location;
      const marker = L.marker([lat, lng], {
        icon: getMarkerIcon(disaster.severity),
      });

      // Add popup with basic info
      marker.bindPopup(`
        <div class="text-sm">
          <strong>${disaster.title}</strong><br/>
          <span class="text-muted-foreground">${disaster.type}</span><br/>
          Severity: ${disaster.severity}
        </div>
      `);

      // Add click handler
      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(disaster);
        }
      });

      marker.addTo(markersRef.current!);
    });

    // Fit bounds to show all markers
    if (disasters.length > 0 && mapRef.current && markersRef.current) {
      const group = L.featureGroup(markersRef.current.getLayers());
      mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [disasters, onMarkerClick]);

  return (
    <Card className={className}>
      <div 
        id="map" 
        className="h-[400px] w-full rounded-lg" 
        style={{ zIndex: 0 }}
      />
    </Card>
  );
}
