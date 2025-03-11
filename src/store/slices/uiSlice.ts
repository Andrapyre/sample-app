import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

interface UIState {
  devicesMenuAnchor: string | null;
  userMenuAnchor: string | null;
}

const initialState: UIState = {
  devicesMenuAnchor: null,
  userMenuAnchor: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openDevicesMenu: (state, action: PayloadAction<string>) => {
      state.devicesMenuAnchor = action.payload;
    },
    closeDevicesMenu: (state) => {
      state.devicesMenuAnchor = null;
    },
    openUserMenu: (state, action: PayloadAction<string>) => {
      state.userMenuAnchor = action.payload;
    },
    closeUserMenu: (state) => {
      state.userMenuAnchor = null;
    },
  },
});

// Selectors
export const selectDevicesMenuAnchor = (state: RootState) => state.ui.devicesMenuAnchor;
export const selectUserMenuAnchor = (state: RootState) => state.ui.userMenuAnchor;

export const {
  openDevicesMenu,
  closeDevicesMenu,
  openUserMenu,
  closeUserMenu,
} = uiSlice.actions;

export default uiSlice.reducer; 