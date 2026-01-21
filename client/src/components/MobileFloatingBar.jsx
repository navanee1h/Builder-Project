import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const MobileFloatingBar = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full z-50 md:hidden flex shadow-top-lg">
            <a
                href="tel:+919744702482"
                className="flex-1 bg-white text-primary border-t border-gray-200 py-4 flex items-center justify-center gap-2 font-bold active:bg-gray-50 transition"
            >
                <Phone size={20} className="text-secondary" />
                Call Now
            </a>
            <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex-1 bg-green-600 text-white py-4 flex items-center justify-center gap-2 font-bold active:bg-green-700 transition"
            >
                <MessageCircle size={20} />
                WhatsApp
            </button>
        </div>
    );
};

export default MobileFloatingBar;
