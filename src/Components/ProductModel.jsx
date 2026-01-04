import React, { useState } from 'react';
import { FaTimes, FaSpinner, FaCheckCircle } from 'react-icons/fa';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ProductModal = ({ product, onClose, onAddToCart, userid }) => {
  console.log('data coming in productmodel', userid, product)
  // const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!userid) {
      // Trigger login form opening in Navbar via custom event
      window.dispatchEvent(new CustomEvent('open-login-form'));
      onClose(); // Close the product modal
      return;
    }

    setIsLoading(true);
    const productWithOptions = {
      ...product,
      selectedColor,
      quantity: 1,
      user_id: userid,
    };
    console.log("payload sending to cart", productWithOptions)
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productWithOptions),
      });

      if (response.ok) {
        onAddToCart(productWithOptions); // Pass product with options
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose(); // Close the modal after adding to cart
        }, 2000);
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(userid)
  console.log(product)
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-text/40 backdrop-blur-md transition-all duration-300">
      <div className="bg-cardsBackground rounded-[2.5rem] shadow-2xl p-8 w-[95%] max-w-4xl relative border border-border animate-in fade-in zoom-in duration-300 overflow-hidden">
        {/* Success Message Modal */}
        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center z-[60] bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-cardsBackground p-8 rounded-[2.5rem] border border-border shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center text-success">
                <FaCheckCircle size={48} />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-text">Item Added!</h3>
                <p className="text-mutedText mt-1">Your product has been added to cart</p>
              </div>
            </div>
          </div>
        )}

        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-mutedText hover:text-text hover:bg-background p-2 rounded-full transition-all duration-300 z-10"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col md:flex-row gap-10 items-center relative">
          {/* Image Section */}
          <div className="w-full md:w-1/2 p-4 bg-background rounded-3xl border border-border/50 shadow-inner group">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105 mx-auto"
            />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 text-left">
            <div>
              <span className="text-primary font-bold tracking-widest text-xs uppercase">Product Details</span>
              <h2 className="text-3xl font-extrabold text-text mt-1">{product.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-3xl font-black text-primary">${product.price}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {product.stock > 0 ? `${product.stock} Units left` : 'Out of Stock'}
                </span>
              </div>
            </div>

            <p className="text-mutedText leading-relaxed">
              Experience the pinnacle of technology with the {product.name}. Designed for performance and reliability.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text mb-2 ml-1">Select Customization</label>
                <div className="relative">
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full bg-background border border-border text-text rounded-xl p-3 appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer font-medium"
                  >
                    <option value="None">Default Color</option>
                    <option value="White">Pure White</option>
                    <option value="Half White">Soft Pearl</option>
                    <option value="Chrome">Metallic Chrome</option>
                    <option value="Light Pink">Rose Quartz</option>
                    <option value="Light Grey">Modern Grey</option>
                    <option value="Burgandy">Deep Burgundy</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-mutedText">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isLoading}
                className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl hover:bg-hover transition-all shadow-xl shadow-primary/25 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-h-[60px]"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Add to Shopping Bag'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
