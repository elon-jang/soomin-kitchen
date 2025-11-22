import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, XCircle } from 'lucide-react';
import Button from '../components/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';

const PaymentFail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = useTranslation(language);

    const errorCode = searchParams.get('code');
    const errorMessage = searchParams.get('message');
    const orderId = searchParams.get('orderId');

    const getErrorTitle = () => {
        switch (errorCode) {
            case 'PAY_PROCESS_CANCELED':
                return t.payment.paymentCanceled;
            case 'PAY_PROCESS_ABORTED':
                return t.payment.paymentAborted;
            case 'REJECT_CARD_COMPANY':
                return t.payment.rejectedByCard;
            default:
                return t.payment.failed;
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring' }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6"
                        >
                            <XCircle className="w-12 h-12 text-red-600" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{getErrorTitle()}</h1>
                        <p className="text-gray-600">{t.payment.failedMessage}</p>
                    </div>

                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-900 mb-1">{t.payment.errorDetail}</p>
                                <p className="text-sm text-red-800">{errorMessage}</p>
                                {errorCode && (
                                    <p className="text-xs text-red-700 mt-2">{t.payment.errorCode}: {errorCode}</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {orderId && (
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{t.payment.orderNumber}</span>
                                <span className="font-medium text-gray-900">{orderId}</span>
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <p className="text-sm text-blue-800">
                            <strong>{t.payment.notice}:</strong> {t.payment.failReasons}
                        </p>
                        <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc space-y-1">
                            <li>{t.payment.cardLimit}</li>
                            <li>{t.payment.wrongInfo}</li>
                            <li>{t.payment.blockedInternational}</li>
                            <li>{t.payment.networkError}</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={() => navigate('/checkout')}
                            className="w-full"
                        >
                            {t.payment.retryPayment}
                        </Button>
                        <Button
                            onClick={() => navigate('/cart')}
                            variant="outline"
                            className="w-full"
                        >
                            {t.payment.backToCart}
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            variant="ghost"
                            className="w-full"
                        >
                            {t.payment.goHome}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentFail;
