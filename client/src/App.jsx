import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
// Will be added later:
// import AuthPage from './pages/AuthPage/AuthPage';
// import ChatPage from './pages/ChatPage/ChatPage';
import styles from './styles/App.module.css';
import AuthPage from './pages/AuthPage/AuthPage';
import ChatScreen from "./pages/ChatScreen/ChatScreen";
import projectLogo from './assets/project-logo.png'


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
          <Route path="/auth" element={<AuthPage />} /> 
          <Route path="/chat" element={<ChatScreen />} /> 
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