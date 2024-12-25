import React, { useContext, useEffect, useState } from "react";
import { FaHeart, FaRegCommentAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import axios from "axios";

const AddProjectPage = () => {
  const { commonAxios, user, jwt } = useContext(AppContext);
  const navigate = useNavigate();
  const [project, setProject] = useState({
    title: "",
    description: "",
    collaborators: [],
    tags: [],
    techstacks: [],
    img: "https://www.liquidplanner.com/wp-content/uploads/2019/04/HiRes-17.jpg",
    likeCount: 0,
    commentCount: 0,
  });
  const [tag, setTag] = useState("");
  const [techStack, setTechStack] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    if (!jwt) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [jwt]);

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
      } catch (error) {
        console.log(error);
      } finally {
        setSearchLoading(false);
      }
    };
    if (debouncedSearch) {
      searchUsers();
    }
  }, [debouncedSearch]);

  const handleAddTags = () => {
    if (!tag) {
      toast.error("Tag cannot be empty");
      return;
    }
    if (project?.tags?.includes(tag)) {
      toast.error("Tag already exists");
      setTag("");
      return;
    }
    const newTags = [...project?.tags, tag];
    setProject({ ...project, tags: newTags });
    setTag("");
  };

  const handleAddTechStack = () => {
    if (!techStack) {
      toast.error("TechStack cannot be empty");
      return;
    }
    if (project?.techstacks?.includes(techStack)) {
      toast.error("TechStack already exists");
      setTechStack("");
      return;
    }
    const newTechStack = [...project?.techstacks, techStack];
    setProject({ ...project, techstacks: newTechStack });
    setTechStack("");
  };

  const handleAddCollaborator = (user) => {
    const userIds = project?.collaborators?.map((c) => c._id);

    if (userIds?.includes(user?._id)) {
      toast.error("User already added");
      return;
    }
    const newCollaborators = [...project?.collaborators, user];
    setProject({ ...project, collaborators: newCollaborators });
  };

  const handleRemoveCollaborator = (user) => {
    const newCollaborators = project?.collaborators?.filter(
      (c) => c._id !== user?._id
    );
    setProject({ ...project, collaborators: newCollaborators });
  };

  const handleRemoveTag = (tag) => {
    const newTags = project?.tags?.filter((t) => t !== tag);
    setProject({ ...project, tags: newTags });
  };

  const handleRemoveTechStack = (tech) => {
    const newTechStack = project?.techstacks?.filter((t) => t !== tech);
    setProject({ ...project, techstacks: newTechStack });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = {};
    formData.title = project?.title;
    formData.description = project?.description;
    formData.tags = JSON.stringify(project?.tags);
    formData.techstacks = JSON.stringify(project?.techstacks);
    formData.collaborators = JSON.stringify(
      project?.collaborators?.map((c) => c._id)
    );
    formData.file = pdfFile;
    if (image) {
      const cloudData = new FormData();
      cloudData.append("file", image);
      cloudData.append("upload_preset", "chat-app");
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/djuseai07/image/upload`,
        cloudData
      );
      formData.img = response.data.url;
    } else {
      formData.img = project?.img;
    }

    try {
      await commonAxios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/project/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Project updated successfully");
      navigate("/profile/" + user?._id);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex-grow px-6 overflow-auto md:px-16 lg:px-32 ">
      <div className="my-8 ">
        <div className="">
          <p className="font-bold">Add Project:</p>
          <form
            onSubmit={handleSubmit}
            className="p-6 mx-auto my-8 border border-gray-200 rounded-lg shadow-md "
          >
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="title"
                id="title"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                placeholder=" "
                required
                value={project?.title}
                onChange={(e) =>
                  setProject({ ...project, title: e.target.value })
                }
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Title
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <textarea
                type="text"
                name="description"
                id="description"
                className="block resize-none h-[8rem] py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                placeholder=" "
                value={project?.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
                }
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-indigo-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[28px]"
              >
                Description
              </label>
            </div>

            <div className="mb-2">
              <div>
                <label
                  className="block mb-2 text-sm text-gray-500"
                  htmlFor="file_input"
                >
                  Upload Thumbnail
                </label>
                <input
                  className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none "
                  id="file_input"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    //take thr image as set it as project.img in such a way that a img tag can use it as src
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProject({ ...project, img: reader.result });
                    };
                    reader.readAsDataURL(file);
                    setImage(e.target.files[0]);
                  }}
                />
              </div>
            </div>

            <div className="mb-2">
              {project?.tags?.map((tag, index) => {
                return (
                  <span
                    onClick={() => handleRemoveTag(tag)}
                    key={index}
                    className="cursor-pointer inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                );
              })}
            </div>
            <div className="flex flex-row items-center gap-5 mb-2">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                  placeholder=" "
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
                <label
                  htmlFor="floating_first_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-indigo-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Tags
                </label>
              </div>
              <button
                onClick={handleAddTags}
                type="button"
                className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center "
              >
                Add
              </button>
            </div>

            <div className="mb-2">
              {project?.techstacks?.map((tech, index) => {
                return (
                  <span
                    onClick={() => handleRemoveTechStack(tech)}
                    key={index}
                    className="cursor-pointer inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                );
              })}
            </div>
            <div className="flex flex-row items-center gap-5 mb-2">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                  placeholder=" "
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                />
                <label
                  htmlFor="floating_first_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-indigo-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  TechStack
                </label>
              </div>
              <button
                onClick={handleAddTechStack}
                type="button"
                className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center "
              >
                Add
              </button>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-500">Collaborators</p>
              {project?.collaborators?.length ? (
                <div className="mb-2">
                  {project?.collaborators?.map((collaborator) => (
                    <div
                      key={collaborator?._id}
                      className="flex flex-row items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex flex-row items-center gap-2 ">
                        <img
                          src={collaborator?.pic}
                          alt="user pic"
                          className="w-16 h-16 rounded-full "
                        />
                        <div>
                          <p className="text-base font-semibold">
                            {collaborator?.name}
                          </p>
                          <p className="text-sm ">{collaborator?.email}</p>
                        </div>
                      </div>
                      <div
                        onClick={() => handleRemoveCollaborator(collaborator)}
                        className="p-2 bg-red-200 border border-red-600 rounded-lg cursor-pointer hover:bg-red-300"
                      >
                        <IoMdClose size={20} className="text-red-600" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="mb-2">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only "
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                  <svg
                    className="w-4 h-4 text-gray-500 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Search Users"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
              </div>
            </div>

            {searchLoading ? (
              <div className="flex items-center justify-center mb-8 ">
                <Loading color="indigo" />
              </div>
            ) : searchResults?.length ? (
              <div className="mb-2">
                {searchResults?.map((user) => (
                  <div
                    key={user?._id}
                    className="flex flex-row items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex flex-row items-center gap-2 ">
                      <img
                        src={user?.pic}
                        alt="user pic"
                        className="w-16 h-16 rounded-full "
                      />
                      <div>
                        <p className="text-base font-semibold">{user?.name}</p>
                        <p className="text-sm ">{user?.email}</p>
                      </div>
                    </div>
                    <div
                      onClick={() => handleAddCollaborator(user)}
                      className="p-2 bg-indigo-200 border border-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-300"
                    >
                      <IoMdAdd size={20} className="text-indigo-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-gray-500">No User Found</p>
            )}

            <div className="mb-2">
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="file_input"
                >
                  Upload pdf file
                </label>
                <input
                  className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none "
                  id="file_input"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                />
              </div>
            </div>

            <button
              type="submit"
              className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
            >
              Create
            </button>
          </form>
        </div>
        <div className="">
          <p className="font-bold">Preview:</p>
          <div className="flex items-center justify-center">
            <div
              className={`w-[25rem] flex-col justify-between overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg`}
            >
              <div>
                <img
                  src={project?.img}
                  alt={project?.title}
                  className="object-cover w-full h-48"
                />
                <div className="p-4">
                  <h2 className="mb-2 text-xl font-semibold text-gray-800">
                    {project?.title}
                  </h2>

                  <div className="mb-2">
                    {project?.tags?.map((tag, index) => {
                      if (index > 1) return null;
                      return (
                        <span
                          key={index}
                          className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      );
                    })}
                    {project?.tags?.length > 2 && (
                      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                        +{project?.tags?.length - 2}
                      </span>
                    )}
                  </div>

                  <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                    {project?.description}
                  </p>

                  {project?.techstacks?.length ? (
                    <div className="mb-4 text-sm text-gray-700 line-clamp-2">
                      <strong>Tech Stacks:</strong>{" "}
                      {project?.techstacks.join(", ")}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex flex-row items-center gap-2">
                    <FaHeart className="text-red-500" />
                    <span role="img" aria-label="likes" className="mr-1">
                      {project?.likeCount}
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <FaRegCommentAlt />
                    <span role="img" aria-label="comments" className="mr-1">
                      {project?.commentCount}
                    </span>
                  </div>
                </div>

                <button className="w-full px-4 py-2 mt-4 text-white transition-colors bg-indigo-500 rounded hover:bg-indigo-600">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectPage;
