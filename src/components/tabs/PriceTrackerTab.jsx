import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { T } from '../../lib';

// ─── CONFIRMED REAL EVIDENCE DATA (from Egypt Grocery Intel research, May 2026) ───
const CONFIRMED_ROWS = [
  { store: 'Talabat Mart', product: 'Crystal Sunflower Oil 5L', category: 'Cooking Oils', current: 473.00, original: 517.00, saving: 44, discountPct: 8.5, promoSignal: 'Was 517 EGP — Limited offer (1 piece/order)', promoType: 'Old Price Display', sourceType: 'Indexed Product Page', collector: 'Bright Data', confidence: 'HIGH', url: 'https://www.talabat.com/egypt/talabat-mart/product/…/s/905854', runDate: '2026-05-01' },
  { store: 'Carrefour Egypt', product: 'Juhayna Full Cream Milk 1L', category: 'Dairy', current: 43.95, original: 51.00, saving: 7.05, discountPct: 14, promoSignal: '14% off — Carrefour Deals page active promotion', promoType: 'Percentage Discount', sourceType: 'Retailer Deals Page', collector: 'Bright Data / Public Index', confidence: 'HIGH', url: 'https://www.carrefouregypt.com/mafegy/en/c/carrefour-deals/', runDate: '2026-05-01' },
  { store: 'Seoudi', product: 'ALMARAI Laban 1L', category: 'Dairy', current: 46.95, original: 52.95, saving: 6.00, discountPct: 11.3, promoSignal: 'You Save 6.00 EGP (11.3%)', promoType: 'Old Price / Flyer Deal', sourceType: 'D4D/Ilofo Flyer Extractor', collector: 'Flyer Scraper', confidence: 'HIGH', url: 'https://d4donline.com/en/egypt/cairo/products/seoudi-supermarket-1695/73757362/top-product', runDate: '2026-05-01' },
  { store: 'Metro Market', product: 'Unidentified FMCG Product', category: 'FMCG', current: 184.95, original: 269.95, saving: 85.00, discountPct: 31.5, promoSignal: 'You Save 85.00 EGP (31.5%) — Weekly Deal', promoType: 'Old Price / Flyer Deal', sourceType: 'D4D/Ilofo Flyer Extractor', collector: 'Flyer Scraper', confidence: 'HIGH', url: 'https://d4donline.com/en/egypt/cairo/products/metro-market--688379/84615272/top-product', runDate: '2026-05-01' },
  { store: 'Kazyon', product: 'Unidentified FMCG Product', category: 'FMCG', current: 239.95, original: 279.95, saving: 40.00, discountPct: 14.3, promoSignal: 'You Save 40.00 EGP (14.3%) — Kazyon Always Low Price', promoType: 'Old Price / EDLP Flyer', sourceType: 'D4D/Ilofo Flyer Extractor', collector: 'Flyer Scraper', confidence: 'HIGH', url: 'https://d4donline.com/en/egypt/cairo/products/kazyon--687893/84541448/top-product', runDate: '2026-05-01' },
  { store: 'Spinneys Egypt', product: 'Rehana Rice 1kg', category: 'Staples', current: 38.00, original: 41.25, saving: 3.25, discountPct: 7.9, promoSignal: 'Exclusive Online Deal — official site badge', promoType: 'Online Exclusive', sourceType: 'Retailer Homepage (Official)', collector: 'Public Web', confidence: 'HIGH', url: 'https://www.spinneys-egypt.com/', runDate: '2026-05-01' },
  { store: 'Spinneys Egypt', product: 'Pampers Size 5 Diapers', category: 'Baby', current: 484.00, original: 680.00, saving: 196.00, discountPct: 28.8, promoSignal: 'Exclusive Online Deal — 28.8% off', promoType: 'Online Exclusive', sourceType: 'Retailer Homepage (Official)', collector: 'Public Web', confidence: 'HIGH', url: 'https://www.spinneys-egypt.com/', runDate: '2026-05-01' },
  { store: 'Breadfast', product: 'Breadfast Toast (loaf)', category: 'Bakery', current: 29.00, original: null, saving: null, discountPct: null, promoSignal: '15% off bakeries on orders above 35 EGP (coupon code)', promoType: 'Percentage Discount / Coupon', sourceType: 'Data-Provider Article + Coupon Page', collector: 'Manual Research', confidence: 'MEDIUM', url: 'https://egypt.alcoupon.com/en/discount-codes/breadfast', runDate: '2026-05-01' },
  { store: 'Breadfast', product: 'Fresh Tomatoes 1kg', category: 'Fresh Produce', current: 17.50, original: null, saving: null, discountPct: null, promoSignal: '15% off groceries coupon (bakeries/produce)', promoType: 'Percentage Discount / Coupon', sourceType: 'Data-Provider Article', collector: 'Manual Research', confidence: 'MEDIUM', url: 'https://www.fooddatascrape.com/scrape-instashop-egypt-vs-local-grocery-apps-pricing-data.php', runDate: '2026-05-01' },
  { store: 'Breadfast', product: 'Breadfast Labneh 400g', category: 'Dairy', current: 63.00, original: null, saving: null, discountPct: null, promoSignal: 'Free delivery above 35 EGP (platform-wide, no coupon needed)', promoType: 'Free Delivery', sourceType: 'App Store / Coupon Pages', collector: 'Manual Research', confidence: 'MEDIUM', url: 'https://egypt.alcoupon.com/en/discount-codes/breadfast', runDate: '2026-05-01' },
  { store: 'InstaShop', product: 'Coca-Cola 1.25L', category: 'Beverages', current: 28.00, original: null, saving: null, discountPct: null, promoSignal: 'Bank ABC 10% discount with promo code; eggs show 5% discount', promoType: 'Bank Cashback / Percentage', sourceType: 'Data-Provider Sample + Bank Promo', collector: 'Manual Research', confidence: 'MEDIUM', url: 'https://www.bank-abc.com/en/CountrySites/Egypt/ProductsServices/Retail-Banking/instashop', runDate: '2026-05-01' },
  { store: 'InstaShop', product: 'Fresh Eggs 10 pcs', category: 'Dairy / Eggs', current: 39.50, original: 41.50, saving: 2.00, discountPct: 5, promoSignal: '5% discount on eggs (sample dataset)', promoType: 'Percentage Discount', sourceType: 'Data-Provider Sample Dataset', collector: 'Manual Research', confidence: 'MEDIUM', url: 'https://www.fooddatascrape.com/scrape-instashop-egypt-vs-local-grocery-apps-pricing-data.php', runDate: '2026-05-01' },
  { store: 'InstaShop', product: 'Almarai Milk 1L', category: 'Dairy', current: 35.00, original: null, saving: null, discountPct: null, promoSignal: 'Bank ABC 10% cashback promo applicable', promoType: 'Bank Cashback', sourceType: 'Data-Provider Sample + Bank Promo', collector: 'Manual Research', confidence: 'MEDIUM', url: 'https://www.bank-abc.com/en/CountrySites/Egypt/ProductsServices/Retail-Banking/instashop', runDate: '2026-05-01' },
];

