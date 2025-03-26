import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, ChevronRight } from 'lucide-react';
import { firestore } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'courses'));
      const coursesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);
    };
    fetchCourses();
  }, []);

  const handleViewDetails = async (courseId) => {
    const docRef = doc(firestore, 'courses', courseId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSelectedCourse({ id: docSnap.id, ...docSnap.data() });
    } else {
      console.log('No such course!');
    }
  };

  if (selectedCourse) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-8 pb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex items-center mb-8">
          <button onClick={() => setSelectedCourse(null)} className="flex items-center text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300">
            <ChevronRight className="h-5 w-5 mr-2 transform rotate-180" />
            Back to Courses
          </button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} whileHover={{ scale: 1.02 }} className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)]">
              <div className="h-64">
                <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="text-3xl font-bold text-white mb-2">
                    {selectedCourse.title}
                  </motion.h1>
                  <div className="text-[rgb(224,204,250)] space-y-1">
                    <p>Course Code: {selectedCourse.courseCode}</p>
                    <p>Credits: {selectedCourse.credits}</p>
                    <p>Offered to: {selectedCourse.offeredTo}</p>
                  </div>
                </div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }} className="text-[rgb(224,204,250)] text-lg mb-6">
                  {selectedCourse.description}
                </motion.p>
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-white">
                    <Users className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{selectedCourse.students} Students</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Clock className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{selectedCourse.duration}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <BookOpen className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{selectedCourse.instructor}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Star className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                    <span>{selectedCourse.rating}/5.0</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {selectedCourse.courseOutcomes?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]">
                <h2 className="text-2xl font-bold text-white mb-4">Course Outcomes</h2>
                <div className="grid gap-3">
                  {selectedCourse.courseOutcomes.map((outcome, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} className="flex items-start text-[rgb(224,204,250)] p-3 rounded-lg hover:bg-[rgba(49,10,101,0.2)] transition-colors duration-300">
                      <span>CO{index + 1}: {outcome}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            {selectedCourse.prerequisites && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]">
                <h2 className="text-xl font-bold text-white mb-4">Prerequisites</h2>
                {Object.entries(selectedCourse.prerequisites).map(([type, items]) => (
                  items.length > 0 && (
                    <div key={type} className="mb-4 last:mb-0">
                      <h3 className="text-[rgb(224,204,250)] font-semibold mb-2 capitalize">
                        {type.replace(/([A-Z])/g, ' $1').trim()}:
                      </h3>
                      <ul className="space-y-2">
                        {items.map((prereq, index) => (
                          <motion.li key={index} className="flex items-center text-white">
                            {prereq}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}
              </motion.div>
            )}

            {selectedCourse.assessment?.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]">
                <h2 className="text-xl font-bold text-white mb-4">Assessment Plan</h2>
                <div className="space-y-3">
                  {selectedCourse.assessment.map(({ type, contribution }) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-[rgb(224,204,250)]">{type}</span>
                      <span className="text-white">{contribution}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedCourse.resources?.textbooks?.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]">
                <h2 className="text-xl font-bold text-white mb-4">Resource Material</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[rgb(224,204,250)] font-semibold mb-2">Textbooks</h3>
                    <ul className="space-y-2">
                      {selectedCourse.resources.textbooks.map((book, index) => (
                        <motion.li key={index} className="text-white">
                          {book}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[rgb(136,58,234)] text-white py-3 px-6 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
            >
              Enroll Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-8">
      <div className="text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.2 }} className="text-4xl font-bold text-white mb-4">
          Cryptography Courses
        </motion.h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300 shadow-lg"
            >
              <div className="h-48">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
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
                <button 
                  onClick={() => handleViewDetails(course.id)} 
                  className="w-full bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center justify-center"
                >
                  View Course Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-white text-center col-span-2">No courses available</p>
        )}
      </div>
    </motion.div>
  );
}