
// redux/slices/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    updateTaskStatus: (state, action) => {
      const { id, status, assignedTo, dueDate, ...rest } = action.payload;
      const task = state.tasks.find((t) => t.id === id);
      if (task) {
        if (status !== undefined) task.status = status;
        if (assignedTo !== undefined) task.assignedTo = assignedTo;
        if (dueDate !== undefined) task.dueDate = dueDate;
        Object.assign(task, rest);
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter((t) => t.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    deleteTasksByProjectId: (state, action) => {
      const projectId = action.payload;
      state.tasks = state.tasks.filter((t) => t.projectId !== projectId);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
  },
});

export const {
  addTask,
  updateTaskStatus,
  deleteTask,
  deleteTasksByProjectId,
} = taskSlice.actions;

export default taskSlice.reducer;