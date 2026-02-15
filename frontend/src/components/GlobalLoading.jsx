import { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LOADING_EVENT } from '../services/axiosInstance';

/**
 * Global loading overlay. Listens to api-loading events from axiosInstance
 * and shows a full-screen backdrop with CircularProgress while any API call is pending.
 * Mount once in App.jsx to cover all API calls in one place.
 */
export function GlobalLoading() {
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const handleLoading = (e) => {
      setPending(e.detail?.pending ?? 0);
    };
    window.addEventListener(LOADING_EVENT, handleLoading);
    return () => window.removeEventListener(LOADING_EVENT, handleLoading);
  }, []);

  const open = pending > 0;

  // KPABK logo colors: bright yellow/gold on dark background
  const logoYellow = '#F9A825';
  const backdropBg = 'rgba(0, 0, 0, 0.75)';

  return (
    <Backdrop
      sx={{
        color: logoYellow,
        backgroundColor: backdropBg,
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
      open={open}
      invisible={false}
    >
      <CircularProgress color="inherit" size={48} />
    </Backdrop>
  );
}
