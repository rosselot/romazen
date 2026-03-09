import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import SignatureCollection from '../components/Sections/SignatureCollection';
import { PRODUCTS } from '../data/products';
import { usePageMeta } from '../hooks/usePageMeta';
import { supabase } from '../utils/supabase';

const CollectionPage = ({
    metaTitle,
    metaDescription,
    eyebrow,
    heading,
    subheading,
    filterFn
}) => {
    const [candles, setCandles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCandles = async () => {
            if (!supabase) {
                console.error('Supabase client is not initialized.');
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('candles')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (error) throw error;
                
                // Format the Supabase data to match the expected format for products
                const formattedCandles = data.map(candle => ({
                    id: candle.id,
                    name: candle.name,
                    category: 'Luxury Soy Candles',
                    price: `$${candle.price.toFixed(2)}`,
                    description: candle.description,
                    notes: candle.scent_notes,
                    image: candle.image_url,
                    inStock: candle.in_stock,
                    isCandle: true // Special flag for CTA logic
                }));
                
                setCandles(formattedCandles);
            } catch (error) {
                console.error('Error fetching candles:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCandles();
    }, []);

    // Merge Supabase candles exactly before Local Products, then apply the filter 
    const allProducts = [...candles, ...PRODUCTS];
    const displayedProducts = filterFn ? allProducts.filter((p) => filterFn(p)) : allProducts;

    usePageMeta({
        title: metaTitle,
        description: metaDescription
    });

    return (
        <Layout>
            <SignatureCollection
                products={displayedProducts}
                eyebrow={eyebrow}
                heading={heading}
                subheading={subheading}
                showFooterCta={false}
                isLoading={isLoading}
            />
        </Layout>
    );
};

export default CollectionPage;
