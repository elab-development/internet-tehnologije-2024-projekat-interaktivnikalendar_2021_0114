import "../styles/Login.css";
import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

const Login = () => {
  return (
    <div className="login-page">
      <button onClick={() => window.history.back()} className="back-button">
        <IoIosArrowRoundBack />
      </button>
      <div className="login-card">
        <h2>Log in</h2>
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
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
