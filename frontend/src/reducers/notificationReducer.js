import { createSlice } from '@reduxjs/toolkit';


const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    set(state, action) {
      return action.payload;
    },
    clear() {
      return null;
    }
  }
});

export const setNotification = (note, secods, isErrorMessage) => {
  return async dispatch => {
    dispatch(set({note, isErrorMessage}));
    setTimeout(() => {
      dispatch(clear());
    }, seconds * 1000);
  }
};
export const { set, clear } = notificationSlice.actions;
export default notificationSlice.reducer;
