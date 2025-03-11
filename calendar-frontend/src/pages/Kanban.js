import { useState, useEffect } from "react";
import KanbanTicket from "../components/KanbanTicket";
import Sidebar from "../components/Sidebar";
import "../styles/Kanban.css";
import {
  fetchTasksBySprint,
  fetchPersonalTasksBySprint,
  deleteTask,
} from "../components/api";
import { MdAdd } from "react-icons/md";

const Kanban = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedView, setSelectedView] = useState("personal");
  const [sprintId, setSprintId] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const tasksData =
          selectedView === "personal"
            ? await fetchPersonalTasksBySprint(sprintId)
            : await fetchTasksBySprint(sprintId);
        if (Array.isArray(tasksData)) {
          setTasks(tasksData);
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
  }, [sprintId, selectedView]);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      alert("Failed to delete task");
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

        <div className="kanban-container">
          <div className="kanban-column">
            <div className="add-ticket" title="Add task">
              <MdAdd />
            </div>

            <span className="status">Backlog</span>
            {tasks
              .filter((task) => task.status.toLowerCase() === "backlog")
              .map((task) => (
                <KanbanTicket
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                />
              ))}
          </div>

          <div className="kanban-column">
            <div className="add-ticket" title="Add task">
              <MdAdd />
            </div>

            <span
              className="status"
              style={{ backgroundColor: "#DBECFA", color: "#5da9e9" }}
            >
              In Progress
            </span>
            {tasks
              .filter((task) => task.status.toLowerCase() === "in progress")
              .map((task) => (
                <KanbanTicket
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                />
              ))}
          </div>

          <div className="kanban-column">
            <div className="add-ticket" title="Add task">
              <MdAdd />
            </div>

            <span
              className="status"
              style={{ backgroundColor: "#EFFADB", color: "#80b918" }}
            >
              Done
            </span>
            {tasks
              .filter((task) => task.status.toLowerCase() === "done")
              .map((task) => (
                <KanbanTicket
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kanban;
