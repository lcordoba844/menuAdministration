import "reflect-metadata";
import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import sequelize from './config/db';
import { setupSwagger } from './config/swagger';
import officeRoutes from './application/office/office.routes';
import authRoutes from './application/auth/auth.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/offices', officeRoutes);



const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        await sequelize.sync({ force: true });
        console.log('All models were synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();