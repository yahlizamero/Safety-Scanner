import { useState } from 'react';
import styles from './AuthPage.module.css';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.headline}>Welcome Back</h2>
        <p style={{ color: 'rgba(31, 27, 36, 0.7)', marginBottom: '24px' }}>
          Please enter your details to sign in
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '14px', color: 'rgba(31, 27, 36, 0.6)' }}>
          {"Don't have an account? "} 
          <span 
            onClick={() => alert('Sign up page coming soon!')} 
            style={{ color: '#ff0080', cursor: 'pointer', fontWeight: '600' }}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;