 import "../styles/Navbar.css";
  const Navbar = () => {
  return (
    
      <div className="navbar">
        <div className="navbar-logo">
          <h3>Scrum</h3>
        </div>
        <nav className="navbar-center">
         
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="navbar-login">
          <a href="/login">Log in</a>
          <a href="/register" id="register">Register</a>
        </div>
      </div>
  );

  };
export default Navbar;


/*import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset =
        8 * parseFloat(getComputedStyle(document.documentElement).fontSize); // 8rem in pixels
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <h3>Scrum</h3>
      </div>
      <nav className="navbar-center">
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

export default Navbar;;*/
  
 
