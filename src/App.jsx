
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CanvasPage from "./pages/CanvasPage";
import InstanceCollab from "./pages/InstanceCollab";
import AuthPage from "./pages/AuthPage";
import { UserProvider } from "./context/UserContext.jsx";
import "./App.css";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<CanvasPage />} />
          <Route path="/collab/:id" element={<InstanceCollab />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
