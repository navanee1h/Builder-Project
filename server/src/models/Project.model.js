import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    gallery: [{
        type: String
    }]
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
