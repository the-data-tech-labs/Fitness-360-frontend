import React, { useState, useRef, useEffect, useCallback  } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faCog,
  faDumbbell,
  faChevronDown,
  faBars,
  faTimes,
  faHome,
  faCogs,
  faSpinner,
  faUsers,
  faAppleAlt
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const TopBar = ({ isLoggedIn, userData, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL
  // Fetch profile data from backend
  const fetchProfileData = useCallback(async () => {
    if (!isLoggedIn) return;
    
    setIsLoadingProfile(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${backendUrl}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProfileData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      // Fall back to userData if API fails
      setProfileData(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [backendUrl, isLoggedIn])

  // Fetch profile data when user logs in or component mounts
  useEffect(() => {
    if (isLoggedIn) {
      fetchProfileData();
    } else {
      setProfileData(null);
    }
  }, [isLoggedIn, fetchProfileData]);

  // Helper function to get display data (prefer API data, fallback to userData)
  const getDisplayData = () => {
    if (profileData) {
      return {
        username: profileData.user?.username || userData?.username || "User",
        height: profileData.height || "N/A",
        weight: profileData.weight || "N/A", 
        gender: profileData.gender || "N/A",
        age: profileData.age || "N/A",
        profile_picture: profileData.profile_picture_url,
        full_name: profileData.full_name
      };
    }
    
    // Fallback to userData
    return {
      username: userData?.username || "User",
      height: userData?.profile?.height || "N/A",
      weight: userData?.profile?.weight || "N/A",
      gender: userData?.profile?.gender || "N/A", 
      age: userData?.profile?.age || "N/A",
      profile_picture: userData?.profile?.profile_picture,
      full_name: userData?.profile?.full_name || userData?.username
    };
  };

  const displayData = getDisplayData();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    // Refresh profile data when menu opens
    if (!isMenuOpen && isLoggedIn && !profileData) {
      fetchProfileData();
    }
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    handleMenuClose();
    setProfileData(null); // Clear profile data on logout
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "Home", path: "/dashboard", icon: faHome },
    { name: "Services", path: "/services", icon: faCogs },
    { name: "Community", icon: faUsers, path: "/community" },
    { name: "Profile", icon: faUser, path: "/profile" },
    { name: "Fitness History", icon: faDumbbell, path: "/fitness-history" },
    { name: "Nutrition History", icon: faAppleAlt, path: "/nutrition-history" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b-4 border-purple-600 shadow-2xl backdrop-blur-sm"
      style={{ zIndex: 1000 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 w-full">
          {/* Logo - FIXED: Removed circular transition */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faDumbbell} className="text-white text-sm sm:text-lg" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              FitFlow
            </h1>
          </motion.div>

          {/* Desktop Navigation - FIXED: Underline for entire button */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className="group relative px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105 block"
                >
                  <div className="flex items-center space-x-2 relative z-10">
                    <FontAwesomeIcon icon={item.icon} className="text-sm group-hover:text-purple-300 transition-colors duration-300" />
                    <span className="group-hover:text-purple-300 transition-colors duration-300">{item.name}</span>
                  </div>
                  {/* FIXED: Hover underline effect for entire content */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-[calc(100%-16px)] transition-all duration-300 rounded-full"></div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* User Section - Responsive */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {isLoggedIn ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="relative z-[1001]"
              >
                <button
                  ref={buttonRef}
                  onClick={handleMenuToggle}
                  className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  {/* Profile Picture or Avatar */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    {displayData.profile_picture ? (
                      <img
                        src={displayData.profile_picture}
                        alt={displayData.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        {displayData.username?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-white font-medium text-xs sm:text-sm truncate max-w-20 sm:max-w-none">
                      {displayData.username}
                    </div>
                    <div className="text-purple-300 text-xs hidden md:block">Premium Member</div>
                  </div>
                  {isLoadingProfile ? (
                    <FontAwesomeIcon icon={faSpinner} className="text-purple-300 text-xs animate-spin" />
                  ) : (
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`text-purple-300 text-xs transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} 
                    />
                  )}
                </button>

                {/* Enhanced Dropdown Menu */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-slate-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl z-[9999] overflow-hidden"
                      style={{ 
                        position: 'absolute',
                        zIndex: 9999,
                        pointerEvents: 'auto'
                      }}
                      onMouseEnter={() => setIsMenuOpen(true)}
                      onMouseLeave={(e) => {
                        const rect = dropdownRef.current?.getBoundingClientRect();
                        const buttonRect = buttonRef.current?.getBoundingClientRect();
                        if (rect && buttonRect && 
                            (e.clientX < Math.min(rect.left, buttonRect.left) || 
                             e.clientX > Math.max(rect.right, buttonRect.right) || 
                             e.clientY < Math.min(rect.top, buttonRect.top) || 
                             e.clientY > rect.bottom)) {
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      {/* User Info Header */}
                      <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                            {displayData.profile_picture ? (
                              <img
                                src={displayData.profile_picture}
                                alt={displayData.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                                {displayData.username?.charAt(0)?.toUpperCase() || "U"}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-base sm:text-lg truncate">
                              {displayData.full_name || displayData.username}
                            </h3>
                            <p className="text-purple-300 text-sm">@{displayData.username}</p>
                            <p className="text-purple-300 text-xs">Premium Member</p>
                          </div>
                          {isLoadingProfile && (
                            <FontAwesomeIcon icon={faSpinner} className="text-purple-400 animate-spin" />
                          )}
                        </div>
                      </div>

                      {/* User Stats */}
                      <div className="p-3 sm:p-4 bg-slate-800/50">
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="bg-white/5 rounded-lg p-2 sm:p-3 text-center">
                            <div className="text-xs text-gray-400">Height</div>
                            <div className="text-xs sm:text-sm font-semibold text-white">
                              {displayData.height !== "N/A" ? `${displayData.height} cm` : "N/A"}
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 sm:p-3 text-center">
                            <div className="text-xs text-gray-400">Weight</div>
                            <div className="text-xs sm:text-sm font-semibold text-white">
                              {displayData.weight !== "N/A" ? `${displayData.weight} kg` : "N/A"}
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 sm:p-3 text-center">
                            <div className="text-xs text-gray-400">Gender</div>
                            <div className="text-xs sm:text-sm font-semibold text-white">
                              {displayData.gender}
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 sm:p-3 text-center">
                            <div className="text-xs text-gray-400">Age</div>
                            <div className="text-xs sm:text-sm font-semibold text-white">
                              {displayData.age !== "N/A" ? `${displayData.age} yrs` : "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/profile");
                            handleMenuClose();
                          }}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200 hover:scale-105"
                        >
                          <FontAwesomeIcon icon={faUser} className="text-purple-400" />
                          <span>Profile Settings</span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogoutClick();
                          }}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 hover:scale-105"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to="/auth"
                  className="px-3 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Sign In / Sign Up</span>
                  <span className="sm:hidden">Sign In</span>
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors duration-200"
              >
                <FontAwesomeIcon 
                  icon={isMobileMenuOpen ? faTimes : faBars} 
                  className="text-lg sm:text-xl" 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-white/10 bg-slate-800/50 backdrop-blur-sm"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={item.icon} className="text-purple-400" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {isLoggedIn ? (
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex items-center space-x-3 p-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                        {displayData.profile_picture ? (
                          <img
                            src={displayData.profile_picture}
                            alt={displayData.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {displayData.username?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{displayData.full_name || displayData.username}</div>
                        <div className="text-purple-300 text-sm">@{displayData.username}</div>
                        <div className="text-purple-300 text-sm">Premium Member</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faUser} className="text-purple-400" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faCog} className="text-purple-400" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogoutClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-white/10">
                    <Link
                      to="/auth"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Sign In / Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default TopBar;
