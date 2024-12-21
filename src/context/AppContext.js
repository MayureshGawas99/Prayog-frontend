// 1. Create a new file for your context, for example, MyContext.js

import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create a context with a default value
const AppContext = createContext();

// Create a provider component to wrap your app
const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [jwt, setJWT] = useState(localStorage.getItem("jwt") || "");
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        jwt,
        setJWT,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
