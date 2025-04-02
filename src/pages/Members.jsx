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
          {/* {member.year && <p className="text-[rgb(224,204,250)]">Year: {member.year}</p>} */}
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

  // Group members by year
  const membersByYear = otherMembers.reduce((acc, member) => {
    const year = member.year || 'Other';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(member);
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(membersByYear).sort((a, b) => b - a);

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

        {/* Members by Year */}
        {sortedYears.map((year, yearIndex) => (
          <div key={year} className="space-y-6">
            <h2 className="text-2xl font-bold text-white px-4">{year}</h2>
            <div className="grid gap-8 md:grid-cols-2 px-4">
              {membersByYear[year].map((member, index) => (
                <MemberCard key={member.id} member={member} index={index + 1} isHead={false} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}