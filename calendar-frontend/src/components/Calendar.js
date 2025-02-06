import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SprintForm from "./SprintForm";
import TaskForm from "./TaskForm";
import "../styles/Calendar.css";

const Calendar = () => {
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showSprintForm, setShowSprintFormState] = useState(false);
  const [showTaskForm, setShowTaskFormState] = useState(false);

  useEffect(() => {
    fetchSprints();
    fetchTasks();
  }, []);

  // Fetch sprints associated with the logged-in user from the API
  const fetchSprints = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/user/sprints", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSprints([response.data]);
      })
      .catch(() => alert("Failed to fetch sprints"));
  };

  // Fetch tasks from the API
  const fetchTasks = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setTasks(response.data))
      .catch(() => alert("Failed to fetch tasks"));
  };

  // Handle adding a new sprint
  const handleSprintAdded = (newSprint) => {
    setSprints((prevSprints) => [...prevSprints, newSprint]);
    setShowSprintFormState(false);
  };

  // Handle adding a new task
  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowTaskFormState(false);
  };

  // Prepare events for the calendar
  const events = [
    ...(Array.isArray(sprints) ? sprints : [])
      .map((sprint) => {
        if (!sprint || !sprint.name || !sprint.start || !sprint.end) {
          console.error("Invalid sprint data:", sprint);
          return null;
        }
        return {
          title: sprint.name,
          start: sprint.start,
          end: sprint.end,
        };
      })
      .filter((event) => event !== null),
    ...(Array.isArray(tasks) ? tasks : [])
      .map((task) => {
        if (!task || !task.name || !task.start || !task.end) {
          console.error("Invalid task data:", task);
          return null;
        }
        return {
          title: task.name,
          start: task.start,
          end: task.end,
        };
      })
      .filter((event) => event !== null),
  ];

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
        footerToolbar={{
          left: "createSprintButton",
          right: "createTaskButton",
        }}
        customButtons={{
          createSprintButton: {
            text: "Create Sprint",
            click: () => setShowSprintFormState(true),
          },
          createTaskButton: {
            text: "Create Task",
            click: () => setShowTaskFormState(true),
          },
        }}
        events={events}
        editable={true}
        selectable={true}
        dayMaxEventRows={true} // Ensure events are limited to rows
      />
      {showSprintForm && (
        <SprintForm
          onSprintAdded={handleSprintAdded}
          fetchSprints={fetchSprints}
          onClose={() => setShowSprintFormState(false)}
        />
      )}
      {showTaskForm && (
        <TaskForm
          onTaskAdded={handleTaskAdded}
          fetchTasks={fetchTasks}
          onClose={() => setShowTaskFormState(false)}
        />
      )}
    </div>
  );
};

export default Calendar;
