import { Route, Routes } from 'react-router-dom';
import Layout from './Layout.jsx';
import IndexPage from './pages/IndexPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PlacesPage from './pages/owner/PlacesPage.jsx';
import PlacesFormPage from './pages/owner/PlacesFormPage.jsx';
import PropertyPage from './pages/PropertyPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import PendingApprovals from './components/PendingApprovals.jsx';
import PropertyFormPage from './pages/PropertyFormPage.jsx';
// import AnalyticsDashboard from './pages/admin/AnalyticsDashboard.jsx';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/account/properties/new" element={<PropertyFormPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />}>
            <Route path="approvals" element={<PendingApprovals />} />
            {/* <Route path="analytics" element={<AnalyticsDashboard />} /> */}
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
