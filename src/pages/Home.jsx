import React from 'react';
import Layout from '../components/Layout/Layout';
import Hero from '../components/UI/Hero';
import AboutSection from '../components/Sections/AboutSection';
import SignatureCollection from '../components/Sections/SignatureCollection';
import SustainabilitySection from '../components/Sections/SustainabilitySection';
import Newsletter from '../components/Sections/Newsletter';

const Home = () => {
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
