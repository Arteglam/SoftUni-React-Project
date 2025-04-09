import { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const showError = (message) => {
    setError(message);
    showNotification(message, 'error');
  };

  const clearError = () => setError(null);

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const value = {
    loading,
    showLoading,
    hideLoading,
    error,
    showError,
    clearError,
    showNotification,
    closeNotification
  };

  return (
    <UIContext.Provider value={value}>
      {/* Global Loading Indicator */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Global Notification System */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};