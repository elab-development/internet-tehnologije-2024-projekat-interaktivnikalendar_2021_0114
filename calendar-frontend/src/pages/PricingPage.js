import { useState } from "react";
import "../styles/PricingCard.css";
import PricingCard from "../components/PricingCard";

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("Monthly");

  const plans = [
    {
      title: "Free",
      monthlyPrice: "$0/month",
      annualPrice: "$0/year",
      features: ["Up to 5 team members", "Basic features", "500 free tasks"],
    },
    {
      title: "Premium",
      monthlyPrice: "$19/month",
      annualPrice: "$190/year",
      features: ["Unlimited team members", "All features", "Unlimited tasks"],
    },
  ];

  const getPrice = (plan) =>
    selectedPlan === "Monthly" ? plan.monthlyPrice : plan.annualPrice;

  return (
    <div className="pricing-page">
      <div className="pricing-type">
        <button
          onClick={() => setSelectedPlan("Monthly")}
          className={selectedPlan === "Monthly" ? "active" : ""}
        >
          Monthly
        </button>
        <button
          onClick={() => setSelectedPlan("Annually")}
          className={selectedPlan === "Annually" ? "active" : ""}
        >
          Annually
        </button>
      </div>
      <div className="pricing-plans">
        {plans.map((plan, index) => (
          <PricingCard
            key={index}
            title={plan.title}
            price={getPrice(plan)}
            features={plan.features}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
