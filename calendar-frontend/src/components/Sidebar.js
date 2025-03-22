import "../styles/Sidebar.css";
import { MdLogout } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import { BsKanban, BsCalendar } from "react-icons/bs";
import { IoSettingsOutline, IoPeople } from "react-icons/io5";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchActiveTeams } from "./api";

const Sidebar = ({ children, setSelectedDate, setSprintId }) => {
  const [isSprintsCollapsed, setIsSprintsCollapsed] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const navigate = useNavigate();
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const location = useLocation();

  const fetchSprintsData = async () => {
    try {
      const sprintsData = await fetchActiveTeams();
      setSprints(sprintsData);
      setSelectedSprint(sprintsData[0].id);
      setSprintId(sprintsData[0].id);
    } catch (error) {
      alert("Failed to fetch sprints");
    }
  };

  useEffect(() => {
    if (location.pathname === "/kanban") {
      fetchSprintsData();
    }
  }, [location.pathname]);

  const toggleSprintCollapse = () => {
    setIsSprintsCollapsed(!isSprintsCollapsed);
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

  const handleSprintClick = (sprintId) => {
    setSelectedSprint(sprintId);
    if (setSprintId) setSprintId(sprintId);
  };

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-container">
        <div className="small-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              right: "prev,next today",
              left: "title",
            }}
            selectable={true}
            firstDay={1}
            dayCellClassNames={() => "custom-day-cell"} // Add custom class to day cells
            dayHeaderContent={(args) => {
              const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
              return dayNames[args.date.getUTCDay()];
            }}
            titleFormat={{ month: "short", year: "numeric" }}
            dateClick={(info) => {
              if (setSelectedDate) setSelectedDate(info.date);
            }}
            contentHeight={"auto"}
          />
        </div>

        <div className="sidebar-sections">
          <div>
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

          {setSprintId && (
            <div className="sidebar-section">
              <h3 onClick={toggleSprintCollapse}>
                Sprints
                {isSprintsCollapsed ? (
                  <IoIosArrowBack className="arrow-icon" />
                ) : (
                  <IoIosArrowDown className="arrow-icon" />
                )}
              </h3>
              {!isSprintsCollapsed &&
                sprints.map((sprint) => (
                  <label
                    key={sprint.id}
                    className="filter-item"
                    htmlFor={`sprint-${sprint.id}`}
                  >
                    <input
                      type="checkbox"
                      id={`sprint-${sprint.id}`}
                      checked={selectedSprint === sprint.id}
                      onChange={() => handleSprintClick(sprint.id)}
                    />
                    {sprint.name}
                  </label>
                ))}
            </div>
          )}

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
