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
        title: 'RomaZen | Six Gardenia & Jasmine Candle Forms',
        description: 'Discover RomaZen sculptural soy candles in two intimate and four architectural glass forms, scented with luminous gardenia and soft jasmine.'
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
