import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { T } from '../../lib';

const PROMO_TYPES = [
  {
    id: 1, icon: '🚚', name: 'Free Delivery',
    color: '#22C55E',
    mechanics: 'Zero delivery fee funded by platform (T-Pro) or vendor-subsidized orders',
    depth: { platform: '100%', vendor: '60%', cofunded: '80%' },
    minOrder: { platform: '150 EGP (rest) / 180 EGP (supermarket) / 200 EGP (hypermarket)', vendor: '80–150 EGP (varies)' },
    funding: 'Platform (T-Pro) + Vendor (self-funded)',
    fundingSplit: { platform: 65, vendor: 35 },
    eligibleVendors: ['All restaurants (T-Pro)', 'Selected grocery stores', 'Talabat Mart (all orders)'],
    frequency: 'Always (T-Pro) / Periodic (campaigns)',
    avgOrderLift: '+28% vs paid delivery',
    examples: [
      { vendor: 'Talabat Mart', detail: 'Free delivery always for T-Pro subscribers', confidence: 'HIGH' },
      { vendor: 'Spinneys', detail: 'Free delivery for T-Pro above 150 EGP', confidence: 'HIGH' },
      { vendor: 'Breadfast (competitor)', detail: 'Free delivery above 35 EGP — 4.3× lower threshold than Talabat', confidence: 'HIGH' },
    ],
    strategicInsight: 'Breadfast\'s 35 EGP free delivery threshold vs Talabat\'s 150 EGP is the single biggest competitive gap in the market.',
    confidenceScore: 'HIGH',
  },
  {
    id: 2, icon: '%', name: 'Percentage Discount',
    color: '#1E88E5',
    mechanics: 'X% off the order total — applied at checkout before delivery fee',
    depth: { platform: '20–60%', vendor: '10–25%', cofunded: '15–40%' },
    minOrder: { platform: '100–200 EGP', vendor: '80–150 EGP' },
    funding: 'Platform-funded during campaigns / Vendor-funded for repeat customer deals',
    fundingSplit: { platform: 55, vendor: 45 },
    eligibleVendors: ['All vendor types', 'Priority: fast food chains & grocery'],
    frequency: 'Campaign-based (Ramadan, EID, flash periods)',
    avgOrderLift: '+35% conversion rate during active promo',
    examples: [
      { vendor: 'KFC Egypt', detail: '20% off every Tuesday via Talabat Offers tab', confidence: 'MEDIUM' },
      { vendor: "McDonald's Egypt", detail: '15% off on Talabat platform (app-exclusive)', confidence: 'MEDIUM' },
      { vendor: 'Platform-wide (Ramadan)', detail: 'Up to 60% off rotating vendors during Ramadan', confidence: 'HIGH' },
      { vendor: 'New User (all vendors)', detail: '~50% off first order (not officially confirmed)', confidence: 'MEDIUM' },
    ],
    strategicInsight: 'Percentage discounts are the highest-volume promo type. Platform absorbs most of the cost during peak seasons — vendor margin impact is limited.',
    confidenceScore: 'HIGH',
  },
  {
    id: 3, icon: '💸', name: 'Fixed Amount Off',
    color: '#F9A825',
    mechanics: 'Flat EGP reduction applied to order total above a minimum threshold',
    depth: { platform: '30–100 EGP', vendor: '15–50 EGP', cofunded: '20–60 EGP' },
    minOrder: { platform: '150–200 EGP', vendor: '100–150 EGP' },
    funding: 'Platform (new user / referral) + Vendor (retention)',
    fundingSplit: { platform: 70, vendor: 30 },
    eligibleVendors: ['All vendors (new user promo)', 'Selected vendors (vendor-funded)'],
    frequency: 'New user: always / Vendor: periodic',
    avgOrderLift: '+22% average order value (AOV uplift from minimum)',
    examples: [
      { vendor: 'Talabat New User (code ALC100)', detail: '100 EGP off first order above 200 EGP', confidence: 'HIGH' },
      { vendor: 'Referral Program', detail: '30–50 EGP off for referrer + 30 EGP for referee', confidence: 'MEDIUM' },
      { vendor: 'Coupon codes (TALA056)', detail: 'Periodic 25–75 EGP off codes shared via influencers', confidence: 'MEDIUM' },
    ],
    strategicInsight: 'Fixed-amount promos drive the highest AOV because users inflate their cart to meet the minimum. The 200 EGP min on the 100 EGP discount is highly effective.',
    confidenceScore: 'HIGH',
  },
  {
    id: 4, icon: '🎁', name: 'Buy X Get Y (Bundle)',
    color: '#A855F7',
    mechanics: 'Purchase a qualifying item to receive a free/discounted secondary item',
    depth: { platform: 'Free item (100% off secondary)', vendor: '50–100% off secondary item', cofunded: '50%' },
    minOrder: { platform: 'Varies', vendor: 'Usually single qualifying item' },
    funding: 'Primarily vendor-funded (product cost absorbed by brand)',
    fundingSplit: { platform: 20, vendor: 80 },
    eligibleVendors: ['Fast food chains', 'Coffee shops', 'Grocery (multi-pack)'],
    frequency: 'Always for fast food / Monthly for grocery',
    avgOrderLift: '+18% basket size increase',
    examples: [
      { vendor: 'Pizza Hut Egypt', detail: 'Free garlic bread with any large pizza', confidence: 'MEDIUM' },
      { vendor: 'Cinnabon Egypt', detail: 'Buy 3 get 1 free on classic cinnamon rolls', confidence: 'MEDIUM' },
      { vendor: 'Talabat Mart', detail: 'Buy 2 get 1 free on selected Pepsi packs', confidence: 'MEDIUM' },
      { vendor: 'Hardee\'s', detail: 'Combo meal upgrade: free medium fries with any burger', confidence: 'MEDIUM' },
    ],
    strategicInsight: 'BXGY deals are almost entirely vendor-funded — lowest platform cost. Highest satisfaction per promo dollar. Under-utilized in grocery category.',
    confidenceScore: 'MEDIUM',
  },
  {
    id: 5, icon: '⚡', name: 'Flash / Limited-Time Deal',
    color: '#EF5F17',
    mechanics: 'Time-boxed discount (2–24 hours) featuring in "Talabat Offers" tab with prime visibility',
    depth: { platform: '25–50%', vendor: '20–40%', cofunded: '30–50%' },
    minOrder: { platform: '100 EGP', vendor: 'Varies' },
    funding: 'Co-funded (platform provides visibility + vendor provides discount)',
    fundingSplit: { platform: 40, vendor: 60 },
    eligibleVendors: ['Vendors who apply to the Talabat Offers program', 'Priority: high-rating vendors (4.0+)'],
    frequency: 'Daily on Talabat Offers tab / Happy Hour: Mon + Wed',
    avgOrderLift: '+45% order volume during active flash period',
    examples: [
      { vendor: 'Happy Hour (Platform)', detail: 'Mon & Wed flash deals across 50+ vendors at 40%+ off', confidence: 'HIGH' },
      { vendor: 'Koshary El Tahrir', detail: 'Periodic flash 25% off visible on Offers tab', confidence: 'MEDIUM' },
      { vendor: 'KFC Egypt', detail: 'Bucket deal flash on Friday evenings', confidence: 'MEDIUM' },
      { vendor: 'Dairy Queen', detail: 'Blizzard 2-for-1 flash deal (summer peak)', confidence: 'LOW' },
    ],
    strategicInsight: 'Flash deals drive 45% order spike but rely on Talabat Offers tab visibility. A competitor with predictable daily flash deals at fixed times (12PM, 6PM) could build habitual ordering behavior.',
    confidenceScore: 'HIGH',
  },
  {
    id: 6, icon: '🏆', name: 'Loyalty / Repeat Order',
    color: '#22D3EE',
    mechanics: 'Subscription (T-Pro), points accumulation, or streak rewards for frequent orderers',
    depth: { platform: 'Free delivery (T-Pro) + exclusive deals', vendor: 'Stamps/rewards', cofunded: 'Mixed' },
    minOrder: { platform: '100 EGP+ (T-Pro free delivery threshold)' },
    funding: 'Platform-funded (T-Pro) / Vendor-funded (stamp cards)',
    fundingSplit: { platform: 75, vendor: 25 },
    eligibleVendors: ['All vendors (T-Pro)', 'Selected vendors (stamp programs)'],
    frequency: 'T-Pro: monthly/annual subscription / Stamps: per order',
    avgOrderLift: '+3.2× order frequency vs non-loyalty users',
    examples: [
      { vendor: 'T-Pro Subscription', detail: '79 EGP/month or 799 EGP/year — free delivery + exclusive deals', confidence: 'HIGH' },
      { vendor: 'Referral program', detail: 'Earn credit for each successful referral (30–50 EGP)', confidence: 'MEDIUM' },
      { vendor: 'Vendor stamp cards', detail: 'Limited integration — most stamps are offline only', confidence: 'LOW' },
    ],
    strategicInsight: 'T-Pro is the most powerful retention tool but no formal points/rewards system exists. Breadfast and Rabbit both offer more intuitive loyalty mechanics. Massive gap for a new entrant.',
    confidenceScore: 'HIGH',
  },
  {
    id: 7, icon: '📅', name: 'Seasonal / Campaign',
    color: '#EF4444',
    mechanics: 'Time-limited promotional campaigns tied to cultural/seasonal events with co-branding',
    depth: { platform: '30–60%', vendor: '20–40%', cofunded: '25–50%' },
    minOrder: { platform: '100–200 EGP' },
    funding: 'Co-funded (platform + vendor + sometimes brand sponsor)',
    fundingSplit: { platform: 45, vendor: 40, sponsor: 15 },
    eligibleVendors: ['Premium and mid-range chains', 'Selected grocery partners'],
    frequency: 'Ramadan, EID al-Fitr, EID al-Adha, Back-to-School, Summer, Valentines, National Day',
    avgOrderLift: 'Ramadan: +85% vs normal / EID: +60% / Summer: +25%',
    examples: [
      { vendor: 'Ramadan Campaign 2025', detail: 'Up to 60% off, Suhoor & Iftar special menus, Happy Hour promos', confidence: 'HIGH' },
      { vendor: 'EID al-Fitr 2025', detail: '30–40% off premium desserts, gift hampers + free delivery', confidence: 'HIGH' },
      { vendor: 'Back-to-School (Sep)', detail: 'Talabat Mart: 40% off school supplies + stationery', confidence: 'MEDIUM' },
      { vendor: 'National Day (Jul 23)', detail: 'Egypt-themed packaging promotions across fast food chains', confidence: 'MEDIUM' },
    ],
    strategicInsight: 'Ramadan is by far the highest-volume campaign. Platform GMV increases 85%+ in Ramadan month. Any competitor without a Ramadan strategy is invisible during the most important revenue period.',
    confidenceScore: 'HIGH',
  },
];

