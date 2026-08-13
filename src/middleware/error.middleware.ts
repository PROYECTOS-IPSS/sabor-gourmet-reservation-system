import type { ErrorRequestHandler } from 'express';
import { env } from '../config/env.js';

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next;
  console.error(error);
  const details = env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined;
  response.status(500).json({ error: 'Internal server error', ...(details ? { details } : {}) });
};
