import type { Request, Response, NextFunction } from 'express';
import { findReservationsByUserId } from '../models/reservation.model.js';
import { checkReservationAvailability, createCustomerReservation, cancelCustomerReservation, updateCustomerReservation } from '../services/reservation.service.js';
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

export async function createReservation(request: Request, response: Response, next: NextFunction) {
  try {
    const reservation = await createCustomerReservation(request.session.user!.id, request.body as ReservationInput);
    if (!reservation) {
      response.status(409).json({ message: 'La mesa no está disponible para ese horario.' });
      return;
    }
    response.status(201).json({ reservation });
  } catch (error) {
    next(error);
  }
}

export async function listMyReservations(request: Request, response: Response, next: NextFunction) {
  try {
    const reservations = await findReservationsByUserId(request.session.user!.id);
    response.json({ reservations });
  } catch (error) {
    next(error);
  }
}

export async function cancelReservation(request: Request, response: Response, next: NextFunction) {
  try {
    const cancelled = await cancelCustomerReservation(Number(request.params.id), request.session.user!.id);
    if (!cancelled) return response.status(409).json({ message: 'La reserva no puede cancelarse.' });
    response.json({ message: 'Reserva cancelada.' });
  } catch (error) { next(error); }
}

export async function updateReservation(request: Request, response: Response, next: NextFunction) {
  try {
    const reservation = await updateCustomerReservation(Number(request.params.id), request.session.user!.id, request.body as ReservationInput);
    if (!reservation) return response.status(409).json({ message: 'La mesa no está disponible para ese horario.' });
    response.json({ reservation });
  } catch (error) { next(error); }
}
