import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            res.status(400).json({ status: 'error', message: 'Username already in use' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: { id: newUser.id, username: newUser.username }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            res.status(401).json({ status: 'error', message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ status: 'error', message: 'Invalid credentials' });
            return;
        }

        const payload = {
            id: user.id,
            email: user.username,
        };

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is missing");

        const token = jwt.sign(payload, secret, { expiresIn: '24h' });

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token: token,
            user: payload
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};