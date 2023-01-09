import { createSlice } from '@reduxjs/toolkit';
import { IRequestReducerState } from '../states/IRequestReducerState';

export const requestSlice = createSlice({
  name: 'request',
  initialState: [
    // { در صورت نیاز در local storage ذخیره شود
    //   requestDetail: undefined,
    //   formGenDetail: undefined,
    // },
  ] as IRequestReducerState[],
  reducers: {
    handleAddRequest: (state, action) => {
      var result = action.payload;
      state.push(result);
    },
    handleResetRequest: (state) => {
      state.length = 0;
    },
  },
});

export const { handleAddRequest, handleResetRequest } = requestSlice.actions;

export default requestSlice.reducer;
