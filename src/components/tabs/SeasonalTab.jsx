import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { T } from '../../lib';

const CAMPAIGNS = [
  {
    id: 1, name: 'Ramadan', icon: '🌙', period: 'Mar–Apr', month: 3,
    color: '#F9A825', intensity: 'PEAK',
    gmvUplift: '+85%', orderUplift: '+70%',
    topCategories: ['Egyptian Cuisine', 'Sweets & Bakery', 'Groceries (Suhoor)', 'Beverages'],
    promoTypes: ['Flash Deals (60% off)', 'Suhoor/Iftar Bundles', 'Free Delivery Campaigns', 'Vendor Partnerships'],
    keyVendors: ['Koshary El Tahrir', 'Abu Auf (Dates)', 'Seoudi (Local)', 'Talabat Mart'],
    insight: 'The single biggest revenue event of the year. Any competitor without a Ramadan-first strategy is invisible during peak season. Suhoor orders (1–4 AM) are uniquely high-value and under-served.',
    tactics: ['Launch Ramadan-specific landing page 2 weeks before', 'Partner exclusively with top koshary & sweets vendors', 'Activate 24/7 delivery for Suhoor window (1–5 AM)', 'Bundle Iftar deals: main + drink + dessert at 40% off'],
    confidence: 'HIGH',
  },
  {
    id: 2, name: 'EID al-Fitr', icon: '🎊', period: 'Apr', month: 4,
    color: '#22C55E', intensity: 'HIGH',
    gmvUplift: '+60%', orderUplift: '+45%',
    topCategories: ['Premium Sweets', 'Gift Hampers', 'Chocolate & Confectionery', 'Bakery'],
    promoTypes: ['Gift Box Promotions', 'Premium Vendor Deals', 'Free Delivery', 'EID Exclusive Bundles'],
    keyVendors: ['Cinnabon', 'Gourmet Egypt', 'Abu Auf (Gift Packs)', 'Krispy Kreme'],
    insight: 'Premium spending surge — customers willing to pay for quality and gifting. Gift hampers and premium confectionery dominate. Short window (3 days) means flash execution is critical.',
    tactics: ['Pre-build curated EID gift boxes with top confectionery brands', 'Free delivery + premium packaging for orders 300+ EGP', 'WhatsApp/SMS campaign 3 days before EID', 'Partner with florists for flower + sweets combos'],
    confidence: 'HIGH',
  },
  {
    id: 3, name: 'EID al-Adha', icon: '🐑', period: 'Jun', month: 6,
    color: '#EF5F17', intensity: 'HIGH',
    gmvUplift: '+55%', orderUplift: '+40%',
    topCategories: ['Meat & Butcher', 'Fresh Produce', 'Cooking Essentials', 'Dairy'],
    promoTypes: ['Meat Bundle Deals', 'Grocery Promotions', 'Cooking Kit Packages', 'Family Meal Deals'],
    keyVendors: ['Seoudi (Halal Meat)', 'Metro Market (Meat)', 'Talabat Mart', 'Carrefour'],
    insight: 'Meat delivery is uniquely critical during EID al-Adha. Families who traditionally slaughter their own animals are increasingly outsourcing — a structural grocery delivery opportunity.',
    tactics: ['Exclusive halal meat delivery service with verified butchers', 'Cooking kit bundles (spices + rice + meat) pre-packaged', 'Family pack pricing for groups of 4–8 people', 'Real-time tracking for meat freshness assurance'],
    confidence: 'HIGH',
  },
  {
    id: 4, name: 'Summer Peak', icon: '☀️', period: 'Jul–Aug', month: 7,
    color: '#EF4444', intensity: 'MEDIUM-HIGH',
    gmvUplift: '+25%', orderUplift: '+30%',
    topCategories: ['Ice Cream & Desserts', 'Cold Beverages', 'Salads & Light Meals', 'Juices'],
    promoTypes: ['Ice Cream Flash Deals', 'Cold Delivery Guarantees', 'Afternoon Flash (3–6 PM)', 'Student Discounts'],
    keyVendors: ['Baskin Robbins', 'Dairy Queen', 'Talabat Mart (Beverages)', 'Domty (Ice Cream)'],
    insight: 'Temperature-driven ordering surge between 2–7 PM. Ice cream and cold beverages dominate. North Coast branches see 3× normal volume. Evening delivery after 9 PM also spikes (dinner outdoors patterns).',
    tactics: ['"Cold in 20 min" guarantee for ice cream orders', 'Temperature-controlled delivery bag branding', 'North Coast / Marina location activation', 'Happy Hour: 3–5 PM flash deals on cold items'],
    confidence: 'MEDIUM',
  },
  {
    id: 5, name: 'Back-to-School', icon: '📚', period: 'Sep', month: 9,
    color: '#1E88E5', intensity: 'MEDIUM',
    gmvUplift: '+18%', orderUplift: '+22%',
    topCategories: ['Stationery & Supplies', 'School Snacks', 'Lunchboxes', 'Grocery Staples'],
    promoTypes: ['Stationery Deals (Talabat Mart)', 'School Lunch Bundles', 'Staple Grocery Packs', 'Snack Promotions'],
    keyVendors: ['Talabat Mart (School Supplies)', 'Carrefour (School Packs)', 'Abu Auf (Snacks)', 'Seoudi'],
    insight: 'Talabat Mart runs a major Back-to-School campaign with 40% off school supplies. Lunch delivery to schools is an under-tapped growth vertical — no competitor has built a school lunch product.',
    tactics: ['40% off school supplies (stationery, bags, lunchboxes)', 'Partner with school canteens for lunch delivery subscriptions', 'Parent bundle: weekly grocery pack + lunch delivery', 'Talabat Mart school kit pre-order campaign'],
    confidence: 'MEDIUM',
  },
  {
    id: 6, name: 'National Day', icon: '🇪🇬', period: 'Jul 23', month: 7,
    color: '#22C55E', intensity: 'MEDIUM',
    gmvUplift: '+15%', orderUplift: '+20%',
    topCategories: ['Egyptian Cuisine', 'Street Food', 'Shawarma & Grills', 'National Desserts'],
    promoTypes: ['Egypt-Themed Packaging', 'National Dish Promotions', 'Local Restaurant Spotlights'],
    keyVendors: ['Koshary El Tahrir', 'Abu Tarek', 'Local Egyptian Vendors', 'Hawawshi Chains'],
    insight: 'Cultural pride drives spending on authentic Egyptian food. Co-branding with Egyptian heritage icons (Koshary, Hawawshi) generates high social engagement — highest share-of-voice opportunity of the year.',
    tactics: ['Egyptian-flag themed packaging for all orders (free)', 'Koshary & hawawshi vendor exclusives for 24 hours', 'Social campaign: #AklMasry (Egyptian Food) challenge', '"Best Egyptian Dish" vote with platform-funded prize'],
    confidence: 'MEDIUM',
  },
  {
    id: 7, name: 'Winter Comfort', icon: '☕', period: 'Dec–Feb', month: 12,
    color: '#A855F7', intensity: 'MEDIUM',
    gmvUplift: '+20%', orderUplift: '+18%',
    topCategories: ['Hot Beverages', 'Soups & Stews', 'Comfort Food', 'Bakery & Pastries'],
    promoTypes: ['Hot Drink Flash Deals', 'Soup Bundle Promotions', 'Comfort Food Campaigns'],
    keyVendors: ['Coffee shops', 'Koshary El Tahrir', 'Abu Auf (Tea)', 'Local soup vendors'],
    insight: 'Cold weather drives "comfort food" ordering patterns. Hot beverage delivery (tea, hot chocolate, warm soups) is a growing category with almost no dedicated vendors on Talabat.',
    tactics: ['"Hot in 25 min" guarantee for coffee/soup orders', 'Winter bundle: soup + hot drink + bread at 25% off', 'Partner with specialty tea shops (Abu Auf, Cairo Tea)', 'Night delivery focus (9 PM–12 AM) for hot beverage surge'],
    confidence: 'MEDIUM',
  },
  {
    id: 8, name: 'Valentine\'s Day', icon: '💝', period: 'Feb 14', month: 2,
    color: '#EC4899', intensity: 'MEDIUM',
    gmvUplift: '+35%', orderUplift: '+28%',
    topCategories: ['Chocolate & Confectionery', 'Flowers', 'Premium Desserts', 'Fine Dining'],
    promoTypes: ['Couple Bundle Deals', 'Gift Box + Flowers', 'Premium Restaurant Promos', 'Free Delivery for Premium Orders'],
    keyVendors: ['Godiva (Gourmet)', 'Cinnabon', 'Florists (via Talabat)', 'Premium restaurants'],
    insight: 'Highest AOV day of the year. Couple combos (food + flowers + chocolate) delivered simultaneously is the ultimate convenience proposition — Talabat has the multi-category inventory to own this entirely.',
    tactics: ['Couple combo boxes: restaurant meal + Godiva chocolate + flowers', 'Pre-order 3 days in advance with scheduled delivery', 'Message card personalization option', 'Premium restaurant exclusive menus for Feb 14 only'],
    confidence: 'MEDIUM',
  },
];

