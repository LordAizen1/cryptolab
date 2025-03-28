import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
// import CourseDetails from "./pages/CourseDetails";
import Events from "./pages/Events";
import Resources from "./pages/Resources";
import Members from "./pages/Members";
import About from "./pages/About";
import Blog from "./pages/Blogs";
import Labs from "./pages/Labs";
import ScrollToTop from "./components/ScrollToTop";

import AdminLogin from "./components/admin/AdminLogin";
import Admin from "./components/admin/AdminDashboard";
import AdminHome from "./components/admin/AdminHome";
import AdminCourses from "./components/admin/AdminCourses";
import AdminResources from "./components/admin/AdminResources";
import AdminLabs from "./components/admin/AdminLabs";
import AdminEvents from "./components/admin/AdminEvents";
import AdminMembers from "./components/admin/AdminMembers";
import AdminBlogs from "./components/admin/AdminBlogs";
import AdminAbout from "./components/admin/AdminAbout";

import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          {/* <Route path="/courses/:courseId" element={<CourseDetails />} /> */}
          <Route path="/resources" element={<Resources />} />
          <Route path="/events" element={<Events />} />
          <Route path="/members" element={<Members />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/labs" element={<Labs />} />

          {/* Admin routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={user ? <Admin /> : <Navigate to="/admin-login" />}
          />
          <Route
            path="/admin/home"
            element={user ? <AdminHome /> : <Navigate to="/admin-login" />}
          />
          <Route
            path="/admin/courses"
            element={user ? <AdminCourses /> : <Navigate to="/admin-login" />}
          />
          <Route
            path="/admin/resources"
            element={user ? <AdminResources /> : <Navigate to="/admin-login" />}
          />
          <Route
            path="/admin/labs"
            element={user ? <AdminLabs /> : <Navigate to="/admin-login" />}
          />
          <Route
            path="/admin/events"
            element={user ? <AdminEvents /> : <Navigate to="/admin-login" />}
          />
          <Route
            path="/admin/members"
            element={user ? <AdminMembers /> : <Navigate to="/admin-login" />}
          />
          <Route
            path="/admin/blogs"
            element={user ? <AdminBlogs /> : <Navigate to="/admin-login" />}
          />
          <Route
            path="/admin/about"
            element={user ? <AdminAbout /> : <Navigate to="/admin-login" />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;