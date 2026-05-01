import React from 'react';
import ReactECharts from 'echarts-for-react';
import { T } from '../../lib';

export default function EChartsBar({
  data = [],
  xKey = 'name',
  yKey = 'value',
  color = T.primary,
  horizontal = false,
  height = 320,
  showLabel = true,
  labelFormatter,
  tooltipFormatter,
  gradientEnd,
}) {
  const names = data.map(d => d[xKey]);
  const values = data.map(d => d[yKey]);
  const endColor = gradientEnd || color + '55';

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: T.card,
      borderColor: T.border,
      textStyle: { color: T.text, fontSize: 12 },
      formatter: tooltipFormatter || undefined,
    },
    grid: {
      top: 16,
      right: 16,
      bottom: horizontal ? 16 : 48,
      left: horizontal ? 140 : 40,
      containLabel: true,
    },
    xAxis: horizontal
      ? {
          type: 'value',
          axisLabel: { color: T.muted, fontSize: 10 },
          splitLine: { lineStyle: { color: T.border, type: 'dashed' } },
          axisLine: { show: false },
        }
      : {
          type: 'category',
          data: names,
          axisLabel: { color: T.muted, fontSize: 10, rotate: data.length > 7 ? 25 : 0, interval: 0 },
          axisTick: { show: false },
          axisLine: { lineStyle: { color: T.border } },
        },
    yAxis: horizontal
      ? {
          type: 'category',
          data: names,
          axisLabel: { color: T.text, fontSize: 11 },
          axisTick: { show: false },
          axisLine: { show: false },
        }
      : {
          type: 'value',
          axisLabel: { color: T.muted, fontSize: 10 },
          splitLine: { lineStyle: { color: T.border, type: 'dashed' } },
          axisLine: { show: false },
        },
    series: [
      {
        type: 'bar',
        data: values,
        itemStyle: {
          borderRadius: horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0],
          color: {
            type: 'linear',
            x: horizontal ? 0 : 0,
            y: horizontal ? 0 : 0,
            x2: horizontal ? 1 : 0,
            y2: horizontal ? 0 : 1,
            colorStops: [
              { offset: 0, color },
              { offset: 1, color: endColor },
            ],
          },
        },
        barMaxWidth: 36,
        label: showLabel
          ? {
              show: true,
              position: horizontal ? 'right' : 'top',
              color: T.muted,
              fontSize: 10,
              formatter: labelFormatter || '{c}',
            }
          : { show: false },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} />;
}
