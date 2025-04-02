import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Plus, ArrowLeft, Mail, Github, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    specialization: '',
    image: '',
    email: '',
    github: '',
    linkedin: '',
    isHead: false,
    year: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'members'));
      const membersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(membersList);
    };
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember?.id) {
        await updateDoc(doc(firestore, 'members', editingMember.id), formData);
        setMembers(members.map(member => 
          member.id === editingMember.id ? { ...member, ...formData } : member
        ));
      } else {
        const docRef = await addDoc(collection(firestore, 'members'), formData);
        setMembers([...members, { id: docRef.id, ...formData }]);
      }
      setEditingMember(null);
      resetForm();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      specialization: '',
      image: '',
      email: '',
      github: '',
      linkedin: '',
      isHead: false,
      year: ''
    });
  };

  const handleDelete = async (memberId) => {
    await deleteDoc(doc(firestore, 'members', memberId));
    setMembers(members.filter(member => member.id !== memberId));
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

      <h1 className="text-3xl font-bold text-white text-center">Manage Members</h1>

      {user && (
        <button 
          onClick={() => setEditingMember({})} 
          className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </button>
      )}

      <div className="space-y-8">
        {/* Head Member */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Head Faculty</h2>
          {members.filter(m => m.isHead).map(member => (
            <MemberCard 
              key={member.id} 
              member={member} 
              onEdit={() => {
                setEditingMember(member);
                setFormData(member);
              }}
              onDelete={() => handleDelete(member.id)}
              isAdmin={user}
              isHead={true}
            />
          ))}
        </div>

        {/* Other Members */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Team Members</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {members.filter(m => !m.isHead).map(member => (
              <MemberCard 
                key={member.id} 
                member={member} 
                onEdit={() => {
                  setEditingMember(member);
                  setFormData(member);
                }}
                onDelete={() => handleDelete(member.id)}
                isAdmin={user}
                isHead={false}
              />
            ))}
          </div>
        </div>
      </div>

      {editingMember && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-[#23262d] rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">{editingMember.id ? 'Edit Member' : 'Add Member'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[rgb(224,204,250)] mb-2">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
              />
            </div>
            <div>
              <label className="block text-[rgb(224,204,250)] mb-2">Role</label>
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[rgb(224,204,250)] mb-2">Specialization</label>
              <input
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
              />
            </div>
            <div>
              <label className="block text-[rgb(224,204,250)] mb-2">Year</label>
              <input
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                placeholder="e.g. 2023"
              />
            </div>
          </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[rgb(224,204,250)] mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                  />
                </div>
                <div>
                  <label className="block text-[rgb(224,204,250)] mb-2">GitHub Username</label>
                  <input
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[rgb(224,204,250)] mb-2">LinkedIn Username</label>
                  <input
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                  />
                </div>
                <div>
                  <label className="block text-[rgb(224,204,250)] mb-2">Image URL</label>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  name="isHead"
                  type="checkbox"
                  checked={formData.isHead}
                  onChange={handleChange}
                  className="h-4 w-4 text-[rgb(136,58,234)] rounded border-gray-300 focus:ring-[rgb(136,58,234)]"
                />
                <label className="ml-2 text-[rgb(224,204,250)]">Is Head Faculty Member</label>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMember(null);
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

const MemberCard = ({ member, onEdit, onDelete, isAdmin, isHead }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 ${
      isHead ? 'md:max-w-2xl mx-auto' : ''
    }`}
    whileHover={{ scale: 1.02 }}
  >
    <div className="p-6">
      <div className={`flex ${isHead ? 'flex-col md:flex-row' : 'flex-row'} items-center space-x-4`}>
        <img
          src={member.image}
          alt={member.name}
          className={`${isHead ? 'w-32 h-32 md:w-40 md:h-40' : 'w-24 h-24'} rounded-full object-cover border-2 border-[rgb(136,58,234)]`}
        />
        <div className={`${isHead ? 'text-center md:text-left mt-4 md:mt-0' : ''}`}>
          <h3 className={`${isHead ? 'text-2xl' : 'text-xl'} font-bold text-white`}>{member.name}</h3>
          <p className="text-[rgb(224,204,250)]">{member.role}</p>
          <p className="text-[rgb(224,204,250)]">{member.specialization}</p>
          {member.year && <p className='text-[rgb(224,204,250)]'>Year: {member.year}</p>}
        </div>
      </div>

      <div className="mt-4 flex space-x-4 justify-center md:justify-start">
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="text-white hover:text-[rgb(224,204,250)] transition-colors duration-300"
          >
            <Mail className="h-5 w-5" />
          </a>
        )}
        {member.github && (
          <a
            href={`https://github.com/${member.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[rgb(224,204,250)] transition-colors duration-300"
          >
            <Github className="h-5 w-5" />
          </a>
        )}
        {member.linkedin && (
          <a
            href={`https://linkedin.com/in/${member.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[rgb(224,204,250)] transition-colors duration-300"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        )}
      </div>

      {isAdmin && (
        <div className="flex space-x-2 mt-4 justify-center md:justify-start">
          <button
            onClick={onEdit}
            className="text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 transition-colors duration-300"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  </motion.div>
);