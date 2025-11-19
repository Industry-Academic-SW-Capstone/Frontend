"use client";
import React from "react";

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
    }).join(" ");
    return (
      <polygon
        key={i}
        points={points}
        className="stroke-border-color fill-none"
        strokeWidth="0.5"
      />
    );
  });

  // Axes lines
  const axes = data.map((_, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return (
      <line
        key={i}
        x1={center}
        y1={center}
        x2={x}
        y2={y}
        className="stroke-border-color"
        strokeWidth="0.5"
      />
    );
  });

  // Labels
  const labels = data.map((item, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const labelRadius = radius * 1.25;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return (
      <text
        key={i}
        x={x}
        y={y}
        className="text-[10px] fill-text-secondary font-medium"
        textAnchor={x < center ? "end" : x > center ? "start" : "middle"}
        dominantBaseline="middle"
      >
        {item.label}
      </text>
    );
  });

  // Data polygon
  const dataPoints = data
    .map((item, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const pointRadius = radius * (item.value / 100);
      const x = center + pointRadius * Math.cos(angle);
      const y = center + pointRadius * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex justify-center items-center relative">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
        className="overflow-visible"
      >
        <defs>
          <radialGradient
            id="radarGradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.4" />
            <stop
              offset="100%"
              stopColor="var(--secondary)"
              stopOpacity="0.1"
            />
          </radialGradient>
        </defs>
        {gridLevels}
        {axes}
        {labels}
        <polygon
          points={dataPoints}
          className="stroke-secondary fill-[url(#radarGradient)] animate-scaleIn origin-center"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Data Points */}
        {data.map((item, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const pointRadius = radius * (item.value / 100);
          const x = center + pointRadius * Math.cos(angle);
          const y = center + pointRadius * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              className="fill-secondary stroke-bg-primary stroke-2 animate-scaleIn delay-300"
              style={{ transformOrigin: "center" }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
