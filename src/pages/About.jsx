import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, Building } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

export default function About() {
  const [aboutData, setAboutData] = useState({
    stats: [],
    researchAreas: [],
    contact: {
      location: "",
      details: ""
    },
    loading: true
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(firestore, "content", "about");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setAboutData({
            ...docSnap.data(),
            loading: false
          });
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        setAboutData(prev => ({ ...prev, loading: false }));
      }
    };
    
    fetchAboutData();
  }, []);

  if (aboutData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Heading */}
      <motion.div className="text-center" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
        <h1 className="text-4xl font-bold text-white mb-4">About VeilCode Labs</h1>
        <p className="text-[rgb(224,204,250)] text-lg max-w-3xl mx-auto">
          VeilCode Labs is IIIT Delhi's premier platform for cryptography education and research,
          fostering collaboration and excellence in the field of cryptography and security.
        </p>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {aboutData.stats.map((stat, index) => (
          <motion.div
            key={stat.name || index}
            className="bg-[#23262d] p-6 rounded-lg border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 text-center"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.2 }}
          >
            {stat.icon === 'Users' && <Users className="h-8 w-8 mx-auto text-[rgb(136,58,234)]" />}
            {stat.icon === 'BookOpen' && <BookOpen className="h-8 w-8 mx-auto text-[rgb(136,58,234)]" />}
            {stat.icon === 'Award' && <Award className="h-8 w-8 mx-auto text-[rgb(136,58,234)]" />}
            {stat.icon === 'Building' && <Building className="h-8 w-8 mx-auto text-[rgb(136,58,234)]" />}
            <p className="mt-4 text-2xl font-semibold text-white">{stat.value}</p>
            <p className="text-[rgb(224,204,250)]">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        {['Our Mission', 'Our Vision'].map((title, index) => (
          <motion.div
            key={title}
            className="bg-[rgba(49,10,101,0.2)] rounded-lg p-6"
            initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
            <p className="text-[rgb(224,204,250)]">
              {title === 'Our Mission'
                ? 'To provide world-class education and research opportunities in cryptography, fostering innovation and excellence in information security.'
                : 'To be a leading center of excellence in cryptography research and education, contributing to secure communication technologies.'}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Research Areas */}
      <motion.div 
        className="bg-[#23262d] rounded-lg p-8 border border-[rgb(136,58,234)]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Research Areas</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {aboutData.researchAreas.map((area, index) => (
            <motion.div
              key={area.title || index}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
            >
              <h3 className="text-xl font-semibold text-[rgb(224,204,250)] mb-2">{area.title}</h3>
              <ul className="list-disc list-inside text-white space-y-2">
                {area.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div 
        className="bg-[rgba(49,10,101,0.2)] rounded-lg p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-[rgb(224,204,250)] mb-2">Location</h3>
            <p className="text-white whitespace-pre-line">{aboutData.contact.location}</p>
          </motion.div>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-[rgb(224,204,250)] mb-2">Get in Touch</h3>
            <p className="text-white whitespace-pre-line">{aboutData.contact.details}</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}