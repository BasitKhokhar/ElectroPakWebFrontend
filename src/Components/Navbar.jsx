import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import Cart from './Cart';
import LoginForm from './Login/Login';
import SignupForm from './Login/Signup';
import logo from '../assets/logo2.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Navbar = ({ userId }) => {
  const [logoimage, setLogoImage] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isSignupFormOpen, setIsSignupFormOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState({ name: 'Guest User', email: 'Please login to see details', profilePic: '' });
  const location = useLocation();

  // Ref for the cart dropdown
  const cartRef = useRef(null);
  const profileRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/logo_image`)
      .then(response => response.json())
      .then(data => setLogoImage(data))
      .catch(error => console.error('Error fetching logo image:', error));
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');

    if (userId) {
      // Set immediate data from localStorage if available
      if (storedName) {
        setUserData(prev => ({
          ...prev,
          name: storedName,
          email: storedEmail || prev.email
        }));
      }

      // Still fetch to ensure data is fresh/get profile pic
      fetch(`${API_BASE_URL}/api/users/${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.userName) {
            setUserData({
              name: data.userName,
              email: data.email || 'No email provided',
              profilePic: data.profilePic || ''
            });
            // Update localStorage with fresh data
            localStorage.setItem('userName', data.userName);
            localStorage.setItem('userEmail', data.email);
          }
        })
        .catch(error => console.error('Error fetching user details:', error));
    } else {
      setUserData({ name: 'Guest User', email: 'Please login to see details', profilePic: '' });
    }
  }, [userId]);

  // Global listener for opening login form
  useEffect(() => {
    const handleOpenLogin = () => {
      setIsLoginFormOpen(true);
      setIsSignupFormOpen(false);
      setIsProfileOpen(false);
    };

    window.addEventListener('open-login-form', handleOpenLogin);
    return () => window.removeEventListener('open-login-form', handleOpenLogin);
  }, []);

  const toggleLoginForm = () => {
    setIsLoginFormOpen(true);
    setIsSignupFormOpen(false);
  };

  const toggleSignupForm = () => {
    setIsSignupFormOpen(true);
    setIsLoginFormOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeAuthForms = () => {
    setIsLoginFormOpen(false);
    setIsSignupFormOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsCartOpen(false); // Close cart when profile opens
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (isCartOpen && userId) {
      fetch(`/cart?user_id=${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setCartItems(data);
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    }
  }, [isCartOpen, userId]);

  // Close cart when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);
  // New function to handle checkout
  const handleCheckout = () => {
    setIsCartOpen(false); // Close the cart
    setIsCheckoutOpen(true); // Open the checkout
  };
  useEffect(() => {
    const handleClickOutsideNavbar = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideNavbar);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNavbar);
    };
  }, [isOpen, isProfileOpen]);
  return (
    <nav className="bg-gradient-blue-sky fixed w-full z-50 top-0 shadow-lg border-b border-white/10 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between p-4 ">
        {/* Left side: Logo */}
        <div className="text-text font-bold text-xl">
          <Link to="/">
            <img src={logo} alt="ElectroPak Logo" className="h-14" />

          </Link>
        </div>

        {/* Middle: Nav Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={`px-4 py-2 transition-all duration-300 font-medium ${isActive('/') ? 'bg-white/20 text-white rounded-full shadow-lg border border-white/30' : 'text-white/90 hover:text-white hover:bg-white/10 rounded-full'}`}>Home</Link>
          <Link to="/products" className={`px-4 py-2 transition-all duration-300 font-medium ${isActive('/products') ? 'bg-white/20 text-white rounded-full shadow-lg border border-white/30' : 'text-white/90 hover:text-white hover:bg-white/10 rounded-full'}`}>Products</Link>
          <Link to="/services" className={`px-4 py-2 transition-all duration-300 font-medium ${isActive('/services') ? 'bg-white/20 text-white rounded-full shadow-lg border border-white/30' : 'text-white/90 hover:text-white hover:bg-white/10 rounded-full'}`}>Services</Link>
          <Link to="/contact" className={`px-4 py-2 transition-all duration-300 font-medium ${isActive('/contact') ? 'bg-white/20 text-white rounded-full shadow-lg border border-white/30' : 'text-white/90 hover:text-white hover:bg-white/10 rounded-full'}`}>Contact</Link>
          <Link to="/about" className={`px-4 py-2 transition-all duration-300 font-medium ${isActive('/about') ? 'bg-white/20 text-white rounded-full shadow-lg border border-white/30' : 'text-white/90 hover:text-white hover:bg-white/10 rounded-full'}`}>About Us</Link>
        </div>

        <div className="hidden md:flex space-x-4">
          <button onClick={toggleCart} className="text-white bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/5 rounded-full p-2.5 transition-all duration-300 transform hover:scale-110 flex items-center justify-center relative group">
            <FaShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border border-white animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
          <div className="relative" ref={profileRef}>
            <button onClick={toggleProfile} className="text-white bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/5 rounded-full p-2.5 transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
              <FaUser size={22} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden transform origin-top-right transition-all duration-300 animate-in fade-in zoom-in-95">
                {/* User Info Section */}
                <div className="p-5 bg-gradient-blue-sky shadow-inner flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-2 border-white/50 bg-white/20 overflow-hidden flex items-center justify-center">
                    {userData.profilePic ? (
                      <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <FaUser size={24} className="text-white/80" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-lg leading-tight truncate w-40">{userData.name}</span>
                    <span className="text-white/80 text-xs truncate w-40">{userData.email}</span>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="p-4 bg-white">
                  {!userId ? (
                    <button
                      onClick={() => { toggleLoginForm(); setIsProfileOpen(false); }}
                      className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-hover transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      Login / Sign Up
                    </button>
                  ) : (
                    <button
                      onClick={() => { localStorage.removeItem('userId'); window.location.reload(); }}
                      className="w-full bg-error/10 text-error font-bold py-3 rounded-xl hover:bg-error hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu for small screens */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white bg-white/10 border border-white/20 p-2 rounded-xl focus:outline-none transition-all duration-300 hover:bg-white/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      <div ref={navbarRef} className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-gradient-blue-sky border-t border-white/10 mt-2 flex flex-col p-4 space-y-2 transition-all duration-300`} >
        <Link to="/" onClick={closeMenu}
          className={`p-3 transition-all duration-300 font-medium ${isActive('/') ? 'bg-white/20 text-white rounded-xl shadow-lg border border-white/30' : 'text-white/90 hover:bg-white/10 hover:rounded-xl'
            }`}>
          Home
        </Link>
        <Link to="/products" onClick={closeMenu}
          className={`p-3 transition-all duration-300 font-medium ${isActive('/products') ? 'bg-white/20 text-white rounded-xl shadow-lg border border-white/30' : 'text-white/90 hover:bg-white/10 hover:rounded-xl'
            }`}>
          Products
        </Link>
        <Link to="/services" onClick={closeMenu}
          className={`p-3 transition-all duration-300 font-medium ${isActive('/services') ? 'bg-white/20 text-white rounded-xl shadow-lg border border-white/30' : 'text-white/90 hover:bg-white/10 hover:rounded-xl'
            }`}>
          Services
        </Link>
        <Link to="/contact" onClick={closeMenu}
          className={`p-3 transition-all duration-300 font-medium ${isActive('/contact') ? 'bg-white/20 text-white rounded-xl shadow-lg border border-white/30' : 'text-white/90 hover:bg-white/10 hover:rounded-xl'
            }`}>
          Contact
        </Link>
        <Link to="/about" onClick={closeMenu}
          className={`p-3 transition-all duration-300 font-medium ${isActive('/about') ? 'bg-white/20 text-white rounded-xl shadow-lg border border-white/30' : 'text-white/90 hover:bg-white/10 hover:rounded-xl'
            }`}>
          About Us
        </Link>
        <div className="border-t border-white/10 mt-2 pt-2 flex space-x-4">
          <Link to="/cart" onClick={toggleCart}
            className="flex-1 text-white bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-[1.02] p-3 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm">
            <FaShoppingCart size={20} className="text-white" />
            <span className="ml-2 font-semibold">Cart</span>
          </Link>
          <button onClick={toggleProfile}
            className="flex-1 text-white bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-[1.02] p-3 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm">
            <FaUser size={20} className="text-white" />
            <span className="ml-2 font-semibold">{userId ? 'Profile' : 'Login'}</span>
          </button>
        </div>
      </div>
      {/* Cart Dropdown */}
      {isCartOpen && (
        <div ref={cartRef} className="absolute top-20 left-1/2 transform -translate-x-1/2 transition duration-500 shadow-lg p-2 w-full sm:w-full md:w-full lg:w-2/4 bg-white">
          <Cart cartItems={cartItems} loggedInUserId={userId} onCheckout={handleCheckout} closeCart={closeCart} /> {/* Pass handleCheckout to Cart */}
        </div>
      )}
      {/* Conditionally render login or signup forms */}
      {isLoginFormOpen && <LoginForm toggleSignupForm={toggleSignupForm} onClose={closeAuthForms} />}
      {isSignupFormOpen && <SignupForm toggleLoginForm={toggleLoginForm} onClose={closeAuthForms} />}
      {/* Checkout Component - render it conditionally based on the state */}
      {isCheckoutOpen && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 shadow-lg p-4 w-full sm:w-full md:w-full lg:w-2/4 bg-white">
          {/* Your Checkout component here */}
          <h2 className="text-xl font-bold">Checkout</h2>
          {/* Add your Checkout component logic and display */}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
