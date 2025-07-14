import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';
import projectReducer from './slices/projectSlice';
import notificationReducer from './slices/notificationSlice';

const rootReducer = combineReducers({
  users: userReducer,
  auth: authReducer,
  tasks: taskReducer,
  projects: projectReducer,
  notifications: notificationReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const asyncDispatchMiddleware = storeAPI => next => action => {
  let syncActivityFinished = false;
  let actionQueue = [];

  const flushQueue = () => {
    actionQueue.forEach(a => storeAPI.dispatch(a));
    actionQueue = [];
  };

  const asyncDispatch = a => actionQueue.push(a);

  const actionWithAsyncDispatch = Object.assign({}, action, { asyncDispatch });

  const res = next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
  return res;
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(asyncDispatchMiddleware),
});

export const persistor = persistStore(store);
