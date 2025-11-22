import React, { useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';
import { Loader } from 'lucide-react';

const Home = () => {
    const { language } = useLanguage();
    const t = useTranslation(language);
    const { products, loading } = useProducts();
    const productsSectionRef = useRef(null);

    const scrollToProducts = () => {
        if (productsSectionRef.current) {
            productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] bg-gray-900 text-white flex items-center justify-center overflow-hidden mb-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1580651315530-69c8e0026377?auto=format&fit=crop&w=2000&q=80"
                        alt="Korean Food Spread"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>
                <div className="relative z-10 text-center max-w-3xl px-4">
                    <span className="block text-accent font-bold tracking-widest uppercase mb-4 animate-fade-in-up">
                        {t.home.heroTag}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight animate-fade-in-up animation-delay-100">
                        {t.home.heroTitle} <br /> {t.home.heroTitleLine2}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                        {t.home.heroDescription}
                    </p>
                    <div className="animate-fade-in-up animation-delay-300">
                        <Button
                            onClick={scrollToProducts}
                            variant="primary"
                            className="bg-white text-primary hover:bg-gray-200 border-none font-bold"
                        >
                            {t.home.shopNow}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section ref={productsSectionRef} className="container-custom">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{t.home.featuredTitle}</h2>
                        <p className="text-gray-500">{t.home.featuredSubtitle}</p>
                    </div>
                    <a href="#" className="text-sm font-medium border-b border-black pb-1 hover:text-accent hover:border-accent transition-colors hidden md:block">
                        {t.home.viewAllProducts}
                    </a>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader className="w-10 h-10 text-accent animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center md:hidden">
                    <Button variant="secondary">{t.home.viewAllProducts}</Button>
                </div>
            </section>


        </div>
    );
};

export default Home;
