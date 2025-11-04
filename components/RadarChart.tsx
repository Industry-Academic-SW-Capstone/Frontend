"use client";
import React from 'react';

interface RadarChartProps {
  data: { label: string; value: number }[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const size = 200;
  const center = size / 2;
  const radius = size * 0.4;
  const numLevels = 4;
  const numAxes = data.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  // Grid lines
  const gridLevels = Array.from({ length: numLevels }, (_, i) => {
    const levelRadius = radius * ((i + 1) / numLevels);
    const points = Array.from({ length: numAxes }, (_, j) => {
      const angle = angleSlice * j - Math.PI / 2;
      const x = center + levelRadius * Math.cos(angle);
      const y = center + levelRadius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    return <polygon key={i} points={points} className="stroke-border-color fill-none" strokeWidth="0.5" />;
  });

  // Axes lines
  const axes = data.map((_, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return <line key={i} x1={center} y1={center} x2={x} y2={y} className="stroke-border-color" strokeWidth="0.5" />;
  });

  // Labels
  const labels = data.map((item, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const labelRadius = radius * 1.2;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return (
      <text
        key={i}
        x={x}
        y={y}
        className="text-[10px] fill-current text-text-secondary font-semibold"
        textAnchor={x < center ? 'end' : x > center ? 'start' : 'middle'}
        dominantBaseline="middle"
      >
        {item.label}
      </text>
    );
  });

  // Data polygon
  const dataPoints = data.map((item, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const pointRadius = radius * (item.value / 100);
    const x = center + pointRadius * Math.cos(angle);
    const y = center + pointRadius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex justify-center items-center">
        <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
        {gridLevels}
        {axes}
        {labels}
        <polygon points={dataPoints} className="stroke-primary" strokeWidth="1.5" />
        </svg>
    </div>
  );
};

export default RadarChart;
