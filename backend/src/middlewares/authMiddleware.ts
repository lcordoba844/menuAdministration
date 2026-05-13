import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ status: 'error', message: 'Access Denied. No token provided.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ status: 'error', message: 'Malformed token.' });
        return;
    }
    
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is missing");
        
        const decodedPayload = jwt.verify(token, secret);

        req.user = decodedPayload;

        next();
    } catch (error) {
        res.status(403).json({ status: 'error', message: 'Invalid or Expired Token.' });
        return;
    }
};