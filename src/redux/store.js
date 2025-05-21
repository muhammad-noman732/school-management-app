import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import classReducer from './classSlice';
import settingReducer from './settingsSlice'
import assignmentReducer from './assignmentSlice';
import announcementReducer from './announcementSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    classes: classReducer,
    settings : settingReducer,
    assignments: assignmentReducer,
    announcements: announcementReducer
  },
});

export default store;
