import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './AuthPage.css';
import { signUp, login } from '../../services/authService';

const AuthPage = ({ onLogin }) => {
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(false); 
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // --- מצבים חדשים להודעות (שינוי מינימלי) ---
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const createSpark = () => {
      const s = document.createElement("div");
      s.className = "spark";
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDuration = (Math.random() * 5 + 7) + "s";
      document.body.appendChild(s);
      
      setTimeout(() => {
        if(document.body.contains(s)) s.remove();
      }, 10000);
    };
    
    const interval = setInterval(createSpark, 500);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setError(''); // איפוס שגיאה כשמתחילים להקליד
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- ולידציה ב-FRONT (בדיקות לפני שליחה) ---
    if (!isLogin && !formData.name.trim()) {
      return setError("Please enter your full name");
    }
    if (!formData.email.includes('@')) {
      return setError("Please enter a valid email address");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (!isLogin) {
      try {
        const result = await signUp({
          fullName: formData.name,
          email: formData.email,
          password: formData.password
        });

        // --- הודעת הצלחה והשהיה ---
        setSuccess("Account created! Redirecting to chat...");
        if (onLogin) onLogin({ name: formData.name, email: formData.email, id: result.userId });
        
        setTimeout(() => {
          navigate('/chat');
        }, 2000); // השהייה של 2 שניות

      } catch (err) {
        setError(err.message); 
      }
    } else {
      try {
        const result = await login({
          email: formData.email,
          password: formData.password
        });

        // --- הודעת הצלחה והשהיה ---
        setSuccess("Welcome back! Redirecting...");
        
        if (onLogin) {
          onLogin({ 
            name: result.user.fullName, 
            email: result.user.email, 
            id: result.user.id 
          });
        }
        
        setTimeout(() => {
          navigate('/chat');
        }, 1500); // השהייה קצרה יותר להתחברות

      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="auth-page-container">
      <main className="wrap">
        
        <section className="hero">
          <div className="kicker">Teen Internet Safety • BeSafe</div>
          <h2 className="headline">Scan before you share.<br />Stay safer online.</h2>
          <p className="subhead">
            SafetyScanner checks photos and public presence before they go online.
            It flags identifying details and suggests quick fixes.
          </p>

          <div className="heroBullets">
            <div className="bullet">
              <div className="bulletIcon">✓</div>
              <div>
                <div className="bulletTitle">Detect risky details</div>
                <div className="bulletText">Logos, school names, plates, and location clues.</div>
              </div>
            </div>
            <div className="bullet">
              <div className="bulletIcon">🛡️</div>
              <div>
                <div className="bulletTitle">Build safer habits</div>
                <div className="bulletText">Clear warnings that teach you what to avoid next time.</div>
              </div>
            </div>
          </div>
        </section>

        <aside className="authCard">
          <div className="authTitle">{isLogin ? "Welcome back" : "Create your account"}</div>
          <div className="authNote">
            {isLogin ? "Sign in to continue to SafetyScanner." : "Secure sign-up to protect your presence."}
          </div>

          <div className="tabs">
            <button 
              className={`tab ${!isLogin ? 'active' : ''}`} 
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            >
              Sign up
            </button>
            <button 
              className={`tab ${isLogin ? 'active' : ''}`} 
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            >
              Sign in
            </button>
          </div>

          {/* --- הצגת ההודעות בתוך ה-Card --- */}
          {error && <div className="msg-box error-msg">{error}</div>}
          {success && <div className="msg-box success-msg">{success}</div>}

          {/* הוספת noValidate מבטלת את הבועות של הדפדפן */}
          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <>
                <label>Full name</label>
                <div className="inputWrap">
                  <span className="inputIcon">👤</span>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="e.g., Maya Cohen" 
                    value={formData.name}
                    onChange={handleChange} 
                  />
                </div>
              </>
            )}

            <label>Email</label>
            <div className="inputWrap">
              <span className="inputIcon">✉️</span>
              <input 
                type="email" 
                name="email" 
                placeholder="maya@example.com" 
                value={formData.email}
                onChange={handleChange} 
              />
            </div>

            <label>Password</label>
            <div className="inputWrap">
              <span className="inputIcon">🔒</span>
              <input 
                type="password" 
                name="password" 
                placeholder="******" 
                value={formData.password}
                onChange={handleChange} 
              />
            </div>

            <button className="primaryBtn" type="submit">
              {isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="switchLine">
            {isLogin ? "Don’t have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}>
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </div>
        </aside>

      </main>
    </div>
  );
};

AuthPage.propTypes = {
  onLogin: PropTypes.func,
};

export default AuthPage;