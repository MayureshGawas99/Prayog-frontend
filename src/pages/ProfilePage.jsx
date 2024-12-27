import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdAdd, IoMdPersonAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ProfilePage = () => {
  const { jwt, user, commonAxios } = useContext(AppContext);
  const [userProjects, setUserProjects] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [userCollabProjects, setUserCollabProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
    }
  }, [jwt]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const { data } = await commonAxios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/details/${userId}`
        );
        setUserDetails(data);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        setLoading(true);
        const { data } = await commonAxios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/project/user-projects/${userId}`
        );
        setUserProjects(data?.projects);
        setUserCollabProjects(data?.collaboratedProjects);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentProjects();
  }, []);
  return (
    <div className="flex-grow px-6 overflow-auto md:px-16 lg:px-32">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loading color="indigo" />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-8 mt-8 sm:flex-row sm:items-start ">
            <div className="w-[20rem] h-[20rem]  flex-shrink-0">
              <img
                src={userDetails?.pic}
                alt="user profile pic"
                className="object-cover w-[20rem] h-[20rem] rounded-xl "
              />
            </div>
            <div className="flex-grow w-full">
              <div className="mb-2">
                <div className="flex flex-row items-center justify-between">
                  <p className="text-2xl font-bold">{userDetails?.name}</p>
                  {userDetails?._id === user?._id ? (
                    <div className="p-2 bg-indigo-200 border border-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-300">
                      <MdEdit size={20} className="text-indigo-600" />
                    </div>
                  ) : (
                    <div
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   handleSendConnectionRequest(user);
                      // }}
                      className="p-2 bg-indigo-200 border border-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-300"
                    >
                      <IoMdPersonAdd size={20} className="text-indigo-600" />
                    </div>
                  )}
                </div>
                <p className="text-indigo-600">{userDetails?.headline}</p>
              </div>
              {
                userDetails?._id === user?._id && (
                  <button
                    type="button"
                    onClick={() => navigate("/projects/create")}
                    className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 focus:outline-none flex flex-row gap-2 "
                  >
                    <span>Add Project</span>
                    <IoMdAdd size={20} />
                  </button>
                )
                // : (
                //   <button
                //     type="button"
                //     className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 focus:outline-none flex flex-row gap-2 "
                //   >
                //     <span>Connect</span>
                //     <IoMdPersonAdd size={20} />
                //   </button>
                // )
              }
              <div className="mb-2">
                <p className="text-lg font-semibold">Email:</p>
                <p className="text-gray-500">{userDetails?.email}</p>
              </div>
              {userDetails?.organization && (
                <div className="mb-2">
                  <p className="text-lg font-semibold">Organization:</p>
                  <p className="text-gray-500">{userDetails?.organization}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 mt-2 xl:gap-8 xl:mt-4 xl:flex-row xl:items-start">
            <div className="w-full xl:w-[20rem] flex-shrink-0">
              <p className="mb-2 text-lg font-semibold">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {userDetails?.skills?.map((skill, ind) => (
                  <span
                    key={ind}
                    className="px-2 py-1 text-sm font-bold text-indigo-600 bg-indigo-200 border border-indigo-600 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
                {userDetails?.skills?.length === 0 && (
                  <p className="text-gray-500">No skills added</p>
                )}
              </div>
            </div>
            <div className="flex-grow w-full">
              <div className="mb-2">
                <p className="text-lg font-semibold">About:</p>
                <p className="text-justify text-gray-500">
                  {userDetails?.about || "No about added"}
                </p>
              </div>
              <div className="mb-2">
                <p className="mb-2 text-lg font-semibold">Projects:</p>
                {userProjects?.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="flex flex-row gap-4 p-4 mb-4 transition-transform ease-in-out transform border border-gray-200 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:scale-105"
                  >
                    <img
                      src={project?.img}
                      alt=""
                      className="w-[6rem] h-[6rem] lg:w-[10rem] lg:h-[10rem] object-cover"
                    />
                    <div>
                      <p className="text-base font-bold lg:text-lg line-clamp-1">
                        {project?.title}
                      </p>
                      <p className="mb-2 text-xs text-justify text-gray-500 lg:text-sm line-clamp-2">
                        {project?.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project?.techstacks?.map((tech, index) => {
                          if (index > 1) return null;
                          return (
                            <span
                              key={index}
                              className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mr-1 md:mr-2 px-2.5 py-0.5 rounded"
                            >
                              {tech}
                            </span>
                          );
                        })}
                        {project?.techstacks?.length > 2 && (
                          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mr-1 md:mr-2 px-2.5 py-0.5 rounded">
                            +{project?.techstacks?.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {userProjects?.length === 0 && (
                  <p className="text-gray-500 ">No projects to display</p>
                )}
              </div>
              <div className="mb-2">
                <p className="mb-2 text-lg font-semibold">
                  Collaborated Projects:
                </p>
                {userCollabProjects?.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="flex flex-row gap-4 p-4 mb-4 transition-transform ease-in-out transform border border-gray-200 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:scale-105"
                  >
                    <img
                      src={project?.img}
                      alt=""
                      className="w-[6rem] h-[6rem] lg:w-[10rem] lg:h-[10rem] object-cover"
                    />
                    <div>
                      <p className="text-base font-bold lg:text-lg line-clamp-1">
                        {project?.title}
                      </p>
                      <p className="mb-2 text-xs text-justify text-gray-500 lg:text-sm line-clamp-2">
                        {project?.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project?.techstacks?.map((tech, index) => {
                          if (index > 1) return null;
                          return (
                            <span
                              key={index}
                              className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mr-1 md:mr-2 px-2.5 py-0.5 rounded"
                            >
                              {tech}
                            </span>
                          );
                        })}
                        {project?.techstacks?.length > 2 && (
                          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mr-1 md:mr-2 px-2.5 py-0.5 rounded">
                            +{project?.techstacks?.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {userCollabProjects?.length === 0 && (
                  <p className="text-gray-500 ">No projects to display</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // </div>
};

export default ProfilePage;
