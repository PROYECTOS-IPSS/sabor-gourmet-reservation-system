import type { ErrorRequestHandler } from 'express';

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next;
  console.error(error);
  response.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
};
