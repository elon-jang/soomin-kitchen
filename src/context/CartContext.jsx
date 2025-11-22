import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const closeSuccessModal = () => setShowSuccessModal(false);

    // Load cart from database or localStorage
    useEffect(() => {
        const loadCart = async () => {
            setIsLoading(true);
            try {
                if (user) {
                    // Load from database for logged-in users
                    const { data, error } = await supabase
                        .from('cart_items')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: true });

                    if (error) throw error;

                    // Convert database format to cart format
                    const items = data.map(item => {
                        // Parse product name if it's a JSON string (multilingual)
                        let name = item.product_name;
                        try {
                            const parsed = JSON.parse(item.product_name);
                            if (typeof parsed === 'object') {
                                name = parsed;
                            }
                        } catch (e) {
                            // Not JSON, use as-is
                        }

                        return {
                            id: item.product_id,
                            name: name,
                            price: parseFloat(item.product_price),
                            image: item.product_image,
                            quantity: item.quantity
                        };
                    });

                    setCartItems(items);

                    // Sync to localStorage as backup
                    localStorage.setItem('cart', JSON.stringify(items));
                } else {
                    // Load from localStorage for non-logged-in users
                    try {
                        const localData = localStorage.getItem('cart');
                        setCartItems(localData ? JSON.parse(localData) : []);
                    } catch (error) {
                        console.error("Failed to parse cart data:", error);
                        setCartItems([]);
                    }
                }
            } catch (error) {
                console.error('Error loading cart:', error);
                // Fallback to localStorage
                try {
                    const localData = localStorage.getItem('cart');
                    setCartItems(localData ? JSON.parse(localData) : []);
                } catch (e) {
                    setCartItems([]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadCart();
    }, [user]);

    // Sync cart to localStorage
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoading]);

    const addToCart = async (product) => {
        try {
            const existingItem = cartItems.find(item => item.id === product.id);
            const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

            // Store product name as JSON string if it's an object (multilingual)
            const productName = typeof product.name === 'object'
                ? JSON.stringify(product.name)
                : product.name;

            if (user) {
                // Sync to database for logged-in users
                const { error } = await supabase
                    .from('cart_items')
                    .upsert({
                        user_id: user.id,
                        product_id: product.id,
                        product_name: productName,
                        product_price: product.price,
                        product_image: product.image,
                        quantity: newQuantity
                    }, {
                        onConflict: 'user_id,product_id'
                    });

                if (error) throw error;
            }

            // Update local state
            setCartItems(prevItems => {
                if (existingItem) {
                    return prevItems.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prevItems, { ...product, quantity: 1 }];
            });

            // Show success modal when item is added
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('장바구니에 추가하는 중 오류가 발생했습니다.');
        }
    };

    const removeFromCart = async (id) => {
        try {
            if (user) {
                // Remove from database for logged-in users
                const { error } = await supabase
                    .from('cart_items')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('product_id', id);

                if (error) throw error;
            }

            // Update local state
            setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing from cart:', error);
            alert('장바구니에서 삭제하는 중 오류가 발생했습니다.');
        }
    };

    const updateQuantity = async (id, quantity) => {
        if (quantity < 1) return;

        try {
            if (user) {
                // Update database for logged-in users
                const { error } = await supabase
                    .from('cart_items')
                    .update({ quantity })
                    .eq('user_id', user.id)
                    .eq('product_id', id);

                if (error) throw error;
            }

            // Update local state
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === id ? { ...item, quantity } : item
                )
            );
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('수량을 업데이트하는 중 오류가 발생했습니다.');
        }
    };

    const clearCart = async () => {
        try {
            if (user) {
                // Clear database for logged-in users
                const { error } = await supabase
                    .from('cart_items')
                    .delete()
                    .eq('user_id', user.id);

                if (error) throw error;
            }

            // Clear local state
            setCartItems([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
            // Clear local state anyway
            setCartItems([]);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            isLoading,
            showSuccessModal,
            closeSuccessModal
        }}>
            {children}
        </CartContext.Provider>
    );
};
