import React, { useCallback, useEffect, useState } from "react";

import NotificationBar from "../shared/notification-bar";

type Severity = 'error' | 'warning' | 'info' | 'success';

interface SnackbarMessage {
  message: string;
  severity: Severity;
  key: number;
}

const useNotificationBar = () => {
  const [notificationPack, setNotificationPack] = useState<SnackbarMessage[]>([]);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);

  const enqueueNotificationBar = useCallback((message: string, severity: Severity) => {
    setNotificationPack((prev) => [...prev, { message, severity, key: new Date().getTime() }]);
  }, []);

  const handleNotificationBarClose =  useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }, []);


  // const handleExited = useCallback(() => {
  //   setMessageInfo(undefined);
  //   setNotificationPack((prev) => prev.slice(1));
  //   if (notificationPack.length > 1) {
  //     setMessageInfo({ ...notificationPack[1] });
  //     setOpen(true);
  //   }
  // }, [notificationPack]);

  useEffect(() => {
    console.log(notificationPack.length)
    if ((notificationPack.length > 0) && !messageInfo) {
      console.log('should open ')
      setMessageInfo({ ...notificationPack[0] });
      setOpen(true);
      //TODO: not sure this  is needed? Seems to work just fine.;
    // } else if ((notificationPack.length >= 0) && messageInfo && open) {
    //   console.log('should close')
    //   setOpen(false);
    //   handleExited();
    }
  }, [notificationPack, messageInfo, open]);

  const NotificationBarComponent = notificationPack.length > 0 ? (
    <NotificationBar
      open={open}
      onClose={handleNotificationBarClose}
      // onExited={handleExited}
      severity={messageInfo ? messageInfo.severity : 'info'}
      text={messageInfo ? messageInfo.message : ''}
    />
  ) : null;

  return { enqueueNotificationBar, NotificationBarComponent }
};

export default useNotificationBar;