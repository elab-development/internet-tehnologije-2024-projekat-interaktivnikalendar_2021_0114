import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SprintForm from "./SprintForm";
import TaskForm from "./TaskForm";
import "../styles/Calendar.css";
import SprintModal from "./SprintModal";
import TaskModal from "./TaskModal";
import {
  formatDateForSprint,
  formatDateTimeForTask,
  convertToLocalDate,
} from "./utils";
import {
  fetchSprints,
  fetchTasks,
  fetchHolidays,
  deleteSprint,
  deleteTask,
} from "./api";

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const [sprints, setSprints] = useState([]);
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [showSprintDetails, setShowSprintDetails] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [holidays, setHolidays] = useState([]);

  const apiKey = "XIFQgI5hvpgIer8vkkjiSCQPeu0l2JSo";
  const country = "RS";
  const year = 2025;

  const fetchData = async () => {
    try {
      console.log("Fetching data...");
      const [sprintsData, tasksData, holidaysData] = await Promise.all([
        fetchSprints(),
        fetchTasks(),
        fetchHolidays(apiKey, country, year),
      ]);
      setSprints(sprintsData);
      setTasks(tasksData);
      setHolidays(holidaysData);
    } catch (error) {
      alert("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  // ------ Sprint handling ------
  const handleSprintAdded = (newSprint) => {
    setSprints((prevSprints) => [...prevSprints, newSprint]);
    setShowSprintForm(false);
    setIsEditing(false);
    setRefresh((prev) => !prev);
  };

  const handleEditSprint = () => {
    setIsEditing(true);
    setShowSprintForm(true);
  };

  const handleDeleteSprint = async (sprintId) => {
    try {
      await deleteSprint(sprintId);
      setSprints((prevSprints) =>
        prevSprints.filter((sprint) => sprint.id !== sprintId)
      );
      setShowSprintDetails(false);
      setRefresh((prev) => !prev);
    } catch {
      alert("Failed to delete sprint");
    }
  };

  // ------ Task handling ------
  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowTaskForm(false);
    setIsEditing(false);
    setRefresh((prev) => !prev);
  };

  const handleEditTask = () => {
    setIsEditing(true);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setShowTaskDetails(false);
      setRefresh((prev) => !prev);
    } catch {
      alert("Failed to delete task");
    }
  };

  const prepareSprintEvents = (sprints) => {
    console.log("Prepare Sprints:");
    return (Array.isArray(sprints) ? sprints : [])
      .map((sprint) => {
        if (!sprint || !sprint.name || !sprint.start || !sprint.end) {
          console.error("Invalid sprint data:", sprint);
          return null;
        }
        return {
          id: sprint.id,
          title: sprint.name,
          start: sprint.start,
          end: sprint.end,
          backgroundColor: sprint.color,
          borderColor: sprint.color,
          extendedProps: { type: "sprint" },
        };
      })
      .filter((event) => event !== null);
  };

  const prepareTaskEvents = (tasks) => {
    return (Array.isArray(tasks) ? tasks : [])
      .map((task) => {
        if (!task || !task.name || !task.start || !task.end) {
          console.error("Invalid task data:", task);
          return null;
        }
        return {
          id: task.id,
          title: task.name,
          start: task.start,
          end: task.end,
          backgroundColor: task.color, // Use the custom color
          borderColor: task.color, // Use the custom color for border
          extendedProps: {
            type: "task",
            description: task.description,
            status: task.status,
            user_id: task.user_id,
            sprint_id: task.sprint_id,
          },
        };
      })
      .filter((event) => event !== null);
  };

  // Memoize the events array to prevent unnecessary recalculations on every render
  const events = useMemo(() => {
    return [
      ...prepareSprintEvents(sprints),
      ...prepareTaskEvents(tasks),
      ...holidays,
    ];
  }, [sprints, tasks, holidays]);

  const handleEventClick = (info) => {
    if (info.event.extendedProps.type === "sprint") {
      setSelectedSprint({
        id: info.event.id,
        title: info.event.title,
        start: convertToLocalDate(info.event.start),
        end: convertToLocalDate(info.event.end),
        color: info.event.backgroundColor,
      });
      setShowSprintDetails(true);
      setShowTaskDetails(false);
    }

    if (info.event.extendedProps.type === "task") {
      setSelectedTask({
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        color: info.event.backgroundColor,
        extendedProps: info.event.extendedProps,
      });
      setShowTaskDetails(true);
      setShowSprintDetails(false);
    }
  };

  //Moving events in calendar and updating the database
  const handleEventDrop = async (info) => {
    const { id, title, start, end, backgroundColor, extendedProps } =
      info.event;
    const token = localStorage.getItem("token");

    let updatedData = {
      name: title,
      start:
        extendedProps.type === "sprint"
          ? formatDateForSprint(start)
          : formatDateTimeForTask(start),
      end:
        extendedProps.type === "sprint"
          ? formatDateForSprint(end)
          : formatDateTimeForTask(end),
      color: backgroundColor,
    };

    if (extendedProps.type === "task") {
      updatedData = {
        ...updatedData,
        description: extendedProps.description,
        status: extendedProps.status,
        user_id: extendedProps.user_id,
        sprint_id: extendedProps.sprint_id,
      };
    }

    const apiUrl =
      extendedProps.type === "sprint"
        ? `http://127.0.0.1:8000/api/sprints/${id}`
        : `http://127.0.0.1:8000/api/tasks/${id}`;

    try {
      await axios.put(apiUrl, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRefresh((prev) => !prev);
    } catch (error) {
      info.revert(); // Ako API ne uspe, vrati događaj nazad
    }
  };

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
            click: () => setShowSprintForm(true),
          },
          createTaskButton: {
            text: "Create Task",
            click: () => setShowTaskForm(true),
          },
        }}
        events={events}
        editable={true}
        selectable={true}
        dayMaxEventRows={true} // Ensure events are limited to rows
        firstDay={1}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
      />

      {showSprintDetails && selectedSprint && (
        <SprintModal
          sprint={selectedSprint}
          onEdit={handleEditSprint}
          onDelete={handleDeleteSprint}
          onClose={() => setShowSprintDetails(false)}
        />
      )}

      {showTaskDetails && selectedTask && (
        <TaskModal
          task={selectedTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onClose={() => setShowTaskDetails(false)}
        />
      )}

      {showSprintForm && (
        <SprintForm
          selectedSprint={isEditing ? selectedSprint : null}
          onSprintAdded={handleSprintAdded}
          fetchSprints={fetchSprints}
          onClose={() => {
            setShowSprintDetails(false);
            setShowSprintForm(false);
            setIsEditing(false);
          }}
        />
      )}

      {showTaskForm && (
        <TaskForm
          selectedTask={isEditing ? selectedTask : null}
          onTaskAdded={handleTaskAdded}
          fetchTasks={fetchTasks}
          onClose={() => {
            setShowTaskDetails(false);
            setShowTaskForm(false);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
