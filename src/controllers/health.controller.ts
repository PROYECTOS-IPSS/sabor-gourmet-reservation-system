import type { NextFunction, Request, Response } from 'express';
import { checkDatabaseConnection } from '../models/health.model.js';

export async function health(_request: Request, response: Response, next: NextFunction) {
  try {
    await checkDatabaseConnection();
    response.json({ status: 'ok', service: 'sabor-gourmet-api', database: 'ok' });
  } catch (error) {
    next(error);
  }
}
