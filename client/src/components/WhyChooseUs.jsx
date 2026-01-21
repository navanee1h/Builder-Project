import React from 'react';
import { Award, Users, ShieldCheck, Clock } from 'lucide-react';

const features = [
    {
        icon: <Award className="w-10 h-10 text-secondary" />,
        title: "10+ Years Experience",
        description: "Decades of expertise in delivering top-notch construction and maintenance solutions."
    },
    {
        icon: <Users className="w-10 h-10 text-secondary" />,
        title: "Trusted Professionals",
        description: "Our team consists of verified, skilled, and locally trusted experts."
    },
    {
        icon: <ShieldCheck className="w-10 h-10 text-secondary" />,
        title: "Quality Workmanship",
        description: "We use premium materials and ensure the highest standards in every project."
    },
    {
        icon: <Clock className="w-10 h-10 text-secondary" />,
        title: "Timely Completion",
        description: "We understand the value of time and ensure projects are delivered on schedule."
    }
];

const WhyChooseUs = () => {
    return (
        <section id="why-us" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Choose Us?</h2>
                    <div className="w-20 h-1 bg-secondary mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
                            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
