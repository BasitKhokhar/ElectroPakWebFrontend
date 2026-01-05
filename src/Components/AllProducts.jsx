import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModel';
import Loader from './Loader';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaShoppingCart } from 'react-icons/fa';
import SkeletonLoader from './SkeletonLoader';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function AllProducts({ loggedInUserId }) {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  const [productsdata, setProductsData] = useState({
    productsData: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/products`)
      .then(response => response.json())
      .then(data => {
        setProductsData({ productsData: data });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFilteredProducts(
      productsdata.productsData.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, productsdata.productsData]);

  const handleImageLoad = (productId) => {
    setImageLoading((prevState) => ({
      ...prevState,
      [productId]: false,
    }));
  };

  const handleImageError = (productId) => {
    setImageLoading((prevState) => ({
      ...prevState,
      [productId]: false,
    }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mx-4 sm:mx-4 md:mx-6 lg:mx-14 gap-4 mt-40">
        {Array(16).fill(0).map((_, index) => (
          <SkeletonLoader key={index} />
        ))}
      </div>
    );
  }
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleAddToCartClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="mx-4 sm:mx-4 md:mx-6 lg:mx-14 mb-20">
      <div className="mt-32 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-text tracking-tight mb-2">Explore Our Products</h1>
          <p className="text-mutedText font-medium">Find the best products tailored for your needs.</p>
        </div>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            className="border border-border rounded-xl p-3 pl-10 w-full focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 bg-cardsBackground text-text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText">🔍</span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-cardsBackground border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            data-aos="fade-up"
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-background">
              {imageLoading[product.id] !== false && (
                <div className="absolute inset-0 bg-border animate-pulse"></div>
              )}
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onLoad={() => handleImageLoad(product.id)}
                onError={() => handleImageError(product.id)}
              />

              {/* Overlay with Actions */}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center">
                <button
                  className="bg-primary hover:bg-hover text-white px-6 py-2 rounded-full font-bold shadow-lg transition-colors flex items-center gap-2"
                  onClick={() => handleAddToCartClick(product)}
                >
                  <FaShoppingCart size={20} />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-text mb-1 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
              <div className="flex items-center justify-between mt-auto pt-4">
                <span className="text-xl font-extrabold text-primary">{product.price}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${product.stock > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12 gap-2">
        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`w-10 h-10 rounded-xl border transition-all duration-300 font-bold ${currentPage === index + 1
              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
              : 'bg-cardsBackground border-border text-mutedText hover:border-primary hover:text-primary'
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={(productWithOptions) => {
            console.log('Added to cart:', productWithOptions);
          }}
          userid={loggedInUserId}
        />
      )}
    </div>
  );
}
