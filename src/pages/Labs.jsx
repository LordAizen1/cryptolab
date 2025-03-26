import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FlaskRound as Flask, Clock, Users, BookOpen } from 'lucide-react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'labs'));
      const labsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLabs(labsList);
      setLoading(false);
    };
    fetchLabs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading labs...</div>
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
      </div>

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
              <div className="md:w-1/3">
                <img
                  src={lab.image}
                  alt={lab.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <h2 className="text-2xl font-bold text-white mb-2">{lab.title}</h2>
                <p className="text-[rgb(224,204,250)] mb-4">{lab.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-white">
                    <Clock className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{lab.duration}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Users className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{lab.enrolled || 0}/{lab.capacity || 0} Enrolled</span>
                  </div>
                  <div className="flex items-center text-white">
                    <BookOpen className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{lab.instructor}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Flask className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{lab.tools?.join(', ') || ''}</span>
                  </div>
                </div>

                {lab.prerequisites && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Prerequisites</h3>
                    <ul className="list-disc list-inside text-[rgb(224,204,250)]">
                      {lab.prerequisites.map((prereq, index) => (
                        <li key={index}>{prereq}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}