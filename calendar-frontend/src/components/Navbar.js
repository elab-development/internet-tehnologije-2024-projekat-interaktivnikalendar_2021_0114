import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import { useState } from "react";

const Navbar = () => {
  const [openBurgerMenu, setOpenBurgerMenu] = useState(false);

  // Add smooth scrolling effect to navigation links and offsets navigation links by 8rem
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 8 * 16; // 8rem in pixels assuming 1rem = 16px
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: "smooth",
      });
    }
    if (openBurgerMenu) setOpenBurgerMenu(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <h3>Scrum</h3>

        <div
          className="navbar-burger-menu"
          onClick={() => setOpenBurgerMenu(!openBurgerMenu)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className={`navbar-center ${openBurgerMenu ? "show-menu" : ""}`}>
        <a href="#home" onClick={(e) => handleScroll(e, "home")}>
          Home
        </a>
        <a href="#features" onClick={(e) => handleScroll(e, "features")}>
          Features
        </a>
        <a href="#pricing" onClick={(e) => handleScroll(e, "pricing")}>
          Pricing
        </a>
        <a href="#contact" onClick={(e) => handleScroll(e, "contact")}>
          Contact
        </a>
      </div>
      <div className={`navbar-login ${openBurgerMenu ? "show-menu" : ""}`}>
        <NavLink to="/login">Log in</NavLink>
        <NavLink to="/register" id="register">
          Register
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
