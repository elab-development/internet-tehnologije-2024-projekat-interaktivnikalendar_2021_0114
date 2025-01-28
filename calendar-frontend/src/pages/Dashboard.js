import Calendar from "../components/Calendar";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Calendar />
    </div>
  );
};

export default Dashboard;
