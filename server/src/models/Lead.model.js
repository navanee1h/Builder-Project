import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    serviceType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    source: {
        type: String,
        enum: ['website', 'whatsapp'],
        default: 'website'
    },
    status: {
        type: String,
        enum: ['new', 'assigned', 'contacted', 'closed'],
        default: 'new'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    notifiedAt: {
        type: Date
    },
    contactedAt: {
        type: Date
    },
    closedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
