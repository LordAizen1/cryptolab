import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function AdminHome() {
  const [updates, setUpdates] = useState([]);
  const [newUpdate, setNewUpdate] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // New state for modal control
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "homeUpdates"));
        const updatesData = [];
        querySnapshot.forEach((doc) => {
          updatesData.push({ id: doc.id, ...doc.data() });
        });
        setUpdates(updatesData);
      } catch (error) {
        console.error("Error fetching updates: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  const handleAddUpdate = async () => {
    if (!newUpdate.title || !newUpdate.description) return;

    try {
      const docRef = await addDoc(collection(firestore, "homeUpdates"), newUpdate);
      setUpdates([...updates, { id: docRef.id, ...newUpdate }]);
      setNewUpdate({ title: "", description: "" });
      setShowModal(false); // Close modal after adding
    } catch (error) {
      console.error("Error adding update: ", error);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !newUpdate.title || !newUpdate.description) return;

    try {
      await updateDoc(doc(firestore, "homeUpdates", editingId), newUpdate);
      setUpdates(updates.map(item => 
        item.id === editingId ? { ...item, ...newUpdate } : item
      ));
      setNewUpdate({ title: "", description: "" });
      setShowModal(false); // Close modal after updating
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "homeUpdates", id));
      setUpdates(updates.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewUpdate({ title: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (update) => {
    setEditingId(update.id);
    setNewUpdate({ title: update.title, description: update.description });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setNewUpdate({ title: "", description: "" });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#13151a] flex items-center justify-center text-white">
      Loading...
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.2 }} 
      className="bg-[#13151a] min-h-screen p-8 text-white"
    >
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center text-white hover:text-[rgb(136,58,234)] transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Go Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-[rgb(224,204,250)]">
        Manage Homepage Updates
      </h1>

      {user && (
        <button
          onClick={openAddModal}
          className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center mb-8"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Update
        </button>
      )}

      <div className="space-y-6">
        {updates.length === 0 ? (
          <div className="text-center text-[rgb(224,204,250)] py-8">
            No updates added yet
          </div>
        ) : (
          updates.map((update) => (
            <motion.div 
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{update.title}</h3>
                  <p className="text-[rgb(224,204,250)]">{update.description}</p>
                </div>
                
                {user && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => openEditModal(update)}
                      className="text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(update.id)}
                      className="text-red-500 hover:text-red-600 transition-colors duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-[#23262d] rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? "Edit Update" : "Add New Update"}
              </h2>
              <button 
                onClick={closeModal}
                className="text-[rgb(224,204,250)] hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-[rgb(224,204,250)]">Title</label>
                <input
                  type="text"
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                  className="w-full bg-[#13151a] rounded-md p-2 text-white border border-[rgb(136,58,234)]"
                  placeholder="Update title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-[rgb(224,204,250)]">Description</label>
                <textarea
                  value={newUpdate.description}
                  onChange={(e) => setNewUpdate({...newUpdate, description: e.target.value})}
                  className="w-full bg-[#13151a] rounded-md p-2 text-white border border-[rgb(136,58,234)]"
                  placeholder="Update description"
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  onClick={editingId ? handleUpdate : handleAddUpdate}
                  className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
                >
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}