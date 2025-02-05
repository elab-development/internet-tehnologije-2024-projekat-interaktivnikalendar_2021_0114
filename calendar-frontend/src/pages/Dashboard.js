import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "../components/Calendar";
import Sidebar from "../components/Sidebar";
import SprintForm from "../components/SprintForm";
import TaskForm from "../components/TaskForm";
import "../styles/Form.css";

const Dashboard = () => {
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    fetchSprints();
    fetchTasks();
  }, []);

  const fetchSprints = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/sprints", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setSprints(response.data))
      .catch(() => alert("Failed to fetch sprints"));
  };

  const fetchTasks = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setTasks(response.data))
      .catch(() => alert("Failed to fetch tasks"));
  };

  const handleSprintAdded = (newSprint) => {
    setSprints((prevSprints) => [...prevSprints, newSprint]);
    setShowSprintForm(false);
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowTaskForm(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="dashboard-container">
        <button onClick={() => setShowSprintForm(true)}>Create Sprint</button>
        {showSprintForm && (
          <SprintForm
            onSprintAdded={handleSprintAdded}
            fetchSprints={fetchSprints}
            fetchTasks={fetchTasks}
            onClose={() => setShowSprintForm(false)}
          />
        )}
        <button onClick={() => setShowTaskForm(true)}>Create Task</button>
        {showTaskForm && (
          <TaskForm
            onTaskAdded={handleTaskAdded}
            fetchTasks={fetchTasks}
            onClose={() => setShowTaskForm(false)}
          />
        )}
        <Calendar sprints={sprints} tasks={tasks} />
      </div>
    </div>
  );
};

export default Dashboard;

