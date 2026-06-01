import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { sendForgotOtp } = useAuth();
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault(); 
    setError('');
    setIsSubmitting(true);
    
    try {
      const res = await sendForgotOtp(email);
      alert(res?.message || "Recovery code parameter sent.");
      navigate('/reset-password-verify');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch password recovery email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-viewport-wrapper">
      <div className="premium-card">
        <div style={styles.header}>
          <h2 style={styles.title}>Recover Password</h2>
          <p style={styles.subtitle}>Enter your account identifier to receive an identity override token code.</p>
        </div>

        {error && <div style={styles.errorContainer}>⚠️ {error}</div>}

        <form onSubmit={handleRequestOtp} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              required
              className="premium-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? 'Processing request...' : 'Send Reset OTP'}
          </button>
        </form>

        <p style={styles.footerText}>
          Remember details? <Link to="/login" style={styles.link}>Return to Login</Link>
        </p>
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
  button: { width: '100%', padding: '0.95rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)' },
  errorContainer: { padding: '0.85rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.25rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: '500' },
  footerText: { textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#9ca3af', margin: 0 },
  link: { color: '#3b82f6', textDecoration: 'none', fontWeight: '700' }
};