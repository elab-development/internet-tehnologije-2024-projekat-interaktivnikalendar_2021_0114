import { useState } from "react";
import Calendar from "../components/Calendar";
import Sidebar from "../components/Sidebar";
import "../styles/Form.css";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [filters, setFilters] = useState({
    statusFilters: [],
    priorityFilters: [],
  });

  return (
    <div style={{ display: "flex" }} className="calendar-page">
      <Sidebar setSelectedDate={setSelectedDate} setFilters={setFilters} />
      <Calendar selectedDate={selectedDate} filters={filters} />
    </div>
  );
};

export default CalendarPage;
