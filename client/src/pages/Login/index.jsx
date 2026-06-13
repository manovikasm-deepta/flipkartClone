import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Info } from 'lucide-react';
import { setCredentials } from '@/store/slices/authSlice';
import { fetchCart } from '@/store/slices/cartSlice';
import { fetchWishlistIds } from '@/store/slices/wishlistSlice';
import { authService } from '@/services/api';
import toast from 'react-hot-toast';
import styles from './Login.module.css';

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const returnUrl = location.state?.returnUrl || '/';

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit(data) {
    setLoading(true);
    try {
      const r = await authService.login(data.email, data.password);
      const { user, token } = r.data;
      dispatch(setCredentials({ user, token }));
      dispatch(fetchCart());
      dispatch(fetchWishlistIds());
      toast.success(`Welcome back, ${user.name}!`);
      navigate(returnUrl, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
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
              Supercharge Your Shopping Experience
            </div>
            <div className={styles.taglineHint}>
              Get access to exclusive deals, priority delivery, and a seamless shopping journey.
            </div>
          </div>
          <div />
        </div>

        {/* Right form panel */}
        <div className={styles.rightPanel}>
          <div className={styles.formTitle}>Welcome back</div>
          <div className={styles.formSub}>Sign in to your account to continue</div>

          <div className={styles.demoBox}>
            <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              <strong>Demo credentials:</strong><br />
              demo@flipkart.com&nbsp;/&nbsp;Demo@1234
            </span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                })}
                type="email"
                placeholder="demo@flipkart.com"
                autoComplete="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  style={{ paddingRight: 40 }}
                />
                <button type="button" className={styles.pwdToggle} onClick={() => setShowPwd((v) => !v)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className={styles.fieldError}>{errors.password.message}</span>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <div className={styles.footerLink}>
            New to Flipkart?&nbsp;
            <Link to="/signup" className={styles.link}>Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
