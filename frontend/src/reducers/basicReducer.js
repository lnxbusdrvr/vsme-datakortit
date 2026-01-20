import { createSlice } from '@reduxjs/toolkit'

import basicService from '../services/basicService'

const slice = createSlice({
  name: 'basic',
  initialState: [],
  reducers: {
    set(state, { payload }) {
      return payload
    }
  }
})

const { set } = slice.actions

export const initializeBasic = () => {
  return async dispatch => {
    const data = await basicService.getAll()
    console.log(`basReducer: data: ${data}`)
    dispatch(set(data))
  }
}

export default slice.reducer
