import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.model.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminExists = await Admin.findOne({ email: 'admin@builder.com' });

        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const admin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@builder.com',
            password: 'password123', // Model will hash this
            role: 'admin'
        });

        console.log('Admin created successfully');
        console.log('Email: admin@builder.com');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
