import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AdminRoute from './components/AdminRoute.tsx';
import LandingPage from './components/LandingPage.tsx';
import RegisterPage from './components/RegisterPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import AdminLoginPage from './components/AdminLoginPage.tsx';
import AboutPage from './components/AboutPage.tsx';
import DashboardPage from './components/DashboardPage.tsx';
import AnalysisPage from './components/AnalysisPage.tsx';
import ResultsPage from './components/ResultsPage.tsx';
import HistoryPage from './components/HistoryPage.tsx';
import CatalogPage from './components/CatalogPage.tsx';
import ProfilePage from './components/ProfilePage.tsx';
import AdminDashboardPage from './components/AdminDashboardPage.tsx';
import AdminProductsPage from './components/AdminProductsPage.tsx';
import AdminProductFormPage from './components/AdminProductFormPage.tsx';
import AdminAnalysisHistoryPage from './components/AdminAnalysisHistoryPage.tsx';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        
        <div className="min-h-screen ">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/kimmingyu" element={<AdminLoginPage />} />
            <Route path="/tentang-kami" element={<AboutPage />} />
            
            {/* Protected User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/analisis" element={
              <ProtectedRoute>
                <AnalysisPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hasil" element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/riwayat" element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/katalog" element={
              <ProtectedRoute>
                <CatalogPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profil" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProductsPage />
              </AdminRoute>
            } />
            <Route path="/admin/products/add" element={
              <AdminRoute>
                <AdminProductFormPage />
              </AdminRoute>
            } />
            <Route path="/admin/products/edit/:id" element={
              <AdminRoute>
                <AdminProductFormPage />
              </AdminRoute>
            } />
            <Route path="/admin/analysis-history" element={
              <AdminRoute>
                <AdminAnalysisHistoryPage />
              </AdminRoute>
            } />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}