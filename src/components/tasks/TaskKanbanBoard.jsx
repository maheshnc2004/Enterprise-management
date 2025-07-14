import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { updateTaskStatus } from '../../redux/slices/taskSlice';

const columns = [
  { status: 'To Do', title: '📝 To Do' },
  { status: 'In Progress', title: '⏳ In Progress' },
  { status: 'Done', title: '✅ Done' },
];

const TaskKanbanBoard = ({ projectId }) => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);

  const filteredTasks = projectId
    ? tasks.filter((task) => task.projectId === projectId)
    : tasks;

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) return;

    dispatch(updateTaskStatus({ id: draggableId, status: destination.droppableId }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(({ status, title }) => {
          const tasksInColumn = filteredTasks.filter((task) => task.status === status);

          return (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white dark:bg-gray-800 p-4 rounded shadow min-h-[300px] flex flex-col"
                >
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{title}</h2>

                  <div className="space-y-2 flex-1">
                    {tasksInColumn.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskKanbanBoard;
