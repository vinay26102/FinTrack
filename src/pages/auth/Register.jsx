import { useEffect, useState } from 'react'
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from 'react-icons/fi'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import fintrackLogo from '../../assets/fintrack-logo.png'
import fintrackBackground from '../../assets/fintrack-background.png'

import { useToast } from '../../components/ToastContext'

function Register() {
  useEffect(() => {
  document.title = 'FinTrack | Register'
}, [])
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [fullNameError, setFullNameError] =
    useState('')
  const [emailError, setEmailError] =
    useState('')
  const [passwordError, setPasswordError] =
    useState('')
  const [
    confirmPasswordError,
    setConfirmPasswordError,
  ] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    let valid = true

    // Full Name validation
    if (!fullName.trim()) {
      setFullNameError(
        'Please enter your full name.'
      )
      valid = false
    } else {
      setFullNameError('')
    }

    // Email validation
    if (!email.trim()) {
      setEmailError(
        'Please enter your email.'
      )
      valid = false
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setEmailError(
        'Please enter a valid email.'
      )
      valid = false
    } else {
      setEmailError('')
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError(
        'Please enter your password.'
      )
      valid = false
    } else if (password.length < 6) {
      setPasswordError(
        'Password must be at least 6 characters.'
      )
      valid = false
    } else {
      setPasswordError('')
    }

    // Confirm Password validation
    if (!confirmPassword.trim()) {
      setConfirmPasswordError(
        'Please confirm your password.'
      )
      valid = false
    } else if (
      confirmPassword !== password
    ) {
      setConfirmPasswordError(
        'Passwords do not match.'
      )
      valid = false
    } else {
      setConfirmPasswordError('')
    }

    if (!valid) return

    // Create user object
    const user = {
      fullName,
      email,
      password,
    }

    // Save registered user
    localStorage.setItem(
      'fintrackUser',
      JSON.stringify(user)
    )

    // Show success toast
    showToast(
      'Account created successfully!',
      'success'
    )

    // Redirect to Login page
    setTimeout(() => {
      navigate('/')
    }, 300)
  }

  return (
    <div
      className="login-page register-page"
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
            Create your account and start tracking.
          </p>

        </div>


        <form onSubmit={handleSubmit}>

          {/* FULL NAME */}

          <div className="form-group">

            <label htmlFor="fullName">
              Full Name
            </label>

            <div
              className={`input-wrapper ${
                fullNameError
                  ? 'input-error'
                  : ''
              }`}
            >
              <FiUser className="input-icon" />

              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => {
                  setFullName(
                    e.target.value
                  )
                  setFullNameError('')
                }}
              />
            </div>

            {fullNameError && (
              <p className="field-error">
                <FiAlertCircle />
                {fullNameError}
              </p>
            )}

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="registerEmail">
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
                id="registerEmail"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(
                    e.target.value
                  )
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

            <label htmlFor="registerPassword">
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
                id="registerPassword"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Create a password"
                value={password}
                onChange={(e) => {
                  setPassword(
                    e.target.value
                  )
                  setPasswordError('')
                }}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
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


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div
              className={`input-wrapper ${
                confirmPasswordError
                  ? 'input-error'
                  : ''
              }`}
            >
              <FiLock className="input-icon" />

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(
                    e.target.value
                  )
                  setConfirmPasswordError('')
                }}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showConfirmPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>
            </div>

            {confirmPasswordError && (
              <p className="field-error">
                <FiAlertCircle />
                {confirmPasswordError}
              </p>
            )}

          </div>


          {/* CREATE ACCOUNT */}

          <button
            type="submit"
            className="login-button"
          >
            Create Account
          </button>

        </form>


        {/* LOGIN LINK */}

        <p className="register-text">

          Already have an account?

          <Link
            to="/"
            className="register-link"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Register