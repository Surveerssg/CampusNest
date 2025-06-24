import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyPage from './pages/PropertyPage';
import PropertyFormPage from './pages/PropertyFormPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';

import './index.css';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected routes inside layout */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/properties" replace />} />
          <Route path="properties" element={<IndexPage />} />
          <Route path="account/:subpage?" element={<ProfilePage />} />

          {/* Landlord-only routes */}
          <Route
            path="account/properties"
            element={
              <ProtectedRoute role="landlord">
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="account/properties/new"
            element={
              <ProtectedRoute role="landlord">
                <PropertyFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="account/properties/:id"
            element={
              <ProtectedRoute role="landlord">
                <PropertyFormPage />
              </ProtectedRoute>
            }
          />

          {/* Shared routes */}
          <Route path="property/:id" element={<PropertyPage />} />
          <Route path="account/bookings" element={<BookingsPage />} />
          <Route path="account/bookings/:id" element={<BookingPage />} />

          {/* Admin-only routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute role="admin">
                <AdminAnalyticsPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
