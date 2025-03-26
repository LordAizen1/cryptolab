import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, Building } from 'lucide-react';

const stats = [
  { name: 'Active Students', value: '500+', icon: Users },
  { name: 'Research Papers', value: '150+', icon: BookOpen },
  { name: 'Awards', value: '25+', icon: Award },
  { name: 'Partner Institutions', value: '10+', icon: Building },
];

export default function About() {
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
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            className="bg-[#23262d] p-6 rounded-lg border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 text-center"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.2 }}
          >
            <stat.icon className="h-8 w-8 mx-auto text-[rgb(136,58,234)]" />
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
          {['Applied Cryptography', 'Cryptanalysis'].map((area, index) => (
            <motion.div
              key={area}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
            >
              <h3 className="text-xl font-semibold text-[rgb(224,204,250)] mb-2">{area}</h3>
              <ul className="list-disc list-inside text-white space-y-2">
                {area === 'Applied Cryptography' ? (
                  <>
                    <li>Public Key Infrastructure</li>
                    <li>Secure Communication Protocols</li>
                    <li>Blockchain Technology</li>
                    <li>Zero-Knowledge Proofs</li>
                  </>
                ) : (
                  <>
                    <li>Side-Channel Attacks</li>
                    <li>Quantum Cryptanalysis</li>
                    <li>Mathematical Cryptanalysis</li>
                    <li>Hardware Security</li>
                  </>
                )}
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
          {[
            { title: 'Location', details: 'Cryptography Research Lab, IIIT Delhi, Okhla Industrial Estate, Phase III, New Delhi, India' },
            { title: 'Get in Touch', details: 'Email: Under-Development\nPhone: Under-Development\nOffice Hours: Under-Development' }
          ].map((contact, index) => (
            <motion.div 
              key={contact.title}
              initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.2 }}
            >
              <h3 className="text-xl font-semibold text-[rgb(224,204,250)] mb-2">{contact.title}</h3>
              <p className="text-white whitespace-pre-line">{contact.details}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
