import Navbar from "../components/Navbar";
import PricingPage from "./PricingPage";
import Contacts from "./Contacts";
import Features from "./Features";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <section id="home" style={{ paddingTop: "15rem" }}></section>
      <section
        id="features"
        className="section"
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
