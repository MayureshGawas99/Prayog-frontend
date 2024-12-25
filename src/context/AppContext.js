// 1. Create a new file for your context, for example, MyContext.js

import axios from "axios";
import React, { createContext, useState } from "react";

// Create a context with a default value
const AppContext = createContext();

// Create a provider component to wrap your app
const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [fetchCommentsAgain, setFetchCommentsAgain] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [jwt, setJWT] = useState(localStorage.getItem("jwt") || "");
  const commonAxios = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        jwt,
        setJWT,
        fetchCommentsAgain,
        setFetchCommentsAgain,
        commentCount,
        setCommentCount,
        activeTab,
        setActiveTab,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        commonAxios,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
