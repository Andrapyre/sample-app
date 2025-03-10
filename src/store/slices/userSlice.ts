import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/models";

interface UserState {
  users: User[];
  loading: boolean;
}

const initialState: UserState = {
  users: [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      tenantIds: ["1", "2"],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      tenantIds: ["1"],
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      tenantIds: ["3"],
    },
  ],
  loading: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id,
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    addTenantToUser: (
      state,
      action: PayloadAction<{ userId: string; tenantId: string }>,
    ) => {
      const { userId, tenantId } = action.payload;
      const userIndex = state.users.findIndex((user) => user.id === userId);

      if (
        userIndex !== -1 &&
        !state.users[userIndex].tenantIds.includes(tenantId)
      ) {
        state.users[userIndex].tenantIds.push(tenantId);
      }
    },
    removeTenantFromUser: (
      state,
      action: PayloadAction<{ userId: string; tenantId: string }>,
    ) => {
      const { userId, tenantId } = action.payload;
      const userIndex = state.users.findIndex((user) => user.id === userId);

      if (userIndex !== -1) {
        state.users[userIndex].tenantIds = state.users[
          userIndex
        ].tenantIds.filter((id) => id !== tenantId);
      }
    },
  },
});

export const {
  setLoading,
  addUser,
  updateUser,
  deleteUser,
  addTenantToUser,
  removeTenantFromUser,
} = userSlice.actions;

export default userSlice.reducer;
