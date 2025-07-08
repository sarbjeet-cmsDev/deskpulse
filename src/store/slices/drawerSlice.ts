import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DrawerType = string | null;

interface DrawerState {
  isOpen: boolean;
  size: "sm" | "md" | "lg" | "full";
  type: DrawerType;
}

const initialState: DrawerState = {
  isOpen: false,
  size: "md",
  type: null,
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    openDrawer: (
      state,
      action: PayloadAction<{
        type: string;
        size?: "sm" | "md" | "lg" | "full";
      }>
    ) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.size = action.payload.size || "md";
    },
    closeDrawer: (state) => {
      state.isOpen = false;
      state.type = null;
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