const CONF_COLORS = { HIGH: '#22C55E', MEDIUM: '#F9A825', LOW: '#EF4444' };

const Card = ({ children, style }) => (
  <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: 14, padding: '1.25rem', ...style }}>
    {children}
  </div>
);

function FundingMatrixChart() {
  const types = PROMO_TYPES.map(p => p.name);
  const platformVals = PROMO_TYPES.map(p => p.fundingSplit.platform);
  const vendorVals = PROMO_TYPES.map(p => p.fundingSplit.vendor);

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#111111', borderColor: '#1E1E1E', textStyle: { color: '#F5F5F5', fontSize: 11 } },
    legend: { data: ['Platform-Funded %', 'Vendor-Funded %'], textStyle: { color: '#9CA3AF', fontSize: 10 }, top: 0 },
    grid: { top: 36, right: 16, bottom: 60, left: 140, containLabel: false },
    xAxis: { type: 'value', max: 100, axisLabel: { color: '#9CA3AF', fontSize: 10, formatter: '{value}%' }, splitLine: { lineStyle: { color: '#1E1E1E', type: 'dashed' } }, axisLine: { show: false } },
    yAxis: { type: 'category', data: types, axisLabel: { color: '#F5F5F5', fontSize: 10 }, axisTick: { show: false }, axisLine: { show: false } },
    series: [
      {
        name: 'Platform-Funded %', type: 'bar', stack: 'total', data: platformVals,
        itemStyle: { color: '#1E88E5' }, label: { show: true, formatter: '{c}%', color: '#fff', fontSize: 9 },
      },
      {
        name: 'Vendor-Funded %', type: 'bar', stack: 'total', data: vendorVals,
        itemStyle: { color: '#F9A825' }, label: { show: true, formatter: '{c}%', color: '#111', fontSize: 9 },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 280, width: '100%' }} />;
}

