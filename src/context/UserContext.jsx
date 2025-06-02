
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
   const [name, setName] = useState(() => {
    try {
      const storedUser = localStorage.getItem("tUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        return parsed.name || "";
      }
      return "";
    } catch (e) {
      console.error("Failed to parse user data from localStorage:", e);
      return "";
    }
  });

  useEffect(() => {
    if (name) {
      try {
        const storedUser = localStorage.getItem("tUser");
        const userData = storedUser ? JSON.parse(storedUser) : {};
        userData.name = name;
        localStorage.setItem("tUser", JSON.stringify(userData));
      } catch (e) {
        console.error("Failed to update user data in localStorage:", e);
      }
    }
  }, [name]);

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
};