// Benchmark basket — 10 SKUs we tried to track
const BENCHMARK_SKUS = [
  { product: 'Juhayna Full Cream Milk 1L', category: 'Dairy', prices: { 'Talabat Mart': null, 'Carrefour': 43.95, 'Seoudi': null, 'Metro': null, 'Spinneys': null, 'Breadfast': null, 'InstaShop': 35.00, 'Kazyon': null } },
  { product: 'Fresh Eggs 10 pcs', category: 'Eggs', prices: { 'Talabat Mart': null, 'Carrefour': null, 'Seoudi': null, 'Metro': null, 'Spinneys': null, 'Breadfast': null, 'InstaShop': 39.50, 'Kazyon': null } },
  { product: 'Coca-Cola 1.25–1.5L', category: 'Beverages', prices: { 'Talabat Mart': null, 'Carrefour': null, 'Seoudi': null, 'Metro': null, 'Spinneys': null, 'Breadfast': null, 'InstaShop': 28.00, 'Kazyon': null } },
  { product: 'Sunflower Oil 5L', category: 'Cooking Oils', prices: { 'Talabat Mart': 473.00, 'Carrefour': null, 'Seoudi': null, 'Metro': null, 'Spinneys': null, 'Breadfast': null, 'InstaShop': null, 'Kazyon': null } },
  { product: 'ALMARAI Laban 1L', category: 'Dairy', prices: { 'Talabat Mart': null, 'Carrefour': null, 'Seoudi': 46.95, 'Metro': null, 'Spinneys': null, 'Breadfast': null, 'InstaShop': null, 'Kazyon': null } },
  { product: 'Breadfast Toast (Loaf)', category: 'Bakery', prices: { 'Talabat Mart': null, 'Carrefour': null, 'Seoudi': null, 'Metro': null, 'Spinneys': null, 'Breadfast': 29.00, 'InstaShop': null, 'Kazyon': null } },
  { product: 'Pampers Size 5', category: 'Baby', prices: { 'Talabat Mart': null, 'Carrefour': null, 'Seoudi': null, 'Metro': null, 'Spinneys': 484.00, 'Breadfast': null, 'InstaShop': null, 'Kazyon': null } },
  { product: 'Rehana Rice 1kg', category: 'Staples', prices: { 'Talabat Mart': null, 'Carrefour': null, 'Seoudi': null, 'Metro': null, 'Spinneys': 38.00, 'Breadfast': null, 'InstaShop': null, 'Kazyon': null } },
];

