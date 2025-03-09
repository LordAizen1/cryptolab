import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, ChevronLeft, Calendar, CheckCircle } from 'lucide-react';

const courses = {
  'applied-cryptography': {
    id: 'applied-cryptography',
    title: 'Applied Cryptography',
    courseCode: 'CSE 546',
    credits: 4,
    offeredTo: 'UG/PG',
    description: 'In this course on Applied cryptography, we will learn about security notions, adversary powers, perfect security, stream ciphers, block ciphers, hash functions, message authentication, public key cryptography, and some interesting cryptographic protocols. Some mathematics will be required, and will be taught as needed. No background in theoretical computer science is a prerequisite.',
    instructor: 'Dr. Ravi Anand',
    duration: '16 weeks',
    students: 120,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
    prerequisites: {
      mandatory: ['CSE121 Discrete Mathematics'],
      desirable: [],
      other: []
    },
    courseOutcomes: [
      'Students are able to analyze weak ciphers and break them.',
      'Students are able to summarize the design principles of block ciphers, stream ciphers and hash functions.',
      'Students are able to explain how public key schemes (such as RSA) work.'
    ],
    weeklyPlan: [
      { week: 1, topic: 'Introduction and perfect security', cos: ['CO1'] },
      { week: 2, topic: 'Stream ciphers', cos: ['CO1', 'CO2'] },
      { week: 3, topic: 'Block ciphers', cos: ['CO1', 'CO2'] },
      { week: 4, topic: '... continued', cos: ['CO1', 'CO2'] },
      { week: 5, topic: 'Hash functions and MAC', cos: ['CO1', 'CO2'] },
      { week: 6, topic: 'Authenticated encryption', cos: ['CO1', 'CO2'] },
      { week: 7, topic: 'Mathematical background (number theory and algebra)', cos: ['CO3'] },
      { week: 8, topic: 'Primality testing', cos: ['CO3'] },
      { week: 9, topic: 'PKC RSA, El Gamal, etc', cos: ['CO3'] },
      { week: 10, topic: '... continued', cos: ['CO3'] },
      { week: 11, topic: 'Zero knowledge proofs', cos: ['CO3'] },
      { week: 12, topic: 'Some advanced protocols', cos: ['CO3'] },
      { week: 13, topic: '... continued', cos: ['CO3'] }
    ],
    assessment: [
      { type: 'Project', contribution: 20 },
      { type: 'Assignment', contribution: 20 },
      { type: 'Mid-sem', contribution: 25 },
      { type: 'End-sem', contribution: 35 }
    ],
    resources: {
      textbooks: [
        'Douglas Stinson',
        'Katz and Lindell books on Cryptography'
      ]
    },
    nextStart: '2024-04-01'
  },
  'topics-in-cryptanalysis': {
    id: 'topics-in-cryptanalysis',
    title: 'Topics in Cryptanalysis',
    courseCode: 'CSE653',
    credits: 4,
    offeredTo: 'UG/PG',
    description: 'This course aims for analyzing the security of various cryptosystems. The course will be focusing mainly on the fundamentals of cryptanalysis techniques as mentioned: Differential Cryptanalyis Linear Cryptanalysis, Meet in the Middle Attack Rebound Attack, Time-Memory Trade-off Attack, Hash function attacks (Damgaard\'s MD4 attack, Wang\'s attack on MD4, MD5, SHA-1) Attacks against RSA, Number Field Sieve Fault Attacks, Algebraic attacks',
    instructor: 'Dr. Ravi Anand',
    duration: '16 weeks',
    students: 85,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
    prerequisites: {
      mandatory: ['None'],
      desirable: [
        'Applied Cryptography',
        'Background of Linear and Abstract Algebra and, Probability and Statistics'
      ],
      other: []
    },
    courseOutcomes: [
      'Students are able to read, interpret and write theoretical papers in Cryptography.',
      'Students are able to learn about various attack techniques on Cryptosystems',
      'Students are able to propose new and improved attacks on various Cryptosystems',
      'Students are able to analyse overall security of existing cryptosystems'
    ],
    weeklyPlan: [
      { week: 1, topic: 'Introduction to Topics in Cryptanalysis, Ciphers', cos: ['CO1'] },
      { week: 2, topic: 'CodeBook Attacks, Exhaustive Search, Time Memory Tradeoff Attacks', cos: ['CO1'] },
      { week: 3, topic: 'Differential Cryptanalysis', cos: ['CO1'] },
      { week: 4, topic: 'Differential Cryptanalysis contd., Linear Cryptanalysis', cos: ['CO1', 'CO2'] },
      { week: 5, topic: 'Linear Cryptanalysis contd., Integral Cryptanalysis', cos: ['CO1', 'CO2'] },
      { week: 6, topic: 'Integral Cryptanalysis', cos: ['CO1', 'CO2'] },
      { week: 7, topic: 'Fault Attacks', cos: ['CO1'] },
      { week: 8, topic: 'Algebraic Attacks', cos: ['CO1', 'CO2'] },
      { week: 9, topic: 'Hash Function Attacks', cos: ['CO1', 'CO2'] },
      { week: 10, topic: 'Hash Function Attacks', cos: ['CO2', 'CO3'] },
      { week: 11, topic: 'Attacks against RSA', cos: ['CO2', 'CO3'] },
      { week: 12, topic: 'Attacks against RSA', cos: ['CO3', 'CO4'] }
    ],
    assessment: [
      { type: 'Mid Semester', contribution: 20 },
      { type: 'End Semester', contribution: 30 },
      { type: 'Assignment', contribution: 30 },
      { type: 'Project', contribution: 20 }
    ],
    resources: {
      textbooks: [
        'Cryptography: Theory and Practice by Douglas R. Stinson',
        'SECURITY OF BLOCK CIPHERS FROM ALGORITHM DESIGN TO HARDWARE IMPLEMENTATION, Kazuo Sakiyama, Yu Sasaki, Yang Li',
        <a 
          href="https://www.engr.mun.ca/~howard/PAPERS/ldc_tutorial.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: 'rgb(224, 204, 250)', textDecoration: 'underline' }}
        >
          A Tutorial on Linear and Differential Cryptanalysis by Howard Heys
        </a>
      ]
    },    
    nextStart: '2024-04-15'
  }
};

