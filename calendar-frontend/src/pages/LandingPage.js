import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default LandingPage;