const INTENSITY_COLORS = { 'PEAK': '#EF4444', 'HIGH': '#F9A825', 'MEDIUM-HIGH': '#EF5F17', 'MEDIUM': '#1E88E5', 'LOW': '#9CA3AF' };

const MONTHLY_INDEX = [
  { month: 'Jan', index: 85, label: 'Winter Comfort' },
  { month: 'Feb', index: 95, label: 'Valentine\'s + Winter' },
  { month: 'Mar', index: 185, label: '🌙 Ramadan' },
  { month: 'Apr', index: 160, label: '🎊 EID al-Fitr' },
  { month: 'May', index: 80, label: 'Post-EID dip' },
  { month: 'Jun', index: 155, label: '🐑 EID al-Adha' },
  { month: 'Jul', index: 125, label: '🇪🇬 National Day + Summer' },
  { month: 'Aug', index: 130, label: '☀️ Summer Peak' },
  { month: 'Sep', index: 118, label: '📚 Back-to-School' },
  { month: 'Oct', index: 90, label: 'Standard month' },
  { month: 'Nov', index: 85, label: 'Pre-winter' },
  { month: 'Dec', index: 95, label: '☕ Winter starts' },
];

const Card = ({ title, subtitle, children, style }) => (
  <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: 14, padding: '1.25rem', ...style }}>
    {title && <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{title}</div>}
    {subtitle && <div style={{ color: '#9CA3AF', fontSize: '0.72rem', marginBottom: 14 }}>{subtitle}</div>}
    {children}
  </div>
);

