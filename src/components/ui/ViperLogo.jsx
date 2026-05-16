/**
 * src/components/ui/ViperLogo.jsx
 * Uses the real viper PNG logo uploaded by the user.
 */

export function ViperIcon({ size = 40, className = '' }) {
  return (
    <img
      src="/viper-logo.png"
      alt="Viper VCF"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  )
}

export function LogoMark({ onClick, style = {} }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: onClick ? 'pointer' : 'default',
        textDecoration: 'none', userSelect: 'none',
        ...style,
      }}
    >
      <img
        src="/viper-logo.png"
        alt="Viper"
        style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 8 }}
      />
      <span style={{
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        fontSize: 18,
        color: '#fff',
        letterSpacing: '-0.3px',
      }}>
        Viper <span style={{ color: '#a855f7' }}>VCF</span>
      </span>
    </div>
  )
}
