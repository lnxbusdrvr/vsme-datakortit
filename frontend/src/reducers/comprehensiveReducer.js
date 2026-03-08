import { createSlice } from '@reduxjs/toolkit'

import comprehensiveService from '../services/comprehensiveService'

const slice = createSlice({
  name: 'comprehensive',
  initialState: [],
  reducers: {
    set(state, { payload }) {
      return payload
    }
  }
})

const { set } = slice.actions

export const initializeComprehensive = () => {
  return async dispatch => {
    const data = await comprehensiveService.getAll()
    dispatch(set(data))
  }
}

export default slice.reducer
