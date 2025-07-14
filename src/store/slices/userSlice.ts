// store/slices/userSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import UserService from "@/service/user.service";
import { IUser } from "@/service/adminUser.service";

interface UserState {
  data: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<IUser>(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await UserService.getUserById();
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to load user"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk<IUser, Partial<IUser>>(
  "user/updateProfile",
  async (data: any, { rejectWithValue }) => {
    try {
      return await UserService.updateUser(data);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const updateUserAvatar = createAsyncThunk<IUser, File>(
  "user/updateAvatar",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      await UserService.uploadAvatar(file);
      const refreshed = await dispatch(fetchUserProfile()).unwrap(); // re-fetch
      return refreshed;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update avatar"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateUserAvatar.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserAvatar.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(updateUserAvatar.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
