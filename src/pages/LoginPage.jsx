import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { setJWT } = useContext(AppContext);

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      console.log(email, password);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/login`,
        { email, password }
      );
      toast.success("Login Successful");
      localStorage.setItem("jwt", data.token);
      setJWT(data.token);
      console.log(data);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow bg-gradient-to-r from-emerald-400 to-indigo-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Log in to your Account
        </h2>
        <form id="registrationForm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
          >
            {loading ? <Loading color="white" /> : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to={"/register"} className="font-semibold text-indigo-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
