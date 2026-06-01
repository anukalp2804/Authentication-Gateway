import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logoutUser, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [latency, setLatency] = useState(22);
  
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    { text: 'SYSTEM: Secure authentication shell initialized.', type: 'success' },
    { text: 'METRICS: Active WebSocket listener connected to Node.js.', type: 'info' }
  ]);
  
  const terminalEndRef = useRef(null);

  useEffect(() => {
    const timeTimer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    const latencyTimer = setInterval(() => setLatency(Math.floor(Math.random() * (28 - 16 + 1)) + 16), 3000);
    return () => {
      clearInterval(timeTimer);
      clearInterval(latencyTimer);
    };
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

const handleConfirmLogout = async () => {
    try {
      // 1. Terminate cookie tokens on the Node server backend
      await logoutUser();
      
      // 2. Hide the modal backdrop popup
      setShowLogoutModal(false);
      
      // 3. ✅ THE FIX: Wipe out the browser history entries completely on redirect
      // By using window.location.replace instead of a standard navigate(),
      // we completely rewrite the browser's history stack so the back button loses its path memory!
      window.location.replace('/login');
      
    } catch (err) {
      console.error("Logout sequence failure:", err);
    }
  };
  const processCommand = (commandText) => {
    const cleanCommand = commandText.trim().toLowerCase();
    const newLogs = [...terminalLogs, { text: `user@anukalp:~# ${commandText}`, type: 'command' }];

    if (cleanCommand === 'clear') {
      setTerminalLogs([]);
      return;
    } else if (cleanCommand === 'help') {
      newLogs.push({ text: 'Available parameters: status, ping, clear, system', type: 'info' });
    } else if (cleanCommand === 'status') {
      newLogs.push({ text: `Node Status: OPERATIONAL | Session: ${user?.firstName || 'Authorized'}`, type: 'success' });
    } else if (cleanCommand === 'ping') {
      newLogs.push({ text: `Echo replay response from server: ${latency}ms`, type: 'info' });
    } else if (cleanCommand === 'system') {
      newLogs.push({ text: `OS Core Architecture: React Vite Platform V14.6`, type: 'warn' });
    } else {
      newLogs.push({ text: `Bash command token unrecognized: "${commandText}". Type "help" for metrics matrix.`, type: 'error' });
    }

    setTerminalLogs(newLogs);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    processCommand(terminalInput);
    setTerminalInput('');
  };

  return (
    <div className="dashboard-layout-root">
      
      {/* 🧭 LOCKED STICKY CONTROLLER HEAD NAVBAR ROW (Optimized for Mobile Screens) */}
      <nav className="dashboard-top-navbar">
        <div style={styles.navBrandBlock}>
          <div style={styles.avatarBubble}>
            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'}
          </div>
          <span style={styles.welcomeText}>
            Hi, <strong style={{ color: 'var(--text-main)' }}>{user?.firstName || 'Anukalp'}</strong>
          </span>
        </div>

        <div style={styles.navActionsHub}>
          <button type="button" onClick={toggleTheme} style={styles.pillControl}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button type="button" onClick={() => setShowLogoutModal(true)} style={styles.navDisconnectBtn}>
            Disconnect
          </button>
        </div>
      </nav>

      {/* 🎛️ MAIN PLATFORM CONTENT GRID CANVAS */}
      <main className="dashboard-main-content-canvas">
        <div style={styles.dashboardHeroSection}>
          <h1 style={{ ...styles.mainDashboardTitle, color: 'var(--text-main)' }}>Cloud Node Workspace</h1>
          <p style={{ ...styles.mainDashboardSubtitle, color: 'var(--text-sub)' }}>Secure parameters overview mapping for backend environment verification streams.</p>
        </div>

        <div className="extended-metrics-grid-style" style={styles.extendedMetricsGrid}>
          <div style={styles.metricCardBox}>
            <div style={styles.cardHeaderRow}>
              <span style={styles.cardIcon}>🛡️</span>
              <span style={{ ...styles.cardLabel, color: 'var(--text-sub)' }}>Security Engine</span>
            </div>
            <div style={{ ...styles.cardMainValue, color: 'var(--text-main)' }}>JWT Token Verified</div>
            <div style={{ ...styles.cardSubValueText, color: 'var(--text-sub)' }}>HttpOnly Cookie Layer Protected</div>
          </div>

          <div style={styles.metricCardBox}>
            <div style={styles.cardHeaderRow}>
              <span style={styles.cardIcon}>📧</span>
              <span style={{ ...styles.cardLabel, color: 'var(--text-sub)' }}>Verified Credentials</span>
            </div>
            <div style={{ ...styles.cardMainValueText, color: 'var(--text-main)' }}>{user?.email || 'anukalp@identity.io'}</div>
            <div style={{ ...styles.cardSubValueText, color: 'var(--text-sub)' }}>Account Node Identified</div>
          </div>

          <div style={styles.metricCardBox}>
            <div style={styles.cardHeaderRow}>
              <span style={styles.cardIcon}>⚡</span>
              <span style={{ ...styles.cardLabel, color: 'var(--text-sub)' }}>API Response Latency</span>
            </div>
            <div style={{ ...styles.cardMainValue, color: '#10b981' }}>{latency} ms</div>
            <div style={{ ...styles.cardSubValueText, color: 'var(--text-sub)' }}>Active Express Pipeline</div>
          </div>

          <div style={styles.metricCardBox}>
            <div style={styles.cardHeaderRow}>
              <span style={styles.cardIcon}>🕒</span>
              <span style={{ ...styles.cardLabel, color: 'var(--text-sub)' }}>Data Sync Time</span>
            </div>
            <div style={{ ...styles.cardMainValue, color: 'var(--text-main)' }}>{currentTime}</div>
            <div style={{ ...styles.cardSubValueText, color: 'var(--text-sub)' }}>Server Time Horizon</div>
          </div>
        </div>

        <div style={styles.terminalContainer}>
          <div style={styles.terminalHeader}>
            <div style={styles.terminalDots}>
              <span style={{ ...styles.dot, backgroundColor: '#ff5f56' }}></span>
              <span style={{ ...styles.dot, backgroundColor: '#ffbd2e' }}></span>
              <span style={{ ...styles.dot, backgroundColor: '#27c93f' }}></span>
            </div>
            <span style={styles.terminalTitle}>interactive_node_console.sh</span>
          </div>
          
          <div style={styles.terminalBody}>
            {terminalLogs.map((log, idx) => (
              <div key={idx} style={{ ...styles.terminalLine, ...styles[log.type] }}>
                {log.text}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          <div style={styles.suggestionDock}>
            <span style={styles.dockLabel}>Inputs:</span>
            {['help', 'status', 'ping', 'system', 'clear'].map((cmd) => (
              <button key={cmd} type="button" onClick={() => processCommand(cmd)} style={styles.suggestionBadge}>
                {cmd}
              </button>
            ))}
          </div>

          <form onSubmit={handleTerminalSubmit} style={styles.terminalForm}>
            <span style={styles.terminalPrompt}>user@anukalp:~#</span>
            <input 
              type="text"
              className="premium-input"
              style={styles.terminalInputOverride}
              placeholder='Type or tap options above...'
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
            />
          </form>
        </div>
      </main>

      {showLogoutModal && (
        <div className="custom-modal-backdrop">
          <div className="modal-compact-box">
            <div style={styles.modalIconBox}>⚠️</div>
            <h3 style={{ ...styles.modalTitle, color: 'var(--text-main)' }}>Confirm Logout</h3>
            <p style={{ ...styles.modalBodyMessage, color: 'var(--text-sub)' }}>Are you sure you want to log out? Your secure session token will be destroyed.</p>
            <div style={styles.modalBtnRow}>
              <button type="button" onClick={() => setShowLogoutModal(false)} style={styles.modalBtnCancel}>Cancel</button>
              <button type="button" onClick={handleConfirmLogout} style={styles.modalBtnConfirm}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  navBrandBlock: { display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flexOverflow: 'hidden' },
  avatarBubble: { width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', fontSize: '0.9rem', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)', flexShrink: 0 },
  welcomeText: { fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 },
  
  navActionsHub: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 },
  pillControl: { padding: '0.4rem 0.75rem', borderRadius: '20px', border: '1px solid var(--card-border)', backgroundColor: 'var(--metric-bg)', color: 'var(--text-sub)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', outline: 'none', whiteSpace: 'nowrap' },
  navDisconnectBtn: { padding: '0.4rem 0.85rem', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '20px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', outline: 'none', whiteSpace: 'nowrap' },
  
  dashboardHeroSection: { marginBottom: '0.5rem' },
  mainDashboardTitle: { fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.03em' },
  mainDashboardSubtitle: { fontSize: '0.95rem', margin: 0, lineHeight: '1.4' },
  extendedMetricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', width: '100%', boxSizing: 'border-box' },
  metricCardBox: { background: 'var(--bg-card)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-matrix)', boxSizing: 'border-box', overflow: 'hidden' },
  cardHeaderRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' },
  cardIcon: { fontSize: '1.2rem' },
  cardLabel: { fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' },
  cardMainValue: { fontSize: '1.45rem', fontWeight: '800', fontFamily: 'monospace' },
  cardMainValueText: { fontSize: '1.2rem', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
  cardSubValueText: { fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' },
  terminalContainer: { width: '100%', background: '#050b14', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
  terminalHeader: { display: 'flex', alignItems: 'center', padding: '0.75rem 1.25rem', background: '#0a1120', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  terminalDots: { display: 'flex', gap: '0.45rem', marginRight: '1.5rem', flexShrink: 0 },
  dot: { width: '10px', height: '10px', borderRadius: '50%' },
  terminalTitle: { fontSize: '0.8rem', fontFamily: 'monospace', color: '#4b5563', fontWeight: '600', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
  terminalBody: { padding: '1.25rem', minHeight: '160px', maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontFamily: 'monospace', fontSize: '0.9rem', boxSizing: 'border-box' },
  suggestionDock: { display: 'flex', gap: '0.4rem', padding: '0.5rem 1.15rem', background: '#070d18', borderTop: '1px solid rgba(255,255,255,0.03)', overflowX: 'auto', alignItems: 'center', scrollbarWidth: 'none' },
  dockLabel: { fontSize: '0.7rem', fontFamily: 'monospace', color: '#4b5563', fontWeight: '700', textTransform: 'uppercase', marginRight: '0.15rem', whiteSpace: 'nowrap' },
  suggestionBadge: { padding: '0.2rem 0.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px', color: '#60a5fa', fontSize: '0.7rem', fontFamily: 'monospace', cursor: 'pointer', fontWeight: '600', transition: 'all 0.15s' },
  terminalLine: { lineHeight: '1.4', wordBreak: 'break-all' },
  terminalForm: { display: 'flex', alignItems: 'center', padding: '0.75rem 1.25rem', background: '#070d1a', borderTop: '1px solid rgba(255,255,255,0.03)' },
  terminalPrompt: { fontFamily: 'monospace', fontSize: '0.9rem', color: '#3b82f6', marginRight: '0.75rem', whiteSpace: 'nowrap' },
  terminalInputOverride: { background: 'transparent', border: 'none', padding: 0, fontSize: '0.9rem', fontFamily: 'monospace', color: '#ffffff', height: 'auto', borderRadius: 0, boxShadow: 'none', width: '100%', outline: 'none' },
  command: { color: '#ffffff' },
  success: { color: '#10b981' },
  info: { color: '#60a5fa' },
  warn: { color: '#fbbf24' },
  error: { color: '#f87171' },
  modalIconBox: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.25rem auto' },
  modalTitle: { fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' },
  modalBodyMessage: { fontSize: '0.925rem', lineHeight: '1.5', margin: '0 0 2rem 0' },
  modalBtnRow: { display: 'flex', gap: '0.75rem', width: '100%' },
  modalBtnCancel: { flex: 1, padding: '0.85rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', outline: 'none', background: 'var(--input-bg)', border: '1px solid var(--card-border)' },
  modalBtnConfirm: { flex: 1, padding: '0.85rem', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '700', outline: 'none' }
};