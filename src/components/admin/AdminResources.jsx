import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function AdminResources() {
  const [resources, setResources] = useState({
    lectures: {},
    books: {},
    videos: {},
    researchPapers: {},
  });
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    type: 'lectures',
    title: '',
    description: '',
    instructor: '',
    duration: '',
    pdfUrl: '',
    authors: '',
    edition: '',
    year: new Date().getFullYear().toString(),
    url: '',
    thumbnail: '',
    videoUrl: '',
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  // Organize resources by year
  const organizeByYear = (docs) => {
    const organized = {};
    docs.forEach(doc => {
      const year = doc.data().year || 'Uncategorized';
      if (!organized[year]) {
        organized[year] = [];
      }
      organized[year].push({ id: doc.id, ...doc.data() });
    });
    return organized;
  };

  // Fetch resources from Firestore
  useEffect(() => {
    const fetchResources = async () => {
      const lecturesSnapshot = await getDocs(collection(firestore, 'lectures'));
      const booksSnapshot = await getDocs(collection(firestore, 'books'));
      const videosSnapshot = await getDocs(collection(firestore, 'videos'));
      const researchPapersSnapshot = await getDocs(collection(firestore, 'researchPapers'));

      setResources({
        lectures: organizeByYear(lecturesSnapshot),
        books: organizeByYear(booksSnapshot),
        videos: organizeByYear(videosSnapshot),
        researchPapers: organizeByYear(researchPapersSnapshot),
      });
    };

    fetchResources();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or edit resource
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resourceData = {
        ...formData,
        year: formData.year || new Date().getFullYear().toString(),
      };

      if (editingResource?.id) {
        await updateDoc(doc(firestore, formData.type, editingResource.id), resourceData);
        setResources(prevResources => {
          const updated = { ...prevResources };
          // Remove from old year category if year changed
          if (editingResource.year && editingResource.year !== resourceData.year) {
            updated[formData.type][editingResource.year] = 
              updated[formData.type][editingResource.year]?.filter(r => r.id !== editingResource.id) || [];
          }
          // Add to new year category
          if (!updated[formData.type][resourceData.year]) {
            updated[formData.type][resourceData.year] = [];
          }
          updated[formData.type][resourceData.year] = [
            ...(updated[formData.type][resourceData.year]?.filter(r => r.id !== editingResource.id) ?? []),
            { id: editingResource.id, ...resourceData }
          ];
          return updated;
        });
      } else {
        const docRef = await addDoc(collection(firestore, formData.type), resourceData);
        setResources(prevResources => {
          const updated = { ...prevResources };
          const year = resourceData.year;
          if (!updated[formData.type][year]) {
            updated[formData.type][year] = [];
          }
          updated[formData.type][year] = [
            ...updated[formData.type][year],
            { id: docRef.id, ...resourceData }
          ];
          return updated;
        });
      }
      
      setEditingResource(null);
      setFormData({
        type: 'lectures',
        title: '',
        description: '',
        instructor: '',
        duration: '',
        pdfUrl: '',
        authors: '',
        edition: '',
        year: new Date().getFullYear().toString(),
        url: '',
        thumbnail: '',
        videoUrl: '',
      });
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  // Delete resource
  const handleDelete = async (resourceId, type, year) => {
    await deleteDoc(doc(firestore, type, resourceId));
    setResources(prevResources => {
      const updated = { ...prevResources };
      updated[type][year] = updated[type][year].filter(resource => resource.id !== resourceId);
      // Remove year if empty
      if (updated[type][year].length === 0) {
        delete updated[type][year];
      }
      return updated;
    });
  };

  // Render form fields based on resource type
  const renderFormFields = () => {
    switch (formData.type) {
      case 'lectures':
        return (
          <>
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="instructor" placeholder="Instructor" value={formData.instructor} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="pdfUrl" placeholder="PDF URL" value={formData.pdfUrl} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
          </>
        );
      case 'books':
        return (
          <>
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="authors" placeholder="Authors" value={formData.authors} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="edition" placeholder="Edition" value={formData.edition} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="url" placeholder="Link" value={formData.url} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
          </>
        );
      case 'videos':
        return (
          <>
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="instructor" placeholder="Instructor" value={formData.instructor} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="thumbnail" placeholder="Thumbnail URL" value={formData.thumbnail} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="videoUrl" placeholder="Video URL" value={formData.videoUrl} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
          </>
        );
      case 'researchPapers':
        return (
          <>
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="url" placeholder="URL" value={formData.url} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
            <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} required className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]" />
          </>
        );
      default:
        return null;
    }
  };

  // Render resources grouped by year
  const renderResourcesByYear = (type) => {
    const years = Object.keys(resources[type]).sort((a, b) => b.localeCompare(a)); // Sort years descending
    
    return years.map(year => (
      <div key={year} className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4 border-b border-[rgb(136,58,234)] pb-2">
          {year === 'Uncategorized' ? 'Uncategorized' : `Year: ${year}`}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {resources[type][year].map((resource) => (
            <motion.div 
              key={resource.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#23262d] rounded-lg border border-[rgb(136,58,234)] transition-all duration-300 shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
              <p className="text-[rgb(224,204,250)] mb-4 text-sm">{resource.description}</p>
              {resource.instructor && <p className="text-white"><strong>Instructor:</strong> {resource.instructor}</p>}
              {resource.duration && <p className="text-white"><strong>Duration:</strong> {resource.duration}</p>}
              {resource.authors && <p className="text-white"><strong>Authors:</strong> {resource.authors}</p>}
              {resource.edition && <p className="text-white"><strong>Edition:</strong> {resource.edition}</p>}
              {resource.year && <p className="text-white"><strong>Year:</strong> {resource.year}</p>}
              {resource.url && (
                <p className="text-white">
                  <strong>Link:</strong> 
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] ml-2">
                    {resource.url}
                  </a>
                </p>
              )}
              {resource.thumbnail && <img src={resource.thumbnail} alt={resource.title} className="w-full h-32 object-cover rounded-lg mt-3" />}

              {user && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingResource(resource);
                      setFormData({ ...resource, type });
                    }}
                    className="text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
                  >
                    <Edit className="h-5 w-5" />
                  </button>

                  <button 
                    onClick={() => handleDelete(resource.id, type, year)} 
                    className="text-red-500 hover:text-red-600 transition-colors duration-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-8">
      {/* Header with Go Back Button */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center text-white hover:text-[rgb(136,58,234)] transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Go Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold text-white text-center">Manage Resources</h1>

      {user && (
        <button 
          onClick={() => setEditingResource({})} 
          className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </button>
      )}

      {/* Resource Tabs */}
      <div className="flex space-x-2 border-b border-[rgb(49,10,101)]">
        {['lectures', 'books', 'videos', 'researchPapers'].map((type) => (
          <motion.button
            key={type}
            onClick={() => setFormData(prev => ({ ...prev, type }))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-all duration-300 ${
              formData.type === type
                ? 'text-white bg-[rgb(49,10,101)] border-t border-l border-r border-[rgb(136,58,234)]'
                : 'text-[rgb(224,204,250)] hover:text-white'
            }`}
          >
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </motion.button>
        ))}
      </div>

      {/* Resource List */}
      <div className="space-y-8">
        {renderResourcesByYear(formData.type)}
      </div>

      {/* Add/Edit Resource Modal */}
      {editingResource && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[#23262d] rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">{editingResource.id ? 'Edit Resource' : 'Add Resource'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange} 
                required 
                className="w-full bg-[#13151a] text-white rounded-md px-4 py-2 border border-[rgb(136,58,234)]"
              >
                <option value="lectures">Lectures</option>
                <option value="books">Books</option>
                <option value="videos">Videos</option>
                <option value="researchPapers">Research Papers</option>
              </select>
              {renderFormFields()}
              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => setEditingResource(null)} 
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)]"
                >
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