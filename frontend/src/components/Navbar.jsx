import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userString = localStorage.getItem("user");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const user = userString ? JSON.parse(userString) : null;

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${backendUrl}/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav
      className={`sticky w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-blue-50/80 backdrop-blur-lg border-b border-blue-200/50 shadow-sm py-2"
          : "bg-blue-50/40 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center shrink-0 cursor-pointer group">
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-2 rounded-xl text-white mr-3 transform group-hover:rotate-12 transition-transform duration-300 shadow-md">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <span
              className={`font-bold text-2xl tracking-tight transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-gray-800"}`}
            >
              Wander<span className="text-blue-600">Lust</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 items-center bg-gray-50/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-gray-200/50">
            {["Destinations", "Tours", "Stays"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all duration-300 relative"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3 relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-(--color3) to-(--color2) flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {(user.username || user.name).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {user.name || user.username}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 origin-top-right z-50 ${isProfileOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                >
                  <div className="p-2 space-y-1">
                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                      <p className="text-xs text-gray-500 font-medium">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.email || user.username}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-(--color1) rounded-xl transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      My Profile
                    </Link>
                    {user.role === "host" ? (
                      <Link
                        to="/mylistings"
                        className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-(--color1) rounded-xl transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        My Listings
                      </Link>
                    ) : (
                      <Link
                        to="/bookings"
                        className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-(--color1) rounded-xl transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        My Bookings
                      </Link>
                    )}
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium px-5 py-2.5 rounded-full text-gray-700 transition-all duration-300 hover:text-(--color1) hover:bg-white hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors focus:outline-none ${scrolled ? "text-gray-600 hover:bg-gray-100" : "text-gray-800 hover:bg-gray-100/50"}`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute w-full bg-blue-50/95 backdrop-blur-xl border-b border-blue-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 translate-y-0"
            : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {["Destinations", "Tours", "Stays"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-colors duration-200"
            >
              {item}
            </a>
          ))}
          <div className="pt-6 mt-4 border-t border-gray-100 flex flex-col space-y-3 px-2">
            {user ? (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-4 py-4 bg-gray-50 border-b border-gray-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-(--color3) to-(--color2) flex items-center justify-center text-white font-bold text-base shadow-sm">
                    {(user.username || user.name).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {user.username || user.name}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {user.email || "Traveler"}
                    </div>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    My Profile
                  </Link>
                  {user.role === "host" ? (
                    <Link
                      to="/mylistings"
                      className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      My Listings
                    </Link>
                  ) : (
                    <Link
                      to="/mybookings"
                      className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      My Bookings
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full text-center text-gray-700 bg-white/60 hover:text-(--color1) hover:bg-white font-medium py-3 rounded-xl transition-all duration-300 border border-white/50 hover:border-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="w-full bg-linear-to-br from-(--color3) to-(--color2) hover:from-(--color2) hover:to-(--color1) text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
