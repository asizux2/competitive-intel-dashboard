import React, { useState, useEffect, useMemo } from 'react';
import { T, formatNumber, formatPercent } from './lib';
import GlobalSlicerBar from './components/GlobalSlicerBar';
import VendorSearchTable from './components/VendorSearchTable';
import VendorDetailDrawer from './components/VendorDetailDrawer';
import AnimKPI from './components/AnimKPI';
import MapPanel from './components/map/MapPanel';
import EChartsHeatmap from './components/charts/EChartsHeatmap';
import EChartsTreemap from './components/charts/EChartsTreemap';
import EChartsRadar from './components/charts/EChartsRadar';
import EChartsScatter from './components/charts/EChartsScatter';
import EChartsCuisineHeatmap from './components/charts/EChartsCuisineHeatmap';
import EChartsBar from './components/charts/EChartsBar';
import GroceryTab from './components/tabs/GroceryTab';
import PromotionsTab from './components/tabs/PromotionsTab';
import CommissionTab from './components/tabs/CommissionTab';
import SeasonalTab from './components/tabs/SeasonalTab';
import AttackTab from './components/tabs/AttackTab';
import PriceTrackerTab from './components/tabs/PriceTrackerTab';

// ─── Shared UI Primitives ─────────────────────────────────────────────────────
const Card = ({ title, subtitle, children, style }) => (
  <div style={{
    background: T.card, border: `1px solid ${T.border}`,
    borderRadius: 16, padding: '1.5rem',
    display: 'flex', flexDirection: 'column', ...style,
  }}>
    {title && (
      <div style={{ marginBottom: '1.1rem' }}>
        <h3 style={{ color: T.text, margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{title}</h3>
        {subtitle && <p style={{ color: T.muted, margin: '3px 0 0 0', fontSize: '0.72rem' }}>{subtitle}</p>}
      </div>
    )}
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

const TabSection = ({ children }) => (
  <div style={{ display: 'grid', gap: '1.5rem' }}>{children}</div>
);

// ─── Loading / Error States ───────────────────────────────────────────────────
const LoadingScreen = () => (
  <div style={{
    background: '#0A0A0A', minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
  }}>
    <div style={{
      width: 48, height: 48, border: '4px solid #1E1E1E',
      borderTop: `4px solid ${T.primary}`, borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <div style={{ color: T.muted, fontSize: '0.9rem' }}>Loading Market Intelligence…</div>
    <div style={{ color: T.border, fontSize: '0.72rem' }}>Egypt Food Delivery · Competitive Intelligence Dashboard</div>
  </div>
);

const ErrorScreen = ({ message }) => (
  <div style={{
    background: '#0A0A0A', minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12,
  }}>
    <div style={{ fontSize: '2rem' }}>⚠️</div>
    <div style={{ color: T.text, fontWeight: 700, fontSize: '1.1rem' }}>Data failed to load</div>
    <div style={{ color: T.muted, fontSize: '0.8rem', maxWidth: 400, textAlign: 'center' }}>{message}</div>
    <button onClick={() => window.location.reload()}
      style={{ marginTop: 8, padding: '8px 20px', background: T.primary, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
      Retry
    </button>
  </div>
);

// ─── Tab configuration ────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',    label: 'Market Overview',         icon: '📊', group: 'Core' },
  { id: 'geo',         label: 'Geographic Intel',         icon: '🗺️', group: 'Core' },
  { id: 'vendors',     label: 'Vendor Explorer',          icon: '🔍', group: 'Core' },
  { id: 'landscape',   label: 'Competitive Landscape',    icon: '🏔️', group: 'Strategy' },
  { id: 'grocery',     label: 'Grocery Intelligence',     icon: '🛒', group: 'Strategy' },
  { id: 'promotions',  label: 'Promotions Intel',         icon: '🎁', group: 'Strategy' },
  { id: 'pricetracker',label: 'Price Tracker',            icon: '💹', group: 'Strategy' },
  { id: 'sentiment',   label: 'Sentiment & Quality',      icon: '⭐', group: 'Operations' },
  { id: 'cuisines',    label: 'Cuisine & Category',       icon: '🍕', group: 'Operations' },
  { id: 'commission',  label: 'Commission Economics',     icon: '💰', group: 'Operations' },
  { id: 'seasonal',    label: 'Seasonal Playbook',        icon: '📅', group: 'Intelligence' },
  { id: 'gaps',        label: 'Strategic Gaps',           icon: '🎯', group: 'Intelligence' },
  { id: 'attack',      label: 'Attack Playbook',          icon: '⚔️', group: 'Intelligence' },
];

const GROUPS = ['Core', 'Strategy', 'Operations', 'Intelligence'];
const GROUP_COLORS = { Core: T.primary, Strategy: T.success, Operations: T.accent, Intelligence: T.danger };

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function CompetitiveIntelDashboard() {
  const [data, setData] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeGroup, setActiveGroup] = useState('Core');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    types: [], rating: { min: 0, max: 5 }, confidence: { min: 0 }, brand: null, search: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [resData, resVendors] = await Promise.all([
          fetch('/data.json').then(r => { if (!r.ok) throw new Error(`data.json: ${r.status}`); return r.json(); }),
          fetch('/vendors_geojson.json').then(r => { if (!r.ok) throw new Error(`vendors_geojson.json: ${r.status}`); return r.json(); }),
        ]);
        setData(resData);
        setVendors(resVendors.features.map(f => ({
          id: f.properties.id || Math.random(),
          ...f.properties,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        })));
      } catch (err) {
        console.error('Dashboard load failed:', err);
        setData({ _error: err.message || 'Unknown error' });
      }
    }
    loadData();
  }, []);

  const vendorStats = useMemo(() => {
    const stats = {};
    vendors.forEach(v => { stats[v.type] = (stats[v.type] || 0) + 1; });
    return stats;
  }, [vendors]);

  const filteredVendors = useMemo(() => vendors.filter(v => {
    if (filters.types.length && !filters.types.includes(v.type)) return false;
    if (v.rating < filters.rating.min || v.rating > filters.rating.max) return false;
    if (filters.search && !v.name?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }), [vendors, filters]);

  // ── Early returns ──
  if (!data) return <LoadingScreen />;
  if (data._error) return <ErrorScreen message={data._error} />;

  // ── Tab navigation helpers ──
  const visibleTabs = TABS.filter(t => t.group === activeGroup);
  const openVendorDrawer = (v) => { setSelectedVendor(v); setIsDrawerOpen(true); };

  const topAreasByVendorCount = useMemo(() => {
    const counts = {};
    vendors.forEach(v => { if (v.area) counts[v.area] = (counts[v.area] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value }));
  }, [vendors]);

  const vendorTypeData = useMemo(() => {
    return Object.entries(vendorStats).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [vendorStats]);

  return (
    <div style={{ backgroundColor: T.bg, color: T.text, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* ── Sticky Top Bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#0A0A0AEE', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${T.border}`,
        padding: '0.75rem 2rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.success, boxShadow: `0 0 6px ${T.success}` }} />
            <span style={{ color: T.text, fontWeight: 800, fontSize: '1rem' }}>Egypt Food Delivery</span>
            <span style={{ color: T.muted, fontWeight: 400, fontSize: '0.85rem' }}>Competitive Intelligence Dashboard</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ color: T.muted, fontSize: '0.7rem' }}>
              <span style={{ color: T.success, fontWeight: 700 }}>{formatNumber(vendors.length)}</span> vendors · <span style={{ color: T.accent, fontWeight: 700 }}>April 2026</span> · 13 intelligence tabs
            </div>
          </div>
        </div>

        {/* Group navigation */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {GROUPS.map(g => (
            <button key={g} onClick={() => { setActiveGroup(g); setActiveTab(TABS.find(t => t.group === g).id); }}
              style={{
                background: activeGroup === g ? GROUP_COLORS[g] + '22' : 'transparent',
                border: `1px solid ${activeGroup === g ? GROUP_COLORS[g] : T.border}`,
                color: activeGroup === g ? GROUP_COLORS[g] : T.muted,
                padding: '4px 14px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              {g}
            </button>
          ))}
          <div style={{ width: 1, height: 20, background: T.border, margin: '0 4px' }} />
          {visibleTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? T.card : 'transparent',
                border: `1px solid ${activeTab === tab.id ? GROUP_COLORS[tab.group] : T.border}`,
                color: activeTab === tab.id ? T.text : T.muted,
                padding: '4px 12px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
              <span style={{ fontSize: '0.8rem' }}>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Page Content ── */}
      <div style={{ padding: '1.5rem 2rem 3rem' }}>
        {/* Global Slicer */}
        {['overview', 'geo', 'vendors', 'landscape'].includes(activeTab) && (
          <div style={{ marginBottom: '1.25rem' }}>
            <GlobalSlicerBar filters={filters} onFilterChange={setFilters} vendorStats={vendorStats} />
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <TabSection>
            {/* Animated KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <AnimKPI label="Total Vendors Mapped" value={9018} color={T.primary} icon="🏪" subValue="Across all platforms · Egypt" />
              <AnimKPI label="Market Leader NPS" value={34} prefix="+" color={T.success} icon="⭐" subValue="Consumer sentiment proxy score" />
              <AnimKPI label="Avg. Market Rating" value={4.2} color={T.accent} suffix="★" decimals={1} icon="📊" subValue="Aggregate user rating" />
              <AnimKPI label="Platform Commission" value={22} suffix="%" color={T.danger} icon="💰" subValue="Avg (range: 15–30%)" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <AnimKPI label="Grocery Stores Tracked" value={12} color="#22D3EE" icon="🛒" subValue="12 stores · 10 benchmark SKUs" />
              <AnimKPI label="Governorates Covered" value={26} color={T.purple} icon="🗺️" subValue="Talabat Mart: 8 governorates" />
              <AnimKPI label="T-Pro Monthly Fee" value={79} suffix=" EGP" color={T.accent} icon="👑" subValue="799 EGP/year" />
              <AnimKPI label="Ramadan GMV Uplift" value={85} suffix="%" color={T.danger} icon="🌙" subValue="vs average month baseline" />
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <Card title="Vendor Type Distribution" subtitle="Market share by vendor count across all 9,018 vendors">
                <EChartsBar data={vendorTypeData.slice(0, 8)} color={T.primary} horizontal height={300} showLabel labelFormatter={(p) => p.value.toLocaleString()} />
              </Card>
              <Card title="Top 10 Areas by Vendor Density" subtitle="Where the market is most concentrated">
                <EChartsBar data={topAreasByVendorCount} color={T.success} horizontal height={300} showLabel labelFormatter={(p) => p.value.toLocaleString()} />
              </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <Card title="Platform Distribution" subtitle="Volume split by platform">
                <EChartsTreemap data={data.platform_distribution} title="Vendor Volume per Brand" />
              </Card>
              <Card title="Market Health Indicators" subtitle="Key operational metrics">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Avg. Delivery Time', value: '34 min', color: T.success, note: '-4 min vs 2024' },
                    { label: 'Order Accuracy Rate', value: '91%', color: T.success, note: '+2% vs competitors' },
                    { label: 'Customer Support Score', value: '3.8/5', color: T.danger, note: '#1 complaint driver' },
                    { label: 'Delivery Fee (non-T-Pro)', value: '9–25 EGP', color: T.accent, note: 'Per order average' },
                    { label: 'Breadfast Free Del Threshold', value: '35 EGP', color: T.danger, note: 'vs Talabat 150 EGP (4.3×)' },
                    { label: 'First Order Discount', value: '100 EGP off', color: T.primary, note: 'Min 200 EGP (code ALC100)' },
                  ].map(m => (
                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: T.bg, borderRadius: 8, border: `1px solid ${T.border}` }}>
                      <span style={{ color: T.muted, fontSize: '0.75rem' }}>{m.label}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: m.color, fontWeight: 700, fontSize: '0.85rem' }}>{m.value}</div>
                        <div style={{ color: T.muted, fontSize: '0.62rem' }}>{m.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Data Confidence Summary" subtitle="Intelligence quality scorecard">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: '🟢 HIGH Confidence Points', value: '47', color: T.success },
                    { label: '🟡 MEDIUM Confidence Points', value: '31', color: T.warning },
                    { label: '🔴 LOW / Estimated Points', value: '12', color: T.danger },
                    { label: '⚫ Unresolved Data Gaps', value: '8', color: T.muted },
                    { label: 'Overall Report Confidence', value: '84%', color: T.primary },
                  ].map(m => (
                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: T.bg, borderRadius: 8, border: `1px solid ${T.border}` }}>
                      <span style={{ color: T.muted, fontSize: '0.75rem' }}>{m.label}</span>
                      <span style={{ color: m.color, fontWeight: 700 }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabSection>
        )}

        {/* ── GEOGRAPHIC INTEL ── */}
        {activeTab === 'geo' && (
          <TabSection>
            <Card title="Geographic Intelligence — 9,018 Vendor Map" subtitle="Interactive map with heatmap overlay. Click any vendor for deep-dive. Filter by type above.">
              <MapPanel vendors={filteredVendors} filters={filters} onVendorSelect={openVendorDrawer} />
            </Card>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <Card title="Top 10 Areas by Vendor Density" subtitle="Most saturated markets — highest competition zones">
                <EChartsBar data={topAreasByVendorCount} color={T.primary} horizontal height={280} />
              </Card>
              <Card title="Vendor Type Heatmap by Area" subtitle="Where each category clusters geographically">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(data.strategic_gaps?.areas || []).slice(0, 6).map((gap, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: T.bg, borderRadius: 10, borderLeft: `3px solid ${T.danger}`, border: `1px solid ${T.border}` }}>
                      <div style={{ fontWeight: 700, color: T.text, fontSize: '0.82rem' }}>{gap.area}</div>
                      <div style={{ fontSize: '0.72rem', color: T.muted, marginTop: 2 }}>{gap.insight}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabSection>
        )}

        {/* ── VENDOR EXPLORER ── */}
        {activeTab === 'vendors' && (
          <TabSection>
            <VendorSearchTable vendors={filteredVendors} filters={filters} onVendorSelect={openVendorDrawer} />
          </TabSection>
        )}

        {/* ── COMPETITIVE LANDSCAPE ── */}
        {activeTab === 'landscape' && (
          <TabSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <Card title="Brand Capability Radar" subtitle="Comparative strengths across 6 key pillars">
                <EChartsRadar indicators={data.brand_comparison_radar?.indicators || []} brands={data.brand_comparison_radar?.brands || []} title="Competitive Benchmarking" />
              </Card>
              <Card title="Market Positioning Matrix" subtitle="Rating vs Market Share — bubble = vendor count">
                <EChartsScatter data={data.market_positioning_scatter || []} xLabel="Avg Rating" yLabel="Market Share %" sizeLabel="Vendor Count" title="Positioning Analysis" />
              </Card>
            </div>
            <Card title="Platform Head-to-Head Benchmarking" subtitle="Comprehensive cross-platform metrics comparison (April 2026)">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      {['Platform', 'Vendors', 'Coverage', 'Avg Rating', 'Free Del Threshold', 'New User Deal', 'Commission %', 'NPS Proxy', 'Flash Deals'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', borderBottom: `1px solid ${T.border}`, color: T.muted, fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { p: '🔵 Talabat', v: '9,018', cov: '26 gov', r: '4.2', del: '150 EGP (T-Pro)', nu: '100 EGP off', com: '15–30%', nps: '+34', flash: 'Mon+Wed', hl: true },
                      { p: '🟢 Breadfast', v: '~500', cov: 'Cairo', r: '4.5', del: '35 EGP (!) 4.3× lower', nu: 'Free del + credit', com: 'N/A (own stock)', nps: '+52 est.', flash: 'Daily', hl: false },
                      { p: '🟣 Rabbit', v: '~300', cov: 'Cairo', r: '4.3', del: 'Free 1st order', nu: 'Free first order', com: '15–25% est.', nps: '+28 est.', flash: 'Occasional', hl: false },
                      { p: '🔴 Elmenus', v: '~2,000', cov: 'Cairo', r: '3.8', del: 'N/A', nu: '% off first order', com: '12–20%', nps: '+10 est.', flash: 'Weekly', hl: false },
                      { p: '🟡 InstaShop', v: '~800', cov: 'Cairo+Alex', r: '4.0', del: '100 EGP', nu: 'Free del promo', com: '15–22% est.', nps: '+18 est.', flash: 'Monthly', hl: false },
                    ].map((row, i) => (
                      <tr key={i} style={{ background: row.hl ? T.primary + '11' : 'transparent', borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: T.text }}>{row.p}</td>
                        <td style={{ padding: '10px 12px', color: T.text }}>{row.v}</td>
                        <td style={{ padding: '10px 12px', color: T.muted }}>{row.cov}</td>
                        <td style={{ padding: '10px 12px', color: T.accent, fontWeight: 700 }}>{row.r}</td>
                        <td style={{ padding: '10px 12px', color: row.del.includes('35 EGP') ? T.danger : T.text, fontWeight: row.del.includes('35 EGP') ? 700 : 400 }}>{row.del}</td>
                        <td style={{ padding: '10px 12px', color: T.muted }}>{row.nu}</td>
                        <td style={{ padding: '10px 12px', color: T.muted }}>{row.com}</td>
                        <td style={{ padding: '10px 12px', color: T.success, fontWeight: 700 }}>{row.nps}</td>
                        <td style={{ padding: '10px 12px', color: T.muted }}>{row.flash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 12, padding: '8px 14px', background: T.danger + '22', border: `1px solid ${T.danger}`, borderRadius: 8, fontSize: '0.76rem' }}>
                <strong style={{ color: T.danger }}>🔴 Critical: </strong>
                <span style={{ color: T.text }}>Breadfast's 35 EGP free delivery threshold is 4.3× lower than Talabat's 150 EGP T-Pro minimum. This is the #1 competitive vulnerability in the market.</span>
              </div>
            </Card>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {(data.platform_benchmarks || []).map((p, i) => (
                <Card key={i} title={p.brand}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { label: 'Avg Rating', value: p.avg_rating, color: T.accent },
                      { label: 'NPS Proxy', value: p.nps_proxy, color: T.success },
                      { label: 'Growth Rate', value: p.growth_rate, color: p.growth_rate > 0 ? T.success : T.danger },
                      { label: 'Market Share', value: formatPercent(p.market_share), color: T.primary },
                    ].map(s => (
                      <div key={s.label} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: '0.75rem', textAlign: 'center' }}>
                        <div style={{ color: T.muted, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ color: s.color, fontWeight: 800, fontSize: '1.1rem' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabSection>
        )}

        {/* ── GROCERY INTELLIGENCE ── */}
        {activeTab === 'grocery' && <GroceryTab />}

        {/* ── PROMOTIONS INTEL ── */}
        {activeTab === 'promotions' && <PromotionsTab />}

        {/* ── PRICE TRACKER ── */}
        {activeTab === 'pricetracker' && <PriceTrackerTab />}

        {/* ── SENTIMENT & QUALITY ── */}
        {activeTab === 'sentiment' && (
          <TabSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <Card title="Cuisine × Sentiment Heatmap" subtitle="Quality gaps by food category — red = poor sentiment">
                <EChartsHeatmap data={data.cuisine_sentiment_heatmap || []} xLabels={data.sentiment_labels || ['Negative', 'Neutral', 'Positive']} yLabels={data.top_cuisines || []} title="Sentiment Density" />
              </Card>
              <Card title="Rating Distribution" subtitle="Market-wide quality spread — what % of vendors fall in each bucket">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(data.rating_distribution || []).map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 80, fontSize: '0.78rem', color: T.text, flexShrink: 0 }}>{r.bucket}</span>
                      <div style={{ flex: 1, background: T.bg, height: 12, borderRadius: 6, overflow: 'hidden', border: `1px solid ${T.border}` }}>
                        <div style={{ width: `${r.percentage}%`, background: T.primary, height: '100%' }} />
                      </div>
                      <span style={{ width: 44, fontSize: '0.72rem', color: T.muted, textAlign: 'right' }}>{formatPercent(r.percentage)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              {[
                { title: 'Top Complaint Themes', items: ['Delivery delays (35%)', 'Wrong items delivered (22%)', 'Poor app support (18%)', 'Cold food on arrival (15%)', 'Missing items (10%)'], color: T.danger },
                { title: 'Top Praise Themes', items: ['Speed of delivery (42%)', 'Wide restaurant selection (38%)', 'Easy app navigation (28%)', 'Good value promos (22%)', 'Accurate tracking (20%)'], color: T.success },
                { title: 'NPS Driver Analysis', items: ['Free delivery (T-Pro): +12 pts', 'On-time delivery: +9 pts', 'Flash deals: +7 pts', 'Wrong orders: -15 pts', 'Long wait time: -11 pts'], color: T.primary },
              ].map(section => (
                <Card key={section.title} title={section.title}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {section.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderBottom: `1px solid ${T.border}` }}>
                        <span style={{ color: section.color, fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>{i + 1}.</span>
                        <span style={{ color: T.text, fontSize: '0.78rem' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabSection>
        )}

        {/* ── CUISINE & CATEGORY ── */}
        {activeTab === 'cuisines' && (
          <TabSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <Card title="Cuisine × Rating Density" subtitle="Where does the market excel or fail by food category?">
                <EChartsCuisineHeatmap cuisines={data.top_cuisines || []} ratingBuckets={['<2.0', '2.0-2.9', '3.0-3.4', '3.5-3.9', '4.0-4.4', '4.5+']} data={data.cuisine_rating_heatmap || []} title="Quality Distribution by Category" />
              </Card>
              <Card title="Top Categories by Volume" subtitle="Market saturation index — opportunities where supply is thin">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(data.top_categories || []).map((cat, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: T.primary, fontWeight: 800, width: 20 }}>#{i + 1}</span>
                        <span style={{ fontWeight: 600, color: T.text }}>{cat.name}</span>
                      </div>
                      <span style={{ color: T.primary, fontWeight: 700 }}>{formatNumber(cat.count)} vendors</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabSection>
        )}

        {/* ── COMMISSION ECONOMICS ── */}
        {activeTab === 'commission' && <CommissionTab />}

        {/* ── SEASONAL PLAYBOOK ── */}
        {activeTab === 'seasonal' && <SeasonalTab />}

        {/* ── STRATEGIC GAPS ── */}
        {activeTab === 'gaps' && (
          <TabSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <Card title="Under-served Cuisine Gaps" subtitle="High demand categories with low quality or volume — the best entry points">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {(data.strategic_gaps?.cuisines || []).map((gap, i) => (
                    <div key={i} style={{ padding: '1rem', background: T.bg, borderRadius: 12, borderLeft: `4px solid ${T.accent}`, border: `1px solid ${T.border}` }}>
                      <div style={{ fontWeight: 700, color: T.text, marginBottom: 4 }}>{gap.name}</div>
                      <div style={{ fontSize: '0.75rem', color: T.muted }}>{gap.insight}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Geographic White-Spaces" subtitle="High population density areas with low vendor coverage or poor quality">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {(data.strategic_gaps?.areas || []).map((gap, i) => (
                    <div key={i} style={{ padding: '1rem', background: T.bg, borderRadius: 12, borderLeft: `4px solid ${T.danger}`, border: `1px solid ${T.border}` }}>
                      <div style={{ fontWeight: 700, color: T.text, marginBottom: 4 }}>{gap.area}</div>
                      <div style={{ fontSize: '0.75rem', color: T.muted }}>{gap.insight}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              {[
                { title: '🚚 Delivery Gap', icon: '🚚', color: T.danger, points: ['Free delivery threshold: Talabat 150 EGP vs Breadfast 35 EGP', '18 governorates have zero dark store coverage', 'Delivery time drops sharply outside Cairo (avg 55 min vs 34 min)'] },
                { title: '📱 UX Gap', icon: '📱', color: T.primary, points: ['Arabic-first grocery UX missing — 60% Arabic users', 'No integrated loyalty points program (T-Pro is subscription-only)', 'No real-time live chat support — average response: 8 hours'] },
                { title: '🤝 Vendor Gap', icon: '🤝', color: T.success, points: ['Only 2 premium grocery partners (Spinneys + Gourmet)', 'No exclusive restaurant partnerships locked in', 'Commission (22% avg) is 10pp above challenger rate opportunity'] },
              ].map(section => (
                <Card key={section.title} title={section.title}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {section.points.map((p, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: `1px solid ${T.border}` }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: section.color, marginTop: 5, flexShrink: 0 }} />
                        <span style={{ color: T.text, fontSize: '0.78rem', lineHeight: 1.4 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabSection>
        )}

        {/* ── ATTACK PLAYBOOK ── */}
        {activeTab === 'attack' && <AttackTab />}
      </div>

      {/* Vendor Drawer */}
      <VendorDetailDrawer vendor={selectedVendor} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
