/**
 * src/components/ui/Button.jsx
 */
import Spinner from './Spinner'

export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  loading = false,
  className = '',
  ...props
}) {
  const variantClass = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
    danger:    'btn-danger',
  }[variant] || 'btn-primary'

  const sizeClass = size === 'sm' ? 'btn-sm' : ''

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  )
}


/**
 * src/components/ui/Spinner.jsx  (inlined for single-file convenience)
 */
export function Spinner({ size = 18, color = 'currentColor' }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
    >
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" opacity="0.2" />
      <path d="M12 2a10 10 0 010 20" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
