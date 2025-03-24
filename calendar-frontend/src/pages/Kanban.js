import { useState, useEffect } from "react";
import KanbanTicket from "../components/KanbanTicket";
import Sidebar from "../components/Sidebar";
import "../styles/Kanban.css";
import {
  fetchTasksBySprint,
  fetchPersonalTasksBySprint,
  deleteTask,
  updateTaskStatusAndOrder,
} from "../components/api";
import { MdAdd } from "react-icons/md";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TaskForm from "../components/TaskForm";

const Kanban = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedView, setSelectedView] = useState("personal");
  const [sprintId, setSprintId] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Tells task form to make a new task but we use this because we need status and sprint_id to be filled in when opening the form
  const [isNewKanbanTask, setIsNewKanbanTask] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const tasksData =
          selectedView === "personal"
            ? await fetchPersonalTasksBySprint(sprintId)
            : await fetchTasksBySprint(sprintId);
        if (Array.isArray(tasksData)) {
          setTasks(tasksData.sort((a, b) => a.order - b.order));
        } else {
          console.error("Unexpected response format:", tasksData);
        }
      } catch (error) {
        alert("Failed to fetch tasks");
      }
    };

    if (sprintId) {
      getTasks();
    }
  }, [sprintId, selectedView, refresh]);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      alert("Failed to delete task");
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowTaskForm(false);
    setRefresh((prev) => !prev);
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setSelectedTask({
      id: taskToEdit.id,
      title: taskToEdit.name,
      start: taskToEdit.start,
      end: taskToEdit.end,
      color: taskToEdit.color,
      extendedProps: {
        description: taskToEdit.description,
        status: taskToEdit.status,
        user_id: taskToEdit.user_id,
        sprint_id: taskToEdit.sprint_id,
        priority: taskToEdit.priority,
      },
    });
    setIsNewKanbanTask(false);
    setShowTaskForm(true);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const movedTask = tasks.find((task) => task.id.toString() === draggableId);
    if (!movedTask) return;

    // Create a new array of tasks without mutating the original state
    let newTasks = tasks.map((task) => {
      if (task.id === movedTask.id) {
        return {
          ...task,
          status: destination.droppableId,
          order: destination.index,
        };
      }
      // Adjust order of other tasks in the same column
      if (task.status === source.droppableId) {
        if (task.order > source.index) {
          return { ...task, order: task.order - 1 };
        }
      }
      if (task.status === destination.droppableId) {
        if (task.order >= destination.index) {
          return { ...task, order: task.order + 1 };
        }
      }
      return task;
    });

    // Sort by order to maintain correct structure
    newTasks = newTasks.sort((a, b) => a.order - b.order);

    setTasks(newTasks);

    try {
      await updateTaskStatusAndOrder(
        movedTask.id,
        destination.droppableId,
        destination.index
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setSprintId={setSprintId} />
      <div className="kanban-page">
        <h2>Kanban</h2>
        <p>
          Organize, prioritize, and track the progress of your tasks in a visual
          and intuitive way.
        </p>
        <hr />

        <div className="kanban-view">
          <button
            className={`kanban-view-btn ${
              selectedView === "personal" ? "kanban-selected-view" : ""
            }`}
            onClick={() => setSelectedView("personal")}
          >
            Personal
          </button>
          <button
            className={`kanban-view-btn ${
              selectedView === "shared" ? "kanban-selected-view" : ""
            }`}
            onClick={() => setSelectedView("shared")}
          >
            Shared
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-container">
            <Droppable droppableId="backlog">
              {(provided) => (
                <div
                  className="kanban-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div
                    className="add-ticket"
                    title="Add task"
                    onClick={() => {
                      setSelectedTask({
                        extendedProps: {
                          status: "backlog",
                          sprint_id: sprintId || "",
                        },
                      });
                      setShowTaskForm(true);
                      setIsNewKanbanTask(true);
                    }}
                  >
                    <MdAdd />
                  </div>

                  <span className="status">Backlog</span>
                  {tasks
                    .filter(
                      (task) =>
                        task.status && task.status.toLowerCase() === "backlog"
                    )
                    .sort((a, b) => a.order - b.order) // Sort tasks by order
                    .map((task, index) => (
                      <KanbanTicket
                        key={task.id}
                        task={task}
                        onDelete={handleDelete}
                        onEdit={handleEditTask}
                        index={index}
                      />
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="in progress">
              {(provided) => (
                <div
                  className="kanban-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div
                    className="add-ticket"
                    title="Add task"
                    onClick={() => {
                      setSelectedTask({
                        extendedProps: {
                          status: "in progress",
                          sprint_id: sprintId || "",
                        },
                      });
                      setShowTaskForm(true);
                      setIsNewKanbanTask(true);
                    }}
                  >
                    <MdAdd />
                  </div>

                  <span
                    className="status"
                    style={{ backgroundColor: "#DBECFA", color: "#5da9e9" }}
                  >
                    In Progress
                  </span>
                  {tasks
                    .filter(
                      (task) =>
                        task.status &&
                        task.status.toLowerCase() === "in progress"
                    )
                    .sort((a, b) => a.order - b.order) // Sort tasks by order
                    .map((task, index) => (
                      <KanbanTicket
                        key={task.id}
                        task={task}
                        onDelete={handleDelete}
                        onEdit={handleEditTask}
                        index={index}
                      />
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="done">
              {(provided) => (
                <div
                  className="kanban-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div
                    className="add-ticket"
                    title="Add task"
                    onClick={() => {
                      setSelectedTask({
                        extendedProps: {
                          status: "done",
                          sprint_id: sprintId || "",
                        },
                      });
                      setShowTaskForm(true);
                      setIsNewKanbanTask(true);
                    }}
                  >
                    <MdAdd />
                  </div>

                  <span
                    className="status"
                    style={{ backgroundColor: "#EFFADB", color: "#80b918" }}
                  >
                    Done
                  </span>
                  {tasks
                    .filter(
                      (task) =>
                        task.status && task.status.toLowerCase() === "done"
                    )
                    .sort((a, b) => a.order - b.order) // Sort tasks by order
                    .map((task, index) => (
                      <KanbanTicket
                        key={task.id}
                        task={task}
                        onDelete={handleDelete}
                        onEdit={handleEditTask}
                        index={index}
                      />
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>

      {showTaskForm && (
        <TaskForm
          selectedTask={selectedTask}
          onTaskAdded={handleTaskAdded}
          onClose={() => {
            setShowTaskForm(false);
          }}
          newKanbanTask={isNewKanbanTask}
        />
      )}
    </div>
  );
};

export default Kanban;
