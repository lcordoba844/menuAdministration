import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

import { environment } from '@/config/environment';

function requireAuth(req: Request, res: Response, next: NextFunction): void {
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
}

export function Authenticated(): ReturnType<typeof OpenAPI> {
  const middleware = UseBefore(requireAuth) as ReturnType<typeof OpenAPI>;
  const documentation = OpenAPI({
    security: [{ bearerAuth: [] }],
    responses: {
      '401': {
        description: 'Bearer token is missing, invalid, or expired',
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
