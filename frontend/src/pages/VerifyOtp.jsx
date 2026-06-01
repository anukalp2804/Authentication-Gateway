import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Grab registration email state and verification function from AuthContext
  const { verifyUserOtp, tempRegistrationEmail } = useAuth();
  const navigate = useNavigate();

  // Guard: If the user directly navigates here without registering first, bounce them back
  useEffect(() => {
    if (!tempRegistrationEmail) {
      navigate('/register');
    }
  }, [tempRegistrationEmail, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      const res = await verifyUserOtp(otp);
      if (res && res.success) {
        alert("Account verification successful! Please log in with your credentials.");
        
        // ✅ FIXED: Routes them straight back to the login screen instead of the dashboard
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired verification token.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="app-viewport-wrapper">
      <div className="premium-card">
        
        {/* 📧 ICON & TEXT HEADER LAYER */}
        <div style={styles.iconContainer}>📩</div>
        
        <div style={styles.header}>
          <h2 style={styles.title}>Enter OTP Code</h2>
          <p style={styles.subtitle}>
            We sent a verification security token to <br />
            <span style={styles.emailHighlight}>{tempRegistrationEmail || 'your-email@gmail.com'}</span>
          </p>
        </div>

        {error && <div style={styles.errorContainer}>⚠️ {error}</div>}

        <form onSubmit={handleVerifyOtp} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>6-Digit One-Time Password</label>
            <input 
              type="text" 
              maxLength="6"
              required
              disabled={isVerifying}
              className="premium-input"
              placeholder="000000"
              style={styles.otpInputOverride}
              value={otp}
              // Force numeric inputs only
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>

          <button type="submit" disabled={isVerifying} style={styles.button}>
            {isVerifying ? 'Verifying Credentials...' : 'Verify Parameters'}
          </button>
        </form>

      </div>
    </div>
  );
}

const styles = {
  iconContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    color: '#3b82f6',
    fontSize: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 1.25rem auto',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)'
  },
  header: { textAlign: 'center', marginBottom: '2.5rem' },
  title: { fontSize: '2.25rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.5rem 0', letterSpacing: '-0.03em', background: 'linear-gradient(to right, #ffffff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '0.95rem', color: '#9ca3af', margin: 0, lineHeight: '1.6' },
  emailHighlight: { color: '#60a5fa', fontWeight: '600', wordBreak: 'break-all' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.825rem', fontWeight: '600', color: '#cbd5e1', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.25rem' },
  otpInputOverride: { textAlign: 'center', fontSize: '1.75rem', letterSpacing: '0.4rem', fontWeight: '800', color: '#60a5fa', fontFamily: 'monospace' },
  button: { width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)', transition: 'all 0.2s' },
  errorContainer: { padding: '0.95rem 1.25rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', borderRadius: '14px', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.25)', fontWeight: '500', width: '100%', boxSizing: 'border-box' }
};