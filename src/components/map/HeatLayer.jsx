import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { useMap } from 'react-leaflet';

export default function HeatLayer({ points, options = {} }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const defaultOptions = {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      minOpacity: 0.3,
      gradient: { 0.2: '#0A0A0A', 0.4: '#1E4BA3', 0.6: '#1E88E5', 0.8: '#F9A825', 1.0: '#EF4444' },
      ...options,
    };

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    const heatData = points.map(p => [p.lat, p.lng, p.intensity || 1]);
    layerRef.current = L.heatLayer(heatData, defaultOptions).addTo(map);

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [points, options, map]);

  return null;
}