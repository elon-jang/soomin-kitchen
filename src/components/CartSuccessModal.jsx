import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';

const CartSuccessModal = () => {
    const { showSuccessModal, closeSuccessModal } = useCart();
    const { language } = useLanguage();
    const t = useTranslation(language);
    const navigate = useNavigate();

    // Auto close after 3 seconds
    useEffect(() => {
        if (showSuccessModal) {
            const timer = setTimeout(() => {
                closeSuccessModal();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessModal, closeSuccessModal]);

    if (!showSuccessModal) return null;

    const handleGoToCart = () => {
        closeSuccessModal();
        navigate('/cart');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 w-[320px] pointer-events-auto animate-fade-in-up relative">
                <button
                    onClick={closeSuccessModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center pt-2 pb-6">
                    <p className="text-gray-800 font-medium mb-6">
                        {t.cart.itemAdded || "상품이 장바구니에 담겼습니다."}
                    </p>

                    <button
                        onClick={handleGoToCart}
                        className="w-full py-3 px-4 border border-accent text-accent font-bold rounded hover:bg-accent/5 transition-colors flex items-center justify-center gap-1"
                    >
                        {t.cart.goToCart || "장바구니 바로가기"} <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSuccessModal;
