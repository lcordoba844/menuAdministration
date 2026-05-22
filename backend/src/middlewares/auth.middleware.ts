import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { environment } from '@/config/environment';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authorization = req.header('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : undefined;

  if (!token) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
    return;
  }

  try {
    jwt.verify(token, environment.jwtSecret);
    next();
  } catch {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
};
