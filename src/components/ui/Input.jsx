/**
 * src/components/ui/Input.jsx
 */
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Input({
  label,
  icon: Icon,
  type = 'text',
  error,
  className = '',
  ...props
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword ? (show ? 'text' : 'password') : type

  return (
    <div style={{ width: '100%' }}>
      {label && <label className="label">{label}</label>}
      <div className="input-wrap">
        {Icon && (
          <span className="input-icon">
            <Icon size={16} />
          </span>
        )}
        <input
          type={inputType}
          className={`input-field ${!Icon ? 'no-icon' : ''} ${isPassword ? 'has-right' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-icon-right"
            onClick={() => setShow(s => !s)}
            tabIndex={-1}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p style={{ color: '#f87171', fontSize: 12, marginTop: 5, fontFamily: 'Inter, sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  )
}
