import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Login } from "./user/Login";
import { Register } from "./user/Register";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
