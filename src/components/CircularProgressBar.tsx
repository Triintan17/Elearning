import React from 'react';

interface CircularProgressBarProps {
  value: number; // 0 to 100
  size?: number; // width & height in px, default 60
  strokeWidth?: number; // stroke width, default 6
  color?: string; // stroke color e.g. '#FF5A26', '#10B981', '#6366F1'
  trackColor?: string; // background track color e.g. '#F1F5F9'
  showValue?: boolean;
  valueSuffix?: string;
  sublabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  value,
  size = 64,
  strokeWidth = 6,
  color = '#FF5A26',
  trackColor = '#F1F5F9',
  showValue = true,
  valueSuffix = '%',
  sublabel,
  icon,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center shrink-0 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center transition-all duration-700 ease-out"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Progress Indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          {icon ? (
            icon
          ) : showValue ? (
            <span className="text-xs font-black tracking-tight text-slate-800 leading-none">
              {clampedValue}
              <span className="text-[9px] font-bold text-slate-400">{valueSuffix}</span>
            </span>
          ) : null}
        </div>
      </div>

      {sublabel && (
        <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider text-center">
          {sublabel}
        </span>
      )}
    </div>
  );
};
