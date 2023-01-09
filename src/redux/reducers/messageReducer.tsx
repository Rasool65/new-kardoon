import { createSlice } from '@reduxjs/toolkit';
import { IMessageReducerState } from '../states/IMessageReducerState';

const initialMessageCount = () => {
  const messageCount = localStorage.getItem('MessageUnread');
  return messageCount ? messageCount : 0;
};

const initialMessageBlogCount = () => {
  const blogMessageCount = localStorage.getItem('BlogUnread');
  return blogMessageCount ? blogMessageCount : 0;
};
const initialStatusMissions = () => {
  const item = localStorage.getItem('statusMissions');
  return item ? JSON.parse(item) : {};
};
const initialWalletBalance = () => {
  const walletBalance = localStorage.getItem('WalletBalance');
  return walletBalance ? walletBalance : 0;
};
export const messageSlice = createSlice({
  name: 'message',
  initialState: {
    // newMessage: '',
    walletBalance: initialWalletBalance(),
    newMessageCount: initialMessageCount(),
    statusMission: initialStatusMissions(),
    newMessageBlogCount: initialMessageBlogCount(),
    showMessage: true,
  } as IMessageReducerState,
  reducers: {
    handleNewMessageCount: (state, action) => {
      state.newMessageCount = action.payload;
      localStorage.setItem('MessageUnread', action.payload);
    },
    handleNewMessageBlogCount: (state, action) => {
      state.newMessageBlogCount = action.payload;
      localStorage.setItem('BlogUnread', action.payload);
    },
    handleNewMessage: (state, action) => {
      state.newMessage = action.payload;
    },
    handleShowMessage: (state, action) => {
      state.showMessage = action.payload;
    },
    handleStatusMission: (state, action) => {
      state.statusMission = action.payload;
      localStorage.setItem('statusMissions', JSON.stringify(action.payload));
    },
    handleWalletBalance: (state, action) => {
      state.walletBalance = action.payload;
      localStorage.setItem('WalletBalance', action.payload);
    },
  },
});
export const {
  handleNewMessageCount,
  handleNewMessage,
  handleShowMessage,
  handleNewMessageBlogCount,
  handleStatusMission,
  handleWalletBalance,
} = messageSlice.actions;
export default messageSlice.reducer;
