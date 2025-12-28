import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import AuthPage from './pages/AuthPage/AuthPage';
import ChatScreen from "./pages/ChatScreen/ChatScreen";
import styles from './styles/App.module.css';
import projectLogo from './assets/project-logo.png';

function App() {
  // --- התיקון כאן: מחקנו את ה-setUser (החלק השני) כי הוא מיותר כרגע ---
  // במקום: const [currentUser, setUser] = ...
  // כתבנו רק:
  const [currentUser] = useState({ name: "dear", id: 1 });

  return (
      <div className={styles.app}>
        <header className={styles.appHeader}>
          <div className={styles.headerInner}>
            <div className={styles.brand}>
              <img src={projectLogo} alt="SafetyScanner logo" className={styles.appLogo} />
            </div>
            
            <nav className={styles.appNav}>
              <Link to="/" className={styles.appLink}>Home</Link>
              
              {!currentUser ? (
                <Link to="/auth" className={styles.signInButton}>Sign in</Link>
              ) : (
                <>
                  <Link to="/chat" className={styles.appLink} style={{color: '#e91e63', fontWeight: 'bold'}}>
                    My Chat
                  </Link>
                  <span className={styles.appLink} style={{cursor: 'default'}}>
                     | Hello, {currentUser.name}
                  </span>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} /> 
          <Route path="/chat" element={<ChatScreen user={currentUser} />} /> 
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