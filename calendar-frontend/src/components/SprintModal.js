import React, { forwardRef } from "react";

const SprintModal = forwardRef(({ sprint, onEdit, onDelete, onClose }, ref) => {
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
  };
 
  return (
 <div className="modal-sprint" ref={ref}>
    <div className="modal-content-sprint">
      <h2>{sprint.title}</h2>
      <p>
      <strong>Start:</strong> {formatDate(sprint.start)}
      </p>
      <p>
      <strong>End:</strong> {formatDate(sprint.end)}
      </p>
      <button onClick={onEdit}>Edit Sprint</button>
      <button onClick={() => onDelete(sprint.id)}>Delete Sprint</button>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);
});

export default SprintModal;
