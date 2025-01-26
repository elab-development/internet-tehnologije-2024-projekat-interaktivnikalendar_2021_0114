import "../styles/Contact.css";

const Contacts = () => {
  return (
    <div className="contact-page">
      <h1>Find Us</h1>
      <div className="contact-cards-container">
        <div className="contact-card">
          <h3>Email</h3>
          <p>stefanmasa@gmail.com</p>
        </div>

        <div className="contact-card">
          <h3>Phone</h3>
          <p>+381695554747</p>
        </div>

        <div className="contact-card">
          <h3>Address</h3>
          <p>Ljubice Ivosevic 19, Vozdovac, Beograd</p>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
