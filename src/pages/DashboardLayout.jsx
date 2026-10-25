import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  FiHome,
  FiCreditCard,
  FiPlusCircle,
  FiBarChart2,
  FiTag,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi'

import { useToast } from '../components/ToastContext'

function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const { showToast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem(
      'fintrackLoggedIn'
    )

    showToast(
      'Logged out successfully!',
      'success'
    )

    navigate('/')
  }

  return (
    <div className="dashboard-page">

      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">

          <span className="brand-fin">
            FIN
          </span>

          <span className="brand-track">
            TRACK
          </span>

        </div>

        <nav className="sidebar-nav">

          {/* DASHBOARD */}

          <button
            type="button"
            className={`sidebar-link ${
              location.pathname ===
              '/dashboard'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              navigate('/dashboard')
            }
          >
            <FiHome />

            <span>
              Dashboard
            </span>

          </button>


          {/* TRANSACTIONS */}

          <button
            type="button"
            className={`sidebar-link ${
              location.pathname ===
              '/transactions'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              navigate('/transactions')
            }
          >
            <FiCreditCard />

            <span>
              Transactions
            </span>

          </button>


          {/* ADD TRANSACTION */}

          <button
            type="button"
            className={`sidebar-link ${
              location.pathname ===
              '/add-transaction'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              navigate(
                '/add-transaction'
              )
            }
          >
            <FiPlusCircle />

            <span>
              Add Transaction
            </span>

          </button>


          {/* ANALYTICS */}

          <button
            type="button"
            className={`sidebar-link ${
              location.pathname ===
              '/analytics'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              navigate('/analytics')
            }
          >
            <FiBarChart2 />

            <span>
              Analytics
            </span>

          </button>


          {/* CATEGORIES */}

          <button
            type="button"
            className={`sidebar-link ${
              location.pathname ===
              '/categories'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              navigate('/categories')
            }
          >
            <FiTag />

            <span>
              Categories
            </span>

          </button>

        </nav>


        {/* BOTTOM */}

        <div className="sidebar-bottom">

          {/* SETTINGS */}

          <button
            type="button"
            className={`sidebar-link ${
              location.pathname ===
              '/settings'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              navigate('/settings')
            }
          >
            <FiSettings />

            <span>
              Settings
            </span>

          </button>


          {/* LOGOUT */}

          <button
            type="button"
            className="sidebar-link logout-link"
            onClick={handleLogout}
          >
            <FiLogOut />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      <main className="dashboard-main">

        <Outlet />

      </main>

    </div>
  )
}

export default DashboardLayout