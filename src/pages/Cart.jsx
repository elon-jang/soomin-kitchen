import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { Trash2, Minus, Plus, ArrowRight, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';
import { useProducts } from '../hooks/useProducts';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, isLoading: isCartLoading } = useCart();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = useTranslation(language);
    const { products, loading: isProductsLoading } = useProducts();

    const isLoading = isCartLoading || isProductsLoading;

    // Helper function to get product name in current language
    const getProductName = (item) => {
        const product = products.find(p => p.id === item.id);
        if (!product) return item.name;
        return typeof product.name === 'object' ? product.name[language] : product.name;
    };

    // Helper function to get product category in current language
    const getProductCategory = (item) => {
        const product = products.find(p => p.id === item.id);
        if (!product) return item.category || '';
        return typeof product.category === 'object' ? product.category[language] : (product.category || '');
    };

    if (isLoading) {
        return (
            <div className="container-custom py-20 text-center">
                <Loader className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
                <p className="text-lg text-gray-700">{t.common.loading}</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container-custom py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">{t.cart.emptyTitle}</h2>
                <p className="text-gray-500 mb-8">{t.cart.emptyMessage}</p>
                <Button onClick={() => navigate('/')}>{t.cart.startShopping}</Button>
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            <h1 className="text-3xl font-bold mb-12">{t.cart.title}</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="flex-1">
                    <div className="border-b border-gray-200 pb-4 mb-4 hidden md:flex text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex-1">{t.cart.product}</div>
                        <div className="w-32 text-center">{t.cart.quantity}</div>
                        <div className="w-32 text-right">{t.cart.total}</div>
                    </div>

                    <div className="space-y-8">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-100 pb-8 last:border-0">
                                <div className="w-full md:w-24 aspect-square bg-gray-100">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="font-medium text-lg mb-1">{getProductName(item)}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{getProductCategory(item)}</p>
                                    <p className="text-gray-900 md:hidden">₩{item.price.toLocaleString()}</p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-sm text-red-500 hover:text-red-700 flex items-center justify-center md:justify-start gap-1 mt-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> {t.cart.remove}
                                    </button>
                                </div>

                                <div className="flex items-center border border-gray-200">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-2 hover:bg-gray-50 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-2 hover:bg-gray-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="w-32 text-right font-semibold text-lg hidden md:block">
                                    ₩{(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-96">
                    <div className="bg-gray-50 p-8 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">{t.cart.orderSummary}</h2>

                        <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>{t.cart.subtotal}</span>
                                <span>₩{getCartTotal().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>{t.cart.shipping}</span>
                                <span>{t.cart.calculated}</span>
                            </div>
                        </div>

                        <div className="flex justify-between font-bold text-xl mb-8">
                            <span>{t.cart.total}</span>
                            <span>₩{getCartTotal().toLocaleString()}</span>
                        </div>

                        <Button
                            onClick={() => navigate('/checkout')}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            {t.cart.proceedToCheckout} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
