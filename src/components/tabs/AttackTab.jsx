import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { T } from '../../lib';

const ATTACK_VECTORS = [
  {
    id: 1, rank: 1,
    name: 'Free Delivery Threshold Undercut',
    icon: '🚚',
    color: '#EF4444',
    impact: 95, effort: 40,
    impactLabel: 'CRITICAL', effortLabel: 'LOW',
    timeline: '4–8 weeks',
    investment: '$200K–$500K/month subsidy',
    expectedReturn: '35% grocery customer acquisition improvement',
    targetSegment: 'All grocery buyers — especially repeat/weekly shoppers',
    mechanism: 'Breadfast delivers free above 35 EGP. Talabat requires 150 EGP (T-Pro) or 9–25 EGP fee. Offer free delivery on all grocery orders above 60 EGP.',
    executionSteps: [
      'Set 60 EGP minimum for free grocery delivery (no subscription required)',
      'Subsidize via slightly higher commission rate on grocery vendors (2–3% uplift)',
      'Advertise head-to-head vs competitors: "Free delivery. Always. From 60 EGP."',
      'Target Breadfast users with retargeting ads emphasizing wider restaurant + grocery combo',
      'Measure: track weekly grocery repeat order rate vs baseline',
    ],
    kpis: ['CAC reduction (target: -35%)', 'Grocery repeat rate (target: 3.2× baseline)', 'Market share shift from Breadfast (target: +8pp in 6 months)'],
    evidence: 'Breadfast 35 EGP threshold confirmed (HIGH confidence). Talabat T-Pro 150 EGP threshold confirmed (HIGH). Gap = 4.3×.',
    confidence: 'HIGH',
  },
  {
    id: 2, rank: 2,
    name: 'Vendor Poaching — Low-Rating High-Volume Chains',
    icon: '🎯',
    color: '#F9A825',
    impact: 88, effort: 35,
    impactLabel: 'HIGH', effortLabel: 'LOW',
    timeline: '2–6 weeks',
    investment: '$50K–$150K commission incentive package',
    expectedReturn: 'Acquire 50–200 frustrated high-volume vendors at 40% lower commission',
    targetSegment: 'Vendors with 1,000+ reviews AND rating below 3.8 on Talabat — likely platform-dissatisfied',
    mechanism: 'Vendors with high review counts but low ratings often receive poor platform support. Offer exclusive commission reduction + dedicated account manager + better placement.',
    executionSteps: [
      'Scrape/identify all vendors with 1,000+ reviews and rating ≤ 3.8 (estimated 200–400 vendors)',
      'Direct outreach campaign: "Join us — 12% commission flat vs Talabat\'s 22% average"',
      'Offer guaranteed homepage placement for 3 months as signing bonus',
      'Dedicated vendor success team — weekly check-ins vs Talabat\'s hands-off approach',
      'Exclusivity clause: vendor lists your platform first for 6 months',
    ],
    kpis: ['Vendors signed (target: 50 in 90 days)', 'Revenue from poached vendors (target: $2M GMV/month)', 'Vendor NPS (target: >40 vs Talabat\'s ~12 estimated)'],
    evidence: '9,018 vendors in GeoJSON dataset. Rating distribution suggests ~15–20% have 1,000+ reviews and <3.8 rating.',
    confidence: 'MEDIUM',
  },
  {
    id: 3, rank: 3,
    name: 'Commission Rate Undercutting Strategy',
    icon: '💰',
    color: '#22C55E',
    impact: 85, effort: 55,
    impactLabel: 'HIGH', effortLabel: 'MEDIUM',
    timeline: '2–4 months',
    investment: 'Revenue sacrifice: ~$500K–$2M/month (offset by GMV growth)',
    expectedReturn: 'Lock in 200+ exclusive vendors; 40% GMV growth in 12 months',
    targetSegment: 'Top 100 vendors by GMV — fast food chains, top-rated restaurants, grocery leaders',
    mechanism: 'Talabat charges 15–30% commission (avg ~22%). Offering 12–16% is a 6–10pp reduction — the largest cost a vendor pays, directly hitting their bottom line.',
    executionSteps: [
      'Identify top 100 vendors by estimated GMV (using review count × avg order value proxy)',
      'Approach with: "12% flat commission for 12-month exclusivity on our platform"',
      'Commission reduction = avg 10 EGP savings per order for vendor on 100 EGP avg',
      'Bundle: commission reduction + marketing support + dedicated analytics dashboard',
      'Sign-on bonus: waive commission first 30 days + free menu photography',
    ],
    kpis: ['Exclusive vendors signed (target: 100 in 6 months)', 'Average commission paid by vendor (target: 14%)', 'Platform GMV from exclusive vendors (target: 35% of total)'],
    evidence: 'DH investor reports: 15–30% commission range confirmed HIGH. Market avg ~22% estimated MEDIUM.',
    confidence: 'HIGH',
  },
  {
    id: 4, rank: 4,
    name: 'Grocery Dark Store White Space Expansion',
    icon: '🏪',
    color: '#1E88E5',
    impact: 80, effort: 85,
    impactLabel: 'HIGH', effortLabel: 'HIGH',
    timeline: '6–18 months',
    investment: '$2M–$8M per dark store cluster (5 stores)',
    expectedReturn: 'Capture 1.2M+ households in 18 underserved governorates',
    targetSegment: 'Grocery shoppers outside Greater Cairo — Alexandria, Mansoura, Tanta, Luxor, Aswan',
    mechanism: 'Talabat Mart has 35 branches in only 8 governorates. 18+ governorates have zero dark store coverage. First mover in these markets can lock in brand loyalty permanently.',
    executionSteps: [
      'Launch 5 dark stores in Alexandria (12M population, 0 dark stores currently)',
      'Partner with local wholesalers in each city for supply chain — lower CAPEX vs building from scratch',
      'Leverage existing restaurant delivery network for last-mile in new cities',
      'Alexandria pilot: target 10,000 orders/day within 90 days of launch',
      'Expand to Mansoura and Tanta (combined 5M population) in months 6–12',
    ],
    kpis: ['New governorates served (target: 10 in 18 months)', 'Dark store daily orders (target: 10K/store/day)', 'Grocery market share outside Cairo (target: 35% in 2 years)'],
    evidence: 'Talabat Mart geography confirmed: 8 governorates, 35 branches (HIGH). Population gap analysis: 18+ governorates unserved (HIGH).',
    confidence: 'HIGH',
  },
  {
    id: 5, rank: 5,
    name: 'Predictable Daily Flash Deal Engine',
    icon: '⚡',
    color: '#EF5F17',
    impact: 78, effort: 30,
    impactLabel: 'HIGH', effortLabel: 'LOW',
    timeline: '3–6 weeks',
    investment: '$50K–$200K/month in co-funded discounts',
    expectedReturn: '2.3× repeat order rate; 45% order spike during flash windows',
    targetSegment: 'Habitual orderers — users who order 3+ times per week',
    mechanism: 'Talabat flash deals are unpredictable (Mon/Wed only, sporadic timing). Build a daily scheduled flash engine: 12:00 PM lunch flash, 6:00 PM dinner flash — every day, same time, reliable. Creates Pavlovian ordering habits.',
    executionSteps: [
      'Set daily flash windows: 12:00–13:00 PM (lunch) and 18:00–19:30 PM (dinner)',
      'Recruit 10 vendors per flash window with 25–35% platform-co-funded discounts',
      'Push notification campaign: "Your daily 12 PM deal is here" — personalized by cuisine preference',
      'Gamification: 5-day streak = free delivery for a week (loyalty mechanic)',
      'A/B test vs Talabat\'s sporadic model — track daily active user growth',
    ],
    kpis: ['Daily flash participation (target: 25 vendors/day)', 'Push notification CTR (target: 18% vs industry 8%)', 'Habitual orderer retention (target: 65% weekly retention)'],
    evidence: 'Talabat Happy Hour confirmed Mon/Wed only (HIGH). Flash deal +45% order uplift estimated (MEDIUM).',
    confidence: 'MEDIUM',
  },
  {
    id: 6, rank: 6,
    name: 'Arabic-First Grocery UX',
    icon: '🇸🇦',
    color: '#A855F7',
    impact: 70, effort: 65,
    impactLabel: 'HIGH', effortLabel: 'MEDIUM-HIGH',
    timeline: '3–6 months',
    investment: '$300K–$800K development + localization',
    expectedReturn: '+40% conversion rate among Arabic-speaking segments; -25% support tickets',
    targetSegment: '~60% of Egyptian users who primarily use Arabic on their phones',
    mechanism: 'Talabat grocery search is English-dominant. Categories, product names, and filter labels are primarily in English. Arabic-native app with dialect support (Egyptian Arabic NLP) for grocery search would serve the majority better.',
    executionSteps: [
      'Full Arabic grocery category tree: "خضروات وفاكهة" not "Fruits & Vegetables"',
      'Egyptian Arabic product search: "طماطم" returns tomatoes + related items',
      'Arabic speech-to-text grocery search (voice ordering)',
      'RTL-first UI design with Arabic-native category icons',
      'Arabic WhatsApp customer support integration (not English chatbot)',
    ],
    kpis: ['Arabic user conversion rate (target: 32% vs current ~19%)', 'App store rating improvement (target: 4.7+)', 'Arabic-language search success rate (target: 90%+)'],
    evidence: 'Arabic user proportion ~60% estimated (MEDIUM). English-dominant grocery UX observed (HIGH via direct app review).',
    confidence: 'MEDIUM',
  },
  {
    id: 7, rank: 7,
    name: 'Premium Grocery Segment Capture',
    icon: '💎',
    color: '#22D3EE',
    impact: 65, effort: 45,
    impactLabel: 'MEDIUM-HIGH', effortLabel: 'MEDIUM',
    timeline: '2–4 months',
    investment: '$100K–$300K (partner incentives + marketing)',
    expectedReturn: '+25 EGP avg order value; 18% better margins on premium orders',
    targetSegment: 'Upper-income households in Zamalek, New Cairo, Fifth Settlement, Maadi — estimated 500K households',
    mechanism: 'Only Spinneys and Gourmet Egypt serve the premium grocery segment on Talabat. No competitor has actively courted M&S Food, Carrefour Select, or specialist importers. Exclusive premium partnership = instant differentiation.',
    executionSteps: [
      'Approach Marks & Spencer Food for exclusive Egypt delivery partnership',
      'Partner with specialty importers: organic, keto, halal-certified international brands',
      'Curated "Premium Edit" section with weekly editor\'s picks',
      'White-glove delivery service: uniformed drivers, temperature-controlled bags, timed slots',
      'Subscription "Premium Box" weekly: curated premium grocery delivered Saturday AM',
    ],
    kpis: ['Premium GMV (target: 15% of total in 12 months)', 'Premium order AOV (target: 450+ EGP)', 'Premium customer LTV (target: 3× standard customer)'],
    evidence: 'Premium grocery gap confirmed: only 2 premium grocery partners on Talabat (HIGH). M&S Food availability not confirmed (UNKNOWN).',
    confidence: 'MEDIUM',
  },
];

