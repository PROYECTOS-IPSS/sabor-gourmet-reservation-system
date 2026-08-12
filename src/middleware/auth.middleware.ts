import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../generated/prisma/enums.js';

export function requireSession(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (!request.session.user) {
    response.status(401).json({ message: 'No has iniciado sesión.' });
    return;
  }

  next();
}

export function requireRoles(...roles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.session.user) {
      response.status(401).json({ message: 'No has iniciado sesión.' });
      return;
    }

    if (!roles.includes(request.session.user.role)) {
      response
        .status(403)
        .json({ message: 'No tienes permisos para acceder.' });
      return;
    }

    next();
  };
}
