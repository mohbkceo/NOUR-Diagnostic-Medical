import { Suspense, lazy } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import { Spinner } from "./components/ui";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Reservation from "./pages/Reservation";
import NotFound from "./pages/NotFound";

// Admin code is code-split so it never ships in the public homepage bundle.
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminReservations = lazy(() => import("./pages/admin/Reservations"));
const AdminServices = lazy(() => import("./pages/admin/Services"));
const AdminDepartments = lazy(() => import("./pages/admin/Departments"));
const AdminTeam = lazy(() => import("./pages/admin/Team"));
const AdminTestimonials = lazy(() => import("./pages/admin/Testimonials"));
const AdminFaq = lazy(() => import("./pages/admin/Faq"));
const AdminPatientInfo = lazy(() => import("./pages/admin/PatientInfo"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
} // redeploy

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />
          <Route path="/rendez-vous" element={<Reservation />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <Outlet />
            </Suspense>
          }
        >
          <Route index element={<AdminLogin />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="departments" element={<AdminDepartments />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="faq" element={<AdminFaq />} />
            <Route path="patient-info" element={<AdminPatientInfo />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
