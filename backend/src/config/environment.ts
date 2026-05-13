import { config } from 'dotenv';

config();

export const environment = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
};

export const isDevelopment = (): boolean =>
  environment.nodeEnv === 'development';
export const isProduction = (): boolean => environment.nodeEnv === 'production';
