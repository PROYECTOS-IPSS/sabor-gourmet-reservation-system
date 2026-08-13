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

export function validateParams<T extends z.ZodType>(schema: T, message: string) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.params);

    if (!result.success) {
      response.status(400).json({
        errors: result.error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
        message,
      });
      return;
    }

    request.params = result.data as typeof request.params;
    next();
  };
}

export function validateQuery<T extends z.ZodType>(schema: T, message: string) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.query);

    if (!result.success) {
      response.status(400).json({
        errors: result.error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
        message,
      });
      return;
    }

    const parsedQuery = result.data as Record<string, unknown>;
    const requestQuery = request.query as Record<string, unknown>;
    for (const key of Object.keys(requestQuery)) {
      if (!(key in parsedQuery)) delete requestQuery[key];
    }
    Object.assign(requestQuery, parsedQuery);
    next();
  };
}
