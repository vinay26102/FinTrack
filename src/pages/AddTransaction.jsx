import {
  useEffect,
  useState,
} from 'react'

import { useToast } from '../components/ToastContext'

import {
  FiArrowLeft,
  FiDollarSign,
  FiTag,
  FiFileText,
  FiCalendar,
  FiCreditCard,
  FiSave,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
} from 'react-icons/fi'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

function AddTransaction() {
  const navigate = useNavigate()
  const location = useLocation()

  const { showToast } = useToast()

  const editingTransaction =
    location.state?.transaction || null

  const isEditMode =
    editingTransaction !== null

  const [type, setType] = useState(
    editingTransaction?.type || 'expense'
  )

  const [amount, setAmount] = useState(
    editingTransaction?.amount?.toString() || ''
  )

  const [category, setCategory] = useState(
    editingTransaction?.category || ''
  )

  const [description, setDescription] =
    useState(
      editingTransaction?.description || ''
    )

  const [date, setDate] = useState(
    editingTransaction?.date || ''
  )

  const [paymentMethod, setPaymentMethod] =
    useState(
      editingTransaction?.paymentMethod || ''
    )

  const [errors, setErrors] = useState({})

  // =========================
  // CUSTOM DROPDOWN
  // =========================

  const [openDropdown, setOpenDropdown] =
    useState(null)

  // =========================
  // CUSTOM CALENDAR
  // =========================

  const getInitialCalendarDate = () => {
    if (editingTransaction?.date) {
      const [year, month, day] =
        editingTransaction.date
          .split('-')
          .map(Number)

      return new Date(
        year,
        month - 1,
        day
      )
    }

    const today = new Date()

    today.setHours(0, 0, 0, 0)

    return today
  }

  const [calendarDate, setCalendarDate] =
    useState(getInitialCalendarDate)

  const [showCalendar, setShowCalendar] =
    useState(false)

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

  const categories =
    type === 'expense'
      ? expenseCategories
      : incomeCategories

  const paymentMethods = [
    'Cash',
    'UPI',
    'Debit Card',
    'Credit Card',
    'Bank Transfer',
  ]

  // =========================
  // CALENDAR HELPERS
  // =========================

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const weekDays = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ]

  const getCalendarDays = () => {
    const year =
      calendarDate.getFullYear()

    const month =
      calendarDate.getMonth()

    const firstDay = new Date(
      year,
      month,
      1
    ).getDay()

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate()

    const daysInPreviousMonth =
      new Date(
        year,
        month,
        0
      ).getDate()

    const days = []

    // Previous month days
    for (
      let i = firstDay - 1;
      i >= 0;
      i--
    ) {
      days.push({
        day:
          daysInPreviousMonth - i,
        currentMonth: false,
        date: new Date(
          year,
          month - 1,
          daysInPreviousMonth - i
        ),
      })
    }

    // Current month days
    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push({
        day,
        currentMonth: true,
        date: new Date(
          year,
          month,
          day
        ),
      })
    }

    // Next month days
    let nextDay = 1

    while (days.length < 42) {
      days.push({
        day: nextDay,
        currentMonth: false,
        date: new Date(
          year,
          month + 1,
          nextDay
        ),
      })

      nextDay++
    }

    return days
  }

  const formatDateForInput = (
    selectedDate
  ) => {
    const year =
      selectedDate.getFullYear()

    const month = String(
      selectedDate.getMonth() + 1
    ).padStart(2, '0')

    const day = String(
      selectedDate.getDate()
    ).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const formatDisplayDate = (
    selectedDate
  ) => {
    if (!selectedDate) {
      return 'Select date'
    }

    return selectedDate.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    )
  }

  const isToday = (dayDate) => {
    const today = new Date()

    return (
      dayDate.getDate() ===
        today.getDate() &&
      dayDate.getMonth() ===
        today.getMonth() &&
      dayDate.getFullYear() ===
        today.getFullYear()
    )
  }

  const isSelectedDate = (dayDate) => {
    if (!date) {
      return false
    }

    return (
      dayDate.getTime() ===
      new Date(
        `${date}T00:00:00`
      ).getTime()
    )
  }

  const handlePreviousMonth = () => {
    setCalendarDate(
      (previousDate) =>
        new Date(
          previousDate.getFullYear(),
          previousDate.getMonth() - 1,
          1
        )
    )
  }

  const handleNextMonth = () => {
    setCalendarDate(
      (previousDate) =>
        new Date(
          previousDate.getFullYear(),
          previousDate.getMonth() + 1,
          1
        )
    )
  }

  const handleDateSelect = (
    selectedDate
  ) => {
    setDate(
      formatDateForInput(
        selectedDate
      )
    )

    clearError('date')

    setCalendarDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      )
    )

    setShowCalendar(false)
    setOpenDropdown(null)
  }

  const handleToday = () => {
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    handleDateSelect(today)
  }

  // =========================
  // CLOSE POPUPS OUTSIDE
  // =========================

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        !event.target.closest(
          '.custom-date-picker'
        )
      ) {
        setShowCalendar(false)
      }

      if (
        !event.target.closest(
          '.custom-select'
        )
      ) {
        setOpenDropdown(null)
      }
    }

    if (
      showCalendar ||
      openDropdown !== null
    ) {
      document.addEventListener(
        'mousedown',
        handleOutsideClick
      )
    }

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      )
    }
  }, [
    showCalendar,
    openDropdown,
  ])

  const selectedDateObject = date
    ? new Date(
        `${date}T00:00:00`
      )
    : null

  const calendarDays =
    getCalendarDays()

  // =========================
  // TRANSACTION TYPE
  // =========================

  const handleTypeChange = (
    newType
  ) => {
    setType(newType)
    setCategory('')

    setOpenDropdown(null)

    setErrors((previousErrors) => ({
      ...previousErrors,
      category: '',
    }))
  }

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!amount) {
      newErrors.amount =
        'Please enter the amount.'
    } else if (Number(amount) <= 0) {
      newErrors.amount =
        'Amount must be greater than 0.'
    }

    if (!category) {
      newErrors.category =
        'Please select a category.'
    }

    if (!description.trim()) {
      newErrors.description =
        'Please enter a description.'
    }

    if (!date) {
      newErrors.date =
        'Please select a date.'
    }

    if (!paymentMethod) {
      newErrors.paymentMethod =
        'Please select a payment method.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    const savedTransactions =
      JSON.parse(
        localStorage.getItem(
          'fintrackTransactions'
        )
      ) || []

    const transactionData = {
      id: isEditMode
        ? editingTransaction.id
        : Date.now(),

      type,

      amount: Number(amount),

      category,

      description:
        description.trim(),

      date,

      paymentMethod,
    }

    let updatedTransactions

    if (isEditMode) {
      updatedTransactions =
        savedTransactions.map(
          (transaction) =>
            transaction.id ===
            editingTransaction.id
              ? transactionData
              : transaction
        )
    } else {
      updatedTransactions = [
        transactionData,
        ...savedTransactions,
      ]
    }

    localStorage.setItem(
      'fintrackTransactions',
      JSON.stringify(
        updatedTransactions
      )
    )

    showToast(
      isEditMode
        ? 'Transaction updated successfully!'
        : 'Transaction added successfully!',
      'success'
    )

    navigate('/transactions')
  }

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [field]: '',
      }))
    }
  }

  return (
    <div className="add-transaction-page">

      {/* HEADER */}

      <div className="add-transaction-header">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate('/transactions')
          }
        >
          <FiArrowLeft />

          <span>
            Back to Transactions
          </span>
        </button>

        <div>

          <h1>
            {isEditMode
              ? 'Edit Transaction'
              : 'Add Transaction'}
          </h1>

          <p>
            {isEditMode
              ? 'Update your transaction details'
              : 'Record your income or expense'}
          </p>

        </div>

      </div>

      {/* FORM */}

      <form
        className="add-transaction-form"
        onSubmit={handleSubmit}
      >

        {/* TRANSACTION TYPE */}

        <div className="form-section">

          <h2>
            Transaction Type
          </h2>

          <div className="transaction-type-buttons">

            <button
              type="button"
              className={`type-button expense-type ${
                type === 'expense'
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                handleTypeChange(
                  'expense'
                )
              }
            >
              Expense
            </button>

            <button
              type="button"
              className={`type-button income-type ${
                type === 'income'
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                handleTypeChange(
                  'income'
                )
              }
            >
              Income
            </button>

          </div>

        </div>

        {/* AMOUNT */}

        <div className="form-group">

          <label htmlFor="amount">
            Amount
          </label>

          <div className="input-with-icon">

            <FiDollarSign />

            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                setAmount(
                  e.target.value
                )

                clearError('amount')
              }}
            />

          </div>

          {errors.amount && (
            <p className="form-error">
              {errors.amount}
            </p>
          )}

        </div>

        {/* CATEGORY */}

        <div className="form-group">

          <label>
            Category
          </label>

          <div className="input-with-icon">

            <FiTag />

            <div className="custom-select">

              <button
                type="button"
                className={`custom-select-button ${
                  errors.category
                    ? 'has-error'
                    : ''
                }`}
                onClick={() => {
                  setShowCalendar(false)

                  setOpenDropdown(
                    openDropdown ===
                      'category'
                      ? null
                      : 'category'
                  )
                }}
              >

                <span
                  className={
                    category
                      ? 'selected-option'
                      : 'placeholder-option'
                  }
                >
                  {category ||
                    'Select category'}
                </span>

                <FiChevronDown
                  className={
                    openDropdown ===
                    'category'
                      ? 'dropdown-arrow rotate'
                      : 'dropdown-arrow'
                  }
                />

              </button>

              {openDropdown ===
                'category' && (

                <div className="custom-select-menu">

                  {categories.map(
                    (categoryOption) => (

                      <button
                        type="button"
                        key={
                          categoryOption
                        }
                        className={`custom-select-option ${
                          category ===
                          categoryOption
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() => {
                          setCategory(
                            categoryOption
                          )

                          clearError(
                            'category'
                          )

                          setOpenDropdown(
                            null
                          )
                        }}
                      >
                        {categoryOption}
                      </button>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

          {errors.category && (
            <p className="form-error">
              {errors.category}
            </p>
          )}

        </div>

        {/* DESCRIPTION */}

        <div className="form-group">

          <label htmlFor="description">
            Description
          </label>

          <div className="input-with-icon">

            <FiFileText />

            <input
              id="description"
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => {
                setDescription(
                  e.target.value
                )

                clearError(
                  'description'
                )
              }}
            />

          </div>

          {errors.description && (
            <p className="form-error">
              {errors.description}
            </p>
          )}

        </div>

        {/* DATE */}

        <div className="form-group">

          <label>
            Date
          </label>

          <div className="custom-date-picker">

            <button
              type="button"
              className={`custom-date-input ${
                errors.date
                  ? 'has-error'
                  : ''
              }`}
              onClick={() => {
                setOpenDropdown(null)

                setShowCalendar(
                  !showCalendar
                )
              }}
            >

              <FiCalendar />

              <span
                className={
                  date
                    ? 'selected-date-text'
                    : 'placeholder-date-text'
                }
              >
                {selectedDateObject
                  ? formatDisplayDate(
                      selectedDateObject
                    )
                  : 'Select date'}
              </span>

            </button>

            {showCalendar && (

              <div className="custom-calendar">

                {/* CALENDAR HEADER */}

                <div className="calendar-header">

                  <button
                    type="button"
                    className="calendar-nav-button"
                    onClick={
                      handlePreviousMonth
                    }
                    aria-label="Previous month"
                  >
                    <FiChevronLeft />
                  </button>

                  <div className="calendar-month-year">

                    <strong>
                      {
                        monthNames[
                          calendarDate.getMonth()
                        ]
                      }
                    </strong>

                    <span>
                      {
                        calendarDate.getFullYear()
                      }
                    </span>

                  </div>

                  <button
                    type="button"
                    className="calendar-nav-button"
                    onClick={
                      handleNextMonth
                    }
                    aria-label="Next month"
                  >
                    <FiChevronRight />
                  </button>

                </div>

                {/* WEEK DAYS */}

                <div className="calendar-weekdays">

                  {weekDays.map(
                    (day) => (
                      <span
                        key={day}
                      >
                        {day}
                      </span>
                    )
                  )}

                </div>

                {/* DAYS */}

                <div className="calendar-days">

                  {calendarDays.map(
                    (
                      calendarDay,
                      index
                    ) => (

                      <button
                        type="button"
                        key={`${calendarDay.date.getTime()}-${index}`}
                        className={`
                          calendar-day
                          ${
                            !calendarDay.currentMonth
                              ? 'outside-month'
                              : ''
                          }
                          ${
                            isToday(
                              calendarDay.date
                            )
                              ? 'today'
                              : ''
                          }
                          ${
                            isSelectedDate(
                              calendarDay.date
                            )
                              ? 'selected'
                              : ''
                          }
                        `}
                        onClick={() =>
                          handleDateSelect(
                            calendarDay.date
                          )
                        }
                      >
                        {
                          calendarDay.day
                        }
                      </button>

                    )
                  )}

                </div>

                {/* CALENDAR FOOTER */}

                <div className="calendar-footer">

                  <button
                    type="button"
                    className="calendar-today-button"
                    onClick={
                      handleToday
                    }
                  >
                    Today
                  </button>

                </div>

              </div>

            )}

          </div>

          {errors.date && (
            <p className="form-error">
              {errors.date}
            </p>
          )}

        </div>

        {/* PAYMENT METHOD */}

        <div className="form-group">

          <label>
            Payment Method
          </label>

          <div className="input-with-icon">

            <FiCreditCard />

            <div className="custom-select">

              <button
                type="button"
                className={`custom-select-button ${
                  errors.paymentMethod
                    ? 'has-error'
                    : ''
                }`}
                onClick={() => {
                  setShowCalendar(false)

                  setOpenDropdown(
                    openDropdown ===
                      'payment'
                      ? null
                      : 'payment'
                  )
                }}
              >

                <span
                  className={
                    paymentMethod
                      ? 'selected-option'
                      : 'placeholder-option'
                  }
                >
                  {paymentMethod ||
                    'Select payment method'}
                </span>

                <FiChevronDown
                  className={
                    openDropdown ===
                    'payment'
                      ? 'dropdown-arrow rotate'
                      : 'dropdown-arrow'
                  }
                />

              </button>

              {openDropdown ===
                'payment' && (

                <div className="custom-select-menu">

                  {paymentMethods.map(
                    (method) => (

                      <button
                        type="button"
                        key={method}
                        className={`custom-select-option ${
                          paymentMethod ===
                          method
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() => {
                          setPaymentMethod(
                            method
                          )

                          clearError(
                            'paymentMethod'
                          )

                          setOpenDropdown(
                            null
                          )
                        }}
                      >
                        {method}
                      </button>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

          {errors.paymentMethod && (
            <p className="form-error">
              {errors.paymentMethod}
            </p>
          )}

        </div>

        {/* ACTIONS */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              navigate('/transactions')
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-transaction-button"
          >
            <FiSave />

            {isEditMode
              ? 'Save Changes'
              : 'Save Transaction'}
          </button>

        </div>

      </form>

    </div>
  )
}

export default AddTransaction