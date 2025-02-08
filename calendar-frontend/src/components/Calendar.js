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

  const [selectedSprint, setSelectedSprint] = useState(null);
  const [showSprintDetails, setShowSprintDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [selecetedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const [refresh, setRefresh] = useState(false);
  

  useEffect(() => {
    fetchSprints();
    fetchTasks();
  }, [refresh]);

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
    setIsEditing(false);
  };

  //Handle editing a sprint
  const handleEditSprint = () => {
    setIsEditing(true);
    setShowSprintFormState(true);
  };
 //Handle deleting a sprint
  const handleDeleteSprint = (sprintId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://127.0.0.1:8000/api/sprints/${sprintId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSprints((prevSprints) => prevSprints.filter(sprint => sprint.id !== sprintId));
        setShowSprintDetails(false);
        setRefresh(prev => !prev);

      })
      .catch(() => alert("Failed to delete sprint"));
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
  const handleDeleteTask = (taskId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
        setShowTaskDetails(false);
        setRefresh(prev => !prev);
      })
      .catch(() => alert("Failed to delete task"));
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
  ];

  //selecting events in calendar
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
      setShowTaskDetails(true);
      
    }
  };

  //Moving events in calendar and updating the database 

  const handleEventDrop = async (info) => {
    //console.log("Pomeren event:", info.event);

    const { id, title, start, end, backgroundColor, extendedProps } = info.event;
    const token = localStorage.getItem("token");

    let updatedData = {
        name: title,
        start: start.toISOString().split('T')[0],
        end: end ? end.toISOString().split('T')[0] : start.toISOString().split('T')[0],
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
        const response = await axios.put(apiUrl, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Update success!", response.data);
    } catch (error) {
        console.error("ERROR", error);
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
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
      />
      
      {showSprintDetails && selectedSprint && (
      <div className="modal-sprint"> 
        <div className="modal-content-sprint">
      <h2>{selectedSprint.title}</h2>
      <p><strong>Start:</strong> {new Date(selectedSprint.start).toISOString().split("T")[0]}</p>
      <p><strong>End:</strong> {new Date(selectedSprint.end).toISOString().split("T")[0]}</p>
      <button onClick={handleEditSprint}>Edit Sprint</button>
      <button onClick={() => handleDeleteSprint(selectedSprint.id)}>Delete Sprint</button>
      <button onClick={() => setShowSprintDetails(false)}>Close</button>
        </div>
      </div>
    )}

      {showTaskDetails && selecetedTask && (
      <div className="modal-task">
        <div className="modal-content-task">
          <h2>{selecetedTask.title}</h2>
          <p><strong>Description:</strong> {selecetedTask.extendedProps.description}</p>
          <p><strong>Status:</strong> {selecetedTask.extendedProps.status}</p>
          <p><strong>Start:</strong> {selecetedTask.start.toLocaleString()}</p>
          <p><strong>End:</strong> {selecetedTask.end.toLocaleString()}</p>
          <button onClick={handleEditTask}>Edit Task</button>
          <button onClick={() => handleDeleteTask(selecetedTask.id)}>Delete Task</button>
          <button onClick={() => setShowTaskDetails(false)}>Close</button>

     </div>
  </div>
    )}

      {showSprintForm && (
        <SprintForm
        selectedSprint={isEditing ? selectedSprint : null}         
        onSprintAdded={handleSprintAdded}
        fetchSprints={fetchSprints}
        onClose={() => {
          setShowSprintFormState(false);
          setIsEditing(false);
        }}
        />
      )}
      {showTaskForm && (
        <TaskForm
          selectedTask={isEditing ? selecetedTask : null}
          onTaskAdded={handleTaskAdded}
          fetchTasks={fetchTasks}
          onClose={() => {
          setShowTaskFormState(false);
          setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
