import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />}>
            <Route path="/" index element={<h1>Home Page</h1>} />
            <Route path="features" element={<h1>Features Page</h1>} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="contact" element={<h1>Contact Page</h1>} />
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
