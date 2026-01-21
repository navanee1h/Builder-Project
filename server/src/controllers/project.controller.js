import Project from '../models/Project.model.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Admin)
export const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Seed projects (for initial setup)
// @route   POST /api/projects/seed
// @access  Public (should be protected in prod)
export const seedProjects = async (req, res) => {
    try {
        await Project.deleteMany({}); // Clear existing

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

        await Project.insertMany(projects);

        res.status(201).json({
            success: true,
            data: projects,
            message: "Projects seeded successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
