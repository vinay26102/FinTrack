import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  FiCreditCard,
  FiPlusCircle,
  FiBarChart2,
  FiTag,
  FiSettings,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiArrowUpRight,
  FiArrowDownRight,
  FiShoppingBag,
  FiCoffee,
  FiTruck,
  FiBriefcase,
  FiExternalLink,
  FiFileText,
} from 'react-icons/fi'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const currentHour = new Date().getHours()

let greeting = 'Good Evening'

if (currentHour < 12) {
  greeting = 'Good Morning'
} else if (currentHour < 17) {
  greeting = 'Good Afternoon'
}
  useEffect(() => {
  document.title = 'FinTrack | Dashboard'
}, [])
  const navigate = useNavigate()

  const [successMessage, setSuccessMessage] =
    useState('')

  const [userName, setUserName] =
    useState('Vinay')

  const [transactions, setTransactions] =
    useState([])

  const [spendingPeriod, setSpendingPeriod] =
    useState('month')

  // Login success snackbar
  useEffect(() => {
    const message = localStorage.getItem(
      'fintrackLoginSuccessMessage'
    )

    if (!message) {
      return
    }

    setSuccessMessage(message)

    localStorage.removeItem(
      'fintrackLoginSuccessMessage'
    )

    const timer = setTimeout(() => {
      setSuccessMessage('')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Get user name
  useEffect(() => {
    const savedName =
      localStorage.getItem(
        'fintrackUserName'
      )

    if (savedName) {
      setUserName(savedName)
    }
  }, [])

  // Get transactions
  useEffect(() => {
    const savedTransactions =
      JSON.parse(
        localStorage.getItem(
          'fintrackTransactions'
        )
      ) || []

    setTransactions(savedTransactions)
  }, [])

  // =========================
  // SUMMARY CALCULATIONS
  // =========================

  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === 'income'
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount),
      0
    )

  const totalExpenses = transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense'
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount),
      0
    )

  const totalBalance =
    totalIncome - totalExpenses

  // =========================
  // FORMAT AMOUNT
  // =========================

  const formatAmount = (amount) => {
    return `₹${Number(
      amount
    ).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // =========================
  // TRANSACTION ICON
  // =========================

  const getTransactionIcon = (
    transaction
  ) => {
    if (
      transaction.type === 'income'
    ) {
      return <FiBriefcase />
    }

    switch (transaction.category) {
      case 'Food':
        return <FiCoffee />

      case 'Shopping':
        return <FiShoppingBag />

      case 'Transport':
        return <FiTruck />

      case 'Bills':
        return <FiFileText />

      case 'Salary':
        return <FiBriefcase />

      default:
        return <FiTag />
    }
  }

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return '-'
    }

    const formattedDate = new Date(
      `${date}T00:00:00`
    )

    return formattedDate.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    )
  }

  // =========================
  // SPENDING CHART DATA
  // =========================

  const spendingChartData = useMemo(() => {
    const expenseTransactions =
      transactions.filter(
        (transaction) =>
          transaction.type === 'expense'
      )

    const today = new Date()

    // -------------------------
    // THIS WEEK
    // -------------------------

    if (spendingPeriod === 'week') {
      const data = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)

        date.setHours(0, 0, 0, 0)

        date.setDate(
          today.getDate() - i
        )

        const dateKey =
          date.toISOString().split('T')[0]

        const amount =
          expenseTransactions
            .filter(
              (transaction) =>
                transaction.date ===
                dateKey
            )
            .reduce(
              (total, transaction) =>
                total +
                Number(transaction.amount),
              0
            )

        data.push({
          label: date.toLocaleDateString(
            'en-US',
            {
              weekday: 'short',
            }
          ),
          amount,
        })
      }

      return data
    }

    // -------------------------
    // THIS YEAR
    // -------------------------

    if (spendingPeriod === 'year') {
      const data = []

      for (
        let month = 0;
        month < 12;
        month++
      ) {
        const amount =
          expenseTransactions
            .filter((transaction) => {
              if (!transaction.date) {
                return false
              }

              const transactionDate =
                new Date(
                  `${transaction.date}T00:00:00`
                )

              return (
                transactionDate.getFullYear() ===
                  today.getFullYear() &&
                transactionDate.getMonth() ===
                  month
              )
            })
            .reduce(
              (total, transaction) =>
                total +
                Number(transaction.amount),
              0
            )

        const monthDate = new Date(
          today.getFullYear(),
          month,
          1
        )

        data.push({
          label:
            monthDate.toLocaleDateString(
              'en-US',
              {
                month: 'short',
              }
            ),
          amount,
        })
      }

      return data
    }

    // -------------------------
    // THIS MONTH
    // -------------------------

    const data = []

    const currentYear =
      today.getFullYear()

    const currentMonth =
      today.getMonth()

    const daysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate()

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      const dateKey = `${currentYear}-${String(
        currentMonth + 1
      ).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`

      const amount =
        expenseTransactions
          .filter(
            (transaction) =>
              transaction.date ===
              dateKey
          )
          .reduce(
            (total, transaction) =>
              total +
              Number(transaction.amount),
            0
          )

      data.push({
        label: String(day),
        amount,
      })
    }

    return data
  }, [
    transactions,
    spendingPeriod,
  ])

  // =========================
  // SPENDING PERIOD TOTAL
  // =========================

  const spendingPeriodTotal =
    spendingChartData.reduce(
      (total, item) =>
        total + item.amount,
      0
    )

  // =========================
  // RECENT TRANSACTIONS
  // =========================

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => {
        return (
          new Date(a.date) -
          new Date(b.date)
        )
      })
      .slice(0, 5)
  }, [transactions])

  // =========================
  // EXPENSE CATEGORIES
  // =========================

  const expenseCategories = useMemo(() => {
    const categoryTotals = {}

    transactions
      .filter(
        (transaction) =>
          transaction.type === 'expense'
      )
      .forEach((transaction) => {
        const category =
          transaction.category ||
          'Other'

        categoryTotals[category] =
          (categoryTotals[category] || 0) +
          Number(transaction.amount)
      })

    const categoryArray =
      Object.entries(categoryTotals)
        .map(([name, amount]) => ({
          name,
          amount,
          percentage:
            totalExpenses > 0
              ? Math.round(
                  (amount /
                    totalExpenses) *
                    100
                )
              : 0,
        }))
        .sort(
          (a, b) =>
            b.amount - a.amount
        )

    return categoryArray.slice(0, 5)
  }, [
    transactions,
    totalExpenses,
  ])

  // =========================
  // EXPENSE DONUT CHART DATA
  // =========================

  const expenseChartData = useMemo(() => {
    const categoryTotals = {}

    transactions
      .filter(
        (transaction) =>
          transaction.type === 'expense'
      )
      .forEach((transaction) => {
        const category =
          transaction.category ||
          'Other'

        categoryTotals[category] =
          (categoryTotals[category] || 0) +
          Number(transaction.amount)
      })

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort(
        (a, b) =>
          b.value - a.value
      )
  }, [transactions])

  // =========================
  // CATEGORY CLASS
  // =========================

  const getCategoryClass = (
    category
  ) => {
    switch (category) {
      case 'Food':
        return 'food'

      case 'Shopping':
        return 'shopping'

      case 'Transport':
        return 'travel'

      case 'Bills':
        return 'bills'

      default:
        return 'others'
    }
  }

  return (
    <>
      {/* =========================
          SUCCESS SNACKBAR
      ========================= */}

      {successMessage !== '' && (
        <div className="success-snackbar">

          <div className="success-snackbar-content">

            <span>✓</span>

            <span>
              {successMessage}
            </span>

          </div>

          <button
            type="button"
            className="snackbar-close"
            onClick={() =>
              setSuccessMessage('')
            }
            aria-label="Close notification"
          >
            ×
          </button>

        </div>
      )}

      {/* =========================
          TOP BAR
      ========================= */}

      <header className="dashboard-topbar">

        <div className="dashboard-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Search transactions, categories..."
          />

        </div>

        <div className="dashboard-profile">

          <button className="notification-button">

            <FiBell />

            <span className="notification-dot"></span>

          </button>

          <div className="profile-info">

            <div className="profile-avatar">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-details">

              <strong>
                {userName}
              </strong>

              <span>
                My Account
              </span>

            </div>

            <FiChevronDown className="profile-arrow" />

          </div>

        </div>

      </header>

      {/* =========================
          DASHBOARD CONTENT
      ========================= */}

      <div className="dashboard-content">

        {/* WELCOME */}

        <section className="dashboard-welcome">

          <div>

            <h1>
               {greeting} , {userName} 👋
            </h1>

            <p>
              Here's your financial overview for today.
            </p>

          </div>

          <button
            type="button"
            className="add-transaction-button"
            onClick={() =>
              navigate(
                '/add-transaction'
              )
            }
          >
            <FiPlusCircle />
            Add Transaction
          </button>

        </section>

        {/* =========================
            SUMMARY CARDS
        ========================= */}

        <section className="summary-cards">

          {/* BALANCE */}

          <div className="summary-card balance-card">

            <div className="summary-card-top">

              <div className="summary-icon">
                <FiCreditCard />
              </div>

              <div>

                <span className="summary-label">
                  Total Balance
                </span>

                <h2>
                  {formatAmount(
                    totalBalance
                  )}
                </h2>

              </div>

            </div>

            <div className="summary-bottom">

              <span
                className={
                  totalBalance >= 0
                    ? 'positive-change'
                    : 'negative-change'
                }
              >
                {totalBalance >= 0 ? (
                  <FiArrowUpRight />
                ) : (
                  <FiArrowDownRight />
                )}

                {totalBalance >= 0
                  ? 'Healthy'
                  : 'Negative'}
              </span>

              <span>
                current balance
              </span>

            </div>

          </div>

          {/* INCOME */}

          <div className="summary-card income-card">

            <div className="summary-card-top">

              <div className="summary-icon">
                <FiArrowUpRight />
              </div>

              <div>

                <span className="summary-label">
                  Total Income
                </span>

                <h2>
                  {formatAmount(
                    totalIncome
                  )}
                </h2>

              </div>

            </div>

            <div className="summary-bottom">

              <span className="positive-change">
                <FiArrowUpRight />
                Income
              </span>

              <span>
                total recorded
              </span>

            </div>

          </div>

          {/* EXPENSE */}

          <div className="summary-card expense-card">

            <div className="summary-card-top">

              <div className="summary-icon">
                <FiArrowDownRight />
              </div>

              <div>

                <span className="summary-label">
                  Total Expenses
                </span>

                <h2>
                  {formatAmount(
                    totalExpenses
                  )}
                </h2>

              </div>

            </div>

            <div className="summary-bottom">

              <span className="negative-change">
                <FiArrowDownRight />
                Expenses
              </span>

              <span>
                total recorded
              </span>

            </div>

          </div>

        </section>

        {/* =========================
            ANALYTICS
        ========================= */}

        <section className="dashboard-analytics">

          {/* SPENDING OVERVIEW */}

          <div className="dashboard-card spending-card">

            <div className="card-header">

              <div>

                <h3>
                  Spending Overview
                </h3>

                <p>
                  Your spending trend for this period.
                </p>

              </div>

              <select
                value={spendingPeriod}
                onChange={(event) =>
                  setSpendingPeriod(
                    event.target.value
                  )
                }
              >
                <option value="month">
                  This Month
                </option>

                <option value="week">
                  This Week
                </option>

                <option value="year">
                  This Year
                </option>
              </select>

            </div>

            <div className="spending-total">

              <strong>
                {formatAmount(
                  spendingPeriodTotal
                )}
              </strong>

              <span className="negative-change">
                <FiArrowDownRight />
                Expenses
              </span>

              <span>
                selected period
              </span>

            </div>

            <div className="chart-placeholder">

              {spendingPeriodTotal > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={spendingChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="label"
                      tick={{
                        fontSize: 11,
                      }}
                      tickLine={false}
                      axisLine={false}
                      interval={
                        spendingPeriod ===
                        'month'
                          ? 4
                          : 0
                      }
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                      }}
                      tickLine={false}
                      axisLine={false}
                      width={45}
                      tickFormatter={(value) =>
                        `₹${value}`
                      }
                    />

                    <Tooltip
                      formatter={(value) => [
                        formatAmount(value),
                        'Expenses',
                      ]}
                    />

                    <Bar
                      dataKey="amount"
                      fill="#16a34a"
                      radius={[
                        5,
                        5,
                        0,
                        0,
                      ]}
                      maxBarSize={28}
                    />

                  </BarChart>

                </ResponsiveContainer>

              ) : (

                <div className="chart-empty-state">

                  <FiBarChart2 />

                  <span>
                    No expenses recorded for this period.
                  </span>

                </div>

              )}

            </div>

          </div>

          {/* EXPENSE CATEGORIES */}

          <div className="dashboard-card categories-card">

            <div className="card-header">

              <div>

                <h3>
                  Expense Categories
                </h3>

                <p>
                  Breakdown of your spending.
                </p>

              </div>

            </div>

            <div className="categories-content">

              <div className="donut-placeholder">

                {expenseChartData.length > 0 ? (

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={expenseChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={84}
                        paddingAngle={3}
                        stroke="#ffffff"
                        strokeWidth={2}
                      >

                        {expenseChartData.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={[
                                '#16a34a',
                                '#2563eb',
                                '#f59e0b',
                                '#dc2626',
                                '#7c3aed',
                                '#0891b2',
                                '#ec4899',
                                '#6b7280',
                              ][index % 8]}
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip
                        formatter={(value) =>
                          formatAmount(value)
                        }
                      />

                    </PieChart>

                  </ResponsiveContainer>

                ) : (

                  <div className="chart-empty-state">

                    <FiBarChart2 />

                    <span>
                      No expenses yet
                    </span>

                  </div>

                )}

                {expenseChartData.length > 0 && (

                  <div className="donut-center">

                    <strong>
                      {formatAmount(
                        totalExpenses
                      )}
                    </strong>

                    <span>
                      Total
                    </span>

                  </div>

                )}

              </div>

              <div className="category-list">

                {expenseCategories.length >
                0 ? (

                  expenseCategories.map(
                    (category) => (

                      <div
                        className="category-item"
                        key={category.name}
                      >

                        <span className="category-name">

                          <i
                            className={`category-dot ${getCategoryClass(
                              category.name
                            )}`}
                          ></i>

                          {category.name}

                        </span>

                        <strong>
                          {formatAmount(
                            category.amount
                          )}
                        </strong>

                        <span>
                          {
                            category.percentage
                          }%
                        </span>

                      </div>

                    )
                  )

                ) : (

                  <div className="category-item">

                    <span className="category-name">
                      No expenses yet
                    </span>

                    <strong>
                      ₹0
                    </strong>

                    <span>
                      0%
                    </span>

                  </div>

                )}

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            BOTTOM SECTION
        ========================= */}

        <section className="dashboard-bottom">

          {/* RECENT TRANSACTIONS */}

          <div className="dashboard-card transactions-card">

            <div className="card-header">

              <div>

                <h3>
                  Recent Transactions
                </h3>

                <p>
                  Your latest transactions.
                </p>

              </div>

              <button
                type="button"
                className="view-all-button"
                onClick={() =>
                  navigate(
                    '/transactions'
                  )
                }
              >
                View All
                <FiExternalLink />
              </button>

            </div>

            <div className="transactions-table">

              <div className="transaction-row table-heading">

                <span>#</span>

                <span>
                  Transaction
                </span>

                <span>
                  Category
                </span>

                <span>
                  Date
                </span>

                <span>
                  Amount
                </span>

              </div>

              {recentTransactions.length >
              0 ? (

                recentTransactions.map(
                  (
                    transaction,
                    index
                  ) => (

                    <div
                      className="transaction-row"
                      key={transaction.id}
                    >

                      <span>
                        {index + 1}
                      </span>

                      <div className="transaction-name">

                        {getTransactionIcon(
                          transaction
                        )}

                        <span>
                          {
                            transaction.description
                          }
                        </span>

                      </div>

                      <span
                        className={`transaction-category ${
                          transaction.type ===
                          'income'
                            ? 'income-category'
                            : `${getCategoryClass(
                                transaction.category
                              )}-category`
                        }`}
                      >
                        {transaction.type ===
                        'income'
                          ? 'Income'
                          : transaction.category}
                      </span>

                      <span>
                        {formatDate(
                          transaction.date
                        )}
                      </span>

                      <strong
                        className={
                          transaction.type ===
                          'income'
                            ? 'income-amount'
                            : 'expense-amount'
                        }
                      >
                        {transaction.type ===
                        'income'
                          ? '+'
                          : '-'}
                        {formatAmount(
                          transaction.amount
                        )}
                      </strong>

                    </div>

                  )
                )

              ) : (

                <div className="transaction-row">

                  <span>
                    -
                  </span>

                  <div className="transaction-name">

                    <FiCreditCard />

                    <span>
                      No transactions yet
                    </span>

                  </div>

                  <span>
                    -
                  </span>

                  <span>
                    -
                  </span>

                  <strong>
                    ₹0
                  </strong>

                </div>

              )}

            </div>

          </div>

          {/* QUICK ACTIONS */}

          <div className="dashboard-card quick-actions-card">

            <div className="quick-add-box">

              <div>

                <h3>
                  Add a new transaction
                </h3>

                <p>
                  Quickly add income or expense.
                </p>

              </div>

              <button
                type="button"
                className="quick-add-button"
                onClick={() =>
                  navigate(
                    '/add-transaction'
                  )
                }
              >
                <FiPlusCircle />
                Add Transaction
              </button>

            </div>

            <div className="quick-actions">

              <h3>
                Quick Actions
              </h3>

              <div className="quick-action-grid">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/transactions'
                    )
                  }
                >
                  <FiCreditCard />
                  Transactions
                </button>

                <button
                  type="button"
                >
                  <FiBarChart2 />
                  Analytics
                </button>

                <button
                  type="button"
                >
                  <FiTag />
                  Categories
                </button>

                <button
                  type="button"
                >
                  <FiSettings />
                  Settings
                </button>

              </div>

            </div>

          </div>

        </section>

      </div>
    </>
  )
}

export default Dashboard