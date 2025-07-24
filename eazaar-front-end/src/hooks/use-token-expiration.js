import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { userLoggedOut } from '../redux/features/auth/authSlice';
import { notifyError, notifyWarning } from '../utils/notifications';

/**
 * Hook to monitor token expiration and automatically logout users
 * Provides warnings before expiration and forces logout when tokens expire
 */
export const useTokenExpiration = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const intervalRef = useRef(null);
  const warningShownRef = useRef(false);
  
  const { accessToken, tokenExpiration, isRefreshing } = useSelector(state => state.auth);

  useEffect(() => {
    // Only start monitoring if user is logged in
    if (!accessToken || !tokenExpiration) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      warningShownRef.current = false;
      return;
    }

    // Check token expiration every minute
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeUntilExpiration = tokenExpiration - now;
      
      // Token has expired
      if (timeUntilExpiration <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        
        // Don't logout if we're currently refreshing tokens
        if (!isRefreshing) {
          dispatch(userLoggedOut());
          notifyError('Your session has expired. Please log in again.');
          
          // Redirect to login page
          router.push('/login');
        }
        return;
      }
      
      // Show warning 5 minutes before expiration
      const fiveMinutesInMs = 5 * 60 * 1000;
      if (timeUntilExpiration <= fiveMinutesInMs && !warningShownRef.current) {
        warningShownRef.current = true;
        const minutesLeft = Math.ceil(timeUntilExpiration / (60 * 1000));
        notifyWarning(`Your session will expire in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}. Please save your work.`);
      }
      
      // Reset warning flag if we're back to more than 5 minutes
      if (timeUntilExpiration > fiveMinutesInMs) {
        warningShownRef.current = false;
      }
    }, 60000); // Check every minute

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [accessToken, tokenExpiration, isRefreshing, dispatch, router]);

  // Also check immediately when the hook is first called
  useEffect(() => {
    if (accessToken && tokenExpiration) {
      const now = Date.now();
      const timeUntilExpiration = tokenExpiration - now;
      
      // If token is already expired, logout immediately
      if (timeUntilExpiration <= 0 && !isRefreshing) {
        dispatch(userLoggedOut());
        notifyError('Your session has expired. Please log in again.');
        
        router.push('/login');
      }
    }
  }, [accessToken, tokenExpiration, isRefreshing, dispatch, router]);

  return {
    // Return some useful values for components that might need them
    isTokenExpired: tokenExpiration ? Date.now() >= tokenExpiration : false,
    timeUntilExpiration: tokenExpiration ? Math.max(0, tokenExpiration - Date.now()) : 0,
    isRefreshing
  };
};