import { createSlice } from "@reduxjs/toolkit";

import storage from "../services/storageService";


const userSlice = createSlice({
  name: "user",
  initialState: storage.loadUser(),
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
