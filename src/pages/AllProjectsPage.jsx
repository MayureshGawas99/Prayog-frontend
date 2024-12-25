import React, { useContext, useEffect, useState } from "react";
import { FaHeart, FaRegCommentAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const AllProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchAgain, setFetchAgain] = useState(false);
  const { commonAxios } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        setLoading(true);
        const { data } = await commonAxios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/project?page=${currentPage}`
        );
        if (currentPage === 1) {
          setFilteredProjects(data?.projects);
        } else {
          setFilteredProjects((prev) => [...prev, ...data?.projects]);
        }
        setTotalPages(data?.totalPages);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentProjects();
  }, [fetchAgain]);

  const handleSearch = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      if (searchTerm) {
        const { data } = await commonAxios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/project/search?searchTerm=${searchTerm}&filter=${selectedFilter}`
        );
        setCurrentPage(1);
        setTotalPages(1);
        setFilteredProjects(data);
      } else {
        setCurrentPage(1);
        setTotalPages(1);
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow px-6 overflow-auto md:px-16 lg:px-32">
      <div className="my-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">All Projects</h1>

        <div className="mb-6">
          <form className="max-w-md " onSubmit={handleSearch}>
            <div className="relative flex">
              <label
                htmlFor="location-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only "
              >
                Your Email
              </label>
              <button
                id="dropdown-button-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                data-dropdown-toggle="dropdown-search-city"
                className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 "
                type="button"
              >
                {selectedFilter}{" "}
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="dropdown-search-city"
                className={`z-10 absolute top-12 ${
                  !isFilterOpen && "hidden"
                } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 `}
              >
                <ul
                  className="py-2 text-sm text-gray-700 "
                  aria-labelledby="dropdown-button-2"
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFilter("All");
                        setIsFilterOpen(false);
                      }}
                      className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                      role="menuitem"
                    >
                      <div className="inline-flex items-center">All</div>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFilter("By Title");
                        setIsFilterOpen(false);
                      }}
                      className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                      role="menuitem"
                    >
                      <div className="inline-flex items-center">By Title</div>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFilter("By Description");
                        setIsFilterOpen(false);
                      }}
                      className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                      role="menuitem"
                    >
                      <div className="inline-flex items-center">
                        By Description
                      </div>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFilter("By Tags");
                        setIsFilterOpen(false);
                      }}
                      className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                      role="menuitem"
                    >
                      <div className="inline-flex items-center">By Tags</div>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFilter("By TechStack");
                        setIsFilterOpen(false);
                      }}
                      className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                      role="menuitem"
                    >
                      <div className="inline-flex items-center">
                        By TechStack
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
              <div className="relative w-full">
                <input
                  type="search"
                  id="location-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 "
                  placeholder="Search for projects"
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-indigo-700 rounded-e-lg border border-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 "
                >
                  <svg
                    className="w-4 h-4"
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
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center mb-8 ">
            <Loading color="indigo" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProjects?.map((project) => (
                <div
                  key={project._id}
                  className="flex flex-col justify-between overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg"
                >
                  <div>
                    <img
                      src={project.img}
                      alt={project.title}
                      className="object-cover w-full h-48"
                    />
                    <div className="p-4">
                      <h2 className="mb-2 text-xl font-semibold text-gray-800">
                        {project.title}
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
                        {project.description}
                      </p>

                      {project?.techstacks?.length ? (
                        <div className="mb-4 text-sm text-gray-700 line-clamp-2">
                          <strong>Tech Stacks:</strong>{" "}
                          {project.techstacks.join(", ")}
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
                          {project.likeCount}
                        </span>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <FaRegCommentAlt />
                        <span role="img" aria-label="comments" className="mr-1">
                          {project.commentCount}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/projects/${project._id}`)}
                      className="w-full px-4 py-2 mt-4 text-white transition-colors bg-indigo-500 rounded hover:bg-indigo-600"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects?.length === 0 && (
              <p className="mt-6 text-center text-gray-600">
                No projects found.
              </p>
            )}
          </>
        )}

        {currentPage < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                setCurrentPage(currentPage + 1);
                setFetchAgain(!fetchAgain);
              }}
              className="px-6 py-2 text-white transition-colors bg-indigo-500 rounded hover:bg-indigo-600"
            >
              Load More Projects
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjectsPage;
