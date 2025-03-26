import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    date: '',
    image: '',
    tags: [],
    comments: 0
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'blogs'));
      const blogsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogsList);
    };
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [field]: value.split(',').map(item => item.trim())
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog?.id) {
        await updateDoc(doc(firestore, 'blogs', editingBlog.id), formData);
        setBlogs(blogs.map(blog => blog.id === editingBlog.id ? { ...blog, ...formData } : blog));
      } else {
        const docRef = await addDoc(collection(firestore, 'blogs'), {
          ...formData,
          date: new Date().toISOString().split('T')[0] // Set current date if new
        });
        setBlogs([...blogs, { id: docRef.id, ...formData }]);
      }
      setEditingBlog(null);
      resetForm();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      date: '',
      image: '',
      tags: [],
      comments: 0
    });
  };

  const handleDelete = async (blogId) => {
    await deleteDoc(doc(firestore, 'blogs', blogId));
    setBlogs(blogs.filter(blog => blog.id !== blogId));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center text-white hover:text-[rgb(136,58,234)] transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Go Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold text-white text-center">Manage Blogs</h1>

      {user && (
        <button 
          onClick={() => setEditingBlog({})} 
          className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Blog Post
        </button>
      )}

      <div className="grid gap-8">
        {blogs.map((blog) => (
          <motion.div 
            key={blog.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
          >
            <div className="md:flex">
              <div className="md:w-1/3">
                <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="text-xl font-bold text-white mb-2">{blog.title}</h3>
                <p className="text-[rgb(224,204,250)] mb-4 line-clamp-2">{blog.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags?.map((tag, i) => (
                    <span key={i} className="bg-[rgb(49,10,101)] text-[rgb(224,204,250)] px-2 py-1 rounded-md text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[rgb(224,204,250)]">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center">
                      <span>{blog.date}</span>
                    </div>
                  </div>
                </div>

                {user && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => {
                        setEditingBlog(blog);
                        setFormData(blog);
                      }}
                      className="text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-500 hover:text-red-600 transition-colors duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {editingBlog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[#23262d] rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">{editingBlog.id ? 'Edit Blog' : 'Add Blog'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                name="title" 
                placeholder="Title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
              />
              <textarea 
                name="content" 
                placeholder="Content" 
                value={formData.content} 
                onChange={handleChange} 
                required 
                rows="6"
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
              />
              <input 
                name="author" 
                placeholder="Author" 
                value={formData.author} 
                onChange={handleChange} 
                required 
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
              />
              <input 
                name="date" 
                type="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
              />
              <input 
                name="image" 
                placeholder="Image URL" 
                value={formData.image} 
                onChange={handleChange} 
                required 
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
              />
              <input 
                name="tags" 
                placeholder="Tags (comma separated)" 
                value={formData.tags.join(', ')} 
                onChange={(e) => handleArrayChange(e, 'tags')} 
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
              />
              <input 
                name="comments" 
                type="number" 
                placeholder="Comments count" 
                value={formData.comments} 
                onChange={handleChange} 
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
              />

              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingBlog(null);
                    resetForm();
                  }} 
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}