import type { Request, Response, NextFunction } from 'express';
import { checkReservationAvailability, createCustomerReservation, cancelCustomerReservation, updateCustomerReservation, listUserReservations } from '../services/reservation.service.js';
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
    next(error);
  }
}

export async function listMyReservations(request: Request, response: Response, next: NextFunction) {
  try {
    const reservations = await listUserReservations(request.session.user!.id);
    response.set('Cache-Control', 'no-store');
    response.json({ reservations });
  } catch (error) {
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
    response.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
}

export async function cancelReservation(request: Request, response: Response, next: NextFunction) {
  try {
    const success = await cancelCustomerReservation(Number(request.params.id), request.session.user!.id);
    if (!success) {
      response.status(404).json({ message: 'Reserva no encontrada o no se puede cancelar.' });
      return;
    }
    response.json({ message: 'Reserva cancelada.' });
  } catch (error) {
    next(error);
  }
}

export async function updateReservation(request: Request, response: Response, next: NextFunction) {
  try {
    const reservation = await updateCustomerReservation(Number(request.params.id), request.session.user!.id, request.body as ReservationInput);
    if (!reservation) {
      response.status(409).json({ message: 'La mesa no está disponible para ese horario o la reserva ya no puede modificarse.' });
      return;
    }
    response.json(reservation);
  } catch (error) {
    next(error);
  }
}
