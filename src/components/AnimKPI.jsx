import React, { useEffect, useRef, useState } from 'react';
import { T } from '../lib';

function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const numTarget = parseFloat(String(target).replace(/[^0-9.-]/g, '')) || 0;

  useEffect(() => {
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(numTarget * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [numTarget, duration]);

  return count;
}

export default function AnimKPI({ label, value, prefix = '', suffix = '', subValue, color = T.primary, decimals = 0, trend, icon }) {
  const numVal = parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
  const animated = useCounter(numVal);
  const display = Number.isInteger(numVal)
    ? Math.round(animated).toLocaleString()
    : animated.toFixed(decimals);

  return (
    <div style={{
      background: T.bg,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: '1.25rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* top gradient accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
      }} />
      {icon && <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{icon}</div>}
      <div style={{
        color: T.muted, fontSize: '0.62rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        color: T.text, fontSize: '1.8rem', fontWeight: 900,
        lineHeight: 1, fontVariantNumeric: 'tabular-nums',
      }}>
        {prefix}{display}{suffix}
      </div>
      {subValue && (
        <div style={{ color, fontSize: '0.7rem', fontWeight: 600, marginTop: 6 }}>{subValue}</div>
      )}
      {trend !== undefined && (
        <div style={{
          color: trend >= 0 ? T.success : T.danger,
          fontSize: '0.7rem', fontWeight: 700, marginTop: 4,
        }}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
