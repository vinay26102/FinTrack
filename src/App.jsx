import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Analytics from './pages/Analytics'
import Categories from './pages/Categories'
import Settings from './pages/Settings'
import DashboardLayout from './pages/DashboardLayout'

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem(
      'fintrackLoggedIn'
    ) === 'true'

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return children
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* AUTH */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* PROTECTED DASHBOARD */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/transactions"
            element={<Transactions />}
          />

          <Route
            path="/add-transaction"
            element={<AddTransaction />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />
          <Route
  path="/settings"
  element={<Settings />}
/>
        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App