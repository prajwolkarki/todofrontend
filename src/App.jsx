import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";
import TwoFactorAuth from "./pages/TwoFactorAuth";
import TaskManager from "./pages/TaskManager";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/2fa" element={<TwoFactorAuth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TaskManager />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;
