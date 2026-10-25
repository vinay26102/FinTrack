import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import Toast from './Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = (
    message,
    type = 'success'
  ) => {
    setToast({
      message,
      type,
    })
  }

  const hideToast = () => {
    setToast(null)
  }

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      setToast(null)
    }, 2500)

    return () => clearTimeout(timer)
  }, [toast])

  return (
    <ToastContext.Provider
      value={{
        showToast,
        hideToast,
      }}
    >
      {children}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}