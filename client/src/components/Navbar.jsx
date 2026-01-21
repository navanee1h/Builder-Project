import React, { useState } from 'react';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false);
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold text-primary cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                    ABC<span className="text-secondary">Builders</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 items-center">
                    <button onClick={() => scrollToSection('services')} className="hover:text-secondary font-medium transition">Services</button>
                    <button onClick={() => scrollToSection('why-us')} className="hover:text-secondary font-medium transition">Why Us</button>
                    <button onClick={() => scrollToSection('gallery')} className="hover:text-secondary font-medium transition">Gallery</button>
                    <button onClick={() => scrollToSection('contact')} className="hover:text-secondary font-medium transition">Contact</button>
                    <a href="tel:+919744702482" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition">
                        <Phone size={18} /> Call Now
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-primary hover:text-secondary">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="flex flex-col p-4 space-y-4">
                        <button onClick={() => scrollToSection('services')} className="text-left font-medium hover:text-secondary">Services</button>
                        <button onClick={() => scrollToSection('why-us')} className="text-left font-medium hover:text-secondary">Why Choose Us</button>
                        <button onClick={() => scrollToSection('gallery')} className="text-left font-medium hover:text-secondary">Gallery</button>
                        <button onClick={() => scrollToSection('contact')} className="text-left font-medium hover:text-secondary">Contact</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
