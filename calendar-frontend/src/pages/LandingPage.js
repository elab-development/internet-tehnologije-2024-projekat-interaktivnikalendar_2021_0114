import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import PricingCard from "../components/PricingCard";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default LandingPage;
