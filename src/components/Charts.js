'use client';

import { useEffect, useRef, useState } from 'react';

// Lightweight canvas-based chart components

export function BarChart({ data, labels, colors, height = 200, animate = true }) {
  const canvasRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const maxVal = Math.max(...data) * 1.15;
    const barWidth = (chartW / data.length) * 0.6;
    const barGap = (chartW / data.length) * 0.4;

    const style = getComputedStyle(document.documentElement);
    const textColor = style.getPropertyValue('--text-tertiary').trim();
    const borderColor = style.getPropertyValue('--border-subtle').trim();

    const drawFrame = (progress) => {
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        // Y labels
        ctx.fillStyle = textColor;
        ctx.font = '11px DM Sans';
        ctx.textAlign = 'right';
        const val = Math.round(maxVal - (maxVal / 4) * i);
        ctx.fillText(val, padding.left - 8, y + 4);
      }

      // Bars
      data.forEach((val, i) => {
        const x = padding.left + i * (barWidth + barGap) + barGap / 2;
        const barH = (val / maxVal) * chartH * progress;
        const y = padding.top + chartH - barH;

        // Create gradient
        const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
        const color = colors?.[i] || '#6C5CE7';
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '40');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        const radius = 4;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, padding.top + chartH);
        ctx.lineTo(x, padding.top + chartH);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();

        // X labels
        ctx.fillStyle = textColor;
        ctx.font = '11px DM Sans';
        ctx.textAlign = 'center';
        ctx.fillText(labels?.[i] || '', x + barWidth / 2, h - padding.bottom + 20);
      });
    };

    if (animate && !animated) {
      let start = null;
      const animDuration = 1000;
      const animateChart = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / animDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        drawFrame(eased);
        if (progress < 1) requestAnimationFrame(animateChart);
        else setAnimated(true);
      };

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(animateChart);
          observer.disconnect();
        }
      }, { threshold: 0.3 });

      observer.observe(canvas);
      return () => observer.disconnect();
    } else {
      drawFrame(1);
    }
  }, [data, labels, colors, animate, animated]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: `${height}px` }} />;
}

export function LineChart({ datasets, labels, height = 200, animate = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const allValues = datasets.flatMap(d => d.data);
    const maxVal = Math.max(...allValues) * 1.1;
    const minVal = Math.min(...allValues) * 0.9;
    const range = maxVal - minVal;

    const style = getComputedStyle(document.documentElement);
    const textColor = style.getPropertyValue('--text-tertiary').trim();
    const borderColor = style.getPropertyValue('--border-subtle').trim();

    const drawFrame = (progress) => {
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.font = '11px DM Sans';
        ctx.textAlign = 'right';
        const val = Math.round(maxVal - (range / 4) * i);
        ctx.fillText(val, padding.left - 8, y + 4);
      }

      // X labels
      if (labels) {
        const step = Math.ceil(labels.length / 7);
        labels.forEach((label, i) => {
          if (i % step === 0) {
            const x = padding.left + (i / (labels.length - 1)) * chartW;
            ctx.fillStyle = textColor;
            ctx.font = '11px DM Sans';
            ctx.textAlign = 'center';
            ctx.fillText(label, x, h - padding.bottom + 20);
          }
        });
      }

      // Lines
      datasets.forEach(dataset => {
        const points = dataset.data.map((val, i) => ({
          x: padding.left + (i / (dataset.data.length - 1)) * chartW,
          y: padding.top + ((maxVal - val) / range) * chartH,
        }));

        // Area fill
        if (dataset.fill) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, padding.top + chartH);
          points.forEach((p, i) => {
            const targetY = p.y;
            const y = padding.top + chartH + (targetY - (padding.top + chartH)) * progress;
            if (i === 0) ctx.lineTo(p.x, y);
            else {
              const prev = points[i - 1];
              const prevY = padding.top + chartH + (prev.y - (padding.top + chartH)) * progress;
              const cpx = (prev.x + p.x) / 2;
              ctx.bezierCurveTo(cpx, prevY, cpx, y, p.x, y);
            }
          });
          ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
          ctx.closePath();
          const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
          gradient.addColorStop(0, (dataset.color || '#6C5CE7') + '30');
          gradient.addColorStop(1, (dataset.color || '#6C5CE7') + '05');
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Line
        ctx.beginPath();
        ctx.strokeStyle = dataset.color || '#6C5CE7';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        points.forEach((p, i) => {
          const targetY = p.y;
          const y = padding.top + chartH + (targetY - (padding.top + chartH)) * progress;
          if (i === 0) ctx.moveTo(p.x, y);
          else {
            const prev = points[i - 1];
            const prevY = padding.top + chartH + (prev.y - (padding.top + chartH)) * progress;
            const cpx = (prev.x + p.x) / 2;
            ctx.bezierCurveTo(cpx, prevY, cpx, y, p.x, y);
          }
        });
        ctx.stroke();

        // Dots
        if (progress >= 0.9) {
          points.forEach(p => {
            const targetY = p.y;
            const y = padding.top + chartH + (targetY - (padding.top + chartH)) * progress;
            ctx.beginPath();
            ctx.arc(p.x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = dataset.color || '#6C5CE7';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          });
        }
      });
    };

    let start = null;
    const animDuration = 1200;
    const animateChart = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / animDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      drawFrame(eased);
      if (progress < 1) requestAnimationFrame(animateChart);
    };

    if (animate) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(animateChart);
          observer.disconnect();
        }
      }, { threshold: 0.3 });
      observer.observe(canvas);
      return () => observer.disconnect();
    } else {
      drawFrame(1);
    }
  }, [datasets, labels, animate, height]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: `${height}px` }} />;
}