function CourseDetails() {
  const { courseId } = useParams();
  const course = courses[courseId];

  if (!course) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white mb-4"
          >
            Course Not Found
          </motion.h2>
          <Link 
            to="/courses"
            className="text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
          >
            Return to Courses
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-8 pb-12"
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center mb-8"
      >
        <Link
          to="/courses"
          className="flex items-center text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back to Courses
        </Link>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)]"
          >
            <div className="h-64">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="mb-4">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  {course.title}
                </motion.h1>
                <div className="text-[rgb(224,204,250)] space-y-1">
                  <p>Course Code: {course.courseCode}</p>
                  <p>Credits: {course.credits}</p>
                  <p>Offered to: {course.offeredTo}</p>
                </div>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-[rgb(224,204,250)] text-lg mb-6"
              >
                {course.description}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
              >
                <div className="flex items-center text-white">
                  <Users className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                  <span>{course.students} Students</span>
                </div>
                <div className="flex items-center text-white">
                  <Clock className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-white">
                  <BookOpen className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center text-white">
                  <Star className="h-5 w-5 mr-2 text-[rgb(136,58,234)]" />
                  <span>{course.rating}/5.0</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Course Outcomes</h2>
            <div className="grid gap-3">
              {course.courseOutcomes?.map((outcome, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start text-[rgb(224,204,250)] p-3 rounded-lg hover:bg-[rgba(49,10,101,0.2)] transition-colors duration-300"
                >
                  <CheckCircle className="h-5 w-5 mr-3 text-[rgb(136,58,234)] mt-1" />
                  <span>CO{index + 1}: {outcome}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Weekly Lecture Plan</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-[rgb(49,10,101)]">
                    <th className="p-3 text-[rgb(224,204,250)]">Week</th>
                    <th className="p-3 text-[rgb(224,204,250)]">Topic</th>
                    <th className="p-3 text-[rgb(224,204,250)]">COs Met</th>
                  </tr>
                </thead>
                <tbody>
                  {course.weeklyPlan?.map((week) => (
                    <motion.tr 
                      key={week.week}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ backgroundColor: 'rgba(49,10,101,0.2)' }}
                      className="border-b border-[rgb(49,10,101)] last:border-0"
                    >
                      <td className="p-3 text-white">{week.week}</td>
                      <td className="p-3 text-white">{week.topic}</td>
                      <td className="p-3 text-white">{week.cos.join(', ')}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]"
          >
            <h2 className="text-xl font-bold text-white mb-4">Prerequisites</h2>
            {Object.entries(course.prerequisites).map(([type, items]) => (
              items.length > 0 && (
                <div key={type} className="mb-4 last:mb-0">
                  <h3 className="text-[rgb(224,204,250)] font-semibold mb-2 capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}:
                  </h3>
                  <ul className="space-y-2">
                    {items.map((prereq, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2 text-[rgb(136,58,234)]" />
                        {prereq}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]"
          >
            <h2 className="text-xl font-bold text-white mb-4">Assessment Plan</h2>
            <div className="space-y-3">
              {course.assessment.map(({ type, contribution }) => (
                <div key={type} className="flex justify-between">
                  <span className="text-[rgb(224,204,250)]">{type}</span>
                  <span className="text-white">{contribution}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]"
          >
            <h2 className="text-xl font-bold text-white mb-4">Resource Material</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-[rgb(224,204,250)] font-semibold mb-2">Textbooks</h3>
                <ul className="space-y-2">
                  {course.resources.textbooks.map((book, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="text-white"
                    >
                      {book}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

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

export default CourseDetails;