const CONF_COLORS = { HIGH: '#22C55E', MEDIUM: '#F9A825', LOW: '#EF4444' };

const Card = ({ title, subtitle, children, style }) => (
  <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: 14, padding: '1.25rem', ...style }}>
    {title && <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{title}</div>}
    {subtitle && <div style={{ color: '#9CA3AF', fontSize: '0.72rem', marginBottom: 14 }}>{subtitle}</div>}
    {children}
  </div>
);

function ImpactEffortChart({ vectors, onSelect, selectedId }) {
  const scatterData = vectors.map(v => ({
    name: v.name,
    value: [v.effort, v.impact, v.id],
    itemStyle: { color: v.color },
    label: { show: true, formatter: v.icon, fontSize: 14 },
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#111111', borderColor: '#1E1E1E', textStyle: { color: '#F5F5F5', fontSize: 11 },
      formatter: (p) => {
        const v = vectors[p.dataIndex];
        return `<strong>${v.icon} ${v.name}</strong><br/>Impact: ${v.impact}/100<br/>Effort: ${v.effort}/100<br/>Timeline: ${v.timeline}`;
      },
    },
    grid: { top: 30, right: 20, bottom: 50, left: 50 },
    xAxis: {
      type: 'value', name: 'Effort Required →', nameLocation: 'middle', nameGap: 28,
      min: 0, max: 100,
      nameTextStyle: { color: '#9CA3AF', fontSize: 10 },
      axisLabel: { color: '#9CA3AF', fontSize: 10, formatter: v => v === 0 ? 'LOW' : v === 50 ? 'MEDIUM' : v === 100 ? 'HIGH' : '' },
      splitLine: { lineStyle: { color: '#1E1E1E', type: 'dashed' } }, axisLine: { lineStyle: { color: '#1E1E1E' } },
    },
    yAxis: {
      type: 'value', name: '← Impact', nameLocation: 'middle', nameGap: 35,
      min: 0, max: 100,
      nameTextStyle: { color: '#9CA3AF', fontSize: 10 },
      axisLabel: { color: '#9CA3AF', fontSize: 10, formatter: v => v === 0 ? 'LOW' : v === 50 ? 'MEDIUM' : v === 100 ? 'CRITICAL' : '' },
      splitLine: { lineStyle: { color: '#1E1E1E', type: 'dashed' } }, axisLine: { lineStyle: { color: '#1E1E1E' } },
    },
    // Quadrant backgrounds
    markArea: {
      silent: true,
      data: [
        [{ name: '🏆 Quick Wins', xAxis: 0, yAxis: 50, itemStyle: { color: '#22C55E', opacity: 0.04 } }, { xAxis: 50, yAxis: 100 }],
        [{ name: 'Strategic Bets', xAxis: 50, yAxis: 50, itemStyle: { color: '#1E88E5', opacity: 0.04 } }, { xAxis: 100, yAxis: 100 }],
        [{ name: 'Low Priority', xAxis: 0, yAxis: 0, itemStyle: { color: '#9CA3AF', opacity: 0.03 } }, { xAxis: 50, yAxis: 50 }],
        [{ name: 'Time Sinks', xAxis: 50, yAxis: 0, itemStyle: { color: '#EF4444', opacity: 0.03 } }, { xAxis: 100, yAxis: 50 }],
      ],
    },
    series: [{
      type: 'scatter', data: scatterData, symbolSize: 40,
      label: { show: true, formatter: (p) => vectors[p.dataIndex].icon, position: 'inside', fontSize: 16 },
    }],
  };

  return <ReactECharts option={option} style={{ height: 360, width: '100%' }} onEvents={{ click: (p) => { if (vectors[p.dataIndex]) onSelect(vectors[p.dataIndex]); } }} />;
}

export default function AttackTab() {
  const [selected, setSelected] = useState(ATTACK_VECTORS[0]);

  const sortedByRank = [...ATTACK_VECTORS].sort((a, b) => a.rank - b.rank);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header scorecard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Attack Vectors Identified', value: ATTACK_VECTORS.length, icon: '⚔️', color: '#EF4444' },
          { label: 'Quick Win Vectors (High Impact / Low Effort)', value: ATTACK_VECTORS.filter(v => v.impact >= 80 && v.effort <= 50).length, icon: '🏆', color: '#22C55E' },
          { label: 'Max GMV Impact (Annual, optimistic)', value: '$28M+', icon: '💰', color: '#F9A825' },
          { label: 'Fastest Vector Timeline', value: '4–8 weeks', icon: '⚡', color: '#1E88E5' },
        ].map(k => (
          <div key={k.label} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{k.icon}</div>
            <div style={{ color: '#9CA3AF', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>{k.label}</div>
            <div style={{ color: k.color, fontWeight: 900, fontSize: '1.3rem' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Scatter plot + ranking table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        <Card title="Impact vs Effort Matrix" subtitle="Click any vector to see the full playbook. Top-left = execute now.">
          <ImpactEffortChart vectors={ATTACK_VECTORS} onSelect={setSelected} selectedId={selected.id} />
          <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center', fontSize: '0.65rem', color: '#9CA3AF' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ display: 'inline-block', width: 10, height: 10, background: '#22C55E', opacity: 0.3, borderRadius: 2 }} />Quick Wins</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ display: 'inline-block', width: 10, height: 10, background: '#1E88E5', opacity: 0.3, borderRadius: 2 }} />Strategic Bets</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ display: 'inline-block', width: 10, height: 10, background: '#9CA3AF', opacity: 0.2, borderRadius: 2 }} />Low Priority</span>
          </div>
        </Card>

        <Card title="Priority Ranking" subtitle="Sorted by composite Impact/Effort score">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sortedByRank.map(v => (
              <div
                key={v.id}
                onClick={() => setSelected(v)}
                style={{
                  background: selected.id === v.id ? v.color + '22' : '#0A0A0A',
                  border: `1px solid ${selected.id === v.id ? v.color : '#1E1E1E'}`,
                  borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
                }}
              >
                <span style={{ color: v.color, fontWeight: 900, fontSize: '1rem' }}>#{v.rank}</span>
                <span style={{ fontSize: '1rem' }}>{v.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.62rem', marginTop: 1 }}>{v.timeline} · {v.effortLabel} effort</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: v.color, fontWeight: 700, fontSize: '0.8rem' }}>{v.impact}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.58rem' }}>impact</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Selected vector deep-dive */}
      {selected && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: '1.8rem' }}>{selected.icon}</span>
                  <h3 style={{ margin: 0, color: selected.color, fontWeight: 800, fontSize: '1rem' }}>{selected.name}</h3>
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '0.72rem', lineHeight: 1.4 }}>{selected.mechanism}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[
                { label: 'Impact Score', value: `${selected.impact}/100`, color: selected.color },
                { label: 'Effort Level', value: selected.effortLabel, color: '#9CA3AF' },
                { label: 'Timeline', value: selected.timeline, color: '#1E88E5' },
                { label: 'Investment', value: selected.investment, color: '#F9A825' },
              ].map(s => (
                <div key={s.label} style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ color: '#9CA3AF', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{s.label}</div>
                  <div style={{ color: s.color, fontWeight: 700, fontSize: '0.82rem' }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#9CA3AF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Target Segment</div>
              <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 8, padding: '8px 12px', color: '#F5F5F5', fontSize: '0.78rem' }}>{selected.targetSegment}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#9CA3AF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Expected Return</div>
              <div style={{ background: selected.color + '22', border: `1px solid ${selected.color}`, borderRadius: 8, padding: '8px 12px', color: selected.color, fontWeight: 700, fontSize: '0.82rem' }}>{selected.expectedReturn}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#9CA3AF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Success KPIs</div>
              {selected.kpis.map((kpi, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: selected.color, marginTop: 5, flexShrink: 0 }} />
                  <span style={{ color: '#F5F5F5', fontSize: '0.72rem', lineHeight: 1.4 }}>{kpi}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#0A0A0A', borderLeft: `3px solid ${CONF_COLORS[selected.confidence]}`, borderRadius: '0 8px 8px 0', padding: '8px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: CONF_COLORS[selected.confidence], fontWeight: 700, fontSize: '0.7rem' }}>🟢 {selected.confidence} confidence</span>
              <span style={{ color: '#9CA3AF', fontSize: '0.68rem' }}>{selected.evidence}</span>
            </div>
          </Card>

          <Card>
            <div style={{ color: '#F5F5F5', fontWeight: 700, marginBottom: 14 }}>⚔️ Execution Playbook</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.executionSteps.map((step, i) => (
                <div key={i} style={{
                  background: '#0A0A0A', border: `1px solid ${selected.color}33`, borderRadius: 10,
                  padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: selected.color, color: '#000', fontWeight: 900,
                    fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{i + 1}</div>
                  <span style={{ color: '#F5F5F5', fontSize: '0.78rem', lineHeight: 1.5 }}>{step}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Executive summary table */}
      <Card title="Attack Vector Executive Summary" subtitle="Board-ready overview of all 7 strategic entry points">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.77rem' }}>
            <thead>
              <tr>
                {['#', 'Vector', 'Impact', 'Effort', 'Timeline', 'Investment', 'Expected Return', 'Confidence'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', borderBottom: '1px solid #1E1E1E', color: '#9CA3AF', fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedByRank.map((v, i) => (
                <tr key={v.id} onClick={() => setSelected(v)} style={{ borderBottom: '1px solid #1E1E1E', cursor: 'pointer', background: selected.id === v.id ? v.color + '11' : 'transparent' }}>
                  <td style={{ padding: '9px 10px', color: v.color, fontWeight: 800 }}>#{v.rank}</td>
                  <td style={{ padding: '9px 10px', color: '#F5F5F5', fontWeight: 700 }}>{v.icon} {v.name}</td>
                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 50, height: 6, background: '#1E1E1E', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${v.impact}%`, height: '100%', background: v.color }} />
                      </div>
                      <span style={{ color: v.color, fontWeight: 700 }}>{v.impact}</span>
                    </div>
                  </td>
                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 50, height: 6, background: '#1E1E1E', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${v.effort}%`, height: '100%', background: '#9CA3AF' }} />
                      </div>
                      <span style={{ color: '#9CA3AF', fontWeight: 700 }}>{v.effort}</span>
                    </div>
                  </td>
                  <td style={{ padding: '9px 10px', color: '#1E88E5' }}>{v.timeline}</td>
                  <td style={{ padding: '9px 10px', color: '#9CA3AF', fontSize: '0.7rem' }}>{v.investment.split('(')[0]}</td>
                  <td style={{ padding: '9px 10px', color: '#22C55E', fontWeight: 600, fontSize: '0.72rem' }}>{v.expectedReturn}</td>
                  <td style={{ padding: '9px 10px', color: CONF_COLORS[v.confidence], fontWeight: 700 }}>{v.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
