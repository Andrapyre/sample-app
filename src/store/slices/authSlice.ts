import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/types/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
}

const defaultUser: UserProfile = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  notifications: {
    userRegistered: true,
    tenantRegistered: true,
    cameraEvents: true,
  },
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      state.user = defaultUser;
      state.loading = false;
      localStorage.setItem("user", JSON.stringify(defaultUser));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      localStorage.removeItem("user");
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (!state.user) return;

      state.user = {
        ...state.user,
        ...action.payload,
      };

      localStorage.setItem("user", JSON.stringify(state.user));
    },
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<UserProfile["notifications"]>>,
    ) => {
      if (!state.user) return;

      state.user = {
        ...state.user,
        notifications: {
          ...state.user.notifications,
          ...action.payload,
        },
      };

      localStorage.setItem("user", JSON.stringify(state.user));
    },
    checkAuth: (state) => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        state.isAuthenticated = true;
        state.user = JSON.parse(savedUser);
        state.loading = false;
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      }
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  logout,
  updateUserProfile,
  updateNotificationSettings,
  checkAuth,
} = authSlice.actions;

export default authSlice.reducer;
