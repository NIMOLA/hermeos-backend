import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';

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
            <Route path="/dashboard" element={<DashboardOverviewPage />} />
            <Route path="/dashboard/tour" element={<DashboardTourPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/proceeds" element={<ProceedsPage />} />
            <Route path="/properties" element={<PropertiesListPage />} />
            <Route path="/properties/details" element={<PropertyDetailsPage />} />
            <Route path="/properties/review" element={<AcquisitionReviewPage />} />
            <Route path="/properties/payment-status" element={<PaymentStatusPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/kyc" element={<KYCInfoPage />} />
            <Route path="/kyc/status" element={<KYCStatusPage />} />
            <Route path="/exit-request" element={<ExitRequestPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="assets" element={<AdminAssetsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/:id" element={<AdminUserDetailPage />} />
            <Route path="exits" element={<AdminExitRequestsPage />} />
            <Route path="financials" element={<AdminFinancialsPage />} />
            <Route path="audit-trail" element={<AuditTrailPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="edit-property" element={<EditPropertyPage />} />
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
