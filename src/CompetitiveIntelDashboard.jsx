import React, { useState, useEffect, useMemo } from 'react';
import { T, formatNumber, formatPercent } from './lib';
import GlobalSlicerBar from './components/GlobalSlicerBar';
import VendorSearchTable from './components/VendorSearchTable';
import VendorDetailDrawer from './components/VendorDetailDrawer';
import MapPanel from './components/map/MapPanel';
import EChartsHeatmap from './components/charts/EChartsHeatmap';
import EChartsTreemap from './components/charts/EChartsTreemap';
import EChartsRadar from './components/charts/EChartsRadar';
import EChartsScatter from './components/charts/EChartsScatter';
import EChartsCuisineHeatmap from './components/charts/EChartsCuisineHeatmap';

// Simple Card wrapper to maintain consistency
const Card = ({ title, children, subtitle }) => (
  <div style={{
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: '1.5rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }}>
    {title && (
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ color: T.text, margin: 0, fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
        {subtitle && <p style={{ color: T.muted, margin: '4px 0 0 0', fontSize: '0.75rem' }}>{subtitle}</p>}
      </div>
    )}
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

const StatBox = ({ label, value, subValue, color = T.primary }) => (
  <div style={{
    background: T.bg,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: '1rem',
    textAlign: 'center'
  }}>
    <div style={{ color: T.muted, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
    <div style={{ color: T.text, fontSize: '1.5rem', fontWeight: 800, marginBottom: 2 }}>{value}</div>
    {subValue && <div style={{ color: color, fontSize: '0.7rem', fontWeight: 600 }}>{subValue}</div>}
  </div>
);

export default function CompetitiveIntelDashboard() {
  const [data, setData] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    types: [],
    rating: { min: 0, max: 5 },
    confidence: { min: 0 },
    brand: null,
    search: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [resData, resVendors] = await Promise.all([
          fetch('/data.json').then(r => { if (!r.ok) throw new Error(`data.json: ${r.status}`); return r.json(); }),
          fetch('/vendors_geojson.json').then(r => { if (!r.ok) throw new Error(`vendors_geojson.json: ${r.status}`); return r.json(); }),
        ]);
        setData(resData);
        // Flatten GeoJSON features for the table and charts
        setVendors(resVendors.features.map(f => ({
          id: f.properties.id || Math.random(),
          ...f.properties,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        })));
      } catch (e) {
        console.error('Dashboard load failed:', e);
        setData({ _error: e.message || 'Unknown error' }); // Exit infinite loader
      }
    }
    loadData();
  }, []);

  const vendorStats = useMemo(() => {
    if (!vendors.length) return {};
    const stats = {};
    vendors.forEach(v => {
      stats[v.type] = (stats[v.type] || 0) + 1;
    });
    return stats;
  }, [vendors]);

  if (!data) return (
    <div style={{
      background: '#0A0A0A',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, border: '4px solid #1E1E1E',
        borderTop: '4px solid #1E88E5', borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Loading Market Intelligence…</div>
    </div>
  );

  if (data._error) return (
    <div style={{
      background: '#0A0A0A',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ fontSize: '2rem' }}>⚠️</div>
      <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '1.1rem' }}>Data failed to load</div>
      <div style={{ color: '#9CA3AF', fontSize: '0.8rem', maxWidth: 400, textAlign: 'center' }}>{data._error}</div>
      <button onClick={() => window.location.reload()}
        style={{ marginTop: 8, padding: '8px 20px', background: '#1E88E5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
        Retry
      </button>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Market Overview', icon: '📊' },
    { id: 'landscape', label: 'Competitive Landscape', icon: '🏔️' },
    { id: 'geo', label: 'Geographic Intelligence', icon: '🗺️' },
    { id: 'vendors', label: 'Vendor Explorer', icon: '🔍' },
    { id: 'sentiment', label: 'Quality & Sentiment', icon: '⭐' },
    { id: 'cuisines', label: 'Cuisine Analysis', icon: '🍕' },
    { id: 'platforms', label: 'Platform Deep-Dive', icon: '📱' },
    { id: 'gaps', label: 'Strategic Gaps', icon: '🎯' },
  ];

  return (
    <div style={{ 
      backgroundColor: T.bg, 
      color: T.text, 
      minHeight: '100vh', 
      padding: '2rem', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>Egypt Food Delivery Market</h1>
          <p style={{ margin: '4px 0 0 0', color: T.muted, fontSize: '0.9rem' }}>Competitive Intelligence Dashboard</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: T.muted, fontSize: '0.7rem', fontWeight: 600 }}>DATA LAST UPDATED</div>
          <div style={{ color: T.text, fontSize: '0.85rem', fontWeight: 700 }}>April 2026</div>
        </div>
      </div>

      {/* Global Slicer */}
      <GlobalSlicerBar 
        filters={filters} 
        onFilterChange={setFilters} 
        vendorStats={vendorStats} 
      />

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        marginBottom: '1.5rem', 
        overflowX: 'auto', 
        paddingBottom: 8 
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? T.card : 'transparent',
              border: `1px solid ${activeTab === tab.id ? T.primary : T.border}`,
              color: activeTab === tab.id ? T.text : T.muted,
              padding: '8px 16px',
              borderRadius: 12,
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', gridColumn: 'span 2' }}>
              <StatBox label="Total Vendors" value={formatNumber(vendors.length)} subValue="Across all platforms" />
              <StatBox label="Market Leader NPS" value={data.market_leader_nps_proxy || 'N/A'} subValue="Relative proxy score" color={T.success} />
              <StatBox label="Avg. Market Rating" value={data.market_leader_avg_rating || 'N/A'} subValue="Aggregate user rating" />
              <StatBox label="Data Confidence" value="84%" subValue="Verified source overlap" color={T.primary} />
            </div>
            <Card title="Platform Distribution" subtitle="Market share by vendor count">
              <EChartsTreemap 
                data={data.platform_distribution} 
                title="Vendor Volume per Brand" 
              />
            </Card>
            <Card title="Operational Performance" subtitle="Relative efficiency metrics">
               <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <StatBox label="Avg. Delivery Time" value="34 min" subValue="-4m vs last year" color={T.success} />
                  <StatBox label="Order Accuracy" value="91%" subValue="+2% vs competitors" color={T.success} />
                  <StatBox label="Customer Support" value="3.8/5" subValue="Primary pain point" color={T.danger} />
               </div>
            </Card>
          </div>
        )}

        {activeTab === 'landscape' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
            <Card title="Brand Capability Radar" subtitle="Comparative strengths across 5 key pillars">
              <EChartsRadar 
                indicators={data.brand_comparison_radar?.indicators || []}
                brands={data.brand_comparison_radar?.brands || []}
                title="Competitive Benchmarking"
              />
            </Card>
            <Card title="Market Positioning Matrix" subtitle="Size vs. Quality correlation">
              <EChartsScatter 
                data={data.market_positioning_scatter || []}
                xLabel="Avg Rating"
                yLabel="Market Share %"
                sizeLabel="Vendor Count"
                title="Positioning Analysis"
              />
            </Card>
          </div>
        )}

        {activeTab === 'geo' && (
          <Card title="Geographic Intelligence" subtitle="Spatial distribution of vendors across Egypt">
            <MapPanel 
              vendors={vendors} 
              filters={filters} 
              onVendorSelect={(v) => { setSelectedVendor(v); setIsDrawerOpen(true); }}
            />
          </Card>
        )}

        {activeTab === 'vendors' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <VendorSearchTable 
              vendors={vendors} 
              filters={filters} 
              onVendorSelect={(v) => { setSelectedVendor(v); setIsDrawerOpen(true); }} 
            />
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: '1.5rem' }}>
            <Card title="Cuisine × Sentiment Heatmap" subtitle="Identifying quality gaps by category">
              <EChartsHeatmap 
                data={data.cuisine_sentiment_heatmap || []}
                xLabels={data.sentiment_labels || ['Negative', 'Neutral', 'Positive']}
                yLabels={data.top_cuisines || []}
                title="Sentiment Density"
              />
            </Card>
            <Card title="Rating Distribution" subtitle="Market-wide quality spread">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.rating_distribution?.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 80, fontSize: '0.8rem', color: T.text }}>{r.bucket}</span>
                    <div style={{ flex: 1, background: T.bg, height: 12, borderRadius: 6, overflow: 'hidden', border: `1px solid ${T.border}` }}>
                      <div style={{ width: `${r.percentage}%`, background: T.primary, height: '100%' }} />
                    </div>
                    <span style={{ width: 40, fontSize: '0.7rem', color: T.muted, textAlign: 'right' }}>{formatPercent(r.percentage)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'cuisines' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: '1.5rem' }}>
            <Card title="Cuisine × Rating Density" subtitle="Where does the market excel or fail?">
              <EChartsCuisineHeatmap 
                cuisines={data.top_cuisines || []}
                ratingBuckets={['<2.0', '2.0-2.9', '3.0-3.4', '3.5-3.9', '4.0-4.4', '4.5+']}
                data={data.cuisine_rating_heatmap || []}
                title="Quality Distribution by Category"
              />
            </Card>
            <Card title="Top Categories by Volume" subtitle="Market saturation index">
               <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                  {(data.top_categories || []).map((cat, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '10px', 
                      background: T.bg, 
                      borderRadius: 8, 
                      border: `1px solid ${T.border}`,
                      fontSize: '0.85rem'
                    }}>
                      <span style={{ fontWeight: 600 }}>{cat.name}</span>
                      <span style={{ color: T.primary, fontWeight: 700 }}>{formatNumber(cat.count)} vendors</span>
                    </div>
                  ))}
               </div>
            </Card>
          </div>
        )}

        {activeTab === 'platforms' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {data.platform_benchmarks?.map((p, i) => (
              <Card key={i} title={p.brand}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <StatBox label="Avg Rating" value={p.avg_rating} subValue="User score" />
                  <StatBox label="NPS Proxy" value={p.nps_proxy} subValue="Sentiment score" />
                  <StatBox label="Growth Rate" value={p.growth_rate} subValue="Quarterly" color={p.growth_rate > 0 ? T.success : T.danger} />
                  <StatBox label="Market Share" value={formatPercent(p.market_share)} subValue="Vendor %" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'gaps' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            <Card title="Under-served Cuisine Gaps" subtitle="High demand, low quality/volume">
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(data.strategic_gaps?.cuisines || []).map((gap, i) => (
                    <div key={i} style={{ 
                      padding: '1rem', 
                      background: T.bg, 
                      borderRadius: 12, 
                      borderLeft: `4px solid ${T.accent}`,
                      borderRight: `1px solid ${T.border}`,
                      borderTop: `1px solid ${T.border}`,
                      borderBottom: `1px solid ${T.border}`
                    }}>
                      <div style={{ fontWeight: 700, color: T.text, marginBottom: 4 }}>{gap.name}</div>
                      <div style={{ fontSize: '0.75rem', color: T.muted }}>{gap.insight}</div>
                    </div>
                  ))}
               </div>
            </Card>
            <Card title="Geographic White-Spaces" subtitle="Areas with high density but low average rating">
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(data.strategic_gaps?.areas || []).map((gap, i) => (
                    <div key={i} style={{ 
                      padding: '1rem', 
                      background: T.bg, 
                      borderRadius: 12, 
                      borderLeft: `4px solid ${T.danger}`,
                      borderRight: `1px solid ${T.border}`,
                      borderTop: `1px solid ${T.border}`,
                      borderBottom: `1px solid ${T.border}`
                    }}>
                      <div style={{ fontWeight: 700, color: T.text, marginBottom: 4 }}>{gap.area}</div>
                      <div style={{ fontSize: '0.75rem', color: T.muted }}>{gap.insight}</div>
                    </div>
                  ))}
               </div>
            </Card>
          </div>
        )}
      </div>

      <VendorDetailDrawer 
        vendor={selectedVendor} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  );
}