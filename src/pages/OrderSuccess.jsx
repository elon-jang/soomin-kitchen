import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
    return (
        <div className="container-custom py-24 text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Thank you for your purchase. Your order has been received and is being processed. You will receive an email confirmation shortly.
            </p>
            <div className="flex justify-center gap-4">
                <Link to="/">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
