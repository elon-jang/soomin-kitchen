import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';
import Button from '../components/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { language } = useLanguage();
    const t = useTranslation(language);
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);

    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    useEffect(() => {
        const confirmPayment = async () => {
            if (!paymentKey || !orderId || !amount) {
                setError(t.payment.invalidPaymentInfo);
                setIsProcessing(false);
                return;
            }

            try {
                // 토스페이먼츠 결제 승인 API 호출
                const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${btoa(import.meta.env.VITE_TOSS_SECRET_KEY + ':')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        paymentKey,
                        orderId,
                        amount: parseInt(amount)
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || t.payment.approvalFailed);
                }

                const paymentData = await response.json();
                setPaymentInfo(paymentData);

                // Supabase에서 주문 상태 업데이트
                const { error: updateError } = await supabase
                    .from('orders')
                    .update({
                        payment_key: paymentKey,
                        status: 'PAID',
                        payment_method: paymentData.method,
                        paid_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('order_id', orderId);

                if (updateError) throw updateError;

                // 장바구니 비우기
                clearCart();
                setIsProcessing(false);

            } catch (error) {
                console.error('Payment confirmation error:', error);
                setError(error.message || t.payment.processingError);
                setIsProcessing(false);
            }
        };

        confirmPayment();
    }, [paymentKey, orderId, amount, clearCart]);

    if (isProcessing) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-lg text-gray-700">{t.payment.processing}</p>
                    <p className="text-sm text-gray-500 mt-2">{t.payment.wait}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <span className="text-2xl">❌</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.payment.processingFailed}</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => navigate('/cart')}
                            variant="outline"
                            className="flex-1"
                        >
                            {t.payment.toCart}
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            className="flex-1"
                        >
                            {t.payment.toHome}
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
                        >
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.payment.success}</h1>
                        <p className="text-gray-600">{t.payment.successMessage}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-semibold mb-4">{t.payment.paymentInfo}</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t.payment.orderNumber}</span>
                                <span className="font-medium">{orderId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t.payment.amount}</span>
                                <span className="font-bold text-lg">₩{parseInt(amount).toLocaleString('ko-KR')}</span>
                            </div>
                            {paymentInfo && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t.payment.method}</span>
                                        <span className="font-medium">{paymentInfo.method}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t.payment.time}</span>
                                        <span className="font-medium">
                                            {new Date(paymentInfo.approvedAt).toLocaleString('ko-KR')}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <p className="text-sm text-blue-800">
                            <strong>{t.payment.notice}:</strong> {t.payment.emailSent}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                            className="flex-1"
                        >
                            {t.payment.continueShopping}
                        </Button>
                        <Button
                            onClick={() => navigate('/order-success')}
                            className="flex-1"
                        >
                            {t.payment.viewOrder}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
