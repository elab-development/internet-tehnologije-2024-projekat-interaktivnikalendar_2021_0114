import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Form.css";
import { formatDateForSprint } from "./utils";

const SprintForm = ({
  selectedSprint,
  onSprintAdded,
  fetchSprints,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    color: "#0B0BFF", // Default color
  });


  useEffect(() => {
    if (selectedSprint) {
      setFormData({
        name: selectedSprint.title || "",
        start: formatDateForSprint(selectedSprint.start),
        end: formatDateForSprint(selectedSprint.end),
        color: selectedSprint.color || "#0B0BFF",
      });
    } else {
      setFormData({
        name: "",
        start: "",
        end: "",
        color: "#0B0BFF",
      });
    }
  }, [selectedSprint]);
  //console.log(selectedSprint);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (selectedSprint) {
      axios
        .put(
          `http://127.0.0.1:8000/api/sprints/${selectedSprint.id}`,
          { ...formData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          onSprintAdded(response.data);
          fetchSprints();
          onClose();
        })
        .catch(() => alert("Failed to update sprint"));
    } else {
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
          onSprintAdded(response.data);
          fetchSprints();
          onClose();
        })
        .catch(() => alert("Failed to add sprint"));
    }
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
              min={formData.start}
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
