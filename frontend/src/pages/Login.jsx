import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); 
  const [isLoggingIn, setIsLoggingIn] = useState(false); 
  
  const { loginUser, user, loading } = useAuth();
  const navigate = useNavigate();

  // 🛡️ SECURITY GUARD 1: Pushes authenticated sessions forward to the console workspace
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // 🛡️ SECURITY GUARD 2: THE HISTORY LOCK (Fixes your browser back arrow vulnerability)
  useEffect(() => {
    // 1. Push a dummy state into the history stack to capture the immediate view
    window.history.pushState(null, document.title, window.location.href);
    
    const handleBackButtonOverride = (event) => {
      // 2. Prevent the browser's native backward travel movement
      event.preventDefault();
      // 3. Force the history line back onto the login portal location string
      window.history.pushState(null, document.title, window.location.href);
    };

    // 4. Attach an active event listener to listen for browser Back/Forward arrow clicks
    window.addEventListener('popstate', handleBackButtonOverride);

    // 5. Cleanup listener when the component unmounts (e.g., when they successfully click register or login)
    return () => {
      window.removeEventListener('popstate', handleBackButtonOverride);
    };
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(''); 
    setIsLoggingIn(true);
    
    try {
      const data = await loginUser(email, password);
      if (data && data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email credentials or password.');
      setTimeout(() => setError(''), 10000);
    } finally {
      setIsLoggingIn(false); 
    }
  };
  
  return (
    <div className="app-viewport-wrapper">
      <div className="premium-card">
        <div style={styles.header}>
          <h2 style={{ ...styles.title, color: 'var(--text-main)' }}>Welcome Back</h2>
          <p style={{ ...styles.subtitle, color: 'var(--text-sub)' }}>Please authenticate your credentials to access your console.</p>
        </div>
        
        {error && <div style={styles.errorContainer}>⚠️ {error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: 'var(--text-sub)' }}>Email Address</label>
            <input 
              type="email" 
              required
              disabled={isLoggingIn}
              className="premium-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: 'var(--text-sub)' }}>Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                disabled={isLoggingIn}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/reset-password" style={styles.forgotLink}>Forgot Password?</Link>
          </div>

          <button type="submit" disabled={isLoggingIn} style={styles.button}>
            {isLoggingIn ? 'Verifying Secure Token...' : 'Sign In'}
          </button>
        </form>

        <p style={{ ...styles.footerText, color: 'var(--text-sub)' }}>
          New setup parameter? <Link to="/register" style={styles.link}>Register Account</Link>
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
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.825rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' },
  eyeButton: { position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: 0, display: 'flex', alignItems: 'center' },
  forgotLink: { color: '#3b82f6', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '600' },
  button: { width: '100%', padding: '0.95rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)' },
  errorContainer: { padding: '0.85rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.25rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: '500', width: '100%', boxSizing: 'border-box' },
  footerText: { textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', margin: 0 },
  link: { color: '#3b82f6', textDecoration: 'none', fontWeight: '700' }
};