import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Database, 
  Home, 
  Info, 
  Users, 
  UserCircle, 
  LogOut, 
  Settings, 
  Newspaper, 
  FlaskRound as Flask,
  Menu,
  X
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRefs = useRef({});

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                <span className="ml-2 text-xl font-bold text-white">Cryptolab</span>
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
              
              <div className="ml-4 relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-white hover:text-[rgb(224,204,250)] hover:bg-[rgb(49,10,101)] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  <UserCircle className="h-6 w-6" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#23262d] ring-1 ring-black ring-opacity-5 border border-[rgb(136,58,234)]">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-[rgb(49,10,101)] hover:text-[rgb(224,204,250)]"
                        role="menuitem"
                      >
                        <UserCircle className="mr-3 h-5 w-5" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-[rgb(49,10,101)] hover:text-[rgb(224,204,250)]"
                        role="menuitem"
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                      </Link>
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-white hover:bg-[rgb(49,10,101)] hover:text-[rgb(224,204,250)]"
                        role="menuitem"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rest of the code remains exactly the same */}
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
                      
                      <div className="border-t border-[rgb(49,10,101)] mt-2 pt-2 grid grid-cols-3 gap-1">
                        <Link
                          to="/profile"
                          className="flex flex-col items-center justify-center p-3 rounded-md text-sm font-medium text-white hover:bg-[rgb(49,10,101)] hover:text-[rgb(224,204,250)]"
                        >
                          <UserCircle className="h-5 w-5 mb-1" />
                          <span className="text-xs">Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex flex-col items-center justify-center p-3 rounded-md text-sm font-medium text-white hover:bg-[rgb(49,10,101)] hover:text-[rgb(224,204,250)]"
                        >
                          <Settings className="h-5 w-5 mb-1" />
                          <span className="text-xs">Settings</span>
                        </Link>
                        <button
                          className="flex flex-col items-center justify-center p-3 rounded-md text-sm font-medium text-white hover:bg-[rgb(49,10,101)] hover:text-[rgb(224,204,250)]"
                        >
                          <LogOut className="h-5 w-5 mb-1" />
                          <span className="text-xs">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile Profile Button */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="md:hidden text-white hover:text-[rgb(224,204,250)] focus:outline-none p-2 rounded-md hover:bg-[rgb(49,10,101)] transition-all duration-300"
              >
                <UserCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-[#23262d] text-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Cryptolab</h3>
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