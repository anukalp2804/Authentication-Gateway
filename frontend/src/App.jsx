import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// 1. Make sure all your page elements are cleanly imported here:
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';

// ✅ STEP 1: Ensure these two recovery page imports are present at the top!
import ResetPassword from './pages/ResetPassword';
import ResetPasswordVerify from './pages/ResetPasswordVerify';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Your standard application route pathways */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ✅ STEP 2: ADD THESE TWO MATCHING ROUTE LINES HERE */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password-verify" element={<ResetPasswordVerify />} />

          {/* Clean catch-all default fallback redirect routing */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}