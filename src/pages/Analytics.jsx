import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
} from 'react-icons/fi'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

function Analytics() {
  const [transactions, setTransactions] =
    useState([])

  const [period, setPeriod] =
    useState('6')

  useEffect(() => {
    const savedTransactions =
      JSON.parse(
        localStorage.getItem(
          'fintrackTransactions'
        )
      ) || []

    setTransactions(savedTransactions)
  }, [])

  const totalIncome = useMemo(() => {
    return transactions
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
  }, [transactions])

  const totalExpenses = useMemo(() => {
    return transactions
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
  }, [transactions])

  const netSavings =
    totalIncome - totalExpenses

  const formatAmount = (amount) => {
    return `₹${Number(
      amount
    ).toLocaleString('en-IN')}`
  }

  const monthlyData = useMemo(() => {
    const months = Number(period)
    const now = new Date()
    const data = []

    for (
      let i = months - 1;
      i >= 0;
      i--
    ) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      )

      const year =
        date.getFullYear()

      const month =
        date.getMonth()

      const income =
        transactions
          .filter((transaction) => {
            if (
              transaction.type !==
              'income'
            ) {
              return false
            }

            const transactionDate =
              new Date(
                `${transaction.date}T00:00:00`
              )

            return (
              transactionDate.getFullYear() ===
                year &&
              transactionDate.getMonth() ===
                month
            )
          })
          .reduce(
            (total, transaction) =>
              total +
              Number(
                transaction.amount
              ),
            0
          )

      const expenses =
        transactions
          .filter((transaction) => {
            if (
              transaction.type !==
              'expense'
            ) {
              return false
            }

            const transactionDate =
              new Date(
                `${transaction.date}T00:00:00`
              )

            return (
              transactionDate.getFullYear() ===
                year &&
              transactionDate.getMonth() ===
                month
            )
          })
          .reduce(
            (total, transaction) =>
              total +
              Number(
                transaction.amount
              ),
            0
          )

      data.push({
        month: date.toLocaleDateString(
          'en-US',
          {
            month: 'short',
          }
        ),
        income,
        expenses,
      })
    }

    return data
  }, [transactions, period])

  const expenseData = useMemo(() => {
    const categoryTotals = {}

    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          'expense'
      )
      .forEach((transaction) => {
        const category =
          transaction.category ||
          'Other'

        categoryTotals[category] =
          (categoryTotals[category] ||
            0) +
          Number(transaction.amount)
      })

    return Object.entries(
      categoryTotals
    )
      .map(
        ([
          name,
          value,
        ]) => ({
          name,
          value,
        })
      )
      .sort(
        (a, b) =>
          b.value - a.value
      )
  }, [transactions])

  const expenseColors = [
    '#16a34a',
    '#2563eb',
    '#f59e0b',
    '#dc2626',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#64748b',
  ]

  const topExpenseCategory =
    expenseData.length > 0
      ? expenseData[0]
      : null

  const savingsPercentage =
    totalIncome > 0
      ? Math.round(
          (netSavings /
            totalIncome) *
            100
        )
      : 0

  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>
            Understand your spending and
            income patterns.
          </p>
        </div>
      </div>


      {/* SUMMARY */}

      <div className="analytics-summary">

        <div className="analytics-summary-card">
          <div className="analytics-summary-icon income">
            <FiTrendingUp />
          </div>

          <div>
            <span>Total Income</span>

            <strong>
              {formatAmount(
                totalIncome
              )}
            </strong>
          </div>
        </div>


        <div className="analytics-summary-card">
          <div className="analytics-summary-icon expense">
            <FiTrendingDown />
          </div>

          <div>
            <span>Total Expenses</span>

            <strong>
              {formatAmount(
                totalExpenses
              )}
            </strong>
          </div>
        </div>


        <div className="analytics-summary-card">
          <div className="analytics-summary-icon balance">
            <FiDollarSign />
          </div>

          <div>
            <span>Net Savings</span>

            <strong>
              {formatAmount(
                netSavings
              )}
            </strong>
          </div>
        </div>

      </div>


      {/* CHARTS */}

      <div className="analytics-grid">


        {/* INCOME VS EXPENSES */}

        <div className="analytics-card">

          <div className="analytics-card-header">

            <div>
              <h2>
                Income vs Expenses
              </h2>

              <p>
                Monthly comparison
              </p>
            </div>

            <select
              value={period}
              onChange={(event) =>
                setPeriod(
                  event.target.value
                )
              }
            >
              <option value="6">
                Last 6 Months
              </option>

              <option value="12">
                Last 12 Months
              </option>
            </select>

          </div>


          <div className="analytics-chart">

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={monthlyData}
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
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#94a3b8',
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#94a3b8',
                    fontSize: 12,
                  }}
                  tickFormatter={(value) =>
                    `₹${value}`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    formatAmount(value)
                  }
                  contentStyle={{
                    border:
                      '1px solid #e5e7eb',
                    borderRadius:
                      '10px',
                    boxShadow:
                      '0 8px 20px rgba(15, 23, 42, 0.08)',
                  }}
                />

                <Legend />

                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#16a34a"
                  radius={[
                    5,
                    5,
                    0,
                    0,
                  ]}
                  barSize={18}
                />

                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#dc2626"
                  radius={[
                    5,
                    5,
                    0,
                    0,
                  ]}
                  barSize={18}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>


        {/* EXPENSE BREAKDOWN */}

        <div className="analytics-card">

          <div className="analytics-card-header">

            <div>
              <h2>
                Expense Breakdown
              </h2>

              <p>
                Spending by category
              </p>
            </div>

          </div>


          <div className="analytics-pie-wrapper">

            {expenseData.length === 0 ? (

              <div className="analytics-empty-chart">
                <FiDollarSign />

                <strong>
                  No expense data
                </strong>

                <span>
                  Add expenses to see
                  your breakdown.
                </span>
              </div>

            ) : (

              <>
                <div className="analytics-pie-chart">

                  <ResponsiveContainer
                    width="100%"
                    height={230}
                  >
                    <PieChart>

                      <Pie
                        data={expenseData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={82}
                        paddingAngle={3}
                      >
                        {expenseData.map(
                          (
                            entry,
                            index
                          ) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                expenseColors[
                                  index %
                                    expenseColors.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        formatter={(value) =>
                          formatAmount(
                            value
                          )
                        }
                        contentStyle={{
                          border:
                            '1px solid #e5e7eb',
                          borderRadius:
                            '10px',
                        }}
                      />

                    </PieChart>
                  </ResponsiveContainer>

                </div>


                <div className="analytics-category-list">

                  {expenseData.map(
                    (
                      category,
                      index
                    ) => (
                      <div
                        className="analytics-category-item"
                        key={
                          category.name
                        }
                      >

                        <div className="analytics-category-name">

                          <span
                            className="analytics-category-dot"
                            style={{
                              background:
                                expenseColors[
                                  index %
                                    expenseColors.length
                                ],
                            }}
                          />

                          <span>
                            {
                              category.name
                            }
                          </span>

                        </div>

                        <strong>
                          {formatAmount(
                            category.value
                          )}
                        </strong>

                      </div>
                    )
                  )}

                </div>
              </>

            )}

          </div>

        </div>

      </div>


      {/* INSIGHTS */}

      <div className="analytics-card analytics-insights">

        <div className="analytics-card-header">

          <div>
            <h2>
              Financial Insights
            </h2>

            <p>
              A quick look at your
              financial habits.
            </p>
          </div>

        </div>


        <div className="analytics-insight-list">


          <div className="analytics-insight-item">

            <div className="analytics-insight-number">
              01
            </div>

            <div>

              <strong>
                {totalIncome >
                totalExpenses
                  ? 'Your income is higher than your expenses.'
                  : totalIncome <
                    totalExpenses
                  ? 'Your expenses are higher than your income.'
                  : 'Your income and expenses are balanced.'}
              </strong>

              <span>
                {totalIncome >
                totalExpenses
                  ? `You are currently saving ${formatAmount(
                      netSavings
                    )}.`
                  : 'Keep monitoring your spending to improve your cash flow.'}
              </span>

            </div>

          </div>


          <div className="analytics-insight-item">

            <div className="analytics-insight-number">
              02
            </div>

            <div>

              <strong>
                {topExpenseCategory
                  ? `Your highest spending category is ${topExpenseCategory.name}.`
                  : 'Start adding expenses to discover your spending patterns.'}
              </strong>

              <span>
                {topExpenseCategory
                  ? `${formatAmount(
                      topExpenseCategory.value
                    )} spent in this category.`
                  : 'Consistent tracking helps identify where your money goes.'}
              </span>

            </div>

          </div>


          <div className="analytics-insight-item">

            <div className="analytics-insight-number">
              03
            </div>

            <div>

              <strong>
                Savings rate:{" "}
                {savingsPercentage}%
              </strong>

              <span>
                {totalIncome > 0
                  ? `You currently keep ${savingsPercentage}% of your income after expenses.`
                  : 'Add income and expenses to calculate your savings rate.'}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Analytics