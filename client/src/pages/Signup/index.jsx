import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { setCredentials } from '@/store/slices/authSlice';
import { fetchCart } from '@/store/slices/cartSlice';
import { fetchWishlistIds } from '@/store/slices/wishlistSlice';
import { authService } from '@/services/api';
import toast from 'react-hot-toast';
import styles from '../Login/Login.module.css';

function getStrength(pwd = '') {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#e53e3e', '#ff9f00', '#68d391', '#38a169'];
  return { score, label: labels[score] || '', color: colors[score] || '' };
}

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPwd, setShowPwd]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [pwdValue, setPwdValue]     = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const strength = getStrength(pwdValue);

  async function onSubmit(data) {
    setLoading(true);
    try {
      const r = await authService.register({ name: data.name, email: data.email, password: data.password });
      const { user, token } = r.data;
      dispatch(setCredentials({ user, token }));
      dispatch(fetchCart());
      dispatch(fetchWishlistIds());
      toast.success(`Welcome, ${user.name}!`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Left branding panel */}
        <div className={styles.leftPanel}>
          <div>
            <div className={styles.logo}>
              Flipkart
              <span className={styles.logoTag}>✦ Plus</span>
            </div>
          </div>
          <div>
            <div className={styles.tagline}>
              Join Millions of Happy Shoppers
            </div>
            <div className={styles.taglineHint}>
              Create your account and start exploring the best deals across electronics, fashion, and more.
            </div>
          </div>
          <div />
        </div>

        {/* Right form panel */}
        <div className={styles.rightPanel}>
          <div className={styles.formTitle}>Create account</div>
          <div className={styles.formSub}>Sign up for free — takes just a minute</div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
                type="text"
                placeholder="Manovikas M"
                autoComplete="name"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              />
              {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                })}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                    onChange: (e) => setPwdValue(e.target.value),
                  })}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  style={{ paddingRight: 40 }}
                />
                <button type="button" className={styles.pwdToggle} onClick={() => setShowPwd((v) => !v)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className={styles.fieldError}>{errors.password.message}</span>}

              {/* Password strength */}
              {pwdValue && (
                <div>
                  <div className={styles.strengthBar}>
                    <div
                      className={styles.strengthFill}
                      style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }}
                    />
                  </div>
                  <div className={styles.strengthLabel} style={{ color: strength.color }}>
                    {strength.label}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === watch('password') || 'Passwords do not match',
                })}
                type="password"
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              />
              {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword.message}</span>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className={styles.footerLink}>
            Already have an account?&nbsp;
            <Link to="/login" className={styles.link}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
