import {
  useEffect,
  useState,
} from 'react'
import { useToast } from '../components/ToastContext'
import {
  FiUser,
  FiBell,
  FiShield,
  FiDatabase,
  FiMoon,
  FiChevronRight,
  FiCheck,
} from 'react-icons/fi'

function Settings() {
  const [showProfile, setShowProfile] =
    useState(false)
const { showToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [saved, setSaved] =
    useState(false)

  const [notifications, setNotifications] =
    useState(() => {
      return (
        localStorage.getItem(
          'fintrackNotifications'
        ) !== 'false'
      )
    })

  useEffect(() => {
    const savedName =
      localStorage.getItem(
        'fintrackUserName'
      ) || ''

    const savedEmail =
      localStorage.getItem(
        'fintrackUserEmail'
      ) || ''

    setName(savedName)
    setEmail(savedEmail)
  }, [])

  const handleSaveProfile = () => {
    localStorage.setItem(
      'fintrackUserName',
      name.trim()
    )

    localStorage.setItem(
      'fintrackUserEmail',
      email.trim()
    )

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2000)
  }

  const handleNotificationToggle = () => {
    const newValue = !notifications

    setNotifications(newValue)

    localStorage.setItem(
      'fintrackNotifications',
      String(newValue)
    )
  }

  return (
    <div className="settings-page">

      <div className="settings-header">
        <div>
          <h1>Settings</h1>

          <p>
            Manage your account and application
            preferences.
          </p>
        </div>
      </div>


      {/* ACCOUNT */}

      <section className="settings-section">

        <div className="settings-section-header">
          <div>
            <h2>Account</h2>

            <p>
              Manage your personal account
              information.
            </p>
          </div>
        </div>

        <div className="settings-card">

          <div
            className="settings-item"
            onClick={() =>
              setShowProfile(
                !showProfile
              )
            }
          >

            <div className="settings-item-icon profile">
              <FiUser />
            </div>

            <div className="settings-item-content">
              <strong>
                Profile
              </strong>

              <span>
                Update your name and account
                details.
              </span>
            </div>

            <FiChevronRight
              className={`settings-arrow ${
                showProfile
                  ? 'rotate'
                  : ''
              }`}
            />

          </div>


          {showProfile && (
            <div className="settings-profile-form">

              <div className="settings-form-group">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Enter your name"
                />

              </div>


              <div className="settings-form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="Enter your email"
                />

              </div>


              <button
                type="button"
                className="settings-save-button"
                onClick={
                  handleSaveProfile
                }
              >
                {saved ? (
                  <>
                    <FiCheck />
                    Saved
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>

            </div>
          )}

        </div>

      </section>


      {/* PREFERENCES */}

      <section className="settings-section">

        <div className="settings-section-header">
          <div>
            <h2>Preferences</h2>

            <p>
              Customize how FinTrack works
              for you.
            </p>
          </div>
        </div>

        <div className="settings-card">

          {/* NOTIFICATIONS */}

          <div
            className="settings-item"
            onClick={
              handleNotificationToggle
            }
          >

            <div className="settings-item-icon notification">
              <FiBell />
            </div>

            <div className="settings-item-content">
              <strong>
                Notifications
              </strong>

              <span>
                Manage your notification
                preferences.
              </span>
            </div>

            <div
              className={`settings-toggle ${
                notifications
                  ? 'active'
                  : ''
              }`}
            >
              <div className="settings-toggle-circle" />
            </div>

          </div>


          <div className="settings-divider" />


          {/* APPEARANCE */}

          <div
            className="settings-item"
            onClick={() =>
             showToast(
  'Appearance settings will be available in the next version.',
  'info'
)
            }
          >

            <div className="settings-item-icon appearance">
              <FiMoon />
            </div>

            <div className="settings-item-content">
              <strong>
                Appearance
              </strong>

              <span>
                Choose your preferred
                application theme.
              </span>
            </div>

            <FiChevronRight className="settings-arrow" />

          </div>

        </div>

      </section>


      {/* DATA & SECURITY */}

      <section className="settings-section">

        <div className="settings-section-header">
          <div>
            <h2>Data & Security</h2>

            <p>
              Manage your financial data
              and account security.
            </p>
          </div>
        </div>

        <div className="settings-card">

          {/* SECURITY */}

          <div
            className="settings-item"
            onClick={() =>
              showToast(
  'Security settings will be available in the next version.',
  'info'
)
            }
          >

            <div className="settings-item-icon security">
              <FiShield />
            </div>

            <div className="settings-item-content">
              <strong>
                Security
              </strong>

              <span>
                Manage your account security
                settings.
              </span>
            </div>

            <FiChevronRight className="settings-arrow" />

          </div>


          <div className="settings-divider" />


          {/* DATA MANAGEMENT */}

          <div
            className="settings-item"
            onClick={() =>
              showToast(
  'Data management will be available in the next version.',
  'info'
)
            }
          >

            <div className="settings-item-icon data">
              <FiDatabase />
            </div>

            <div className="settings-item-content">
              <strong>
                Data Management
              </strong>

              <span>
                Manage your stored financial
                data.
              </span>
            </div>

            <FiChevronRight className="settings-arrow" />

          </div>

        </div>

      </section>

    </div>
  )
}

export default Settings