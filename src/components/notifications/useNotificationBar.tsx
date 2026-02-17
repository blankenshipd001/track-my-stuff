import { NotificationBar } from "./notification-bar";
import React, { useCallback, useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";

type Severity = 'error' | 'warning' | 'info' | 'success';

interface SnackbarMessage {
  message: string;
  severity: Severity;
  key: number;
}

const useNotificationBar = () => {
  const [notificationPack, setNotificationPack] = useState<SnackbarMessage[]>([]);
  // Track open state for each notification by key
  const [openMap, setOpenMap] = useState<{ [key: number]: boolean }>({});
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const enqueueNotificationBar = useCallback((message: string, severity: Severity) => {
    const key = new Date().getTime() + Math.random();
    setNotificationPack([{ message, severity, key }]);
    setOpenMap({ [key]: true });
    // Set timeout to auto-dismiss after 6 seconds
    setTimeout(() => {
      setOpenMap((prev) => ({ ...prev, [key]: false }));
      setTimeout(() => {
        setNotificationPack((prev) => prev.filter((msg) => msg.key !== key));
        setOpenMap((prev) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _, ...rest } = prev;
          return rest;
        });
      }, 200);
    }, 6000);
  }, []);
  // Click-away listener to dismiss notification if user clicks outside
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        // Dismiss all notifications
        setOpenMap({});
        setTimeout(() => {
          setNotificationPack([]);
        }, 200);
      }
    }
    if (notificationPack.length > 0) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [notificationPack.length]);

  const handleNotificationBarClose = useCallback((key: number) => (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMap((prev) => ({ ...prev, [key]: false }));
    // Remove notification after close animation
    setTimeout(() => {
      setNotificationPack((prev) => prev.filter((msg) => msg.key !== key));
      setOpenMap((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }, 200);
  }, []);

  const notificationBarContainerSx = {
    position: 'fixed',
    left: 24,
    bottom: 24,
    zIndex: 1400,
    minWidth: 320,
    maxWidth: 'calc(100vw - 48px)',
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: 48,
    gap: 1.5,
  };

  const notificationBarItemSx = {
    pointerEvents: 'auto',
    width: '100%',
    flex: '0 0 auto',
    boxSizing: 'border-box',
  };

  const NotificationBarComponent = (
    <>
      {/* Live region for announcements to screen readers */}
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {notificationPack.map((msg) => (
          <div key={msg.key}>
            {msg.severity === 'error' && `Error: ${msg.message}`}
            {msg.severity === 'warning' && `Warning: ${msg.message}`}
            {msg.severity === 'info' && `Information: ${msg.message}`}
            {msg.severity === 'success' && `Success: ${msg.message}`}
          </div>
        ))}
      </Box>

      {/* Visual notifications */}
      <Box sx={notificationBarContainerSx} ref={notificationRef}>
        {notificationPack.map((msg) => (
          <Box
            key={msg.key}
            sx={notificationBarItemSx}
            onClick={() => handleNotificationBarClose(msg.key)()}
            style={{ cursor: 'pointer' }}
          >
            <NotificationBar
              open={!!openMap[msg.key]}
              onClose={handleNotificationBarClose(msg.key)}
              severity={msg.severity}
              text={msg.message}
            />
          </Box>
        ))}
      </Box>
    </>
  );

  return { enqueueNotificationBar, NotificationBarComponent };
};

export default useNotificationBar;