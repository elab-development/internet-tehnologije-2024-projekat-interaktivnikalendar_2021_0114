import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import Teams from "./pages/Teams";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="calendar"
            element={
              <PrivateRoute>
                <CalendarPage />
              </PrivateRoute>
            }
          />
          <Route
            path="kanban"
            element={
              // Just a placeholder for now
              <div style={{ display: "flex" }}>
                <Sidebar /> <h1>Kanban</h1>
              </div>
            }
          />
          <Route
            path="teams"
            element={
              <PrivateRoute>
                <Teams />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
