import NotificationService from "@/service/notification.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface NotificationState {
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  count: 0,
  loading: false,
  error: null
};

export const fetchNotificationCount = createAsyncThunk(
  "notifications/fetchCount",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res: any = await NotificationService.getNotificationByUserId(userId);

      return res?.notifications?.count || 0;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch notifications");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationCount(state) {
      state.count = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationCount.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload;
      })
      .addCase(fetchNotificationCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearNotificationCount } = notificationSlice.actions;
export default notificationSlice.reducer;