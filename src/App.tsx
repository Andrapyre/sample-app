import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import Layout from "./components/layout/Layout";
import { CircularProgress, Box } from "@mui/material";

// Lazy load pages for better performance
const CameraManagement = lazy(() => import("./pages/CameraManagement.mui"));
const UserManagement = lazy(() => import("./pages/UserManagement.mui"));
const TenantManagement = lazy(() => import("./pages/TenantManagement.mui"));

function App() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/cameras" replace />} />
            <Route path="cameras" element={<CameraManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="tenants" element={<TenantManagement />} />
          </Route>
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
