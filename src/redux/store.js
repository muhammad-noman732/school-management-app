import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import classReducer from './classSlice';
import settingReducer from './settingsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    classes: classReducer,
    settings : settingReducer
  },
});

export default store;
