import "../styles/Sidebar.css";
import { MdLogout } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import { BsKanban, BsCalendar } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  // State to keep track of whether the section is collapsed
  const [isTasksCollapsed, setIsTasksCollapsed] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);

  const toggleTasksCollapse = () => {
    setIsTasksCollapsed(!isTasksCollapsed);
  };

  const toggleFiltersCollapse = () => {
    setIsFiltersCollapsed(!isFiltersCollapsed);
  };

  return (
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
        </div>

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
        <NavLink to="/settings" className="icon-and-link">
          <IoSettingsOutline className="sidebar-icon" />
          Settings
        </NavLink>
        <p id="log-out-section">
          <MdLogout id="log-out-icon" />
          Log Out
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
