import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Calendar, User, Plus, LogIn, LogOut, Edit, ChevronRight, X } from 'lucide-react';
import { firestore } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-lg">
          Something went wrong. Please try again later.
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    tags: [],
    image: ""
  });

  // Format date safely
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      if (typeof date.toDate === 'function') {
        return date.toDate().toLocaleDateString();
      }
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
      }
      return "N/A";
    } catch {
      return "N/A";
    }
  };

  // Fetch blogs and auth state
  useEffect(() => {
    const auth = getAuth();
    
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'blogs'));
        const blogsList = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          date: doc.data().date || serverTimestamp()
        }));
        setBlogs(blogsList);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email.endsWith("@iiitd.ac.in")) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    fetchBlogs();
    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ hd: "iiitd.ac.in" });

    try {
      const result = await signInWithPopup(getAuth(), provider);
      if (!result.user.email.endsWith("@iiitd.ac.in")) {
        await signOut(getAuth());
        alert("Only @iiitd.ac.in emails are allowed.");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingBlog) {
        // Update existing blog
        await updateDoc(doc(firestore, 'blogs', editingBlog.id), {
          ...newBlog,
          tags: newBlog.tags.filter(tag => tag.trim() !== "")
        });
        setEditingBlog(null);
      } else {
        // Create new blog
        await addDoc(collection(firestore, "blogs"), {
          ...newBlog,
          author: user.displayName || user.email.split("@")[0],
          authorId: user.uid,
          date: serverTimestamp(),
          tags: newBlog.tags.filter(tag => tag.trim() !== "")
        });
      }
      
      setShowForm(false);
      setNewBlog({ title: "", content: "", tags: [], image: "" });
      // Refresh blogs
      const querySnapshot = await getDocs(collection(firestore, 'blogs'));
      setBlogs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error submitting blog:", error);
    }
  };

  const handleViewBlog = async (blogId) => {
    const docRef = doc(firestore, 'blogs', blogId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSelectedBlog({ id: docSnap.id, ...docSnap.data() });
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setNewBlog({
      title: blog.title,
      content: blog.content,
      tags: blog.tags || [],
      image: blog.image || ""
    });
    setShowForm(true);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteDoc(doc(firestore, 'blogs', blogId));
        // Refresh blogs
        const querySnapshot = await getDocs(collection(firestore, 'blogs'));
        setBlogs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading blogs...</div>
      </div>
    );
  }

  if (selectedBlog) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-8 pb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex items-center mb-8">
          <button 
            onClick={() => setSelectedBlog(null)} 
            className="flex items-center text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
          >
            <ChevronRight className="h-5 w-5 mr-2 transform rotate-180" />
            Back to Blogs
          </button>
        </motion.div>

        <div className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)]">
          {selectedBlog.image && (
            <div className="h-64">
              <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{selectedBlog.title}</h1>
                <div className="flex items-center space-x-4 text-[rgb(224,204,250)]">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {selectedBlog.author || "Anonymous"}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {formatDate(selectedBlog.date)}
                  </div>
                </div>
              </div>
              {user?.uid === selectedBlog.authorId && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditBlog(selectedBlog)}
                    className="flex items-center text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors"
                  >
                    <Edit className="h-5 w-5 mr-1" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteBlog(selectedBlog.id)}
                    className="flex items-center text-red-500 hover:text-red-400 transition-colors"
                  >
                    <X className="h-5 w-5 mr-1" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-[rgb(224,204,250)] text-lg whitespace-pre-line">
                {selectedBlog.content}
              </p>
            </div>

            {selectedBlog.tags?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBlog.tags.map((tag, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      className="bg-[rgb(49,10,101)] text-[rgb(224,204,250)] px-3 py-1 rounded-md text-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="space-y-8"
      >
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Cryptography Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            className="text-[rgb(224,204,250)] text-lg"
          >
            Latest insights, research, and developments in cryptography.
          </motion.p>
        </div>

        <div className="flex justify-end mb-8 gap-4">
          {user ? (
            <>
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setNewBlog({ title: "", content: "", tags: [], image: "" });
                  setShowForm(true);
                }}
                className="bg-[rgb(136,58,234)] hover:bg-[rgb(49,10,101)] text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Post</span>
              </button>
              <button
                onClick={() => signOut(getAuth())}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="bg-[rgb(136,58,234)] hover:bg-[rgb(49,10,101)] text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In with IIITD Mail</span>
            </button>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#23262d] rounded-lg p-6 w-full max-w-2xl border border-[rgb(136,58,234)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingBlog ? "Edit Blog Post" : "New Blog Post"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingBlog(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                  className="w-full p-3 bg-[#2b2e36] border border-[rgb(136,58,234)] rounded text-white"
                  required
                />
                <textarea
                  placeholder="Content"
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                  className="w-full p-3 bg-[#2b2e36] border border-[rgb(136,58,234)] rounded text-white min-h-[200px]"
                  required
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  value={newBlog.tags.join(",")}
                  onChange={(e) => setNewBlog({...newBlog, tags: e.target.value.split(",")})}
                  className="w-full p-3 bg-[#2b2e36] border border-[rgb(136,58,234)] rounded text-white"
                />
                <input
                  type="text"
                  placeholder="Thumbnail URL (optional)"
                  value={newBlog.image}
                  onChange={(e) => setNewBlog({...newBlog, image: e.target.value})}
                  className="w-full p-3 bg-[#2b2e36] border border-[rgb(136,58,234)] rounded text-white"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingBlog(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-[rgb(136,58,234)] hover:bg-[rgb(49,10,101)] text-white rounded transition-colors"
                  >
                    {editingBlog ? "Update" : "Publish"}
                  </button>
                  {editingBlog && (
                    <button
                      onClick={() => handleDeleteBlog(editingBlog.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 cursor-pointer"
              onClick={() => handleViewBlog(blog.id)}
            >
              <div className="md:flex">
                {blog.image && (
                  <div className="md:w-1/3">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className={`p-6 ${blog.image ? 'md:w-2/3' : 'w-full'}`}>
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-white mb-2">{blog.title}</h2>
                    {user?.uid === blog.authorId && (
                      <button 
                        className="text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBlog(blog);
                        }}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[rgb(224,204,250)] mb-4">
                    {blog.content.substring(0, 200)}{blog.content.length > 200 ? "..." : ""}
                  </p>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map((tag, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.1 }}
                          className="bg-[rgb(49,10,101)] text-[rgb(224,204,250)] px-2 py-1 rounded-md text-sm"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[rgb(224,204,250)]">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {blog.author || "Anonymous"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(blog.date)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </ErrorBoundary>
  );
}