import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Database, Calendar, Users } from "lucide-react";
import ParticleBackground from "./ParticleBackground";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";

const features = [
  { name: "Course Information", description: "Access detailed course materials, syllabi, and learning objectives.", icon: BookOpen, href: "/courses" },
  { name: "Resource Database", description: "Explore our curated collection of textbooks, papers, and tutorials.", icon: Database, href: "/resources" },
  { name: "Events", description: "Stay updated with upcoming conferences, seminars, and workshops.", icon: Calendar, href: "/events" },
  { name: "Members", description: "Connect with peers, discuss topics, and share knowledge.", icon: Users, href: "/members" },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load updates from Firestore with real-time listener
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        // Initial fetch
        const querySnapshot = await getDocs(collection(firestore, "homeUpdates"));
        const initialUpdates = querySnapshot.docs.map(doc => doc.data());
        setUpdates(initialUpdates);
        setLoading(false);

        // Real-time listener
        const unsubscribe = onSnapshot(collection(firestore, "homeUpdates"), (snapshot) => {
          const liveUpdates = snapshot.docs.map(doc => doc.data());
          setUpdates(liveUpdates);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading updates:", error);
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Update carousel index
  useEffect(() => {
    if (updates.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % updates.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [updates]);

  return (
    <>
      <div className="relative min-h-screen bg-transparent">
        <ParticleBackground />
        <div className="relative z-10 space-y-12">
          {/* Hero Section */}
          <motion.div 
            className="text-center" 
            initial={{ opacity: 0, y: -30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Welcome to VeilCode Labs
            </h1>
            <p className="mt-6 text-lg leading-8 text-[rgb(224,204,250)]">
              Your comprehensive resource for Applied Cryptography and Topics in Cryptanalysis at IIIT Delhi.
            </p>
            <motion.div 
              className="mt-10 flex items-center justify-center gap-x-6" 
              whileHover={{ scale: 1.05 }}
            >
              <Link 
                to="/courses" 
                className="rounded-md bg-[rgb(136,58,234)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[rgb(49,10,101)] transition-all duration-300"
              >
                Explore Courses
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-semibold leading-6 text-[rgb(224,204,250)] hover:text-white transition-colors duration-300"
              >
                Learn more →
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div 
            className="mx-auto max-w-7xl px-6 lg:px-8" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold text-[rgb(224,204,250)]">
                Everything you need
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Comprehensive Learning Resources
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    className="group relative flex flex-col rounded-lg border border-[rgb(136,58,234)] p-6 hover:bg-[rgba(136,58,234,0.1)] transition"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                      <feature.icon className="h-5 w-5 text-[rgb(136,58,234)] group-hover:text-[rgb(224,204,250)] transition-colors duration-300" />
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-[rgb(224,204,250)] group-hover:text-white transition-colors duration-300">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </motion.div>

          {/* Latest Updates Section */}
          {loading ? (
            <div className="text-center text-[rgb(224,204,250)]">Loading updates...</div>
          ) : updates.length > 0 ? (
            <>
              <h3 className="text-2xl font-bold text-white mb-2">Latest Updates</h3>
              <div className="relative h-20 overflow-hidden flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    className="absolute w-full text-center"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: "0%", opacity: 1 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  >
                    <div className="border-l-4 border-[rgb(136,58,234)] pl-4 inline-block">
                      <h3 className="font-semibold text-[rgb(224,204,250)]">
                        {updates[currentIndex]?.title || "No updates available"}
                      </h3>
                      <p className="text-white">
                        {updates[currentIndex]?.description || ""}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="text-center text-[rgb(224,204,250)]">No updates available</div>
          )}
        </div>
      </div>
    </>
  );
}