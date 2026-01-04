import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import CheckoutForm from './Login/Checkoutform';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Payment_methods from './Payment_methods';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems, totalAmount, loggedInUserId, userName } = location.state || { cartItems: [], totalAmount: 0 };
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  useEffect(() => {
    setShippingCost(totalAmount < 200000 ? 3000 : 0);
  }, [totalAmount]);

  const finalTotal = totalAmount + shippingCost;

  const handleOrderSubmit = async () => {
    const orderData = {
      orderId: Date.now(),
      userId: loggedInUserId,
      userName: userName,
      totalAmount,
      shippingCost,
      finalTotal,
      totalItems: cartItems.length,
      orderDate: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert('Order successfully stored!');
        navigate('/');
      } else {
        throw new Error('Failed to store order data.');
      }
    } catch (error) {
      console.error('Error storing order:', error);
      alert('Error storing order data. Please try again.');
    }
  };

  if (!cartItems.length) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div className="bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-12 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Order Summary Section */}
        <div className="flex-1 space-y-8" data-aos="fade-right">
          <div className="flex items-center justify-between border-b border-border pb-6">
            <h1 className="text-3xl font-extrabold text-text tracking-tight">Order Summary</h1>
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold border border-primary/20">
              {cartItems.length} Items
            </span>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {cartItems.map((item) => (
              <div key={item.cart_id} className="group bg-white p-5 rounded-2xl border border-border flex gap-6 items-center hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-20 h-20 bg-background rounded-xl p-2 flex items-center justify-center border border-border/50">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-text group-hover:text-primary transition-colors">{item.name}</h2>
                    <p className="text-mutedText text-sm font-medium">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary">{item.price * item.quantity} PKR</p>
                    <p className="text-xs text-mutedText font-bold uppercase tracking-wider">{item.price} PKR / unit</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-white p-8 rounded-3xl border border-border shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="flex justify-between items-center text-mutedText">
              <span className="font-medium text-lg">Sub-total</span>
              <span className="font-bold">{totalAmount} PKR</span>
            </div>
            <div className="flex justify-between items-center text-mutedText">
              <span className="font-medium text-lg">Shipping Charges</span>
              <span className={`font-bold ${shippingCost === 0 ? 'text-success' : ''}`}>
                {shippingCost > 0 ? `${shippingCost} PKR` : 'Free'}
              </span>
            </div>
            <div className="pt-4 border-t border-border flex justify-between items-center">
              <span className="text-xl font-bold text-text">Total Payable</span>
              <div className="text-right">
                <p className="text-3xl font-black text-primary">{finalTotal} PKR</p>
                <p className="text-xs text-mutedText/60 font-medium">Include all taxes and shipping</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Form Section */}
        <div className="lg:w-[450px]" data-aos="fade-left">
          <div className="sticky top-32">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text mb-2">Delivery Details</h2>
              <p className="text-mutedText font-medium">Please provide accurate information for timely delivery.</p>
            </div>
            <div className="bg-white rounded-3xl border border-border p-2 shadow-xl hover:shadow-2xl transition-all duration-500">
              <CheckoutForm
                cartItems={cartItems}
                totalAmount={totalAmount}
                shippingCost={shippingCost}
                finalTotal={finalTotal}
                userId={loggedInUserId}
                userName={userName}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-border">
        <Payment_methods />
      </div>
    </div>
  );
};

export default Checkout;
