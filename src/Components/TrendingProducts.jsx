import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModel';
import Loader from './Loader';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaShoppingCart } from 'react-icons/fa';
import SkeletonLoader from './SkeletonLoader';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TrendingProducts({ loggedInUserId }) {
  console.log("userid in trending products:", loggedInUserId)
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
  const [productsPerPage] = useState(8);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/trending_products`)
      .then(response => response.json())
      .then(data => {
        setProductsData({ productsData: data });
        setLoading(false);
        console.log("trending products", data)
      })

      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFilteredProducts(
      productsdata.productsData.filter(product =>
        product.product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-4 sm:mx-4 md:mx-6 lg:mx-14">
        {Array(9)
          .fill(0)
          .map((_, index) => (
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
    <div className="mx-4 sm:mx-4 md:mx-6 lg:mx-20 mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <h2 className="text-3xl font-extrabold text-text tracking-tight">Trending Products</h2>
        <div className="h-1 w-20 bg-primary rounded-full"></div>
      </div>

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
                src={product.product.image_url}
                alt={product.product.name}
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
                  <FaShoppingCart />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-text mb-1 line-clamp-1 group-hover:text-primary transition-colors">{product.product.name}</h3>
              <div className="flex items-center justify-between mt-auto pt-4">
                <span className="text-xl font-extrabold text-primary">${product.product.price}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${product.product.stock > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {product.product.stock > 0 ? `In Stock (${product.product.stock})` : 'Out of Stock'}
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
  )
}
