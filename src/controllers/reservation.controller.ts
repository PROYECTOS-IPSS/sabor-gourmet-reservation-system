import type { Request, Response, NextFunction } from 'express';
import { checkReservationAvailability } from '../services/reservation.service.js';
import type { ReservationInput } from '../schemas/reservation.schemas.js';

export async function checkAvailability(request: Request, response: Response, next: NextFunction) {
  try {
    const result = await checkReservationAvailability(request.body as ReservationInput);
    response.json({
      available: result.available,
      table: result.table ? { number: result.table.number, capacity: result.table.capacity } : null,
      date: result.date,
      startTime: result.startTime,
      endTime: result.endTime,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
