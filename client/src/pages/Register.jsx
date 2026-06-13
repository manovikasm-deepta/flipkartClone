import { useEffect }         from 'react';
import { useForm }           from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch }       from 'react-redux';
import { registerUser, clearError } from '@/store/slices/authSlice';
import { useAuth }           from '@/hooks/useAuth';
import toast                 from 'react-hot-toast';

export default function Register() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { isAuthenticated, loading, error } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  useEffect(() => { return () => dispatch(clearError()); }, [dispatch]);

  async function onSubmit({ name, email, password, phone }) {
    const res = await dispatch(registerUser({ name, email, password, phone }));
    if (registerUser.fulfilled.match(res)) {
      toast.success('Account created! Welcome!');
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              {...register('name', { required: 'Name required' })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email required' })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password required',
                minLength: { value: 8, message: 'At least 8 characters' },
                pattern: {
                  value: /(?=.*[A-Z])(?=.*[0-9])/,
                  message: 'Must contain uppercase letter and number',
                },
              })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirm', {
                required: 'Please confirm password',
                validate: (v) => v === watch('password') || 'Passwords do not match',
              })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
