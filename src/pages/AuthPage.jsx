import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/AuthPage.css";

const AuthPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const [error, setError] = useState("");
  const { setName } = useUser();
  const navigate = useNavigate();

  const handleSubmit = () => {
    const { name, email } = formData;
    if (!name.trim() || !email.trim()) {
      setError("All fields are required.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setName(name.trim());

    const userData = {
      name: name.trim(),
      email: email.trim(),
    };
    localStorage.setItem("tUser", JSON.stringify(userData));

    navigate("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Welcome!</h2>
        <p>Enter your details to continue</p>

        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          onKeyDown={handleKeyDown}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          onKeyDown={handleKeyDown}
        />

        {error && <div className="error-msg">{error}</div>}

        <button onClick={handleSubmit}>Continue</button>
      </div>
    </div>
  );
};

export default AuthPage;
