import { createSlice } from '@reduxjs/toolkit'

import answersService from '../services/answersService'
import { notify } from '../reducers/notificationReducer';


const slice = createSlice({
  name: 'answers',
  initialState: [],
  reducers: {
    setAnswers(state, { payload }) {
      return payload
    },
    addAnswer(state, { payload }) {
      state.push(payload)
    }
  }
});

const { setAnswers, addAnswer } = slice.actions;

export const initializeAnswers = () => {
  return async dispatch => {
    const data = await answersService.getAll()
    dispatch(setAnswers(data))
  }
};

export const addAnswer = (object) => {
  return async dispatch => {
    try {
      const data = await answersService.addAnswer(object)
      dispatch(addAnswer(data))
      dispatch(notify(`Vastaus luotu!`, 5, false));
      return true;
    } catch {
      dispatch(notify('Vastauksen luominen onnistui', 10, true));
      return false;
    }
  }
};

export default slice.reducer;
