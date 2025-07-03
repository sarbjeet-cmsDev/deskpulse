import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  // role: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  // admin: User | null;
  // isAdminLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  // admin: null,
  // isAdminLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // User login
    signIn: (state, action: PayloadAction<User>) => {
      if (action.payload.role === 'user' || action.payload.role === 'admin') {
        state.user = action.payload;
        state.isLoggedIn = true;
      }
    },
    // Admin login
    // adminSignIn: (state, action: PayloadAction<User>) => {
    //   if (action.payload.role === 'admin') {
    //     state.admin = action.payload;
    //     state.isAdminLoggedIn = true;
    //   }
    // },
    // Logout both
    signOut: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      // state.admin = null;
      // state.isAdminLoggedIn = false;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
