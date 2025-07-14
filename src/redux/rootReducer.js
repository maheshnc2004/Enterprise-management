import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  projects: projectReducer,
  tasks: taskReducer,
});

export default rootReducer;
