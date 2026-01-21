import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV || 'development',
    whatsapp: {
        url: process.env.WHATSAPP_API_URL,
        key: process.env.WHATSAPP_API_KEY
    }
};
