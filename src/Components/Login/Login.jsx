import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Login = ({ toggleSignupForm, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [emailError, setEmailError] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'email') {
      validateEmail(value);
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      setEmailError(false);
    } else {
      setEmailError(!emailPattern.test(email));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.userId) {
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', data.username);
      localStorage.setItem('userEmail', data.useremail);
      alert(data.message);
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-text/30 z-50 transition-all duration-300">
      <form className="bg-cardsBackground p-8 rounded-2xl shadow-2xl mx-4 w-full sm:w-full md:w-2/4 lg:w-1/3 relative border border-border" onSubmit={handleSubmit}>
        <button type="button" onClick={onClose} className="absolute top-6 right-6 text-mutedText hover:text-text transition-colors p-2 hover:bg-background rounded-full">
          <FaTimes size={20} />
        </button>
        <h2 className="text-3xl mb-6 font-bold text-text">Welcome Back</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-mutedText mb-1 ml-1" >Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              className={`p-3 border rounded-xl w-full transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20 ${emailError ? 'border-error bg-error/5' : 'border-border focus:border-primary'}`}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-mutedText mb-1 ml-1" >Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="p-3 border border-border rounded-xl w-full transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="w-full bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-hover hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-0.5"
            type="submit"
          >
            Sign In
          </button>
        </div>

        <p className="mt-6 text-center text-mutedText">
          Don't have an account?
          <span className="text-primary font-bold hover:underline ml-1 cursor-pointer" onClick={toggleSignupForm}>
            Create account
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
