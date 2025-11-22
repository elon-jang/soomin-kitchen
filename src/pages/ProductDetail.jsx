import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { Minus, Plus, Star, Truck, ShieldCheck, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const { language } = useLanguage();
    const t = useTranslation(language);
    const { products, loading } = useProducts();

    if (loading) {
        return (
            <div className="container-custom py-20 text-center">
                <Loader className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
                <p className="text-lg text-gray-700">{t.common.loading}</p>
            </div>
        );
    }

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="container-custom py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">{t.product.notFound}</h2>
                <Button onClick={() => navigate('/')}>{t.product.returnHome}</Button>
            </div>
        );
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    return (
        <div className="container-custom py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                {/* Image Gallery (Simple for now) */}
                <div className="space-y-4">
                    <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-center">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm font-medium text-accent uppercase tracking-wider">
                            {typeof product.category === 'object' ? product.category[language] : product.category}
                        </span>
                        {product.isNew && (
                            <span className="bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase">
                                {t.product.newArrival}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {typeof product.name === 'object' ? product.name[language] : product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <p className="text-2xl font-semibold">₩{product.price.toLocaleString()}</p>
                        <div className="flex items-center text-yellow-400 text-sm">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-gray-400 ml-2">(24 {t.product.reviews})</span>
                        </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8">
                        {typeof product.description === 'object' ? product.description[language] : product.description}
                        <br /><br />
                        {t.product.authenticDescription}
                    </p>

                    <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Truck className="w-5 h-5 text-gray-400" />
                            <span>{t.product.freeShipping}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <ShieldCheck className="w-5 h-5 text-gray-400" />
                            <span>{t.product.authenticityGuaranteed}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex items-center border border-gray-200 w-fit">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="p-3 hover:bg-gray-50 transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="p-3 hover:bg-gray-50 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <Button onClick={handleAddToCart} className="flex-1">
                            {t.product.addToCart}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
