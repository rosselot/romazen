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
    const displayedProducts = filterFn ? PRODUCTS.filter((p) => filterFn(p)) : PRODUCTS;

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
                isLoading={false}
            />
        </Layout>
    );
};

export default CollectionPage;
