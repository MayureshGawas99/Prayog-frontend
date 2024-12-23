import { Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ToastContainer } from "react-toastify";
import ProfilePage from "./pages/ProfilePage";
import ProjectPage from "./pages/ProjectPage";
import { Tooltip } from "react-tooltip";
import AllProjectsPage from "./pages/AllProjectsPage";
import { useContext, useEffect } from "react";
import { AppContext } from "./context/AppContext";

function App() {
  const { setActiveTab } = useContext(AppContext);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("home");
    } else if (location.pathname.startsWith("/projects")) {
      setActiveTab("projects");
    } else if (location.pathname.startsWith("/connections")) {
      setActiveTab("connections");
    }
  }, [location]);
  return (
    <div className="flex flex-col h-screen App">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Tooltip id="my-tooltip" />
    </div>
  );
}

export default App;
