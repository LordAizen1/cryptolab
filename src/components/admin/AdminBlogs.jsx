import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Calendar, User, Edit, Trash2, ChevronRight, ArrowLeft, Check, X } from 'lucide-react';
import { firestore } from '../../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState({ pending: [], approved: [] });
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      if (typeof date.toDate === 'function') {
        return date.toDate().toLocaleDateString();
      }
      if (date.seconds) {
        return new Date(date.seconds * 1000).toLocaleDateString();
      }
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
      }
      return "N/A";
    } catch {
      return "N/A";
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const [pendingQuery, approvedQuery] = [
          query(
            collection(firestore, 'blogs'),
            where('approved', '==', false),
            orderBy('date', 'desc')
          ),
          query(
            collection(firestore, 'blogs'),
            where('approved', '==', true),
            orderBy('date', 'desc')
          )
        ];

        const [pendingSnap, approvedSnap] = await Promise.all([
          getDocs(pendingQuery),
          getDocs(approvedQuery)
        ]);

        setBlogs({
          pending: pendingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          approved: approvedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        });
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleApproveBlog = async (blogId) => {
    try {
      await updateDoc(doc(firestore, 'blogs', blogId), { approved: true });
      setBlogs(prev => ({
        pending: prev.pending.filter(blog => blog.id !== blogId),
        approved: [...prev.approved, prev.pending.find(blog => blog.id === blogId)]
      }));
    } catch (error) {
      console.error("Error approving blog:", error);
    }
  };

  const handleDeleteBlog = async (blogId, isPending = false) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteDoc(doc(firestore, 'blogs', blogId));
        setBlogs(prev => ({
          pending: isPending ? prev.pending.filter(blog => blog.id !== blogId) : prev.pending,
          approved: isPending ? prev.approved : prev.approved.filter(blog => blog.id !== blogId)
        }));
        if (selectedBlog?.id === blogId) {
          setSelectedBlog(null);
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading blogs...</div>
      </div>
    );
  }

  if (selectedBlog) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setSelectedBlog(null)}
            className="flex items-center text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] mb-4"
          >
            <ChevronRight className="h-5 w-5 mr-1 transform rotate-180" />
            Back to all blogs
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-white hover:text-[rgb(136,58,234)] transition-colors duration-300 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back to Dashboard
          </button>
        </div>

        <div className="bg-[#23262d] rounded-lg border border-[rgb(136,58,234)] p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">{selectedBlog.title}</h2>
            <div className="flex space-x-2">
              {!selectedBlog.approved && (
                <button 
                  onClick={() => handleApproveBlog(selectedBlog.id)}
                  className="text-green-500 hover:text-green-400 p-1"
                  title="Approve"
                >
                  <Check className="h-5 w-5" />
                </button>
              )}
              <button 
                onClick={() => handleDeleteBlog(selectedBlog.id, !selectedBlog.approved)}
                className="text-red-500 hover:text-red-400 p-1"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[rgb(224,204,250)] mb-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {selectedBlog.author || "Anonymous"}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(selectedBlog.date)}
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-md text-xs ${
                selectedBlog.approved 
                  ? 'bg-green-900 text-green-200' 
                  : 'bg-yellow-900 text-yellow-200'
              }`}>
                {selectedBlog.approved ? 'Approved' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-[rgb(224,204,250)] whitespace-pre-line">
              {selectedBlog.content}
            </p>
          </div>

          {selectedBlog.tags?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedBlog.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-[rgb(49,10,101)] text-[rgb(224,204,250)] px-3 py-1 rounded-md text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center text-white hover:text-[rgb(136,58,234)] transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Go Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold text-white mb-6">Manage Blog Posts</h1>

      {/* Pending Approval Section */}
      {blogs.pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white border-b border-[rgb(136,58,234)] pb-2">
            Pending Approval ({blogs.pending.length})
          </h2>
          <div className="grid gap-6">
            {blogs.pending.map((blog) => (
              <motion.div
                key={blog.id}
                whileHover={{ scale: 1.01 }}
                className="bg-[#23262d] rounded-lg border border-yellow-600 p-4 cursor-pointer"
                onClick={() => setSelectedBlog(blog)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-white mb-2">{blog.title}</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveBlog(blog.id);
                      }}
                      className="text-green-500 hover:text-green-400 p-1"
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlog(blog.id, true);
                      }}
                      className="text-red-500 hover:text-red-400 p-1"
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-[rgb(224,204,250)] text-sm">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {blog.author || "Anonymous"}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(blog.date)}
                  </div>
                </div>
                <p className="text-[rgb(224,204,250)] mt-2 line-clamp-2">
                  {blog.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Posts Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white border-b border-[rgb(136,58,234)] pb-2">
          Approved Posts ({blogs.approved.length})
        </h2>
        {blogs.approved.length > 0 ? (
          <div className="grid gap-6">
            {blogs.approved.map((blog) => (
              <motion.div
                key={blog.id}
                whileHover={{ scale: 1.01 }}
                className="bg-[#23262d] rounded-lg border border-[rgb(136,58,234)] p-4 cursor-pointer"
                onClick={() => setSelectedBlog(blog)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-white mb-2">{blog.title}</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlog(blog.id);
                      }}
                      className="text-red-500 hover:text-red-400 p-1"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-[rgb(224,204,250)] text-sm">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {blog.author || "Anonymous"}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(blog.date)}
                  </div>
                </div>
                <p className="text-[rgb(224,204,250)] mt-2 line-clamp-2">
                  {blog.content}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center py-8">No approved blog posts found</p>
        )}
      </div>
    </motion.div>
  );
}