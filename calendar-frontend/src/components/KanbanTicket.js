import "../styles/KanbanTicket.css";
import { MdDelete, MdEdit } from "react-icons/md";
import { Draggable } from "@hello-pangea/dnd";

const KanbanTicket = ({ task, onDelete, index }) => {
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

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return {
          "--priority-bg": "var(--red-higlight)",
          "--priority-color": "var(--red)",
        };
      case "Medium":
        return {
          "--priority-bg": "#FFECD6",
          "--priority-color": "#ff8800",
        };
      case "Low":
        return {
          "--priority-bg": "var(--grey-v2)",
          "--priority-color": "var(--dark-grey)",
        };
      default:
        return {};
    }
  };

  return (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          className="ticket-container"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="ticket-header">
            <p>{task.name}</p>
          </div>
          <div className="ticket-body">
            <p>Assigned to: {task.user ? task.user.name : "Unassigned"}</p>
            <p>Due: {formatDate(task.end)}</p>
            {task.priority && (
              <p>
                Priority:{" "}
                <span
                  className="ticket-priority"
                  style={getPriorityStyle(task.priority)}
                >
                  {task.priority}
                </span>
              </p>
            )}
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
      )}
    </Draggable>
  );
};

export default KanbanTicket;
