import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  withCredentials: true 
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [tempEmail, setTempEmail] = useState(''); 
  const [tempRegistrationEmail, setTempRegistrationEmail] = useState(''); 
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'dark');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get('/me');
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.log("No active validation token verified.");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const registerUser = async (firstName, lastName, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/register', { firstName, lastName, email, password });
      setTempRegistrationEmail(email); 
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const verifyUserOtp = async (otp) => {
    setLoading(true);
    try {
      const res = await api.post('/verify-otp', { email: tempRegistrationEmail, otp });
      
      // 🚫 REMOVED: setUser(res.data.user); 
      // Stripping this out prevents the frontend from auto-logging them in!
      
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    const res = await api.post('/login', { email, password });
    if (res.data.success && res.data.user) {
      setUser(res.data.user);
    }
    return res.data;
  };

  const logoutUser = async () => {
    try {
      // ✅ FIXED: Hits the backend endpoint safely without CORS redirect collisions
      const res = await api.get('/logout');
      if (res.data.success) {
        setUser(null);
      }
      return res.data;
    } catch (err) { 
      console.error("Logout runtime sequence failed inside engine framework context:", err); 
      throw err;
    }
  };

  const sendForgotOtp = async (email) => {
    const res = await api.post('/forgot-password', { email });
    setTempEmail(email); 
    return res.data;
  };

  const submitNewPassword = async (otp, newPassword) => {
    const res = await api.post('/reset-password', { email: tempEmail, otp, newPassword });
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, tempEmail, tempRegistrationEmail, setTempRegistrationEmail,
      theme, toggleTheme, registerUser, verifyUserOtp, loginUser, logoutUser, sendForgotOtp, submitNewPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);