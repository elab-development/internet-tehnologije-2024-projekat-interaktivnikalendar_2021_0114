import React, { forwardRef } from "react";

const TaskModal = forwardRef(({ task, onEdit, onDelete, onClose }, ref) => (
  <div className="modal-task" ref={ref}>
    <div className="modal-content-task">
      <h2>{task.title}</h2>
      <p>
        <strong>Description:</strong> {task.extendedProps.description}
      </p>
      <p>
        <strong>Status:</strong> {task.extendedProps.status}
      </p>
      <p>
        <strong>Start:</strong> {task.start.toLocaleString()}
      </p>
      <p>
        <strong>End:</strong> {task.end.toLocaleString()}
      </p>
      <button onClick={onEdit}>Edit Task</button>
      <button onClick={() => onDelete(task.id)}>Delete Task</button>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
));

export default TaskModal;
