import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const projects = [
    {
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Modern Villa",
        category: "Construction",
        gallery: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600596542815-2495db98dada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        image: "https://images.unsplash.com/photo-1581094794329-8a1181169a59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Industrial Plumbing",
        category: "Plumbing",
        gallery: [
            "https://images.unsplash.com/photo-1581094794329-8a1181169a59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Electrical Wiring",
        category: "Electrical",
        gallery: [
            "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1565608447538-ca2c747ac663?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Renovation",
        category: "Renovation",
        gallery: [
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        image: "https://images.unsplash.com/photo-1562259949-e8e6003a6408?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Interior Painting",
        category: "Painting",
        gallery: [
            "https://images.unsplash.com/photo-1562259949-e8e6003a6408?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1563461660947-507ef49e9c47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Custom Carpentry",
        category: "Carpentry",
        gallery: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1610534582806-03c6210f9a26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    }
];

const Gallery = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    // Disable scrolling when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedProject]);

    return (
        <section id="gallery" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Completed Works</h2>
                    <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    <p className="mt-4 text-gray-600">A glimpse into our recent projects and quality craftsmanship.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedProject(project)}
                            className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                                <h3 className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.title}</h3>
                                <span className="text-secondary font-medium mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{project.category}</span>
                                <span className="text-white/80 text-sm mt-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">View Project Gallery</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Project Modal */}
            {selectedProject && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10 sticky top-0">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-primary">{selectedProject.title}</h3>
                                <p className="text-secondary text-sm md:text-base font-medium">{selectedProject.category}</p>
                            </div>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <X className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />
                            </button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="overflow-y-auto p-4 md:p-6 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedProject.gallery.map((img, idx) => (
                                    <div key={idx} className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100">
                                        <img
                                            src={img}
                                            alt={`${selectedProject.title} ${idx + 1}`}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Backdrop Click to Close */}
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={() => setSelectedProject(null)}
                    ></div>
                </div>,
                document.body
            )}
        </section>
    );
};

export default Gallery;
