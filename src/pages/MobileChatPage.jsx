import React, { useContext, useEffect, useState } from "react";
import { RiChatNewLine } from "react-icons/ri";
import { IoMdArrowRoundBack, IoMdClose, IoMdSend } from "react-icons/io";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { getFullSender } from "../context/ChatLogic";
import ScrollableChat from "../components/ScrollableChat";
import { io } from "socket.io-client";
import { FaInfo, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import GroupInfo from "../components/GroupInfo";

let socket;

const MobileChatPage = () => {
  const {
    commonAxios,
    user,
    jwt,
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
  } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwt) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [jwt]);

  useEffect(() => {
    if (tab === "all") {
      setTabChats(myChats);
    } else if (tab === "requests") {
      setTabChats(myChatRequests);
    } else if (tab === "groups") {
      setTabChats(myGroupChats);
    }
  }, [tab, myChats, myChatRequests, myGroupChats]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchUser);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchUser]);

  useEffect(() => {
    const searchUsers = async () => {
      try {
        setSearchLoading(true);
        const { data } = await commonAxios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/search?search=${debouncedSearch}`
        );
        setSearchResults(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setSearchLoading(false);
      }
    };
    if (debouncedSearch) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    socket = io(process.env.REACT_APP_BACKEND_URL);
    return () => {
      // Cleanup socket connection on unmount
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit("setup", user);
    }
    // socket.on("connected", () => setSocketConnected(true));
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      setSelectedSender(getFullSender(user, selectedChat.users));
      fetchMessages();
      socket.emit("join chat", selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
        // Notify the user if the message is for a different chat
        if (!notification.find((n) => n._id === newMessageReceived._id)) {
          setNotification([newMessageReceived, ...notification]);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [selectedChat, notification]);

  const fetchMessages = async () => {
    try {
      if (!selectedChat) return;
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/message/${selectedChat._id}`
      );
      setMessages(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    }
  };

  const fetchChats = async () => {
    try {
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/accepted`
      );
      setMyChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroupChats = async () => {
    try {
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/group`
      );
      setMyGroupChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChatRequests = async () => {
    try {
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/pending`
      );
      setMyChatRequests(data);
      console.log(data, "requests");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchChatRequests();
    fetchGroupChats();
  }, [fetchChatsAgain]);

  const handleNewChat = async (userData) => {
    try {
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/check/${userData._id}`,
        { userId: user._id }
      );
      console.log(data);
      setSelectedChat(data);
      if (data?.acceptedUsers?.includes(user._id)) {
        setChatExist("yes");
        console.log("yes");
      } else {
        setChatExist("pending");
        console.log("pending");
      }
    } catch (error) {
      console.log(error);
      setSelectedSender(userData);
      setChatExist("no");
      console.log("no");
    }
  };

  const handleNewGroupChat = async (chat, adminData) => {
    try {
      setSelectedChat(chat);
      if (chat?.acceptedUsers?.includes(user._id)) {
        setChatExist("yes");
        console.log("yes");
      } else {
        setChatExist("pending");
        console.log("pending");
      }
    } catch (error) {
      console.log(error);
      setSelectedSender(adminData);
      setChatExist("no");
      console.log("no");
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.warning("Cannot send an empty message");
      return;
    }

    try {
      const { data } = await commonAxios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/message`,
        { content: message, chatId: selectedChat }
      );
      socket.emit("new message", data);
      setMessages((prevMessages) => [...prevMessages, data]);
      setMessage("");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const acceptChat = async (chatId) => {
    try {
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/accept/${chatId}`,
        { chatId }
      );
      const myUpadtedChatRequests = myChatRequests.filter(
        (req) => req._id !== chatId
      );
      if (data?.isGroupChat) {
        setMyGroupChats((prevChats) => [data, ...prevChats]);
      } else {
        setMyChats((prevChats) => [data, ...prevChats]);
      }
      setMyChatRequests(myUpadtedChatRequests);
      setSelectedChat(data);
      setChatExist("yes");
      toast.success("Chat Accepted");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to accept chat");
    }
  };

  const rejectChat = async (chatId) => {
    try {
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/reject/${chatId}`,
        { chatId }
      );
      const myUpadtedChatRequests = myChatRequests.filter(
        (req) => req._id !== chatId
      );
      setMyChatRequests(myUpadtedChatRequests);
      setMyChats((prevChats) => [...prevChats, data]);
      setSelectedChat(null);
      setChatExist("default");
      toast.success("Chat Rejected");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to accept chat");
    }
  };

  const accessChat = async (userId) => {
    try {
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/user/${userId}`,
        { userId }
      );

      if (!myChats.find((c) => c._id === data._id))
        setMyChats([data, ...myChats]);
      setSelectedChat(data);
      setChatExist("yes");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to access chat");
    }
  };

  const handleClose = () => {
    setGroupChatName("");
    setGroupChatUsers([]);
    setSelectedChat(null);
    setChatExist("default");
  };

  const addUserToGroup = async (user) => {
    try {
      const removedUser = groupChatUsers.filter((u) => u._id !== user._id);
      setGroupChatUsers([user, ...removedUser]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeUserFromGroup = async (user) => {
    try {
      const removedUser = groupChatUsers.filter((u) => u._id !== user._id);
      setGroupChatUsers(removedUser);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateGroup = async (e) => {
    try {
      e.preventDefault();
      if (groupChatUsers.length < 2) {
        toast.error("Please select at least 2 users");
        return;
      }
      const userIds = groupChatUsers.map((u) => u._id);
      const { data } = await commonAxios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/group/create`,
        { name: groupChatName, users: userIds }
      );
      setGroupChatUsers([]);
      setGroupChatName("");
      setSelectedChat(data);
      setMyGroupChats((prevChats) => [data, ...prevChats]);
      setChatExist("yes");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create group");
    }
  };

  const defaultPage = () => (
    <div className="flex flex-col h-full col-span-2 bg-white border-r border-gray-300">
      <div className="flex items-center justify-between p-4 text-xl font-bold">
        <p>Chats</p>
        <span
          onClick={() => {
            setChatExist("group");
          }}
          className="p-2 rounded-full cursor-pointer hover:bg-gray-200"
        >
          <RiChatNewLine size={20} className="text-gray-500" />
        </span>
      </div>
      <div className="px-4 mb-2">
        <input
          type="search"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          placeholder="Search Users"
          className="w-full px-4 py-2 text-sm border rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="px-4 mb-2">
        <span
          onClick={() => {
            setDebouncedSearch("");
            setSearchUser("");
            setTab("all");
          }}
          className={
            tab === "all"
              ? "cursor-pointer inline-block bg-green-100 text-green-800 border border-green-800 text-sm font-semibold mr-2 px-4 py-1.5 rounded-full"
              : "cursor-pointer inline-block bg-gray-100 text-gray-800 hover:border hover:border-gray-800 hover:bg-gray-200 text-sm font-semibold mr-2 px-4 py-1.5 rounded-full"
          }
        >
          All
        </span>
        <span
          onClick={() => {
            setDebouncedSearch("");
            setSearchUser("");
            setTab("groups");
          }}
          className={
            tab === "groups"
              ? "cursor-pointer inline-block bg-green-100 text-green-800 border border-green-800 text-sm font-semibold mr-2 px-4 py-1.5 rounded-full"
              : "cursor-pointer inline-block bg-gray-100 text-gray-800 hover:border hover:border-gray-800 hover:bg-gray-200 text-sm font-semibold mr-2 px-4 py-1.5 rounded-full"
          }
        >
          Groups
        </span>
        <span
          onClick={() => {
            setDebouncedSearch("");
            setSearchUser("");
            setTab("requests");
          }}
          className={
            tab === "requests"
              ? "cursor-pointer inline-block bg-green-100 text-green-800 border border-green-800 text-sm font-semibold mr-2 px-4 py-1.5 rounded-full"
              : "cursor-pointer inline-block bg-gray-100 text-gray-800 hover:border hover:border-gray-800 hover:bg-gray-200 text-sm font-semibold mr-2 px-4 py-1.5 rounded-full"
          }
        >
          Requests
        </span>
      </div>
      <div className="flex-grow h-0 overflow-auto">
        {searchResults.length > 0
          ? searchResults.map((user) => {
              return (
                <div
                  key={user._id}
                  onClick={() => {
                    if (chatExist === "group") {
                      addUserToGroup(user);
                    } else {
                      handleNewChat(user);
                    }
                  }}
                  className={`p-4 cursor-pointer ${
                    selectedChat?._id === user._id ? "bg-gray-200" : ""
                  } hover:bg-gray-200`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={user?.pic}
                      alt=""
                      className="rounded-full w-14 h-14"
                    />
                    <div>
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
              );
            })
          : tabChats.map((chat) => {
              const sender = getFullSender(user, chat.users);
              if (chat?.isGroupChat) {
                return (
                  <div
                    key={chat._id}
                    onClick={() => {
                      setSelectedChat(chat);
                      handleNewGroupChat(chat, chat?.groupAdmin);
                    }}
                    className={`p-4 cursor-pointer ${
                      selectedChat?._id === chat._id ? "bg-gray-200" : ""
                    } hover:bg-gray-200`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png"
                        }
                        alt=""
                        className="rounded-full w-14 h-14"
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          {chat?.chatName}
                        </p>
                        <p className="text-xs text-gray-500">
                          members: {chat?.users?.length}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {chat?.latestMessage?.sender?._id === user?._id
                            ? "you"
                            : chat?.latestMessage?.sender?.name}
                          : {chat?.latestMessage?.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={chat._id}
                  onClick={() => {
                    if (chatExist === "group") {
                      addUserToGroup(sender);
                    } else {
                      setSelectedChat(chat);
                      handleNewChat(sender);
                    }
                  }}
                  className={`p-4 cursor-pointer ${
                    selectedChat?._id === chat._id ? "bg-gray-200" : ""
                  } hover:bg-gray-200`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={sender?.pic}
                      alt=""
                      className="rounded-full w-14 h-14"
                    />
                    <div>
                      <p className="text-sm font-semibold">{sender?.name}</p>
                      <p className="text-xs text-gray-500">{sender?.email}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {chat?.latestMessage?.sender?._id === user?._id
                          ? "you"
                          : chat?.latestMessage?.sender?.name}
                        : {chat?.latestMessage?.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
  const chatExistPage = () =>
    selectedChat && (
      <>
        {selectedChat?.isGroupChat ? (
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex flex-row items-center gap-2">
              <IoMdArrowRoundBack
                size={24}
                onClick={() => {
                  setChatExist("default");
                }}
                className="text-gray-500 cursor-pointer"
              />
              <img
                src={
                  "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png"
                }
                alt=""
                className="rounded-full w-14 h-14"
              />
              <div>
                <p className="font-semibold">{selectedChat?.chatName}</p>
                <p className="text-sm text-gray-400">
                  members: {selectedChat?.users?.length}
                </p>
              </div>
            </div>
            {chatExist === "groupInfo" ? (
              <div
                onClick={() => {
                  setChatExist("yes");
                }}
                className="p-2 border rounded-lg cursor-pointer hover:border-red-600 hover:bg-red-200"
              >
                <IoMdClose size={20} className="text-red-600" />
              </div>
            ) : (
              <div
                onClick={() => {
                  setChatExist("groupInfo");
                }}
                className="p-2 border rounded-lg cursor-pointer hover:border-indigo-600 hover:bg-indigo-300"
              >
                <FaInfo size={20} className="text-indigo-600" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-2 ">
            <div className="flex flex-row items-center gap-2">
              <IoMdArrowRoundBack
                size={24}
                onClick={() => {
                  setChatExist("default");
                }}
                className="text-gray-500 cursor-pointer"
              />

              <img
                src={selectedSender?.pic}
                alt=""
                className="rounded-full w-14 h-14"
              />
              <div>
                <p className="font-semibold">{selectedSender?.name}</p>
                <p className="text-sm text-gray-400">{selectedSender?.email}</p>
              </div>
            </div>
            <div
              onClick={() => navigate(`/profile/${selectedSender?._id}`)}
              className="p-2 border rounded-lg cursor-pointer hover:border-indigo-600 hover:bg-indigo-200"
            >
              <FaUser size={20} className="text-indigo-600" />
            </div>
          </div>
        )}

        {chatExist === "groupInfo" ? (
          <GroupInfo chat={selectedChat} />
        ) : (
          <div className="h-[calc(100vh-270px)] bg-white">
            <ScrollableChat messages={messages} />
          </div>
        )}

        <form onSubmit={sendMessage} className="px-4">
          <div className="flex gap-2 my-2">
            <input
              type="text"
              className="flex-grow px-4 py-2 border rounded-lg bg-gray-50"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <IoMdSend />
            </button>
          </div>
        </form>
      </>
    );

  const pendingChatPage = () => (
    //create a dialog box saying the user want to send you a message and tow buttons accept and reject
    <div className="flex flex-col items-center justify-center w-full h-full ">
      {selectedChat?.isGroupChat ? (
        <div className="mb-5 text-lg font-bold">
          {selectedChat?.groupAdmin?.name} is inviting you to join the '
          {selectedChat?.chatName}' chat.
        </div>
      ) : (
        <div className="mb-5 text-lg font-bold">
          {selectedSender?.name} wants to send you a message
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => acceptChat(selectedChat?._id)}
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => rejectChat(selectedChat?._id)}
          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  );

  const newChatPage = () => (
    //create a dialog box saying the user want to send you a message and tow buttons accept and reject
    <div className="flex flex-col items-center justify-center w-full h-full ">
      <div className="mb-5 text-lg font-bold">
        Do you want to start a new chat with {selectedSender?.name}.
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => accessChat(selectedSender?._id)}
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => handleClose()}
          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          No
        </button>
      </div>
    </div>
  );

  const createGroupPage = () => (
    <form
      className="flex flex-col w-full h-full p-8"
      onSubmit={handleCreateGroup}
    >
      <div className="mb-2 text-lg font-bold">Create Group:</div>
      <div className="relative z-0 w-full mb-2 group">
        <input
          type="text"
          name="title"
          id="title"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          placeholder=" "
          required
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
        />
        <label
          htmlFor="floating_email"
          className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Group Name
        </label>
      </div>
      <p className="mb-2 text-sm font-bold">Members:</p>
      <div className="max-h-[20rem] overflow-y-auto">
        {groupChatUsers?.map((user) => (
          <div className="flex flex-row items-center justify-between p-2 mb-2 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <img src={user?.pic} alt="" className="rounded-full w-14 h-14" />
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
            <div
              onClick={() => removeUserFromGroup(user)}
              className="p-2 bg-red-200 border border-red-600 rounded-lg cursor-pointer hover:bg-red-300"
            >
              <IoMdClose size={20} className="text-red-600" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Create
        </button>
        <button
          onClick={() => handleClose()}
          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </form>
  );

  const groupInfoPage = () =>
    selectedChat && (
      <>
        {selectedChat?.isGroupChat ? (
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <img
                src={
                  "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png"
                }
                alt=""
                className="rounded-full w-14 h-14"
              />
              <div>
                <p className="font-semibold">{selectedChat?.chatName}</p>
                <p className="text-sm text-gray-400">
                  members: {selectedChat?.users?.length}
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                setChatExist("yes");
              }}
              className="p-2 border rounded-lg cursor-pointer hover:border-red-600 hover:bg-red-200"
            >
              <IoMdClose size={20} className="text-red-600" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <img
                src={selectedSender?.pic}
                alt=""
                className="rounded-full w-14 h-14"
              />
              <div>
                <p className="font-semibold">{selectedSender?.name}</p>
                <p className="text-sm text-gray-400">{selectedSender?.email}</p>
              </div>
            </div>
            <div
              onClick={() => navigate(`/profile/${selectedSender?._id}`)}
              className="p-2 border rounded-lg cursor-pointer hover:border-indigo-600 hover:bg-indigo-200"
            >
              <FaUser size={20} className="text-indigo-600" />
            </div>
          </div>
        )}

        <GroupInfo chat={selectedChat} />
      </>
    );

  const tabs = {
    default: defaultPage(),
    yes: chatExistPage(),
    pending: pendingChatPage(),
    no: newChatPage(),
    group: createGroupPage(),
    groupInfo: groupInfoPage(),
  };
  return (
    <div className="flex flex-grow h-full px-6 py-8 bg-gray-100 lg:hidden md:px-16 lg:px-8">
      <div className="flex flex-col w-full h-full bg-gray-200">
        {tabs[chatExist]}
      </div>
    </div>
  );
};

export default MobileChatPage;