export function DonutChart({ data, labels, colors, size = 180, thickness = 30, animate = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = (size - thickness) / 2 - 4;
    const total = data.reduce((a, b) => a + b, 0);

    const drawFrame = (progress) => {
      ctx.clearRect(0, 0, size, size);

      let startAngle = -Math.PI / 2;
      data.forEach((val, i) => {
        const sweep = (val / total) * Math.PI * 2 * progress;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, startAngle + sweep);
        ctx.strokeStyle = colors?.[i] || '#6C5CE7';
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
        startAngle += sweep + 0.02;
      });

      // Center text
      const style = getComputedStyle(document.documentElement);
      ctx.fillStyle = style.getPropertyValue('--text-primary').trim();
      ctx.font = `700 ${size / 5}px Outfit`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round(total * progress), cx, cy - 4);

      ctx.fillStyle = style.getPropertyValue('--text-tertiary').trim();
      ctx.font = `500 ${size / 14}px DM Sans`;
      ctx.fillText('Total', cx, cy + size / 7);
    };

    let start = null;
    const animDuration = 1000;
    const animateChart = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / animDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      drawFrame(eased);
      if (progress < 1) requestAnimationFrame(animateChart);
    };

    if (animate) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(animateChart);
          observer.disconnect();
        }
      }, { threshold: 0.3 });
      observer.observe(canvas);
      return () => observer.disconnect();
    } else {
      drawFrame(1);
    }
  }, [data, labels, colors, size, thickness, animate]);

  return <canvas ref={canvasRef} style={{ width: `${size}px`, height: `${size}px` }} />;
}

export function GaugeChart({ value, max = 100, label, color, size = 140 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = (size * 0.7) * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size * 0.6;
    const radius = size / 2 - 12;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;
    const progress = value / max;

    const style = getComputedStyle(document.documentElement);
    const bgColor = style.getPropertyValue('--bg-tertiary').trim();

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = bgColor;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Value arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + Math.PI * progress);
    ctx.strokeStyle = color || '#6C5CE7';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Value text
    ctx.fillStyle = style.getPropertyValue('--text-primary').trim();
    ctx.font = `700 ${size / 5}px Outfit`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value}%`, cx, cy - 4);

    if (label) {
      ctx.fillStyle = style.getPropertyValue('--text-tertiary').trim();
      ctx.font = `500 ${size / 12}px DM Sans`;
      ctx.fillText(label, cx, cy + size / 6);
    }
  }, [value, max, label, color, size]);

  return <canvas ref={canvasRef} style={{ width: `${size}px`, height: `${size * 0.7}px` }} />;
}
