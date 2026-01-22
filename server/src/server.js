import app from './app.js';
import connectDB from './config/db.js';
import { config } from './config/env.js';
import cors from "cors";

// Connect to Database
connectDB();

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

app.use(cors({
    origin: [
        "https://builders-fhx3.onrender.com",
        "https://builder-admin.onrender.com"
    ]
}));
