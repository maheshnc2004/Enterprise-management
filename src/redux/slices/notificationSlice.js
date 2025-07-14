// redux/slices/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: JSON.parse(localStorage.getItem('notifications')) || [],
  },
  
  reducers: {
    addNotification: (state, action) => {
      const newNotification = {
        id: Date.now(),
        message: action.payload.message,
        read: false,
        time: new Date().toLocaleString(),
        role: action.payload.role,
        type: action.payload.type,
      };
      state.notifications.unshift(newNotification);
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    markAsRead: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        state.notifications[index].read = true;
        localStorage.setItem('notifications', JSON.stringify(state.notifications));
      }
    },
    markAllAsReadForRole: (state, action) => {
  const role = action.payload;
  state.notifications = state.notifications.map((n) =>
    n.role === role && !n.read ? { ...n, read: true } : n
  );
  localStorage.setItem("notifications", JSON.stringify(state.notifications));
},

    clearNotifications: (state) => {
      state.notifications = [];
      localStorage.setItem('notifications', JSON.stringify([]));
    },
  },
});

export const { addNotification, markAsRead, markAllAsReadForRole, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;