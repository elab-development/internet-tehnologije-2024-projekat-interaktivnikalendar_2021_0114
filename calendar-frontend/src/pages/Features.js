import "../styles/Features.css";

const Features = () => {
  return (
    <div className="features-section">
      <img
        src="/pictures/layered-waves-haikei.svg"
        alt="waves-bg"
        id="waves-bg"
      />

      <h1 id="features">Features</h1>
      <div className="feature">
        <div className="feature-img-container">
          <img src="/pictures/fallback-picture.png" alt="Calendar View" />
        </div>
        <div className="feature-text">
          <h2>Interactive Calendar</h2>
          <p>
            Our interactive calendar allows you to easily manage and track your
            tasks and sprints. With drag-and-drop functionality, you can quickly
            reschedule tasks and events.
          </p>
        </div>
      </div>

      <div className="feature left-side">
        <div className="feature-img-container">
          <img src="/pictures/fallback-picture.png" alt="Kanban Board" />
        </div>
        <div className="feature-text">
          <h2>Kanban Board</h2>
          <p>
            Visualize your workflow with our Kanban board. Easily move tasks
            between different stages and keep track of progress in a clear and
            organized manner.
          </p>
        </div>
      </div>

      <img src="/pictures/wave-line.svg" alt="waves-bg2" id="waves-bg2" />

      <div className="feature">
        <div className="feature-img-container">
          <img src="/pictures/fallback-picture.png" alt="Team Management" />
        </div>
        <div className="feature-text">
          <h2>Team Management</h2>
          <p>
            Manage your team members efficiently by adding or removing them from
            sprints. Assign tasks to specific team members and track their
            progress.
          </p>
        </div>
      </div>

      <img
        src="/pictures/stacked-waves-haikei.svg"
        alt="waves-bg3"
        id="waves-bg3"
      />
    </div>
  );
};

export default Features;
