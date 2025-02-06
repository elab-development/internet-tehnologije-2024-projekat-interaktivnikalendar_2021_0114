import React, { useState } from "react";
import axios from "axios";
import "../styles/Form.css";

const SprintForm = ({ onSprintAdded, fetchSprints, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
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
        `http://127.0.0.1:8000/api/sprints`,
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        onSprintAdded(response.data.sprint);
        fetchSprints();
        setFormData({ name: "", start: "", end: "" });
        onClose();
      })
      .catch(() => alert("Failed to add sprint"));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create Sprint</h2>
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
            <label>Start Date:</label>
            <input
              type="date"
              name="start"
              value={formData.start}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              name="end"
              value={formData.end}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Add Sprint</button>
          <button type="button" className="close-button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default SprintForm;
