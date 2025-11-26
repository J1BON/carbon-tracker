import React from "react";

interface SVGIconProps {
  name: string;
  className?: string;
  animate?: "float" | "pulse" | "spin" | "glow";
}

const SVG_ICONS: Record<string, React.ReactNode> = {
  carbonFootprint: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="url(#carbonGradient)" opacity="0.2"/>
      <path d="M 50 10 L 50 50 L 20 50" stroke="#16A34A" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="8" fill="#16A34A"/>
      <path d="M 50 50 L 50 90 L 80 90" stroke="#06B6D4" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="4" fill="#06B6D4"/>
      <defs>
        <linearGradient id="carbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#16A34A"/>
          <stop offset="100%" stopColor="#06B6D4"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  wasteBin: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="25" width="40" height="60" rx="3" fill="url(#wasteGradient)" stroke="#16A34A" strokeWidth="2"/>
      <path d="M 25 25 Q 50 15, 75 25" stroke="#F59E0B" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M 30 35 L 70 35" stroke="#16A34A" strokeWidth="3" strokeLinecap="round"/>
      <path d="M 30 45 L 70 45" stroke="#16A34A" strokeWidth="3" strokeLinecap="round"/>
      <path d="M 30 55 L 70 55" stroke="#16A34A" strokeWidth="3" strokeLinecap="round"/>
      <defs>
        <linearGradient id="wasteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B"/>
          <stop offset="100%" stopColor="#16A34A"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 30 50 Q 50 30, 70 50 Q 50 70, 30 50" fill="url(#leafGradient)" stroke="#16A34A" strokeWidth="2"/>
      <path d="M 50 20 L 50 80" stroke="#16A34A" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="50" cy="20" r="3" fill="#F59E0B"/>
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E"/>
          <stop offset="100%" stopColor="#16A34A"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  recycle: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 25 50 L 50 25 L 75 50 L 50 75 Z" fill="none" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round"/>
      <path d="M 50 25 L 50 50" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="4" fill="#06B6D4"/>
      <path d="M 30 30 Q 50 35, 35 50" stroke="#F59E0B" strokeWidth="3" fill="none"/>
      <path d="M 70 70 Q 50 65, 65 50" stroke="#16A34A" strokeWidth="3" fill="none"/>
    </svg>
  ),
  earth: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="url(#earthGradient)"/>
      <path d="M 10 50 Q 35 40, 50 30 Q 65 40, 90 50" stroke="#06B6D4" strokeWidth="2" fill="none" opacity="0.6"/>
      <path d="M 10 50 Q 35 60, 50 70 Q 65 60, 90 50" stroke="#06B6D4" strokeWidth="2" fill="none" opacity="0.6"/>
      <defs>
        <linearGradient id="earthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4"/>
          <stop offset="100%" stopColor="#16A34A"/>
        </linearGradient>
      </defs>
    </svg>
  ),
};

const animationClasses = {
  float: "animate-float",
  pulse: "animate-pulse",
  spin: "animate-spin",
  glow: "animate-glow",
};

export default function SVGIcon({ name, className = "", animate }: SVGIconProps) {
  const icon = SVG_ICONS[name];
  
  if (!icon) {
    return <span className="text-2xl">🎯</span>;
  }

  const animateClass = animate ? animationClasses[animate] : "";

  return (
    <div className={`inline-block ${animateClass} ${className}`}>
      {icon}
    </div>
  );
}

export { SVG_ICONS };

