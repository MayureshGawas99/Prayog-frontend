import React, { useEffect, useState } from "react";
import homeImage from "../assets/homeImage.png";
import createProject from "../assets/createProject.png";
import { FaHeart, FaRegCommentAlt } from "react-icons/fa";
import Loading from "../components/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/project`
        );
        setRecentProjects(data?.projects);
        console.log(data);
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
    <div className="flex-grow px-6 overflow-auto md:px-16 lg:px-32 ">
      {/* banner  */}
      <div className="relative my-8">
        <img
          src={homeImage}
          alt=""
          className="object-cover w-full h-[15rem] md:h-[25rem] rounded-2xl"
        />
        <div className="absolute px-8 bottom-4">
          <div className="p-4 glassmorphism md:p-6">
            <h1 class="mb-1 text-base font-extrabold leading-none tracking-tight text-gray-200 md:text-2xl lg:text-4xl ">
              Empower the next generation of innovators
            </h1>
            <p class="mb-1 text-xs lg:text-lg font-normal text-gray-200 text-justify ">
              We believe that every student has the potential to be a creator.
              Our mission is to provide students with the resources and
              mentorship they need to bring their ideas to life.
            </p>
            <a
              href="#"
              class="inline-flex items-center justify-center px-3 py-1 md:px-5 md:py-3 text-xs md:text-base font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 "
            >
              Explore
              <svg
                class="w-2 h-2 md:w-3.5 md:h-3.5 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mb-8 text-xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-4xl">
        Recently Added:
      </div>
      {loading ? (
        <div className="flex items-center justify-center mb-8 ">
          <Loading color="indigo" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 mb-8 sm:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map((project) => (
            <div
              key={project}
              onClick={() => navigate(`/project/${project._id}`)}
              className="flex flex-col justify-between transition-transform ease-in-out transform border border-gray-200 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:scale-105"
            >
              <div>
                <img
                  src={project?.img}
                  alt=""
                  className="object-cover w-full rounded-lg h-[15rem] "
                />
                <div className="p-2 px-4">
                  <p className="font-bold lg:text-lg line-clamp-2">
                    {project?.title}
                  </p>
                  <p className="mb-2 text-sm text-justify text-gray-500 lg:text-base line-clamp-3">
                    {project?.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project?.techstacks?.map((tech, ind) => {
                      if (ind > 1) return null;
                      return (
                        <span
                          key={ind}
                          className="px-2 py-1 text-sm font-bold text-indigo-600 bg-indigo-200 border border-indigo-600 rounded-lg"
                        >
                          {tech}
                        </span>
                      );
                    })}
                    {project?.techstacks?.length > 2 && (
                      <span className="px-2 py-1 text-sm font-bold text-indigo-600 bg-indigo-200 border border-indigo-600 rounded-lg">
                        +{project?.techstacks?.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <hr className="h-px my-2 bg-gray-200 border-0 " />
                <div className="flex flex-row gap-4 px-4 pb-2">
                  <div className="flex flex-row items-center gap-1">
                    <FaHeart size={20} className="text-red-500" />
                    <span className="text-sm text-gray-500">
                      {project?.likeCount}
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <FaRegCommentAlt size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {project?.totalCommentCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="h-px mb-8 bg-gray-200 border-0 " />

      <div className="grid grid-cols-1 mb-8 border border-gray-200 rounded-lg shadow-md lg:grid-cols-2">
        <img
          src={createProject}
          alt=""
          className="w-full h-[20rem] lg:h-auto"
        />
        <div className="flex flex-col justify-center p-6">
          <h1 class="mb-2 text-lg font-extrabold text-black md:text-xl lg:text-3xl ">
            Ready to showcase your project?
          </h1>
          <p class="mb-2 text-sm lg:text-base text-gray-500 text-justify ">
            We're always looking for innovative student projects to feature on
            our platform. If you have a project that you'd like to share with
            the world, we'd love to hear from you.
          </p>
          <button class="inline-flex w-full items-center justify-center px-5 py-3 text-base font-bold text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 ">
            Submit Your Project
            <svg
              class="w-2 h-2 md:w-3.5 md:h-3.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
