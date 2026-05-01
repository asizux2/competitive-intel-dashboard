import React from 'react';
import { T, getTypeColor, getRatingColor } from '../lib';

export default function VendorDetailDrawer({ vendor, isOpen, onClose }) {
  if (!vendor) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100%',
      background: T.card,
      borderLeft: `1px solid ${T.border}`,
      zIndex: 1000,
      transition: 'transform 0.3s ease-in-out',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        padding: '1.5rem',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
      }}>
        <div>
          <h2 style={{ color: T.text, margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{vendor.name}</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
            <span style={{
              background: getTypeColor(vendor.type),
              color: '#fff',
              padding: '2px 8px',
              borderRadius: 12,
              fontSize: '0.7rem',
              fontWeight: 600
            }}>{vendor.type}</span>
            <span style={{ color: getRatingColor(vendor.rating || 0), fontWeight: 700, fontSize: '0.9rem' }}>★ {vendor.rating}</span>
            <span style={{ color: T.muted, fontSize: '0.75rem' }}>({vendor.review_count?.toLocaleString() || 0} reviews)</span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: `1px solid ${T.border}`,
            color: T.muted,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 6,
            fontSize: '0.7rem'
          }}
        >
          Close
        </button>
      </div>

      <div style={{
        padding: '1.5rem',
        overflowY: 'auto',
        flex: 1,
        color: T.text,
      }}>
        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '2rem' }}>
          <div style={{ background: T.bg, padding: '1rem', borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ color: T.muted, fontSize: '0.7rem', fontWeight: 600, marginBottom: 4 }}>Cuisine</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{vendor.cuisine || 'N/A'}</div>
          </div>
          <div style={{ background: T.bg, padding: '1rem', borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ color: T.muted, fontSize: '0.7rem', fontWeight: 600, marginBottom: 4 }}>Area</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{vendor.area || 'N/A'}</div>
          </div>
        </div>

        {/* Popular Items */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: T.text, fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 16, background: T.primary, borderRadius: 2 }}></span>
            Top Popular Items
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(vendor.popular_items || ['No data available']).map((item, i) => (
              <span key={i} style={{
                background: '#1E1E1E',
                border: `1px solid ${T.border}`,
                color: T.text,
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: '0.75rem',
              }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Sentiment analysis */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: T.text, fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 16, background: T.primary, borderRadius: 2 }}></span>
            Consumer Sentiment
          </h3>
          <div style={{
            background: T.bg,
            padding: '1rem',
            borderRadius: 12,
            border: `1px solid ${T.border}`,
            fontSize: '0.8rem',
            lineHeight: '1.5',
            color: T.muted,
            fontStyle: 'italic'
          }}>
            "{vendor.sentiment_summary || 'No qualitative summary available for this vendor.'}"
          </div>
        </div>

        {/* Payment & Delivery */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: T.text, fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 16, background: T.primary, borderRadius: 2 }}></span>
            Operations
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: T.muted }}>
              <span style={{ color: T.success }}>✓</span> {vendor.payment_methods || 'Cash'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: T.muted }}>
              <span style={{ color: T.success }}>✓</span> {vendor.delivery_time || 'Standard'}
            </div>
          </div>
        </div>

        {/* Map Action */}
        <button
          style={{
            width: '100%',
            background: T.primary,
            color: '#fff',
            border: 'none',
            padding: '12px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'filter 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
          onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          onClick={() => {
            // Logic to scroll to map or highlight marker
            onClose();
            window.dispatchEvent(new CustomEvent('focus-vendor', { detail: vendor }));
          }}
        >
          View on Intelligence Map
        </button>
      </div>
    </div>
  );
}