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
    },
    remove(state, { payload }) {
      return state.filter(a => a.id !== payload)
    }
  }
});

const { set, add, remove} = slice.actions;

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
      dispatch(notify(`Vastaukset lähetetty onnistuneesti!`, 20, false));
      return true;
    } catch (error) {
      // Handle backend error responses
      const errorMessage = error.response?.data?.error || error.message || 'Vastauksien luominen epäonnistui';
      dispatch(notify(errorMessage, 20, true));
      return false;
    }
  }
};

export const deleteAnswer = (answerId) => {
  return async dispatch => {
    try {
      await answersService.deleteAnswer(answerId)
      dispatch(remove(answerId))
      dispatch(notify('Vastauksen poistettu onnistuneesti', 20, false));
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Vastauksen poistaminen epäonnistui';
      dispatch(notify(errorMessage, 20, true));
    }
  }
};

export default slice.reducer;
