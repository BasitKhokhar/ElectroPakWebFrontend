import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ProductModal from './ProductModel';
import Loader from './Loader';
import SkeletonLoader from './SkeletonLoader';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TopProducts({ productsData, loggedInUserId }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(!productsData);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState({});

    useEffect(() => {
        AOS.init({ duration: 1000 });
        if (productsData && productsData.length > 0) {
            setProducts(productsData.slice(0, 8));
            setLoading(false);
        } else {
            fetchTopProducts();
        }
    }, [productsData]);

    const fetchTopProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/allproducts`);
            const data = await response.json();
            // Get only the first 10 products
            setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
        } catch (error) {
            console.error('Error fetching top products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleImageLoad = (id) => {
        setImageLoaded(prev => ({ ...prev, [id]: true }));
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader /></div>;

    return (
        <div className="mx-4 sm:mx-6 lg:mx-20 my-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div data-aos="fade-right">
                    <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">Featured Collection</span>
                    <h2 className="text-4xl font-extrabold text-text tracking-tight">Explore Our Products</h2>
                    <div className="h-1.5 w-20 bg-primary mt-4 rounded-full"></div>
                </div>

                <button
                    onClick={() => navigate('/products')}
                    className="group flex items-center gap-2 bg-cardsBackground border border-border px-6 py-3 rounded-2xl font-bold text-text hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-1"
                    data-aos="fade-left"
                >
                    See All Products
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="group flex flex-col bg-cardsBackground rounded-[2rem] border border-border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                        data-aos="fade-up"
                        data-aos-delay={index * 50}
                    >
                        {/* Product Image */}
                        <div className="relative h-64 overflow-hidden bg-background p-6">
                            {!imageLoaded[product.id] && (
                                <div className="absolute inset-0 bg-border animate-pulse"></div>
                            )}
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                onLoad={() => handleImageLoad(product.id)}
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-hover transition-colors"
                                >
                                    <FaShoppingCart size={18} />
                                    Quick Add
                                </button>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-lg font-bold text-text mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-sm text-mutedText line-clamp-2 mb-4">
                                High-quality engineering and premium design.
                            </p>

                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-2xl font-black text-primary">${product.price}</span>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${product.stock > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                    {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setIsModalOpen(false)}
                    onAddToCart={() => { }} // Placeholder logic
                    userid={loggedInUserId}
                />
            )}
        </div>
    );
}
