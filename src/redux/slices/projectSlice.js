import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: JSON.parse(localStorage.getItem('projects')) || [],
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      const project = action.payload;
      if (typeof project.manager === 'object' && project.manager?.email) {
        project.manager = project.manager.email;
      }
      state.projects.push(project);
      localStorage.setItem('projects', JSON.stringify(state.projects));
      console.log('🛠 Added project:', project);
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        const proj = action.payload;
        if (typeof proj.manager === 'object' && proj.manager?.email) {
          proj.manager = proj.manager.email;
        }
        state.projects[index] = { ...state.projects[index], ...proj };
        localStorage.setItem('projects', JSON.stringify(state.projects));
      }
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      localStorage.setItem('projects', JSON.stringify(state.projects));
    },
  },
});

export const { addProject, updateProject, deleteProject } = projectSlice.actions;
export default projectSlice.reducer;
