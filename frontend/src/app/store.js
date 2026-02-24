import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from '../reducers/notificationReducer';
import userReducer from '../reducers/userReducer';
import usersReducer from '../reducers/usersReducer';
import basicReducer from '../reducers/basicReducer';
import answersReducer from '../reducers/answersReducer';


export default configureStore({
  reducer: {
    notification: notificationReducer,
    basic: basicReducer,
    user: userReducer,
    users: usersReducer,
    answers: answersReducer
  }
});
