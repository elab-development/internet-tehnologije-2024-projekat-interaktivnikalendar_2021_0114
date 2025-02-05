import React, { useState } from "react";
import axios from "axios";
import "../styles/Form.css";

const TaskForm = ({ onTaskAdded, fetchTasks, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start: "",
    end: "",
    status:"",
    user_id:"",
    sprint_id:"",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

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
        onTaskAdded(response.data.task);
        fetchTasks();
        setFormData({ name: "", description:"", start: "", end: "" , status:"", user_id:"", sprint_id:""});
        onClose();
      })
      .catch(() => alert("Failed to add task"));
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
              required
            />
          </div>
          <div>
            <label>Start Date & Time:</label>
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
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
            <label>User:</label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Sprint:</label>
            <input
              type="text"
              name="sprint_id"
              value={formData.sprint_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Add Task</button>
          <button type="button" className="close-button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;