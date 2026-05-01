import React, { useMemo, useCallback } from 'react';
import { T, VENDOR_TYPE_COLORS, formatNumber } from '../lib';

const VENDOR_TYPES = [
  { key: 'restaurant', label: 'Restaurant', color: VENDOR_TYPE_COLORS.restaurant },
  { key: 'bakery', label: 'Bakery', color: VENDOR_TYPE_COLORS.bakery },
  { key: 'coffee', label: 'Coffee', color: VENDOR_TYPE_COLORS.coffee },
  { key: 'grocery', label: 'Grocery', color: VENDOR_TYPE_COLORS.grocery },
  { key: 'pharmacy', label: 'Pharmacy', color: VENDOR_TYPE_COLORS.pharmacy },
  { key: 'health', label: 'Health', color: VENDOR_TYPE_COLORS.health },
  { key: 'pet_supplies', label: 'Pet', color: VENDOR_TYPE_COLORS.pet_supplies },
  { key: 'electronics', label: 'Electronics', color: VENDOR_TYPE_COLORS.electronics },
  { key: 'convenience', label: 'Convenience', color: VENDOR_TYPE_COLORS.convenience },
  { key: 'charity', label: 'Charity', color: VENDOR_TYPE_COLORS.charity },
  { key: 'flowers', label: 'Flowers', color: VENDOR_TYPE_COLORS.flowers },
  { key: 'mart', label: 'Mart', color: VENDOR_TYPE_COLORS.mart },
];

const BRANDS = ['Market Leader', 'Breadfast', 'Otlob', 'Rabbit', 'InstaShop', 'Foodpanda', 'Others'];

const RATING_OPTIONS = [
  { label: 'All Ratings', min: 0, max: 5 },
  { label: '4.5+ ★', min: 4.5, max: 5 },
  { label: '4.0+ ★', min: 4.0, max: 5 },
  { label: '3.5+ ★', min: 3.5, max: 5 },
  { label: '3.0-3.9 ★', min: 3.0, max: 3.9 },
  { label: '< 3.0 ★', min: 0, max: 2.9 },
];

const CONFIDENCE_OPTIONS = [
  { label: 'All', min: 0 },
  { label: 'High (≥80%)', min: 80 },
  { label: 'Medium (≥50%)', min: 50 },
  { label: 'Low Only', min: 0, max: 50 },
];

export default function GlobalSlicerBar({ filters, onFilterChange, vendorStats }) {
  const toggleType = useCallback((type) => {
    const current = filters.types || [];
    const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
    onFilterChange({ ...filters, types: next });
  }, [filters, onFilterChange]);

  const stats = useMemo(() => vendorStats || {}, [vendorStats]);

  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: '1rem 1.25rem',
      marginBottom: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ color: T.text, fontWeight: 700, fontSize: '0.85rem' }}>
          Global Filters
        </span>
        <button
          onClick={() => onFilterChange({ types: [], rating: { min: 0, max: 5 }, confidence: { min: 0 }, brand: null, search: '' })}
          style={{
            background: 'transparent',
            border: `1px solid ${T.border}`,
            color: T.muted,
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: '0.7rem',
            cursor: 'pointer',
          }}
        >
          Reset All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Brand Filter */}
        <div>
          <label style={{ color: T.muted, fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
            Platform
          </label>
          <select
            value={filters.brand || ''}
            onChange={(e) => onFilterChange({ ...filters, brand: e.target.value || null })}
            style={{
              width: '100%',
              background: T.bg,
              border: `1px solid ${T.border}`,
              color: T.text,
              padding: '6px 8px',
              borderRadius: 6,
              fontSize: '0.8rem',
            }}
          >
            <option value="">All Platforms</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label style={{ color: T.muted, fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
            Rating Range
          </label>
          <select
            value={`${filters.rating?.min || 0}-${filters.rating?.max || 5}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              onFilterChange({ ...filters, rating: { min, max } });
            }}
            style={{
              width: '100%',
              background: T.bg,
              border: `1px solid ${T.border}`,
              color: T.text,
              padding: '6px 8px',
              borderRadius: 6,
              fontSize: '0.8rem',
            }}
          >
            {RATING_OPTIONS.map(r => <option key={`${r.min}-${r.max}`} value={`${r.min}-${r.max}`}>{r.label}</option>)}
          </select>
        </div>

        {/* Confidence Filter */}
        <div>
          <label style={{ color: T.muted, fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
            Confidence
          </label>
          <select
            value={filters.confidence?.min || 0}
            onChange={(e) => onFilterChange({ ...filters, confidence: { min: Number(e.target.value) } })}
            style={{
              width: '100%',
              background: T.bg,
              border: `1px solid ${T.border}`,
              color: T.text,
              padding: '6px 8px',
              borderRadius: 6,
              fontSize: '0.8rem',
            }}
          >
            {CONFIDENCE_OPTIONS.map(c => <option key={c.min} value={c.min}>{c.label}</option>)}
          </select>
        </div>

        {/* Search */}
        <div>
          <label style={{ color: T.muted, fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
            Search Vendors
          </label>
          <input
            type="text"
            placeholder="Name, cuisine, area..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            style={{
              width: '100%',
              background: T.bg,
              border: `1px solid ${T.border}`,
              color: T.text,
              padding: '6px 8px',
              borderRadius: 6,
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Type Pills */}
      <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {VENDOR_TYPES.map(t => {
          const active = (filters.types || []).includes(t.key);
          const count = stats[t.key] || 0;
          return (
            <button
              key={t.key}
              onClick={() => toggleType(t.key)}
              style={{
                background: active ? t.color : 'transparent',
                border: `1px solid ${active ? t.color : T.border}`,
                color: active ? '#fff' : T.muted,
                padding: '3px 10px',
                borderRadius: 20,
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t.label} ({formatNumber(count)})
            </button>
          );
        })}
      </div>
    </div>
  );
}