import React, { useRef, useEffect } from 'react';
import echarts, { DARK_THEME } from '../../lib/echarts-config';

export default function EChartsCuisineHeatmap({ cuisines, ratingBuckets, data, title }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (instanceRef.current) instanceRef.current.dispose();
    instanceRef.current = echarts.init(chartRef.current, DARK_THEME);

    const yLabels = cuisines || [];
    const xLabels = ratingBuckets || ['<2.0', '2.0-2.9', '3.0-3.4', '3.5-3.9', '4.0-4.4', '4.5+'];
    const heatData = (data || []).map(d => [d.x, d.y, d.value]);

    const option = {
      title: { text: title || 'Cuisine × Rating Density', left: 'center', textStyle: { color: '#F5F5F5', fontSize: 14 } },
      tooltip: { position: 'top', formatter: (p) => `${yLabels[p.data[1]]}<br/>${xLabels[p.data[0]]}: <b>${p.data[2]}</b> vendors` },
      grid: { left: 120, right: 50, top: 40, bottom: 20 },
      xAxis: { type: 'category', data: xLabels, splitArea: { show: true }, axisLabel: { color: '#9CA3AF', fontSize: 10 } },
      yAxis: { type: 'category', data: yLabels, splitArea: { show: true }, axisLabel: { color: '#9CA3AF', fontSize: 10 } },
      visualMap: { min: 0, max: Math.max(...(heatData.map(d => d[2] || 0)), 1), calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#0A0A0A', '#1E4BA3', '#1E88E5', '#42A5F5', '#F9A825'] }, textStyle: { color: '#9CA3AF' } },
      series: [{
        type: 'heatmap',
        data: heatData,
        label: { show: true, color: '#F5F5F5', fontSize: 9 },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
      }],
    };

    instanceRef.current.setOption(option);
    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); instanceRef.current?.dispose(); };
  }, [cuisines, ratingBuckets, data, title]);

  return <div ref={chartRef} style={{ width: '100%', height: 400 }} />;
}