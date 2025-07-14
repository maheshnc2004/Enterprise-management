import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../../redux/slices/notificationSlice";
import { updateTaskStatus } from "../../redux/slices/taskSlice";
import toast from "react-hot-toast";
import { CheckCircle, Clock, MessageSquare, ClipboardList } from "lucide-react";

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { user: employee } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);

  const activeTasks = tasks.filter(
    (task) => task.assignedTo === employee.email && task.status !== "Done"
  );
  const completedTasks = tasks.filter(
    (task) => task.assignedTo === employee.email && task.status === "Done"
  );

  const [editingComments, setEditingComments] = useState({});

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTaskStatus({
      id: taskId,
      status: newStatus,
      lastUpdatedBy: employee.email,
      managerNotified: false,
    }));
  };

  const handleCommentChange = (taskId, value) => {
    setEditingComments((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleCommentSubmit = (taskId) => {
    if (editingComments[taskId] !== undefined) {
      dispatch(updateTaskStatus({ id: taskId, comments: editingComments[taskId] }));
      toast.success("Comment updated");
    }
  };

  useEffect(() => {
    tasks.forEach((task) => {
      if (
        task.assignedTo === employee.email &&
        task.status === "Done" &&
        task.comments &&
        !task.notifiedForCompletion
      ) {
        dispatch(
          addNotification({
            message: `✅ Task '${task.title}' marked as completed. 🗒️ Manager's Comment: "${task.comments}"`,
            role: "employee",
            type: "info",
          })
        );

        dispatch(updateTaskStatus({ id: task.id, notifiedForCompletion: true }));
      }
    });
  }, [tasks, employee.email, dispatch]);

  return (
    <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">👨‍💼 Welcome, {employee.name || employee.email}</h1>
        <p className="text-gray-500 dark:text-gray-300">Track and manage your assigned tasks.</p>
      </div>

      {/* Task Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <ClipboardList className="mx-auto text-blue-600 dark:text-blue-400" />
          <h4 className="text-xl font-bold mt-2">{activeTasks.length}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Tasks</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <CheckCircle className="mx-auto text-green-600 dark:text-green-400" />
          <h4 className="text-xl font-bold mt-2">{completedTasks.length}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
        </div>
        {/* Add more widgets here if needed */}
      </div>

      {/* Active Tasks */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">📝 Active Tasks</h2>

        {activeTasks.length > 0 ? (
          <ul className="space-y-5">
            {activeTasks.map((task) => (
              <li
                key={task.id}
                className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{task.description}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    <Clock className="inline mr-1" size={14} />
                    {task.dueDate || "No due date"}
                  </div>
                </div>

                {/* Comment */}
                <div className="mt-3">
                  <label className="text-sm font-medium flex items-center gap-1 mb-1">
                    <MessageSquare size={14} /> Comment:
                  </label>
                  <textarea
                    value={editingComments[task.id] ?? task.comments ?? ""}
                    onChange={(e) => handleCommentChange(task.id, e.target.value)}
                    rows={2}
                    className="w-full p-2 border rounded text-sm bg-white dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    placeholder="Write a comment..."
                  />
                  <button
                    onClick={() => handleCommentSubmit(task.id)}
                    disabled={editingComments[task.id] === task.comments}
                    className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    💾 Save Comment
                  </button>
                </div>

                {/* Status */}
                <div className="mt-3">
                  <label className="text-sm font-medium mr-2">Status:</label>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="border px-3 py-1 text-sm rounded bg-white dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    {/* No "Done" to prevent self-completion */}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">No active tasks assigned.</p>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-green-600">✅ Completed Tasks</h2>
          <ul className="space-y-3">
            {completedTasks.map((task) => (
              <li
                key={task.id}
                className="p-3 rounded border bg-green-50 dark:bg-green-900 dark:border-green-700"
              >
                <h4 className="font-semibold">{task.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-300">{task.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
