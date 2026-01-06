import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load all page components
const ProceedsPage = lazy(() => import('./pages/dashboard/ProceedsPage'));
const PortfolioPage = lazy(() => import('./pages/dashboard/PortfolioPage'));
const PropertiesListPage = lazy(() => import('./pages/dashboard/PropertiesListPage'));
const PropertyDetailsPage = lazy(() => import('./pages/dashboard/PropertyDetailsPage'));
const PerformancePage = lazy(() => import('./pages/dashboard/PerformancePage'));
const SupportPage = lazy(() => import('./pages/support/SupportPage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const AdminLayout = lazy(() => import('./layouts/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminAssetsPage = lazy(() => import('./pages/admin/AdminAssetsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminFinancialsPage = lazy(() => import('./pages/admin/AdminFinancialsPage'));
const EditPropertyPage = lazy(() => import('./pages/admin/EditPropertyPage'));
const AuditTrailPage = lazy(() => import('./pages/admin/AuditTrailPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const KYCInfoPage = lazy(() => import('./pages/kyc/KYCInfoPage'));
const KYCStatusPage = lazy(() => import('./pages/kyc/KYCStatusPage'));
const AdminUserDetailPage = lazy(() => import('./pages/admin/AdminUserDetailPage'));
const AdminExitRequestsPage = lazy(() => import('./pages/admin/AdminExitRequestsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const DashboardOverviewPage = lazy(() => import('./pages/dashboard/DashboardOverviewPage'));
const DashboardTourPage = lazy(() => import('./pages/dashboard/DashboardTourPage'));
const AcquisitionReviewPage = lazy(() => import('./pages/dashboard/AcquisitionReviewPage'));
const PaymentStatusPage = lazy(() => import('./pages/dashboard/PaymentStatusPage'));
const ExitRequestPage = lazy(() => import('./pages/dashboard/ExitRequestPage'));
const NotificationsPage = lazy(() => import('./pages/dashboard/NotificationsPage'));
const DocumentsPage = lazy(() => import('./pages/dashboard/DocumentsPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Root App Layout */}
          <Route element={<RootLayout />}>
            <Route path="/" element={<LandingPage />} />

            {/* Protected routes - wrap with ProtectedRoute */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/tour"
              element={
                <ProtectedRoute>
                  <DashboardTourPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <PortfolioPage />
                </ProtectedRoute>
              }
            />

            <Route path="/properties" element={<PropertiesListPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Keep other routes as-is (protect individually where necessary) */}

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
