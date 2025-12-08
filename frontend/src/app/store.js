import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from '../reducers/notificationReducer';
import userReducer from '../reducers/userReducer';
import usersReducer from '../reducers/usersReducer';


export default configureStore({
  reducer: {
    notification: notificationReducer,
    user: userReducer,
    users: usersReducer
  }
});
