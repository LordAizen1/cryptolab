import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    time: '',
    location: '',
    description: '',
    image: '',
    capacity: 0,
    registered: 0,
    eventLink: '',
    gallery: []
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'events'));
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    };
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGalleryChange = (e) => {
    const { value } = e.target;
    setFormData({ 
      ...formData, 
      gallery: value.split(',').map(url => url.trim()) 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the date display for single day or multi-day events
      const eventData = {
        ...formData,
        date: formData.startDate === formData.endDate || !formData.endDate
          ? formData.startDate
          : `${formData.startDate} to ${formData.endDate}`
      };

      if (editingEvent?.id) {
        await updateDoc(doc(firestore, 'events', editingEvent.id), eventData);
        setEvents(events.map(event => event.id === editingEvent.id ? { ...event, ...eventData } : event));
      } else {
        const docRef = await addDoc(collection(firestore, 'events'), eventData);
        setEvents([...events, { id: docRef.id, ...eventData }]);
      }
      setEditingEvent(null);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      time: '',
      location: '',
      description: '',
      image: '',
      capacity: 0,
      registered: 0,
      eventLink: '',
      gallery: []
    });
  };

  const handleDelete = async (eventId) => {
    await deleteDoc(doc(firestore, 'events', eventId));
    setEvents(events.filter(event => event.id !== eventId));
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

      <h1 className="text-3xl font-bold text-white text-center">Manage Events</h1>

      {user && (
        <button 
          onClick={() => setEditingEvent({})} 
          className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </button>
      )}

      <div className="grid gap-8">
        {events.map((event) => (
          <motion.div 
            key={event.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
          >
            <div className="md:flex">
              <div className="md:w-1/3">
                <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-[rgb(224,204,250)] mb-4">{event.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-white">
                    <span>{event.date}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center text-white">
                      <span>{event.time}</span>
                    </div>
                  )}
                  <div className="flex items-center text-white">
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <span>{event.registered}/{event.capacity} Registered</span>
                  </div>
                </div>

                {user && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => {
                        setEditingEvent(event);
                        // If date contains "to", split it into start and end dates
                        const dateParts = event.date?.includes(' to ') 
                          ? event.date.split(' to ') 
                          : [event.date, event.date];
                        setFormData({
                          ...event,
                          startDate: dateParts[0],
                          endDate: dateParts[1]
                        });
                      }}
                      className="text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
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

      {editingEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[#23262d] rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">{editingEvent.id ? 'Edit Event' : 'Add Event'}</h2>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white block mb-1">Start Date</label>
                  <input 
                    name="startDate" 
                    type="date" 
                    value={formData.startDate} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
                  />
                </div>
                <div>
                  <label className="text-white block mb-1">End Date (optional)</label>
                  <input 
                    name="endDate" 
                    type="date" 
                    value={formData.endDate} 
                    onChange={handleChange} 
                    min={formData.startDate}
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
                  />
                </div>
              </div>

              <input 
                name="time" 
                placeholder="Time (optional, e.g., 10:00 AM - 4:00 PM)" 
                value={formData.time} 
                onChange={handleChange} 
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
              />
              
              <input 
                name="location" 
                placeholder="Location" 
                value={formData.location} 
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
                name="eventLink" 
                placeholder="Event Website URL" 
                value={formData.eventLink} 
                onChange={handleChange} 
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white block mb-1">Capacity</label>
                  <input 
                    name="capacity" 
                    type="number" 
                    placeholder="Capacity" 
                    value={formData.capacity} 
                    onChange={handleChange} 
                    required 
                    min="0"
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
                  />
                </div>
                <div>
                  <label className="text-white block mb-1">Registered</label>
                  <input 
                    name="registered" 
                    type="number" 
                    placeholder="Registered" 
                    value={formData.registered} 
                    onChange={handleChange} 
                    min="0"
                    max={formData.capacity}
                    className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-white block mb-1">Gallery Image URLs (comma separated)</label>
                <textarea
                  name="gallery" 
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  value={(formData.gallery || []).join(', ')} 
                  onChange={handleGalleryChange} 
                  className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" 
                  rows="2"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingEvent(null);
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