import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../../redux/slices/taskSlice';
import toast from 'react-hot-toast';

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      dispatch(deleteTask(task.id));
      toast.success('Task deleted');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-IN');
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 dark:bg-gray-700 dark:text-white space-y-2 transition hover:shadow-md">
      <h3 className="font-semibold text-lg">{task.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>

      <div className="text-xs text-gray-500 dark:text-gray-300">
        📌 Priority: <span className="font-medium">{task.priority || 'Normal'}</span><br />
        🗓 Due: <span className="font-medium">{formatDate(task.dueDate)}</span><br />
        📍 Status: <span className="font-medium">{task.status || 'To Do'}</span>
      </div>

      <button
        onClick={handleDelete}
        className="text-xs text-red-600 hover:underline mt-2"
      >
        ❌ Delete Task
      </button>
    </div>
  );
};

export default TaskCard;
