export const API_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://dev.kardoon.ir/api' : 'https://devdemo.kardoon.ir/api';

export const API_SIGNALR_URL =
  process.env.NODE_ENV === 'production' ? 'https://broker.kardoon.ir' : 'https://brokerdemo.kardoon.ir';
