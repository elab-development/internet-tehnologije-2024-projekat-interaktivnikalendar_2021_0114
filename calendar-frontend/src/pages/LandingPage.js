import React from "react";
import Navbar from "../components/Navbar";
import PricingPage from "./PricingPage";
import Contacts from "./Contacts";
import Features from "./Features";
import "../styles/LandingPage.css";


const LandingPage = () => {
  return (
    <div>
      <Navbar />
      
      <section id="features" className="section">
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
