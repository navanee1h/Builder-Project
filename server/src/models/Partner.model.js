import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String, // e.g., 'Plumber', 'Electrician'
        required: true,
        default: 'Service Provider'
    },
    services: [{
        type: String // e.g., 'Plumbing', 'Electrical'
    }],
    areas: [{
        type: String // e.g., 'Kannur', 'Payyanur'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;
