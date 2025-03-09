import React, { useState } from 'react';
import { motion } from "framer-motion";
import { FlaskRound as Flask, Clock, Users, BookOpen, Edit, Trash2, GripVertical, Plus, X } from 'lucide-react';

// Mock admin status - will be replaced with actual auth check
const isAdmin = true;

const initialLabs = [
  {
    id: 1,
    title: 'Symmetric Key Encryption Lab',
    description: 'Hands-on implementation of AES and DES encryption algorithms.',
    duration: '3 hours',
    capacity: 30,
    enrolled: 25,
    prerequisites: ['Basic Python', 'Cryptography Fundamentals'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
    instructor: 'Dr. Ravi Anand',
    tools: ['Python', 'Cryptography Library', 'Jupyter Notebook'],
  },
  {
    id: 2,
    title: 'Digital Signatures Workshop',
    description: 'Practical implementation of RSA digital signatures and verification.',
    duration: '4 hours',
    capacity: 25,
    enrolled: 20,
    prerequisites: ['Public Key Cryptography', 'Java Programming'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
    instructor: 'Dr. Ravi Anand',
    tools: ['Java', 'OpenSSL', 'Eclipse IDE'],
  },
];

export default function Labs() {
  const [labs, setLabs] = useState(initialLabs);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLab, setEditingLab] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const newLabs = [...labs];
    const [draggedLab] = newLabs.splice(dragIndex, 1);
    newLabs.splice(dropIndex, 0, draggedLab);
    setLabs(newLabs);
    setIsDragging(false);
  };

  const handleEdit = (lab) => {
    setEditingLab(lab);
    setIsEditing(true);
  };

  const handleDelete = (labId) => {
    if (window.confirm('Are you sure you want to delete this lab?')) {
      setLabs(labs.filter(lab => lab.id !== labId));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Cryptography Labs
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="text-[rgb(224,204,250)] text-lg"
        >
          Hands-on laboratory sessions for practical cryptography implementation.
        </motion.p>
        {isAdmin && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingLab({
                id: Date.now(),
                title: '',
                description: '',
                duration: '',
                capacity: 0,
                enrolled: 0,
                prerequisites: [],
                image: '',
                instructor: '',
                tools: [],
              });
              setIsEditing(true);
            }}
            className="mt-4 inline-flex items-center bg-[rgb(136,58,234)] text-white px-4 py-2 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Lab
          </motion.button>
        )}
      </motion.div>

      <div className="grid gap-8">
        {labs.map((lab, index) => (
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.02 }}
            draggable={isAdmin}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 ${
              isDragging ? 'cursor-move' : ''
            }`}
          >
            <div className="md:flex">
              <div className="md:w-1/3 relative">
                <img
                  src={lab.image}
                  alt={lab.title}
                  className="h-full w-full object-cover"
                />
                {isAdmin && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-2 right-2 flex space-x-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(lab)}
                      className="p-2 bg-[rgb(136,58,234)] rounded-full text-white hover:bg-[rgb(49,10,101)] transition-colors duration-300"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(lab.id)}
                      className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-[rgb(136,58,234)] rounded-full text-white cursor-move"
                    >
                      <GripVertical className="h-4 w-4" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
              <div className="p-6 md:w-2/3">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  {lab.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="text-[rgb(224,204,250)] mb-4"
                >
                  {lab.description}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="grid grid-cols-2 gap-4 mb-4"
                >
                  <div className="flex items-center text-white">
                    <Clock className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{lab.duration}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Users className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{lab.enrolled}/{lab.capacity} Enrolled</span>
                  </div>
                  <div className="flex items-center text-white">
                    <BookOpen className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{lab.instructor}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Flask className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{lab.tools.join(', ')}</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="mb-4"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">Prerequisites</h3>
                  <ul className="list-disc list-inside text-[rgb(224,204,250)]">
                    {lab.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </motion.div>

          
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
        {isEditing && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
        >
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
            onClick={() => setIsEditing(false)}
            />
            <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ 
                type: "spring",
                duration: 0.5
                }}
                className="relative bg-[#23262d] rounded-lg max-w-2xl w-full p-6 border border-[rgb(136,58,234)]"
            >
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 text-white hover:text-[rgb(224,204,250)]"
                >
                <X className="h-6 w-6" />
                </motion.button>
                
                <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-6"
                >
                {editingLab.id ? 'Edit Lab' : 'Add New Lab'}
                </motion.h2>
                
                <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
                >
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <label className="block text-[rgb(224,204,250)] mb-2">Title</label>
                    <input
                    type="text"
                    value={editingLab.title}
                    onChange={(e) => setEditingLab({...editingLab, title: e.target.value})}
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                    />
                </motion.div>
                
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <label className="block text-[rgb(224,204,250)] mb-2">Description</label>
                    <textarea
                    value={editingLab.description}
                    onChange={(e) => setEditingLab({...editingLab, description: e.target.value})}
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)] h-32"
                    />
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <div>
                    <label className="block text-[rgb(224,204,250)] mb-2">Duration</label>
                    <input
                        type="text"
                        value={editingLab.duration}
                        onChange={(e) => setEditingLab({...editingLab, duration: e.target.value})}
                        className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                    />
                    </div>
                    <div>
                    <label className="block text-[rgb(224,204,250)] mb-2">Instructor</label>
                    <input
                        type="text"
                        value={editingLab.instructor}
                        onChange={(e) => setEditingLab({...editingLab, instructor: e.target.value})}
                        className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                    />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <div>
                    <label className="block text-[rgb(224,204,250)] mb-2">Capacity</label>
                    <input
                        type="number"
                        value={editingLab.capacity}
                        onChange={(e) => setEditingLab({...editingLab, capacity: parseInt(e.target.value)})}
                        className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                    />
                    </div>
                    <div>
                    <label className="block text-[rgb(224,204,250)] mb-2">Currently Enrolled</label>
                    <input
                        type="number"
                        value={editingLab.enrolled}
                        onChange={(e) => setEditingLab({...editingLab, enrolled: parseInt(e.target.value)})}
                        className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                    />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <label className="block text-[rgb(224,204,250)] mb-2">Prerequisites (comma-separated)</label>
                    <input
                    type="text"
                    value={editingLab.prerequisites.join(', ')}
                    onChange={(e) => setEditingLab({...editingLab, prerequisites: e.target.value.split(',').map(p => p.trim())})}
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                    />
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    <label className="block text-[rgb(224,204,250)] mb-2">Tools (comma-separated)</label>
                    <input
                    type="text"
                    value={editingLab.tools.join(', ')}
                    onChange={(e) => setEditingLab({...editingLab, tools: e.target.value.split(',').map(t => t.trim())})}
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                    />
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <label className="block text-[rgb(224,204,250)] mb-2">Image URL</label>
                    <input
                    type="text"
                    value={editingLab.image}
                    onChange={(e) => setEditingLab({...editingLab, image: e.target.value})}
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                    />
                </motion.div>
                
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="flex justify-end space-x-4 pt-4"
                >
                    <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-[rgb(224,204,250)] hover:text-white transition-colors duration-300"
                    >
                    Cancel
                    </motion.button>
                    <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                        if (editingLab.id) {
                        setLabs(labs.map(lab => 
                            lab.id === editingLab.id ? editingLab : lab
                        ));
                        } else {
                        setLabs([...labs, {...editingLab, id: Date.now()}]);
                        }
                        setIsEditing(false);
                    }}
                    className="bg-[rgb(136,58,234)] text-white py-2 px-6 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
                    >
                    Save
                    </motion.button>
                </motion.div>
                </motion.form>
            </motion.div>
            </div>
        </motion.div>
        )}
    </motion.div>
  );
}