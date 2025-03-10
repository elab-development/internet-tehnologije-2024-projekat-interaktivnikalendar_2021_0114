import { useState, useEffect } from "react";
import KanbanTicket from "../components/KanbanTicket";
import Sidebar from "../components/Sidebar";
import "../styles/Kanban.css";
import { fetchTasks, deleteTask } from "../components/api";
import { MdAdd } from "react-icons/md";

const Kanban = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let active = true;
    const getTasks = async () => {
      try {
        const tasksData = await fetchTasks();
        if (active) {
          setTasks(tasksData);
        }
      } catch (error) {
        if (active) {
          alert("Failed to fetch tasks");
        }
      }
    };
    getTasks();
    return () => {
      active = false;
    };
  }, []);

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
      <Sidebar />
      <div className="kanban-page">
        <h2>Kanban</h2>
        <p>
          Organize, prioritize, and track the progress of your tasks in a visual
          and intuitive way.
        </p>
        <hr />
        <div className="kanban-container">
          <div className="kanban-column">
            <div className="add-ticket" title="Add task">
              <MdAdd />
            </div>

            <span className="status">Backlog</span>
            {tasks
              .filter((task) => task.status === "Backlog")
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
              .filter((task) => task.status === "In progress")
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
              .filter((task) => task.status === "Done")
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
