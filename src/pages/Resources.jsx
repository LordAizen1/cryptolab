import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Book, Video, Link as LinkIcon, Download, ChevronRight, Play, Clock, X } from 'lucide-react';
import { firestore } from '../firebase';
import { collection, getDocs } from "firebase/firestore";

// Video Modal Component
const VideoModal = ({ isOpen, onClose, videoUrl }) => {
  const getYouTubeId = (url) => {
    if (!url) return '';
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-[#23262d] rounded-lg overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white hover:text-[rgb(224,204,250)] transition-colors duration-300"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=1`}
                title="YouTube video player"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Resources() {
  const [activeTab, setActiveTab] = useState('lectures');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [resources, setResources] = useState({
    lectures: {},
    books: {},
    videos: {},
    researchPapers: {},
  });

  const tabs = [
    { id: 'lectures', label: 'Lectures', icon: FileText },
    { id: 'books', label: 'Books', icon: Book },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'researchPapers', label: 'Research Papers', icon: LinkIcon },
  ];

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

  useEffect(() => {
    const fetchResources = async () => {
      const lecturesSnapshot = await getDocs(collection(firestore, "lectures"));
      const booksSnapshot = await getDocs(collection(firestore, "books"));
      const videosSnapshot = await getDocs(collection(firestore, "videos"));
      const researchPapersSnapshot = await getDocs(collection(firestore, "researchPapers"));

      setResources({
        lectures: organizeByYear(lecturesSnapshot),
        books: organizeByYear(booksSnapshot),
        videos: organizeByYear(videosSnapshot),
        researchPapers: organizeByYear(researchPapersSnapshot),
      });
    };

    fetchResources();
  }, []);

  const handleViewPaperDetails = (paper) => {
    setSelectedPaper(paper);
  };

  // Function to parse author names into an array
  const parseAuthors = (authorsString) => {
    if (!authorsString) return [];
    // Split by comma and trim whitespace
    return authorsString.split(',').map(author => author.trim()).filter(author => author);
  };

  const renderContentByYear = (items) => {
    const years = Object.keys(items).sort((a, b) => b.localeCompare(a));
    
    return years.map(year => (
      <div key={year} className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-[rgb(136,58,234)] pb-2">
          {year === 'Uncategorized' ? 'Other Resources' : year}
        </h3>
        
        {activeTab === 'lectures' && (
          <div className="space-y-6">
            {items[year].map((lecture, index) => (
              <motion.div 
                key={lecture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">{lecture.title}</h3>
                    <p className="text-[rgb(224,204,250)]">{lecture.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-white">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-[rgb(136,58,234)]" />
                        {lecture.duration}
                      </div>
                      <div>{lecture.instructor}</div>
                    </div>
                  </div>
                  <motion.a 
                    href={lecture.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-[rgb(136,58,234)] text-white px-4 py-2 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'books' && (
          <div className="grid md:grid-cols-2 gap-6">
            {items[year].map((book, index) => (
              <motion.div 
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
                <p className="text-[rgb(224,204,250)] mb-4">by {book.authors}</p>
                <div className="flex justify-between items-center text-sm text-white">
                  <div>{book.edition} • {book.year}</div>
                  <motion.a 
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span>Access Book</span>
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid md:grid-cols-2 gap-6">
            {items[year].map((video, index) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-[#23262d] rounded-lg overflow-hidden border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
              >
                <div className="relative h-48">
                  <img 
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <motion.button
                    onClick={() => setSelectedVideo(video.videoUrl)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-40 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="h-12 w-12 text-white" />
                  </motion.button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2">{video.title}</h3>
                  <div className="flex justify-between items-center text-sm text-[rgb(224,204,250)]">
                    <div>{video.instructor}</div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {video.duration}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'researchPapers' && selectedPaper === null && (
          <div className="grid md:grid-cols-2 gap-6">
            {items[year].map((paper, index) => (
              <motion.div 
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-[#23262d] rounded-lg border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">{paper.title}</h3>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleViewPaperDetails(paper)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center bg-[rgb(136,58,234)] text-white px-4 py-2 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
                  >
                    <span>View Paper Details</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  if (activeTab === 'researchPapers' && selectedPaper) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="space-y-8"
      >
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.3 }} 
          className="flex items-center mb-8"
        >
          <button 
            onClick={() => setSelectedPaper(null)} 
            className="flex items-center text-[rgb(136,58,234)] hover:text-[rgb(224,204,250)] transition-colors duration-300"
          >
            <ChevronRight className="h-5 w-5 mr-2 transform rotate-180" />
            Back to Research Papers
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)]"
        >
          <motion.h2 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-2xl font-bold text-white mb-4"
          >
            {selectedPaper.title}
          </motion.h2>
          
          {selectedPaper.year && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-[rgb(224,204,250)] mb-6"
            >
              Publication Year: {selectedPaper.year}
            </motion.p>
          )}
          
          {selectedPaper.authors && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold text-[rgb(224,204,250)] mb-3">Authors</h3>
              <ul className="list-disc pl-5 space-y-1">
                {parseAuthors(selectedPaper.authors).map((author, index) => (
                  <li key={index} className="text-white">{author}</li>
                ))}
              </ul>
            </motion.div>
          )}
          
          {selectedPaper.abstract && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold text-[rgb(224,204,250)] mb-2">Abstract</h3>
              <p className="text-white">{selectedPaper.abstract}</p>
            </motion.div>
          )}
          
          {selectedPaper.url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="flex justify-center mt-8"
            >
              <motion.a
                href={selectedPaper.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center bg-[rgb(136,58,234)] text-white px-6 py-3 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300"
              >
                <Download className="h-5 w-5 mr-2" />
                View Full Paper
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  }

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
          Course Resources
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="text-[rgb(224,204,250)] text-lg"
        >
          Access all course materials, recommended readings, and additional resources.
        </motion.p>
      </div>

      <div className="flex space-x-2 border-b border-[rgb(49,10,101)] overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedPaper(null);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-white bg-[rgb(49,10,101)] border-t border-l border-r border-[rgb(136,58,234)]'
                : 'text-[rgb(224,204,250)] hover:text-white'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="hidden md:inline">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {renderContentByYear(resources[activeTab])}
      </div>
      
      <VideoModal 
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo}
      />
    </motion.div>
  );
}