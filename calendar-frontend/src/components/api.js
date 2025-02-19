import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const fetchSprints = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/user/sprints`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchTasks = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchHolidays = async (apiKey, country, year) => {
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

export const assignTaskToSprint = async () => {
  console.log("Fetching Sprints api.js");

  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/tasks/assign-sprint`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Fetching Sprints for Tasks:", response.data);
  return response.data;
};
