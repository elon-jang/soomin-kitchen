import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div>
                        <h3 className="text-xl font-bold mb-6 tracking-tighter">SOOMIN's KICHEN</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Bringing the authentic taste of Korea to your doorstep. Premium ingredients, traditional recipes, and modern convenience.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Stay Connected</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                        <p className="text-xs text-gray-500">
                            Subscribe to our newsletter for exclusive offers.
                        </p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        © 2024 SOOMIN's KICHEN. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <span className="text-xs text-gray-500">Terms</span>
                        <span className="text-xs text-gray-500">Privacy</span>
                        <span className="text-xs text-gray-500">Cookies</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
