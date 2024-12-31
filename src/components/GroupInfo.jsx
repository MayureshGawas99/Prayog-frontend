import React, { useContext, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { setSeconds } from "date-fns";

const GroupInfo = ({ chat }) => {
  const {
    user,
    commonAxios,
    setSelectedChat,
    fetchChatsAgain,
    setFetchChatsAgain,
    setChatExist,
  } = useContext(AppContext);
  const [groupName, setGroupName] = useState(chat.chatName);
  const handleGroupRename = (e) => {
    try {
      e.preventDefault();
      const { data } = commonAxios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/group/rename`,
        { chatId: chat._id, chatName: groupName }
      );
      setSelectedChat({ ...chat, chatName: groupName });
      setFetchChatsAgain(!fetchChatsAgain);
      toast.success("Group renamed");
    } catch (error) {
      console.log(error);
      toast.error("Failed to rename group");
    }
  };

  const removeUserFromGroup = async (member) => {
    try {
      const { data } = await commonAxios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/group/remove`,
        { chatId: chat._id, userId: member._id }
      );
      const updatedUsers = chat.users.filter((u) => u._id !== member._id);
      setSelectedChat({ ...chat, users: updatedUsers });
      setFetchChatsAgain(!fetchChatsAgain);
      toast.success("Member removed");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove member");
    }
  };

  const leaveGroup = async () => {
    try {
      const { data } = await commonAxios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/group/leave`,
        { chatId: chat._id }
      );
      setChatExist("default");
      setSelectedChat(null);
      setFetchChatsAgain(!fetchChatsAgain);
      toast.success("Left group");
    } catch (error) {
      console.log(error);
      toast.error("Failed to leave group");
    }
  };

  const deleteGroup = async () => {
    try {
      const { data } = await commonAxios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/group/delete/${chat._id}`
      );
      setChatExist("default");
      setSelectedChat(null);
      setFetchChatsAgain(!fetchChatsAgain);
      toast.success("Group deleted");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete group");
    }
  };
  return (
    <div className="flex flex-col flex-grow w-full h-full px-4 py-4 bg-white">
      {chat?.groupAdmin?._id === user?._id && (
        <form
          onSubmit={handleGroupRename}
          className="flex flex-row items-center gap-2"
        >
          <div className="relative z-0 w-full mb-2 group">
            <input
              type="text"
              name="title"
              id="title"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <label
              htmlFor="floating_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Group Name
            </label>
          </div>
          <button
            type="submit"
            className="p-2 rounded-lg cursor-pointer hover:border hover:border-indigo-600 hover:bg-indigo-200"
          >
            <MdEdit size={20} className="text-indigo-600" />
          </button>
        </form>
      )}
      <p className="mb-2 text-sm font-bold">Members:</p>
      <div className="max-h-[20rem] overflow-y-auto">
        {chat?.users?.map((member) => (
          <div className="flex flex-row items-center justify-between p-2 mb-2 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <img
                src={member?.pic}
                alt=""
                className="rounded-full w-14 h-14"
              />
              <div>
                <div className="flex flex-row items-center gap-2">
                  <p className="font-semibold">{member?.name}</p>
                  {chat?.groupAdmin?._id === member?._id && (
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{member?.email}</p>
              </div>
            </div>
            {chat?.groupAdmin?._id === user?._id &&
              chat?.groupAdmin?._id !== member?._id && (
                <div
                  onClick={() => removeUserFromGroup(member)}
                  className="p-2 rounded-lg cursor-pointer hover:border hover:border-red-600 hover:bg-red-200"
                >
                  <IoMdClose size={20} className="text-red-600" />
                </div>
              )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {chat?.groupAdmin?._id === user?._id ? (
          <>
            <button
              type="button"
              // onClick={leaveGroup}
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Add Members
            </button>
            <button
              type="button"
              onClick={deleteGroup}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete Group
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={leaveGroup}
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Leave Group
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupInfo;
