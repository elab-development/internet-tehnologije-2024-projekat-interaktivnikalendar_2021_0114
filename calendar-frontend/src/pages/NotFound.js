import "../styles/NotFound.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <p id="er404">404</p>
      <p className="nf-text">
        Not Found
        <button onClick={() => navigate(-1)}>Go Back</button>
      </p>
    </div>
  );
};

export default NotFound;
