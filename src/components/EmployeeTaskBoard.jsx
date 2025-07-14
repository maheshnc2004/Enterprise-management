import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTaskStatus } from "../redux/slices/taskSlice";
import toast from "react-hot-toast";

const EmployeeTaskBoard = ({ projectId }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { tasks } = useSelector((state) => state.tasks);

  const employees = users.filter(
    (u) => u.role === "employee" && u.projectIds?.includes(projectId)
  );

  const [taskEdits, setTaskEdits] = useState({});

  const handleFieldChange = (taskId, field, value) => {
    setTaskEdits((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value,
      },
    }));
  };

  const handleUpdate = (task) => {
    const edits = taskEdits[task.id];
    if (!edits) return;

    const updatedStatus = edits.status ?? task.status;
    const updatedComment = edits.comments ?? task.comments;

    dispatch(
      updateTaskStatus({
        id: task.id,
        status: updatedStatus,
        comments: updatedComment,
      })
    );
    toast.success("Task updated");

    setTaskEdits((prev) => {
      const updated = { ...prev };
      delete updated[task.id];
      return updated;
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-IN");
  };

  return (
    <div className="space-y-6">
      {employees.length === 0 ? (
        <p className="text-gray-500 italic">
          No employees assigned to this project.
        </p>
      ) : (
        employees.map((emp) => {
          const empTasks = tasks.filter(
            (task) =>
              task.assignedTo === emp.email && task.projectId === projectId
          );

          return (
            <div
              key={emp.id}
              className="border rounded p-4 shadow bg-white dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold mb-2">
                👷 {emp.name} ({emp.email})
              </h3>

              {empTasks.length === 0 ? (
                <p className="text-sm italic text-gray-400">No tasks assigned</p>
              ) : (
                <ul className="space-y-4">
                  {empTasks.map((task) => {
                    const edits = taskEdits[task.id] || {};
                    const hasChanges =
                      edits.status !== undefined || edits.comments !== undefined;

                    return (
                      <li
                        key={task.id}
                        className="border p-3 rounded dark:border-gray-700 space-y-2"
                      >
                        <div>
                          <strong>{task.title}</strong> —{" "}
                          <span className="italic text-sm">{task.status}</span>
                          <p className="text-sm text-gray-600">
                            {task.description}
                          </p>
                          <p className="text-sm">
                            📅 Due: {formatDate(task.dueDate)}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium mr-2">Status:</label>
                          <select
                            value={edits.status ?? task.status}
                            onChange={(e) =>
                              handleFieldChange(task.id, "status", e.target.value)
                            }
                            className="border px-2 py-1 rounded text-sm"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 mt-2">
                            Comment:
                          </label>
                          <textarea
                            value={edits.comments ?? task.comments ?? ""}
                            onChange={(e) =>
                              handleFieldChange(task.id, "comments", e.target.value)
                            }
                            rows={2}
                            className="w-full border rounded p-2 text-sm"
                            placeholder="Add or edit comment"
                          />
                        </div>

                        <div className="text-right">
                          <button
                            onClick={() => handleUpdate(task)}
                            disabled={!hasChanges}
                            className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
                          >
                            💾 Update Task
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default EmployeeTaskBoard;
