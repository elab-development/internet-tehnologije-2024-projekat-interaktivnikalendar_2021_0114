import { useEffect, useState } from "react";
import "../styles/Form.css";
import { useFetchActiveTeams } from "../hooks/teamHooks";
import axios from "axios";

const TaskForm = ({ selectedTask, onTaskAdded, fetchTasks, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start: "",
    end: "",
    status: "",
    user_id: "",
    sprint_id: "",
    priority: "",
    color: "#90EE90", // Default color light green
  });

  const [availableSprints, setAvailableSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectSprintChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, user_id: "" });
    setSelectedSprint(availableSprints.find((sprint) => sprint.id == value));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  function updateTask(selectedTask, formData, token) {
    axios
      .put(
        `http://127.0.0.1:8000/api/tasks/${selectedTask.id}`,
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        onTaskAdded(response.data);
        fetchTasks();
        onClose();
      })
      .catch((er) =>
        alert("Failed to update task: " + er.response.data.message)
      );
  }

  function addTask(formData, token) {
    axios
      .post(
        `http://127.0.0.1:8000/api/tasks`,
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        onTaskAdded(response.data);
        fetchTasks();
        onClose();
      })
      .catch((er) => {
        alert("Failed to add task: " + er.response.data.message);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Validate task start and end dates
    const taskStart = new Date(formData.start);
    const taskEnd = new Date(formData.end);
    const sprintStart = new Date(selectedSprint.start);
    const sprintEnd = new Date(selectedSprint.end);

    if (taskStart < sprintStart || taskEnd > sprintEnd) {
      alert("Task start and end dates must be within the sprint period.");
      return;
    }

    if (selectedTask) {
      updateTask(selectedTask, formData, token);
    } else {
      addTask(formData, token);
    }
  };

  // Gets available sprints for user to choose from
  useFetchActiveTeams(setAvailableSprints);

  // Populate form data if we are editing an existing task
  useEffect(() => {
    if (selectedTask) {
      setFormData({
        name: selectedTask.title || "",
        description: selectedTask.extendedProps.description || "",
        start: formatDate(selectedTask.start),
        end: formatDate(selectedTask.end),
        status: selectedTask.extendedProps.status || "",
        user_id: selectedTask.extendedProps.user_id || "",
        sprint_id: selectedTask.extendedProps.sprint_id || "",
        priority: selectedTask.extendedProps.priority || "",
        color: selectedTask.color || "#90EE90",
      });
      setSelectedSprint(
        availableSprints.find(
          (sprint) => sprint.id == selectedTask.extendedProps.sprint_id
        )
      );
    }
  }, [availableSprints]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter task name"
              required
            />
          </label>

          <label>
            Description:
            <input
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter task description"
            />
          </label>

          <label>
            Sprint:
            <select
              name="sprint_id"
              value={formData.sprint_id}
              onChange={handleSelectSprintChange}
              required
            >
              {!formData.sprint_id && (
                <option value="" disabled hidden>
                  Select sprint
                </option>
              )}
              {(Array.isArray(availableSprints) ? availableSprints : []).map(
                (sprint) => {
                  return (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </option>
                  );
                }
              )}
            </select>
          </label>

          <label>
            Start:
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
              min={selectedSprint ? formatDate(selectedSprint.start) : ""}
              max={selectedSprint ? formatDate(selectedSprint.end) : ""}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            End:
            <input
              type="datetime-local"
              name="end"
              value={formData.end}
              min={selectedSprint ? formatDate(selectedSprint.start) : ""}
              max={selectedSprint ? formatDate(selectedSprint.end) : ""}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            User:
            <select
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              required
            >
              {!formData.user_id && selectedSprint && (
                <option value="" disabled hidden>
                  Select user
                </option>
              )}

              {!selectedSprint && (
                <option value="" disabled hidden>
                  Select sprint first
                </option>
              )}

              {selectedSprint &&
                (Array.isArray(selectedSprint.users)
                  ? selectedSprint.users
                  : []
                ).map((user) => {
                  return (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  );
                })}
            </select>
          </label>

          <div>
            <label>
              Status:
              <select
                type="text"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="" disabled hidden>
                  Select status
                </option>
                <option value="backlog">Backlog</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>

            <label>
              Priority:
              <select
                type="text"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="" disabled hidden>
                  Select priority
                </option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </label>

            <div className="form-color">
              <label>Color:</label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit">Add Task</button>
          <button type="button" className="close-button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
