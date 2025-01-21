import { NavLink, Outlet } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <h3>Scrum</h3>
      </div>
      <nav className="navbar-center">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/faq">FAQ</NavLink>
      </nav>
      <div className="navbar-login">
        <NavLink to="/login">Log in</NavLink>
        <NavLink to="/register" id="register">
          Register
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
