import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

import { AuthPayload } from '@/application/auth/auth.dto';
import { environment } from '@/config/environment';
import User from '@/models/user.model';

export interface AuthenticatedRequest extends Request {
  auth: AuthPayload;
}

async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = req.header('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : undefined;

  if (!token) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
    return;
  }

  let payload: AuthPayload;
  try {
    payload = jwt.verify(token, environment.jwtSecret) as AuthPayload;
  } catch {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
    return;
  }

  if (typeof payload.userId !== 'string' || !payload.userId) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
    return;
  }

  try {
    const user = await User.findOne({
      where: { id: payload.userId, enabled: true },
      attributes: ['id', 'role'],
    });
    if (!user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    (req as AuthenticatedRequest).auth = {
      userId: user.id,
      role: user.role,
    };
  } catch (error) {
    next(error);
    return;
  }

  next();
}

export function Authenticated(): ReturnType<typeof OpenAPI> {
  const middleware = UseBefore(requireAuth) as ReturnType<typeof OpenAPI>;
  const documentation = OpenAPI({
    security: [{ bearerAuth: [] }],
    responses: {
      '401': {
        description:
          'Bearer token is missing, invalid, or expired, or the account is missing or disabled',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status', 'message'],
              properties: {
                status: { type: 'string', enum: ['error'] },
                message: { type: 'string', example: 'Unauthorized' },
              },
            },
          },
        },
      },
    },
  });

  return (...args): void => {
    middleware(...args);
    documentation(...args);
  };
}
