import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordVerify() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false); 

  const { submitNewPassword, tempEmail } = useAuth();
  const navigate = useNavigate();

  // Safeguard: Redirects back to the initial request step if user refreshes manually
  useEffect(() => {
    if (!tempEmail) {
      navigate('/reset-password');
    }
  }, [tempEmail, navigate]);

  const handleSavePassword = async (e) => {
    e.preventDefault(); 
    setError('');
    setSuccessMsg('');
    setIsVerifying(true); 

    try {
      const res = await submitNewPassword(otp, newPassword);
      setSuccessMsg(res?.message || 'Security override committed successfully.');
      alert("Password updated successfully! Redirecting to login portal.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Invalid or expired token.');
    } finally {
      setIsVerifying(false); 
    }
  };

  return (
    <div className="app-viewport-wrapper">
      <div className="premium-card">
        <div style={styles.header}>
          <h2 style={styles.title}>Enter Reset Code</h2>
          <p style={styles.subtitle}>Provide the 6-digit security token dispatched to your inbox along with your new password choice.</p>
        </div>

        {error && <div style={styles.errorContainer}>⚠️ {error}</div>}
        {successMsg && <div style={styles.successContainer}>✨ {successMsg}</div>}

        <form onSubmit={handleSavePassword} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>6-Digit Security Token</label>
            <input 
              type="text" 
              maxLength="6"
              required
              disabled={isVerifying}
              className="premium-input"
              placeholder="000000"
              style={styles.otpInputOverride}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.passwordHeaderLabelRow}>
              <label style={styles.label}>New Access Password</label>
              <button 
                type="button" 
                disabled={isVerifying}
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeToggleBtn}
              >
                {showPassword ? "Hide Password 🙈" : "Show Password 👁️"}
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                disabled={isVerifying}
                className="premium-input"
                placeholder="••••••••"
                style={{ paddingRight: '3.5rem' }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={isVerifying} style={styles.button}>
            {isVerifying ? 'Overwriting Records...' : 'Verify Parameters & Save'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontSize: '2.25rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.5rem 0', letterSpacing: '-0.03em', background: 'linear-gradient(to right, #ffffff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '0.95rem', color: '#9ca3af', margin: 0, lineHeight: '1.5' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.4rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.825rem', fontWeight: '600', color: '#cbd5e1', letterSpacing: '0.05em', textTransform: 'uppercase' },
  passwordHeaderLabelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' },
  eyeToggleBtn: { background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', padding: 0 },
  otpInputOverride: { textAlign: 'center', fontSize: '1.65rem', letterSpacing: '0.35rem', fontWeight: '800', color: '#60a5fa', fontFamily: 'monospace' },
  button: { width: '100%', padding: '0.95rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)' },
  errorContainer: { padding: '0.85rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.25rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: '500' },
  successContainer: { padding: '0.85rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#a7f3d0', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.25rem', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: '500' }
};