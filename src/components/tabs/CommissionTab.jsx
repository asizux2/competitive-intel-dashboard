import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { T } from '../../lib';

const Card = ({ title, subtitle, children, style }) => (
  <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: 14, padding: '1.25rem', ...style }}>
    {title && <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{title}</div>}
    {subtitle && <div style={{ color: '#9CA3AF', fontSize: '0.72rem', marginBottom: 14 }}>{subtitle}</div>}
    {children}
  </div>
);

function Slider({ label, min, max, value, onChange, step = 1, prefix = '', suffix = '', color = '#1E88E5' }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
        <span style={{ color: color, fontWeight: 800, fontSize: '1rem' }}>{prefix}{value.toLocaleString()}{suffix}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: color, cursor: 'pointer', height: 4 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '0.62rem', marginTop: 4 }}>
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
}

function WaterfallChart({ data }) {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#111111', borderColor: '#1E1E1E', textStyle: { color: '#F5F5F5', fontSize: 11 },
      formatter: (params) => {
        const d = params[0];
        return `<strong>${d.name}</strong><br/>${d.value < 0 ? '−' : '+'} ${Math.abs(d.value).toLocaleString()} EGP`;
      },
    },
    grid: { top: 20, right: 20, bottom: 60, left: 20, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLabel: { color: '#9CA3AF', fontSize: 9, rotate: 15 },
      axisLine: { lineStyle: { color: '#1E1E1E' } }, axisTick: { show: false },
    },
    yAxis: { type: 'value', axisLabel: { color: '#9CA3AF', fontSize: 9, formatter: v => `${(v / 1000).toFixed(0)}K` }, splitLine: { lineStyle: { color: '#1E1E1E', type: 'dashed' } }, axisLine: { show: false } },
    series: [
      {
        type: 'bar', data: data.map(d => d.type === 'invisible' ? d.value : 0),
        itemStyle: { color: 'transparent', borderColor: 'transparent' }, barMaxWidth: 40,
        stack: 'waterfall',
      },
      {
        type: 'bar', data: data.map(d => d.type !== 'invisible' ? d.value : 0),
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: (params) => {
            const item = data[params.dataIndex];
            if (item.type === 'total') return '#1E88E5';
            if (item.value < 0) return '#EF4444';
            return '#22C55E';
          },
        },
        label: {
          show: true, position: 'top', color: '#9CA3AF', fontSize: 9,
          formatter: (params) => {
            const item = data[params.dataIndex];
            if (item.type === 'invisible') return '';
            const v = Math.abs(params.value);
            return v > 999 ? `${(v / 1000).toFixed(1)}K` : v;
          },
        },
        barMaxWidth: 40, stack: 'waterfall',
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 260, width: '100%' }} />;
}

function RevenueDonut({ breakdown }) {
  const data = Object.entries(breakdown).map(([name, value]) => ({ name, value: Math.round(value) }));
  const COLORS = ['#1E88E5', '#22C55E', '#F9A825', '#EF4444'];

  const option = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: '#111111', borderColor: '#1E1E1E', textStyle: { color: '#F5F5F5' }, formatter: p => `${p.name}: ${p.value.toLocaleString()} EGP (${p.percent}%)` },
    legend: { orient: 'vertical', right: 0, top: 'middle', textStyle: { color: '#9CA3AF', fontSize: 10 } },
    series: [{
      type: 'pie', radius: ['45%', '72%'], center: ['38%', '50%'],
      data: data.map((d, i) => ({ ...d, itemStyle: { color: COLORS[i % COLORS.length] } })),
      label: { show: false }, emphasis: { scale: true, scaleSize: 6 },
    }],
  };

  return <ReactECharts option={option} style={{ height: 240, width: '100%' }} />;
}

function MetricBox({ label, value, subValue, color, large }) {
  return (
    <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 10, padding: large ? '1rem' : '0.75rem', textAlign: 'center' }}>
      <div style={{ color: '#9CA3AF', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ color: color || '#F5F5F5', fontSize: large ? '1.6rem' : '1.1rem', fontWeight: 900 }}>{value}</div>
      {subValue && <div style={{ color: '#9CA3AF', fontSize: '0.65rem', marginTop: 4 }}>{subValue}</div>}
    </div>
  );
}

