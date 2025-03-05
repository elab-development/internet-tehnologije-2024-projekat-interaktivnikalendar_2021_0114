import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import InvitationForm from "../components/InvitationForm";
import "../styles/Teams.css";
import { removeUserFromSprint, updateTeamStatus } from "../components/api";
import { FaRegPlusSquare } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { useFetchActiveTeams, useFetchArchivedTeams } from "../hooks/teamHooks";

const Teams = () => {
  const [sprints, setSprints] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showArchivedTeams, setShowArchivedTeams] = useState(false);
  const [archivedSprints, setArchivedSprints] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState(null);

  const location = useLocation();

  useFetchActiveTeams(setSprints, refresh);
  useFetchArchivedTeams(setArchivedSprints, showArchivedTeams, refresh);

  const toggleDropdown = () => {
    setShowArchivedTeams((prev) => !prev);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("joined") === "true") {
      alert("Successfully joined the team!");
      setRefresh((prev) => !prev);
    }
  }, [location.search]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="teams-page">
        <h2>Teams</h2>
        <p>Manage your team members by adding or removing them from sprints.</p>
        <hr />
        <div className="sprints-container">
          {sprints.map((sprint) => (
            <div
              key={sprint.id}
              className="sprint"
              style={{ "--sprint-color": sprint.color }}
            >
              <div className="sprint-header">
                <span>Sprint: {sprint.name}</span>
                <FaRegPlusSquare
                  className="assign-icon"
                  onClick={() => setSelectedSprintId(sprint.id)}
                />
              </div>
              <div className="users">
                {sprint.users &&
                  sprint.users.map((user) => (
                    <div key={user.id} className="user">
                      <div>
                        <span>{user.name}</span>
                        <p className="user-role">{user.role.name}</p>
                      </div>
                      <button
                        className="remove-user-btn"
                        onClick={() => {
                          removeUserFromSprint(sprint.id, user.id);
                          setRefresh((prev) => !prev);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
              </div>
              <p className="archive-btn">
                <span
                  onClick={() => {
                    updateTeamStatus(sprint.id, false);
                    setRefresh((prev) => !prev);
                  }}
                >
                  Archive
                </span>
              </p>
            </div>
          ))}
          <hr />
        </div>

        <div className="archived-teams-container">
          <p className="archived-teams-toggle" onClick={toggleDropdown}>
            {showArchivedTeams ? <IoIosArrowDown /> : <IoIosArrowForward />}
            Archived Teams
          </p>
          {showArchivedTeams && (
            <div className="sprints-container">
              {archivedSprints.map((sprint) => (
                <div
                  key={sprint.id}
                  className="sprint"
                  style={{ "--sprint-color": "var(--dark-grey)" }}
                >
                  <div className="sprint-header">
                    <span>Sprint: {sprint.name}</span>
                    <p
                      className="restore-btn"
                      onClick={() => {
                        updateTeamStatus(sprint.id, true);
                        setRefresh((prev) => !prev);
                      }}
                    >
                      Restore
                    </p>
                  </div>
                  <div className="users">
                    {sprint.users &&
                      sprint.users.map((user) => (
                        <div key={user.id} className="user">
                          <div>
                            <span>{user.name}</span>
                            <p className="user-role">{user.role.name}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedSprintId && (
          <InvitationForm
            selectedSprintId={selectedSprintId}
            onClose={() => setSelectedSprintId(null)}
            onSuccess={() => setRefresh((prev) => !prev)}
          />
        )}
      </div>
    </div>
  );
};

export default Teams;
