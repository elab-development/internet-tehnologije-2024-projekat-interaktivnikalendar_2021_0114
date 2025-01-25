import Navbar from "../components/Navbar";
import PricingPage from "./PricingPage";
import Contacts from "./Contacts";
import Features from "./Features";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <section id="home">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </section>
      <section id="features">
        <Features />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </section>
      <section id="pricing">
        <PricingPage />
      </section>
      <section id="contact">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Contacts />
      </section>
    </div>
  );
};

export default LandingPage;
