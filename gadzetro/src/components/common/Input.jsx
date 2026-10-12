import { forwardRef, useId } from 'react'

// forwardRef so it works with React Hook Form's register() later.
const Input = forwardRef(function Input({ label, error, hint, id, className = '', ...rest }, ref) {
  const autoId = useId()
  const inputId = id || autoId
  const messageId = `${inputId}-message`
  return (
    <div className={`ui-field ${error ? 'has-error' : ''} ${className}`.trim()}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} ref={ref} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? messageId : undefined} {...rest} />
      {error ? <p className="ui-field-error" id={messageId} role="alert">{error}</p> : hint && <p className="ui-field-hint" id={messageId}>{hint}</p>}
    </div>
  )
})

export default Input
