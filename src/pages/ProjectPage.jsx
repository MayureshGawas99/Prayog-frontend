import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { FaHeart, FaRegCommentAlt, FaRegHeart } from "react-icons/fa";
import Loading from "../components/Loading";
import CommentSection from "../components/CommentSection";
import { MdOutlineFileDownload, MdEdit } from "react-icons/md";
import DeleteProjectModal from "../modals/DeleteProjectModal";

const ProjectPage = () => {
  const { projectId } = useParams();
  const { user, commonAxios } = useContext(AppContext);
  const [project, setProject] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLikeProject = async (like) => {
    try {
      // setLoading(true);
      const { data } = await commonAxios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/project/like/${projectId}`
      );
      toast.success(data?.message);
      if (like) {
        //add user._id in likedby of project
        let updatedlikedBy = [...project?.likedBy, user?._id];
        setProject({
          ...project,
          likedBy: updatedlikedBy,
          likeCount: updatedlikedBy.length,
        });
      } else {
        //remove user._id from likedby of project
        let updatedlikedBy = project?.likedBy.filter((id) => id !== user?._id);
        setProject({
          ...project,
          likedBy: updatedlikedBy,
          likeCount: updatedlikedBy.length,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    const fetchSingleProject = async () => {
      try {
        setLoading(true);
        const { data } = await commonAxios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/project/single/${projectId}`
        );
        setProject(data);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleProject();
  }, []);
  return (
    <div className="flex-grow px-6 overflow-auto md:px-16 lg:px-32">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loading color="indigo" />
        </div>
      ) : (
        <div>
          <div className="flex justify-center mt-8 lg:justify-start">
            <img
              src={project?.img}
              alt="project pic"
              className="object-cover w-[15rem] h-[15rem] md:w-[20rem] md:h-[20rem] rounded-xl "
            />
          </div>
          <div className="flex items-center justify-between my-4 md:my-8">
            <p className="text-2xl font-bold md:text-4xl ">{project?.title}</p>
            {project?.admin?._id === user?._id && (
              <div className="flex gap-2">
                <div
                  onClick={() => navigate(`/projects/edit/${project?._id}`)}
                  className="p-2 bg-indigo-200 border border-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-300"
                >
                  <MdEdit size={20} className="text-indigo-600" />
                </div>
                <DeleteProjectModal projectId={project?._id} />
              </div>
            )}
          </div>
          <p className="text-base text-justify text-gray-500 md:text-lg">
            {project?.description}
          </p>
          {project?.techstacks?.length ? (
            <div className="mt-4 md:mt-8">
              <p className="text-lg font-semibold">Tech Stack:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project?.techstacks?.map((tech, ind) => {
                  return (
                    <span
                      key={ind}
                      className="px-2 py-1 text-sm font-bold text-indigo-600 bg-indigo-200 border border-indigo-600 rounded-lg"
                    >
                      {tech}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <></>
          )}

          {project?.tags?.length ? (
            <div className="mt-4 md:mt-8">
              <p className="text-lg font-semibold">Tags:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project?.tags?.map((tag, ind) => {
                  return (
                    <span
                      key={ind}
                      className="px-2 py-1 text-sm font-bold text-indigo-600 bg-indigo-200 border border-indigo-600 rounded-lg"
                    >
                      #{tag}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <></>
          )}

          {project?.file && (
            <div className="mt-4 md:mt-8">
              <div className="flex justify-between">
                <p className="text-lg font-semibold">Paper:</p>
                <MdOutlineFileDownload
                  size={24}
                  className="cursor-pointer md:hidden"
                  onClick={() =>
                    window.open(
                      `${process.env.REACT_APP_BACKEND_URL}/api/project/pdf/${projectId}`
                    )
                  }
                />
              </div>
              <object
                data={`${process.env.REACT_APP_BACKEND_URL}/api/project/pdf/${projectId}`}
                // data={pdfUrl}
                type="application/pdf"
                className="w-full h-[10rem] md:h-[30rem] flex items-center mt-2"
              >
                <p>
                  Your browser does not support PDF viewing.{" "}
                  <a
                    className="text-indigo-500"
                    href={`${process.env.REACT_APP_BACKEND_URL}/api/project/pdf/${projectId}`}
                  >
                    Click here to Download the PDF
                  </a>
                  .
                </p>
              </object>
            </div>
          )}

          <div className="mt-4 md:mt-8">
            <p className="text-lg font-semibold">By:</p>
            <div
              onClick={() => navigate(`/profile/${project?.admin?._id}`)}
              className="flex flex-row items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <img
                src={project?.admin?.pic}
                alt="user pic"
                className="w-10 h-10 rounded-full md:w-16 md:h-16 "
              />
              <div>
                <p className="text-sm font-semibold md:text-base">
                  {project?.admin?.name}
                </p>
                <p className="text-xs md:text-sm ">{project?.admin?.email}</p>
              </div>
            </div>
          </div>

          {project?.collaborators?.length ? (
            <div className="mt-4 md:mt-8">
              <p className="text-lg font-semibold">Collaborators:</p>
              {project?.collaborators?.map((collaborator) => (
                <div
                  key={collaborator?._id}
                  onClick={() => navigate(`/profile/${collaborator?._id}`)}
                  className="flex flex-row items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 "
                >
                  <img
                    src={collaborator?.pic}
                    alt="user pic"
                    className="w-10 h-10 rounded-full md:w-16 md:h-16 "
                  />
                  <div>
                    <p className="text-sm font-semibold md:text-base">
                      {collaborator?.name}
                    </p>
                    <p className="text-xs md:text-sm ">{collaborator?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}

          <div className="flex flex-row justify-end gap-4 px-4 pb-2 mt-4 md:mt-8">
            <div className="flex flex-row items-center gap-1 cursor-pointer">
              {project?.likedBy?.includes(user?._id) ? (
                <FaHeart
                  onClick={() => handleLikeProject(false)}
                  size={24}
                  className="text-red-500"
                />
              ) : (
                <FaRegHeart
                  onClick={() => handleLikeProject(true)}
                  size={24}
                  className="text-red-500"
                />
              )}
              <span className="text-gray-500 ">{project?.likeCount}</span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <FaRegCommentAlt size={24} className="text-gray-500" />
              <span className="text-gray-500">
                {project?.totalCommentCount}
              </span>
            </div>
          </div>
          <hr className="h-px my-4 bg-gray-200 border-0 md:my-8 " />
          <CommentSection project={project} />
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
