import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import Layout from "./components/layout/Layout";

// Lazy load pages for better performance
const CameraParameters = lazy(() => import("./pages/CameraParameters"));
const CameraManagement = lazy(() => import("./pages/CameraManagement"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/parameters" replace />} />
            <Route path="parameters" element={<CameraParameters />} />
            <Route path="cameras" element={<CameraManagement />} />
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
