import Calendar from "../components/Calendar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [sprints, setSprints] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://127.0.0.1:8000/api/sprints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSprints(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setError("Failed to fetch sprints");
      });
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Calendar sprints={sprints} />
    </div>
  );
};

export default Dashboard;
