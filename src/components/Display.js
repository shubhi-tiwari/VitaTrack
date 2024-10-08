import React from 'react';
import '../styles/Display.css';
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState } from '@mui/x-charts/Gauge';

const Display = ({ label, value, isDarkMode }) => {
  const containerClassName = `display ${isDarkMode ? 'dark' : 'light'}`;

  const GaugePointer = () => {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();

    if (valueAngle === null) {
      // No value to display
      return null;
    }

    const target = {
      x: cx + outerRadius * Math.sin(valueAngle),
      y: cy - outerRadius * Math.cos(valueAngle),
    };
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill="red" />
        <path
          d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
          stroke="red"
          strokeWidth={3}
        />
      </g>
    );
  };

  return (
    <div className={containerClassName}>
      <h2>{label}</h2>
      <p>{value}</p>
      <div className="gauge-container">
        <GaugeContainer
          width={200}
          height={200}
          startAngle={-110}
          endAngle={110}
          value={parseFloat(value)} // Assuming value is a number
        >
          <GaugeReferenceArc />
          <GaugeValueArc />
          <GaugePointer />
        </GaugeContainer>
      </div>
    </div>
  );
};

export default Display;
