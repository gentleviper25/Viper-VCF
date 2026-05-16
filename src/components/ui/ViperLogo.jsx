/**
 * src/components/ui/ViperLogo.jsx
 * Purple cobra viper logo matching the brand images.
 */
export function ViperIcon({ size = 38 }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="20" fill="#0d0520"/>
      <rect width="100" height="100" rx="20" fill="url(#vg)"/>

      {/* Simplified cobra head facing forward */}
      {/* Hood left */}
      <path d="M20 38 Q14 50 18 62 Q26 54 32 50 Q28 46 26 40Z" fill="#7c3aed" opacity="0.9"/>
      {/* Hood right */}
      <path d="M80 38 Q86 50 82 62 Q74 54 68 50 Q72 46 74 40Z" fill="#7c3aed" opacity="0.9"/>
      {/* Main head top */}
      <path d="M32 22 Q50 14 68 22 Q74 34 72 44 Q60 40 50 40 Q40 40 28 44 Q26 34 32 22Z" fill="#8b5cf6"/>
      {/* Head center */}
      <ellipse cx="50" cy="44" rx="22" ry="12" fill="#7c3aed"/>
      {/* Scales detail */}
      <path d="M35 26 Q42 24 50 24 Q58 24 65 26" stroke="#a855f7" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M32 32 Q41 29 50 29 Q59 29 68 32" stroke="#a855f7" strokeWidth="1.5" fill="none" opacity="0.7"/>
      {/* Eyes */}
      <ellipse cx="38" cy="38" rx="5" ry="5" fill="#1a0040"/>
      <ellipse cx="62" cy="38" rx="5" ry="5" fill="#1a0040"/>
      <ellipse cx="38" cy="38" rx="3" ry="3" fill="#d946ef"/>
      <ellipse cx="62" cy="38" rx="3" ry="3" fill="#d946ef"/>
      {/* Eye glow */}
      <ellipse cx="38" cy="38" rx="3" ry="3" fill="#e879f9" opacity="0.6" filter="url(#glow)"/>
      <ellipse cx="62" cy="38" rx="3" ry="3" fill="#e879f9" opacity="0.6" filter="url(#glow)"/>
      {/* Snout */}
      <ellipse cx="50" cy="50" rx="8" ry="5" fill="#6d28d9"/>
      {/* Nostrils */}
      <ellipse cx="46" cy="50" rx="1.5" ry="2" fill="#1a0040"/>
      <ellipse cx="54" cy="50" rx="1.5" ry="2" fill="#1a0040"/>
      {/* Open mouth */}
      <path d="M36 58 Q50 55 64 58 Q57 70 50 72 Q43 70 36 58Z" fill="#0d0215"/>
      <path d="M36 58 Q50 55 64 58" stroke="#a855f7" strokeWidth="1.5" fill="none"/>
      {/* Fangs */}
      <path d="M42 58 L40 68 L44 58Z" fill="#e2e8f0" opacity="0.9"/>
      <path d="M58 58 L60 68 L56 58Z" fill="#e2e8f0" opacity="0.9"/>
      {/* Tongue */}
      <path d="M48 72 Q50 78 48 84" stroke="#ec4899" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M52 72 Q50 78 52 84" stroke="#ec4899" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      <defs>
        <linearGradient id="vg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#4c1d95"/>
          <stop offset="100%" stopColor="#1e0338"/>
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
    </svg>
  )
}

export function LogoMark({ onClick }) {
  return (
    <div className="logo-mark" onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key==='Enter' && onClick?.()}>
      <div className="logo-icon">
        <ViperIcon size={38} />
      </div>
      <span className="logo-text">
        Viper <span>VCF</span>
      </span>
    </div>
  )
}