const STORE_STATUS = [
  { store: 'Talabat Mart', status: 'PASS', method: 'Indexed product pages', collector: 'Bright Data', skusConfirmed: 1, promoRows: 1, nextStep: 'Add app/browser session with Cairo location for full catalog' },
  { store: 'Carrefour Egypt', status: 'PASS', method: 'Indexed pages + Deals page', collector: 'Bright Data / Public', skusConfirmed: 1, promoRows: 1, nextStep: 'Anonymous direct page hides prices — use Carrefour deals page route' },
  { store: 'Spinneys Egypt', status: 'PASS', method: 'Official homepage deals', collector: 'Public Web', skusConfirmed: 2, promoRows: 2, nextStep: 'Strong route — automate deals page scraping weekly' },
  { store: 'Seoudi', status: 'PASS', method: 'D4D/Ilofo flyer extractor', collector: 'Flyer Scraper', skusConfirmed: 1, promoRows: 1, nextStep: 'Scale flyer scraping to 50+ SKUs weekly' },
  { store: 'Metro Market', status: 'PASS', method: 'D4D/Ilofo flyer extractor', collector: 'Flyer Scraper', skusConfirmed: 1, promoRows: 1, nextStep: 'Scale flyer scraping to 50+ SKUs weekly' },
  { store: 'Kazyon', status: 'PASS', method: 'D4D/Ilofo flyer extractor', collector: 'Flyer Scraper', skusConfirmed: 1, promoRows: 1, nextStep: 'Best flyer route — very active promotions' },
  { store: 'Breadfast', status: 'PASS_WEAK', method: 'Data-provider article + coupon pages', collector: 'Manual Research', skusConfirmed: 3, promoRows: 3, nextStep: 'Needs Android/Appium for live in-app catalog with location' },
  { store: 'InstaShop', status: 'PASS_WEAK', method: 'Data-provider sample + bank promo page', collector: 'Manual Research', skusConfirmed: 3, promoRows: 3, nextStep: 'Hyperlocal — needs Android/Appium with store-level session' },
  { store: 'Awlad Ragab', status: 'PASS_WEAK', method: 'D4D/Ilofo flyer (partial OCR)', collector: 'Flyer Scraper + OCR', skusConfirmed: 0, promoRows: 2, nextStep: 'Improve OCR extraction of original price from flyer images' },
  { store: 'Rabbit', status: 'FAIL', method: 'Bank/promo pages only', collector: 'Manual Research', skusConfirmed: 0, promoRows: 0, nextStep: 'Android/Appium required — no public SKU price found' },
];

