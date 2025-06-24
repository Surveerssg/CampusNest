import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Persistent login: check for JWT and user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // Register (classic or Google)
  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      // For classic: redirect to login. For Google: log in directly.
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return { success: true, user: res.data.user };
      }
      // Classic registration: just return success
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  // Login (classic or Google)
  const login = async (userData) => {
    try {
      const res = await axios.post('/api/auth/login', userData, { withCredentials: true });
      console.log("Login response:", res.data);
      if (res.data.token) {
        // This block SHOULD run if backend returns success
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return { success: true, user: res.data.user };
      }
      return { success: false, error: 'Login failed' };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };
    

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => user?.role === 'admin';
  const isLandlord = () => user?.role === 'landlord';
  const isStudent = () => user?.role === 'student';
  const isAuthenticated = () => !!user;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        register,
        isAdmin, 
        isLandlord, 
        isStudent, 
        isAuthenticated 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 