function DepthRadarChart() {
  const indicators = PROMO_TYPES.map(p => ({ name: p.name.length > 14 ? p.name.slice(0, 12) + '…' : p.name, max: 100 }));
  const platformDepths = [65, 55, 70, 20, 40, 75, 45];
  const vendorDepths = [35, 45, 30, 80, 60, 25, 40];

  const option = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: '#111111', borderColor: '#1E1E1E', textStyle: { color: '#F5F5F5', fontSize: 11 } },
    legend: { data: ['Platform Footprint', 'Vendor Footprint'], textStyle: { color: '#9CA3AF', fontSize: 10 }, top: 0 },
    radar: {
      indicator: indicators,
      axisName: { color: '#9CA3AF', fontSize: 10 },
      splitArea: { areaStyle: { color: ['#111111', '#0A0A0A'] } },
      splitLine: { lineStyle: { color: '#1E1E1E' } },
      axisLine: { lineStyle: { color: '#1E1E1E' } },
    },
    series: [{
      type: 'radar',
      data: [
        { name: 'Platform Footprint', value: platformDepths, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#1E88E5', width: 2 }, areaStyle: { color: '#1E88E5' + '33' }, itemStyle: { color: '#1E88E5' } },
        { name: 'Vendor Footprint', value: vendorDepths, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#F9A825', width: 2 }, areaStyle: { color: '#F9A825' + '33' }, itemStyle: { color: '#F9A825' } },
      ],
    }],
  };

  return <ReactECharts option={option} style={{ height: 300, width: '100%' }} />;
}

