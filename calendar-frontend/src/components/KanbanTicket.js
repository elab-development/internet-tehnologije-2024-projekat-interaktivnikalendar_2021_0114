import "../styles/KanbanTicket.css";
import { MdDelete, MdEdit } from "react-icons/md";

const KanbanTicket = ({ task, onDelete }) => {
  return (
    <div>
      <div className="ticket-container">
        <div className="ticket-header">
          <p>{task.name}</p>
        </div>
        <div className="ticket-body">
          <p>Assigned to: Jane Doe</p>
          <p>Due: {task.end.split(" ")[0]}</p>
          <p>
            Priority: <span className="ticket-priority">High</span>
          </p>
        </div>

        <div className="ticket-actions">
          <MdEdit className="ticket-button" title="Edit" />
          <MdDelete
            className="ticket-button"
            title="Delete"
            onClick={() => onDelete(task.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default KanbanTicket;
