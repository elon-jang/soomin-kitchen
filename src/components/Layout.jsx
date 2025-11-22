import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { ScrollRestoration } from 'react-router-dom';
import CartSuccessModal from './CartSuccessModal';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <ScrollRestoration />
            <CartSuccessModal />
        </div>
    );
};

export default Layout;
