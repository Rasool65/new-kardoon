import { createSlice } from '@reduxjs/toolkit';
import { IThemeReducerState } from '../states/IThemeReducerState';

const initial_Color = () => {
  var themeColor = localStorage.getItem('color') || 'red';
  const root = document.documentElement;
  switch (themeColor) {
    case 'blue':
      root?.style.setProperty('--master-color', '#11acdf');
      root?.style.setProperty('--master-dark-color', '#007399');
      root?.style.setProperty('--master-superlight-color', '#c7f1ff');
      root?.style.setProperty('--master-light-color', '#DDE0F1');
      break;
    case 'red':
      root?.style.setProperty('--master-color', '#CC0041');
      root?.style.setProperty('--master-dark-color', '#91002e');
      root?.style.setProperty('--master-superlight-color', '#ffe3ec');
      root?.style.setProperty('--master-light-color', '#ffdde8');
      break;
    default: //red
  }
  return localStorage.getItem('color') || 'red';
};
const initial_Font = () => {
  var themeFont = Number(localStorage.getItem('font')) || 14;
  const root = document.documentElement;
  switch (themeFont) {
    case 12:
      root?.style.setProperty('--fs-xss', '0.5rem');
      root?.style.setProperty('--fs-xs', '0.65rem');
      root?.style.setProperty('--fs-sm', '0.65rem');
      root?.style.setProperty('--fs-base', '0.75rem');
      root?.style.setProperty('--fs-lg', '1rem');
      root?.style.setProperty('--fs-xl', '1.25rem');
      root?.style.setProperty('--fs-xxl', '1.5rem');
      break;
    case 14:
      root?.style.setProperty('--fs-xss', '0.65rem');
      root?.style.setProperty('--fs-xs', '0.75rem');
      root?.style.setProperty('--fs-sm', '0.75rem');
      root?.style.setProperty('--fs-base', '0.85rem');
      root?.style.setProperty('--fs-lg', '1.085rem');
      root?.style.setProperty('--fs-xl', '1.40rem');
      root?.style.setProperty('--fs-xxl', '1.70rem');
      break;
    case 16:
      root?.style.setProperty('--fs-xss', '0.70rem');
      root?.style.setProperty('--fs-xs', '0.75rem');
      root?.style.setProperty('--fs-sm', '0.87rem');
      root?.style.setProperty('--fs-base', '1rem');
      root?.style.setProperty('--fs-lg', '1.125rem');
      root?.style.setProperty('--fs-xl', '1.5rem');
      root?.style.setProperty('--fs-xxl', '1.875rem');
      break;
  }
  return localStorage.getItem('font') || 14;
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    color: initial_Color(),
    font: initial_Font(),
  } as IThemeReducerState,
  reducers: {
    color: (state, action) => {
      var result = action.payload;
      localStorage.setItem('color', result);
      state.color = result;
    },
    font: (state, action) => {
      var result = action.payload;
      localStorage.setItem('font', result);
      state.font = result;
    },
  },
});

export const { color, font } = themeSlice.actions;

export default themeSlice.reducer;
