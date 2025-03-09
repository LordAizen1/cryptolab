import React from 'react';
import { User, Mail, Book, Calendar, Clock, Award } from 'lucide-react';

export default function Profile() {
  const user = {
    name: 'John Doe',
    email: 'john.doe@iiitd.ac.in',
    role: 'Student',
    program: 'B.Tech CSE',
    year: '3rd Year',
    enrolledCourses: [
      {
        id: 1,
        name: 'Applied Cryptography',
        progress: 75,
        nextDeadline: '2024-03-15',
        assignment: 'Assignment 4: Public Key Cryptography',
      },
      {
        id: 2,
        name: 'Topics in Cryptanalysis',
        progress: 60,
        nextDeadline: '2024-03-20',
        assignment: 'Project Milestone 2',
      },
    ],
    achievements: [
      'Best Project Award - Cryptography Seminar 2023',
      'Runner-up - Crypto Challenge 2023',
      'Published paper in International Cryptography Conference',
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]">
        <div className="flex items-center space-x-6">
          <div className="bg-[rgb(49,10,101)] rounded-full p-4">
            <User className="h-16 w-16 text-[rgb(224,204,250)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-[rgb(224,204,250)]">
                <Mail className="h-4 w-4 mr-2" />
                {user.email}
              </div>
              <div className="flex items-center text-[rgb(224,204,250)]">
                <Book className="h-4 w-4 mr-2" />
                {user.program}
              </div>
              <div className="text-[rgb(224,204,250)]">{user.year}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]">
        <h2 className="text-2xl font-bold text-white mb-4">Enrolled Courses</h2>
        <div className="space-y-6">
          {user.enrolledCourses.map((course) => (
            <div key={course.id} className="border-b border-[rgb(49,10,101)] pb-4 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-white">{course.name}</h3>
                <span className="text-[rgb(224,204,250)]">{course.progress}% Complete</span>
              </div>
              <div className="w-full bg-[rgba(49,10,101,0.2)] rounded-full h-2 mb-4">
                <div
                  className="bg-[rgb(136,58,234)] h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-[rgb(224,204,250)]">
                  <Calendar className="h-4 w-4 mr-2" />
                  Next Deadline: {course.nextDeadline}
                </div>
                <div className="flex items-center text-[rgb(224,204,250)]">
                  <Clock className="h-4 w-4 mr-2" />
                  {course.assignment}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]">
        <h2 className="text-2xl font-bold text-white mb-4">Achievements</h2>
        <div className="space-y-4">
          {user.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-[rgb(136,58,234)]" />
              <span className="text-[rgb(224,204,250)]">{achievement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-[rgb(136,58,234)] text-white py-3 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300">
          Update Profile
        </button>
        <button className="border border-[rgb(136,58,234)] text-white py-3 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300">
          Download Transcript
        </button>
      </div>
    </div>
  );
}