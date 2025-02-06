import { useState } from "react";
import Calendar from "../components/Calendar";
import Sidebar from "../components/Sidebar";
import "../styles/Form.css";

const Dashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Calendar />
    </div>
  );
};

export default Dashboard;
