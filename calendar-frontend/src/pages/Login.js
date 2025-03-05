import "../styles/Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      navigate("/calendar");
    } catch (error) {
      setError("Login failed: Invalid email or password");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="login-page">
      <button onClick={() => navigate("/")} className="back-button">
        <IoIosArrowRoundBack />
      </button>
      <div className="login-card">
        <h2>Log in</h2>
        <form onSubmit={handleLogin}>
          <p>Enter your email and password.</p>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a className="forgot-password" href="/">
            Forgot password
          </a>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Log in</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
