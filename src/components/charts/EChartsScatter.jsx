import React, { useRef, useEffect } from 'react';
import echarts, { DARK_THEME } from '../../lib/echarts-config';

export default function EChartsScatter({ data, xLabel, yLabel, sizeLabel, title }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (instanceRef.current) instanceRef.current.dispose();
    instanceRef.current = echarts.init(chartRef.current, DARK_THEME);

    const option = {
      title: { text: title || '', left: 'center', textStyle: { color: '#F5F5F5', fontSize: 14 } },
      tooltip: {
        formatter: (p) => {
          const d = p.data;
          return `<b>${d[3]}</b><br/>${xLabel || 'X'}: ${typeof d[0] === 'number' ? d[0] : d[0]}<br/>${yLabel || 'Y'}: ${d[1]}<br/>${sizeLabel || 'Size'}: ${d[2]?.toLocaleString?.() || d[2]}`;
        },
      },
      grid: { left: 60, right: 30, top: 40, bottom: 40 },
      xAxis: { name: xLabel || '', nameTextStyle: { color: '#9CA3AF' }, axisLabel: { color: '#9CA3AF' }, splitLine: { lineStyle: { color: '#1E1E1E', type: 'dashed' } } },
      yAxis: { name: yLabel || '', nameTextStyle: { color: '#9CA3AF' }, axisLabel: { color: '#9CA3AF' }, splitLine: { lineStyle: { color: '#1E1E1E', type: 'dashed' } } },
      series: [{
        type: 'scatter',
        symbolSize: (val) => Math.max(Math.sqrt(val[2] || 1) * 2, 8),
        data: (data || []).map(d => [d.x, d.y, d.size || 1, d.name]),
        itemStyle: { color: (p) => (data && data[p.dataIndex] && data[p.dataIndex].color) || '#1E88E5' },
        label: { show: true, formatter: (p) => p.data[3], position: 'right', color: '#9CA3AF', fontSize: 10 },
      }],
    };

    instanceRef.current.setOption(option);
    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); instanceRef.current?.dispose(); };
  }, [data, xLabel, yLabel, sizeLabel, title]);

  return <div ref={chartRef} style={{ width: '100%', height: 350 }} />;
}