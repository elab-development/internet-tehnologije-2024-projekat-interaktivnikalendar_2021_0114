import React, { useState } from "react";
import { sendInvitation } from "./api"; // Import the sendInvitation function
import "../styles/Form.css";

const InvitationForm = ({ selectedSprintId, onClose, onSuccess}) => {
  const [email, setEmail] = useState("");

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    try {
      await sendInvitation({ email, sprint_id: selectedSprintId });
      alert("Invitation sent successfully.");
      setEmail("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("Failed to send invitation.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Send Invitation</h2>
        <form onSubmit={handleSendInvitation}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <button type="submit">Send Invitation</button>
          <button type="button" className="close-button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default InvitationForm;
