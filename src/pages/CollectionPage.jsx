import React from 'react';
import Layout from '../components/Layout/Layout';
import SignatureCollection from '../components/Sections/SignatureCollection';
import { PRODUCTS } from '../data/products';
import { usePageMeta } from '../hooks/usePageMeta';

const CollectionPage = ({
    metaTitle,
    metaDescription,
    eyebrow,
    heading,
    subheading,
    filterFn
}) => {
    const products = filterFn ? PRODUCTS.filter(filterFn) : PRODUCTS;

    usePageMeta({
        title: metaTitle,
        description: metaDescription
    });

    return (
        <Layout>
            <SignatureCollection
                products={products}
                eyebrow={eyebrow}
                heading={heading}
                subheading={subheading}
                showFooterCta={false}
            />
        </Layout>
    );
};

export default CollectionPage;
