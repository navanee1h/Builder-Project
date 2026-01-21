import React from 'react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-20 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-4 text-center z-10 relative">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 leading-tight">
                    ABC Builders & <span className="text-secondary">Home Services</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-medium">
                    Construction | Plumbing | Electrical | Carpentry | Renovation
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                    <a href="tel:+919744702482"
                        className="flex items-center justify-center gap-2 bg-secondary hover:bg-orange-600 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:-translate-y-1">
                        <Phone className="w-5 h-5" />
                        Call Now
                    </a>
                    <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:-translate-y-1">
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm md:text-base bg-white inline-flex py-2 px-6 rounded-full shadow-sm">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>Serving: Payyanur | Kanhangad | Cheruvathur | Kasargod</span>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-10 right-10 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>
        </section>
    );
};

export default Hero;