export default function PromotionsTab() {
  const [selected, setSelected] = useState(PROMO_TYPES[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Promotion Types Mapped', value: '7', color: '#1E88E5', icon: '🎯' },
          { label: 'Avg Platform Funding %', value: '52%', color: '#22C55E', icon: '💳' },
          { label: 'Peak Discount Depth', value: '60%', color: '#EF4444', icon: '📉' },
          { label: 'Ramadan GMV Uplift', value: '+85%', color: '#F9A825', icon: '🌙' },
        ].map(k => (
          <div key={k.label} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{k.icon}</div>
            <div style={{ color: '#9CA3AF', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>{k.label}</div>
            <div style={{ color: k.color, fontWeight: 900, fontSize: '1.4rem' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        <Card>
          <div style={{ color: '#F5F5F5', fontWeight: 700, marginBottom: 4 }}>Funding Split by Promotion Type</div>
          <div style={{ color: '#9CA3AF', fontSize: '0.72rem', marginBottom: 12 }}>Platform vs vendor funding share (%) — who absorbs the cost?</div>
          <FundingMatrixChart />
        </Card>
        <Card>
          <div style={{ color: '#F5F5F5', fontWeight: 700, marginBottom: 4 }}>Platform vs Vendor Footprint Radar</div>
          <div style={{ color: '#9CA3AF', fontSize: '0.72rem', marginBottom: 12 }}>Relative influence per promotion category</div>
          <DepthRadarChart />
        </Card>
      </div>

      {/* Type Selector Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {PROMO_TYPES.map(p => (
          <button key={p.id} onClick={() => setSelected(p)} style={{
            background: selected.id === p.id ? p.color + '22' : 'transparent',
            border: `1px solid ${selected.id === p.id ? p.color : '#1E1E1E'}`,
            color: selected.id === p.id ? p.color : '#9CA3AF',
            padding: '6px 16px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>{p.icon}</span>{p.name}
          </button>
        ))}
      </div>

      {/* Selected Promo Deep-Dive */}
      {selected && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Left: mechanics */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{selected.icon}</span>
                  <h3 style={{ margin: 0, color: selected.color, fontWeight: 800, fontSize: '1.1rem' }}>{selected.name}</h3>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem', margin: '6px 0 0 0', lineHeight: 1.5 }}>{selected.mechanics}</p>
              </div>
              <span style={{
                background: CONF_COLORS[selected.confidenceScore] + '22',
                border: `1px solid ${CONF_COLORS[selected.confidenceScore]}`,
                color: CONF_COLORS[selected.confidenceScore],
                padding: '3px 10px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap',
              }}>🟢 {selected.confidenceScore}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[
                { label: 'Funding Source', value: selected.funding },
                { label: 'Order Frequency', value: selected.frequency },
                { label: 'Platform Funding', value: `${selected.fundingSplit.platform}%` },
                { label: 'Avg Order Lift', value: selected.avgOrderLift },
              ].map(s => (
                <div key={s.label} style={{ background: '#0A0A0A', borderRadius: 8, padding: '8px 10px', border: '1px solid #1E1E1E' }}>
                  <div style={{ color: '#9CA3AF', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</div>
                  <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.8rem', marginTop: 3 }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#9CA3AF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Eligible Vendors</div>
              {selected.eligibleVendors.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: selected.color, flexShrink: 0 }} />
                  <span style={{ color: '#F5F5F5', fontSize: '0.75rem' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#0A0A0A', borderLeft: `3px solid ${selected.color}`, borderRadius: '0 8px 8px 0', padding: '10px 14px' }}>
              <div style={{ color: '#9CA3AF', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Strategic Insight</div>
              <div style={{ color: '#F5F5F5', fontSize: '0.75rem', lineHeight: 1.5 }}>{selected.strategicInsight}</div>
            </div>
          </Card>

          {/* Right: examples table */}
          <Card>
            <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.9rem', marginBottom: 12 }}>Live Examples & Evidence</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.examples.map((ex, i) => (
                <div key={i} style={{
                  background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 10,
                  padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: selected.color, fontWeight: 700, fontSize: '0.8rem', marginBottom: 3 }}>{ex.vendor}</div>
                    <div style={{ color: '#9CA3AF', fontSize: '0.72rem', lineHeight: 1.4 }}>{ex.detail}</div>
                  </div>
                  <span style={{
                    background: CONF_COLORS[ex.confidence] + '22',
                    border: `1px solid ${CONF_COLORS[ex.confidence]}`,
                    color: CONF_COLORS[ex.confidence],
                    fontSize: '0.58rem', fontWeight: 700,
                    padding: '2px 8px', borderRadius: 10, marginLeft: 10, whiteSpace: 'nowrap', flexShrink: 0,
                  }}>{ex.confidence}</span>
                </div>
              ))}
            </div>

            {/* Depth breakdown */}
            <div style={{ marginTop: 16 }}>
              <div style={{ color: '#9CA3AF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Typical Discount Depth by Funding Source</div>
              {Object.entries(selected.depth).map(([source, depth]) => (
                <div key={source} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ width: 80, color: '#9CA3AF', fontSize: '0.7rem', textTransform: 'capitalize' }}>{source}</span>
                  <div style={{ flex: 1, background: '#0A0A0A', height: 8, borderRadius: 4, overflow: 'hidden', border: '1px solid #1E1E1E' }}>
                    <div style={{
                      width: `${parseInt(depth) || 50}%`,
                      background: source === 'platform' ? '#1E88E5' : source === 'vendor' ? '#F9A825' : '#A855F7',
                      height: '100%', borderRadius: 4,
                    }} />
                  </div>
                  <span style={{ width: 80, color: '#F5F5F5', fontSize: '0.7rem', textAlign: 'right' }}>{depth}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Platform vs Competitor promo comparison table */}
      <Card>
        <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>Competitor Promotion Benchmarking</div>
        <div style={{ color: '#9CA3AF', fontSize: '0.72rem', marginBottom: 14 }}>Side-by-side comparison of promotion mechanics across Egypt food delivery platforms</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr>
                {['Platform', 'Free Del Threshold', 'New User Deal', 'Loyalty Program', 'Peak Discount', 'Flash Deals', 'Conf'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', borderBottom: '1px solid #1E1E1E', color: '#9CA3AF', fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { platform: 'Talabat', badge: '🔵', threshold: '150 EGP (T-Pro)', newUser: '100 EGP off / 200 EGP min', loyalty: 'T-Pro subscription', peak: '60% (Ramadan)', flash: 'Mon + Wed Happy Hour', conf: 'HIGH', highlight: true },
                { platform: 'Breadfast', badge: '🟢', threshold: '35 EGP (!)', newUser: 'Free delivery + credit', loyalty: 'Points system', peak: '40%', flash: 'Daily rotating', conf: 'HIGH', highlight: false },
                { platform: 'Rabbit', badge: '🟣', threshold: 'Free first order', newUser: 'First order free', loyalty: 'None confirmed', peak: '30%', flash: 'Occasional', conf: 'MEDIUM', highlight: false },
                { platform: 'Elmenus', badge: '🔴', threshold: 'N/A', newUser: '% off first order', loyalty: 'None confirmed', peak: '25%', flash: 'Weekly', conf: 'MEDIUM', highlight: false },
                { platform: 'InstaShop', badge: '🟡', threshold: '100 EGP', newUser: 'Free delivery promo', loyalty: 'None confirmed', peak: '20%', flash: 'Monthly', conf: 'LOW', highlight: false },
              ].map((row, i) => (
                <tr key={i} style={{ background: row.highlight ? '#1E88E522' : 'transparent', borderBottom: '1px solid #1E1E1E' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#F5F5F5' }}>{row.badge} {row.platform}</td>
                  <td style={{ padding: '10px 12px', color: row.threshold.includes('35') ? '#EF4444' : '#F5F5F5' }}>{row.threshold}</td>
                  <td style={{ padding: '10px 12px', color: '#9CA3AF' }}>{row.newUser}</td>
                  <td style={{ padding: '10px 12px', color: '#9CA3AF' }}>{row.loyalty}</td>
                  <td style={{ padding: '10px 12px', color: '#22C55E', fontWeight: 700 }}>{row.peak}</td>
                  <td style={{ padding: '10px 12px', color: '#9CA3AF' }}>{row.flash}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ color: CONF_COLORS[row.conf], fontWeight: 700, fontSize: '0.7rem' }}>{row.conf}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14, padding: '10px 14px', background: '#EF444422', border: '1px solid #EF4444', borderRadius: 8 }}>
          <strong style={{ color: '#EF4444' }}>⚠ Critical Gap: </strong>
          <span style={{ color: '#F5F5F5', fontSize: '0.78rem' }}>Breadfast offers free delivery at 35 EGP minimum vs Talabat's 150 EGP — a 4.3× gap. This is the single highest-impact attack vector available to any market entrant.</span>
        </div>
      </Card>
    </div>
  );
}
