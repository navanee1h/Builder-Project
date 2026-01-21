import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MobileFloatingBar from './components/MobileFloatingBar';

const MainWebsite = () => {
    // Simple fade-in animation on scroll using Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section').forEach(section => {
            section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="font-sans text-gray-900 bg-gray-50 pb-16 md:pb-0">
            <Navbar />
            <main>
                <Hero />
                <Services />
                <WhyChooseUs />
                <Gallery />
                <Contact />
            </main>
            <Footer />
            <MobileFloatingBar />
        </div>
    );
};

export default MainWebsite;
