import { useState } from "react";
import Calendar from "../components/Calendar";
import Sidebar from "../components/Sidebar";
import "../styles/Form.css";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div style={{ display: "flex" }} className="calendar-page">
      <Sidebar setSelectedDate={setSelectedDate} />
      <Calendar selectedDate={selectedDate} />
    </div>
  );
};

export default CalendarPage;
