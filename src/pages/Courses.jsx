import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, ChevronRight } from 'lucide-react';

const courses = [
  {
    id: 'applied-cryptography',
    title: 'Applied Cryptography',
    description: 'Learn the fundamentals of modern cryptography and its practical applications.',
    instructor: 'Dr. Ravi Anand',
    duration: '16 weeks',
    students: 120,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
    syllabus: [
      'Introduction to Modern Cryptography',
      'Symmetric Key Cryptography',
      'Public Key Cryptography',
      'Digital Signatures',
      'Hash Functions',
      'Key Exchange Protocols'
    ],
    prerequisites: ['Discrete Mathematics', 'Basic Programming'],
    assignments: 8,
    projectWork: true,
    nextStart: '2024-04-01'
  },
  {
    id: 'topics-in-cryptanalysis',
    title: 'Topics in Cryptanalysis',
    description: 'Advanced course covering modern cryptanalysis techniques and attack methods.',
    instructor: 'Prof. Ravi Anand',
    duration: '16 weeks',
    students: 85,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
    syllabus: [
      'Classical Cryptanalysis',
      'Statistical Analysis',
      'Differential Cryptanalysis',
      'Linear Cryptanalysis',
      'Side-Channel Attacks',
      'Quantum Cryptanalysis'
    ],
    prerequisites: ['Applied Cryptography', 'Advanced Mathematics'],
    assignments: 6,
    projectWork: true,
    nextStart: '2024-04-15'
  }
];

export default function Courses() {
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
          Cryptography Courses
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="text-[rgb(224,204,250)] text-lg"
        >
          Explore our comprehensive cryptography curriculum designed for IIIT Delhi students.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 shadow-lg"
          >
            <div className="h-48">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
              <p className="text-[rgb(224,204,250)] mb-4 text-sm">{course.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-white text-sm">
                  <Users className="h-4 w-4 mr-2 text-[rgb(136,58,234)]" />
                  <span>{course.students} Students</span>
                </div>
                <div className="flex items-center text-white text-sm">
                  <Clock className="h-4 w-4 mr-2 text-[rgb(136,58,234)]" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-white text-sm">
                  <BookOpen className="h-4 w-4 mr-2 text-[rgb(136,58,234)]" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center text-white text-sm">
                  <Star className="h-4 w-4 mr-2 text-[rgb(136,58,234)]" />
                  <span>{course.rating}/5.0</span>
                </div>
              </div>
              <Link 
                to={`/courses/${course.id}`}
                className="w-full bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center justify-center"
              >
                View Course Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}