function DemandIndexChart() {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis', backgroundColor: '#111111', borderColor: '#1E1E1E', textStyle: { color: '#F5F5F5', fontSize: 11 },
      formatter: (params) => {
        const d = MONTHLY_INDEX[params[0].dataIndex];
        return `<strong>${d.month}</strong><br/>Demand Index: ${d.index}<br/>${d.label}`;
      },
    },
    grid: { top: 20, right: 20, bottom: 40, left: 20, containLabel: true },
    xAxis: {
      type: 'category', data: MONTHLY_INDEX.map(m => m.month),
      axisLabel: { color: '#9CA3AF', fontSize: 11 }, axisLine: { lineStyle: { color: '#1E1E1E' } }, axisTick: { show: false },
    },
    yAxis: {
      type: 'value', axisLabel: { color: '#9CA3AF', fontSize: 10, formatter: '{value}' },
      splitLine: { lineStyle: { color: '#1E1E1E', type: 'dashed' } }, axisLine: { show: false },
      min: 60, max: 200,
    },
    visualMap: {
      show: false, type: 'continuous', min: 60, max: 200,
      inRange: { color: ['#1E88E5', '#22C55E', '#F9A825', '#EF4444'] },
    },
    series: [{
      type: 'bar', data: MONTHLY_INDEX.map(m => m.index),
      itemStyle: { borderRadius: [6, 6, 0, 0] }, barMaxWidth: 36,
      label: { show: true, position: 'top', color: '#9CA3AF', fontSize: 9, formatter: '{c}' },
    }],
  };

  return <ReactECharts option={option} style={{ height: 260, width: '100%' }} />;
}