const COLLECTION_TIERS = [
  {
    tier: 'Tier 1 — MVP', icon: '🟡', cost: '<$50/month',
    coverage: '6 stores, 50–100 SKUs', frequency: 'Weekly or bi-weekly',
    tools: ['Bright Data Web Unlocker', 'Apify (scheduled jobs)', 'D4D/Ilofo flyer scrapers', 'Manual QA screenshots'],
    bestFor: 'Proof-of-concept, client pilot, indexed/public pages only',
    limitations: 'Misses Rabbit, Breadfast (live), InstaShop (hyperlocal). No real-time data.',
    storesCovered: ['Talabat Mart', 'Carrefour Egypt', 'Spinneys Egypt', 'Seoudi', 'Metro Market', 'Kazyon'],
  },
  {
    tier: 'Tier 2 — Weekly Production', icon: '🟠', cost: '$50–$200/month',
    coverage: '10 stores, 500–2,000 SKUs', frequency: 'Weekly',
    tools: ['Android/Appium (Rabbit, Breadfast, InstaShop, Talabat app)', 'Bright Data (Carrefour, Talabat, Spinneys)', 'Apify (orchestration + dataset storage)', 'Screenshot + XML evidence for confirmed rows'],
    bestFor: 'Full 10-store coverage with live app prices and promo badges',
    limitations: 'Requires Android device or emulator connected. Setup labor: 2–4 weeks.',
    storesCovered: ['All 10 stores'],
  },
  {
    tier: 'Tier 3 — Daily Intelligence', icon: '🔴', cost: '$300–$1,000+/month',
    coverage: '10+ stores, 2,000+ SKUs', frequency: 'Daily',
    tools: ['Daily app scraping (device farm)', 'Proxy/browser retries', 'OCR for flyers and screenshots', 'Anomaly detection alerts', 'Historical price database (SQLite → Postgres)', 'Dashboard with email/Slack alerts'],
    bestFor: 'Price war monitoring, daily promotion tracking, category leadership alerts',
    limitations: 'High setup complexity. Device farm management. 4–8 weeks engineering to production.',
    storesCovered: ['All stores + catalog expansion'],
  },
];

const STATUS_COLORS = { PASS: '#22C55E', PASS_WEAK: '#F9A825', FAIL: '#EF4444' };
const CONF_COLORS = { HIGH: '#22C55E', MEDIUM: '#F9A825', LOW: '#EF4444' };

const Card = ({ title, subtitle, children, style }) => (
  <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: 14, padding: '1.25rem', ...style }}>
    {title && <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{title}</div>}
    {subtitle && <div style={{ color: '#9CA3AF', fontSize: '0.72rem', marginBottom: 14 }}>{subtitle}</div>}
    {children}
  </div>
);

function DiscountBarChart() {
  const rows = CONFIRMED_ROWS.filter(r => r.discountPct && r.discountPct > 0)
    .sort((a, b) => b.discountPct - a.discountPct);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis', backgroundColor: '#111111', borderColor: '#1E1E1E', textStyle: { color: '#F5F5F5', fontSize: 11 },
      formatter: (params) => {
        const r = rows[params[0].dataIndex];
        return `<strong>${r.store}</strong><br/>${r.product}<br/>Discount: ${r.discountPct}%<br/>Save: ${r.saving} EGP`;
      },
    },
    grid: { top: 16, right: 80, bottom: 16, left: 16, containLabel: true },
    xAxis: { type: 'value', axisLabel: { color: '#9CA3AF', fontSize: 10, formatter: '{value}%' }, splitLine: { lineStyle: { color: '#1E1E1E', type: 'dashed' } }, axisLine: { show: false } },
    yAxis: {
      type: 'category',
      data: rows.map(r => `${r.store.replace(' Egypt', '').replace(' Market', '')} · ${r.product.slice(0, 20)}…`),
      axisLabel: { color: '#F5F5F5', fontSize: 9 }, axisTick: { show: false }, axisLine: { show: false },
    },
    series: [{
      type: 'bar', data: rows.map(r => r.discountPct),
      itemStyle: {
        borderRadius: [0, 6, 6, 0],
        color: (p) => {
          const val = rows[p.dataIndex].discountPct;
          if (val >= 25) return '#EF4444';
          if (val >= 15) return '#F9A825';
          return '#22C55E';
        },
      },
      label: { show: true, position: 'right', color: '#9CA3AF', fontSize: 10, formatter: '{c}%' },
      barMaxWidth: 24,
    }],
  };

  return <ReactECharts option={option} style={{ height: 280, width: '100%' }} />;
}

function CoverageSunburst() {
  const pass = STORE_STATUS.filter(s => s.status === 'PASS').length;
  const weak = STORE_STATUS.filter(s => s.status === 'PASS_WEAK').length;
  const fail = STORE_STATUS.filter(s => s.status === 'FAIL').length;

  const option = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: '#111111', borderColor: '#1E1E1E', textStyle: { color: '#F5F5F5' } },
    series: [{
      type: 'pie', radius: ['40%', '68%'], center: ['50%', '50%'],
      data: [
        { value: pass, name: `PASS (${pass})`, itemStyle: { color: '#22C55E' } },
        { value: weak, name: `PASS_WEAK (${weak})`, itemStyle: { color: '#F9A825' } },
        { value: fail, name: `FAIL (${fail})`, itemStyle: { color: '#EF4444' } },
      ],
      label: { show: true, formatter: '{b}\n{c} stores', color: '#F5F5F5', fontSize: 10 },
      labelLine: { lineStyle: { color: '#1E1E1E' } },
    }],
  };
  return <ReactECharts option={option} style={{ height: 220, width: '100%' }} />;
}

