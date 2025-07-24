// PROFESSIONAL React Hot Toast Utilities - ULTRA CLEAN & POWERFUL!
import toast from 'react-hot-toast';

// 🚀 SUCCESS NOTIFICATIONS
export const notifySuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 3000,
    style: {
      background: '#10B981',
      color: '#fff',
      fontWeight: '600',
      fontSize: '14px',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
    ...options,
  });
};

// 🔥 ERROR NOTIFICATIONS
export const notifyError = (message, options = {}) => {
  return toast.error(message, {
    duration: 4000,
    style: {
      background: '#EF4444',
      color: '#fff',
      fontWeight: '600',
      fontSize: '14px',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
    ...options,
  });
};

// ⚡ LOADING NOTIFICATIONS
export const notifyLoading = (message, options = {}) => {
  return toast.loading(message, {
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: '600',
      fontSize: '14px',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    ...options,
  });
};

// ⚠️ WARNING NOTIFICATIONS
export const notifyWarning = (message, options = {}) => {
  return toast(message, {
    duration: 3500,
    icon: '⚠️',
    style: {
      background: '#F59E0B',
      color: '#fff',
      fontWeight: '600',
      fontSize: '14px',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    ...options,
  });
};

// ℹ️ INFO NOTIFICATIONS
export const notifyInfo = (message, options = {}) => {
  return toast(message, {
    duration: 3000,
    icon: 'ℹ️',
    style: {
      background: '#6366F1',
      color: '#fff',
      fontWeight: '600',
      fontSize: '14px',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    ...options,
  });
};

// 🎯 PROMISE NOTIFICATIONS (For async operations)
export const notifyPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred!',
    },
    {
      style: {
        fontWeight: '600',
        fontSize: '14px',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
      success: {
        style: {
          background: '#10B981',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
        },
      },
      error: {
        style: {
          background: '#EF4444',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
        },
      },
      loading: {
        style: {
          background: '#3B82F6',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
        },
      },
      ...options,
    }
  );
};

// 🗑️ DISMISS FUNCTIONS
export const dismissToast = (toastId) => toast.dismiss(toastId);
export const dismissAllToasts = () => toast.dismiss();

// 🎨 CUSTOM TOAST
export const notifyCustom = (message, options = {}) => {
  return toast(message, options);
};

// 📱 BACKWARD COMPATIBILITY
export const toast_old = {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo,
  loading: notifyLoading,
  promise: notifyPromise,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
  custom: notifyCustom,
};

// 🚀 DEFAULT EXPORT
export default {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo,
  loading: notifyLoading,
  promise: notifyPromise,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
  custom: notifyCustom,
  toast: toast_old,
};