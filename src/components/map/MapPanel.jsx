import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './leaflet-dark.css';
import HeatLayer from './HeatLayer';
import { T, VENDOR_TYPE_COLORS, MAP_TILE_URL, MAP_TILE_ATTRIBUTION, MAP_CENTER, MAP_DEFAULT_ZOOM, getTypeColor, getRatingColor } from '../../lib';

const createIcon = (color, size = 8) => L.divIcon({
  html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:1px solid rgba(255,255,255,0.3);"></div>`,
  className: '',
  iconSize: [size, size],
  iconAnchor: [size / 2, size / 2],
});

const ratingToSize = (r) => r >= 4.5 ? 12 : r >= 4.0 ? 10 : r >= 3.5 ? 8 : r >= 3.0 ? 7 : 6;

function MapControls({ onFilterChange, filters, vendorTypes }) {
  return null;
}

function VendorPopupContent({ vendor }) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minWidth: 180 }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F5F5F5', marginBottom: 4 }}>{vendor.name}</div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 6 }}>
        <span style={{ backgroundColor: getTypeColor(vendor.type), color: '#fff', padding: '1px 6px', borderRadius: 3, fontSize: '0.65rem', fontWeight: 600 }}>{vendor.type}</span>
        <span style={{ color: getRatingColor(vendor.rating || 0), fontWeight: 600, fontSize: '0.8rem' }}>★ {vendor.rating}</span>
        <span style={{ color: '#9CA3AF', fontSize: '0.7rem' }}>({vendor.review_count?.toLocaleString() || 0})</span>
      </div>
      {vendor.cuisine && (
        <div style={{ color: '#9CA3AF', fontSize: '0.7rem', marginBottom: 2 }}>
          {vendor.cuisine.split(',').slice(0, 4).map((c, i) => (
            <span key={i} style={{ backgroundColor: '#1E1E1E', padding: '1px 5px', borderRadius: 3, marginRight: 3 }}>{c.trim()}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function FitBoundsOnLoad({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [20, 20] });
  }, [bounds, map]);
  return null;
}

export default function MapPanel({ vendors = [], filters = {}, onVendorSelect }) {
  const filteredVendors = React.useMemo(() => {
    let v = vendors.filter(v => v.lat && v.lng && v.lat !== 0 && v.lng !== 0);
    if (filters.types && filters.types.length > 0) {
      v = v.filter(v => filters.types.includes(v.type));
    }
    if (filters.minRating) {
      v = v.filter(v => (v.rating || 0) >= filters.minRating);
    }
    if (filters.maxRating) {
      v = v.filter(v => (v.rating || 0) <= filters.maxRating);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      v = v.filter(v => v.name?.toLowerCase().includes(q) || v.cuisine?.toLowerCase().includes(q));
    }
    return v;
  }, [vendors, filters]);

  const clusterIconCreateFunction = React.useCallback((cluster) => {
    const count = cluster.getChildCount();
    const size = count < 10 ? 30 : count < 50 ? 40 : count < 200 ? 50 : 60;
    return L.divIcon({
      html: `<div style="background:rgba(30,136,229,0.8);color:#fff;border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:${size < 40 ? 10 : 12}px;font-weight:700;border:2px solid rgba(30,136,229,0.4);">${count}</div>`,
      className: '',
      iconSize: L.point(size, size),
    });
  }, []);

  const egyptBounds = L.latLngBounds(L.latLng(21.5, 24.0), L.latLng(31.8, 35.0));

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}` }}>
      <MapContainer center={MAP_CENTER} zoom={MAP_DEFAULT_ZOOM} style={{ height: 500, width: '100%' }} maxZoom={18} minZoom={6}>
        <TileLayer url={MAP_TILE_URL} attribution={MAP_TILE_ATTRIBUTION} />
        <FitBoundsOnLoad bounds={egyptBounds} />
        <HeatLayer points={filteredVendors.map(v => ({ lat: v.lat, lng: v.lng, intensity: 1 }))} />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom
          showCoverageOnHover
          iconCreateFunction={clusterIconCreateFunction}
        >
          {filteredVendors.map((v, i) => (
            <Marker key={v.id || i} position={[v.lat, v.lng]} icon={createIcon(getTypeColor(v.type), ratingToSize(v.rating || 0))}>
              <Popup maxWidth={250}>
                <VendorPopupContent vendor={v} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      <div style={{ backgroundColor: T.card, padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: T.muted }}>
        <span>{filteredVendors.length.toLocaleString()} vendors on map</span>
        <span>CartoDB Dark Matter tiles | Zoom: scroll | Click: vendor details</span>
      </div>
    </div>
  );
}