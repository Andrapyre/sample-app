import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tenant } from "@/types/models";

interface TenantState {
  tenants: Tenant[];
  loading: boolean;
}

const initialState: TenantState = {
  tenants: [
    {
      id: "1",
      name: "Acme Corporation",
      userIds: ["1", "2"],
    },
    {
      id: "2",
      name: "Globex Industries",
      userIds: ["1"],
    },
    {
      id: "3",
      name: "Initech",
      userIds: ["3"],
    },
  ],
  loading: false,
};

const tenantSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addTenant: (state, action: PayloadAction<Tenant>) => {
      state.tenants.push(action.payload);
    },
    updateTenant: (state, action: PayloadAction<Tenant>) => {
      const index = state.tenants.findIndex(
        (tenant) => tenant.id === action.payload.id,
      );
      if (index !== -1) {
        state.tenants[index] = action.payload;
      }
    },
    deleteTenant: (state, action: PayloadAction<string>) => {
      state.tenants = state.tenants.filter(
        (tenant) => tenant.id !== action.payload,
      );
    },
    addUserToTenant: (
      state,
      action: PayloadAction<{ tenantId: string; userId: string }>,
    ) => {
      const { tenantId, userId } = action.payload;
      const tenantIndex = state.tenants.findIndex(
        (tenant) => tenant.id === tenantId,
      );

      if (
        tenantIndex !== -1 &&
        !state.tenants[tenantIndex].userIds.includes(userId)
      ) {
        state.tenants[tenantIndex].userIds.push(userId);
      }
    },
    removeUserFromTenant: (
      state,
      action: PayloadAction<{ tenantId: string; userId: string }>,
    ) => {
      const { tenantId, userId } = action.payload;
      const tenantIndex = state.tenants.findIndex(
        (tenant) => tenant.id === tenantId,
      );

      if (tenantIndex !== -1) {
        state.tenants[tenantIndex].userIds = state.tenants[
          tenantIndex
        ].userIds.filter((id) => id !== userId);
      }
    },
  },
});

export const {
  setLoading,
  addTenant,
  updateTenant,
  deleteTenant,
  addUserToTenant,
  removeUserFromTenant,
} = tenantSlice.actions;

export default tenantSlice.reducer;
