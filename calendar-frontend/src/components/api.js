import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

//vraca sve sprintove kojima pripada ulogovani korisnik
export const fetchSprints = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/user/sprints`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

//vraca sve zadatke koji pripadaju ulogovanom korisniku
export const fetchTasks = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/user/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchHolidays = async (country, year) => {
  const url = `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${country}&languageIsoCode=EN&validFrom=${year}-01-01&validTo=${
    year + 2
  }-12-31`;
  const response = await axios.get(url);
  return response.data.map((holiday) => ({
    id: `holiday-${holiday.startDate}`,
    title: holiday.name[0].text,
    start: holiday.startDate,
    allDay: true,
    backgroundColor: "red",
    borderColor: "red",
    extendedProps: { type: "holiday" },
  }));
};

//vraca ulogovanog korisnika sa njegovom ulogom
export const fetchLoggedInUser = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/user-with-role`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

//Vraca sve zadatke koji pripadaju sprintu zajedno sa korisnicima koji su zaduzeni za njih - Kanban board shared tasks
export const fetchTasksBySprint = async (sprintId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_BASE_URL}/sprints/${sprintId}/tasks`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.tasks;
};

//vraca sve zadatke ulogovanog usera koji pripadaju sprintu - Kanban board personal tasks
export const fetchPersonalTasksBySprint = async (sprintId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_BASE_URL}/sprints/${sprintId}/user/tasks`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.tasks;
};

export const fetchActiveTeams = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/user/active-teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchArchivedTeams = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/user/archived-teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTeamStatus = async (sprint_id, status) => {
  const token = localStorage.getItem("token");
  await axios.put(
    `${API_BASE_URL}/user/teams/${sprint_id}/status/${status}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const removeUserFromSprint = async (sprint_id, user_id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}/assign/${sprint_id}/${user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error: " + error.message);
  }
};

//This function doesnt make sense
export const assignTaskToSprint = async () => {
  console.log("Fetching Sprints api.js");

  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/tasks/assign-sprint`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Fetching Sprints for Tasks:", response.data);
  return response.data;
};

export const sendInvitation = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_BASE_URL}/invitations`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteSprint = async (sprintId) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_BASE_URL}/sprints/${sprintId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTask = async (taskId) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchSprintWithTasks = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/user/sprints/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.sprints;
};

//koristili smo pre nego sto smo implementirali invitation
export const assignUserToSprint = async (sprint_id) => {
  const user_id = prompt("Enter the user ID to assign to the sprint:");

  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `${API_BASE_URL}/assign/${sprint_id}/${user_id}`,
      {}, // Empty body (since the parameters are in the URL)
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.error("Error: " + error.message);
  }
};

export const updateTaskStatusAndOrder = async (taskId, status, newIndex) => {
  const token = localStorage.getItem("token");
  await axios.put(
    `${API_BASE_URL}/tasks/${taskId}/status-order`,
    { status, newIndex },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
