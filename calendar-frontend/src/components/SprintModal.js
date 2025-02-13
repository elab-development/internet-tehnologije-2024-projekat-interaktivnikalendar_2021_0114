import React from "react";

const SprintModal = ({ sprint, onEdit, onDelete, onClose }) => (
  <div className="modal-sprint">
    <div className="modal-content-sprint">
      <h2>{sprint.title}</h2>
      <p><strong>Start:</strong> {new Date(sprint.start).toISOString().split("T")[0]}</p>
      <p><strong>End:</strong> {new Date(sprint.end).toISOString().split("T")[0]}</p>
      <button onClick={onEdit}>Edit Sprint</button>
      <button onClick={() => onDelete(sprint.id)}>Delete Sprint</button>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

export default SprintModal;