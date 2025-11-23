import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, Search, User, LogOut, Languages } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';

const Header = () => {
    const { getCartCount } = useCart();
    const { user, signOut } = useAuth();
    const { language, toggleLanguage } = useLanguage();
    const t = useTranslation(language);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-md border-b border-gray-100">
            <div className="container-custom h-20 flex items-center justify-between">
                {/* Mobile Menu & Search (Left) */}
                <div className="flex items-center gap-4 md:hidden">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Logo (Center on mobile, Left on desktop) */}
                <Link to="/" className="text-2xl font-bold tracking-tighter font-sans">
                    SOOMIN's KITCHEN
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    <Link to="/" className="text-sm font-medium hover:text-accent transition-colors uppercase">{t.header.shop}</Link>
                    <Link to="/" className="text-sm font-medium hover:text-accent transition-colors uppercase">{t.header.bestSellers}</Link>
                    <Link to="/" className="text-sm font-medium hover:text-accent transition-colors uppercase">{t.header.about}</Link>
                </nav>

                {/* Actions (Right) */}
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full hidden md:block">
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        title={language === 'ko' ? 'Switch to English' : '한국어로 변경'}
                    >
                        <Languages className="w-4 h-4" />
                        <span className="text-sm font-medium">{language === 'ko' ? 'EN' : 'KO'}</span>
                    </button>

                    {user ? (
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                                <User className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">{user.email}</span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-2 hover:bg-red-50 rounded-full group"
                                title={t.header.logout}
                            >
                                <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-accent transition-colors"
                        >
                            {t.header.login}
                        </Link>
                    )}

                    <Link
                        to="/cart"
                        className="relative p-2 hover:bg-gray-100 rounded-full group"
                    >
                        <ShoppingBag className="w-5 h-5 group-hover:text-accent transition-colors" />
                        {getCartCount() > 0 && (
                            <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
