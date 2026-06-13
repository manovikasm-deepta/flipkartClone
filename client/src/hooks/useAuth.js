import { useSelector } from 'react-redux';

export function useAuth() {
  const { user, token, isLoggedIn, loading, error, hydrated } = useSelector((s) => s.auth);
  return { user, token, isLoggedIn, loading, error, hydrated, isAuthenticated: isLoggedIn };
}
