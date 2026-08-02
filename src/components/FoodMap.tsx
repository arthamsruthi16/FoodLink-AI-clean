import React, { useEffect, useRef } from 'react';
import { FoodItem, User } from '../types';

interface FoodMapProps {
  foodItems?: FoodItem[];
  ngos?: User[];
  restaurants?: User[];
  selectedFood?: FoodItem | null;
  onSelectFood?: (item: FoodItem) => void;
  height?: string;
}

export const FoodMap: React.FC<FoodMapProps> = ({
  foodItems = [],
  ngos = [],
  restaurants = [],
  selectedFood,
  onSelectFood,
  height = '420px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);

  useEffect(() => {
    // Inject Leaflet CSS dynamically if not present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Dynamic import for Leaflet to ensure SSR / Vite bundle safety
    import('leaflet').then((L) => {
      if (!mapRef.current) return;

      if (leafletInstance.current) {
        leafletInstance.current.remove();
      }

      // Default center: if selectedFood, target it; otherwise check if global view or local
      const isGlobal = foodItems.length > 1;
      const centerLat = selectedFood ? selectedFood.lat : (isGlobal ? 20 : 37.7825);
      const centerLng = selectedFood ? selectedFood.lng : (isGlobal ? 0 : -122.4082);
      const defaultZoom = selectedFood ? 13 : (isGlobal ? 2 : 12);

      const map = L.map(mapRef.current, {
        center: [centerLat, centerLng],
        zoom: defaultZoom,
        scrollWheelZoom: false
      });

      leafletInstance.current = map;

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom Icon Generators
      const createIcon = (emoji: string, bgColor: string) =>
        L.divIcon({
          className: 'custom-map-pin',
          html: `<div style="background-color:${bgColor}; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.3); border:2px solid white; font-size:18px;">${emoji}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

      const bounds: [number, number][] = [];

      // 1. Food Items Markers (Orange)
      foodItems.forEach((item) => {
        bounds.push([item.lat, item.lng]);
        const marker = L.marker([item.lat, item.lng], {
          icon: createIcon('🍲', '#f97316')
        }).addTo(map);

        const locationTag = item.city && item.country ? `📍 ${item.city}, ${item.country}` : item.restaurantAddress;

        const popupContent = `
          <div style="font-family:sans-serif; width:190px;">
            <b style="font-size:13px; color:#0f172a;">${item.foodName}</b><br/>
            <span style="font-size:11px; color:#059669; font-weight:bold;">${item.quantity} ${item.quantityUnit} • ${item.status}</span><br/>
            <span style="font-size:10px; color:#0284c7; font-weight:semibold;">${locationTag}</span><br/>
            <span style="font-size:10px; color:#64748b;">${item.restaurantName}</span>
          </div>
        `;
        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectFood) onSelectFood(item);
        });
      });

      // 2. NGO Markers (Blue)
      ngos.forEach((ngo) => {
        bounds.push([ngo.lat, ngo.lng]);
        const marker = L.marker([ngo.lat, ngo.lng], {
          icon: createIcon('🏛️', '#0284c7')
        }).addTo(map);

        const locationTag = ngo.city && ngo.country ? `📍 ${ngo.city}, ${ngo.country}` : ngo.address;

        marker.bindPopup(`<b>${ngo.orgName || ngo.name}</b><br/><span style="font-size:11px; color:#0284c7;">${locationTag}</span><br/><span style="font-size:11px;">Food Bank / NGO Partner</span>`);
      });

      // Fit bounds if multiple items and not explicitly centered on a selectedFood
      if (bounds.length > 1 && !selectedFood && isGlobal) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
      }

      // 3. Draw Route Line if a Food Item is selected
      if (selectedFood) {
        const nearestNgo = ngos[0] || { lat: 37.7825, lng: -122.4042 };
        const latlngs: [number, number][] = [
          [selectedFood.lat, selectedFood.lng],
          [nearestNgo.lat, nearestNgo.lng]
        ];

        L.polyline(latlngs, { color: '#059669', weight: 4, dashArray: '6, 8' }).addTo(map);
      }
    });

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [foodItems, ngos, selectedFood]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
      <div ref={mapRef} style={{ height, width: '100%' }} className="z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl shadow-md border border-slate-200/60 dark:border-slate-800/60 text-[11px] font-medium flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
          <span className="text-slate-700 dark:text-slate-200">Surplus Food</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
          <span className="text-slate-700 dark:text-slate-200">NGO Partner</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span className="text-slate-700 dark:text-slate-200">Live Route</span>
        </div>
      </div>
    </div>
  );
};
