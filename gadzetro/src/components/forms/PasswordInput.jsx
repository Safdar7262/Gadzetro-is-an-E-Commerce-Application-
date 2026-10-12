import { forwardRef, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import Input from '../common/Input.jsx'

const PasswordInput = forwardRef(function PasswordInput({ label, error, hint, ...rest }, ref) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="password-field">
      <Input ref={ref} label={label} error={error} hint={hint} type={visible ? 'text' : 'password'} {...rest} />
      <button type="button" className="pw-toggle" onClick={() => setVisible((v) => !v)} aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible}>
        {visible ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  )
})

export default PasswordInput
