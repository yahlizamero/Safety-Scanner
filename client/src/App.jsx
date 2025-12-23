import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
// Will be added later:
// import AuthPage from './pages/AuthPage/AuthPage';
// import ChatPage from './pages/ChatPage/ChatPage';
import styles from './styles/App.module.css';

import projectLogo from './assets/project-logo.png'

function AuthPlaceholder() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <h2>Sign in</h2>
      <p>This page will be implemented by another teammate.</p>
    </div>
  );
}

function ChatPlaceholder() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <h2>Chat</h2>
      <p>This page will be implemented by another teammate.</p>
    </div>
  );
}

function App() {
  return (
      <div className={styles.app}>
        <header className={styles.appHeader}>
          <div className={styles.headerInner}>
            <div className={styles.brand}>
              <img src={projectLogo} alt="SafetyScanner logo" className={styles.appLogo} />
            </div>
            
            <nav className={styles.appNav}>
              <Link to="/" className={styles.appLink}>Home</Link>
              <Link to="/auth" className={styles.signInButton}>Sign in</Link>
            </nav>
          </div>
        </header>

        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPlaceholder />} />
            <Route path="/chat" element={<ChatPlaceholder />} />
          </Routes>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.copyright}>
              &copy; 2026 SafetyScanner. All rights reserved.
            </div>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
              <a href="#" className={styles.footerLink}>Terms of Service</a>
              <a href="#" className={styles.footerLink}>Contact</a>
            </div>
          </div>
        </footer>
      </div>
  );
}

export default App;