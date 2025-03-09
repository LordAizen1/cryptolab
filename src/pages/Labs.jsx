import React, { useState } from 'react';
import { motion } from "framer-motion";
import { FlaskRound as Flask, Clock, Users, BookOpen } from 'lucide-react';

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
  const [labs] = useState(initialLabs);

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
      </motion.div>

      <div className="grid gap-8">
        {labs.map((lab, index) => (
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
          >
            <div className="md:flex">
              <div className="md:w-1/3 relative">
                <img
                  src={lab.image}
                  alt={lab.title}
                  className="h-full w-full object-cover"
                />
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
    </motion.div>
  );
}