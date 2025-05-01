import express, {Express} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {testConnection} from './config/database';
import adminRouter from './app_admin/index';
import promotorRouter from './app_mobile/index';

dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));


// Routes
app.use('/retailink-api/admin', adminRouter);
app.use('/retailink-api/mobile', promotorRouter);


// Ruta de prueba
app.get('/', (_req, _res) => {
    _res.send('API is running...');
});

// Start server
const startServer = async () => {
    try {
        await testConnection(); // Test database connection
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API is accessible at http://localhost:${PORT}`);
            console.log(`Local network access: http://[TU_IP_LOCAL]:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();