import React from 'react';
import { Phone, MessageCircle, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Brand Info */}
                    <div>
                        <div className="text-2xl font-bold text-white mb-4">
                            ABC<span className="text-secondary">Builders</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Your trusted partner for all construction and home service needs. From foundation to finish, we build with quality and integrity.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Service Areas</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-secondary" /> Payyanur
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-secondary" /> Taliparamba
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-secondary" /> Kannur Town
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-secondary" /> Surrounding Areas
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Contact Us</h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="tel:+919744702482" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                                    <div className="p-2 bg-white/5 rounded-full text-secondary">
                                        <Phone size={18} />
                                    </div>
                                    <span>+91 97447 02482</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://wa.me/919744702482?text=Hi,%20I'm%20interested%20in%20your%20construction%20services." className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                                    <div className="p-2 bg-white/5 rounded-full text-green-500">
                                        <MessageCircle size={18} />
                                    </div>
                                    <span>Chat on WhatsApp</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} ABC Builders & Home Services. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
