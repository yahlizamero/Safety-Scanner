import { useState, useEffect } from 'react'; // מחקנו את React, השארנו רק את ה-Hooks
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // הוספנו את זה בשביל התיקון
import './AuthPage.css';
import { signUp, login } from '../../services/authService';

const AuthPage = ({ onLogin }) => {
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(false); 
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // אפקט החלקיקים
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { // הוספנו async
    e.preventDefault();

    if (!isLogin) {
      try {
        const result = await signUp({
          fullName: formData.name,
          email: formData.email,
          password: formData.password
        });

        alert("Account created successfully!");
        if (onLogin) onLogin({ name: formData.name, email: formData.email, id: result.userId });
        navigate('/chat');
      } catch (err) {
        alert(err.message); // יציג הודעה אם למשל האימייל כבר קיים
      }
    } else {
      // --- Login Logic ---
      try {
        const result = await login({
          email: formData.email,
          password: formData.password
        });

        console.log("Login Success:", result);
        
        if (onLogin) {
          onLogin({ 
            name: result.user.fullName, 
            email: result.user.email, 
            id: result.user.id 
          });
        }
        
        navigate('/chat');
      } catch (err) {
        alert(err.message); // יקפיץ "Invalid email or password" אם הפרטים שגויים
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
              onClick={() => setIsLogin(false)}
            >
              Sign up
            </button>
            <button 
              className={`tab ${isLogin ? 'active' : ''}`} 
              onClick={() => setIsLogin(true)}
            >
              Sign in
            </button>
          </div>

          <form onSubmit={handleSubmit}>
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
                    required={!isLogin} 
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
                required 
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
                required 
              />
            </div>

            <button className="primaryBtn" type="submit">
              {isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="switchLine">
            {isLogin ? "Don’t have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </div>
        </aside>

      </main>
    </div>
  );
};

// 👇 החלק הזה מתקן את השגיאה של onLogin missing in props validation
AuthPage.propTypes = {
  onLogin: PropTypes.func,
};

export default AuthPage;