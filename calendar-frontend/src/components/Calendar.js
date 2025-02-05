import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/Calendar.css";

const Calendar = ({ sprints = [], tasks = [] }) => {

  console.log("Sprints:", sprints);
  console.log("Tasks:", tasks);
  const events = [
    ...(Array.isArray(sprints) ? sprints : []).map((sprint) => {
      if (!sprint || !sprint.name || !sprint.start || !sprint.end) {
        console.error("Invalid sprint data:", sprint);
        return null;
      }
      return {
        title: sprint.name,
        start: sprint.start,
        end: sprint.end,
      };
    }).filter(event => event !== null),
    ...(Array.isArray(tasks) ? tasks : []).map((task) => {
      if (!task || !task.name || !task.start || !task.end) {
        console.error("Invalid task data:", task);
        return null;
      }
      return {
        title: task.name,
        start: task.start,
        end: task.end,
      };
    }).filter(event => event !== null),
  ];


  return (
    <div className="calendar-container" style={{ width: "100%", height: "80vh" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        editable={true}
        selectable={true}
      />
    </div>
  );
};

export default Calendar;
