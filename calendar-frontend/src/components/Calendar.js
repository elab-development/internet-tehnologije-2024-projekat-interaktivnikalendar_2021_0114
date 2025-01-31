import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/Calendar.css";

const Calendar = ({ sprints }) => {
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={sprints.map((sprint) => ({
          title: sprint.name,
          start: sprint.start,
          end: sprint.end,
        }))}
        editable={true}
        selectable={true}
      />
    </div>
  );
};

export default Calendar;
