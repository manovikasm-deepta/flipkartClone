import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { fetchCart } from '@/store/slices/cartSlice';
import { fetchWishlistIds } from '@/store/slices/wishlistSlice';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { isLoggedIn, loading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const returnUrl  = location.state?.returnUrl || '/';

  useEffect(() => { if (isLoggedIn) navigate(returnUrl, { replace: true }); }, [isLoggedIn]);
  useEffect(() => () => dispatch(clearError()), [dispatch]);

  async function onSubmit(data) {
    const res = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(res)) {
      toast.success(`Welcome back!`);
      dispatch(fetchCart());
      dispatch(fetchWishlistIds());
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--fk-page-bg)', display: 'flex', alignItems: 'stretch' }}>
      {/* Left panel */}
      <div style={{ width: 340, background: 'var(--fk-blue)', padding: '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Login</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            Get access to your Orders, Wishlist and Recommendations
          </p>
        </div>
        <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/login_img_c4a81e.png"
          alt="" style={{ width: '100%', marginTop: 24 }} onError={(e) => e.target.style.display = 'none'} />
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          {error && (
            <div style={{ marginBottom: 16, background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', padding: '10px 14px', borderRadius: 4, fontSize: 13 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: 20 }}>
              <input
                type="email"
                placeholder="Enter Email / Mobile number"
                {...register('email', { required: 'Email required' })}
                style={{ width: '100%', border: 'none', borderBottom: `2px solid ${errors.email ? '#e53e3e' : 'var(--fk-border)'}`, padding: '10px 0', fontSize: 15, outline: 'none', background: 'transparent' }}
              />
              {errors.email && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{errors.email.message}</p>}
            </div>

            <div style={{ marginBottom: 28 }}>
              <input
                type="password"
                placeholder="Enter Password"
                {...register('password', { required: 'Password required' })}
                style={{ width: '100%', border: 'none', borderBottom: `2px solid ${errors.password ? '#e53e3e' : 'var(--fk-border)'}`, padding: '10px 0', fontSize: 15, outline: 'none', background: 'transparent' }}
              />
              {errors.password && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{errors.password.message}</p>}
            </div>

            <p style={{ fontSize: 12, color: 'var(--fk-text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
              By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.
            </p>

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: 'var(--fk-buy-now)', color: '#fff', border: 'none', borderRadius: 4, padding: '14px', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', margin: '24px 0', fontSize: 13 }}>
            <span style={{ color: 'var(--fk-text-secondary)' }}>New to Flipkart? </span>
            <Link to="/signup" style={{ color: 'var(--fk-blue)', fontWeight: 700 }}>Create an account</Link>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--fk-text-secondary)' }}>
            Demo: <strong>demo@flipkart.com</strong> / <strong>Demo@1234</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
