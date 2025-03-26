import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'events'));
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading events...</div>
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
          Upcoming Events
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
                >
                  Register Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}