import express, {Express} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import {testConnection} from './config/database';
import adminRouter from './app_admin/index';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Routes
app.use('/retailink-api/admin', adminRouter);


// Ruta de prueba
app.get('/', (_req, _res) => {
    _res.send('API is running...');
});

// Start server
const startServer = async () => {
    try {
        await testConnection(); // Test database connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();