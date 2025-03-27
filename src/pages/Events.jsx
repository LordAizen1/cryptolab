import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ChevronRight, ExternalLink, X } from 'lucide-react';
import { firestore } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const modalRef = useRef();

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'events'));
      const eventsList = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        gallery: doc.data().gallery || []
      }));
      setEvents(eventsList);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedImage && modalRef.current && !modalRef.current.contains(event.target)) {
        closeImageModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedImage]);

  const handleViewDetails = async (eventId) => {
    const docRef = doc(firestore, 'events', eventId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSelectedEvent({ 
        id: docSnap.id, 
        ...docSnap.data(),
        gallery: docSnap.data().gallery || []
      });
    } else {
      console.log('No such event!');
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading events...</div>
      </div>
    );
  }

  if (selectedEvent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-8 pb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex items-center mb-8">
          <button onClick={() => setSelectedEvent(null)} className="flex items-center text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300">
            <ChevronRight className="h-5 w-5 mr-2 transform rotate-180" />
            Back to Events
          </button>
        </motion.div>

        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="relative max-w-4xl max-h-[90vh] w-full"
              ref={modalRef}
            >
              <button 
                onClick={closeImageModal}
                className="absolute -top-10 right-0 text-white hover:text-[rgb(136,58,234)] transition-colors duration-300 z-10"
              >
                <X className="h-8 w-8" />
              </button>
              <div className="flex justify-center items-center h-full">
                <img 
                  src={selectedImage} 
                  alt="Enlarged gallery view" 
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} whileHover={{ scale: 1.02 }} className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)]">
              <div className="h-64">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="text-3xl font-bold text-white mb-4">
                  {selectedEvent.title}
                </motion.h1>
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-white">
                    <Calendar className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Clock className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <MapPin className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Users className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{selectedEvent.registered || 0}/{selectedEvent.capacity || 0} Registered</span>
                  </div>
                </motion.div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }} className="text-[rgb(224,204,250)] text-lg mb-6">
                  {selectedEvent.description}
                </motion.p>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            {selectedEvent.eventLink && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]">
                <h2 className="text-xl font-bold text-white mb-4">Event Link</h2>
                <motion.a
                  href={selectedEvent.eventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[rgb(136,58,234)] text-white py-3 px-6 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center justify-center"
                >
                  Visit Event Site
                  <ExternalLink className="ml-2 h-4 w-4" />
                </motion.a>
              </motion.div>
            )}

            {selectedEvent.gallery?.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]">
                <h2 className="text-xl font-bold text-white mb-4">Event Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedEvent.gallery.map((image, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ scale: 1.05 }} 
                      className="h-48 cursor-pointer"
                      onClick={() => openImageModal(image)}
                    >
                      <img 
                        src={image} 
                        alt={`Event gallery ${index + 1}`} 
                        className="w-full h-full object-cover rounded-md hover:ring-2 hover:ring-[rgb(136,58,234)] transition-all duration-300"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-8">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Past Events
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="text-[rgb(224,204,250)] text-lg"
        >
          Stay updated with the latest cryptography events, workshops, and conferences.
        </motion.p>
      </div>

      <div className="grid gap-8">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 shadow-lg"
          >
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-[rgb(224,204,250)] mb-4">{event.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-white">
                    <Calendar className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Clock className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <MapPin className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Users className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{event.registered || 0}/{event.capacity || 0} Registered</span>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleViewDetails(event.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center justify-center"
                >
                  View More Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}