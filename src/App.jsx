import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Events from "./pages/Events";
import Resources from "./pages/Resources";
import Members from "./pages/Members";
import About from "./pages/About";
import Blog from "./pages/Blogs";
import Labs from "./pages/Labs";
import UserProfile from "./pages/UserProfile";
import ScrollToTop from "./components/ScrollToTop"; // Import ScrollToTop

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Add this component */}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/events" element={<Events />} />
          <Route path="/members" element={<Members />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/labs' element={<Labs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
