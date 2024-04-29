import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

// Adjust according to your actual severity needs
type Severity = "error" | "warning" | "info" | "success";

export type NotificationBarProps = {
  key?: React.Key;
  onClose: (event: React.SyntheticEvent | Event, reason?: string) => void; // Function that is run when the snackbar is closed
  open: boolean; //whether to open the snackbar or not
  text: React.ReactNode; //  text to show within snackbar
  severity: Severity; // The severity of the bar (success, info, warning, error)
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NotificationBar = ({ key, open, text, onClose, severity }: NotificationBarProps) => {
  return (
    <Snackbar key={key} open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {text}
      </Alert>
    </Snackbar>
  );
};

export default NotificationBar;
