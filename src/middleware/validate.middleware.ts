import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';

export function validateBody<T extends z.ZodType>(schema: T, message: string) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      response.status(400).json({
        errors: result.error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
        message,
      });
      return;
    }

    request.body = result.data;
    next();
  };
}
