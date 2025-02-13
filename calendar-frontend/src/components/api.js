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
  const url = `https://calendarific.com/api/v2/holidays?&api_key=${apiKey}&country=${country}&year=${year}`;
  const response = await axios.get(url);
  return response.data.response.holidays.map((holiday) => ({
    id: `holiday-${holiday.date.iso}`,
    title: holiday.name,
    start: holiday.date.iso,
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

