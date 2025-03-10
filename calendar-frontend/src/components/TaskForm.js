import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Form.css";
import { assignTaskToSprint } from "./api";

const TaskForm = ({ selectedTask, onTaskAdded, fetchTasks, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start: "",
    end: "",
    status: "",
    user_id: "",
    sprint_id: "",
    color: "#90EE90", // Default color light green
  });

  const [availableSprints, setAvailableSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);

  const fetchAvailableSprints = async () => {
    try {
      console.log("Fetching available sprints...");
      const [sprintsData] = await Promise.all([assignTaskToSprint()]);
      setAvailableSprints(sprintsData);
    } catch (error) {
      alert("Failed to fetch available sprints");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  useEffect(() => {
    fetchAvailableSprints();
  }, []);

  // Set selectedSprint to the first sprint in availableSprints
  // TODO: FIND ANOTHER WAY TO IMPLEMENT THIS
  useEffect(() => {
    if (!selectedSprint && availableSprints.length > 0) {
      setSelectedSprint(availableSprints[0]);
    }
  }, [availableSprints]);

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
        color: selectedTask.color || "#90EE90",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        start: "",
        end: "",
        status: "",
        user_id: "",
        sprint_id: "",
        color: "#90EE90",
      });
    }
  }, [selectedTask]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
      // Update existing task
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
        .catch(() => alert("Failed to update task"));
    } else {
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
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Start Date & Time:</label>
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
              min={selectedSprint ? formatDate(selectedSprint.start) : ""}
              max={selectedSprint ? formatDate(selectedSprint.end) : ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>End Date & Time:</label>
            <input
              type="datetime-local"
              name="end"
              value={formData.end}
              min={selectedSprint ? formatDate(selectedSprint.start) : ""}
              max={selectedSprint ? formatDate(selectedSprint.end) : ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Status:</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Sprint:</label>
            <select
              name="sprint_id"
              onChange={handleInputChange}
              onBlur={() =>
                setSelectedSprint(
                  availableSprints.find(
                    (sprint) => sprint.id == formData.sprint_id
                  )
                )
              }
              value={formData.sprint_id} // Previously selected sprint when editing
              required
            >
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
          </div>

          <div>
            <label>User:</label>
            <select
              name="user_id"
              onChange={handleInputChange}
              value={formData.user_id} // Previously selected user when editing
              required
            >
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
          </div>

          <div className="form-color">
            <label>Color:</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              required
            />
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
