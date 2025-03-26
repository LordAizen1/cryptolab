import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Calendar, User, MessageSquare } from 'lucide-react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'blogs'));
      const blogsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogsList);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading blogs...</div>
      </div>
    );
  }

  return (
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

      <div className="grid gap-8">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
          >
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <h2 className="text-2xl font-bold text-white mb-2">{blog.title}</h2>
                <p className="text-[rgb(224,204,250)] mb-4">{blog.content}</p>
                
                {blog.tags && (
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
                      {blog.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {blog.date}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {blog.comments || 0} Comments
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}