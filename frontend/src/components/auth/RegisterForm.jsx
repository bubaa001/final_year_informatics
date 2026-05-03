import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const { register, error } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password2: formData.password,
      role: formData.role,
    });
    
    setIsSubmitting(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="auth-bg">
      {/* Floating decorative orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      {/* Animated grid lines overlay */}
      <svg
        className="animate-fade-in"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.03,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* University branding */}
      <div
        className="animate-fade-in-up"
        style={{
          position: 'absolute',
          top: '40px',
          textAlign: 'center',
          animationDelay: '0.1s',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🎓</div>
        <h1
          style={{
            color: '#fff',
            fontSize: '1.3rem',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            margin: 0,
          }}
        >
          University Portal
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '2px' }}>
          Knowledge Hub
        </p>
      </div>
      
      {/* Register Card */}
      <div
        className="glass-card animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px 32px',
          margin: '0 16px',
          animationDelay: '0.2s',
        }}
      >
        {/* Header */}
        <div className="stagger-children" style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 16px',
            }}
          >
            📝
          </div>
          <h2
            style={{
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: '0 0 6px',
              letterSpacing: '-0.3px',
            }}
          >
            Create Account
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 }}>
            Join the academic community
          </p>
        </div>
        
        {/* Error */}
        {error && (
          <div className="glass-error stagger-children" style={{ marginBottom: '18px' }}>
            <div>
              {typeof error === 'string' ? error :
                typeof error === 'object' && error?.password ? (
                  <span>{Array.isArray(error.password) ? error.password[0] : error.password}</span>
                ) : typeof error === 'object' && error?.email ? (
                  <span>{Array.isArray(error.email) ? error.email[0] : error.email}</span>
                ) : typeof error === 'object' && error?.username ? (
                  <span>{Array.isArray(error.username) ? error.username[0] : error.username}</span>
                ) : typeof error === 'object' && error?.error ? (
                  <span>{Array.isArray(error.error) ? error.error[0] : error.error}</span>
                ) : typeof error === 'object' && error?.detail ? (
                  <span>{Array.isArray(error.detail) ? error.detail[0] : error.detail}</span>
                ) : (
                  <span>Registration failed. Check the browser console for details.</span>
                )
              }
            </div>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Username */}
            <div>
              <label className="glass-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`glass-input ${formErrors.username ? 'error' : ''}`}
                value={formData.username}
                onChange={handleChange}
              />
              {formErrors.username && (
                <p className="glass-field-error">{formErrors.username}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="glass-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`glass-input ${formErrors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="glass-field-error">{formErrors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label className="glass-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`glass-input ${formErrors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="glass-field-error">{formErrors.password}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="glass-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`glass-input ${formErrors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPassword && (
                <p className="glass-field-error">{formErrors.confirmPassword}</p>
              )}
            </div>
            
            {/* Role */}
            <div>
              <label className="glass-label" htmlFor="role">
                I want to join as
              </label>
              <select
                id="role"
                name="role"
                required
                className={`glass-select ${formErrors.role ? 'error' : ''}`}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">🎓 Student</option>
                <option value="instructor">👨‍🏫 Instructor</option>
                <option value="admin">⚙️ Admin</option>
              </select>
              {formErrors.role && (
                <p className="glass-field-error">{formErrors.role}</p>
              )}
            </div>
            
            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="glass-btn"
              style={{ marginTop: '4px' }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg className="animate-spin" style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
        
        {/* Terms */}
        <div
          className="animate-fade-in"
          style={{
            textAlign: 'center',
            marginTop: '18px',
            animationDelay: '0.7s',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', lineHeight: 1.5 }}>
            By creating an account, you agree to our{' '}
            <a href="#" className="glass-link" style={{ fontSize: '0.75rem' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="glass-link" style={{ fontSize: '0.75rem' }}>Privacy Policy</a>
          </p>
        </div>
        
        {/* Divider */}
        <div className="glass-divider" style={{ margin: '20px 0' }}>
          <span>or continue with</span>
        </div>
        
        {/* Social placeholder */}
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            animationDelay: '0.8s',
          }}
        >
          {['G', 'T', 'M'].map((letter, i) => (
            <button
              key={letter}
              type="button"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
              title={['Google', 'GitHub', 'Microsoft'][i]}
            >
              {letter}
            </button>
          ))}
        </div>
        
        {/* Footer */}
        <div
          className="animate-fade-in"
          style={{
            textAlign: 'center',
            marginTop: '20px',
            animationDelay: '0.9s',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" className="glass-link" style={{ fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
