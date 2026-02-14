import React from 'react';
import Layout from '../components/Layout/Layout';
import Hero from '../components/UI/Hero';
import AboutSection from '../components/Sections/AboutSection';
import SignatureCollection from '../components/Sections/SignatureCollection';
import SustainabilitySection from '../components/Sections/SustainabilitySection';
import Newsletter from '../components/Sections/Newsletter';
import ValentineCountdownStrip from '../components/Sections/ValentineCountdownStrip';
import { usePageMeta } from '../hooks/usePageMeta';

const Home = () => {
    usePageMeta({
        title: 'Romazen | Elegance in Every Breath',
        description: 'Discover Romazen handcrafted candles, soaps, and home fragrances inspired by New York.'
    });

    return (
        <Layout>
            <ValentineCountdownStrip />
            <Hero />
            <AboutSection />
            <SignatureCollection />
            <SustainabilitySection />
            <Newsletter />
        </Layout>
    );
};

export default Home;
