// import { createSlice } from '@reduxjs/toolkit';
// import { IRouteReducerState } from '../states/IRouteReducerState';

// const getBoolean = (value: any) => (value === 'true' ? true : false);

// export const routeSlice = createSlice({
//   name: 'route',
//   initialState: {
//     planned: localStorage.getItem('planned') ?? 'off',
//     driver: getBoolean(localStorage.getItem('driver')),
//     actual: getBoolean(localStorage.getItem('actual')),
//   } as IRouteReducerState,
//   reducers: {
//     setPlannedRoute: (state, action) => {
//       state.planned = action.payload;
//     },
//     setDriverRoute: (state, action) => {
//       state.driver = action.payload;
//     },
//     setActualRoute: (state, action) => {
//       state.actual = action.payload;
//     },
//   },
// });

// export const { setPlannedRoute, setDriverRoute, setActualRoute } = routeSlice.actions;

// export default routeSlice.reducer;
