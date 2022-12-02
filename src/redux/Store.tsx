import { configureStore } from '@reduxjs/toolkit';
import RootReducer from './RootReducer';

//  export const Store = createStore(RootReducer, composeWithDevTools(applyMiddleware(thunk)));
export const Store = configureStore({
  reducer: RootReducer,
  middleware: (getDefaultMiddleware: any) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type RootStateType = ReturnType<typeof Store.getState>;

export default Store;
