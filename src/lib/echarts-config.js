import * as echarts from 'echarts/core';
import { BarChart, HeatmapChart, TreemapChart, RadarChart, ScatterChart, PieChart, LineChart } from 'echarts/charts';
import {
  GridComponent, TooltipComponent, LegendComponent, VisualMapComponent,
  VisualMapContinuousComponent, DataZoomComponent, ToolboxComponent,
  MarkLineComponent, MarkPointComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart, HeatmapChart, TreemapChart, RadarChart, ScatterChart, PieChart, LineChart,
  GridComponent, TooltipComponent, LegendComponent, VisualMapComponent,
  VisualMapContinuousComponent, DataZoomComponent, ToolboxComponent,
  MarkLineComponent, MarkPointComponent, CanvasRenderer
]);

export default echarts;

export const DARK_THEME = {
  backgroundColor: '#0A0A0A',
  textStyle: { color: '#F5F5F5', fontFamily: 'system-ui, -apple-system, sans-serif' },
  title: { textStyle: { color: '#F5F5F5' }, subtextStyle: { color: '#9CA3AF' } },
  categoryAxis: {
    axisLine: { lineStyle: { color: '#1E1E1E' } },
    axisTick: { lineStyle: { color: '#1E1E1E' } },
    axisLabel: { color: '#9CA3AF' },
    splitLine: { lineStyle: { color: '#1E1E1E' } },
  },
  valueAxis: {
    axisLine: { lineStyle: { color: '#1E1E1E' } },
    axisTick: { lineStyle: { color: '#1E1E1E' } },
    axisLabel: { color: '#9CA3AF' },
    splitLine: { lineStyle: { color: '#1E1E1E', type: 'dashed' } },
  },
  tooltip: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1E1E1E',
    textStyle: { color: '#F5F5F5' },
  },
  legend: { textStyle: { color: '#9CA3AF' } },
};

export const BRAND_PALETTE = ['#003087', '#22C55E', '#EF4444', '#A855F7', '#F59E0B', '#3B82F6', '#FF6B6B', '#4ECDC4', '#EF5F17', '#7C3AED', '#6B7280'];