import React, { useRef, useEffect } from 'react';
import echarts, { DARK_THEME, BRAND_PALETTE } from '../../lib/echarts-config';

export default function EChartsRadar({ brands, indicators, title }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (instanceRef.current) instanceRef.current.dispose();
    instanceRef.current = echarts.init(chartRef.current, DARK_THEME);

    const option = {
      title: { text: title || '', left: 'center', textStyle: { color: '#F5F5F5', fontSize: 14 } },
      tooltip: { trigger: 'item' },
      legend: { data: (brands || []).map(b => b.name), bottom: 0, textStyle: { color: '#9CA3AF' } },
      radar: {
        indicator: (indicators || []).map(ind => ({ name: ind.name, max: ind.max || 100 })),
        axisName: { color: '#9CA3AF' },
        splitArea: { areaStyle: { color: ['rgba(30,68,138,0.1)', 'rgba(30,68,138,0.05)'] } },
        axisLine: { lineStyle: { color: '#1E1E1E' } },
        splitLine: { lineStyle: { color: '#1E1E1E' } },
      },
      series: [{
        type: 'radar',
        data: (brands || []).map((b, i) => ({
          name: b.name,
          value: b.values,
          lineStyle: { color: b.color || BRAND_PALETTE[i % BRAND_PALETTE.length] },
          areaStyle: { color: (b.color || BRAND_PALETTE[i % BRAND_PALETTE.length]) + '30' },
          itemStyle: { color: b.color || BRAND_PALETTE[i % BRAND_PALETTE.length] },
        })),
      }],
    };

    instanceRef.current.setOption(option);
    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); instanceRef.current?.dispose(); };
  }, [brands, indicators, title]);

  return <div ref={chartRef} style={{ width: '100%', height: 380 }} />;
}