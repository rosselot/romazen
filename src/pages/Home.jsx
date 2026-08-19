import React from 'react';
import Layout from '../components/Layout/Layout';
import Hero from '../components/UI/Hero';
import AboutSection from '../components/Sections/AboutSection';
import SignatureCollection from '../components/Sections/SignatureCollection';
import SustainabilitySection from '../components/Sections/SustainabilitySection';
import Newsletter from '../components/Sections/Newsletter';
import { usePageMeta } from '../hooks/usePageMeta';

const Home = () => {
    usePageMeta({
        title: 'RomaZen | Chilean Candle Craft, Hand-Poured in New York',
        description: 'Discover RomaZen sculptural soy candles: a Chilean candle-making craft, now hand-poured in New York in six Gardenia & Jasmine glass forms.'
    });

    return (
        <Layout>
            <Hero />
            <AboutSection />
            <SignatureCollection />
            <SustainabilitySection />
            <Newsletter />
        </Layout>
    );
};

export default Home;
