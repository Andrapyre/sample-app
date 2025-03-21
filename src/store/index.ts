import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import deviceReducer from "./slices/deviceSlice";
import userReducer from "./slices/userSlice";
import tenantReducer from "./slices/tenantSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: deviceReducer,
    users: userReducer,
    tenants: tenantReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
