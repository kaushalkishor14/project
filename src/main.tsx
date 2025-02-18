import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import App from "./App.tsx";
// import LoginPage from "./LoginPage.tsx";
import "./index.css";
import LoginPage from "./components/Login.tsx";
import { Toaster } from "sonner";
import RegisterPage from "./components/Register.tsx";

const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Check if user is logged in
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/*" element={isAuthenticated() ? <App /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
    <Toaster/>
  </StrictMode>
);
