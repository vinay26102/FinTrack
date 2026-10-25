import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FiCoffee,
  FiShoppingBag,
  FiTruck,
  FiFileText,
  FiFilm,
  FiHeart,
  FiBookOpen,
  FiTag,
  FiBriefcase,
  FiDollarSign,
  FiTrendingUp,
} from 'react-icons/fi'

function Categories() {
  useEffect(() => {
  document.title = 'FinTrack | Categories'
}, [])
  const [transactions, setTransactions] =
    useState([])

  useEffect(() => {
    const savedTransactions =
      JSON.parse(
        localStorage.getItem(
          'fintrackTransactions'
        )
      ) || []

    setTransactions(savedTransactions)
  }, [])

  const categoryIcons = {
    Food: <FiCoffee />,
    Shopping: <FiShoppingBag />,
    Transport: <FiTruck />,
    Bills: <FiFileText />,
    Entertainment: <FiFilm />,
    Health: <FiHeart />,
    Education: <FiBookOpen />,
    Salary: <FiBriefcase />,
    Freelance: <FiDollarSign />,
    Business: <FiTrendingUp />,
    Bonus: <FiDollarSign />,
    Investment: <FiTrendingUp />,
    Other: <FiTag />,
  }

  const expenseCategories = [
    'Food',
    'Shopping',
    'Transport',
    'Bills',
    'Entertainment',
    'Health',
    'Education',
    'Other',
  ]

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Business',
    'Bonus',
    'Investment',
    'Other',
  ]

  const getCategoryData = (
    category,
    type
  ) => {
    const categoryTransactions =
      transactions.filter(
        (transaction) =>
          transaction.category ===
            category &&
          transaction.type === type
      )

    const total = categoryTransactions.reduce(
      (sum, transaction) =>
        sum +
        Number(transaction.amount),
      0
    )

    return {
      count:
        categoryTransactions.length,
      total,
    }
  }

  const expenseData = useMemo(() => {
    return expenseCategories.map(
      (category) => ({
        category,
        ...getCategoryData(
          category,
          'expense'
        ),
      })
    )
  }, [transactions])

  const incomeData = useMemo(() => {
    return incomeCategories.map(
      (category) => ({
        category,
        ...getCategoryData(
          category,
          'income'
        ),
      })
    )
  }, [transactions])

  const activeExpenseCategories =
    expenseData.filter(
      (item) => item.count > 0
    )

  const activeIncomeCategories =
    incomeData.filter(
      (item) => item.count > 0
    )

  const totalCategories =
    new Set(
      transactions.map(
        (transaction) =>
          transaction.category
      )
    ).size

  const formatAmount = (amount) => {
    return `₹${Number(
      amount
    ).toLocaleString('en-IN')}`
  }

  const getCategoryClass = (
    category
  ) => {
    return category
      .toLowerCase()
      .replace(/\s+/g, '-')
  }

  const renderCategoryCard = (
    item,
    type
  ) => {
    return (
      <div
        className="category-card"
        key={`${type}-${item.category}`}
      >

        <div
          className={`category-icon ${type} ${getCategoryClass(
            item.category
          )}`}
        >
          {categoryIcons[
            item.category
          ] || <FiTag />}
        </div>

        <div className="category-card-content">

          <div className="category-card-top">
            <h3>
              {item.category}
            </h3>

            <span
              className={`category-type ${type}`}
            >
              {type === 'expense'
                ? 'Expense'
                : 'Income'}
            </span>
          </div>

          <div className="category-card-bottom">

            <span>
              {item.count}{' '}
              {item.count === 1
                ? 'transaction'
                : 'transactions'}
            </span>

            <strong>
              {formatAmount(
                item.total
              )}
            </strong>

          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="categories-page">

      {/* HEADER */}

      <div className="categories-header">

        <div>
          <h1>Categories</h1>

          <p>
            Organize and understand your
            income and spending categories.
          </p>
        </div>

      </div>


      {/* SUMMARY */}

      <div className="categories-summary">

        <div className="categories-summary-card">

          <div className="categories-summary-icon total">
            <FiTag />
          </div>

          <div>
            <span>
              Total Categories
            </span>

            <strong>
              {totalCategories}
            </strong>
          </div>

        </div>


        <div className="categories-summary-card">

          <div className="categories-summary-icon expense">
            <FiTrendingUp />
          </div>

          <div>
            <span>
              Expense Categories
            </span>

            <strong>
              {activeExpenseCategories.length}
            </strong>
          </div>

        </div>


        <div className="categories-summary-card">

          <div className="categories-summary-icon income">
            <FiDollarSign />
          </div>

          <div>
            <span>
              Income Categories
            </span>

            <strong>
              {activeIncomeCategories.length}
            </strong>
          </div>

        </div>

      </div>


      {/* EXPENSE CATEGORIES */}

      <section className="categories-section">

        <div className="categories-section-header">

          <div>
            <h2>
              Expense Categories
            </h2>

            <p>
              Track where your money is
              being spent.
            </p>
          </div>

          <span className="categories-count">
            {activeExpenseCategories.length}{' '}
            active
          </span>

        </div>


        <div className="categories-grid">

          {activeExpenseCategories.length >
          0 ? (
            activeExpenseCategories.map(
              (item) =>
                renderCategoryCard(
                  item,
                  'expense'
                )
            )
          ) : (
            <div className="categories-empty">
              <FiTag />

              <strong>
                No expense data yet
              </strong>

              <span>
                Add an expense to see
                category information here.
              </span>
            </div>
          )}

        </div>

      </section>


      {/* INCOME CATEGORIES */}

      <section className="categories-section">

        <div className="categories-section-header">

          <div>
            <h2>
              Income Categories
            </h2>

            <p>
              Track the sources of your
              income.
            </p>
          </div>

          <span className="categories-count">
            {activeIncomeCategories.length}{' '}
            active
          </span>

        </div>


        <div className="categories-grid">

          {activeIncomeCategories.length >
          0 ? (
            activeIncomeCategories.map(
              (item) =>
                renderCategoryCard(
                  item,
                  'income'
                )
            )
          ) : (
            <div className="categories-empty">
              <FiTag />

              <strong>
                No income data yet
              </strong>

              <span>
                Add an income transaction
                to see category information
                here.
              </span>
            </div>
          )}

        </div>

      </section>

    </div>
  )
}

export default Categories