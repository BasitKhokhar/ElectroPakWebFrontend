import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Signup = ({ toggleLoginForm, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: ''
  });

  const [emailError, setEmailError] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If the field being changed is 'email', validate it
    if (name === 'email') {
      validateEmail(value);
    }
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Show red border if the email is invalid
    setEmailError(!emailPattern.test(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) {
      alert("Please enter a valid email address.");
      return;
    }
    console.log("Signup Payload sending to backend", formData)
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.message) {
      alert(data.message);
      toggleLoginForm(); // Automatically switch to the Login form after successful signup
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-text/30 z-50 transition-all duration-300">
      <form className="bg-cardsBackground p-8 rounded-2xl shadow-2xl mx-4 w-full sm:w-full md:w-2/4 lg:w-2/4 relative border border-border max-h-[90vh] overflow-y-auto scrollbar-hide" onSubmit={handleSubmit}>
        <button type="button" onClick={onClose} className="absolute top-6 right-6 text-mutedText hover:text-text transition-colors p-2 hover:bg-background rounded-full">
          <FaTimes size={20} />
        </button>
        <h2 className="text-3xl mb-6 font-bold text-text">Create Account</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-mutedText mb-1 ml-1">Full Name</label>
            <input type="text" name="name" placeholder="John Doe" className="p-3 border border-border rounded-xl w-full focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" onChange={handleChange} required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-mutedText mb-1 ml-1">Email Address</label>
            <input type="email" name="email" placeholder="john@example.com" className={`p-3 border rounded-xl w-full transition-all outline-none focus:ring-2 focus:ring-primary/20 ${emailError ? 'border-error bg-error/5' : 'border-border focus:border-primary'}`} onChange={handleChange} required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-mutedText mb-1 ml-1">Password</label>
            <input type="password" name="password" placeholder="••••••••" className="p-3 border border-border rounded-xl w-full focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-mutedText mb-1 ml-1">Phone Number</label>
            <input type="text" name="phone" placeholder="+1..." className="p-3 border border-border rounded-xl w-full focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-mutedText mb-1 ml-1">City</label>
            <input type="text" name="city" placeholder="New York" className="p-3 border border-border rounded-xl w-full focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" onChange={handleChange} required />
          </div>
        </div>

        <button
          className="w-full mt-6 bg-gradient-blue-pulse text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-0.5"
          type="submit"
        >
          Get Started
        </button>

        <p className="mt-6 text-center text-mutedText">
          Already have an account?{' '}
          <span className="text-primary font-bold hover:underline cursor-pointer ml-1" onClick={toggleLoginForm}>
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
