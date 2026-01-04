import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import Cart from './Cart';
import LoginForm from './Login/Login';
import SignupForm from './Login/Signup';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Navbar = ({ userId }) => {
  const [logoimage, setLogoImage] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isSignupFormOpen, setIsSignupFormOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // New state for Checkout
  const location = useLocation();

  // Ref for the cart dropdown
  const cartRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/logo_image`)
      .then(response => response.json())
      .then(data => setLogoImage(data))
      .catch(error => console.error('Error fetching logo image:', error));
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
    };

    document.addEventListener('mousedown', handleClickOutsideNavbar);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNavbar);
    };
  }, [isOpen]);
  return (
    <nav className="bg-gradient-blue-sky fixed w-full z-50 top-0 shadow-lg border-b border-white/10 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between p-4 ">
        {/* Left side: Logo */}
        <div className="text-text font-bold text-xl">
          <Link to="/">
            {/* {logoimage && logoimage.map((item) => (
              <div key={item.id}>
                <img src={item.image_url} alt="" className="h-14" />
              </div>
            ))} */}
            <img src="src/assets/logo2.png" alt="" className="h-14" />
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

        {/* Icons */}
        <div className="hidden md:flex space-x-4">
          <button onClick={toggleCart} className="text-white border-none hover:bg-white/20 rounded-full p-2.5 transition-all duration-300">
            <FaShoppingCart size={22} />
          </button>
          <button onClick={toggleLoginForm} className="text-white border-none hover:bg-white/20 rounded-full p-2.5 transition-all duration-300">
            <FaUser size={22} />
          </button>
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
            className="flex-1 text-white border border-white/20 hover:bg-white/10 p-3 rounded-xl flex items-center justify-center transition-all duration-300">
            <FaShoppingCart size={20} className="text-white" />
            <span className="ml-2">Cart</span>
          </Link>
          <button onClick={toggleLoginForm}
            className="flex-1 text-white border border-white/20 hover:bg-white/10 p-3 rounded-xl flex items-center justify-center transition-all duration-300">
            <FaUser size={20} className="text-white" />
            <span className="ml-2">Login</span>
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
