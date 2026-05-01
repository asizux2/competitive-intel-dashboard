export { default as echarts } from './echarts-config';
export { DARK_THEME, BRAND_PALETTE } from './echarts-config';
export { T, VENDOR_TYPE_COLORS, BRAND_COLORS, SENTIMENT_COLORS, RATING_COLORS, MAP_TILE_URL, MAP_TILE_ATTRIBUTION, MAP_CENTER, MAP_DEFAULT_ZOOM } from './theme';

export function formatNumber(n) {
  if (n === undefined || n === null) return '0';
  if (typeof n !== 'number') return String(n);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export function formatPercent(n, decimals = 1) {
  if (n === undefined || n === null) return '0%';
  return `${Number(n).toFixed(decimals)}%`;
}

export function getTypeColor(type) {
  return VENDOR_TYPE_COLORS[type] || '#6B7280';
}

export function getNpsColor(nps) {
  if (nps >= 50) return '#22C55E';
  if (nps >= 20) return '#F59E0B';
  if (nps >= 0) return '#EF4444';
  return '#991B1B';
}

export function getRatingColor(rating) {
  if (rating >= 4.5) return '#22C55E';
  if (rating >= 4.0) return '#84CC16';
  if (rating >= 3.5) return '#F59E0B';
  if (rating >= 3.0) return '#F97316';
  if (rating >= 2.0) return '#EF4444';
  return '#991B1B';
}