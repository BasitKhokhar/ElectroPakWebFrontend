import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase'; // Make sure your firebase.js is correctly exporting `storage`
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CheckoutForm({ userId, totalAmount, shippingCost, finalTotal, cartItems }) {
  const navigate = useNavigate();
  console.log("data coming in checkout form", userId, shippingCost, finalTotal, cartItems)
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    Fname: '',
    email: '',
    phone: '',
    city: '',
    address: ''
  });
  const [emailError, setEmailError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'email') validateEmail(value);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(email !== '' && !emailPattern.test(email));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setSelectedFile(file);

    const storageRef = ref(storage, `WebOrders_receipts/${Date.now()}_${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
      console.log('✅ Uploaded image URL:', url);
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!imageUrl) {
      alert('Please upload a receipt image before submitting.');
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.Fname,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      address: formData.address,
      receipt_url: imageUrl,
      user_id: userId,
      subtotal: totalAmount,
      shipping_charges: shippingCost,
      total_amount: finalTotal,
      cart_items: cartItems,
      source: 'Web'
    };
    console.log("payload sending to backend", payload)
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ Submission failed:', errorData.message);
        alert(`Error: ${errorData.message || 'Failed to submit order'}`);
      } else {
        alert('Your Order is in Progress. You will soon get Order Confirmation message!');
        setFormData({ Fname: '', email: '', phone: '', city: '', address: '' });
        setImageUrl(null);
        setSelectedFile(null);
        navigate('/'); // Redirect to home after success
      }
    } catch (err) {
      console.error('❌ Network error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-1.5 ml-1 text-text" htmlFor="Fname">Full Name</label>
            <input
              type="text"
              name="Fname"
              placeholder="e.g. Basit Khokhar"
              value={formData.Fname}
              onChange={handleChange}
              required
              className="w-full bg-background border border-border rounded-xl py-3 px-4 text-text placeholder:text-mutedText/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-bold mb-1.5 ml-1 text-text" htmlFor="phone">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="+92..."
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-text placeholder:text-mutedText/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-1.5 ml-1 text-text" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full bg-background border rounded-xl py-3 px-4 text-text placeholder:text-mutedText/50 outline-none transition-all focus:ring-2 focus:ring-primary/20 ${emailError ? 'border-error animate-shake' : 'border-border focus:border-primary'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-bold mb-1.5 ml-1 text-text" htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Lahore"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-text placeholder:text-mutedText/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            {/* Address */}
            <div>
              <label className="block text-sm font-bold mb-1.5 ml-1 text-text" htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                placeholder="House #, Street..."
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-text placeholder:text-mutedText/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Upload Image */}
          <div className="pt-2">
            <label className="block text-sm font-bold mb-2 ml-1 text-text" htmlFor="receipt">Upload Payment Receipt</label>
            <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer ${uploading ? 'bg-primary/5 border-primary/50' : 'bg-background border-border hover:border-primary/50'}`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i className="fas fa-cloud-upload-alt text-xl"></i>
              </div>
              <p className="text-xs font-bold text-mutedText text-center">
                {selectedFile ? selectedFile.name : 'Click or Drag receipt here'}
              </p>
              {uploading && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Uploading...</span>
                </div>
              )}
            </div>

            {imageUrl && (
              <div className='flex justify-center mt-4 group relative'>
                <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src={imageUrl} alt="Uploaded Receipt" className="relative w-24 h-24 object-cover rounded-xl border-2 border-white shadow-lg" />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-gradient-blue-pulse text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Order...</span>
            </div>
          ) : (
            <>
              <i className="fas fa-check-circle"></i>
              <span>Confirm & Place Order</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
