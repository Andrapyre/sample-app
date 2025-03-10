import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Snackbar, Alert, Container, Box } from "@mui/material";
import { useState } from "react";

export interface ToastProps {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error";
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastProps>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (
    message: string,
    severity: "success" | "info" | "warning" | "error" = "success",
  ) => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  return { toast, showToast, hideToast };
};

export default function Layout() {
  const { toast, hideToast } = useToast();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Outlet />
      </Container>
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={hideToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
