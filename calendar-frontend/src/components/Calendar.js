import { useState, useEffect } from "react";
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
import { formatDateForSprint, formatDateTimeForTask, convertToLocalDate } from "./utils";
import { fetchSprints, fetchTasks, fetchHolidays, deleteSprint, deleteTask } from "./api";

const Calendar = () => {
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showSprintForm, setShowSprintFormState] = useState(false);
  const [showTaskForm, setShowTaskFormState] = useState(false);

  const [selectedSprint, setSelectedSprint] = useState(null);
  const [showSprintDetails, setShowSprintDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const[holidays,setHolidays] = useState([]);
  

  useEffect(() => {
    const apiKey = 'XIFQgI5hvpgIer8vkkjiSCQPeu0l2JSo';
    const country = 'RS';
    const year = 2025;

    const fetchData = async () => {
      try {
        const [sprintsData, tasksData, holidaysData] = await Promise.all([
          fetchSprints(),
          fetchTasks(),
          fetchHolidays(apiKey, country, year)
        ]);
        setSprints(sprintsData);
        setTasks(tasksData);
        setHolidays(holidaysData);
      } catch (error) {
        alert("Failed to fetch data");
      }
    };

    fetchData();
  }, [refresh]);



  // Handle adding a new sprint
  const handleSprintAdded = (newSprint) => {
    setSprints((prevSprints) => [...prevSprints, newSprint]);
    setShowSprintFormState(false);
    setIsEditing(false);
  };

  //Handle editing a sprint
  const handleEditSprint = () => {
    setIsEditing(true);
    setShowSprintFormState(true);
  };
 //Handle deleting a sprint
 const handleDeleteSprint = async (sprintId) => {
  try {
    await deleteSprint(sprintId);
    setSprints((prevSprints) => prevSprints.filter((sprint) => sprint.id !== sprintId));
    setShowSprintDetails(false);
    setRefresh((prev) => !prev);
  } catch {
    alert("Failed to delete sprint");
  }
};

  // Handle adding a new task
  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowTaskFormState(false);
    setIsEditing(false);
  };

  const handleEditTask = () => {
    setIsEditing(true);
    setShowTaskFormState(true);
  };
  
  //Handle deleting a task 
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

  // Prepare events for the calendar
  const events = [
    ...(Array.isArray(sprints) ? sprints : [])
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
      .filter((event) => event !== null),
    ...(Array.isArray(tasks) ? tasks : [])
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
          extendedProps: { type: "task" , description: task.description, status: task.status, user_id: task.user_id, sprint_id: task.sprint_id},  
        };
      })
      .filter((event) => event !== null),
      ...holidays,  
  ];

  const handleEventClick = (info) => {
   
    if (info.event.extendedProps.type === "sprint") {
      setSelectedSprint({
        id: info.event.id,
        title: info.event.title,
        start: convertToLocalDate(info.event.start),
        end: convertToLocalDate(info.event.end),
        color: info.event.backgroundColor,
      });
      console.log("Sprint:", selectedSprint);
      setShowSprintDetails(true);
    }

    if(info.event.extendedProps.type === "task") {
      setSelectedTask({
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        color: info.event.backgroundColor,
        extendedProps: info.event.extendedProps,
      });
      console.log("Task:", selectedTask);  
      setShowTaskDetails(true);
      
    }
  };


  //Moving events in calendar and updating the database 
  const handleEventDrop = async (info) => {
    console.log("Pomeren event:", info.event);

    const { id, title, start, end, backgroundColor, extendedProps } = info.event;
    const token = localStorage.getItem("token");

    let updatedData = {
        name: title,
        start: extendedProps.type === "sprint" ? formatDateForSprint(start) : formatDateTimeForTask(start),
        end: extendedProps.type === "sprint" ? formatDateForSprint(end) : formatDateTimeForTask(end),
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
    console.log("saljem:", updatedData);
    const apiUrl =
        extendedProps.type === "sprint"
            ? `http://127.0.0.1:8000/api/sprints/${id}`
            : `http://127.0.0.1:8000/api/tasks/${id}`;

    try {
        const response = await axios.put(apiUrl, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
       console.log("Uspešno ažurirano!", response.data);
    } catch (error) {
        //console.log("Podaci koji se šalju:", updatedData);  
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
          setShowSprintFormState(false);
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
          setShowTaskFormState(false);
          setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
