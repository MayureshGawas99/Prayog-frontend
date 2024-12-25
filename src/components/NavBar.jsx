import React, { useContext, useEffect, useState } from "react";
import { BsChatDotsFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../assets/logo.png";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, setUser, jwt, setJWT, activeTab, commonAxios } =
    useContext(AppContext);

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    setJWT("");
    setIsProfileOpen(false);
    navigate("/");
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await commonAxios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/details/self`
        );
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (jwt) {
      fetchUserDetails();
    }
  }, [jwt]);

  return (
    <nav className="bg-white border-b-2 border-gray-200 ">
      <div className="flex flex-wrap items-center justify-between p-4 ">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={logo} className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-bold whitespace-nowrap ">
            <span className="text-emerald-400">PRA</span>
            <span className="text-indigo-500">YOG</span>
          </span>
        </Link>

        <div className="flex items-center ">
          {user && (
            <>
              <div className="md:hidden relative mr-2.5">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-2 focus:ring-gray-300"
                  id="user-menu-button"
                  aria-expanded="false"
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="object-cover w-8 h-8 rounded-full"
                    src={user?.pic}
                    alt="user"
                  />
                </button>
                {/* Dropdown menu */}
                <div
                  className={`${
                    !isProfileOpen && "hidden"
                  } z-50 absolute top-6 right-0 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow `}
                  id="user-dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 ">
                      {user?.name}
                    </span>
                    <span className="block text-sm text-gray-500 truncate ">
                      {user?.email}
                    </span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <div
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate(`/profile/${user?._id}`);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                      >
                        Profile
                      </div>
                    </li>

                    <li>
                      <div
                        onClick={handleSignOut}
                        className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 "
                      >
                        Sign out
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                data-collapse-toggle="navbar-search"
                aria-controls="navbar-search"
                aria-expanded="false"
                className="md:hidden text-gray-500  hover:bg-gray-200  focus:outline-none focus:ring-4 focus:ring-gray-200  rounded-lg text-sm p-2.5 "
              >
                {/* <IoChatbubbleEllipsesOutline size={24} /> */}
                <BsChatDotsFill size={24} />
                <span className="sr-only">Search</span>
              </button>
            </>
          )}

          <button
            data-collapse-toggle="navbar-search"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            aria-controls="navbar-search"
            aria-expanded="false"
            className="md:hidden text-gray-500  hover:bg-gray-200  focus:outline-none focus:ring-4 focus:ring-gray-200  rounded-lg text-sm p-2.5"
          >
            <span className="sr-only">Open main menu</span>
            <GiHamburgerMenu size={24} />
          </button>
        </div>
        <div
          className={`items-center justify-between ${
            !isMenuOpen && "hidden"
          }  w-full md:flex md:w-auto md:gap-5 `}
          id="navbar-search"
        >
          <ul className="flex flex-col p-4 mt-4 font-bold bg-gray-100 border border-gray-200 rounded-lg md:p-0 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
            <li>
              <Link
                to={"/"}
                className={
                  activeTab === "home"
                    ? "block px-3 py-2 text-white bg-indigo-700 rounded md:bg-transparent md:text-indigo-700 md:p-0"
                    : "block px-3 py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
                }
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className={
                  activeTab === "projects"
                    ? "block px-3 py-2 text-white bg-indigo-700 rounded md:bg-transparent md:text-indigo-700 md:p-0"
                    : "block px-3 py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
                }
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="/connections"
                className={
                  activeTab === "connections"
                    ? "block px-3 py-2 text-white bg-indigo-700 rounded md:bg-transparent md:text-indigo-700 md:p-0"
                    : "block px-3 py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
                }
              >
                Connections
              </Link>
            </li>
          </ul>
          {user ? (
            <div className="items-center hidden md:flex ">
              <div className=" relative mr-2.5">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-2 focus:ring-gray-300 "
                  id="user-menu-button"
                  aria-expanded="false"
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="object-cover w-8 h-8 rounded-full"
                    src={user?.pic}
                    alt="user"
                  />
                </button>
                {/* Dropdown menu */}
                <div
                  className={`${
                    !isProfileOpen && "hidden"
                  } z-50 absolute top-6 right-0 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow `}
                  id="user-dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 ">
                      {user?.name}
                    </span>
                    <span className="block text-sm text-gray-500 truncate ">
                      {user?.email}
                    </span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <div
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate(`/profile/${user?._id}`);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 "
                      >
                        Profile
                      </div>
                    </li>

                    <li>
                      <div
                        onClick={handleSignOut}
                        className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 "
                      >
                        Sign out
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                data-collapse-toggle="navbar-search"
                aria-controls="navbar-search"
                aria-expanded="false"
                className=" text-gray-500  hover:bg-gray-200  focus:outline-none focus:ring-4 focus:ring-gray-200  rounded-lg text-sm p-2.5 "
              >
                <BsChatDotsFill size={24} />
                <span className="sr-only">Search</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mt-2 md:mt-0">
              <Link
                to="/login"
                className="px-6 py-2 text-sm font-bold text-center text-white bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700 focus:outline-none "
              >
                Login
              </Link>
              <Link
                to="/register"
                //   type="button"
                className="px-6 py-2 text-sm font-bold text-center text-indigo-700 bg-indigo-200 border border-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-300 focus:outline-none "
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
