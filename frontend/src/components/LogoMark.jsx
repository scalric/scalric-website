import React from 'react';

/**
 * Animated Scalric arrow mark: a chevron that pushes forward through a run of speed streaks.
 * Motion is pure CSS (see theme.css, "Logo mark") and stops under prefers-reduced-motion.
 * The gradient id is per instance so several marks can sit on one page.
 */
export default function LogoMark({ className = '' }) {
  const id = `lm-grad-${React.useId().replace(/:/g, '')}`;
  return <svg className={`logo-mark ${className}`} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="4" y1="0" x2="44" y2="0">
        <stop offset="0" stopColor="#1155d9"/>
        <stop offset="0.55" stopColor="#1155d9"/>
        <stop offset="1" stopColor="#1155d9"/>
      </linearGradient>
    </defs>
    <path className="lm-streak lm-s1" d="M4 19H16" stroke={`url(#${id})`}/>
    <path className="lm-streak lm-s2" d="M9 27H18" stroke={`url(#${id})`}/>
    <path className="lm-streak lm-s3" d="M14 34H20" stroke={`url(#${id})`}/>
    <circle className="lm-dot" cx="7" cy="34" r="1.9" fill={`url(#${id})`}/>
    <path className="lm-chev" d="M21 11L35 24L21 37" stroke={`url(#${id})`}/>
    <path className="lm-chev lm-chev-b" d="M38 18L43 24L38 30" stroke={`url(#${id})`}/>
  </svg>;
}
