import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useToast } from '../components/ToastContext'

import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiArrowUpRight,
  FiArrowDownRight,
  FiCoffee,
  FiShoppingBag,
  FiTruck,
  FiBriefcase,
  FiMoreVertical,
  FiTag,
  FiFileText,
  FiTrash2,
  FiEdit2,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

function Transactions() {
  useEffect(() => {
  document.title = 'FinTrack | Transactions'
}, [])
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [transactions, setTransactions] =
    useState([])

  const [searchTerm, setSearchTerm] =
    useState('')

  const [typeFilter, setTypeFilter] =
    useState('all')

  const [sortOption, setSortOption] =
    useState('recent')

  const [openMenuId, setOpenMenuId] =
    useState(null)

  const [menuPosition, setMenuPosition] =
    useState({
      top: 0,
      left: 0,
    })

  useEffect(() => {
    const savedTransactions =
      JSON.parse(
        localStorage.getItem(
          'fintrackTransactions'
        )
      ) || []

    setTransactions(savedTransactions)
  }, [])

  /* CLOSE MENU WHEN CLICKING OUTSIDE */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const clickedMenu =
        event.target.closest(
          '.transaction-floating-menu'
        )

      const clickedMoreButton =
        event.target.closest(
          '.transaction-more-button'
        )

      if (
        !clickedMenu &&
        !clickedMoreButton
      ) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      )
    }
  }, [])

  const getTransactionIcon = (
    transaction
  ) => {
    if (transaction.type === 'income') {
      return <FiBriefcase />
    }

    switch (transaction.category) {
      case 'Food':
        return <FiCoffee />

      case 'Shopping':
        return <FiShoppingBag />

      case 'Transport':
        return <FiTruck />

      case 'Salary':
        return <FiBriefcase />

      case 'Bills':
        return <FiFileText />

      default:
        return <FiTag />
    }
  }

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

  /* OPEN FLOATING MENU */

  const handleMenuClick = (
    event,
    transactionId
  ) => {
    const buttonRect =
      event.currentTarget.getBoundingClientRect()

    const menuWidth = 150
    const menuHeight = 96
    const menuGap = 6

    let left =
      buttonRect.right - menuWidth

    let top =
      buttonRect.bottom + menuGap

    /* KEEP MENU INSIDE VIEWPORT HORIZONTALLY */

    if (left < 8) {
      left = 8
    }

    if (
      left + menuWidth >
      window.innerWidth - 8
    ) {
      left =
        window.innerWidth -
        menuWidth -
        8
    }

    /*
      If there isn't enough space below,
      show it above the button.
    */

    if (
      top + menuHeight >
      window.innerHeight - 8
    ) {
      top =
        buttonRect.top -
        menuHeight -
        menuGap
    }

    setMenuPosition({
      top,
      left,
    })

    setOpenMenuId(
      openMenuId === transactionId
        ? null
        : transactionId
    )
  }

  /* DELETE */

  const handleDelete = (
    transactionId
  ) => {
    const updatedTransactions =
      transactions.filter(
        (transaction) =>
          transaction.id !==
          transactionId
      )

    setTransactions(
      updatedTransactions
    )

    localStorage.setItem(
      'fintrackTransactions',
      JSON.stringify(
        updatedTransactions
      )
    )

    setOpenMenuId(null)

    showToast(
      'Transaction deleted successfully!',
      'success'
    )
  }

  /* EDIT */

  const handleEdit = (
    transaction
  ) => {
    setOpenMenuId(null)

    navigate(
      '/add-transaction',
      {
        state: {
          transaction,
        },
      }
    )
  }

  /* FILTER + SORT */

  const filteredTransactions =
    useMemo(() => {
      let result = [
        ...transactions,
      ]

      /* SEARCH */

      if (searchTerm.trim()) {
        const search =
          searchTerm
            .toLowerCase()
            .trim()

        result =
          result.filter(
            (transaction) =>
              `${transaction.description} ${transaction.category} ${transaction.paymentMethod}`
                .toLowerCase()
                .includes(search)
          )
      }

      /* TYPE FILTER */

      if (
        typeFilter !== 'all'
      ) {
        result =
          result.filter(
            (transaction) =>
              transaction.type ===
              typeFilter
          )
      }

      /* SORT */

      if (
        sortOption === 'recent'
      ) {
        result.sort(
          (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        )
      }

      if (
        sortOption === 'oldest'
      ) {
        result.sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )
      }

      if (
        sortOption === 'highest'
      ) {
        result.sort(
          (a, b) =>
            Number(b.amount) -
            Number(a.amount)
        )
      }

      if (
        sortOption === 'lowest'
      ) {
        result.sort(
          (a, b) =>
            Number(a.amount) -
            Number(b.amount)
        )
      }

      return result
    }, [
      transactions,
      searchTerm,
      typeFilter,
      sortOption,
    ])

  /* SUMMARY */

  const totalIncome =
    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          'income'
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(
            transaction.amount
          ),
        0
      )

  const totalExpenses =
    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          'expense'
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(
            transaction.amount
          ),
        0
      )

  const netBalance =
    totalIncome -
    totalExpenses

  const formatAmount = (
    amount
  ) => {
    return `₹${Number(
      amount
    ).toLocaleString(
      'en-IN'
    )}`
  }

  return (
    <div className="transactions-page">

      {/* HEADER */}

      <div className="transactions-header">

        <div>

          <h1>
            Transactions
          </h1>

          <p>
            Manage and track all your income and expenses.
          </p>

        </div>

        <button
          type="button"
          className="transactions-add-button"
          onClick={() =>
            navigate(
              '/add-transaction'
            )
          }
        >
          <FiPlus />
          Add Transaction
        </button>

      </div>

      {/* SUMMARY */}

      <div className="transactions-summary">

        <div className="transaction-summary-card">

          <div className="transaction-summary-icon income">
            <FiArrowUpRight />
          </div>

          <div>

            <span>
              Total Income
            </span>

            <strong>
              {formatAmount(
                totalIncome
              )}
            </strong>

          </div>

        </div>

        <div className="transaction-summary-card">

          <div className="transaction-summary-icon expense">
            <FiArrowDownRight />
          </div>

          <div>

            <span>
              Total Expenses
            </span>

            <strong>
              {formatAmount(
                totalExpenses
              )}
            </strong>

          </div>

        </div>

        <div className="transaction-summary-card">

          <div className="transaction-summary-icon balance">
            <FiArrowUpRight />
          </div>

          <div>

            <span>
              Net Balance
            </span>

            <strong>
              {formatAmount(
                netBalance
              )}
            </strong>

          </div>

        </div>

      </div>

      {/* TRANSACTIONS CARD */}

      <div className="transactions-main-card">

        {/* FILTER BAR */}

        <div className="transactions-toolbar">

          <div className="transactions-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

          <div className="transactions-filters">

            <button
              type="button"
              className="transaction-filter-button"
            >
              <FiFilter />
              Filter
            </button>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value
                )
              }
            >

              <option value="all">
                All Transactions
              </option>

              <option value="income">
                Income
              </option>

              <option value="expense">
                Expenses
              </option>

            </select>

            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(
                  e.target.value
                )
              }
            >

              <option value="recent">
                Recent
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="highest">
                Highest Amount
              </option>

              <option value="lowest">
                Lowest Amount
              </option>

            </select>

          </div>

        </div>

        {/* TABLE */}

        <div className="transactions-table-wrapper">

          <table className="transactions-table">

            <thead>

              <tr>

                <th>
                  Transaction
                </th>

                <th>
                  Category
                </th>

                <th>
                  Date
                </th>

                <th>
                  Amount
                </th>

                <th></th>

              </tr>

            </thead>

            <tbody>

              {filteredTransactions.length >
              0 ? (

                filteredTransactions.map(
                  (transaction) => (

                    <tr
                      key={
                        transaction.id
                      }
                    >

                      <td>

                        <div className="transaction-title">

                          <div
                            className={`transaction-icon ${transaction.type}`}
                          >
                            {getTransactionIcon(
                              transaction
                            )}
                          </div>

                          <div>

                            <strong>
                              {
                                transaction.description
                              }
                            </strong>

                            <span>
                              {
                                transaction.paymentMethod
                              }
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>

                        <span
                          className={`transaction-category-badge ${transaction.type}`}
                        >
                          {
                            transaction.category
                          }
                        </span>

                      </td>

                      <td>
                        {formatDate(
                          transaction.date
                        )}
                      </td>

                      <td>

                        <strong
                          className={`transaction-amount ${transaction.type}`}
                        >
                          {transaction.type ===
                          'income'
                            ? '+'
                            : '-'}
                          {formatAmount(
                            transaction.amount
                          )}
                        </strong>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="transaction-more-button"
                          onClick={(
                            event
                          ) =>
                            handleMenuClick(
                              event,
                              transaction.id
                            )
                          }
                          aria-label="Transaction options"
                        >
                          <FiMoreVertical />
                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign:
                        'center',
                      padding:
                        '48px 20px',
                      color:
                        '#64748b',
                    }}
                  >

                    <strong
                      style={{
                        display:
                          'block',
                        marginBottom:
                          '6px',
                        color:
                          '#111827',
                        fontSize:
                          '15px',
                      }}
                    >
                      No transactions found
                    </strong>

                    <span>
                      Add your first transaction
                      to start tracking your finances.
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="transactions-footer">

          <span>

            Showing{' '}

            <strong>
              {
                filteredTransactions.length
              }
            </strong>{' '}

            of{' '}

            <strong>
              {transactions.length}
            </strong>{' '}

            transactions

          </span>

          <div className="transaction-pagination">

            <button disabled>
              Previous
            </button>

            <button className="active">
              1
            </button>

            <button disabled>
              Next
            </button>

          </div>

        </div>

      </div>

      {/* FLOATING ACTION MENU */}

      {openMenuId !== null && (

        <div
          className="transaction-floating-menu"
          style={{
            position: 'fixed',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            zIndex: 99999,
            width: '150px',
            padding: '6px',
            boxSizing: 'border-box',
            background: '#ffffff',
            border:
              '1px solid #e5e7eb',
            borderRadius: '10px',
            boxShadow:
              '0 8px 20px rgba(15, 23, 42, 0.12)',
          }}
        >

          {/* EDIT */}

          <button
            type="button"
            onClick={() => {

              const transaction =
                transactions.find(
                  (item) =>
                    item.id ===
                    openMenuId
                )

              if (transaction) {
                handleEdit(
                  transaction
                )
              }

            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems:
                'center',
              gap: '8px',
              padding:
                '9px 10px',
              border: 'none',
              borderRadius: '7px',
              background:
                'transparent',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >

            <FiEdit2 />

            Edit

          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={() =>
              handleDelete(
                openMenuId
              )
            }
            style={{
              width: '100%',
              display: 'flex',
              alignItems:
                'center',
              gap: '8px',
              padding:
                '9px 10px',
              border: 'none',
              borderRadius: '7px',
              background:
                'transparent',
              color: '#dc2626',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >

            <FiTrash2 />

            Delete

          </button>

        </div>

      )}

    </div>
  )
}

export default Transactions