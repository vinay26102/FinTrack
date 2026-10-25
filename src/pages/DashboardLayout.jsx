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
  FiMoreHorizontal,
} from 'react-icons/fi'

import { useState } from 'react'

import { useToast } from '../components/ToastContext'

function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false)

  const { showToast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem(
      'fintrackLoggedIn'
    )

    setIsMobileMenuOpen(false)

    showToast(
      'Logged out successfully!',
      'success'
    )

    navigate('/')
  }

  return (
    <div className="dashboard-page">

      {/* DESKTOP SIDEBAR */}

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


        {/* DESKTOP BOTTOM */}

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


      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        <Outlet />

      </main>


      {/* MOBILE BOTTOM NAVIGATION */}

      <nav className="mobile-bottom-nav">

        {/* HOME */}

        <button
          type="button"
          className={
            location.pathname ===
            '/dashboard'
              ? 'active'
              : ''
          }
          onClick={() => {
            setIsMobileMenuOpen(false)
            navigate('/dashboard')
          }}
        >
          <FiHome />

          <span>
            Home
          </span>
        </button>


        {/* TRANSACTIONS */}

        <button
          type="button"
          className={
            location.pathname ===
            '/transactions'
              ? 'active'
              : ''
          }
          onClick={() => {
            setIsMobileMenuOpen(false)
            navigate('/transactions')
          }}
        >
          <FiCreditCard />

          <span>
            Transactions
          </span>
        </button>


        {/* ADD */}

        <button
          type="button"
          className={
            location.pathname ===
            '/add-transaction'
              ? 'active'
              : ''
          }
          onClick={() => {
            setIsMobileMenuOpen(false)
            navigate(
              '/add-transaction'
            )
          }}
        >
          <FiPlusCircle />

          <span>
            Add
          </span>
        </button>


        {/* ANALYTICS */}

        <button
          type="button"
          className={
            location.pathname ===
            '/analytics'
              ? 'active'
              : ''
          }
          onClick={() => {
            setIsMobileMenuOpen(false)
            navigate('/analytics')
          }}
        >
          <FiBarChart2 />

          <span>
            Analytics
          </span>
        </button>


        {/* CATEGORIES */}

        <button
          type="button"
          className={
            location.pathname ===
            '/categories'
              ? 'active'
              : ''
          }
          onClick={() => {
            setIsMobileMenuOpen(false)
            navigate('/categories')
          }}
        >
          <FiTag />

          <span>
            Categories
          </span>
        </button>


        {/* MORE */}

        <button
          type="button"
          className={
            `mobile-more-button ${
              isMobileMenuOpen ||
              location.pathname ===
              '/settings'
                ? 'active'
                : ''
            }`
          }
          onClick={() =>
            setIsMobileMenuOpen(
              !isMobileMenuOpen
            )
          }
        >
          <FiMoreHorizontal />

          <span>
            More
          </span>
        </button>


        {/* MORE MENU */}

        {isMobileMenuOpen && (
          <div className="mobile-more-menu">

            {/* SETTINGS */}

            <button
              type="button"
              className={
                location.pathname ===
                '/settings'
                  ? 'active'
                  : ''
              }
              onClick={() => {
                setIsMobileMenuOpen(false)
                navigate('/settings')
              }}
            >
              <FiSettings />

              <span>
                Settings
              </span>
            </button>


            {/* LOGOUT */}

            <button
              type="button"
              className="mobile-more-logout"
              onClick={handleLogout}
            >
              <FiLogOut />

              <span>
                Logout
              </span>
            </button>

          </div>
        )}

      </nav>

    </div>
  )
}

export default DashboardLayout