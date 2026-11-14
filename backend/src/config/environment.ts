import { config } from 'dotenv';

const result = config({ quiet: true });

function missingEnv(): never {
  process.stderr.write('Missing env variables.');
  process.exit(1);
}

if (result.error) {
  missingEnv();
}

function required(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) {
    missingEnv();
  }
  return value;
}

export const environment = {
  port: Number(required('PORT')),
  frontendOrigin: required('FRONTEND_ORIGIN'),
  nodeEnv: required('NODE_ENV'),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: required('JWT_EXPIRES_IN'),
};

export const isDevelopment = (): boolean =>
  environment.nodeEnv === 'development';
export const isProduction = (): boolean => environment.nodeEnv === 'production';
