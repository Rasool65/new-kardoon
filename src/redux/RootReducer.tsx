import authenticationReducer from './reducers/authenticationReducer';
import messageReducer from './reducers/messageReducer';
import requestReducer from './reducers/requestReducer';
import themeReducer from './reducers/themeReducer';

export const RootReducer = {
  authentication: authenticationReducer,
  Request: requestReducer,
  message: messageReducer,
  theme: themeReducer,
};

export default RootReducer;
