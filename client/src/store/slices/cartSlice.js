import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '@/services/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try { const r = await cartService.getCart();    return r.data; }
  catch (err)  { return rejectWithValue(err.message); }
});

export const addToCart = createAsyncThunk('cart/add', async (payload, { rejectWithValue }) => {
  try { const r = await cartService.addToCart(payload); return r.data; }
  catch (err)  { return rejectWithValue(err.message); }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try { const r = await cartService.updateItem(itemId, { quantity }); return r.data; }
  catch (err)  { return rejectWithValue(err.message); }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try { const r = await cartService.removeItem(itemId); return r.data; }
  catch (err)  { return rejectWithValue(err.message); }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try { const r = await cartService.clearCart(); return r.data; }
  catch (err)  { return rejectWithValue(err.message); }
});

function applyCart(state, payload) {
  state.loading   = false;
  state.items     = payload?.items    ?? [];
  state.summary   = payload?.summary  ?? {};
  state.itemCount = payload?.summary?.itemCount ?? (payload?.items?.length ?? 0);
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], summary: {}, itemCount: 0, loading: false, error: null },
  reducers: {
    setCart(state, { payload }) { applyCart(state, payload); },
    clearCartState(state) {
      state.items     = [];
      state.summary   = {};
      state.itemCount = 0;
    },
  },
  extraReducers: (builder) => {
    [fetchCart, addToCart, updateCartItem, removeFromCart, clearCart].forEach((thunk) => {
      builder
        .addCase(thunk.pending,   (state) => { state.loading = true; state.error = null; })
        .addCase(thunk.fulfilled, (state, { payload }) => { applyCart(state, payload); })
        .addCase(thunk.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; });
    });
  },
});

export const { setCart, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
