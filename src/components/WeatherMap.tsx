'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import L, {
  LatLng,
  Map as LeafletMap,
  Polygon as LeafletPolygon,
  FeatureGroup,
  Layer, // ✅ <- Add this
} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
interface IconPrototypeWithOptionalGetter {
  _getIconUrl?: () => string;
}
// Fix leaflet's default markers
delete (L.Icon.Default.prototype as IconPrototypeWithOptionalGetter)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Polygon {
  id: string;
  coordinates: number[][];
  color: string;
  temperature?: number;
  name: string;
}
interface CustomPolygon extends L.Polygon {
  polygonId?: string;
}
interface WeatherMapProps {
  onPolygonCreate: (polygon: Polygon) => void;
  onPolygonDelete: (id: string) => void;
  polygons: Polygon[];

}

const WeatherMap: React.FC<WeatherMapProps> = ({
  onPolygonCreate,
  onPolygonDelete,
  polygons,

}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const polygonLayersRef = useRef<Map<string, L.Polygon>>(new Map());
  const [selectedPolygon, setSelectedPolygon] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    console.log('Starting map initialization...');

    try {
      console.log('Creating map instance...');

      // Create map instance
      const map = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true
      });

      console.log('Map instance created, adding tile layer...');

      // Add tile layer
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

      tileLayer.addTo(map);
      console.log('Tile layer added');

      // Create feature group for drawn items
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;
      console.log('Feature group created');

      // Initialize draw control
      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
          remove: true
        },
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            drawError: {
              color: '#e1e100',
              message: '<strong>Error:</strong> shape edges cannot cross!'
            },
            shapeOptions: {
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.3
            }
          },
          polyline: false,
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false
        }
      });

      map.addControl(drawControl);
      drawControlRef.current = drawControl;
      console.log('Draw controls added');

      // Handle polygon creation
      map.on(L.Draw.Event.CREATED, (event) => {
        const e = event as L.DrawEvents.Created;
        const layer = e.layer as L.Polygon;
        const latlngs = layer.getLatLngs()[0] as L.LatLng[];

        const coordinates = latlngs.map((latlng) => [latlng.lng, latlng.lat]);
        const polygonId = `polygon-${Date.now()}`;

        const polygon: Polygon = {
          id: polygonId,
          coordinates,
          color: '#3b82f6',
          name: `Region ${Date.now()}`,
          temperature: Math.random() * 40 - 10,
        };

        const customLayer = layer as CustomPolygon;
        customLayer.polygonId = polygonId;
        polygonLayersRef.current.set(polygonId, customLayer);
        customLayer.on('click', () => setSelectedPolygon(polygonId));

        drawnItems.addLayer(layer);
        onPolygonCreate(polygon);
      });

      // Handle polygon deletion
      map.on(L.Draw.Event.DELETED, (event) => {
        const e = event as L.DrawEvents.Deleted;
        e.layers.eachLayer((layer: Layer) => {
          const polygonLayer = layer as CustomPolygon;
          if (polygonLayer.polygonId) {
            polygonLayersRef.current.delete(polygonLayer.polygonId);
            onPolygonDelete(polygonLayer.polygonId);
          }
        });
      });

      mapInstanceRef.current = map;
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onPolygonCreate, onPolygonDelete]);

  // Update polygon colors when temperature data changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    polygons.forEach((polygon) => {
      const layer = polygonLayersRef.current.get(polygon.id);
      if (layer) {
        const temperature = polygon.temperature || 0;
        let color = '#3b82f6'; // Default blue

        if (temperature > 30) color = '#ef4444'; // Hot - red
        else if (temperature > 20) color = '#f59e0b'; // Warm - orange
        else if (temperature > 10) color = '#3b82f6'; // Cool - blue
        else color = '#1e40af'; // Cold - dark blue

        layer.setStyle({
          color,
          fillColor: color,
          fillOpacity: 0.3
        });
      }
    });
  }, [polygons]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedPolygon && drawnItemsRef.current) {
      const layer = polygonLayersRef.current.get(selectedPolygon);
      if (layer) {
        drawnItemsRef.current.removeLayer(layer);
        polygonLayersRef.current.delete(selectedPolygon);
        onPolygonDelete(selectedPolygon);
        setSelectedPolygon(null);
      }
    }
  }, [selectedPolygon, onPolygonDelete]);

  return (
    <div className="relative h-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />

      {/* Map Controls */}
      <div className="absolute top-4 left-4 space-y-2 z-[1000]">
        <div className="bg-card/95 backdrop-blur-sm rounded-lg p-3 border shadow-weather">
          <p className="text-sm font-medium text-foreground mb-2">Drawing Tools</p>
          <p className="text-xs text-muted-foreground">
            Click the polygon tool to draw weather regions
          </p>
        </div>

        {selectedPolygon && (
          <Button
            onClick={handleDeleteSelected}
            variant="destructive"
            size="sm"
            className="bg-destructive/90 backdrop-blur-sm"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Selected
          </Button>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 border shadow-weather z-[1000]">
        <p className="text-sm font-medium text-foreground mb-2">Temperature</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-weather-hot"></div>
            <span className="text-xs text-muted-foreground">&gt; 30°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-weather-warm"></div>
            <span className="text-xs text-muted-foreground">20-30°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-weather-cool"></div>
            <span className="text-xs text-muted-foreground">10-20°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-weather-cold"></div>
            <span className="text-xs text-muted-foreground">&lt; 10°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;