import "../styles/KanbanTicket.css";
import { MdDelete, MdEdit } from "react-icons/md";

const KanbanTicket = ({ task, onDelete }) => {
  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString.replace(" ", "T")).toLocaleString(
      "en-GB",
      options
    );
  };
  return (
    <div>
      <div className="ticket-container">
        <div className="ticket-header">
          <p>{task.name}</p>
        </div>
        <div className="ticket-body">
          <p>Assigned to: {task.user ? task.user.name : "Unassigned"}</p>
          <p>Due: {formatDate(task.end)}</p>
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
