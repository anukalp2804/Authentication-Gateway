import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logoutUser, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  
  // Platform Core System States
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [latency, setLatency] = useState(22);

  // 📝 STATE A: INTERACTIVE SINGLE-OPEN FAQ ACCORDION STATE
  // Tracks index of the active row; if selected again, resets to null to collapse it
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);

  // 🤖 STATE B: BOTTOM-LEFT CORNER FLOATING AI CHAT BOT STATES
  const [isBotWindowOpen, setIsBotWindowOpen] = useState(false);
  const [chatLogs, setChatLogs] = useState([
    { text: `Hello ${user?.firstName || 'User'}! I am your node assistant. Tap an option below to audit parameters.`, isBot: true }
  ]);
  
  const chatEndRef = useRef(null);

  // Static FAQ Mock Array Definitions
  const faqDataset = [
    { q: "How does the HttpOnly Session Token safeguard work?", a: "The backend encapsulates the JWT string within a secure HttpOnly cookie wrapper. This ensures client side JavaScript strings (like document.cookie commands) cannot extract or manipulate the session keys." },
    { q: "What is the purpose of the Two-Way Navigation Gates?", a: "React router checking hooks run active state loops inside the Login and Registration routes. If an authenticated user triggers a back command, the app intercepts the history stack and bounces them safely back to this Workspace dashboard." },
    { q: "How can I deploy modifications to production?", a: "Commit your updated code modules securely using your local workspace shell terminal, pull down the stable baseline configuration updates, and trigger 'git push origin main' to deliver backup revisions to GitHub." }
  ];

  // Automated System Loops
  useEffect(() => {
    const timeTimer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    const latencyTimer = setInterval(() => setLatency(Math.floor(Math.random() * (28 - 16 + 1)) + 16), 3000);
    return () => {
      clearInterval(timeTimer);
      clearInterval(latencyTimer);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLogs]);

  const handleConfirmLogout = async () => {
    try {
      await logoutUser();
      setShowLogoutModal(false);
      window.location.replace('/login');
    } catch (err) {
      console.error("Logout sequence failure:", err);
    }
  };

  const handleFaqToggle = (index) => {
    // ✅ ACCORDION FIX: If matching index clicked, set to null (close it), else switch to the new selection
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  // Chatbot Shortcut Response Processor
  const handleBotOptionClick = (question, standardAnswer) => {
    const updatedLogs = [
      ...chatLogs,
      { text: question, isBot: false },
      { text: standardAnswer, isBot: true }
    ];
    setChatLogs(updatedLogs);
  };

  return (
    <div className="dashboard-layout-root">
      
      {/* 🧭 LOCKED STICKY CONTROLLER HEAD NAVBAR ROW */}
      <nav className="dashboard-top-navbar">
        {/* ✅ THE FIX: Wrapper container constraints alignment to stop edge-stretching */}
        <div className="nav-container">
          
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

        </div>
      </nav>

      {/* 🎛️ MAIN CANVAS DESCRIPTIONS */}
      <main className="dashboard-main-content-canvas">
        <div style={styles.dashboardHeroSection}>
          <h1 style={{ ...styles.mainDashboardTitle, color: 'var(--text-main)' }}>Workspace Dashboard</h1>
          <p style={{ ...styles.mainDashboardSubtitle, color: 'var(--text-sub)' }}>Secure parameters overview mapping for backend environment verification streams.</p>
        </div>

        {/* METRICS ROW GRID CARD CONTAINER */}
        <div className="extended-metrics-grid-style" style={styles.extendedMetricsGrid}>
          <div style={styles.metricCardBox}>
            <div style={styles.cardHeaderRow}>
              <span style={styles.cardIcon}>🛡️</span>
              <span style={{ ...styles.cardLabel, color: 'var(--text-sub)' }}>Security Engine</span>
            </div>
            <div style={{ ...styles.cardMainValue, color: 'var(--text-main)' }}>JWT Token Verified</div>
            <div style={{ ...styles.cardSubValueText, color: 'var(--text-sub)' }}>HttpOnly Cookie Protected</div>
          </div>

          <div style={styles.metricCardBox}>
            <div style={styles.cardHeaderRow}>
              <span style={styles.cardIcon}>⚡</span>
              <span style={{ ...styles.cardLabel, color: 'var(--text-sub)' }}>Network Ping</span>
            </div>
            <div style={{ ...styles.cardMainValue, color: '#10b981' }}>{latency} ms</div>
            <div style={{ ...styles.cardSubValueText, color: 'var(--text-sub)' }}>Active Express Pipeline</div>
          </div>

          <div style={styles.metricCardBox}>
            <div style={styles.cardHeaderRow}>
              <span style={styles.cardIcon}>🕒</span>
              <span style={{ ...styles.cardLabel, color: 'var(--text-sub)' }}>Sync Time</span>
            </div>
            <div style={{ ...styles.cardMainValue, color: 'var(--text-main)' }}>{currentTime}</div>
            <div style={{ ...styles.cardSubValueText, color: 'var(--text-sub)' }}>Server Time Horizon</div>
          </div>
        </div>

        {/* ==========================================================================
           ✨ 1. NEW COMPONENT INTEGRATION: INTERACTIVE COLLAPSIBLE FAQ ACCORDION
           ========================================================================== */}
        <div className="faq-wrapper-block">
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>Platform Core Metrics FAQ</h3>
          
          {faqDataset.map((faq, idx) => {
            const isOpen = activeFaqIndex === idx;
            return (
              <div key={idx} className="faq-node-row">
                <button 
                  type="button" 
                  className="faq-header-trigger" 
                  onClick={() => handleFaqToggle(idx)}
                >
                  <span>{faq.q}</span>
                  <span className="faq-toggle-icon" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                    ➕
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-body-content">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* ==========================================================================
         ✨ 2. NEW COMPONENT INTEGRATION: LEFT DOWN SIDE FLOATING CHAT BOT WINDOW
         ========================================================================== */}
      <div className="bot-floating-container">
        {isBotWindowOpen && (
          <div className="bot-chat-window-frame">
            <div className="bot-window-header">
              <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff' }}>🤖 Platform Assistant</span>
              <button 
                type="button" 
                onClick={() => setIsBotWindowOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>
            
            <div className="bot-window-scroller">
              {chatLogs.map((chat, idx) => (
                <div 
                  key={idx} 
                  className={`bot-msg-bubble ${chat.isBot ? 'bot-msg-system' : 'bot-msg-user'}`}
                >
                  {chat.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="bot-options-grid-row">
              <button 
                type="button" 
                className="bot-option-badge-btn"
                onClick={() => handleBotOptionClick("Status check?", "Node system configurations are 100% operational.")}
              >
                Status Check
              </button>
              <button 
                type="button" 
                className="bot-option-badge-btn"
                onClick={() => handleBotOptionClick("Clear Chat logs?", "Logs cleared context memory baseline.")}
              >
                Wipe Logs
              </button>
              <button 
                type="button" 
                className="bot-option-badge-btn"
                onClick={() => handleBotOptionClick("System port?", "Express is listening securely on Localhost port 5000.")}
              >
                View Port
              </button>
            </div>
          </div>
        )}

        {/* Main Floating Bubble Toggle Button */}
        <button 
          type="button" 
          className="bot-trigger-bubble"
          onClick={() => setIsBotWindowOpen(!isBotWindowOpen)}
        >
          {isBotWindowOpen ? '💬' : '🤖'}
        </button>
      </div>

      {/* SYSTEM CONFIRM DISCONNECT DIALOG MODAL BOX */}
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
  navBrandBlock: { display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, overflow: 'hidden' },
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
  modalIconBox: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', items: 'center', margin: '0 auto 1.25rem auto' },
  modalTitle: { fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' },
  modalBodyMessage: { fontSize: '0.925rem', lineHeight: '1.5', margin: '0 0 2rem 0' },
  modalBtnRow: { display: 'flex', gap: '0.75rem', width: '100%' },
  modalBtnCancel: { flex: 1, padding: '0.85rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', outline: 'none', background: 'var(--input-bg)', border: '1px solid var(--card-border)' },
  modalBtnConfirm: { flex: 1, padding: '0.85rem', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '700', outline: 'none' }
};