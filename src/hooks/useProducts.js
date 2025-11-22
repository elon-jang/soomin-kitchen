import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { products as localProducts } from '../data/products';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                // Check if Supabase is configured
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

                if (!supabaseUrl || !supabaseKey) {
                    // Fallback to local data if Supabase is not configured
                    console.warn('Supabase not configured, using local data');
                    setProducts(localProducts);
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('id', { ascending: true });

                if (error) throw error;

                if (data && data.length > 0) {
                    // Transform data to match application structure
                    const transformedProducts = data.map(item => ({
                        id: item.id,
                        name: {
                            ko: item.name_ko,
                            en: item.name_en
                        },
                        price: item.price,
                        category: {
                            ko: item.category_ko,
                            en: item.category_en
                        },
                        image: item.image,
                        description: {
                            ko: item.description_ko,
                            en: item.description_en
                        },
                        isNew: item.is_new
                    }));
                    setProducts(transformedProducts);
                } else {
                    // Fallback to local data if table is empty
                    setProducts(localProducts);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err);
                // Fallback to local data on error
                setProducts(localProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};
