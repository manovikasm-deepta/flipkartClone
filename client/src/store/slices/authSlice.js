import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/api';

function persist(user, token) {
  localStorage.setItem('fk_token', token);
  localStorage.setItem('fk_user', JSON.stringify(user));
}

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.getDefaultUser();
      return result.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authService.login(credentials);
      return result.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await authService.register(payload);
      return result.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.getMe();
      return result.data;
    } catch {
      return rejectWithValue(null);
    }
  }
);

const storedUser  = (() => { try { return JSON.parse(localStorage.getItem('fk_user')); } catch { return null; } })();
const storedToken = localStorage.getItem('fk_token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:      storedUser,
    token:     storedToken,
    isLoggedIn: !!storedToken,
    loading:   false,
    error:     null,
    hydrated:  false,
  },
  reducers: {
    setCredentials(state, { payload }) {
      state.user      = payload.user;
      state.token     = payload.token;
      state.isLoggedIn= true;
      persist(payload.user, payload.token);
    },
    logout(state) {
      state.user      = null;
      state.token     = null;
      state.isLoggedIn= false;
      state.hydrated  = true;
      localStorage.removeItem('fk_token');
      localStorage.removeItem('fk_user');
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending  = (state)        => { state.loading = true;  state.error = null; };
    const rejected = (state, action)=> { state.loading = false; state.error = action.payload; };
    const fulfilled= (state, action)=> {
      state.loading   = false;
      state.user      = action.payload.user;
      state.token     = action.payload.token;
      state.isLoggedIn= true;
      state.hydrated  = true;
      persist(action.payload.user, action.payload.token);
    };

    builder
      .addCase(initializeAuth.pending,   pending)
      .addCase(initializeAuth.fulfilled, fulfilled)
      .addCase(initializeAuth.rejected,  (state, action) => {
        state.loading  = false;
        state.error    = action.payload;
        state.hydrated = true;
      })

      .addCase(loginUser.pending,   pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected,  rejected)

      .addCase(registerUser.pending,   pending)
      .addCase(registerUser.fulfilled, fulfilled)
      .addCase(registerUser.rejected,  rejected)

      .addCase(fetchMe.pending,   (state) => { state.hydrated = false; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user     = action.payload.user ?? action.payload;
        state.hydrated = true;
        state.isLoggedIn = true;
      })
      .addCase(fetchMe.rejected,  (state) => {
        state.user      = null;
        state.token     = null;
        state.isLoggedIn= false;
        state.hydrated  = true;
        localStorage.removeItem('fk_token');
        localStorage.removeItem('fk_user');
      });
  },
});

export const { setCredentials, logout, setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;
