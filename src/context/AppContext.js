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

  //Chat Context
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedSender, setSelectedSender] = useState(null);
  const [myChats, setMyChats] = useState([]);
  const [myGroupChats, setMyGroupChats] = useState([]);
  const [myChatRequests, setMyChatRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [chatExist, setChatExist] = useState("default");
  const [tab, setTab] = useState("all");
  const [tabChats, setTabChats] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");
  const [groupChatUsers, setGroupChatUsers] = useState([]);
  const [fetchChatsAgain, setFetchChatsAgain] = useState(false);

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
        selectedChat,
        setSelectedChat,
        selectedSender,
        setSelectedSender,
        myChats,
        setMyChats,
        myGroupChats,
        setMyGroupChats,
        myChatRequests,
        setMyChatRequests,
        message,
        setMessage,
        messages,
        setMessages,
        notification,
        setNotification,
        searchUser,
        setSearchUser,
        debouncedSearch,
        setDebouncedSearch,
        searchResults,
        setSearchResults,
        searchLoading,
        setSearchLoading,
        chatExist,
        setChatExist,
        tab,
        setTab,
        tabChats,
        setTabChats,
        groupChatName,
        setGroupChatName,
        groupChatUsers,
        setGroupChatUsers,
        fetchChatsAgain,
        setFetchChatsAgain,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
