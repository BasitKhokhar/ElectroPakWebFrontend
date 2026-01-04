import React, { useState } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FormComponent = () => {
    // for Loader state //
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        description: ''
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
    // for Email validation function
    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Do not show red border if the field is empty
        if (email === '') {
            setEmailError(false);
        } else {
            setEmailError(!emailPattern.test(email));
        }
    };
    // Handle form submission
    const Submit = (e) => {
        e.preventDefault();
        if (emailError) {
            alert('Please enter a valid email address.');
            return;
        }
        setLoading(true);
        fetch(`${API_BASE_URL}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Form submitted successfully!');
                    alert('Form submitted successfully!');
                } else {
                    console.error('Error submitting form');
                    alert('Error Submitting Form');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="mx-auto w-full">
            <form onSubmit={Submit} className="bg-cardsBackground text-text shadow-2xl rounded-[2.5rem] p-10 border border-border relative overflow-hidden group">
                {/* Decorative Background Elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500"></div>

                <div className="relative">
                    <div className="mb-8">
                        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Get in Touch</span>
                        <h1 className="text-3xl font-extrabold text-text tracking-tight">Contact Us For Any Queries!</h1>
                        <div className="h-1.5 w-16 bg-primary mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-text ml-1" htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="w-full bg-background border border-border text-text rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-mutedText/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-text ml-1" htmlFor="phone">Phone No</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g. +1 234 567 890"
                                className="w-full bg-background border border-border text-text rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-mutedText/50"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <label className="block text-sm font-bold text-text ml-1" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className={`w-full bg-background border ${emailError ? 'border-error' : 'border-border'} text-text rounded-xl py-3 px-4 focus:ring-2 ${emailError ? 'focus:ring-error/20 focus:border-error' : 'focus:ring-primary/20 focus:border-primary'} outline-none transition-all placeholder:text-mutedText/50`}
                            required
                        />
                        {emailError && <p className="text-xs text-error mt-1 ml-1 font-medium">Please enter a valid email address.</p>}
                    </div>

                    <div className="mt-6 space-y-2">
                        <label className="block text-sm font-bold text-text ml-1" htmlFor="description">Message</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength="1500"
                            placeholder="How can we help you?"
                            className="w-full bg-background border border-border text-text rounded-xl h-32 py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-mutedText/50"
                            required
                        />
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={loading || emailError}
                            className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-hover active:scale-[0.98] transition-all shadow-xl shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Submitting...
                                </>
                            ) : (
                                'Send Message'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormComponent;
