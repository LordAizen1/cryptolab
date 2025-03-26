import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function AdminLabs() {
  const [labs, setLabs] = useState([]);
  const [editingLab, setEditingLab] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    capacity: 0,
    enrolled: 0,
    prerequisites: [],
    image: '',
    instructor: '',
    tools: []
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLabs = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'labs'));
      const labsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLabs(labsList);
    };
    fetchLabs();
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
      if (editingLab?.id) {
        await updateDoc(doc(firestore, 'labs', editingLab.id), formData);
        setLabs(labs.map(lab => lab.id === editingLab.id ? { ...lab, ...formData } : lab));
      } else {
        const docRef = await addDoc(collection(firestore, 'labs'), formData);
        setLabs([...labs, { id: docRef.id, ...formData }]);
      }
      setEditingLab(null);
      resetForm();
    } catch (error) {
      console.error('Error saving lab:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      capacity: 0,
      enrolled: 0,
      prerequisites: [],
      image: '',
      instructor: '',
      tools: []
    });
  };

  const handleDelete = async (labId) => {
    await deleteDoc(doc(firestore, 'labs', labId));
    setLabs(labs.filter(lab => lab.id !== labId));
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

      <h1 className="text-3xl font-bold text-white text-center">Manage Labs</h1>

      {user && (
        <button 
          onClick={() => setEditingLab({})} 
          className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lab
        </button>
      )}

      <div className="grid gap-8">
        {labs.map((lab) => (
          <motion.div 
            key={lab.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
          >
            <div className="md:flex">
              <div className="md:w-1/3">
                <img src={lab.image} alt={lab.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="text-xl font-bold text-white mb-2">{lab.title}</h3>
                <p className="text-[rgb(224,204,250)] mb-4">{lab.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-white">
                    <span>{lab.duration}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <span>{lab.enrolled}/{lab.capacity} Enrolled</span>
                  </div>
                  <div className="flex items-center text-white">
                    <span>{lab.instructor}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <span>{lab.tools.join(', ')}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Prerequisites</h3>
                  <ul className="list-disc list-inside text-[rgb(224,204,250)]">
                    {lab.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>

                {user && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => {
                        setEditingLab(lab);
                        setFormData(lab);
                      }}
                      className="text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(lab.id)}
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

      {editingLab && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[#23262d] rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">{editingLab.id ? 'Edit Lab' : 'Add Lab'}</h2>
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
                name="description" 
                placeholder="Description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
                rows="4"
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  name="duration" 
                  placeholder="Duration" 
                  value={formData.duration} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
                />
                <input 
                  name="instructor" 
                  placeholder="Instructor" 
                  value={formData.instructor} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  name="enrolled" 
                  type="number" 
                  placeholder="Enrolled" 
                  value={formData.enrolled} 
                  onChange={handleChange} 
                  className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
                />
                <input 
                  name="capacity" 
                  type="number" 
                  placeholder="Capacity" 
                  value={formData.capacity} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
                />
              </div>
              <input 
                name="prerequisites" 
                placeholder="Prerequisites (comma separated)" 
                value={formData.prerequisites.join(', ')} 
                onChange={(e) => handleArrayChange(e, 'prerequisites')} 
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
              />
              <input 
                name="tools" 
                placeholder="Tools (comma separated)" 
                value={formData.tools.join(', ')} 
                onChange={(e) => handleArrayChange(e, 'tools')} 
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

              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingLab(null);
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