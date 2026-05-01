import React, { useMemo } from 'react';
import { T, getTypeColor, formatNumber } from '../lib';

export default function VendorSearchTable({ vendors = [], onVendorSelect, filters = {} }) {
  const filtered = useMemo(() => {
    let v = vendors;
    if (filters.types && filters.types.length > 0) {
      v = v.filter(v => filters.types.includes(v.type));
    }
    if (filters.brand) {
      v = v.filter(v => v.brand === filters.brand);
    }
    if (filters.minRating) {
      v = v.filter(v => (v.rating || 0) >= filters.minRating);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      v = v.filter(v => v.name?.toLowerCase().includes(q) || v.cuisine?.toLowerCase().includes(q) || v.area?.toLowerCase().includes(q));
    }
    return v;
  }, [vendors, filters]);

  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 320px)',
    }}>
      <div style={{
        padding: '0.75rem 1rem',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ color: T.text, fontWeight: 700, fontSize: '0.85rem' }}>
          Vendor Explorer
        </span>
        <span style={{ color: T.muted, fontSize: '0.7rem' }}>
          {filtered.length.toLocaleString()} vendors found
        </span>
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', color: T.text }}>
          <thead style={{ position: 'sticky', top: 0, background: T.card, zIndex: 1, borderBottom: `2px solid ${T.border}` }}>
            <tr>
              <th style={{ padding: '10px 1rem', color: T.muted, fontWeight: 600 }}>Vendor Name</th>
              <th style={{ padding: '10px 1rem', color: T.muted, fontWeight: 600 }}>Type</th>
              <th style={{ padding: '10px 1rem', color: T.muted, fontWeight: 600 }}>Rating</th>
              <th style={{ padding: '10px 1rem', color: T.muted, fontWeight: 600 }}>Reviews</th>
              <th style={{ padding: '10px 1rem', color: T.muted, fontWeight: 600 }}>Area</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <tr
                key={v.id || i}
                onClick={() => onVendorSelect(v)}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = T.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '10px 1rem', fontWeight: 600 }}>{v.name}</td>
                <td style={{ padding: '10px 1rem' }}>
                  <span style={{
                    background: getTypeColor(v.type),
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: '0.65rem',
                    fontWeight: 600
                  }}>{v.type}</span>
                </td>
                <td style={{ padding: '10px 1rem', fontWeight: 700, color: '#FACC15' }}>★ {v.rating || 'N/A'}</td>
                <td style={{ padding: '10px 1rem', color: T.muted }}>{formatNumber(v.review_count)}</td>
                <td style={{ padding: '10px 1rem', color: T.muted }}>{v.area}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: T.muted }}>
                  No vendors match your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}