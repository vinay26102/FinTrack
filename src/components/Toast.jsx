import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiX,
} from 'react-icons/fi'

function Toast({
  message,
  type = 'success',
  onClose,
}) {
  const icons = {
    success: <FiCheckCircle />,
    error: <FiAlertCircle />,
    info: <FiInfo />,
  }

  return (
    <div className={`toast toast-${type}`}>

      <div className="toast-icon">
        {icons[type]}
      </div>

      <div className="toast-message">
        {message}
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <FiX />
      </button>

    </div>
  )
}

export default Toast