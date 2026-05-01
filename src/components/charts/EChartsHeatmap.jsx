import React, { useRef, useEffect } from 'react';
import echarts, { DARK_THEME, BRAND_PALETTE } from '../../lib/echarts-config';

export default function EChartsHeatmap({ data, xLabels, yLabels, title, colorRange = ['#1a1a2e', '#1E88E5', '#22C55E'] }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (instanceRef.current) instanceRef.current.dispose();
    instanceRef.current = echarts.init(chartRef.current, DARK_THEME);

    const option = {
      title: { text: title || '', left: 'center', textStyle: { color: '#F5F5F5', fontSize: 14 } },
      tooltip: { position: 'top', formatter: (p) => `${yLabels[p.data[1]] || ''} × ${xLabels[p.data[0]] || ''}<br/>Score: <b>${p.data[2]?.toFixed(3)}</b>` },
      grid: { left: 100, right: 40, top: 40, bottom: 20 },
      xAxis: { type: 'category', data: xLabels, splitArea: { show: true }, axisLabel: { color: '#9CA3AF', fontSize: 10, rotate: 30 } },
      yAxis: { type: 'category', data: yLabels, splitArea: { show: true }, axisLabel: { color: '#9CA3AF', fontSize: 10 } },
      visualMap: { min: -0.4, max: 0.6, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: colorRange }, textStyle: { color: '#9CA3AF' } },
      series: [{
        name: title || 'Score',
        type: 'heatmap',
        data: data,
        label: { show: true, color: '#F5F5F5', fontSize: 9 },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
      }],
    };

    instanceRef.current.setOption(option);
    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); instanceRef.current?.dispose(); };
  }, [data, xLabels, yLabels, title, colorRange]);

  return <div ref={chartRef} style={{ width: '100%', height: 350 }} />;
}