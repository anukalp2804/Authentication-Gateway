import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerUser, user, loading } = useAuth();
  const navigate = useNavigate();

  // 🛡️ SECURITY GUARD
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await registerUser(firstName, lastName, email, password);
      if (res.success) {
        alert("Registration checkpoint successful! Dynamic verification routing initialized.");
        navigate('/verify-otp');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration aborted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-viewport-wrapper">
      <div className="premium-card">
        <div style={styles.header}>
          <h2 style={{ ...styles.title, color: 'var(--text-main)' }}>Create Account</h2>
          <p style={{ ...styles.subtitle, color: 'var(--text-sub)' }}>Configure your data records to generate a secure authentication token.</p>
        </div>

        {error && <div style={styles.errorContainer}>⚠️ {error}</div>}

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.responsiveRow}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={{ ...styles.label, color: 'var(--text-sub)' }}>First Name</label>
              <input type="text" required className="premium-input" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={{ ...styles.label, color: 'var(--text-sub)' }}>Last Name</label>
              <input type="text" required className="premium-input" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: 'var(--text-sub)' }}>Email Address</label>
            <input type="email" required className="premium-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: 'var(--text-sub)' }}>Access Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                className="premium-input" 
                placeholder="••••••••" 
                style={{ paddingRight: '3.5rem' }} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? 'Registering...' : 'Generate Profile'}
          </button>
        </form>

        <p style={{ ...styles.footerText, color: 'var(--text-sub)' }}>
          Already configured? <Link to="/login" style={styles.link}>Return to Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.03em', background: 'linear-gradient(to right, var(--text-main), var(--text-sub))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '0.95rem', margin: 0, lineHeight: '1.5', opacity: 0.8 },
  form: { display: 'flex', flexDirection: 'column', gap: '1.4rem' },
  responsiveRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' }, 
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '130px' },
  label: { fontSize: '0.825rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' },
  eyeButton: { position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: 0, display: 'flex', alignItems: 'center', userSelect: 'none' },
  button: { width: '100%', padding: '0.95rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)' },
  errorContainer: { padding: '0.85rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.25rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: '500', width: '100%', boxSizing: 'border-box' },
  footerText: { textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', margin: 0 },
  link: { color: '#3b82f6', textDecoration: 'none', fontWeight: '700' }
};