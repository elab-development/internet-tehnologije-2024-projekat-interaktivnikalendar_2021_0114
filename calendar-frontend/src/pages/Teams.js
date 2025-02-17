import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Teams.css";
import { fetchSprints } from "../components/api";
import { FaRegPlusSquare } from "react-icons/fa";

const Teams = () => {
  const [sprints, setSprints] = useState([]);

  useEffect(() => {
    const getSprints = () => {
      fetchSprints().then((data) => setSprints(data));
    };
    getSprints();
  }, []);

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
                <FaRegPlusSquare className="assign-icon" />
              </div>
              <div className="users">
                {sprint.users &&
                  sprint.users.map((user) => (
                    <div key={user.id} className="user">
                      <span>{user.name}</span>
                      <button
                        className="remove-user-btn"
                        // onClick={() => removeUserFromSprint(sprint.id, user.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teams;
