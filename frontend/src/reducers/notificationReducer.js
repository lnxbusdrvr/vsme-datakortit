import { createSlice } from '@reduxjs/toolkit';


const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return null;
    }
  }
});

export const notify = (note, seconds, isErrorMessage) => {
  return async dispatch => {
    dispatch(setNotification({note, isErrorMessage}));
    setTimeout(() => {
      dispatch(clearNotification());
    }, seconds * 1000);
  }
};
export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
