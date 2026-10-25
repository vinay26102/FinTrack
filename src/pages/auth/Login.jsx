import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from 'react-icons/fi'

import fintrackLogo from '../../assets/fintrack-logo.png'
import fintrackBackground from '../../assets/fintrack-background.png'

import { useToast } from '../../components/ToastContext'

function Login() {
  const navigate = useNavigate()

  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    let valid = true

    // Email validation
    if (!email.trim()) {
      setEmailError('Please enter your email.')
      valid = false
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setEmailError('Please enter a valid email.')
      valid = false
    } else {
      setEmailError('')
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError('Please enter your password.')
      valid = false
    } else {
      setPasswordError('')
    }

    if (!valid) return

    // Get registered user from localStorage
    const storedUser = JSON.parse(
      localStorage.getItem('fintrackUser')
    )

    // No registered account
    if (!storedUser) {
      setEmailError(
        'No account found. Please create an account.'
      )
      return
    }

    // Check email
    if (email.trim() !== storedUser.email) {
      setEmailError('Email is not registered.')
      return
    }

    // Check password
    if (password !== storedUser.password) {
      setPasswordError('Incorrect password.')
      return
    }

    // Login successful
    localStorage.setItem(
      'fintrackLoggedIn',
      'true'
    )

    showToast(
      'Login successful!',
      'success'
    )

    navigate('/dashboard')
  }

  return (
    <div
      className="login-page"
      style={{
        '--login-background': `url(${fintrackBackground})`,
      }}
    >

      <div className="login-card">

        <div className="login-header">

          <div className="brand-icon">
            <img
              src={fintrackLogo}
              alt="FinTrack Logo"
            />
          </div>

          <h1>
            <span className="brand-fin">
              FIN
            </span>

            <span className="brand-track">
              TRACK
            </span>
          </h1>

          <p>
            Smart money management, made simple.
          </p>

        </div>


        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <div
              className={`input-wrapper ${
                emailError
                  ? 'input-error'
                  : ''
              }`}
            >

              <FiMail className="input-icon" />

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
              />

            </div>

            {emailError && (
              <p className="field-error">
                <FiAlertCircle />
                {emailError}
              </p>
            )}

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <div
              className={`input-wrapper ${
                passwordError
                  ? 'input-error'
                  : ''
              }`}
            >

              <FiLock className="input-icon" />

              <input
                id="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError('')
                }}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>

            </div>

            {passwordError && (
              <p className="field-error">
                <FiAlertCircle />
                {passwordError}
              </p>
            )}

          </div>


          {/* OPTIONS */}

          <div className="login-options">

            <label className="remember-me">

              <input type="checkbox" />

              Remember me

            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot Password?
            </button>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>


        {/* REGISTER */}

        <p className="register-text">

          Don't have an account?

          <Link
            to="/register"
            className="register-link"
          >
            Create Account
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Login