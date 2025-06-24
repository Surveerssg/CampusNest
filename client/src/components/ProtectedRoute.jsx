import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  requireLandlord = false,
  requireStudent = false 
}) => {
  const { isAuthenticated, isAdmin, isLandlord, isStudent } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" />;
  }

  if (requireLandlord && !isLandlord()) {
    return <Navigate to="/" />;
  }

  if (requireStudent && !isStudent()) {
    return <Navigate to="/" />;
  }

  return children;
}; 