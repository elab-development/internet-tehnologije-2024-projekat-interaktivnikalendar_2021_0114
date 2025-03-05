import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useState } from "react";
import axios from "axios";

const roleToId = {
  "Scrum Master": 1,
  "Product Owner": 2,
  Developer: 3,
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Scrum Master");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        roles_id: roleToId[role],
      });
      localStorage.setItem("token", response.data.access_token);
      navigate("/calendar");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "Registration failed" });
      }
    }
  };

  return (
    <div className="register-page">
      <button onClick={() => navigate("/")} className="back-button">
        <IoIosArrowRoundBack />
      </button>
      <div className="register-card">
        <div className="register-header">
          <h2>Register</h2>
          <p>Create your account</p>
        </div>
        <form onSubmit={handleRegister}>
          <label htmlFor="name" className={errors.name ? "error-label" : ""}>
            Name
          </label>
          {errors.name && <p className="error-message">{errors.name}</p>}
          <input
            type="text"
            id="name"
            className={`name ${errors.name ? "error-input" : ""}`}
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email" className={errors.email ? "error-label" : ""}>
            Email
          </label>
          {errors.email && <p className="error-message">{errors.email}</p>}
          <input
            type="text"
            id="email"
            className={errors.email ? "error-input" : ""}
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label
            htmlFor="password"
            className={errors.password ? "error-label" : ""}
          >
            Password
          </label>
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
          <input
            type="password"
            id="password"
            className={errors.password ? "error-input" : ""}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label
            htmlFor="confirm-password"
            className={errors.confirmPassword ? "error-label" : ""}
          >
            Confirm Password
          </label>
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
          <input
            type="password"
            id="confirm-password"
            className={errors.confirmPassword ? "error-input" : ""}
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label
            htmlFor="role"
            className={errors.roles_id ? "error-label" : ""}
          >
            Role
          </label>
          {errors.roles_id && (
            <p className="error-message">{errors.roles_id}</p>
          )}
          <select
            id="role"
            className={`role-select ${errors.roles_id ? "error-input" : ""}`}
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Scrum Master">Scrum Master</option>
            <option value="Product Owner">Product Owner</option>
            <option value="Developer">Developer</option>
          </select>

          <button type="submit">Register</button>
        </form>
        {errors.general && <p className="error-message">{errors.general}</p>}
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
