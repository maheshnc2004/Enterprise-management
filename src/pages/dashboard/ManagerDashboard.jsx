// src/pages/manager/ManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { addNotification } from "../../redux/slices/notificationSlice";
import { updateTaskStatus, addTask } from "../../redux/slices/taskSlice";
import { login } from "../../redux/slices/authSlice";

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { user: manager } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Normal" });
  const [expanded, setExpanded] = useState([]);

  const assignedProjects = projects.filter((p) => p.manager === manager.email);
  const columns = ["To Do", "In Progress", "Done"];

  useEffect(() => {
    const latestManager = users.find((u) => u.email === manager.email);
    if (latestManager && JSON.stringify(latestManager.projectIds) !== JSON.stringify(manager.projectIds)) {
      dispatch(login(latestManager));
    }
  }, [users, manager, dispatch]);

  useEffect(() => {
    tasks.forEach((task) => {
      const isMyProject = manager.projectIds?.includes(task.projectId);
      const updatedBy = task.lastUpdatedBy;
      const isEmployee = users.some((u) => u.email === updatedBy && u.role === "employee");
      if (isMyProject && isEmployee && !task.managerNotified) {
        dispatch(addNotification({ message: `🔄 '${task.title}' updated by ${updatedBy}`, role: "manager", type: "info" }));
        dispatch(updateTaskStatus({ id: task.id, managerNotified: true }));
      }
    });
  }, [tasks, manager.projectIds, dispatch, users]);

  const handleCreateTask = () => {
    if (!newTask.title.trim() || !selectedProjectId) return toast.error("Enter title and select project");
    dispatch(addTask({ id: Date.now().toString(), ...newTask, projectId: selectedProjectId, assignedTo: "", status: "To Do" }));
    setNewTask({ title: "", description: "", priority: "Normal" });
    toast.success("Task created");
  };

  const handleDragEnd = ({ destination, draggableId }) => {
    if (!destination) return;
    const taskId = draggableId.replace("task-", "");
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const destId = destination.droppableId;
    if (destId.startsWith("emp-")) {
      const email = destId.replace("emp-", "");
      dispatch(updateTaskStatus({ id: taskId, assignedTo: email, status: task.status }));
    } else {
      dispatch(updateTaskStatus({ id: taskId, status: destId, assignedTo: task.assignedTo }));
    }
  };

  const toggleProject = (id) => {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📊 Manager Dashboard</h1>
      {assignedProjects.length === 0 ? (
        <p>No projects assigned to you.</p>
      ) : (
        assignedProjects.map((project) => {
          const employees = users.filter(
            (u) => u.role === "employee" && u.projectIds?.includes(project.id)
          );
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const completed = projectTasks.filter((t) => t.status === "Done").length;
          const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
          const isOpen = expanded.includes(project.id);

          return (
            <div key={project.id} className="bg-white dark:bg-gray-800 p-5 rounded shadow mb-8">
              <div onClick={() => toggleProject(project.id)} className="cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">📌 {project.name}</h2>
                  <span className="text-sm text-gray-400">Progress: {progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-300 rounded-full mb-4">
                  <div
                    style={{ width: `${progress}%` }}
                    className={`h-full rounded-full ${progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                  ></div>
                </div>
              </div>

              {isOpen && (
                <>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <input
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Title"
                      className="px-3 py-1 border rounded dark:bg-gray-900 dark:border-gray-600"
                    />
                    <input
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Description"
                      className="px-3 py-1 border rounded dark:bg-gray-900 dark:border-gray-600"
                    />
                    <input
                      type="date"
                      value={newTask.dueDate || ""}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="px-3 py-1 border rounded dark:bg-gray-900 dark:border-gray-600"
                    />
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="px-3 py-1 border rounded dark:bg-gray-900 dark:border-gray-600"
                    >
                      <option>Low</option>
                      <option>Normal</option>
                      <option>High</option>
                    </select>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        handleCreateTask();
                      }}
                    >
                      ➕ Add Task
                    </button>
                  </div>

                  <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex gap-4 overflow-x-auto">
                      {columns.map((col) => (
                        <Droppable key={col} droppableId={col}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="bg-gray-100 dark:bg-gray-700 p-4 rounded w-72 flex-shrink-0"
                            >
                              <h3 className="font-semibold mb-2">{col}</h3>
                              {projectTasks
                                .filter((t) => t.status === col)
                                .map((task, index) => (
                                  <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`bg-white dark:bg-gray-800 p-3 rounded mb-2 shadow ${
                                          snapshot.isDragging ? "border border-blue-400" : ""
                                        }`}
                                      >
                                        <p className="font-semibold">{task.title}</p>
                                        <p className="text-sm text-gray-500">{task.description}</p>
                                        <p className="text-xs mt-1 text-blue-600">
                                          👤 {task.assignedTo || "Unassigned"}
                                        </p>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ))}
                    </div>

                    {/* Employee dropzones */}
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      {employees.map((emp) => (
                        <Droppable key={emp.email} droppableId={`emp-${emp.email}`}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="p-3 bg-white dark:bg-gray-800 rounded shadow border border-dashed border-blue-400"
                            >
                              <h4 className="font-semibold mb-2">👷 {emp.name} ({emp.email})</h4>
                              {projectTasks
                                .filter((t) => t.assignedTo === emp.email)
                                .map((task, index) => (
                                  <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-2"
                                      >
                                        {task.title}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ))}
                    </div>
                  </DragDropContext>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ManagerDashboard;
