import "../styles/Sidebar.css";
import { MdLogout } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import { BsKanban, BsCalendar } from "react-icons/bs";
import { IoSettingsOutline, IoPeople } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ children }) => {
  const [isTasksCollapsed, setIsTasksCollapsed] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleTasksCollapse = () => {
    setIsTasksCollapsed(!isTasksCollapsed);
  };

  const toggleFiltersCollapse = () => {
    setIsFiltersCollapsed(!isFiltersCollapsed);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-container">
        <div className="small-calendar">{/* Add small calendar later */}</div>

        <div className="sidebar-sections">
          <div>
            <NavLink to="/dashboard" className="icon-and-link">
              <AiOutlineHome className="sidebar-icon" />
              Home
            </NavLink>

            <NavLink to="/calendar" className="icon-and-link">
              <BsCalendar className="sidebar-icon" />
              Calendar
            </NavLink>

            <NavLink to="/kanban" className="icon-and-link">
              <BsKanban className="sidebar-icon" />
              Kanban
            </NavLink>

            <NavLink to="/teams" className="icon-and-link">
              <IoPeople className="sidebar-icon" />
              Teams
            </NavLink>
          </div>
          <hr />
          <div className="sidebar-section">
            <h3 onClick={toggleTasksCollapse}>
              Tasks
              {isTasksCollapsed ? (
                <IoIosArrowBack className="arrow-icon" />
              ) : (
                <IoIosArrowDown className="arrow-icon" />
              )}
            </h3>
            {!isTasksCollapsed && (
              <ul>
                <li>Task 1</li>
                <li>Task 2</li>
                <li>Task 3</li>
              </ul>
            )}
          </div>

          <div className="sidebar-section">
            <h3 onClick={toggleFiltersCollapse}>
              Filters
              {isFiltersCollapsed ? (
                <IoIosArrowBack className="arrow-icon" />
              ) : (
                <IoIosArrowDown className="arrow-icon" />
              )}
            </h3>
            {!isFiltersCollapsed && (
              <ul>
                <li>Filter 1</li>
                <li>Filter 2</li>
                <li>Filter 3</li>
              </ul>
            )}
          </div>
        </div>

        <div className="sidebar-settings">
          <hr />
          <NavLink to="/settings" className="icon-and-link">
            <IoSettingsOutline className="sidebar-icon" />
            Settings
          </NavLink>
          <p id="log-out-section" onClick={handleLogout}>
            <MdLogout id="log-out-icon" />
            Log Out
          </p>
        </div>
      </div>
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Sidebar;
