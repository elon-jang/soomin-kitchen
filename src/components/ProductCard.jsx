import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { language } = useLanguage();
    const t = useTranslation(language);

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation if clicking the button
        addToCart(product);
    };

    return (
        <Link to={`/product/${product.id}`} className="group block">
            <div className="relative overflow-hidden bg-gray-100 aspect-[4/5] mb-4">
                <img
                    src={product.image}
                    alt={typeof product.name === 'object' ? product.name[language] : product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {product.isNew && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider">
                        {t.home.newProduct}
                    </span>
                )}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-4 right-4 p-3 bg-white text-black shadow-lg translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-white"
                    aria-label="Add to cart"
                >
                    <ShoppingBag className="w-5 h-5" />
                </button>
            </div>
            <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {typeof product.category === 'object' ? product.category[language] : product.category}
                </p>
                <h3 className="font-medium text-lg leading-tight group-hover:text-accent transition-colors">
                    {typeof product.name === 'object' ? product.name[language] : product.name}
                </h3>
                <p className="font-semibold text-gray-900">
                    ₩{product.price.toLocaleString()}
                </p>
            </div>
        </Link>
    );
};

export default ProductCard;
