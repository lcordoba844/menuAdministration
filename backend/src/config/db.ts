import { IsNull, Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Office from '../models/Office';
import User from '../models/User';

dotenv.config();

if (!process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.DB_USER || !process.env.JWT_SECRET) {
    throw new Error("CRITICAL: Missing essential environment variables. Check your .env file.");
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        logging: false,
        models: [Office, User]
    }
);

export default sequelize;