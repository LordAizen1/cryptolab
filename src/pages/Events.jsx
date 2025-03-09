import React from 'react';
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Cryptography Workshop',
    date: 'March 15, 2024',
    time: '10:00 AM - 4:00 PM',
    location: 'IIIT Delhi Campus',
    description: 'Hands-on workshop covering practical aspects of modern cryptography.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000',
    capacity: 50,
    registered: 35,
  },
  {
    id: 2,
    title: 'Cryptanalysis Symposium',
    date: 'April 2, 2024',
    time: '9:00 AM - 5:00 PM',
    location: 'Virtual Event',
    description: 'International symposium on recent advances in cryptanalysis.',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000',
    capacity: 200,
    registered: 145,
  },
  {
    id: 3,
    title: 'Security Conference 2024',
    date: 'May 20, 2024',
    time: '10:00 AM - 6:00 PM',
    location: 'Convention Center',
    description: 'Annual conference on cybersecurity and cryptography.',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1000',
    capacity: 300,
    registered: 210,
  },
];

export default function Events() {
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
                    <span>{event.registered}/{event.capacity} Registered</span>
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
