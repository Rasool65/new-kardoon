import { createSlice } from '@reduxjs/toolkit';
import { IMessageReducerState } from '../states/IMessageReducerState';

export const messageSlice = createSlice({
  name: 'message',
  initialState: {
    // newMessage: '',
    newMessageCount: 0,
    showMessage: true,
  } as IMessageReducerState,
  reducers: {
    handleNewMessageCount: (state, action) => {
      state.newMessageCount = action.payload;
    },
    handleNewMessage: (state, action) => {
      state.newMessage = action.payload;
    },
    handleShowMessage: (state, action) => {
      state.showMessage = action.payload;
    },
  },
});
export const { handleNewMessageCount, handleNewMessage, handleShowMessage } = messageSlice.actions;
export default messageSlice.reducer;
