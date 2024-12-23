import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { FaHeart, FaRegCommentAlt } from "react-icons/fa";
import Loading from "../components/Loading";
import CommentSection from "../components/CommentSection";

const ProjectPage = () => {
  const { projectId } = useParams();
  const { jwt } = useContext(AppContext);
  const [project, setProject] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/project/single/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        console.log(data);
        setProject(data);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
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
        <div>
          <div className="flex justify-center mt-8 lg:justify-start">
            <img
              src={project?.img}
              alt="project pic"
              className="object-cover w-[15rem] h-[15rem] md:w-[20rem] md:h-[20rem] rounded-xl "
            />
          </div>
          <p className="my-4 text-2xl font-bold md:my-8 md:text-4xl line-clamp-1">
            {project?.title}
          </p>
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
              <p className="text-lg font-semibold">Paper:</p>
              <object
                data={`${process.env.REACT_APP_BACKEND_URL}/api/project/pdf/${projectId}`}
                // data={pdfUrl}
                type="application/pdf"
                className="w-full h-[10rem] md:h-[30rem] flex items-center"
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

              {/* <embed
                src={`${process.env.REACT_APP_BACKEND_URL}/api/project/pdf/${projectId}`}
                type="application/pdf"
                width="100%"
                height="100%"
              /> */}
              {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={`${process.env.REACT_APP_BACKEND_URL}/api/project/pdf/${projectId}`}
                />
              </Worker> */}
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
                className="w-16 h-16 rounded-full "
              />
              <div>
                <p className="text-base font-semibold">
                  {project?.admin?.name}
                </p>
                <p className="text-sm ">{project?.admin?.email}</p>
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
                    className="w-16 h-16 rounded-full "
                  />
                  <div>
                    <p className="text-base font-semibold">
                      {collaborator?.name}
                    </p>
                    <p className="text-sm ">{collaborator?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}

          <div className="flex flex-row justify-end gap-4 px-4 pb-2 mt-4 md:mt-8">
            <div className="flex flex-row items-center gap-1 cursor-pointer">
              <FaHeart size={24} className="text-red-500" />
              <span className="text-gray-500 ">{project?.likeCount}</span>
            </div>
            <div className="flex flex-row items-center gap-1 cursor-pointer">
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
