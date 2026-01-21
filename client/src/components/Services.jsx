import React from 'react';
import { Home, Wrench, Zap, Hammer, Paintbrush, Grid2X2 } from 'lucide-react';

const services = [
    {
        title: "New House Construction",
        description: "Complete home building services from foundation to finish.",
        icon: <Home className="w-8 h-8 text-white" />,
        color: "bg-blue-600"
    },
    {
        title: "Plumbing Works",
        description: "Expert plumbing repairs, installation, and maintenance.",
        icon: <Wrench className="w-8 h-8 text-white" />,
        color: "bg-cyan-500"
    },
    {
        title: "Electrical Works",
        description: "Safe and reliable electrical wiring and repairs.",
        icon: <Zap className="w-8 h-8 text-white" />,
        color: "bg-yellow-500"
    },
    {
        title: "Carpentry Works",
        description: "Custom furniture, doors, windows, and wood repairs.",
        icon: <Hammer className="w-8 h-8 text-white" />,
        color: "bg-amber-700"
    },
    {
        title: "Painting Works",
        description: "Interior and exterior painting with premium finish.",
        icon: <Paintbrush className="w-8 h-8 text-white" />,
        color: "bg-purple-500"
    },
    {
        title: "Tile & Renovation",
        description: "Floor tiling, bathroom renovation, and remodeling.",
        icon: <Grid2X2 className="w-8 h-8 text-white" />,
        color: "bg-emerald-500"
    }
];

const Services = () => {
    return (
        <section id="services" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Services</h2>
                    <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        We provide a comprehensive range of construction and home maintenance services tailored to your needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className={`${service.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                            <div className="h-1 w-0 bg-secondary group-hover:w-full transition-all duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