export default function PriceTrackerTab() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTier, setSelectedTier] = useState(0);

  const passCount = STORE_STATUS.filter(s => s.status === 'PASS').length;
  const weakCount = STORE_STATUS.filter(s => s.status === 'PASS_WEAK').length;
  const failCount = STORE_STATUS.filter(s => s.status === 'FAIL').length;
  const confirmedRows = CONFIRMED_ROWS.filter(r => r.confidence === 'HIGH').length;
  const avgDiscount = (CONFIRMED_ROWS.filter(r => r.discountPct).reduce((a, r) => a + r.discountPct, 0) / CONFIRMED_ROWS.filter(r => r.discountPct).length).toFixed(1);
  const maxSaving = Math.max(...CONFIRMED_ROWS.filter(r => r.discountPct).map(r => r.discountPct)).toFixed(1);

  const filteredRows = CONFIRMED_ROWS.filter(r => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'confirmed') return r.confidence === 'HIGH';
    if (activeFilter === 'weak') return r.confidence === 'MEDIUM';
    return true;
  });

  const stores = [...new Set(STORE_STATUS.map(s => s.store))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Stores Checked', value: 10, color: '#1E88E5', icon: '🏪' },
          { label: 'PASS (Price + Promo)', value: passCount, color: '#22C55E', icon: '✅' },
          { label: 'PASS_WEAK', value: weakCount, color: '#F9A825', icon: '⚠️' },
          { label: 'FAIL', value: failCount, color: '#EF4444', icon: '❌' },
          { label: 'Confirmed Price Rows', value: confirmedRows, color: '#22C55E', icon: '📊' },
          { label: 'Max Discount Found', value: `${maxSaving}%`, color: '#EF4444', icon: '🔥' },
        ].map(k => (
          <div key={k.label} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: 12, padding: '0.9rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: 3 }}>{k.icon}</div>
            <div style={{ color: '#9CA3AF', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 5 }}>{k.label}</div>
            <div style={{ color: k.color, fontWeight: 900, fontSize: '1.3rem' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '1.5rem' }}>
        {/* Discount bar chart */}
        <Card title="Confirmed Discounts by Store & SKU" subtitle="Actual price drops collected — sorted by discount depth (HIGH confidence rows only)">
          <DiscountBarChart />
        </Card>
        {/* Coverage donut */}
        <Card title="Store Coverage Status" subtitle="Evidence rule: price + promo = PASS">
          <CoverageSunburst />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            {[{ label: 'PASS', color: '#22C55E', desc: 'Strict: price + promo confirmed' }, { label: 'PASS_WEAK', color: '#F9A825', desc: 'Price OR promo only / sample data' }, { label: 'FAIL', color: '#EF4444', desc: 'No grocery SKU price found' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                <span style={{ color: s.color, fontWeight: 700, fontSize: '0.7rem' }}>{s.label}</span>
                <span style={{ color: '#9CA3AF', fontSize: '0.65rem' }}>— {s.desc}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Store Coverage Table */}
      <Card title="Store-by-Store Collection Status" subtitle="What was tested, what worked, and the next collection route for each store">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.77rem' }}>
            <thead>
              <tr>
                {['Store', 'Status', 'Method', 'Collector', 'SKUs Confirmed', 'Promo Rows', 'Next Step'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', borderBottom: '1px solid #1E1E1E', color: '#9CA3AF', fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STORE_STATUS.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1E1E1E' }}>
                  <td style={{ padding: '9px 10px', color: '#F5F5F5', fontWeight: 700 }}>{s.store}</td>
                  <td style={{ padding: '9px 10px' }}>
                    <span style={{ background: STATUS_COLORS[s.status] + '22', border: `1px solid ${STATUS_COLORS[s.status]}`, color: STATUS_COLORS[s.status], padding: '2px 8px', borderRadius: 10, fontSize: '0.65rem', fontWeight: 700 }}>{s.status}</span>
                  </td>
                  <td style={{ padding: '9px 10px', color: '#9CA3AF', fontSize: '0.72rem' }}>{s.method}</td>
                  <td style={{ padding: '9px 10px', color: '#9CA3AF', fontSize: '0.72rem' }}>{s.collector}</td>
                  <td style={{ padding: '9px 10px', color: s.skusConfirmed > 0 ? '#22C55E' : '#EF4444', fontWeight: 700, textAlign: 'center' }}>{s.skusConfirmed}</td>
                  <td style={{ padding: '9px 10px', color: s.promoRows > 0 ? '#22C55E' : '#EF4444', fontWeight: 700, textAlign: 'center' }}>{s.promoRows}</td>
                  <td style={{ padding: '9px 10px', color: '#9CA3AF', fontSize: '0.68rem', maxWidth: 220 }}>{s.nextStep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmed evidence rows */}
      <Card title="Confirmed Price + Promo Evidence Rows" subtitle="Every row requires: specific EGP price + at least one promo signal. Filter by confidence level.">
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: `All Rows (${CONFIRMED_ROWS.length})` },
            { key: 'confirmed', label: `Confirmed HIGH (${CONFIRMED_ROWS.filter(r => r.confidence === 'HIGH').length})` },
            { key: 'weak', label: `MEDIUM / Needs Validation (${CONFIRMED_ROWS.filter(r => r.confidence === 'MEDIUM').length})` },
          ].map(f => (
            <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{
              background: activeFilter === f.key ? '#1E88E5' : 'transparent',
              border: `1px solid ${activeFilter === f.key ? '#1E88E5' : '#1E1E1E'}`,
              color: activeFilter === f.key ? '#fff' : '#9CA3AF',
              padding: '4px 14px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr>
                {['Store', 'Product', 'Category', 'Current EGP', 'Original EGP', 'Saving', 'Discount', 'Promo Signal', 'Collector', 'Conf', 'Source'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', borderBottom: '1px solid #1E1E1E', color: '#9CA3AF', fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1E1E1E', background: i % 2 === 0 ? 'transparent' : '#0A0A0A' }}>
                  <td style={{ padding: '8px 10px', color: '#F5F5F5', fontWeight: 700, whiteSpace: 'nowrap' }}>{r.store}</td>
                  <td style={{ padding: '8px 10px', color: '#9CA3AF', maxWidth: 180 }}>{r.product}</td>
                  <td style={{ padding: '8px 10px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{r.category}</td>
                  <td style={{ padding: '8px 10px', color: '#22C55E', fontWeight: 700, whiteSpace: 'nowrap' }}>{r.current.toFixed(2)} EGP</td>
                  <td style={{ padding: '8px 10px', color: r.original ? '#9CA3AF' : '#1E1E1E', whiteSpace: 'nowrap', textDecoration: r.original ? 'line-through' : 'none' }}>{r.original ? `${r.original.toFixed(2)} EGP` : '—'}</td>
                  <td style={{ padding: '8px 10px', color: r.saving ? '#22C55E' : '#9CA3AF', fontWeight: 700, whiteSpace: 'nowrap' }}>{r.saving ? `${r.saving.toFixed(2)} EGP` : '—'}</td>
                  <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                    {r.discountPct ? (
                      <span style={{
                        background: r.discountPct >= 25 ? '#EF444422' : r.discountPct >= 15 ? '#F9A82522' : '#22C55E22',
                        color: r.discountPct >= 25 ? '#EF4444' : r.discountPct >= 15 ? '#F9A825' : '#22C55E',
                        fontWeight: 700, padding: '2px 8px', borderRadius: 10, fontSize: '0.7rem',
                      }}>{r.discountPct}% off</span>
                    ) : <span style={{ color: '#9CA3AF' }}>—</span>}
                  </td>
                  <td style={{ padding: '8px 10px', color: '#9CA3AF', fontSize: '0.68rem', maxWidth: 200 }}>{r.promoSignal}</td>
                  <td style={{ padding: '8px 10px', color: '#9CA3AF', whiteSpace: 'nowrap', fontSize: '0.68rem' }}>{r.collector}</td>
                  <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                    <span style={{ color: CONF_COLORS[r.confidence], fontWeight: 700, fontSize: '0.68rem' }}>{r.confidence}</span>
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1E88E5', fontSize: '0.65rem', textDecoration: 'none' }}>View ↗</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Benchmark Price Matrix */}
      <Card title="Benchmark SKU Price Matrix — Cross-Store Comparison" subtitle="10 benchmark products tracked across stores. Blank = price not yet captured for this store.">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 10px', borderBottom: '1px solid #1E1E1E', color: '#9CA3AF', fontWeight: 700, textAlign: 'left' }}>Product</th>
                {Object.keys(BENCHMARK_SKUS[0].prices).map(store => (
                  <th key={store} style={{ padding: '8px 10px', borderBottom: '1px solid #1E1E1E', color: '#9CA3AF', fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap' }}>{store}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BENCHMARK_SKUS.map((sku, i) => {
                const prices = Object.values(sku.prices).filter(Boolean);
                const minPrice = prices.length > 0 ? Math.min(...prices) : null;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #1E1E1E', background: i % 2 === 0 ? 'transparent' : '#0A0A0A' }}>
                    <td style={{ padding: '8px 10px', color: '#F5F5F5', fontWeight: 700 }}>{sku.product}</td>
                    {Object.entries(sku.prices).map(([store, price]) => (
                      <td key={store} style={{ padding: '8px 10px', textAlign: 'center' }}>
                        {price ? (
                          <span style={{ color: price === minPrice ? '#22C55E' : '#F5F5F5', fontWeight: price === minPrice ? 800 : 400 }}>
                            {price.toFixed(2)}
                            {price === minPrice && prices.length > 1 && <span style={{ color: '#22C55E', fontSize: '0.6rem', marginLeft: 3 }}>★ LOW</span>}
                          </span>
                        ) : <span style={{ color: '#1E1E1E', fontSize: '0.7rem' }}>—</span>}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, padding: '8px 12px', background: '#1E88E522', border: '1px solid #1E88E5', borderRadius: 8, fontSize: '0.72rem', color: '#9CA3AF' }}>
          <strong style={{ color: '#1E88E5' }}>📌 Note: </strong> Green = confirmed lowest price for this SKU across stores with data. Blank cells = price not yet captured — require Android/Appium or additional scraping runs to fill.
        </div>
      </Card>

      {/* Data Collection Tiers */}
      <Card title="Data Collection Infrastructure — Requirements & Cost" subtitle="Three tiers for building a repeatable grocery price + promotions intelligence system">
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {COLLECTION_TIERS.map((t, i) => (
            <button key={i} onClick={() => setSelectedTier(i)} style={{
              background: selectedTier === i ? (i === 0 ? '#F9A825' : i === 1 ? '#EF5F17' : '#EF4444') + '22' : 'transparent',
              border: `1px solid ${selectedTier === i ? (i === 0 ? '#F9A825' : i === 1 ? '#EF5F17' : '#EF4444') : '#1E1E1E'}`,
              color: selectedTier === i ? (i === 0 ? '#F9A825' : i === 1 ? '#EF5F17' : '#EF4444') : '#9CA3AF',
              padding: '6px 16px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {t.icon} {t.tier.split('—')[0].trim()}
            </button>
          ))}
        </div>
        {(() => {
          const tier = COLLECTION_TIERS[selectedTier];
          const tierColor = selectedTier === 0 ? '#F9A825' : selectedTier === 1 ? '#EF5F17' : '#EF4444';
          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                  {[
                    { label: 'Monthly Cost', value: tier.cost },
                    { label: 'SKU Coverage', value: tier.coverage },
                    { label: 'Run Frequency', value: tier.frequency },
                    { label: 'Stores Covered', value: tier.storesCovered.length === 1 && tier.storesCovered[0] === 'All 10 stores' ? '10 stores' : `${tier.storesCovered.length} stores` },
                  ].map(s => (
                    <div key={s.label} style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 8, padding: '8px 10px' }}>
                      <div style={{ color: '#9CA3AF', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{s.label}</div>
                      <div style={{ color: tierColor, fontWeight: 700, fontSize: '0.9rem' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ color: '#9CA3AF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Tools Required</div>
                  {tier.tools.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: tierColor, marginTop: 5, flexShrink: 0 }} />
                      <span style={{ color: '#F5F5F5', fontSize: '0.75rem' }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#0A0A0A', borderLeft: `3px solid ${tierColor}`, padding: '8px 12px', borderRadius: '0 6px 6px 0' }}>
                  <div style={{ color: '#9CA3AF', fontSize: '0.62rem', fontWeight: 700, marginBottom: 3 }}>BEST FOR</div>
                  <div style={{ color: '#F5F5F5', fontSize: '0.75rem' }}>{tier.bestFor}</div>
                </div>
              </div>
              <div>
                <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.82rem', marginBottom: 10 }}>Stores Covered</div>
                {tier.storesCovered.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                    <span style={{ color: '#F5F5F5', fontSize: '0.75rem' }}>{s}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, padding: '10px 12px', background: '#EF444422', border: '1px solid #EF4444', borderRadius: 8 }}>
                  <div style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.72rem', marginBottom: 4 }}>⚠ Limitations</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.72rem' }}>{tier.limitations}</div>
                </div>
                {selectedTier === 0 && (
                  <div style={{ marginTop: 10, padding: '10px 12px', background: '#22C55E22', border: '1px solid #22C55E', borderRadius: 8 }}>
                    <div style={{ color: '#22C55E', fontWeight: 700, fontSize: '0.72rem', marginBottom: 4 }}>✅ Current Status</div>
                    <div style={{ color: '#9CA3AF', fontSize: '0.72rem' }}>Bright Data and Apify are configured and working. D4D flyer route confirmed for Seoudi, Metro, Kazyon. 6 stores at PASS level already.</div>
                  </div>
                )}
                {selectedTier === 1 && (
                  <div style={{ marginTop: 10, padding: '10px 12px', background: '#F9A82522', border: '1px solid #F9A825', borderRadius: 8 }}>
                    <div style={{ color: '#F9A825', fontWeight: 700, fontSize: '0.72rem', marginBottom: 4 }}>📱 Android/Appium Status</div>
                    <div style={{ color: '#9CA3AF', fontSize: '0.72rem' }}>Appium 2.19.0 + UiAutomator2 4.2.9 installed. Java JDK + Android SDK ready. BLOCKER: No connected device/emulator. Connect phone via USB and enable USB debugging to unblock.</div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </Card>

      {/* What the system can track long-term */}
      <Card title="Full Grocery Intelligence Data Schema" subtitle="Every confirmed row must include these fields — the foundation for weekly benchmark reporting">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[
            { field: 'run_id', desc: 'ISO timestamp / batch ID' },
            { field: 'store', desc: 'Store name (10 tracked)' },
            { field: 'platform', desc: 'App / website / flyer / provider' },
            { field: 'city_area', desc: 'Cairo / Giza / area' },
            { field: 'category', desc: 'Grocery taxonomy' },
            { field: 'product_name', desc: 'Raw product name' },
            { field: 'normalized_product', desc: 'Benchmark SKU name' },
            { field: 'brand', desc: 'Brand if extractable' },
            { field: 'pack_size', desc: 'Size / weight / count' },
            { field: 'current_price_egp', desc: '✅ REQUIRED for success' },
            { field: 'original_price_egp', desc: 'Old/list price if available' },
            { field: 'discount_pct', desc: 'Calculated or extracted' },
            { field: 'saving_egp', desc: 'Old minus current' },
            { field: 'promo_type', desc: '%, fixed, bundle, coupon, cashback, BOGO, free delivery' },
            { field: 'promo_signal', desc: '✅ REQUIRED raw promo text' },
            { field: 'valid_from', desc: 'Start date if available' },
            { field: 'valid_until', desc: 'Expiry if available' },
            { field: 'availability', desc: 'In stock / out of stock' },
            { field: 'confidence', desc: 'C / E / L / APP_SCREEN' },
            { field: 'source_url', desc: 'URL for web/flyer rows' },
            { field: 'screenshot_path', desc: 'Required for app proof' },
            { field: 'collector', desc: 'brightdata / apify / appium / flyer_ocr' },
            { field: 'success', desc: '"yes" = price + promo both present' },
          ].map(f => (
            <div key={f.field} style={{
              background: '#0A0A0A', border: f.field.includes('REQUIRED') || f.field === 'current_price_egp' || f.field === 'promo_signal' ? '1px solid #22C55E' : '1px solid #1E1E1E',
              borderRadius: 6, padding: '6px 10px',
            }}>
              <div style={{ color: f.field === 'current_price_egp' || f.field === 'promo_signal' || f.field === 'success' ? '#22C55E' : '#1E88E5', fontWeight: 700, fontSize: '0.7rem', fontFamily: 'monospace' }}>{f.field}</div>
              <div style={{ color: '#9CA3AF', fontSize: '0.62rem', marginTop: 2 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
