import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />}>
            <Route path="/" index element={<h1>Home Page</h1>} />
            <Route path="about" element={<h1>About Page</h1>} />
            <Route path="contact" element={<h1>Contact Page</h1>} />
            <Route path="faq" element={<h1>FAQ Page</h1>} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<h1>Register Page</h1>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
