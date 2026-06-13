import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './slices/authSlice';
import cartReducer     from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import checkoutReducer from './slices/checkoutSlice';

const store = configureStore({
  reducer: {
    auth:     authReducer,
    cart:     cartReducer,
    wishlist: wishlistReducer,
    checkout: checkoutReducer,
  },
});

export default store;
