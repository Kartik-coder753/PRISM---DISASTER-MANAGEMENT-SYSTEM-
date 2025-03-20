import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Disaster, Location } from '@shared/schema';
import { Card } from '@/components/ui/card';

// Import marker icons
const getMarkerIcon = (severity: number, type: string) => {
  const severityColors = {
    1: '#3B82F6', // blue
    2: '#EAB308', // yellow
    3: '#F97316', // orange
    4: '#EF4444', // red
    5: '#A855F7', // purple
  };

  const size = severity * 5 + 15; // Size increases with severity

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${severityColors[severity as keyof typeof severityColors]};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size/2}px;
      ">${severity}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

interface DisasterMapProps {
  disasters: Disaster[];
  onMarkerClick?: (disaster: Disaster) => void;
  className?: string;
  activeType?: string;
}

export function DisasterMap({ disasters, onMarkerClick, className, activeType }: DisasterMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{[key: string]: L.LayerGroup}>({});
  const [activeLayer, setActiveLayer] = useState<string>('all');

  useEffect(() => {
    // Initialize map if not already done
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([20.5937, 78.9629], 5); // Center on India

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(mapRef.current);

      // Initialize layer groups for each disaster type
      const types = ['cyclone', 'earthquake', 'flood', 'storm', 'all'];
      types.forEach(type => {
        layersRef.current[type] = L.layerGroup().addTo(mapRef.current!);
      });
    }

    // Clear existing markers
    Object.values(layersRef.current).forEach(layer => layer.clearLayers());

    // Add markers for each disaster
    disasters.forEach((disaster) => {
      const location = disaster.location as Location;
      const marker = L.marker([location.lat, location.lng], {
        icon: getMarkerIcon(disaster.severity, disaster.type),
      });

      // Create detailed popup content
      const popupContent = `
        <div class="text-sm p-2">
          <h3 class="font-bold text-lg mb-2">${disaster.title}</h3>
          <div class="space-y-1">
            <p><strong>Type:</strong> ${disaster.type}</p>
            <p><strong>Severity:</strong> Level ${disaster.severity}</p>
            <p><strong>Time:</strong> ${new Date(disaster.timestamp).toLocaleString()}</p>
            <p><strong>Affected Areas:</strong> ${disaster.affectedAreas.join(', ')}</p>
            ${disaster.type === 'cyclone' && disaster.windSpeed ? `
              <p><strong>Wind Speed:</strong> ${disaster.windSpeed} km/h</p>
              <p><strong>Movement:</strong> ${disaster.movement}</p>
            ` : ''}
            ${disaster.type === 'earthquake' && disaster.magnitude ? `
              <p><strong>Magnitude:</strong> ${disaster.magnitude} Richter</p>
              <p><strong>Depth:</strong> ${disaster.depth} km</p>
            ` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add click handler
      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(disaster);
        }
      });

      // Add to appropriate layers
      layersRef.current[disaster.type].addLayer(marker);
      // Create a new marker for the 'all' layer
      const allMarker = L.marker([location.lat, location.lng], {
        icon: getMarkerIcon(disaster.severity, disaster.type),
      }).bindPopup(popupContent);
      layersRef.current['all'].addLayer(allMarker);
    });

    // Show active layer
    const showLayer = activeType || 'all';
    Object.entries(layersRef.current).forEach(([type, layer]) => {
      if (type === showLayer) {
        layer.addTo(mapRef.current!);
      } else {
        layer.remove();
      }
    });
    setActiveLayer(showLayer);

    // Add zone overlays for cyclones and earthquakes
    if (activeType === 'cyclone' || activeType === 'earthquake') {
      const zoneStyle = {
        color: activeType === 'cyclone' ? '#3B82F6' : '#F97316',
        fillOpacity: 0.1,
        weight: 1,
      };

      // Add zone polygons (example coordinates)
      const zones = getDisasterZones(activeType);
      zones.forEach(zone => {
        L.polygon(zone.coordinates, {
          ...zoneStyle,
          fillOpacity: zone.risk * 0.2,
        })
          .bindTooltip(zone.name)
          .addTo(mapRef.current!);
      });
    }

    // Fit bounds to show all markers
    if (disasters.length > 0 && mapRef.current) {
      const group = L.featureGroup(
        Array.from(layersRef.current[activeLayer].getLayers()) as L.Layer[]
      );
      mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [disasters, onMarkerClick, activeType]);

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

// Helper function to get zone coordinates based on disaster type
function getDisasterZones(type: string): Array<{
  name: string;
  coordinates: [number, number][];
  risk: number;
}> {
  if (type === 'cyclone') {
    return [
      {
        name: 'High Risk Cyclone Zone',
        coordinates: [
          [21.7679, 87.8037], [19.0760, 84.8312],
          [17.6868, 83.2185], [15.9129, 80.1866],
          [18.1096, 83.3950], [20.2961, 86.6987],
        ],
        risk: 0.8,
      },
      // Add more coastal zones
    ];
  }

  if (type === 'earthquake') {
    return [
      {
        name: 'Seismic Zone V (Very High Risk)',
        coordinates: [
          [34.2837, 74.3173], [32.7266, 74.8570],
          [31.1471, 77.5937], [28.7041, 77.1025],
          [30.3165, 78.0322], [33.2778, 75.3412],
        ],
        risk: 1,
      },
      // Add more seismic zones
    ];
  }

  return [];
}