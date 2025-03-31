import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from 'lucide-react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const MemberCard = ({ member, index, isHead }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: index * 0.1 }}
    className={`bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 ${
      isHead ? 'md:max-w-2xl mx-auto' : ''
    }`}
    whileHover={{ scale: 1.02 }}
  >
    <div className="p-6">
      <div className={`flex ${isHead ? 'flex-col md:flex-row' : 'flex-row'} items-center space-x-4`}>
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
          src={member.image}
          alt={member.name}
          className={`${isHead ? 'w-32 h-32 md:w-40 md:h-40' : 'w-24 h-24'} rounded-full object-cover border-2 border-[rgb(136,58,234)]`}
        />
        <div className={`${isHead ? 'text-center md:text-left mt-4 md:mt-0' : ''}`}>
          <h3 className={`${isHead ? 'text-2xl' : 'text-xl'} font-bold text-white`}>{member.name}</h3>
          <p className="text-[rgb(224,204,250)]">{member.role}</p>
          <p className="text-[rgb(224,204,250)]">{member.specialization}</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.4 }}
        className="mt-4 flex space-x-4 justify-center md:justify-start"
      >
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
      </motion.div>
    </div>
  </motion.div>
);

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'members'));
      const membersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(membersList);
      setLoading(false);
    };
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading members...</div>
      </div>
    );
  }

  const headMember = members.find(m => m.isHead);
  const otherMembers = members.filter(m => !m.isHead);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Our Members</h1>
          <p className="text-[rgb(224,204,250)] text-lg">
            Meet our distinguished faculty members and researchers in cryptography.
          </p>
        </motion.div>

        {/* Head Faculty Member */}
        {headMember && (
          <div className="px-4">
            <MemberCard member={headMember} index={0} isHead={true} />
          </div>
        )}

        {/* Other Members */}
        <div className="grid gap-8 md:grid-cols-2 px-4">
          {otherMembers.map((member, index) => (
            <MemberCard key={member.id} member={member} index={index + 1} isHead={false} />
          ))}
        </div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-[rgba(49,10,101,0.2)] rounded-lg p-6 mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-[rgb(224,204,250)] mb-4">
            Interested in joining our research group? We're always looking for passionate researchers and students.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
          >
            View Opportunities
          </motion.button>
        </motion.div> */}
      </div>
    </motion.div>
  );
}