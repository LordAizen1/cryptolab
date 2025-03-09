import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Book, Video, Link as LinkIcon, Download, ChevronRight, Play, Clock, X } from 'lucide-react';

// Video Modal Component
const VideoModal = ({ isOpen, onClose, videoUrl }) => {
    // Extract video ID from YouTube URL
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
  

const resources = {
  lectures: [
    {
      title: 'Introduction to Modern Cryptography',
      description: 'Fundamentals of cryptography, basic principles, and historical context',
      duration: '80 minutes',
      instructor: 'Dr. Ravi Anand',
      pdfUrl: 'https://drive.google.com/file/d/1_TJW_qbC9Lih5-yI-SfBrN3Vh2enOAmN/view?usp=sharing'
    },
    {
      title: 'Symmetric Key Cryptography',
      description: 'Understanding block ciphers, stream ciphers, and their applications',
      duration: '80 minutes',
      instructor: 'Dr. Ravi Anand',
      pdfUrl: '#'
    }
  ],
  books: [
    {
      title: 'A Graduate Course in Applied Cryptography',
      authors: 'Dan Boneh and Victor Shoup',
      edition: 'version 0.6',
      year: 'Jan. 2023',
      link: 'https://crypto.stanford.edu/~dabo/cryptobook/BonehShoup_0_4.pdf'
    },
    {
      title: 'Cryptography Engineering',
      authors: 'Niels Ferguson, Bruce Schneier, and Tadayoshi Kohno',
      edition: '1st Edition',
      year: '2010',
      link: 'https://content.e-bookshelf.de/media/reading/L-654462-6089c9aec2.pdf'
    }
  ],
  videos: [
    {
      title: 'Introduction to Cryptography by Christof Paar',
      duration: '98 minutes',
      instructor: 'Christof Paar',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
      videoUrl: 'https://www.youtube.com/watch?v=2aHkqB2-46k'
    },
    {
      title: 'Quantum Computation',
      duration: '64 Videos ~11 Minutes each',
      instructor: 'Umesh Vazirani',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
      videoUrl: 'https://www.youtube.com/watch?v=Z1uoz_8dLH0&list=PL74Rel4IAsETUwZS_Se_P-fSEyEVQwni7'
    }
  ],
  researchPapers: [
    {
      title: 'Cryptology ePrint Archive',
      description: 'The Cryptology ePrint Archive provides rapid access to recent research in cryptology. Papers have been placed here by the authors and did not undergo any refereeing process other than verifying that the work seems to be within the scope of cryptology and meets some minimal acceptance criteria and publishing conditions.',
      url: 'https://eprint.iacr.org/'
    },
    {
      title: 'algoTRIC',
      description: 'Symmetric and asymmetric encryption algorithms for Cryptography -- A comparative analysis in AI era',
      url: 'https://arxiv.org/pdf/2412.15237'
    }
  ]
};

export default function Resources() {
  const [activeTab, setActiveTab] = useState('lectures');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const tabs = [
    { id: 'lectures', label: 'Lectures', icon: FileText },
    { id: 'books', label: 'Books', icon: Book },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'researchPapers', label: 'Research Papers', icon: LinkIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'lectures':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {resources.lectures.map((lecture, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
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
          </motion.div>
        );

      case 'books':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {resources.books.map((book, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
                <p className="text-[rgb(224,204,250)] mb-4">by {book.authors}</p>
                <div className="flex justify-between items-center text-sm text-white">
                  <div>{book.edition} • {book.year}</div>
                  <motion.a 
                    href={book.link}
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
          </motion.div>
        );

        case 'videos':
            return (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {resources.videos.map((video, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
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
              </motion.div>
            );

      case 'researchPapers':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {resources.researchPapers.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group bg-[#23262d] rounded-lg p-6 border border-[rgb(136,58,234)] hover:border-[rgb(224,204,250)] transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{link.title}</h3>
                    <p className="text-[rgb(224,204,250)]">{link.description}</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-[rgb(136,58,234)] group-hover:text-[rgb(224,204,250)] transition-colors duration-300" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

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

      <div className="flex space-x-2 border-b border-[rgb(49,10,101)]">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-white bg-[rgb(49,10,101)] border-t border-l border-r border-[rgb(136,58,234)]'
                : 'text-[rgb(224,204,250)] hover:text-white'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {renderContent()}
      </div>
      <VideoModal 
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo}
      />
    </motion.div>
  );
}