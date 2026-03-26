import { createSlice } from '@reduxjs/toolkit'
import { isEqual } from 'lodash';
import answersService from '../services/answersService'
import { notify } from '../reducers/notificationReducer';


const slice = createSlice({
  name: 'answers',
  initialState: [],
  reducers: {
    set(state, { payload }) {
      return payload
    },
    create(state, { payload }) {
      const id = payload.id
      const answer = state.find(a => a.id === id) || {}
      const changedAnswer = {
        ...answer,
        answer: answer.answer !== payload.answer
          ? payload.answer
          : answer.answer,
        groupAnswers: !isEqual(answer.groupAnswers, payload.groupAnswers)
          ? payload.groupAnswers
          : answer.groupAnswers
      }
      return state.map(a => a.id !== id ? a : changedAnswer)
    },
    update(state, { payload }) {
      const updatedAnswer = payload
      return state.map(u => (u.id === updatedAnswer.id ? updatedAnswer : u))
    },
    remove(state, { payload }) {
      return state.filter(a => a.id !== payload)
    }
  }
});

const { set, create, update, remove} = slice.actions;

export const initializeAnswers = () => {
  return async dispatch => {
    const data = await answersService.getAll()
    dispatch(set(data))
  }
};

export const createAnswer = (answer) => {
  return async dispatch => {
    try {
      const data = await answersService.createAnswer(answer)
      dispatch(create(data))
      dispatch(notify(`Vastaukset tallennettu onnistuneesti!`, 20, false));
      // action was successful
      return true;
    } catch (error) {
      // Handle backend error responses
      const errorMessage = error.response?.data?.error || error.message || 'Vastauksien luominen epäonnistui';
      dispatch(notify(errorMessage, 20, true));
      // action was not successful
      return false;
    }
  }
};

export const updateAnswer = (answerId, answer) => {
  return async dispatch => {
    try {
      const data = await answersService.updateAnswer(answerId, answer)
      dispatch(update(data))
      dispatch(notify(`Vastaus päivitetty onnistuneesti!`, 20, false));
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Vastauksen päivittäminen epäonnistui';
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
