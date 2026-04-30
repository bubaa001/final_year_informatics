import { useState } from 'react';
import { login } from './auth';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      // Optional: if rememberMe is true, you can store the refresh token differently
      onLogin();
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>🎓</span>
          <h2 style={styles.title}>Welcome back!</h2>
          <p style={styles.subtitle}>Log in to your learning portal</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}

          <label style={styles.label}>Username or Email</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your username or email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <div style={styles.options}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" style={styles.link}>Forgot password?</a>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div style={styles.footer}>
          <span>Don't have an account?</span>
          <button
            style={styles.textButton}
            onClick={onSwitchToRegister}
          >
            Create one
          </button>
        </div>

        <div style={styles.roleNote}>
          <small>🧑‍🏫 Teachers & 🧑‍🎓 Students use the same login</small>
        </div>
      </div>
    </div>
  );
}

// Styles object – you can extract to a CSS file later
const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Segoe UI, system-ui, sans-serif',
  },
  card: {
    background: 'white',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    width: '100%',
    maxWidth: '400px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  icon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '0.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1.75rem',
    color: '#1a202c',
  },
  subtitle: {
    margin: '0.25rem 0 0',
    color: '#718096',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 600,
    marginBottom: '0.25rem',
    color: '#2d3748',
    fontSize: '0.9rem',
  },
  input: {
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.2s',
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: '#4a5568',
  },
  link: {
    color: '#4f46e5',
    textDecoration: 'none',
  },
  button: {
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    color: '#4a5568',
    fontSize: '0.95rem',
  },
  textButton: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: '0.25rem',
    fontSize: '0.95rem',
  },
  error: {
    background: '#fff5f5',
    color: '#c53030',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    borderLeft: '4px solid #fc8181',
    fontSize: '0.9rem',
  },
  roleNote: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#a0aec0',
  },
};