import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  admin: User | null;
  isLoggedIn: boolean;
  isAdminLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  admin: null,
  isLoggedIn: false,
  isAdminLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // User login
    signIn: (state, action: PayloadAction<User>) => {
      if (action.payload.role === 'user') {
        state.user = action.payload;
        state.isLoggedIn = true;
      }
    },
    // Admin login
    adminSignIn: (state, action: PayloadAction<User>) => {
      if (action.payload.role === 'admin') {
        state.admin = action.payload;
        state.isAdminLoggedIn = true;
      }
    },
    // Logout both
    signOut: (state) => {
      state.user = null;
      state.admin = null;
      state.isLoggedIn = false;
      state.isAdminLoggedIn = false;
    },
  },
});

export const { signIn, adminSignIn, signOut } = authSlice.actions;
export default authSlice.reducer;