export default function SeasonalTab() {
  const [selected, setSelected] = useState(CAMPAIGNS[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Monthly demand index */}
      <Card title="Monthly Demand Index (GMV-Relative, Base = 100)" subtitle="Estimated relative order volume by month — normalized against average month as 100">
        <DemandIndexChart />
        <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
          {[
            { label: 'Ramadan Peak', value: '185', color: '#EF4444' },
            { label: 'EID al-Fitr', value: '160', color: '#F9A825' },
            { label: 'EID al-Adha', value: '155', color: '#EF5F17' },
            { label: 'Summer Peak', value: '130', color: '#22C55E' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
              <span style={{ color: '#9CA3AF', fontSize: '0.72rem' }}>{s.label}: </span>
              <span style={{ color: s.color, fontWeight: 700, fontSize: '0.72rem' }}>{s.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Campaign selector */}
      <div>
        <div style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>Select Campaign for Deep-Dive</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CAMPAIGNS.map(c => (
            <button key={c.id} onClick={() => setSelected(c)} style={{
              background: selected.id === c.id ? c.color + '22' : 'transparent',
              border: `1px solid ${selected.id === c.id ? c.color : '#1E1E1E'}`,
              color: selected.id === c.id ? c.color : '#9CA3AF',
              padding: '6px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {c.icon} {c.name}
              <span style={{
                background: INTENSITY_COLORS[c.intensity] + '33',
                color: INTENSITY_COLORS[c.intensity],
                padding: '1px 5px', borderRadius: 6, fontSize: '0.6rem', fontWeight: 700,
              }}>{c.intensity}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Campaign deep-dive */}
      {selected && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: 4 }}>{selected.icon}</div>
                <h3 style={{ margin: 0, color: selected.color, fontSize: '1.2rem', fontWeight: 800 }}>{selected.name}</h3>
                <div style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: 2 }}>Period: {selected.period}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  background: INTENSITY_COLORS[selected.intensity] + '22',
                  border: `1px solid ${INTENSITY_COLORS[selected.intensity]}`,
                  color: INTENSITY_COLORS[selected.intensity],
                  padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                }}>{selected.intensity}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[
                { label: 'GMV Uplift', value: selected.gmvUplift, color: '#22C55E' },
                { label: 'Order Volume Uplift', value: selected.orderUplift, color: '#1E88E5' },
              ].map(s => (
                <div key={s.label} style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                  <div style={{ color: '#9CA3AF', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ color: s.color, fontWeight: 900, fontSize: '1.4rem' }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#9CA3AF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Top Categories</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.topCategories.map(c => (
                  <span key={c} style={{ background: selected.color + '22', color: selected.color, fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{c}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#9CA3AF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Key Vendor Partners</div>
              {selected.keyVendors.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: selected.color }} />
                  <span style={{ color: '#F5F5F5', fontSize: '0.75rem' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#0A0A0A', borderLeft: `3px solid ${selected.color}`, borderRadius: '0 8px 8px 0', padding: '10px 14px' }}>
              <div style={{ color: '#9CA3AF', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Market Intelligence</div>
              <div style={{ color: '#F5F5F5', fontSize: '0.75rem', lineHeight: 1.5 }}>{selected.insight}</div>
            </div>
          </Card>

          <Card>
            <div style={{ color: '#F5F5F5', fontWeight: 700, marginBottom: 14 }}>Promotion Mechanics</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
              {selected.promoTypes.map((p, i) => (
                <div key={i} style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: selected.color, flexShrink: 0 }} />
                  <span style={{ color: '#F5F5F5', fontSize: '0.75rem' }}>{p}</span>
                </div>
              ))}
            </div>

            <div style={{ color: '#F5F5F5', fontWeight: 700, marginBottom: 10 }}>⚔️ Attack Tactics for This Campaign</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.tactics.map((tactic, i) => (
                <div key={i} style={{
                  background: '#0A0A0A', border: `1px solid ${selected.color}44`, borderRadius: 8,
                  padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <span style={{ color: selected.color, fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ color: '#F5F5F5', fontSize: '0.75rem', lineHeight: 1.4 }}>{tactic}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, padding: '8px 12px', background: '#0A0A0A', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9CA3AF', fontSize: '0.7rem' }}>Data Confidence:</span>
              <span style={{
                color: selected.confidence === 'HIGH' ? '#22C55E' : '#F9A825',
                fontWeight: 700, fontSize: '0.7rem',
              }}>🟢 {selected.confidence}</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
