import React, { useRef, useEffect } from 'react';
import echarts, { DARK_THEME, BRAND_PALETTE } from '../../lib/echarts-config';

export default function EChartsTreemap({ data, title }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (instanceRef.current) instanceRef.current.dispose();
    instanceRef.current = echarts.init(chartRef.current, DARK_THEME);

    const option = {
      title: { text: title || '', left: 'center', textStyle: { color: '#F5F5F5', fontSize: 14 } },
      tooltip: { formatter: (p) => `${p.name}<br/>Share: <b>${p.value}%</b>` },
      series: [{
        type: 'treemap',
        width: '90%',
        height: '80%',
        top: 40,
        roam: false,
        nodeClick: 'link',
        breadcrumb: { show: true, itemStyle: { color: '#1E1E1E', textStyle: { color: '#9CA3AF' } } },
        label: { show: true, color: '#F5F5F5', fontSize: 12, formatter: (p) => `${p.name}\n${p.value}%` },
        itemStyle: { borderColor: '#0A0A0A', borderWidth: 2, gapWidth: 2 },
        data: (data || []).map((d, i) => ({
          name: d.name || d.brand,
          value: d.value || d.share,
          itemStyle: { color: d.color || BRAND_PALETTE[i % BRAND_PALETTE.length] },
        })),
      }],
    };

    instanceRef.current.setOption(option);
    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); instanceRef.current?.dispose(); };
  }, [data, title]);

  return <div ref={chartRef} style={{ width: '100%', height: 350 }} />;
}