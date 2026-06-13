import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '@/services/api';

export const fetchWishlistIds = createAsyncThunk('wishlist/fetchIds', async (_, { rejectWithValue }) => {
  try { const r = await wishlistService.getWishlistIds(); return r.data; }
  catch (err)  { return rejectWithValue(err.message); }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, { getState, rejectWithValue }) => {
  const { productIds } = getState().wishlist;
  try {
    if (productIds.includes(productId)) {
      await wishlistService.removeFromWishlist(productId);
      return { action: 'removed', productId };
    } else {
      await wishlistService.addToWishlist(productId);
      return { action: 'added', productId };
    }
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { productIds: [], loading: false, error: null },
  reducers: {
    setWishlistIds(state, { payload }) {
      state.productIds = Array.isArray(payload) ? payload : [];
    },
    addToWishlist(state, { payload }) {
      if (!state.productIds.includes(payload)) state.productIds.push(payload);
    },
    removeFromWishlist(state, { payload }) {
      state.productIds = state.productIds.filter((id) => id !== payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistIds.pending,   (state) => { state.loading = true; })
      .addCase(fetchWishlistIds.fulfilled, (state, { payload }) => {
        state.loading    = false;
        state.productIds = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchWishlistIds.rejected,  (state) => { state.loading = false; })

      .addCase(toggleWishlist.pending,   (state) => { state.loading = true; })
      .addCase(toggleWishlist.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.action === 'added') {
          if (!state.productIds.includes(payload.productId)) state.productIds.push(payload.productId);
        } else {
          state.productIds = state.productIds.filter((id) => id !== payload.productId);
        }
      })
      .addCase(toggleWishlist.rejected,  (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      });
  },
});

export const { setWishlistIds, addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
