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
      return state.concat(payload)
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

export const saveAnswer = (newAnswer) => {
  return async (dispatch, getState) => {
    const { user, answers: existingAnswers } = getState();

    // Find if an answer for this question already exists for this user
    const existingAnswer = existingAnswers.find(a =>
      a.questionId === newAnswer.questionId &&
      a.user.id === user.id &&
      a.moduleId === newAnswer.moduleId
    );

    try {
      if (existingAnswer) {
        // Merge groupAnswers if type is group
        let mergedAnswer = { ...newAnswer };
        if (newAnswer.type === 'group' && existingAnswer.groupAnswers) {
          let mergedGroupAnswers = [...existingAnswer.groupAnswers];

          newAnswer.groupAnswers.forEach(newGA => {
            const idx = mergedGroupAnswers.findIndex(ga => ga.subQuestionId === newGA.subQuestionId);
            if (idx >= 0) {
              // Merge values within the subQuestion
              mergedGroupAnswers[idx] = {
                ...mergedGroupAnswers[idx],
                values: {
                  ...mergedGroupAnswers[idx].values,
                  ...newGA.values
                }
              };
            } else {
              // Immutable way to add a new item
              mergedGroupAnswers = [...mergedGroupAnswers, newGA];
            }
          });
          mergedAnswer.groupAnswers = mergedGroupAnswers;
        }
        const data = await answersService.updateAnswer(existingAnswer.id, mergedAnswer);
        dispatch(update(data));
        return true;
      } else {
        const data = await answersService.createAnswer(newAnswer);
        dispatch(create(data));
        return true;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Vastauksen tallentaminen epäonnistui';
      dispatch(notify(errorMessage, 20, true));
      return false;
    }
  };
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
