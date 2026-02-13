import { createSlice } from '@reduxjs/toolkit'

import answersService from '../services/answersService'
import { notify } from '../reducers/notificationReducer';


const slice = createSlice({
  name: 'answers',
  initialState: [],
  reducers: {
    set(state, { payload }) {
      return payload
    },
    add(state, { payload }) {
      state.push(payload)
    }
  }
});

const { set, add} = slice.actions;

export const initializeAnswers = () => {
  return async dispatch => {
    const data = await answersService.getAll()
    dispatch(set(data))
  }
};

export const addAnswer = (answer) => {
  return async dispatch => {
    try {
      const data = await answersService.createAnswer(answer)
      dispatch(add(data))
      dispatch(notify(`Vastaukset luotu!`, 5, false));
      return true;
    } catch {
      dispatch(notify('Vastauksien luominen epäonnistui', 10, true));
      return false;
    }
  }
};

export default slice.reducer;
