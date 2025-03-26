import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Admin = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!user) {
    return <Navigate to="/admin-login" />;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // No need to navigate here since it's handled in AuthContext
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <div className="p-8 relative">
      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#23262d] p-6 rounded-lg border border-[rgb(136,58,234)] max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Logout</h3>
            <p className="text-[rgb(224,204,250)] mb-6">
              Are you sure you want to log out of the admin panel?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-300"
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-md ${
                  isLoggingOut
                    ? "bg-red-700 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                } text-white transition-colors duration-300`}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging Out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Content */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`bg-red-500 text-white px-4 py-2 rounded-md ${
            isLoggingOut ? "cursor-not-allowed opacity-75" : "hover:bg-red-600"
          } transition-colors duration-300`}
          disabled={isLoggingOut}
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold text-white mb-8 text-center">Admin Panel</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Link
          to="/admin/courses"
          className="bg-[#23262d] p-6 rounded-lg border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 flex flex-col items-center hover:bg-[#2b2e36]"
        >
          <h2 className="text-xl font-bold text-white text-center">Manage Courses</h2>
        </Link>
        <Link
          to="/admin/blogs"
          className="bg-[#23262d] p-6 rounded-lg border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 flex flex-col items-center hover:bg-[#2b2e36]"
        >
          <h2 className="text-xl font-bold text-white text-center">Manage Blogs</h2>
        </Link>
        <Link
          to="/admin/events"
          className="bg-[#23262d] p-6 rounded-lg border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 flex flex-col items-center hover:bg-[#2b2e36]"
        >
          <h2 className="text-xl font-bold text-white text-center">Manage Events</h2>
        </Link>
        <Link
          to="/admin/labs"
          className="bg-[#23262d] p-6 rounded-lg border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 flex flex-col items-center hover:bg-[#2b2e36]"
        >
          <h2 className="text-xl font-bold text-white text-center">Manage Labs</h2>
        </Link>
        <Link
          to="/admin/resources"
          className="bg-[#23262d] p-6 rounded-lg border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 flex flex-col items-center hover:bg-[#2b2e36]"
        >
          <h2 className="text-xl font-bold text-white text-center">Manage Resources</h2>
        </Link>
        <Link
          to="/admin/members"
          className="bg-[#23262d] p-6 rounded-lg border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 flex flex-col items-center hover:bg-[#2b2e36]"
        >
          <h2 className="text-xl font-bold text-white text-center">Manage Members</h2>
        </Link>
      </div>
    </div>
  );
};

export default Admin;