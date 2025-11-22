import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import Button from '../components/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';
import { products } from '../data/products';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = useTranslation(language);

    // Helper function to get product name in current language
    const getProductName = (item) => {
        const product = products.find(p => p.id === item.id);
        if (!product) return item.name;
        return typeof product.name === 'object' ? product.name[language] : product.name;
    };
    const [isProcessing, setIsProcessing] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const paymentWidgetRef = useRef(null);
    const paymentMethodsWidgetRef = useRef(null);

    const [formData, setFormData] = useState({
        email: '',
        fullName: ''
    });

    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
    const customerKey = user?.id || ANONYMOUS;

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                fullName: user.user_metadata?.name || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
            return;
        }

        let mounted = true;

        const initializePaymentWidget = async () => {
            try {
                console.log('Initializing payment widget...', {
                    clientKey,
                    customerKey,
                    cartTotal: getCartTotal()
                });

                // DOM 요소 초기화
                const paymentMethodElement = document.querySelector('#payment-method');
                if (paymentMethodElement) {
                    paymentMethodElement.innerHTML = '';
                }

                const tossPayments = await loadTossPayments(clientKey);
                console.log('TossPayments loaded:', tossPayments);

                if (!mounted) return;

                const widgets = tossPayments.widgets({ customerKey });
                console.log('Widgets created:', widgets);

                paymentWidgetRef.current = widgets;

                await widgets.setAmount({
                    currency: 'KRW',
                    value: getCartTotal(),
                });
                console.log('Amount set:', getCartTotal());

                if (!mounted) return;

                const paymentMethodsWidget = await widgets.renderPaymentMethods({
                    selector: '#payment-method',
                    variantKey: 'DEFAULT'
                });
                console.log('Payment methods rendered');

                if (!mounted) return;

                paymentMethodsWidgetRef.current = paymentMethodsWidget;
                setIsReady(true);
            } catch (error) {
                if (!mounted) return;

                console.error('Payment widget initialization error:', error);
                console.error('Error details:', {
                    message: error.message,
                    code: error.code,
                    stack: error.stack
                });
                alert(`${t.checkout.widgetInitError} ${error.message || t.common.error}`);
            }
        };

        initializePaymentWidget();

        return () => {
            mounted = false;
            if (paymentMethodsWidgetRef.current) {
                try {
                    paymentMethodsWidgetRef.current.destroy();
                } catch (e) {
                    console.log('Widget already destroyed');
                }
            }
        };
    }, [cartItems, customerKey, clientKey, getCartTotal, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const generateOrderId = () => {
        return `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isReady) {
            alert(t.checkout.paymentWait);
            return;
        }

        setIsProcessing(true);

        try {
            const orderId = generateOrderId();
            const firstProductName = getProductName(cartItems[0]);
            const orderName = cartItems.length > 1
                ? `${firstProductName} 외 ${cartItems.length - 1}건`
                : firstProductName;

            // Supabase에 주문 생성
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user?.id || null,
                    order_id: orderId,
                    amount: getCartTotal(),
                    order_name: orderName,
                    customer_email: formData.email,
                    customer_name: formData.fullName,
                    status: 'PENDING'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 주문 상품 저장
            const orderItems = cartItems.map(item => {
                // Store product name as JSON string if it's an object (multilingual)
                const productName = typeof item.name === 'object'
                    ? JSON.stringify(item.name)
                    : item.name;

                return {
                    order_id: orderData.id,
                    product_id: item.id,
                    product_name: productName,
                    quantity: item.quantity,
                    unit_price: item.price
                };
            });

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 토스페이먼츠 결제 요청
            await paymentWidgetRef.current.requestPayment({
                orderId: orderId,
                orderName: orderName,
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
                customerEmail: formData.email,
                customerName: formData.fullName
            });

        } catch (error) {
            console.error('Payment request error:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            alert(`${t.checkout.paymentRequestError} ${error.message || t.common.error}${t.checkout.checkConsole}`);
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <div className="container-custom py-12">
            <h1 className="text-3xl font-bold mb-12 text-center">{t.checkout.title}</h1>

            <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
                {/* Form */}
                <div className="flex-1">
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                        <section>
                            <h2 className="text-xl font-bold mb-6">{t.checkout.orderInfo}</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.checkout.email} *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.checkout.name} *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder={t.checkout.namePlaceholder}
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-6">{t.checkout.paymentMethod}</h2>
                            <div id="payment-method" className="min-h-[300px]"></div>
                            {!isReady && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-gray-500">{t.checkout.loading}</div>
                                </div>
                            )}
                        </section>

                        <Button
                            type="submit"
                            disabled={isProcessing || !isReady}
                            className="w-full"
                        >
                            {isProcessing ? t.checkout.processing : `₩${getCartTotal().toLocaleString('ko-KR')} ${t.checkout.pay}`}
                        </Button>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="w-full lg:w-96">
                    <div className="bg-gray-50 p-8 sticky top-24 rounded-lg">
                        <h2 className="text-xl font-bold mb-6">{t.checkout.orderSummary}</h2>

                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 text-sm">
                                    <div className="w-16 h-16 bg-gray-200 shrink-0 rounded">
                                        <img src={item.image} alt={getProductName(item)} className="w-full h-full object-cover rounded" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{getProductName(item)}</p>
                                        <p className="text-gray-500">{t.checkout.qty}: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">₩{(item.price * item.quantity).toLocaleString('ko-KR')}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>{t.cart.subtotal}</span>
                                <span>₩{getCartTotal().toLocaleString('ko-KR')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>{t.cart.shipping}</span>
                                <span>{t.checkout.free}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl pt-2 border-t border-gray-200 mt-2">
                                <span>{t.cart.total}</span>
                                <span>₩{getCartTotal().toLocaleString('ko-KR')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