export default function CommissionTab() {
  const [monthlyOrders, setMonthlyOrders] = useState(500000);
  const [avgOrderValue, setAvgOrderValue] = useState(180);
  const [commissionRate, setCommissionRate] = useState(22);
  const [tproSubRate, setTproSubRate] = useState(18);
  const [tproMonthlyEGP] = useState(79);
  const [avgDeliveryFee] = useState(15);
  const [deliveryFeeRetention] = useState(60);
  const [marketingSpend, setMarketingSpend] = useState(12);

  const calc = useMemo(() => {
    const gmv = monthlyOrders * avgOrderValue;
    const commissionRev = gmv * (commissionRate / 100);
    const tproUsers = monthlyOrders * (tproSubRate / 100);
    const tproRev = tproUsers * tproMonthlyEGP;
    const nonTproOrders = monthlyOrders * (1 - tproSubRate / 100);
    const deliveryRev = nonTproOrders * avgDeliveryFee * (deliveryFeeRetention / 100);
    const mktSpend = gmv * (marketingSpend / 100);
    const totalRev = commissionRev + tproRev + deliveryRev;
    const netRev = totalRev - mktSpend;
    const takeRate = (totalRev / gmv) * 100;
    const vendorTakeHome = gmv - commissionRev;
    const vendorPerOrder = avgOrderValue * (1 - commissionRate / 100);

    return { gmv, commissionRev, tproRev, deliveryRev, totalRev, netRev, mktSpend, takeRate, vendorTakeHome, vendorPerOrder };
  }, [monthlyOrders, avgOrderValue, commissionRate, tproSubRate, tproMonthlyEGP, avgDeliveryFee, deliveryFeeRetention, marketingSpend]);

  const fmt = (n) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M EGP` : `${Math.round(n / 1000)}K EGP`;

  const waterfallData = [
    { name: 'Gross GMV', value: calc.gmv, type: 'total' },
    { name: 'invisible', value: calc.gmv - calc.commissionRev, type: 'invisible' },
    { name: 'Commission Rev', value: calc.commissionRev, type: 'positive' },
    { name: 'invisible2', value: 0, type: 'invisible' },
    { name: 'T-Pro Rev', value: calc.tproRev, type: 'positive' },
    { name: 'invisible3', value: 0, type: 'invisible' },
    { name: 'Delivery Rev', value: calc.deliveryRev, type: 'positive' },
    { name: 'Marketing Cost', value: -calc.mktSpend, type: 'negative' },
    { name: 'Net Platform Rev', value: calc.netRev, type: 'total' },
  ];

  const donutBreakdown = {
    'Commission': calc.commissionRev,
    'T-Pro': calc.tproRev,
    'Delivery Fees': calc.deliveryRev,
    'Net (after Mkt)': calc.netRev > 0 ? 0 : Math.abs(calc.netRev),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        <MetricBox label="Monthly GMV" value={fmt(calc.gmv)} color="#1E88E5" large />
        <MetricBox label="Platform Revenue" value={fmt(calc.totalRev)} subValue={`${calc.takeRate.toFixed(1)}% take rate`} color="#22C55E" large />
        <MetricBox label="Net After Marketing" value={fmt(calc.netRev)} subValue={`${marketingSpend}% mkt spend`} color={calc.netRev > 0 ? '#22C55E' : '#EF4444'} large />
        <MetricBox label="Vendor Take-Home" value={fmt(calc.vendorTakeHome)} subValue={`${(100 - commissionRate).toFixed(0)}% of GMV`} color="#F9A825" large />
        <MetricBox label="Avg Vendor / Order" value={`${Math.round(calc.vendorPerOrder)} EGP`} subValue="After commission" color="#A855F7" large />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Calculator */}
        <Card title="Interactive Revenue Calculator" subtitle="Adjust sliders to model platform economics at any scale">
          <Slider label="Monthly Orders" min={10000} max={5000000} step={10000} value={monthlyOrders} onChange={setMonthlyOrders} color="#1E88E5" />
          <Slider label="Avg Order Value" min={50} max={500} step={5} value={avgOrderValue} onChange={setAvgOrderValue} suffix=" EGP" color="#F9A825" />
          <Slider label="Commission Rate" min={10} max={35} step={0.5} value={commissionRate} onChange={setCommissionRate} suffix="%" color="#EF5F17" />
          <Slider label="T-Pro Subscriber Rate" min={5} max={50} step={1} value={tproSubRate} onChange={setTproSubRate} suffix="% of users" color="#22C55E" />
          <Slider label="Marketing Spend" min={5} max={25} step={1} value={marketingSpend} onChange={setMarketingSpend} suffix="% of GMV" color="#EF4444" />

          <div style={{ borderTop: '1px solid #1E1E1E', paddingTop: 14, marginTop: 4 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <MetricBox label="Commission Rev" value={fmt(calc.commissionRev)} color="#1E88E5" />
              <MetricBox label="T-Pro Revenue" value={fmt(calc.tproRev)} color="#22C55E" />
              <MetricBox label="Delivery Rev" value={fmt(calc.deliveryRev)} color="#F9A825" />
            </div>
          </div>
        </Card>

        {/* Revenue donut */}
        <Card title="Revenue Stream Mix" subtitle="Platform revenue breakdown by source">
          <RevenueDonut breakdown={donutBreakdown} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {[
              { label: 'Commission Revenue', value: `${((calc.commissionRev / calc.totalRev) * 100).toFixed(0)}%`, color: '#1E88E5' },
              { label: 'T-Pro Subscriptions', value: `${((calc.tproRev / calc.totalRev) * 100).toFixed(0)}%`, color: '#22C55E' },
              { label: 'Delivery Fee Revenue', value: `${((calc.deliveryRev / calc.totalRev) * 100).toFixed(0)}%`, color: '#F9A825' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
                  <span style={{ color: '#9CA3AF' }}>{r.label}</span>
                </div>
                <span style={{ color: r.color, fontWeight: 700 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Waterfall */}
      <Card title="Revenue Waterfall (Monthly)" subtitle="From gross GMV to net platform revenue — where the money flows">
        <WaterfallChart data={waterfallData} />
      </Card>

      {/* Market benchmarks */}
      <Card title="Commission Rate Benchmarking" subtitle="Egypt food delivery platforms — reported and estimated commission ranges">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr>
                {['Platform', 'Commission Range', 'Avg Rate', 'T-Pro / Subscription', 'Delivery Fee (non-sub)', 'Effective Take Rate', 'Confidence'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', borderBottom: '1px solid #1E1E1E', color: '#9CA3AF', fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { platform: 'Talabat', range: '15–30%', avg: '22%', sub: '79/799 EGP', del: '9–25 EGP', take: '27–32%', conf: 'HIGH', highlight: true },
                { platform: 'Breadfast', range: '0% (own inventory)', avg: 'N/A', sub: 'Points system', del: '0 EGP (35+ EGP min)', take: 'N/A (margin model)', conf: 'HIGH', highlight: false },
                { platform: 'Rabbit', range: '15–25% est.', avg: '18%', sub: 'None', del: '0 EGP (first order)', take: '20–25%', conf: 'MEDIUM', highlight: false },
                { platform: 'Elmenus', range: '12–20%', avg: '16%', sub: 'None', del: '10–20 EGP', take: '18–22%', conf: 'MEDIUM', highlight: false },
                { platform: 'Delivery Hero (DH Intl avg)', range: '18–25%', avg: '21%', sub: 'Various', del: 'Varies', take: '24–28%', conf: 'HIGH', highlight: false },
              ].map((r, i) => (
                <tr key={i} style={{ background: r.highlight ? '#1E88E522' : 'transparent', borderBottom: '1px solid #1E1E1E' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#F5F5F5' }}>{r.platform}</td>
                  <td style={{ padding: '10px 12px', color: '#F9A825' }}>{r.range}</td>
                  <td style={{ padding: '10px 12px', color: '#F5F5F5', fontWeight: 700 }}>{r.avg}</td>
                  <td style={{ padding: '10px 12px', color: '#9CA3AF' }}>{r.sub}</td>
                  <td style={{ padding: '10px 12px', color: '#9CA3AF' }}>{r.del}</td>
                  <td style={{ padding: '10px 12px', color: '#22C55E', fontWeight: 700 }}>{r.take}</td>
                  <td style={{ padding: '10px 12px', color: r.conf === 'HIGH' ? '#22C55E' : '#F9A825', fontWeight: 700, fontSize: '0.7rem' }}>{r.conf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14, padding: '10px 14px', background: '#F9A82522', border: '1px solid #F9A825', borderRadius: 8 }}>
          <strong style={{ color: '#F9A825' }}>💡 Key Takeaway: </strong>
          <span style={{ color: '#F5F5F5', fontSize: '0.78rem' }}>
            Offering vendors 12–16% commission (vs Talabat's 22% avg) reduces platform margin but creates a powerful vendor acquisition lever.
            At 500K orders/month, a 6% commission reduction costs ~{fmt(500000 * 180 * 0.06)} in monthly revenue — but could lock in 200+ exclusive vendors.
          </span>
        </div>
      </Card>
    </div>
  );
}
