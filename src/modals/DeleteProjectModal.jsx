import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DeleteProjectModal = ({ projectId }) => {
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] =
    useState(false);
  const { commonAxios } = useContext(AppContext);
  useState(false);
  const navigate = useNavigate();
  const handleDelteProject = async () => {
    try {
      const { data } = await commonAxios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/project/delete/${projectId}`
      );
      navigate("/projects");
      toast.success("Project deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div>
      <div
        onClick={() => setIsDeleteProjectModalOpen(!isDeleteProjectModalOpen)}
        className="p-2 bg-red-200 border border-red-600 rounded-lg cursor-pointer hover:bg-red-300"
      >
        <MdDelete size={20} className="text-red-600" />
      </div>
      {/* Modal */}
      {isDeleteProjectModalOpen && (
        <div
          id="popup-modal"
          className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen overflow-x-hidden overflow-y-auto md:inset-0 bg-black/50"
        >
          <div className="relative w-full max-w-md max-h-full p-4">
            <div className="relative bg-white rounded-lg shadow ">
              {/* Close Button */}
              <button
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                onClick={() => setIsDeleteProjectModalOpen(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>

              {/* Modal Content */}
              <div className="p-4 text-center md:p-5">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-400 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 ">
                  Are you sure you want to delete this Project?
                </h3>
                <div className="flex justify-center">
                  <button
                    onClick={handleDelteProject}
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    onClick={() => setIsDeleteProjectModalOpen(false)}
                    type="button"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-indigo-700 focus:z-10 focus:ring-4 focus:ring-gray-100 "
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteProjectModal;
