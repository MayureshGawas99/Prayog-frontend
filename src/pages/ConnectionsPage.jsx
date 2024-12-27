import React, { useContext, useEffect, useState } from "react";
import {
  IoMdAdd,
  IoMdCheckmark,
  IoMdClose,
  IoMdPersonAdd,
} from "react-icons/io";
import { AppContext } from "../context/AppContext";
import { FaRegClock } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { set } from "date-fns";
import { useNavigate } from "react-router-dom";
const user = {
  _id: "1",
  name: "John Doe",
  email: "6sMwI@example.com",
  pic: "https://res.cloudinary.com/djuseai07/image/upload/v1734519942/1679422597271_jjgtts.jpg",
};

const ConnectionsPage = () => {
  const [invitations, setInvitations] = useState([]);
  const [pendingConnections, setPendingConnections] = useState([]);
  const [userNetwork, setUserNetwork] = useState([]);
  const [userConnections, setUserConnections] = useState([]);
  const { commonAxios, jwt } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSendConnectionRequest = async (user) => {
    try {
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/connection/request/${user._id}`
      );
      console.log(data);
      const updatedUserNetwork = userNetwork.filter(
        (connection) => connection._id !== user._id
      );
      setUserNetwork(updatedUserNetwork);
      setPendingConnections([...pendingConnections, user]);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleRemoveConnectionRequest = async (user) => {
    try {
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/connection/reject/${user._id}`
      );
      console.log(data);
      const updatedPendingConnections = pendingConnections.filter(
        (connection) => connection._id !== user._id
      );
      setPendingConnections(updatedPendingConnections);
      setUserNetwork([...userNetwork, user]);
      toast.success("Connection request removed");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const acceptConnectionRequest = async (user) => {
    try {
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/connection/accept/${user._id}`
      );
      console.log(data);
      const updatedInvitations = invitations.filter(
        (connection) => connection._id !== user._id
      );
      setInvitations(updatedInvitations);
      setUserConnections([...userConnections, user]);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const rejectConnectionRequest = async (user) => {
    try {
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/connection/reject/${user._id}`
      );
      console.log(data);
      const updatedInvitations = invitations.filter(
        (connection) => connection._id !== user._id
      );
      setInvitations(updatedInvitations);
      setUserNetwork([...userNetwork, user]);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
    }
  }, [jwt]);

  useEffect(() => {
    const fetchConnectionRequests = async () => {
      try {
        const { data } = await commonAxios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/connection/requests`
        );
        setPendingConnections(data.pendingUsers);
        setInvitations(data.requestedUsers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchConnectionRequests();
  }, []);

  useEffect(() => {
    const fetchUserConnection = async () => {
      try {
        const { data } = await commonAxios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/connections`
        );
        setUserConnections(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserConnection();
  }, []);

  useEffect(() => {
    const fetchUserNetwork = async () => {
      try {
        const { data } = await commonAxios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/network`
        );
        setUserNetwork(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserNetwork();
  }, []);

  return (
    <div className="flex-grow px-6 overflow-auto md:px-16 lg:px-32 ">
      <div className="grid grid-cols-1 lg:gap-8 lg:grid-cols-2 ">
        <div className="my-8 border border-gray-200 rounded-lg shadow-md ">
          <div className="p-4 text-base font-bold md:p-6 md:text-lg">
            Invitations:
          </div>
          <hr className="h-px bg-gray-200 border-0 " />
          <div className="p-2 md:p-6 max-h-[25rem] overflow-x-auto">
            {invitations?.map((user) => (
              <div
                key={user?._id}
                onClick={() => navigate(`/profile/${user?._id}`)}
                className="flex flex-row items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <div className="flex flex-row items-center gap-2 ">
                  <img
                    src={user?.pic}
                    alt="user pic"
                    className="w-10 h-10 rounded-full md:w-16 md:h-16 "
                  />
                  <div>
                    <p className="text-sm font-semibold md:text-base">
                      {user?.name}
                    </p>
                    <p className="text-xs md:text-sm ">{user?.email}</p>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      acceptConnectionRequest(user);
                    }}
                    className="p-2 bg-green-200 border border-green-600 rounded-lg cursor-pointer hover:bg-green-300"
                  >
                    <IoMdCheckmark size={20} className="text-green-600" />
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      rejectConnectionRequest(user);
                    }}
                    className="p-2 bg-red-200 border border-red-600 rounded-lg cursor-pointer hover:bg-red-300"
                  >
                    <IoMdClose size={20} className="text-red-600" />
                  </div>
                </div>
              </div>
            ))}
            {invitations.length === 0 && (
              <p className="text-gray-500">No pending invitations</p>
            )}
          </div>
        </div>
        <div className="mb-8 border border-gray-200 rounded-lg shadow-md lg:mt-8">
          <div className="p-4 text-base font-bold md:p-6 md:text-lg">
            Connect:
          </div>
          <hr className="h-px bg-gray-200 border-0 " />
          <div className="p-2 md:p-6 max-h-[25rem] overflow-x-auto">
            {userNetwork?.map((user) => (
              <div
                onClick={() => navigate(`/profile/${user?._id}`)}
                key={user?._id}
                className="flex flex-row items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <div className="flex flex-row items-center gap-2 ">
                  <img
                    src={user?.pic}
                    alt="user pic"
                    className="w-10 h-10 rounded-full md:w-16 md:h-16 "
                  />
                  <div>
                    <p className="text-sm font-semibold md:text-base">
                      {user?.name}
                    </p>
                    <p className="text-xs md:text-sm ">{user?.email}</p>
                  </div>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendConnectionRequest(user);
                  }}
                  className="p-2 bg-indigo-200 border border-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-300"
                >
                  <IoMdPersonAdd size={20} className="text-indigo-600" />
                </div>
              </div>
            ))}
            {userNetwork?.length === 0 && (
              <p className="text-gray-500">No connections</p>
            )}
          </div>
        </div>
      </div>
      <div className="mb-8 border border-gray-200 rounded-lg shadow-md ">
        <div className="p-4 text-base font-bold md:p-6 md:text-lg">
          My Connections:
        </div>
        <hr className="h-px bg-gray-200 border-0 " />
        <div className="p-2 md:p-6 max-h-[25rem] overflow-x-auto">
          {userConnections?.map((user) => (
            <div
              key={user?._id}
              onClick={() => navigate(`/profile/${user?._id}`)}
              className="flex flex-row items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex flex-row items-center gap-2 ">
                <img
                  src={user?.pic}
                  alt="user pic"
                  className="w-10 h-10 rounded-full md:w-16 md:h-16 "
                />
                <div>
                  <p className="text-sm font-semibold md:text-base">
                    {user?.name}
                  </p>
                  <p className="text-xs md:text-sm ">{user?.email}</p>
                </div>
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("button");
                }}
                className="p-2 bg-indigo-200 border border-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-300"
              >
                <BsChatDotsFill size={20} className="text-indigo-600" />
              </div>
            </div>
          ))}
          {userConnections.length === 0 && (
            <p className="text-gray-500">No connections</p>
          )}
        </div>
      </div>
      <div className="mb-8 border border-gray-200 rounded-lg shadow-md ">
        <div className="p-4 text-base font-bold md:p-6 md:text-lg">
          Pending Connections:
        </div>
        <hr className="h-px bg-gray-200 border-0 " />
        <div className="p-2 md:p-6 max-h-[25rem] overflow-x-auto">
          {pendingConnections?.map((user) => (
            <div
              key={user?._id}
              onClick={() => navigate(`/profile/${user?._id}`)}
              className="flex flex-row items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex flex-row items-center gap-2 ">
                <img
                  src={user?.pic}
                  alt="user pic"
                  className="w-10 h-10 rounded-full md:w-16 md:h-16 "
                />
                <div>
                  <p className="text-sm font-semibold md:text-base">
                    {user?.name}
                  </p>
                  <p className="text-xs md:text-sm ">{user?.email}</p>
                </div>
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveConnectionRequest(user);
                }}
                className="p-2 bg-yellow-200 border border-yellow-600 rounded-lg cursor-pointer hover:bg-yellow-300"
              >
                <FaRegClock size={20} className="text-yellow-600" />
              </div>
            </div>
          ))}
          {pendingConnections.length === 0 && (
            <p className="text-gray-500">No pending connections</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;
