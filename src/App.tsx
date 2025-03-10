import { Suspense, lazy, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import Layout from "./components/layout/Layout";
import { CircularProgress, Box } from "@mui/material";
import { useAppSelector, useAppDispatch } from "./hooks/redux";
import { checkAuth } from "./store/slices/authSlice";
import { fetchDevices } from "./store/slices/deviceSlice";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const DevicesDashboard = lazy(() => import("./pages/devices/DevicesDashboard"));
const CameraManagement = lazy(() => import("./pages/devices/CameraManagement"));
const MicroscopeManagement = lazy(
  () => import("./pages/devices/MicroscopeManagement"),
);
const SensorManagement = lazy(() => import("./pages/devices/SensorManagement"));
const UserManagement = lazy(() => import("./pages/UserManagement.mui"));
const TenantManagement = lazy(() => import("./pages/TenantManagement.mui"));
const Login = lazy(() => import("./pages/Login"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchDevices());
  }, [dispatch]);

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
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />

            {/* Protected routes */}
            <Route
              path="devices"
              element={
                <ProtectedRoute>
                  <DevicesDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="devices/cameras"
              element={
                <ProtectedRoute>
                  <CameraManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="devices/microscopes"
              element={
                <ProtectedRoute>
                  <MicroscopeManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="devices/sensors"
              element={
                <ProtectedRoute>
                  <SensorManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="tenants"
              element={
                <ProtectedRoute>
                  <TenantManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
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
