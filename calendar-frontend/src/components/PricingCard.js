import "../styles/PricingCard.css";
import { FaCheck } from "react-icons/fa";

const PricingCard = ({ title, price, features }) => {
  return (
    <div className="pricing-card">
      <h3 className="plan-title">{title}</h3>
      <p className="price">{price}</p>
      <hr />
      <ul className="pricing-features">
        {features.map((feature, index) => (
          <li key={index}>
            <FaCheck /> {feature}
          </li>
        ))}
      </ul>
      <hr />
      <button>Get Started</button>
    </div>
  );
};

export default PricingCard;
