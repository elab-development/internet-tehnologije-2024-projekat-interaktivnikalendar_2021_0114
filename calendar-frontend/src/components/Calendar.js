import { useState, useEffect, useMemo, useRef } from "react";
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
import { AiFillPlusCircle } from "react-icons/ai";
import {
  formatDateForSprint,
  formatDateTimeForTask,
  convertToLocalDate,
} from "./utils";
import {
  fetchSprints,
  fetchLoggedInUser,
  deleteSprint,
  deleteTask,
} from "./api";
import { downloadTasksIcsFile, downloadSprintsIcsFile } from "./icsUtils";
import { useFetchData, useHandleClickOutside } from "../hooks/calendarHooks";

const Calendar = ({ selectedDate, filters }) => {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const [sprints, setSprints] = useState([]);
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [showSprintDetails, setShowSprintDetails] = useState(false);

  const [showAddMenu, setShowAddMenu] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [holidays, setHolidays] = useState([]);

  const country = "RS";
  const year = 2025;

  const addMenuRef = useRef(null);
  const addEventBtnRef = useRef(null);
  const calendarRef = useRef(null);
  const sprintDetailsRef = useRef(null);
  const taskDetailsRef = useRef(null);
  const [user, setUser] = useState(null);

  useFetchData(setSprints, setTasks, setHolidays, country, year, refresh);

  useHandleClickOutside(addMenuRef, addEventBtnRef, setShowAddMenu);
  useHandleClickOutside(sprintDetailsRef, null, () =>
    setShowSprintDetails(false)
  );
  useHandleClickOutside(taskDetailsRef, null, () => setShowTaskDetails(false));

  const fetchUserData = async () => {
    try {
      const userData = await fetchLoggedInUser();
      setUser(userData);
    } catch (error) {
      alert("Failed to fetch user data");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Goes to date selected in sidebar
  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(selectedDate);

      const formattedDate = convertToLocalDate(selectedDate);
      const dayEl = calendarApi.el.querySelector(
        `[data-date="${formattedDate}"]`
      );
      const timeEl = calendarApi.el.querySelector(
        `.fc-timegrid-col[data-date="${formattedDate}"]`
      );
      const allDayEl = calendarApi.el.querySelector(
        `.fc-daygrid-day[data-date="${formattedDate}"]`
      );

      const highlightElement = (el) => {
        if (el) {
          el.style.transition = "background-color 1s ease";
          el.style.backgroundColor = "var(--red-higlight)";
          setTimeout(() => {
            el.style.transition = "background-color 2s ease";
            el.style.backgroundColor = "var(--white)";
          }, 1000);
        }
      };

      highlightElement(dayEl);
      highlightElement(timeEl);
      highlightElement(allDayEl);
    }

    return () => {
      // Cleanup logic if needed
    };
  }, [selectedDate]);

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
    //console.log("Sprints from database:", sprints);
    return (Array.isArray(sprints) ? sprints : [])
      .map((sprint) => {
        // Handle case where sprint is wrapped in a response object
        if (sprint && sprint.sprint && typeof sprint.sprint === "object") {
          sprint = sprint.sprint; // Extract the actual sprint object
        }

        return {
          id: sprint.id,
          title: sprint.name,
          start: sprint.start,
          end: sprint.end,
          backgroundColor: sprint.color,
          borderColor: sprint.color,
          extendedProps: { type: "sprint" },
          allDay: true,
        };
      })
      .filter((event) => event !== null);
  };

  const prepareTaskEvents = (tasks) => {
    //console.log("Tasks before processing:", tasks);
    return (Array.isArray(tasks) ? tasks : [])
      .map((task) => {
        // Handle case where task is wrapped in a response object
        if (task && task.task && typeof task.task === "object") {
          task = task.task; // Extract the actual task object
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
            priority: task.priority,
          },
        };
      })
      .filter((event) => event !== null);
  };

  const filterTasks = (tasks, filters) => {
    console.log("tasks");
    const normalizedStatusFilters = filters.statusFilters.map((status) =>
      status.toLowerCase()
    );
    const normalizedPriorityFilters = filters.priorityFilters.map((priority) =>
      priority.toLowerCase()
    );

    return tasks.filter((task) => {
      const matchesStatus =
        normalizedStatusFilters.length === 0 ||
        normalizedStatusFilters.includes(task.status?.toLowerCase());
      const matchesPriority =
        normalizedPriorityFilters.length === 0 ||
        normalizedPriorityFilters.includes(task.priority?.toLowerCase());
      return matchesStatus && matchesPriority;
    });
  };

  // Memoize the events array
  const events = useMemo(() => {
    const filteredTasks = filterTasks(tasks, filters);
    return [
      ...prepareSprintEvents(sprints),
      ...prepareTaskEvents(filteredTasks),
      ...holidays,
    ];
  }, [tasks, sprints, holidays, filters]);

  const handleEventClick = (info) => {
    if (info.event.extendedProps.type === "sprint") {
      setSelectedSprint({
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        color: info.event.backgroundColor,
      });
      setShowSprintDetails(true);
      setShowTaskDetails(false);
      //console.log("Selected sprint", selectedSprint);
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
      //console.log("Selected task", selectedTask);
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
    console.log("Updated data", updatedData);

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
        events={events}
        editable={true}
        selectable={true}
        dayMaxEventRows={true} // Ensure events are limited to rows
        firstDay={1}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        ref={calendarRef}
      />
      <div
        className="add-event-btn-container"
        onClick={() => setShowAddMenu(!showAddMenu)}
        ref={addEventBtnRef}
      >
        <AiFillPlusCircle
          className={`add-event-btn ${showAddMenu ? "close-menu-btn" : ""}`}
        />
      </div>

      {showSprintDetails && selectedSprint && (
        <SprintModal
          ref={sprintDetailsRef}
          sprint={selectedSprint}
          onEdit={handleEditSprint}
          onDelete={handleDeleteSprint}
          onClose={() => setShowSprintDetails(false)}
        />
      )}

      {showTaskDetails && selectedTask && (
        <TaskModal
          ref={taskDetailsRef}
          task={selectedTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onClose={() => setShowTaskDetails(false)}
        />
      )}

      {showAddMenu && (
        <div className="add-event-menu" ref={addMenuRef}>
          <ul>
            {user && user.role.name !== "Developer" && (
              <li onClick={() => setShowSprintForm(true)}>Create Sprint</li>
            )}
            <li onClick={() => setShowTaskForm(true)}>Create Task</li>
            <li onClick={() => downloadTasksIcsFile(tasks)}>Export Tasks</li>
            <li onClick={() => downloadSprintsIcsFile(sprints)}>
              Export Sprints
            </li>
          </ul>
        </div>
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
