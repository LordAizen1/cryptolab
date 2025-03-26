import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Database, 
  Home, 
  Info, 
  Users, 
  Newspaper, 
  FlaskRound as Flask,
  Menu,
  X,
  ArrowUp,
  Shield // Added Shield icon for admin button
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Resources', href: '/resources', icon: Database },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Blog', href: '/blog', icon: Newspaper },
  { name: 'Labs', href: '/labs', icon: Flask },
  { name: 'About', href: '/about', icon: Info },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate(); // Added useNavigate for admin button
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRefs = useRef({});

  // State for scroll-to-top button visibility
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Scroll event listener to show/hide the scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handle admin login button click
  const handleAdminLoginClick = () => {
    navigate('/admin-login');
  };

  // Update indicator position when location changes
  useEffect(() => {
    const currentTab = navRefs.current[location.pathname];
    if (currentTab) {
      const rect = currentTab.getBoundingClientRect();
      const parentRect = currentTab.parentElement.getBoundingClientRect();
      
      setIndicatorStyle({
        width: `${rect.width}px`,
        transform: `translateX(${rect.left - parentRect.left}px)`,
      });
    }
  }, [location]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#13151a]">
      <nav className="bg-[#23262d] border-b border-[rgb(136,58,234)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="ml-2 text-xl font-bold text-white">VeilCode Labs</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className="flex items-baseline space-x-4 relative">
                {/* Animated indicator */}
                <div 
                  className="absolute bottom-0 h-1 bg-[rgb(136,58,234)] transition-all duration-300 ease-in-out rounded-full"
                  style={indicatorStyle}
                />
                
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      ref={el => navRefs.current[item.href] = el}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'text-[rgb(224,204,250)]'
                          : 'text-white hover:text-[rgb(224,204,250)]'
                      } rounded-md px-3 py-2 text-sm font-medium transition-all duration-300`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Admin Login Button - Added this section */}
              <button
                onClick={handleAdminLoginClick}
                className="ml-4 bg-[rgb(136,58,234)] text-white py-2 px-4 rounded-md hover:bg-[rgb(49,10,101)] transition-colors duration-300 flex items-center"
                aria-label="Admin login"
              >
                <Shield className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <div className="relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white hover:text-[rgb(224,204,250)] focus:outline-none p-2 rounded-md hover:bg-[rgb(49,10,101)] transition-all duration-300"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>

                {isMobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-[#23262d] ring-1 ring-black ring-opacity-5 border border-[rgb(136,58,234)] z-50">
                    <div className="p-2">
                      <div className="grid grid-cols-2 gap-1">
                        {navigation.map((item) => {
                          const isActive = location.pathname === item.href;
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              className={`${
                                isActive
                                  ? 'bg-[rgb(49,10,101)] text-[rgb(224,204,250)]'
                                  : 'text-white hover:bg-[rgb(49,10,101)] hover:text-[rgb(224,204,250)]'
                              } flex flex-col items-center justify-center p-3 rounded-md text-sm font-medium transition-all duration-300`}
                            >
                              <item.icon className="h-5 w-5 mb-1" />
                              <span className="text-xs">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                      {/* Added Admin Button to mobile menu */}
                      <button
                        onClick={handleAdminLoginClick}
                        className="w-full flex items-center justify-center p-3 rounded-md text-sm font-medium text-white hover:bg-[rgb(49,10,101)] hover:text-[rgb(224,204,250)] mt-2"
                      >
                        <Shield className="h-5 w-5 mr-2" />
                        <span className="text-xs">Admin</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Scroll-to-top button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-[rgb(136,58,234)] text-white rounded-full shadow-lg hover:bg-[rgb(49,10,101)] transition-all duration-300"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      <footer className="bg-[#23262d] text-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">VeilCode Labs</h3>
              <p className="text-[rgb(224,204,250)]">
                A comprehensive resource for cryptography students at IIIT Delhi
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[rgb(224,204,250)]">Quick Links</h3>
              <ul className="grid grid-cols-2 gap-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-white hover:text-[rgb(224,204,250)] hover:bg-[rgb(49,10,101)] px-2 py-1 rounded transition-all duration-300 inline-block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[rgb(224,204,250)]">Contact</h3>
              <p className="text-white">
                IIIT Delhi<br />
                Okhla Industrial Estate, Phase III<br />
                New Delhi, India
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}