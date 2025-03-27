import Navbar from "../components/Navbar";
import PricingPage from "./PricingPage";
import Contacts from "./Contacts";
import Features from "./Features";
import "../styles/LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <Navbar />
      <section id="home" className="home-section">
        <h1>Take Control of Your Projects</h1>
        <p>
          Discover a seamless way to manage your team's tasks and deadlines{" "}
          <br />
          with our intuitive project management tool.
        </p>
        <button className="get-started-btn" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </section>
      <section
        className="section"
        id="section-features"
        style={{ paddingBottom: "15rem" }}
      >
        <Features />
      </section>
      <section id="pricing" className="section">
        <PricingPage />
      </section>
      <section id="contact" className="section">
        <Contacts />
      </section>
    </div>
  );
};

export default LandingPage;
