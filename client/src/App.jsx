import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import { initializeAuth, fetchMe } from '@/store/slices/authSlice';
import { fetchCart } from '@/store/slices/cartSlice';
import { fetchWishlistIds } from '@/store/slices/wishlistSlice';
import { useAuth } from '@/hooks/useAuth';

import Header      from '@/components/layout/Header';
import CategoryNav  from '@/components/layout/CategoryNav/index';
import Footer       from '@/components/layout/Footer';

import HomePage            from '@/pages/Home/index';
import ProductListingPage  from '@/pages/ProductListing/index';
import ProductDetailPage   from '@/pages/ProductDetail/index';
import CartPage             from '@/pages/Cart/index';
import CheckoutPage         from '@/pages/Checkout/index';
import OrderConfirmationPage from '@/pages/OrderConfirmation/index';
import OrderHistoryPage     from '@/pages/OrderHistory/index';
import OrderDetailPage      from '@/pages/OrderDetail';
import WishlistPage         from '@/pages/Wishlist/index';
import LoginPage            from '@/pages/Login/index';
import SignupPage           from '@/pages/Signup/index';
import NotFoundPage         from '@/pages/NotFound/index';

// ─── Layout: Header + Footer wrapper ─────────────────────────────────────────
function Layout() {
  const dispatch = useDispatch();
  const { token, isLoggedIn } = useAuth();

  useEffect(() => {
    const storedToken = localStorage.getItem('fk_token');
    if (!storedToken) {
      dispatch(initializeAuth()).then(() => {
        dispatch(fetchCart());
        dispatch(fetchWishlistIds());
      });
    } else {
      dispatch(fetchMe());
      dispatch(fetchCart());
      dispatch(fetchWishlistIds());
    }
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontSize: '14px' } }} />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <CategoryNav />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

// ─── Protected route ──────────────────────────────────────────────────────────
function ProtectedRoute() {
  const { isLoggedIn, hydrated } = useAuth();
  const location = useLocation();

  if (!hydrated) return null;
  if (!isLoggedIn) return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  return <Outlet />;
}

// ─── Router ───────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/',                          element: <HomePage /> },
      { path: '/products',                  element: <ProductListingPage /> },
      { path: '/product/:productId',        element: <ProductDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/cart',                            element: <CartPage /> },
          { path: '/checkout',                        element: <CheckoutPage /> },
          { path: '/order-confirmation/:orderId',     element: <OrderConfirmationPage /> },
          { path: '/orders',                          element: <OrderHistoryPage /> },
          { path: '/orders/:id',                      element: <OrderDetailPage /> },
          { path: '/wishlist',                        element: <WishlistPage /> },
          { path: '/addresses',                       element: <WishlistPage /> },
        ],
      },
      { path: '/login',  element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '*',       element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
