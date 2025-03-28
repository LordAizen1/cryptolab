import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus, ArrowLeft, Save, Users, BookOpen, Award, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

const iconComponents = {
  Users: Users,
  BookOpen: BookOpen,
  Award: Award,
  Building: Building
};

export default function AdminAbout() {
  const [aboutData, setAboutData] = useState({
    stats: [],
    researchAreas: [],
    contact: {
      location: "",
      details: ""
    }
  });
  const [editingSection, setEditingSection] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({ success: null, message: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(firestore, "content", "about");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAboutData({
            stats: data.stats || [],
            researchAreas: data.researchAreas || [],
            contact: data.contact || {
              location: "",
              details: ""
            }
          });
        } else {
          // Initialize with default data if document doesn't exist
          const defaultData = {
            stats: [
              { name: 'Active Students', value: '500+', icon: 'Users' },
              { name: 'Research Papers', value: '150+', icon: 'BookOpen' },
              { name: 'Awards', value: '25+', icon: 'Award' },
              { name: 'Partner Institutions', value: '10+', icon: 'Building' }
            ],
            researchAreas: [
              {
                title: "Applied Cryptography",
                points: [
                  "Public Key Infrastructure",
                  "Secure Communication Protocols",
                  "Blockchain Technology",
                  "Zero-Knowledge Proofs"
                ]
              },
              {
                title: "Cryptanalysis",
                points: [
                  "Side-Channel Attacks",
                  "Quantum Cryptanalysis",
                  "Mathematical Cryptanalysis",
                  "Hardware Security"
                ]
              }
            ],
            contact: {
              location: "Cryptography Research Lab, IIIT Delhi, Okhla Industrial Estate, Phase III, New Delhi, India",
              details: "Email: Under-Development\nPhone: Under-Development\nOffice Hours: Under-Development"
            }
          };
          await setDoc(docRef, defaultData);
          setAboutData(defaultData);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        setSaveStatus({ success: false, message: 'Failed to load data' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAboutData();
  }, []);

  const handleSave = async () => {
    setSaveStatus({ success: null, message: 'Saving...' });
    try {
      const docRef = doc(firestore, "content", "about");
      await setDoc(docRef, aboutData, { merge: true });
      setSaveStatus({ success: true, message: 'Saved successfully!' });
      
      setTimeout(() => {
        setSaveStatus({ success: null, message: '' });
      }, 3000);
    } catch (error) {
      console.error("Error saving about data:", error);
      setSaveStatus({ 
        success: false, 
        message: `Error saving data: ${error.message}` 
      });
    }
  };

  const startEditing = (section, data) => {
    setEditingSection(section);
    setTempData(JSON.parse(JSON.stringify(data)));
  };

  const handleChange = (e, field, index) => {
    if (Array.isArray(tempData)) {
      const updated = [...tempData];
      if (field) {
        updated[index] = { ...updated[index], [field]: e.target.value };
      } else {
        updated[index] = e.target.value;
      }
      setTempData(updated);
    } else if (typeof tempData === 'object' && tempData !== null) {
      setTempData({ ...tempData, [field]: e.target.value });
    } else {
      setTempData(e.target.value);
    }
  };

  const saveChanges = () => {
    let updatedData = { ...aboutData };
    
    switch (editingSection) {
      case 'stats':
      case 'researchAreas':
        updatedData[editingSection] = tempData;
        break;
      case 'contactLocation':
        updatedData.contact.location = tempData;
        break;
      case 'contactDetails':
        updatedData.contact.details = tempData;
        break;
      default:
        break;
    }

    setAboutData(updatedData);
    setEditingSection(null);
  };

  const addStat = () => {
    const updatedStats = [...aboutData.stats, { name: '', value: '', icon: 'Users' }];
    setAboutData({ ...aboutData, stats: updatedStats });
  };

  const removeStat = (index) => {
    const updatedStats = aboutData.stats.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, stats: updatedStats });
  };

  const addResearchArea = () => {
    const updatedAreas = [...aboutData.researchAreas, { title: '', points: [''] }];
    setAboutData({ ...aboutData, researchAreas: updatedAreas });
  };

  const removeResearchArea = (index) => {
    const updatedAreas = aboutData.researchAreas.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, researchAreas: updatedAreas });
  };

  const addResearchPoint = (areaIndex) => {
    const updatedAreas = [...aboutData.researchAreas];
    updatedAreas[areaIndex].points.push('');
    setAboutData({ ...aboutData, researchAreas: updatedAreas });
  };

  const removeResearchPoint = (areaIndex, pointIndex) => {
    const updatedAreas = [...aboutData.researchAreas];
    updatedAreas[areaIndex].points = updatedAreas[areaIndex].points.filter((_, i) => i !== pointIndex);
    setAboutData({ ...aboutData, researchAreas: updatedAreas });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#13151a] flex items-center justify-center text-white">
      Loading...
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.2 }} 
      className="bg-[#13151a] min-h-screen p-8 text-white"
    >
      {/* Status Notification */}
      {saveStatus.message && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md ${
          saveStatus.success === true ? 'bg-green-600' : 
          saveStatus.success === false ? 'bg-red-600' : 'bg-blue-600'
        } text-white z-50 transition-opacity duration-300`}>
          {saveStatus.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center text-white hover:text-[rgb(136,58,234)] transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Go Back to Dashboard
        </button>
        {user && (
          <button
            onClick={handleSave}
            className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center"
            disabled={saveStatus.message === 'Saving...'}
          >
            {saveStatus.message === 'Saving...' ? (
              'Saving...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-[rgb(224,204,250)]">
        Manage About Page Content
      </h1>

      {/* Hardcoded Heading Section */}
      <div className="bg-[#23262d] rounded-lg p-6 mb-8 border border-[rgb(136,58,234)]">
        <h2 className="text-2xl font-bold text-white mb-2">
          About VeilCode Labs
        </h2>
        <p className="text-[rgb(224,204,250)]">
          VeilCode Labs is IIIT Delhi's premier platform for cryptography education and research,
          fostering collaboration and excellence in the field of cryptography and security.
        </p>
      </div>

      {/* Hardcoded Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[rgba(49,10,101,0.2)] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-2">Our Mission</h2>
          <p className="text-[rgb(224,204,250)]">
            To provide world-class education and research opportunities in cryptography, fostering innovation and excellence in information security.
          </p>
        </div>
        <div className="bg-[rgba(49,10,101,0.2)] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-2">Our Vision</h2>
          <p className="text-[rgb(224,204,250)]">
            To be a leading center of excellence in cryptography research and education, contributing to secure communication technologies.
          </p>
        </div>
      </div>

      {/* Stats Section (Editable) */}
      <div className="bg-[#23262d] rounded-lg p-6 mb-8 border border-[rgb(136,58,234)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Statistics</h2>
          {user && (
            <div className="flex gap-2">
              {editingSection !== 'stats' && (
                <button
                  onClick={() => startEditing('stats', [...aboutData.stats])}
                  className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center"
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </button>
              )}
              <button
                onClick={addStat}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </button>
            </div>
          )}
        </div>

        {editingSection === 'stats' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tempData.map((stat, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={stat.name}
                      onChange={(e) => handleChange(e, 'name', index)}
                      className="w-full bg-[#13151a] rounded-md p-2 text-white border border-[rgb(136,58,234)]"
                      placeholder="Stat name"
                    />
                    <button
                      onClick={() => {
                        const updated = tempData.filter((_, i) => i !== index);
                        setTempData(updated);
                      }}
                      className="text-red-500 hover:text-red-600 transition-colors duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleChange(e, 'value', index)}
                    className="w-full bg-[#13151a] rounded-md p-2 text-white border border-[rgb(136,58,234)]"
                    placeholder="Stat value"
                  />
                  <select
                    value={stat.icon}
                    onChange={(e) => handleChange(e, 'icon', index)}
                    className="w-full bg-[#13151a] rounded-md p-2 text-white border border-[rgb(136,58,234)]"
                  >
                    <option value="Users">Users Icon</option>
                    <option value="BookOpen">Book Icon</option>
                    <option value="Award">Award Icon</option>
                    <option value="Building">Building Icon</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setTempData([...tempData, { name: '', value: '', icon: 'Users' }])}
                className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Stat
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() => setEditingSection(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aboutData.stats.length > 0 ? (
              aboutData.stats.map((stat, index) => {
                const IconComponent = iconComponents[stat.icon] || Users;
                return (
                  <div key={index} className="bg-[rgba(49,10,101,0.2)] p-4 rounded-lg text-center relative">
                    <IconComponent className="h-8 w-8 mx-auto text-[rgb(136,58,234)]" />
                    <p className="mt-4 text-2xl font-semibold text-white">{stat.value || "Value"}</p>
                    <p className="text-[rgb(224,204,250)]">{stat.name || "Stat Name"}</p>
                    {user && (
                      <button
                        onClick={() => removeStat(index)}
                        className="absolute top-1 right-1 text-red-500 hover:text-red-600 transition-colors duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-4 text-center text-[rgb(224,204,250)] py-4">
                No statistics added yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* Research Areas (Editable) */}
      <div className="bg-[#23262d] rounded-lg p-8 border border-[rgb(136,58,234)] mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Research Areas</h2>
          {user && (
            <div className="flex gap-2">
              {editingSection !== 'researchAreas' && (
                <button
                  onClick={() => startEditing('researchAreas', [...aboutData.researchAreas])}
                  className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center"
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </button>
              )}
              <button
                onClick={addResearchArea}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </button>
            </div>
          )}
        </div>

        {editingSection === 'researchAreas' ? (
          <div className="space-y-8">
            {tempData.map((area, areaIndex) => (
              <div key={areaIndex} className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={area.title}
                    onChange={(e) => {
                      const updated = [...tempData];
                      updated[areaIndex].title = e.target.value;
                      setTempData(updated);
                    }}
                    className="flex-1 bg-[#13151a] rounded-md p-2 text-white border border-[rgb(136,58,234)] text-xl font-semibold"
                    placeholder="Research Area Title"
                  />
                  <button
                    onClick={() => {
                      const updated = tempData.filter((_, i) => i !== areaIndex);
                      setTempData(updated);
                    }}
                    className="text-red-500 hover:text-red-600 transition-colors duration-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-2 ml-6">
                  {area.points.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-center gap-2">
                      <span className="text-[rgb(224,204,250)]">•</span>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const updated = [...tempData];
                          updated[areaIndex].points[pointIndex] = e.target.value;
                          setTempData(updated);
                        }}
                        className="flex-1 bg-[#13151a] rounded-md p-2 text-white border border-[rgb(136,58,234)]"
                      />
                      <button
                        onClick={() => {
                          const updated = [...tempData];
                          updated[areaIndex].points = updated[areaIndex].points.filter((_, i) => i !== pointIndex);
                          setTempData(updated);
                        }}
                        className="text-red-500 hover:text-red-400 transition-colors duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const updated = [...tempData];
                      updated[areaIndex].points.push("");
                      setTempData(updated);
                    }}
                    className="text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300 flex items-center text-sm mt-2"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Point
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between pt-4">
              <button
                onClick={() => {
                  setTempData([...tempData, { title: "", points: [""] }]);
                }}
                className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Research Area
              </button>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setEditingSection(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {aboutData.researchAreas.length > 0 ? (
              aboutData.researchAreas.map((area, index) => (
                <div key={index} className="relative">
                  <h3 className="text-xl font-semibold text-[rgb(224,204,250)] mb-2">
                    {area.title || "Research Area Title"}
                  </h3>
                  <ul className="list-disc list-inside text-white space-y-2 ml-4">
                    {area.points.map((point, i) => (
                      <li key={i}>{point || "Research point..."}</li>
                    ))}
                  </ul>
                  {user && (
                    <button
                      onClick={() => removeResearchArea(index)}
                      className="absolute top-0 right-0 text-red-500 hover:text-red-600 transition-colors duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-[rgb(224,204,250)] py-4">
                No research areas added yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact Section (Editable) */}
      <div className="bg-[rgba(49,10,101,0.2)] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { section: 'contactLocation', title: 'Location', content: aboutData.contact.location },
            { section: 'contactDetails', title: 'Get in Touch', content: aboutData.contact.details }
          ].map((item) => (
            <div key={item.section} className="relative">
              {editingSection === item.section ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[rgb(224,204,250)] mb-2">{item.title}</h3>
                  <textarea
                    value={tempData}
                    onChange={(e) => setTempData(e.target.value)}
                    className="w-full bg-[#13151a] rounded-md p-2 text-white border border-[rgb(136,58,234)] h-32"
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setEditingSection(null)}
                      className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveChanges}
                      className="bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-[rgb(224,204,250)] mb-2">{item.title}</h3>
                  <p className="text-white whitespace-pre-line">
                    {item.content || `${item.title} information...`}
                  </p>
                  {user && (
                    <button
                      onClick={() => startEditing(item.section, item.content)}
                      className="absolute top-0 right-0 text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}