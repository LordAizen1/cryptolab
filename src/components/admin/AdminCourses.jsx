import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    credits: '',
    offeredTo: '',
    description: '',
    instructor: '',
    duration: '',
    students: '',
    rating: '',
    image: '',
    prerequisites: {
      mandatory: [],
      desirable: [],
      other: []
    },
    courseOutcomes: [],
    weeklyPlan: [],
    assessment: [],
    resources: {
      textbooks: []
    },
    nextStart: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'courses'));
      const coursesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('resources.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        resources: {
          ...prev.resources,
          [child]: value
            .split(',') // Split by commas
            .map(item => item.trim()) // Trim whitespace from ends only
            .filter(item => item !== '') // Remove empty items
        }
      }));
    } else if (name.includes('prerequisites.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        prerequisites: {
          ...prev.prerequisites,
          [child]: value.split(',').map(item => item.trim())
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (e, arrayName) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [arrayName]: value.split(',').map(item => item.trim())
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse?.id) {
        await updateDoc(doc(firestore, 'courses', editingCourse.id), formData);
        setCourses(prevCourses =>
          prevCourses.map(course => (course.id === editingCourse.id ? { ...course, ...formData } : course))
        );
      } else {
        const docRef = await addDoc(collection(firestore, 'courses'), formData);
        setCourses(prevCourses => [...prevCourses, { id: docRef.id, ...formData }]);
      }
      setEditingCourse(null);
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      courseCode: '',
      credits: '',
      offeredTo: '',
      description: '',
      instructor: '',
      duration: '',
      students: '',
      rating: '',
      image: '',
      prerequisites: {
        mandatory: [],
        desirable: [],
        other: []
      },
      courseOutcomes: [],
      weeklyPlan: [],
      assessment: [],
      resources: {
        textbooks: []
      },
      nextStart: ''
    });
  };

  const handleDelete = async (courseId) => {
    await deleteDoc(doc(firestore, 'courses', courseId));
    setCourses(courses.filter(course => course.id !== courseId));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center text-white hover:text-[rgb(136,58,234)] transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Go Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold text-white text-center">Manage Courses</h1>

      {user && (
        <button onClick={() => setEditingCourse({})} className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </button>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {courses.map((course) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} whileHover={{ scale: 1.02 }} className="bg-[#23262d] rounded-lg border border-[rgb(136,58,234)] transition-all duration-300 shadow-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
            <p className="text-[rgb(224,204,250)] mb-4 text-sm">{course.description}</p>
            <p className="text-white"><strong>Course Code:</strong> {course.courseCode}</p>
            <p className="text-white"><strong>Instructor:</strong> {course.instructor}</p>
            <p className="text-white"><strong>Duration:</strong> {course.duration}</p>
            <p className="text-white"><strong>Students:</strong> {course.students}</p>
            <p className="text-white"><strong>Rating:</strong> {course.rating}</p>
            
            {course.image && (
              <img src={course.image} alt={course.title} className="w-full h-32 object-cover rounded-lg mt-3" />
            )}

            {user && (
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => {
                    setEditingCourse(course);
                    setFormData(course);
                  }}
                  className="text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
                >
                  <Edit className="h-5 w-5" />
                </button>

                <button onClick={() => handleDelete(course.id)} className="text-red-500 hover:text-red-600 transition-colors duration-300">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {editingCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[#23262d] rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">{editingCourse.id ? 'Edit Course' : 'Add Course'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
              <input name="courseCode" placeholder="Course Code" value={formData.courseCode} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
              <input name="credits" placeholder="Credits" type="number" value={formData.credits} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
              <input name="offeredTo" placeholder="Offered To" value={formData.offeredTo} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" rows="3" />
              <input name="instructor" placeholder="Instructor" value={formData.instructor} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
              <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
              <input name="students" placeholder="Number of Students" type="number" value={formData.students} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
              <input name="rating" placeholder="Rating (1-5)" type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
              <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
              <input name="nextStart" placeholder="Next Start Date (YYYY-MM-DD)" value={formData.nextStart} onChange={handleChange} className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />

              <div className="space-y-2">
                <h3 className="text-white font-semibold">Prerequisites</h3>
                <input name="prerequisites.mandatory" placeholder="Mandatory (comma separated)" value={formData.prerequisites.mandatory.join(', ')} onChange={handleChange} className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
                <input name="prerequisites.desirable" placeholder="Desirable (comma separated)" value={formData.prerequisites.desirable.join(', ')} onChange={handleChange} className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
                <input name="prerequisites.other" placeholder="Other (comma separated)" value={formData.prerequisites.other.join(', ')} onChange={handleChange} className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-semibold">Course Outcomes (comma separated)</h3>
                <textarea name="courseOutcomes" placeholder="CO1: Outcome 1, CO2: Outcome 2, ..." value={formData.courseOutcomes.join(', ')} onChange={(e) => handleArrayChange(e, 'courseOutcomes')} className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" rows="3" />
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-semibold">Assessment Plan (format: Type:Contribution, ...)</h3>
                <textarea name="assessment" placeholder="Mid-sem:25, End-sem:35, ..." value={formData.assessment.map(item => `${item.type}:${item.contribution}`).join(', ')} onChange={(e) => {
                  const value = e.target.value;
                  const assessment = value.split(',').map(item => {
                    const [type, contribution] = item.split(':').map(part => part.trim());
                    return { type, contribution: parseInt(contribution) || 0 };
                  });
                  setFormData({ ...formData, assessment });
                }} className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" rows="2" />
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-semibold">Resources</h3>
                <textarea name="resources.textbooks" placeholder="Textbooks (comma separated)" value={formData.resources.textbooks.join(', ')} onChange={handleChange} className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" rows="2" />
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button type="button" onClick={() => {
                  setEditingCourse(null);
                  resetForm();
                }} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                  Cancel
                </button>
                <button type="submit" className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)]">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}