import React, { useState, useEffect} from "react";
import axios from "axios";
import "../styles/Form.css";

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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

useEffect(() => { 
  if(selectedTask){
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
  }else{
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
      .catch(() => alert("Failed to add task"));
      console.log(formData);

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
