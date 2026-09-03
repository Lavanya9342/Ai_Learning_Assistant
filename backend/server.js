import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import dns from 'dns';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import progressRoutes from './routes/progressRoutes.js'



dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

// Force Node to use public DNS servers for SRV resolution if the local resolver refuses.
dns.setServers(['8.8.8.8', '8.8.4.4']);

// ES6 module__dirname alternative 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


console.log("JWT_SECRET =>", process.env.JWT_SECRET);

//Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to handle CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routes 
app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/flashcards', flashcardRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/progress', progressRoutes)

app.use(errorHandler);

// 404 handler 
app.use((req, res)=> {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        statusCode: 404
    });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});